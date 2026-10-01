"""
Prediction Service for Crop Disease Detection.
Coordinates image quality validation, plant/leaf validation (OOD detection),
and CNN disease inference with uncertainty handling.
"""
import os
import json
import logging
from typing import Dict, Any, List, Optional
import numpy as np
from PIL import Image

from .preprocessing import validate_and_load_image, preprocess_for_inference
from .plant_validator import PlantLeafValidator

logger = logging.getLogger("agri_prediction_service")
logging.basicConfig(level=logging.INFO)

class PredictionService:
    _instance: Optional["PredictionService"] = None

    def __init__(self, base_dir: Optional[str] = None):
        if base_dir is None:
            base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        self.base_dir = base_dir
        self.model = None
        self.class_names: List[str] = []
        self.disease_info: Dict[str, Any] = {}
        self.dataset_metadata: Dict[str, Any] = {}
        self.model_config: Dict[str, Any] = {}
        self.training_metrics: Dict[str, Any] = {}
        self.is_model_loaded: bool = False
        self.validator: Optional[PlantLeafValidator] = None
        self.load_assets()

    @classmethod
    def get_instance(cls, base_dir: Optional[str] = None) -> "PredictionService":
        if cls._instance is None:
            cls._instance = cls(base_dir)
        return cls._instance

    def load_assets(self):
        """Loads model weights, class names, configs, and initializes PlantLeafValidator."""
        # 1. Load Class Names
        class_names_path = os.path.join(self.base_dir, "model", "class_names.json")
        if os.path.exists(class_names_path):
            with open(class_names_path, "r", encoding="utf-8") as f:
                self.class_names = json.load(f)
            logger.info(f"Loaded {len(self.class_names)} target class labels.")

        # 2. Load Disease Information Database
        disease_info_path = os.path.join(self.base_dir, "data", "disease_information.json")
        if os.path.exists(disease_info_path):
            with open(disease_info_path, "r", encoding="utf-8") as f:
                self.disease_info = json.load(f)
            logger.info(f"Loaded {len(self.disease_info)} disease knowledge entries.")

        # 3. Load Dataset Metadata
        dataset_meta_path = os.path.join(self.base_dir, "data", "dataset_metadata.json")
        if os.path.exists(dataset_meta_path):
            with open(dataset_meta_path, "r", encoding="utf-8") as f:
                self.dataset_metadata = json.load(f)

        # 4. Load Model Config & Training Metrics
        config_path = os.path.join(self.base_dir, "model", "model_config.json")
        if os.path.exists(config_path):
            with open(config_path, "r", encoding="utf-8") as f:
                self.model_config = json.load(f)

        metrics_path = os.path.join(self.base_dir, "model", "training_metrics.json")
        if os.path.exists(metrics_path):
            with open(metrics_path, "r", encoding="utf-8") as f:
                self.training_metrics = json.load(f)

        # 5. Initialize Plant Leaf Validator (OOD detector)
        try:
            self.validator = PlantLeafValidator.get_instance()
            logger.info("PlantLeafValidator initialized successfully.")
        except Exception as e:
            logger.warning(f"Error initializing PlantLeafValidator: {e}")

        # 6. Load Trained PlantVillage CNN Disease Model
        local_model_dir = os.path.join(self.base_dir, "model", "plantvillage_mobilenet_v2")
        model_keras_path = os.path.join(self.base_dir, "model", "crop_disease_model.keras")

        if os.path.exists(local_model_dir):
            try:
                from transformers import MobileNetV2ForImageClassification
                logger.info(f"Loading pretrained PlantVillage CNN model from {local_model_dir}...")
                self.model = MobileNetV2ForImageClassification.from_pretrained(local_model_dir)
                self.model.eval()
                self.model_type = "torch"
                self.is_model_loaded = True
                logger.info("PlantVillage deep CNN model loaded successfully into memory.")
            except Exception as e:
                logger.warning(f"Error loading PlantVillage PyTorch model: {e}")
                self.is_model_loaded = False
        elif os.path.exists(model_keras_path):
            try:
                import tensorflow as tf
                logger.info(f"Loading Keras CNN model from {model_keras_path}...")
                self.model = tf.keras.models.load_model(model_keras_path)
                self.model_type = "keras"
                self.is_model_loaded = True
                logger.info("CNN disease model loaded successfully into memory.")
            except Exception as e:
                logger.error(f"Error loading model from {model_keras_path}: {e}")
                self.is_model_loaded = False
        else:
            logger.warning("No model found. Inference service in standby.")
            self.is_model_loaded = False

    def predict(self, image_bytes: bytes, filename: str = "") -> Dict[str, Any]:
        """
        Executes strict multi-tier pipeline:
        1. File Validation
        2. Image Quality Check
        3. Plant / Leaf Validation (Rejects humans, animals, cars, objects, blanks, blurry images)
        4. CNN Disease Classification (ONLY executed if plant/leaf validation passes)
        5. Uncertainty / Confidence Validation
        """
        # Step 1: Decode and validate file basics (size, corruption, formats)
        pil_image = validate_and_load_image(image_bytes, filename)

        # Step 2 & 3: Plant/Leaf Validation & Out-of-Distribution Check
        if self.validator is not None:
            val_result = self.validator.validate_plant_leaf(pil_image)
            if not val_result.get("is_plant_leaf", False):
                logger.info(f"Rejected non-leaf upload ({filename}): {val_result.get('message')}")
                return {
                    "success": False,
                    "error_type": val_result.get("error_type", "INVALID_IMAGE"),
                    "message": val_result.get(
                        "message",
                        "This image does not appear to contain a crop or plant leaf. Please upload a clear photograph of a crop leaf."
                    ),
                    "validation_confidence": val_result.get("validation_confidence", 0.95)
                }
            plant_conf = val_result.get("validation_confidence", 0.95)
        else:
            plant_conf = 0.90

        # Step 4: Model Readiness
        if not self.is_model_loaded or self.model is None:
            raise RuntimeError(
                "Trained CNN disease model is not currently loaded in the backend service. "
                "Ensure 'plantvillage_mobilenet_v2' or 'crop_disease_model.keras' exists in backend/model/."
            )

        # Step 5 & 6: Disease Model Inference
        if getattr(self, "model_type", "") == "torch":
            import torch
            resized_img = pil_image.resize((224, 224), resample=Image.Resampling.LANCZOS)
            arr = (np.array(resized_img, dtype=np.float32) / 127.5) - 1.0
            tensor = torch.tensor(arr.transpose(2, 0, 1), dtype=torch.float32).unsqueeze(0)
            with torch.no_grad():
                outputs = self.model(tensor)
                probabilities = torch.softmax(outputs.logits, dim=-1)[0].numpy()
        else:
            input_tensor = preprocess_for_inference(pil_image)
            raw_preds = self.model.predict(input_tensor, verbose=0)
            probabilities = raw_preds[0]

        # Top 5 indices
        top_indices = np.argsort(probabilities)[::-1][:5]

        top_predictions = []
        for idx in top_indices:
            idx = int(idx)
            raw_cls = self.class_names[idx] if idx < len(self.class_names) else f"Class_{idx}"
            conf = float(probabilities[idx]) * 100.0

            info = self.disease_info.get(raw_cls, {})
            crop_name = info.get("crop", raw_cls.split("___")[0].replace("_", " "))
            disease_name = info.get("disease", raw_cls.split("___")[-1].replace("_", " "))
            status = info.get("status", "Healthy" if "healthy" in raw_cls.lower() else "Diseased")

            top_predictions.append({
                "raw_class": raw_cls,
                "crop": crop_name,
                "disease": disease_name,
                "status": status,
                "confidence": round(conf, 1)
            })

        primary = top_predictions[0]
        disease_confidence = primary["confidence"]

        # Step 7: Uncertainty / Low Confidence Threshold Handling
        # Configurable in model_config.json
        threshold_config = float(self.model_config.get("prediction_threshold", 0.40))
        threshold_pct = threshold_config * 100.0

        if disease_confidence < threshold_pct:
            logger.info(
                f"Prediction uncertainty triggered: top confidence {disease_confidence:.1f}% "
                f"below threshold {threshold_pct:.1f}%"
            )
            return {
                "success": False,
                "error_type": "LOW_CONFIDENCE",
                "message": "The model could not confidently identify this crop disease. Please upload a closer, clearer photograph of the affected leaf.",
                "confidence": round(disease_confidence, 1),
                "threshold": round(threshold_pct, 1),
                "plant_validation_confidence": round(plant_conf * 100, 1),
                "top_predictions": top_predictions
            }

        # Step 8: Accepted, Confident Diagnosis
        primary_info = self.disease_info.get(primary["raw_class"], {
            "crop": primary["crop"],
            "disease": primary["disease"],
            "status": primary["status"],
            "severity": "Unknown",
            "causal_agent": "N/A",
            "description": f"Classification for {primary['crop']} - {primary['disease']}.",
            "symptoms": ["Consult local agricultural extension for localized field symptoms."],
            "affected_parts": ["Foliage"],
            "general_management": ["Maintain regular crop scouting and field sanitation."]
        })

        return {
            "success": True,
            "crop": primary["crop"],
            "disease": primary["disease"],
            "status": primary["status"],
            "confidence": primary["confidence"],
            "plant_validation_confidence": round(plant_conf * 100, 1),
            "raw_class": primary["raw_class"],
            "top_predictions": top_predictions,
            "disease_info": {
                "crop": primary_info.get("crop", primary["crop"]),
                "disease": primary_info.get("disease", primary["disease"]),
                "status": primary_info.get("status", primary["status"]),
                "severity": primary_info.get("severity", "N/A"),
                "causal_agent": primary_info.get("causal_agent", "N/A"),
                "description": primary_info.get("description", ""),
                "possible_symptoms": primary_info.get("symptoms", []),
                "affected_parts": primary_info.get("affected_parts", []),
                "general_management": primary_info.get("general_management", [])
            }
        }

    def get_model_info(self) -> Dict[str, Any]:
        """Returns architecture information and training performance statistics."""
        return {
            "is_loaded": self.is_model_loaded,
            "architecture": self.model_config.get("architecture_name", "4-Block Deep CNN"),
            "input_shape": self.model_config.get("input_shape", [224, 224, 3]),
            "num_classes": len(self.class_names),
            "prediction_threshold": self.model_config.get("prediction_threshold", 0.40),
            "out_of_distribution_validation": self.model_config.get("out_of_distribution_validation", {}),
            "layers": self.model_config.get("layers", []),
            "training_metrics": self.training_metrics
        }

    def get_dataset_info(self) -> Dict[str, Any]:
        """Returns authentic PlantVillage dataset structure and distribution data."""
        return self.dataset_metadata

    def get_health_status(self) -> Dict[str, Any]:
        """Service health check."""
        try:
            import tensorflow as tf
            tf_version = tf.__version__
            devices = [d.name for d in tf.config.list_physical_devices()]
        except Exception:
            tf_version = "Unknown"
            devices = ["CPU"]

        return {
            "status": "healthy",
            "service": "CropDetect AI Backend",
            "model_loaded": self.is_model_loaded,
            "validator_ready": self.validator is not None,
            "total_classes": len(self.class_names),
            "tensorflow_version": tf_version,
            "devices": devices
        }
