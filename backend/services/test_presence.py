import os
import json
import cv2
import numpy as np
from PIL import Image

def analyze_image_quality(cv_img):
    """
    Validates dimensions, blanks, underexposure, overexposure, and blurriness.
    """
    h, w = cv_img.shape[:2]
    if h < 64 or w < 64:
        return False, "LOW_RESOLUTION", f"Image resolution ({w}x{h}) is too low for disease analysis. Minimum is 64x64."

    # Blank / Uniform check
    std = float(np.std(cv_img))
    if std < 10.0:
        return False, "BLANK_IMAGE", "Image appears completely blank or uniform in color."

    # Luminance / brightness check
    gray = cv2.cvtColor(cv_img, cv2.COLOR_BGR2GRAY)
    mean_lum = float(np.mean(gray))
    if mean_lum < 15.0:
        return False, "UNDEREXPOSED", "Image is extremely dark / underexposed. Leaf structures cannot be extracted."
    if mean_lum > 250.0:
        return False, "OVEREXPOSED", "Image is washed out / overexposed."

    # Blurriness check via Laplacian variance
    lap_var = float(cv2.Laplacian(gray, cv2.CV_64F).var())
    if lap_var < 15.0:
        return False, "BLURRY_IMAGE", "Image is too blurry. Please upload a clear, focused photograph of the crop leaf."

    return True, "PASSED", f"Quality passed (std={std:.1f}, mean={mean_lum:.1f}, lap_var={lap_var:.1f})"

def check_human_presence(cv_img):
    """
    Detects human faces or upper bodies using Haar cascades and skin tone analysis.
    """
    gray = cv2.cvtColor(cv_img, cv2.COLOR_BGR2GRAY)
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=3, minSize=(30, 30))
    if len(faces) > 0:
        return True, 0.99, "Human face detected in the image."

    profile_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_profileface.xml')
    profiles = profile_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=3, minSize=(30, 30))
    if len(profiles) > 0:
        return True, 0.98, "Human profile detected in the image."

    # Check for skin-tone dominance (YCbCr)
    ycbcr = cv2.cvtColor(cv_img, cv2.COLOR_BGR2YCrCb)
    # OpenCv YCrCb: channel 0 is Y, 1 is Cr, 2 is Cb
    cr = ycbcr[:, :, 1]
    cb = ycbcr[:, :, 2]
    skin_mask = (cr >= 133) & (cr <= 173) & (cb >= 77) & (cb <= 127)
    skin_ratio = float(np.sum(skin_mask)) / float(cv_img.shape[0] * cv_img.shape[1])

    # Check vegetation ratio (HSV)
    hsv = cv2.cvtColor(cv_img, cv2.COLOR_BGR2HSV)
    h = hsv[:, :, 0]
    s = hsv[:, :, 1]
    v = hsv[:, :, 2]
    # Green/foliage hue in OpenCV (0-180 scale): 25 to 85 is green/yellow-green
    veg_mask = ((h >= 25) & (h <= 85) & (s >= 35) & (v >= 35))
    veg_ratio = float(np.sum(veg_mask)) / float(cv_img.shape[0] * cv_img.shape[1])

    if skin_ratio > 0.35 and veg_ratio < 0.08:
        return True, 0.95, f"Human skin tone dominates the image (skin={skin_ratio:.1%}, foliage={veg_ratio:.1%})."

    return False, 0.0, "No human presence detected."

print("Testing functions initialized!")
