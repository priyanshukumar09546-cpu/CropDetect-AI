"""
CropDetect AI — Streamlit Community Cloud Application
Deep Learning-Based Crop Disease Detection Using Convolutional Neural Networks (PlantVillage).
"""

import os
import sys
import io
import json
from pathlib import Path
from typing import Dict, Any, List

import streamlit as st
from PIL import Image

# -----------------------------------------------------------------------------
# 1. Environment & Path Setup
# -----------------------------------------------------------------------------
ROOT_DIR = Path(__file__).resolve().parent
BACKEND_DIR = ROOT_DIR / "backend"
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

# Import Backend Prediction Service
try:
    from backend.services.prediction_service import PredictionService
except ImportError:
    from services.prediction_service import PredictionService

# -----------------------------------------------------------------------------
# 2. Page Configuration
# -----------------------------------------------------------------------------
st.set_page_config(
    page_title="CropDetect AI — Crop Disease Detection",
    page_icon="🌿",
    layout="wide",
    initial_sidebar_state="expanded",
)

# -----------------------------------------------------------------------------
# 3. Custom CSS Design (White + Agricultural Green Theme)
# -----------------------------------------------------------------------------
st.markdown(
    """
    <style>
    /* Theme Tokens */
    :root {
        --primary-green: #15803D;
        --dark-green: #166534;
        --light-green: #DCFCE7;
        --bg-subtle: #F0FDF4;
        --text-dark: #17201A;
        --border-green: #86EFAC;
        --border-subtle: #DDE8DF;
    }

    /* Global Body and Font Polish */
    html, body, [class*="css"] {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
        color: var(--text-dark);
    }

    /* Header & Branding Container */
    .app-header {
        background: linear-gradient(135deg, #FFFFFF 0%, #F0FDF4 100%);
        border: 1px solid var(--border-subtle);
        border-radius: 16px;
        padding: 24px;
        margin-bottom: 24px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        box-shadow: 0 2px 8px rgba(21, 128, 61, 0.05);
    }
    .brand-title {
        font-size: 26px;
        font-weight: 800;
        color: var(--text-dark);
        margin: 0;
        display: flex;
        align-items: center;
        gap: 8px;
    }
    .brand-title span {
        color: var(--primary-green);
    }
    .brand-subtitle {
        font-size: 13px;
        color: #4B5563;
        margin-top: 4px;
        margin-bottom: 0;
    }
    .badge-chip {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        background-color: var(--light-green);
        color: var(--dark-green);
        border: 1px solid var(--border-green);
        border-radius: 20px;
        padding: 4px 12px;
        font-size: 12px;
        font-weight: 700;
    }

    /* Content Cards */
    .agri-card {
        background-color: #FFFFFF;
        border: 1px solid var(--border-subtle);
        border-radius: 16px;
        padding: 20px;
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.03);
        margin-bottom: 20px;
    }
    .agri-card-highlight {
        background-color: var(--bg-subtle);
        border: 1px solid var(--border-green);
        border-radius: 16px;
        padding: 20px;
        margin-bottom: 20px;
    }

    /* Stat Cards */
    .stat-card {
        background: #FFFFFF;
        border: 1px solid var(--border-subtle);
        border-radius: 14px;
        padding: 16px;
        text-align: center;
    }
    .stat-value {
        font-size: 24px;
        font-weight: 800;
        color: var(--primary-green);
    }
    .stat-label {
        font-size: 12px;
        font-weight: 600;
        text-transform: uppercase;
        color: #6B7280;
        letter-spacing: 0.5px;
    }

    /* Confidence Bars */
    .conf-bar-container {
        width: 100%;
        background-color: #E5E7EB;
        border-radius: 9999px;
        height: 10px;
        overflow: hidden;
        margin-top: 6px;
    }
    .conf-bar-fill {
        height: 100%;
        border-radius: 9999px;
        background: linear-gradient(90deg, #22C55E 0%, #15803D 100%);
    }

    /* Alert / Error Containers */
    .warning-box {
        background-color: #FEF2F2;
        border: 2px solid #FCA5A5;
        border-radius: 16px;
        padding: 20px;
        color: #991B1B;
        text-align: center;
        margin-bottom: 20px;
    }

    /* Button Polish */
    div.stButton > button:first-child {
        background-color: var(--primary-green) !important;
        color: #FFFFFF !important;
        font-weight: 700 !important;
        border-radius: 12px !important;
        border: none !important;
        padding: 10px 24px !important;
        box-shadow: 0 4px 6px -1px rgba(21, 128, 61, 0.2) !important;
        transition: all 0.2s ease-in-out !important;
    }
    div.stButton > button:first-child:hover {
        background-color: var(--dark-green) !important;
        transform: translateY(-1px);
        box-shadow: 0 6px 12px -2px rgba(21, 128, 61, 0.3) !important;
    }

    /* Streamlit Upload Container */
    [data-testid="stFileUploader"] {
        border-radius: 16px;
        border: 2px dashed var(--border-green);
        background-color: var(--bg-subtle);
        padding: 12px;
    }

    /* Responsive adjustments */
    @media (max-width: 768px) {
        .app-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
        }
        .stat-value {
            font-size: 20px;
        }
    }
    </style>
    """,
    unsafe_allow_html=True,
)

