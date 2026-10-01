"""
CropDetect AI — Crop Disease Detection Using Convolutional Neural Networks
Production Streamlit Application serving the official CropDetect AI React Frontend.
"""
import os
import sys
import json
import base64
import logging
from pathlib import Path

import streamlit as st
import streamlit.components.v1 as components

# Configure logger
logger = logging.getLogger("cropdetect_app")
logging.basicConfig(level=logging.INFO)

# Path setup
ROOT_DIR = Path(__file__).resolve().parent
BACKEND_DIR = ROOT_DIR / "backend"
FRONTEND_DIST = ROOT_DIR / "frontend" / "dist"

if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

# Streamlit Page Config
st.set_page_config(
    page_title="CropDetect AI — Crop Disease Detection",
    page_icon="🌿",
    layout="wide",
    initial_sidebar_state="collapsed",
)

# Custom CSS: Hide all default Streamlit chrome and allow full-bleed React UI
st.markdown(
    """
    <style>
    /* Hide Streamlit header, footer, deploy button, toolbar, and sidebar */
    #MainMenu, header, footer, [data-testid="stSidebar"], [data-testid="stHeader"], [data-testid="stToolbar"], .stAppDeployButton, [data-testid="stDecoration"] {
        display: none !important;
        visibility: hidden !important;
        height: 0 !important;
        margin: 0 !important;
        padding: 0 !important;
    }
    
    /* Remove padding and margins from app containers */
    .main, .block-container, [data-testid="stAppViewContainer"], [data-testid="stVerticalBlock"], [data-testid="stMain"] {
        padding: 0 !important;
        margin: 0 !important;
        max-width: 100vw !important;
        width: 100vw !important;
    }

    /* Iframe formatting */
    iframe {
        width: 100vw !important;
        min-height: 100vh !important;
        border: none !important;
        display: block !important;
    }
    </style>
    """,
    unsafe_allow_html=True,
)

# Initialize Prediction Service (PyTorch MobileNetV2 + Out-of-Distribution Validator)
@st.cache_resource
def get_prediction_service():
    try:
        from backend.services.prediction_service import PredictionService
    except ImportError:
        from services.prediction_service import PredictionService
    return PredictionService.get_instance()

# Load real Dataset & Model metadata
@st.cache_data
def get_metadata():
    backend_data_dir = BACKEND_DIR / "data"
    backend_model_dir = BACKEND_DIR / "model"
    
    ds_meta_path = backend_data_dir / "dataset_metadata.json"
    dataset_info = {}
    if ds_meta_path.exists():
        with open(ds_meta_path, "r", encoding="utf-8") as f:
            dataset_info = json.load(f)
            
    model_metrics_path = backend_model_dir / "training_metrics.json"
    model_config_path = backend_model_dir / "model_config.json"
    model_info = {}
    if model_metrics_path.exists():
        with open(model_metrics_path, "r", encoding="utf-8") as f:
            model_info = json.load(f)
    elif model_config_path.exists():
        with open(model_config_path, "r", encoding="utf-8") as f:
            model_info = json.load(f)
            
    service = get_prediction_service()
    health_status = service.get_health_status()
    
    return dataset_info, model_info, health_status

# Declare Streamlit custom component serving the React build
if not FRONTEND_DIST.exists():
    raise RuntimeError(f"React build directory not found at {FRONTEND_DIST}. Run 'npm run build' first.")

cropdetect_component = components.declare_component(
    "cropdetect_app",
    path=str(FRONTEND_DIST)
)

def main():
    service = get_prediction_service()
    dataset_info, model_info, health_status = get_metadata()
    
    if "current_prediction" not in st.session_state:
        st.session_state["current_prediction"] = None
    if "last_request_id" not in st.session_state:
        st.session_state["last_request_id"] = None

    # Render React application component
    event = cropdetect_component(
        key="cropdetect_root",
        model_info=model_info,
        dataset_info=dataset_info,
        health_status=health_status,
        prediction=st.session_state["current_prediction"],
        default=None,
    )

    # Handle incoming prediction requests from React frontend
    if event and isinstance(event, dict):
        action = event.get("action")
        req_id = event.get("request_id")
        
        if action == "predict" and req_id != st.session_state["last_request_id"]:
            st.session_state["last_request_id"] = req_id
            b64_image = event.get("image", "")
            filename = event.get("filename", "upload.jpg")
            
            try:
                image_bytes = base64.b64decode(b64_image)
                # REAL CNN MODEL PREDICTION WITH OUT-OF-DISTRIBUTION VALIDATION
                pred_result = service.predict(image_bytes, filename=filename)
                st.session_state["current_prediction"] = pred_result
                st.rerun()
            except Exception as e:
                logger.error(f"Prediction failed: {e}")
                st.session_state["current_prediction"] = {
                    "success": False,
                    "error_type": "PREDICTION_ERROR",
                    "message": f"Inference processing error: {str(e)}"
                }
                st.rerun()

if __name__ == "__main__":
    main()
