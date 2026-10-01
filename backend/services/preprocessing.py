"""
Image preprocessing and validation service for Crop Disease Detection.
Handles format checking, dimensions, corrupt image detection, and tensor formatting.
"""
import io
from typing import Tuple
from PIL import Image
import numpy as np

MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB
MIN_FILE_SIZE = 1024              # 1 KB
MIN_DIMENSION = 64
MAX_DIMENSION = 6000
ALLOWED_FORMATS = {"JPEG", "JPG", "PNG", "WEBP", "MPO"}

def validate_and_load_image(image_bytes: bytes, filename: str = "") -> Image.Image:
    """
    Validates uploaded file size, format, and integrity.
    Returns PIL Image instance if valid, otherwise raises ValueError.
    """
    if not image_bytes or len(image_bytes) == 0:
        raise ValueError("Empty image upload. Please select a valid crop leaf image file.")
    
    file_size = len(image_bytes)
    if file_size < MIN_FILE_SIZE:
        raise ValueError("Image file is too small or corrupt. Minimum size is 1 KB.")
    if file_size > MAX_FILE_SIZE:
        raise ValueError("Image file exceeds the 10 MB maximum allowed upload size.")

    # Extension check if filename provided
    if filename:
        ext = filename.split(".")[-1].lower()
        if ext not in ["jpg", "jpeg", "png", "webp", "jfif"]:
            raise ValueError(f"Unsupported file extension '.{ext}'. Please upload a JPG, JPEG, PNG, or WEBP image.")

    # Byte verification with Pillow
    try:
        image = Image.open(io.BytesIO(image_bytes))
        image.verify()  # verify integrity
    except Exception as err:
        raise ValueError("Corrupt or invalid image file. Unable to decode image data.") from err

    # Re-open after verify() because verify() invalidates the image handle
    try:
        image = Image.open(io.BytesIO(image_bytes))
    except Exception as err:
        raise ValueError("Unable to read image bytes after verification.") from err

    fmt = (image.format or "").upper()
    if fmt not in ALLOWED_FORMATS:
        raise ValueError(f"Unsupported image format '{fmt}'. Please upload a JPG, JPEG, PNG, or WEBP image.")

    width, height = image.size
    if width < MIN_DIMENSION or height < MIN_DIMENSION:
        raise ValueError(
            f"Image dimensions ({width}x{height}) are too small. Minimum resolution is {MIN_DIMENSION}x{MIN_DIMENSION} pixels."
        )
    if width > MAX_DIMENSION or height > MAX_DIMENSION:
        raise ValueError(
            f"Image dimensions ({width}x{height}) exceed maximum allowed limit of {MAX_DIMENSION}x{MAX_DIMENSION}."
        )

    # Convert color mode to RGB
    if image.mode != "RGB":
        image = image.convert("RGB")

    return image


def preprocess_for_inference(image: Image.Image, target_size: Tuple[int, int] = (224, 224)) -> np.ndarray:
    """
    Resizes image to target CNN dimension and formats into float32 batch tensor.
    Note: The Keras model includes Rescaling(1./255), so input tensor is in [0, 255] float32.
    """
    # Resize with high-quality resampling
    resized_img = image.resize(target_size, resample=Image.Resampling.LANCZOS)
    img_array = np.array(resized_img, dtype=np.float32)

    # Shape: (1, 224, 224, 3)
    batch_tensor = np.expand_dims(img_array, axis=0)
    return batch_tensor