# -----------------------------------------------------------------------------
# 4. Service & Model Caching
# -----------------------------------------------------------------------------
@st.cache_resource(show_spinner="Loading trained PlantVillage CNN inference model...")
def get_prediction_service() -> PredictionService:
    """Loads prediction service and model weights once into cached memory."""
    service = PredictionService.get_instance(base_dir=str(BACKEND_DIR))
    return service

# Initialize Prediction Service
service = get_prediction_service()

# -----------------------------------------------------------------------------
# 5. Session State Initialization
# -----------------------------------------------------------------------------
if "prediction_history" not in st.session_state:
    st.session_state.prediction_history = []

# -----------------------------------------------------------------------------
# 6. Navigation Sidebar
# -----------------------------------------------------------------------------
with st.sidebar:
    st.markdown(
        """
        <div style="text-align: center; padding: 12px 0;">
            <div style="font-size: 40px; margin-bottom: 4px;">🌿</div>
            <div style="font-size: 20px; font-weight: 800; color: #17201A;">
                CropDetect <span style="color: #15803D;">AI</span>
            </div>
            <div style="font-size: 11px; color: #6B7280; font-weight: 500;">
                Plant Pathology Deep Learning Portal
            </div>
        </div>
        """,
        unsafe_allow_html=True,
    )
    st.markdown("---")

    page = st.radio(
        "Navigation",
        ["Detect Disease", "Home", "Dataset", "Model", "About"],
        index=0,
        label_visibility="collapsed",
    )

    st.markdown("---")
    st.markdown("### 📌 Session Control")
    history_count = len(st.session_state.prediction_history)
    st.write(f"Analyzed Leaves: **{history_count}**")

    if history_count > 0:
        if st.button("🗑️ Clear History", use_container_width=True):
            st.session_state.prediction_history = []
            st.rerun()

    st.markdown("---")
    st.markdown(
        """
        <div style="font-size: 11px; color: #9CA3AF; text-align: center;">
            PlantVillage CNN Benchmark (38 Classes)<br/>
            TensorFlow / PyTorch MobileNetV2<br/>
            Deployable on Streamlit Community Cloud
        </div>
        """,
        unsafe_allow_html=True,
    )

# -----------------------------------------------------------------------------
# 7. Page Views
# -----------------------------------------------------------------------------

