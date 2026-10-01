"""
Plant and Crop Leaf Validation Service.
Implements out-of-distribution (OOD) validation, image quality checks, human/face detection,
and deep neural feature classification (MobileNetV2) to verify if an uploaded image
genuinely contains a crop or plant leaf before running disease classification.
"""
import os
import json
import logging
from typing import Dict, Any, Tuple
import cv2
import numpy as np
from PIL import Image

logger = logging.getLogger("agri_plant_validator")

class PlantLeafValidator:
    _instance = None

    def __init__(self):
        self.mobilenet_model = None
        self.torch_mobilenet = None
        self.torch_transforms = None
        self.imagenet_classes = {}
        self.botanical_indices = set()
        self.non_plant_indices = set()
        self.face_cascade = None
        self.profile_cascade = None
        self._initialize_models()

    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance

    def _initialize_models(self):
        """Loads OpenCV Haar cascades and pretrained MobileNetV2 for deep image validation."""
        # 1. OpenCV Haar Cascades for Human/Person/Face detection
        try:
            face_path = os.path.join(cv2.data.haarcascades, 'haarcascade_frontalface_default.xml')
            profile_path = os.path.join(cv2.data.haarcascades, 'haarcascade_profileface.xml')

            if os.path.exists(face_path):
                self.face_cascade = cv2.CascadeClassifier(face_path)
            if os.path.exists(profile_path):
                self.profile_cascade = cv2.CascadeClassifier(profile_path)
            logger.info("Loaded OpenCV human face cascades.")
        except Exception as e:
            logger.warning(f"Error loading OpenCV cascades: {e}")

        # 2. ImageNet Class Mapping
        try:
            local_idx_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'data', 'imagenet_class_index.json')
            if os.path.exists(local_idx_path):
                with open(local_idx_path, 'r', encoding='utf-8') as f:
                    self.imagenet_classes = json.load(f)
            else:
                self.imagenet_classes = {}

            botanical_keywords = {
                'daisy', 'sunflower', 'lady\'s_slipper', 'pot', 'potter\'s_wheel', 'artichoke',
                'cardoon', 'mushroom', 'agaric', 'gyromitra', 'stinkhorn', 'earthstar', 'puffball',
                'cabbage', 'broccoli', 'cauliflower', 'zucchini', 'squash', 'cucumber', 'pepper',
                'corn', 'ear', 'acorn', 'rose', 'hay', 'custard_apple', 'fig', 'jackfruit',
                'lemon', 'orange', 'strawberry', 'pomegranate', 'banana', 'pineapple', 'rapeseed',
                'leaf', 'tree', 'flower', 'plant', 'grass', 'vine', 'buckeye', 'hip'
            }

            non_plant_keywords = {
                'suit', 'jersey', 'groom', 'wig', 'sunglasses', 'trench_coat', 'lab_coat', 'pajamas',
                'jean', 'cardigan', 'sweatshirt', 'bow_tie', 'sombrero', 'cowboy_hat', 'military_uniform',
                'scuba_diver', 'bikini', 'swimming_cap', 'academic_gown', 'neck_brace', 'fur_coat',
                'dog', 'cat', 'car', 'truck', 'bus', 'airplane', 'bicycle', 'motorcycle', 'boat',
                'laptop', 'computer', 'screen', 'monitor', 'cellular_telephone', 'television', 'mouse',
                'chair', 'table', 'desk', 'sofa', 'couch', 'bed', 'toilet', 'refrigerator', 'microwave',
                'church', 'palace', 'castle', 'bridge', 'tower', 'building', 'barn', 'monument',
                'pizza', 'cheeseburger', 'hotdog', 'bagel', 'pretzel', 'ice_cream', 'espresso',
                'shoe', 'boot', 'sandal', 'sock', 'backpack', 'purse', 'wallet', 'umbrella'
            }

            for idx_str, v in self.imagenet_classes.items():
                idx = int(idx_str)
                name = v[1].lower()
                if any(w in name for w in botanical_keywords):
                    self.botanical_indices.add(idx)
                elif any(w in name for w in non_plant_keywords):
                    self.non_plant_indices.add(idx)

            logger.info(
                f"ImageNet mapping loaded: {len(self.botanical_indices)} botanical, "
                f"{len(self.non_plant_indices)} non-plant categories."
            )
        except Exception as e_map:
            logger.warning(f"Error loading ImageNet class mapping: {e_map}")

        # 3. Pretrained MobileNetV2 (prefer PyTorch/Torchvision, fallback to TensorFlow)
        try:
            import torchvision.models as tv_models
            import torchvision.transforms as tv_transforms
            logger.info("Initializing PyTorch torchvision MobileNetV2 for out-of-distribution leaf validation...")
            self.torch_mobilenet = tv_models.mobilenet_v2(weights=tv_models.MobileNet_V2_Weights.DEFAULT)
            self.torch_mobilenet.eval()
            self.torch_transforms = tv_transforms.Compose([
                tv_transforms.Resize((224, 224)),
                tv_transforms.ToTensor(),
                tv_transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
            ])
            logger.info("Torchvision MobileNetV2 initialized successfully.")
        except Exception as e_torch:
            logger.info(f"Torchvision MobileNetV2 not initialized: {e_torch}")
            try:
                import tensorflow as tf
                logger.info("Falling back to TensorFlow MobileNetV2...")
                self.mobilenet_model = tf.keras.applications.MobileNetV2(
                    weights='imagenet',
                    include_top=True
                )
                logger.info("TensorFlow MobileNetV2 loaded.")
            except Exception as e_tf:
                logger.info("MobileNetV2 classifier optional; relying on OpenCV & color signatures.")

    def validate_image_quality(self, pil_image: Image.Image) -> Tuple[bool, str, str]:
        """
        Stage 1: Checks dimensions, blankness, underexposure, overexposure, and blurriness.
        Returns: (passed, error_code, user_message)
        """
        width, height = pil_image.size
        if width < 64 or height < 64:
            return False, "INVALID_IMAGE", f"Image resolution ({width}x{height}) is too low for disease detection."

        cv_img = cv2.cvtColor(np.array(pil_image), cv2.COLOR_RGB2BGR)

        # 1. Blank / uniform color check
        std_dev = float(np.std(cv_img))
        if std_dev < 10.0:
            return False, "INVALID_IMAGE", "Image appears completely blank or uniform. Please upload a clear leaf image."

        # 2. Luminance check
        gray = cv2.cvtColor(cv_img, cv2.COLOR_BGR2GRAY)
        mean_lum = float(np.mean(gray))
        if mean_lum < 18.0:
            return False, "INVALID_IMAGE", "Image is too dark / underexposed. Leaf structures cannot be analyzed."
        if mean_lum > 250.0:
            return False, "INVALID_IMAGE", "Image is overexposed or washed out. Please upload a properly exposed photo."

        # 3. Blurriness check via Laplacian variance
        lap_var = float(cv2.Laplacian(gray, cv2.CV_64F).var())
        if lap_var < 15.0:
            return False, "INVALID_IMAGE", "Image is severely blurry. Leaf venation and lesions cannot be distinguished."

        return True, "PASSED", "Image quality checks passed."

    def check_human_presence(self, pil_image: Image.Image) -> Tuple[bool, float, str]:
        """
        Stage 2: Detects human faces or subjects using verified facial features and skin tone analysis.
        Avoids false positives on necrotic leaf lesions by verifying that candidate face boxes contain
        actual human skin tones rather than green chlorophyll/leaf blade tissue.
        Returns: (is_human, confidence, description)
        """
        cv_img = cv2.cvtColor(np.array(pil_image), cv2.COLOR_RGB2BGR)
        gray = cv2.cvtColor(cv_img, cv2.COLOR_BGR2GRAY)
        total_pixels = float(cv_img.shape[0] * cv_img.shape[1])

        # Color masks for skin and foliage
        ycbcr = cv2.cvtColor(cv_img, cv2.COLOR_BGR2YCrCb)
        cr = ycbcr[:, :, 1]
        cb = ycbcr[:, :, 2]
        skin_mask = (cr >= 133) & (cr <= 173) & (cb >= 77) & (cb <= 127)
        global_skin_ratio = float(np.sum(skin_mask)) / total_pixels

        hsv = cv2.cvtColor(cv_img, cv2.COLOR_BGR2HSV)
        h = hsv[:, :, 0]
        s = hsv[:, :, 1]
        v = hsv[:, :, 2]
        green_mask = (h >= 24) & (h <= 88) & (s >= 35) & (v >= 35)
        green_ratio = float(np.sum(green_mask)) / total_pixels

        # 1. Frontal & Profile face detection with facial bounding-box verification
        candidates = []
        if self.face_cascade is not None:
            faces = self.face_cascade.detectMultiScale(
                gray, scaleFactor=1.1, minNeighbors=4, minSize=(40, 40)
            )
            candidates.extend(faces)
        if self.profile_cascade is not None:
            profiles = self.profile_cascade.detectMultiScale(
                gray, scaleFactor=1.1, minNeighbors=4, minSize=(40, 40)
            )
            candidates.extend(profiles)

        # Validate candidates: a real human face box MUST be dominated by skin tones, NOT green leaf foliage
        verified_human_faces = 0
        for (x, y, w, h_box) in candidates:
            box_skin = skin_mask[y:y+h_box, x:x+w]
            box_green = green_mask[y:y+h_box, x:x+w]
            box_area = float(w * h_box)
            box_skin_ratio = float(np.sum(box_skin)) / box_area
            box_green_ratio = float(np.sum(box_green)) / box_area

            # If the box is primarily skin tones and does not contain green foliage, it is a real face
            if box_skin_ratio >= 0.35 and box_green_ratio < 0.20:
                verified_human_faces += 1

        # Real face detected and image does not have dominant plant foliage (> 25% green)
        if verified_human_faces > 0 and green_ratio < 0.25:
            return True, 0.99, f"Human face detected ({verified_human_faces} verified face region(s))."

        # 2. Global skin dominance (e.g. human selfie / portrait / hands without leaf)
        if global_skin_ratio > 0.35 and green_ratio < 0.08:
            return True, 0.95, f"Human skin tones dominate image (skin={global_skin_ratio:.0%}, foliage={green_ratio:.0%})."

        return False, 0.0, "No human presence detected."

    def check_foliage_signature(self, pil_image: Image.Image) -> Tuple[bool, float, float]:
        """
        Stage 3: Measures whether the image contains authentic foliage, chlorophyll,
        or necrotic leaf pathology signatures.
        Returns: (has_foliage, green_ratio, total_foliage_ratio)
        """
        cv_img = cv2.cvtColor(np.array(pil_image), cv2.COLOR_RGB2BGR)
        hsv = cv2.cvtColor(cv_img, cv2.COLOR_BGR2HSV)
        h = hsv[:, :, 0]
        s = hsv[:, :, 1]
        v = hsv[:, :, 2]

        total_pixels = float(cv_img.shape[0] * cv_img.shape[1])

        # 1. Green / healthy vegetation: H in [24, 88], S >= 28, V >= 28
        green_mask = (h >= 24) & (h <= 88) & (s >= 28) & (v >= 28)
        green_ratio = float(np.sum(green_mask)) / total_pixels

        # 2. Yellow / chlorotic leaf tissue: H in [18, 24], S >= 35, V >= 45
        yellow_mask = (h >= 18) & (h < 24) & (s >= 35) & (v >= 45)

        # 3. Brown necrotic / blight / rust lesions: H in [8, 18], S in [30, 210], V in [25, 170]
        brown_mask = (h >= 8) & (h < 18) & (s >= 30) & (v >= 25) & (v <= 170)

        # Total foliage mask (green + chlorotic yellow + brown lesions)
        total_foliage_mask = green_mask | yellow_mask | brown_mask
        total_foliage_ratio = float(np.sum(total_foliage_mask)) / total_pixels

        # Valid foliage requires discernible green chlorophyll (> 4%) OR significant green-dominant leaf tissue
        has_foliage = (green_ratio >= 0.04 and total_foliage_ratio >= 0.08) or (green_ratio >= 0.07)
        return has_foliage, round(green_ratio, 3), round(total_foliage_ratio, 3)

    def validate_plant_leaf(self, pil_image: Image.Image) -> Dict[str, Any]:
        """
        Comprehensive multi-stage validation:
        Stage 1: Image Quality Check (dimensions, blanks, exposure, blur)
        Stage 2: Human / Person Presence Check
        Stage 3: Foliage & Chlorophyll Chrominance Check
        Stage 4: Deep Neural Network Classifier (MobileNetV2 ImageNet Out-of-Distribution Check)
        """
        # 1. Image Quality
        q_pass, q_err, q_msg = self.validate_image_quality(pil_image)
        if not q_pass:
            return {
                "is_plant_leaf": False,
                "validation_confidence": 0.99,
                "error_type": q_err,
                "message": q_msg
            }

        # 2. Human Presence Check
        is_human, human_conf, human_msg = self.check_human_presence(pil_image)
        if is_human:
            logger.info(f"Rejected human photo: {human_msg} (confidence={human_conf})")
            return {
                "is_plant_leaf": False,
                "validation_confidence": human_conf,
                "error_type": "INVALID_IMAGE",
                "message": "This image appears to contain a person or human subject. Please upload a clear photograph of a crop or plant leaf."
            }

        # 3. Foliage & Leaf Signature
        has_foliage, green_ratio, total_foliage_ratio = self.check_foliage_signature(pil_image)

        # 4. Deep Feature Classification (MobileNetV2)
        non_plant_score = 0.0
        botanical_score = 0.0

        preds = None
        if self.torch_mobilenet is not None and self.torch_transforms is not None:
            try:
                import torch
                img_t = self.torch_transforms(pil_image.convert("RGB")).unsqueeze(0)
                with torch.no_grad():
                    logits = self.torch_mobilenet(img_t)
                    probs = torch.softmax(logits, dim=1)[0].numpy()
                preds = probs
            except Exception as ex:
                logger.warning(f"Error during PyTorch MobileNet inference: {ex}")
        elif self.mobilenet_model is not None:
            try:
                from tensorflow.keras.applications.mobilenet_v2 import preprocess_input
                resized = pil_image.resize((224, 224), Image.Resampling.BILINEAR)
                arr = preprocess_input(np.expand_dims(np.array(resized, dtype=np.float32), axis=0))
                preds = self.mobilenet_model.predict(arr, verbose=0)[0]
            except Exception as ex:
                logger.warning(f"Error during TensorFlow MobileNet inference: {ex}")

        if preds is not None:
            top_10 = np.argsort(preds)[::-1][:10]
            non_plant_score = sum(float(preds[idx]) for idx in top_10 if idx in self.non_plant_indices)
            botanical_score = sum(float(preds[idx]) for idx in top_10 if idx in self.botanical_indices)

            top_1_idx = top_10[0]
            top_1_name = self.imagenet_classes.get(str(top_1_idx), ["", "unknown"])[1]
            top_1_prob = float(preds[top_1_idx])

            logger.info(
                f"MobileNet top-1: {top_1_name} ({top_1_prob:.2f}), "
                f"non_plant_score={non_plant_score:.2f}, botanical={botanical_score:.2f}, green_ratio={green_ratio:.2f}"
            )

            # If top-1 is an explicit non-plant object (e.g. car, dog, suit, laptop, building) with high confidence
            if top_1_idx in self.non_plant_indices and top_1_prob > 0.20 and green_ratio < 0.06:
                clean_name = top_1_name.replace("_", " ")
                return {
                    "is_plant_leaf": False,
                    "validation_confidence": round(min(0.99, non_plant_score + 0.3), 2),
                    "error_type": "INVALID_IMAGE",
                    "message": f"This image appears to contain an unrelated subject ({clean_name}). Please upload a clear photograph of a crop or plant leaf."
                }

            # If non-plant score dominates and foliage is negligible
            if non_plant_score > 0.35 and green_ratio < 0.05:
                return {
                    "is_plant_leaf": False,
                    "validation_confidence": round(min(0.98, non_plant_score), 2),
                    "error_type": "INVALID_IMAGE",
                    "message": "This image does not appear to contain a crop or plant leaf. Please upload a clear photograph of a plant leaf."
                }

        # If image has virtually zero green chlorophyll and was not recognized as botanical
        if not has_foliage and botanical_score < 0.20:
            return {
                "is_plant_leaf": False,
                "validation_confidence": 0.94,
                "error_type": "INVALID_IMAGE",
                "message": "This image does not appear to contain plant foliage or a crop leaf. Please upload a clear crop leaf image."
            }

        # Validation successfully passed!
        val_conf = min(0.98, max(0.85, 0.70 + total_foliage_ratio * 0.3 + botanical_score * 0.2))
        return {
            "is_plant_leaf": True,
            "validation_confidence": round(val_conf, 2),
            "green_ratio": green_ratio,
            "foliage_ratio": total_foliage_ratio
        }