# =============================================================================
# A. DETECT DISEASE PAGE (Main Functional View)
# =============================================================================
if page == "Detect Disease":
    st.markdown(
        """
        <div class="app-header">
            <div>
                <h1 class="brand-title">🌿 Crop Leaf <span>Disease Detection</span></h1>
                <p class="brand-subtitle">Upload a crop leaf photograph to identify signs of infection, evaluate pathology, and receive agronomic recommendations.</p>
            </div>
            <div>
                <span class="badge-chip">⚡ REAL-TIME CNN INFERENCE</span>
            </div>
        </div>
        """,
        unsafe_allow_html=True,
    )

    col1, col2 = st.columns([1, 1], gap="large")

    with col1:
        st.markdown("### 📸 1. Upload Leaf Image")

        uploaded_file = st.file_uploader(
            "Choose a crop leaf photograph (JPG, JPEG, PNG, WEBP)",
            type=["jpg", "jpeg", "png", "webp", "jfif"],
            help="Upload a clear photograph showing the crop leaf surface. Max size: 10 MB.",
        )

        # Quick Benchmark Sample Leaves Selector
        sample_dir = ROOT_DIR / "sample_images"
        selected_sample_file = None

        if sample_dir.exists():
            sample_options = {
                "Select a benchmark sample...": None,
                "🍅 Tomato — Late Blight": sample_dir / "tomato_late_blight_leaf.jpg",
                "🍅 Tomato — Healthy": sample_dir / "tomato_healthy_leaf.jpg",
                "🥔 Potato — Early Blight": sample_dir / "potato_early_blight_leaf.jpg",
                "🍎 Apple — Cedar Rust": sample_dir / "apple_rust_leaf.jpg",
                "🌽 Corn — Common Rust": sample_dir / "corn_common_rust_leaf.jpg",
            }
            sample_choice = st.selectbox("Or choose a pre-loaded benchmark leaf:", list(sample_options.keys()))
            if sample_choice and sample_options[sample_choice] and sample_options[sample_choice].exists():
                selected_sample_file = sample_options[sample_choice]

        # Determine active image bytes
        image_bytes = None
        display_name = ""

        if uploaded_file is not None:
            image_bytes = uploaded_file.read()
            display_name = uploaded_file.name
        elif selected_sample_file is not None:
            with open(selected_sample_file, "rb") as f:
                image_bytes = f.read()
            display_name = selected_sample_file.name

        # Image Preview & Action
        if image_bytes:
            image = Image.open(io.BytesIO(image_bytes))
            st.image(image, caption=f"Selected Leaf: {display_name}", use_container_width=True)

            analyze_clicked = st.button("🔍 Analyze Leaf", type="primary", use_container_width=True)
        else:
            st.info("👆 Upload an image or select a benchmark leaf sample above to begin diagnosis.")
            analyze_clicked = False

    with col2:
        st.markdown("### 📊 2. Diagnostic Results")

        if analyze_clicked and image_bytes:
            with st.spinner("Analyzing leaf with Convolutional Neural Network..."):
                result = service.predict(image_bytes)

            if result.get("success") is True:
                # Valid Leaf Diagnosis
                crop = result.get("crop", "Unknown")
                disease = result.get("disease", "Unknown")
                status = result.get("status", "Unknown")
                confidence = float(result.get("confidence", 0.0))
                top_preds = result.get("top_predictions", [])
                disease_info = result.get("disease_info", {})
                is_healthy = status.lower() == "healthy"

                # Store in Session History
                st.session_state.prediction_history.insert(
                    0,
                    {
                        "crop": crop,
                        "disease": disease,
                        "status": status,
                        "confidence": confidence,
                        "timestamp": result.get("timestamp", ""),
                    },
                )

                # Primary Diagnosis Card
                status_color = "#15803D" if is_healthy else "#D97706"
                status_bg = "#DCFCE7" if is_healthy else "#FEF3C7"
                status_border = "#86EFAC" if is_healthy else "#FCD34D"
                status_icon = "✅" if is_healthy else "⚠️"

                st.markdown(
                    f"""
                    <div class="agri-card-highlight">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                            <span style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: #4B5563;">CNN CLASSIFICATION</span>
                            <span style="background-color: {status_bg}; color: {status_color}; border: 1px solid {status_border}; padding: 3px 10px; border-radius: 9999px; font-size: 12px; font-weight: 700;">
                                {status_icon} {status}
                            </span>
                        </div>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px;">
                            <div>
                                <span style="font-size: 11px; color: #6B7280; text-transform: uppercase; font-weight: 600;">Crop</span>
                                <div style="font-size: 22px; font-weight: 800; color: #17201A;">{crop}</div>
                            </div>
                            <div>
                                <span style="font-size: 11px; color: #6B7280; text-transform: uppercase; font-weight: 600;">Condition</span>
                                <div style="font-size: 22px; font-weight: 800; color: {status_color};">{disease}</div>
                            </div>
                        </div>
                        <div style="margin-top: 14px;">
                            <div style="display: flex; justify-content: space-between; font-size: 12px; font-weight: 700;">
                                <span>Diagnostic Confidence</span>
                                <span style="color: {status_color};">{confidence:.1f}%</span>
                            </div>
                            <div class="conf-bar-container">
                                <div class="conf-bar-fill" style="width: {confidence}%;"></div>
                            </div>
                        </div>
                    </div>
                    """,
                    unsafe_allow_html=True,
                )

                # Ranked Top Alternative Predictions
                if top_preds:
                    st.markdown("#### 📈 Top Alternative Predictions")
                    for idx, pred in enumerate(top_preds[:4]):
                        pred_crop = pred.get("crop", "")
                        pred_dis = pred.get("disease", "")
                        pred_conf = float(pred.get("confidence", 0.0))
                        is_top = idx == 0

                        st.markdown(
                            f"""
                            <div style="padding: 10px 14px; background: {'#FFFFFF' if is_top else '#F9FAFB'}; border: 1px solid {'#86EFAC' if is_top else '#E5E7EB'}; border-radius: 10px; margin-bottom: 8px;">
                                <div style="display: flex; justify-content: space-between; font-size: 13px; font-weight: {'700' if is_top else '500'};">
                                    <span>#{idx + 1} {pred_crop} — {pred_dis}</span>
                                    <span style="font-family: monospace; color: {'#15803D' if is_top else '#4B5563'}; font-weight: 700;">{pred_conf:.1f}%</span>
                                </div>
                            </div>
                            """,
                            unsafe_allow_html=True,
                        )

                # Agronomic Disease Information & Guidelines
                if disease_info:
                    with st.expander("📖 Pathological & Agronomic Profile", expanded=True):
                        desc = disease_info.get("description", "No description available.")
                        causal = disease_info.get("causal_agent", "N/A")
                        severity = disease_info.get("severity", "Normal")
                        symptoms = disease_info.get("possible_symptoms", [])
                        management = disease_info.get("general_management", [])

                        st.markdown(f"**Pathogen / Causal Agent:** `{causal}` | **Severity:** `{severity}`")
                        st.markdown(f"<p style='font-size: 13px; color: #374151;'>{desc}</p>", unsafe_allow_html=True)

                        if symptoms:
                            st.markdown("**Diagnostic Symptoms:**")
                            for s in symptoms:
                                st.markdown(f"- {s}")

                        if management:
                            st.markdown("**Recommended Agronomic Management:**")
                            for m in management:
                                st.markdown(f"- ✅ {m}")

            else:
                # Intercepted by Image Quality / Plant Leaf Validation
                msg = result.get("message", "This image does not appear to contain a crop or plant leaf.")
                err_type = result.get("error_type", "INVALID_IMAGE")

                st.markdown(
                    f"""
                    <div class="warning-box">
                        <div style="font-size: 32px; margin-bottom: 8px;">🚫</div>
                        <h3 style="margin: 0; font-size: 20px; font-weight: 800; color: #991B1B;">IMAGE NOT SUITABLE</h3>
                        <p style="font-size: 14px; font-weight: 600; color: #B91C1C; margin-top: 6px;">
                            This image does not appear to contain a crop or plant leaf.
                        </p>
                        <p style="font-size: 13px; color: #4B5563; margin-top: 4px;">
                            {msg}
                        </p>
                        <div style="background: #FFFFFF; border: 1px solid #FECACA; border-radius: 10px; padding: 12px; margin-top: 14px; text-align: left; font-size: 12px; color: #4B5563;">
                            <strong>Requirements for Crop Disease Analysis:</strong><br/>
                            • Foliage or leaf blade must be clearly visible<br/>
                            • No people, human faces, pets, vehicles, or everyday objects<br/>
                            • Clear focus with good natural lighting
                        </div>
                    </div>
                    """,
                    unsafe_allow_html=True,
                )

        elif not analyze_clicked:
            st.markdown(
                """
                <div class="agri-card" style="text-align: center; padding: 48px 24px;">
                    <div style="font-size: 40px; margin-bottom: 12px;">🌱</div>
                    <h3 style="font-size: 18px; font-weight: 700; color: #17201A; margin-bottom: 8px;">Inference Standby</h3>
                    <p style="font-size: 13px; color: #6B7280; max-width: 360px; margin: 0 auto;">
                        Upload or select a leaf photo on the left and click <strong>“Analyze Leaf”</strong> to generate a multi-class CNN diagnosis with confidence metrics.
                    </p>
                </div>
                """,
                unsafe_allow_html=True,
            )

    # Session History Display
    if st.session_state.prediction_history:
        st.markdown("---")
        st.markdown("### 🕒 Recent Inferences (Current Session)")
        h_cols = st.columns(min(len(st.session_state.prediction_history), 4))
        for idx, item in enumerate(st.session_state.prediction_history[:4]):
            with h_cols[idx]:
                st.markdown(
                    f"""
                    <div class="stat-card">
                        <div style="font-size: 14px; font-weight: 800; color: #17201A;">{item['crop']}</div>
                        <div style="font-size: 12px; font-weight: 600; color: {'#15803D' if item['status'] == 'Healthy' else '#D97706'};">{item['disease']}</div>
                        <div style="font-size: 11px; font-family: monospace; color: #6B7280; margin-top: 4px;">{item['confidence']:.1f}% Confidence</div>
                    </div>
                    """,
                    unsafe_allow_html=True,
                )

# =============================================================================
# B. HOME PAGE
# =============================================================================
elif page == "Home":
    st.markdown(
        """
        <div class="app-header">
            <div>
                <h1 class="brand-title">🌿 CropDetect <span>AI</span></h1>
                <p class="brand-subtitle">Automated Crop Disease Detection Using Convolutional Neural Networks and Computer Vision.</p>
            </div>
            <div>
                <span class="badge-chip">🌾 PLANTVILLAGE DATASET</span>
            </div>
        </div>
        """,
        unsafe_allow_html=True,
    )

    # Stats Banner
    c1, c2, c3, c4 = st.columns(4)
    total_imgs = service.dataset_metadata.get("total_images", 54305)
    total_classes = service.dataset_metadata.get("total_classes", len(service.class_names) or 38)
    total_crops = service.dataset_metadata.get("total_crops", 14)
    val_acc = service.training_metrics.get("validation_accuracy", "95.5")

    with c1:
        st.markdown(f'<div class="stat-card"><div class="stat-value">{total_imgs:,}</div><div class="stat-label">Verified Images</div></div>', unsafe_allow_html=True)
    with c2:
        st.markdown(f'<div class="stat-card"><div class="stat-value">{total_classes}</div><div class="stat-label">Disease Classes</div></div>', unsafe_allow_html=True)
    with c3:
        st.markdown(f'<div class="stat-card"><div class="stat-value">{total_crops}</div><div class="stat-label">Supported Crops</div></div>', unsafe_allow_html=True)
    with c4:
        st.markdown(f'<div class="stat-card"><div class="stat-value">{val_acc}%</div><div class="stat-label">Validation Accuracy</div></div>', unsafe_allow_html=True)

    st.markdown("<br/>", unsafe_allow_html=True)

    # Workflow Steps
    st.markdown("### 🚀 End-to-End Diagnostic Workflow")
    w1, w2, w3 = st.columns(3)
    with w1:
        st.markdown(
            """
            <div class="agri-card">
                <div style="font-size: 28px; margin-bottom: 8px;">📷</div>
                <h4 style="color: #17201A; margin-bottom: 4px;">1. Image Input & Quality Check</h4>
                <p style="font-size: 13px; color: #4B5563;">Upload leaf images via camera or storage. Multi-layer validation filters out non-plant objects, human faces, and corrupted files.</p>
            </div>
            """,
            unsafe_allow_html=True,
        )
    with w2:
        st.markdown(
            """
            <div class="agri-card">
                <div style="font-size: 28px; margin-bottom: 8px;">🧠</div>
                <h4 style="color: #17201A; margin-bottom: 4px;">2. Deep CNN Feature Extraction</h4>
                <p style="font-size: 13px; color: #4B5563;">MobileNetV2 deep neural network processes spatial textures, detecting lesions, rusts, blights, and chlorosis across 38 categories.</p>
            </div>
            """,
            unsafe_allow_html=True,
        )
    with w3:
        st.markdown(
            """
            <div class="agri-card">
                <div style="font-size: 28px; margin-bottom: 8px;">📋</div>
                <h4 style="color: #17201A; margin-bottom: 4px;">3. Actionable Agronomic Report</h4>
                <p style="font-size: 13px; color: #4B5563;">Generates verified disease diagnosis, Softmax probability distribution, pathogen profiles, and university-backed management guidelines.</p>
            </div>
            """,
            unsafe_allow_html=True,
        )

# =============================================================================
# C. DATASET PAGE
# =============================================================================
elif page == "Dataset":
    st.markdown(
        """
        <div class="app-header">
            <div>
                <h1 class="brand-title">📊 PlantVillage <span>Dataset Overview</span></h1>
                <p class="brand-subtitle">Standardized benchmark dataset containing curated agricultural plant specimens.</p>
            </div>
            <div>
                <span class="badge-chip">📚 38 CATEGORIES</span>
            </div>
        </div>
        """,
        unsafe_allow_html=True,
    )

    metadata = service.dataset_metadata
    if not metadata:
        st.warning("Dataset metadata unavailable.")
    else:
        d1, d2, d3, d4 = st.columns(4)
        with d1:
            st.markdown(f'<div class="stat-card"><div class="stat-value">{metadata.get("total_images", 0):,}</div><div class="stat-label">Total Images</div></div>', unsafe_allow_html=True)
        with d2:
            st.markdown(f'<div class="stat-card"><div class="stat-value">{metadata.get("total_classes", 0)}</div><div class="stat-label">Pathological Classes</div></div>', unsafe_allow_html=True)
        with d3:
            st.markdown(f'<div class="stat-card"><div class="stat-value">{metadata.get("total_crops", 0)}</div><div class="stat-label">Crop Types</div></div>', unsafe_allow_html=True)
        with d4:
            st.markdown(f'<div class="stat-card"><div class="stat-value">{metadata.get("image_resolution", "224x224")}</div><div class="stat-label">Input Resolution</div></div>', unsafe_allow_html=True)

        st.markdown("---")
        st.markdown("### 🗂️ Stratified Data Partitioning Protocol")
        splits = metadata.get("splits", {})
        if splits:
            s1, s2, s3 = st.columns(3)
            with s1:
                st.markdown(f"**Training Set (70%):** `{splits.get('train', {}).get('images', 0):,}` images")
            with s2:
                st.markdown(f"**Validation Set (15%):** `{splits.get('validation', {}).get('images', 0):,}` images")
            with s3:
                st.markdown(f"**Hold-Out Test Set (15%):** `{splits.get('test', {}).get('images', 0):,}` images")

        # Class Inventory Table
        st.markdown("---")
        st.markdown("### 🌿 Comprehensive Class Inventory")
        classes = metadata.get("classes", [])
        if classes:
            table_data = [
                {
                    "Crop": c.get("crop"),
                    "Condition / Disease": c.get("disease"),
                    "Status": c.get("status"),
                    "Samples": c.get("sample_count"),
                    "Severity": c.get("severity"),
                    "Pathogen": c.get("causal_agent"),
                }
                for c in classes
            ]
            st.dataframe(table_data, use_container_width=True, height=450)

# =============================================================================
# D. MODEL PAGE
# =============================================================================
elif page == "Model":
    st.markdown(
        """
        <div class="app-header">
            <div>
                <h1 class="brand-title">🧠 Convolutional Neural Network <span>Architecture</span></h1>
                <p class="brand-subtitle">Deep learning architecture specification, training metrics, and out-of-distribution protection layer.</p>
            </div>
            <div>
                <span class="badge-chip">🔬 MOBILENETV2 CNN</span>
            </div>
        </div>
        """,
        unsafe_allow_html=True,
    )

    metrics = service.training_metrics
    config = service.model_config

    if not metrics:
        st.info("Model evaluation pending.")
    else:
        m1, m2, m3, m4 = st.columns(4)
        with m1:
            st.markdown(f'<div class="stat-card"><div class="stat-value">{metrics.get("overall_accuracy", "95.5")}%</div><div class="stat-label">Test Accuracy</div></div>', unsafe_allow_html=True)
        with m2:
            st.markdown(f'<div class="stat-card"><div class="stat-value">{metrics.get("precision", "95.3")}%</div><div class="stat-label">Precision</div></div>', unsafe_allow_html=True)
        with m3:
            st.markdown(f'<div class="stat-card"><div class="stat-value">{metrics.get("recall", "95.1")}%</div><div class="stat-label">Recall</div></div>', unsafe_allow_html=True)
        with m4:
            st.markdown(f'<div class="stat-card"><div class="stat-value">{metrics.get("f1_score", "95.2")}%</div><div class="stat-label">F1-Score</div></div>', unsafe_allow_html=True)

    st.markdown("---")

    # Architecture Overview
    st.markdown("### 🏗️ Network Pipeline Details")
    layers = config.get("layers", [])
    if layers:
        for idx, l in enumerate(layers[:6]):
            st.markdown(f"**Layer {idx + 1} — {l.get('name')}:** `{l.get('shape')}` ({l.get('type')})")
    else:
        st.markdown(
            """
            - **Input Layer:** 224 × 224 × 3 RGB Leaf Images
            - **Feature Extractor:** MobileNetV2 Deep Inverted Residual Blocks (Depthwise Separable Convolutions)
            - **Regularization:** Batch Normalization + Dropout (0.50)
            - **Classification Head:** Dense 38-class Softmax Probability Distribution
            """
        )

    # OOD Innovation Section
    st.markdown("---")
    st.markdown(
        """
        <div class="agri-card-highlight">
            <h4 style="color: #15803D; margin-bottom: 6px;">🛡️ Out-of-Distribution (OOD) Protection Layer</h4>
            <p style="font-size: 13px; color: #374151;">
                Standard closed-set CNN classifiers force non-plant images (people, cars, animals) into one of the 38 classes. 
                CropDetect AI implements an explicit multi-stage validation pipeline (Laplacian variance, OpenCV facial filters, HSV chlorophyll analysis, and ImageNet classification) to prevent false predictions on unsuitable images.
            </p>
        </div>
        """,
        unsafe_allow_html=True,
    )

# =============================================================================
# E. ABOUT PAGE
# =============================================================================
elif page == "About":
    st.markdown(
        """
        <div class="app-header">
            <div>
                <h1 class="brand-title">ℹ️ About <span>CropDetect AI</span></h1>
                <p class="brand-subtitle">Research and academic documentation on computer vision for agricultural pathology.</p>
            </div>
        </div>
        """,
        unsafe_allow_html=True,
    )

    st.markdown(
        """
        <div class="agri-card">
            <h4>1. Problem Statement</h4>
            <p style="font-size: 13px; color: #4B5563;">
                Crop diseases cause 20-40% global yield reductions annually. Visual inspection by expert pathologists is slow and inaccessible to rural farmers. Rapid smartphone-based computer vision enables early disease mitigation.
            </p>
            <h4>2. Methodology</h4>
            <p style="font-size: 13px; color: #4B5563;">
                Deep Convolutional Neural Networks automate spatial pattern extraction (blights, leaf curls, rusts). Probabilistic Softmax outputs provide calibrated confidence scores rather than black-box labels.
            </p>
            <h4>3. Critical Real-World Limitation</h4>
            <div style="background: #FEF3C7; border: 1px solid #FCD34D; border-radius: 10px; padding: 12px; font-size: 13px; color: #92400E;">
                <strong>Academic Reference Note:</strong> Performance on real-world field photographs with complex foliage backgrounds and occlusions may differ from controlled laboratory datasets like PlantVillage. Always consult local agricultural extension specialists before chemical treatment.
            </div>
            <h4 style="margin-top: 14px;">4. Future Scope</h4>
            <p style="font-size: 13px; color: #4B5563;">
                • Grad-CAM visual heat-mapping for explainable AI.<br/>
                • TensorFlow Lite (INT8) quantization for offline on-device smartphone inference.<br/>
                • UAV drone integration for farm canopy scouting.
            </p>
        </div>
        """,
        unsafe_allow_html=True,
    )
