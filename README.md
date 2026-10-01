# CropDetect AI — Crop Disease Detection Using Convolutional Neural Networks

> **“Detect. Understand. Protect.”**  
> An academic, production-ready machine learning web application for automated crop leaf disease classification utilizing Deep Convolutional Neural Networks (CNNs) benchmarked on the PlantVillage dataset.

[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=flat&logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688?style=flat&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Streamlit](https://img.shields.io/badge/Streamlit-1.40+-FF4B4B?style=flat&logo=streamlit&logoColor=white)](https://streamlit.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 🌾 Overview

Crop leaf diseases cause catastrophic yield reductions worldwide, claiming 20%–40% of agricultural production annually. **CropDetect AI** bridges the gap between expert plant pathology and accessible computer vision by providing instant, localized diagnosis with confidence-ranked probabilities and agronomic management advice.

The system features:
- **Two Deployment Modalities**: 
  1. A high-performance decoupled **FastAPI + React 19 / TypeScript** web application with responsive UI/UX across mobile, tablet, and 4K desktop screens.
  2. A streamlined, standalone **Streamlit** application (`app.py`) ready for immediate 1-click deployment on **Streamlit Community Cloud**.
- **Standardized Benchmark**: Trained and benchmarked on the **PlantVillage** dataset (54,305 laboratory-curated images across 14 crops and 38 classes).
- **Out-of-Distribution (OOD) Protection**: Multi-layer biometric and visual integrity validation (Laplacian variance, OpenCV facial filters, HSV chlorophyll analysis, and deep ImageNet classification) preventing erroneous predictions on non-plant images (people, cars, animals, household objects).
- **Academic Rigor**: Authentic Softmax probability distributions, empirical loss/accuracy trajectories, confusion matrix analysis, and pathogen profiles compiled from agricultural literature.

---

## ✨ Key Features

1. **Leaf Image Diagnostic Portal**:
   - Drag-and-drop or select JPG, JPEG, PNG, or WEBP leaf photographs.
   - Pre-loaded benchmark samples (Tomato, Potato, Apple, Corn) for instant 1-click demonstration.
2. **Deep CNN Inference Pipeline**:
   - MobileNetV2 Deep Convolutional Neural Network trained on PlantVillage 38 classes.
   - Confidence-ranked top alternative predictions revealing diagnostic certainty and ambiguity.
3. **Agronomic Disease Profiles**:
   - Causal pathogen identification (fungal, bacterial, viral, or healthy).
   - Diagnostic symptoms checklist and university-backed cultural and chemical sanitation guidelines.
4. **Session Prediction History**:
   - Real-time logging of analyzed leaves with timestamps and confidence scores.
   - Easy one-click session reset.
5. **Interactive Dataset & Model Exploration**:
   - Searchable and filterable 38-class PlantVillage inventory.
   - Stratified 70% / 15% / 15% train/val/test distribution charts.
   - Empirical convergence curves and test partition confusion matrix.

---

## 🛠️ Technology Stack

### Machine Learning & Backend
- **Python**: 3.10+
- **Deep Learning Backbones**: MobileNetV2 / TensorFlow 2.x & PyTorch
- **API Framework**: FastAPI + Uvicorn
- **Image Processing**: OpenCV (headless), Pillow (PIL), NumPy
- **Evaluation & Validation**: Scikit-Learn

### Web Frontends
- **Streamlit Application**: Standalone, interactive multi-page dashboard (`app.py`) for Streamlit Community Cloud.
- **Modern Web Application**: React 19, TypeScript, Vite 8, Tailwind CSS v4, Lucide Icons, Recharts.

---

## 📂 Project Structure

```
CropDetect-AI/
│
├── app.py                             # Streamlit Community Cloud application entry point
├── requirements.txt                   # Production Python dependencies
├── README.md                          # Comprehensive project documentation
├── .gitignore                         # Git exclusion rules (ignores >100MB models, secrets, node_modules)
├── train_crop_disease_model.ipynb     # Google Colab GPU training notebook
├── sample_images/                     # Benchmark test leaves for demonstration
│
├── backend/
│   ├── app.py                         # FastAPI REST API & route handlers
│   ├── requirements.txt               # Backend dependencies
│   ├── services/
│   │   ├── prediction_service.py      # Core CNN inference & knowledge retrieval
│   │   ├── plant_validator.py         # Out-of-Distribution (OOD) & non-plant validator
│   │   └── preprocessing.py           # Image validation, resizing & tensor scaling
│   ├── model/
│   │   ├── plantvillage_mobilenet_v2/ # Pretrained MobileNetV2 weights (9.2 MB)
│   │   ├── class_names.json           # 38 PlantVillage target labels
│   │   ├── model_config.json          # Architecture layers & hyperparameters
│   │   └── training_metrics.json      # Evaluation metrics & confusion matrix
│   └── data/
│       ├── disease_information.json   # Pathological profiles & management practices
│       └── dataset_metadata.json      # Dataset distribution & class inventory
│
└── frontend/
    ├── index.html                     # HTML5 shell
    ├── package.json                   # React dependencies & scripts
    ├── vite.config.ts                 # Vite bundler configuration
    └── src/
        ├── components/                # Modular UI components (Navbar, UploadZone, etc.)
        └── pages/                     # Routed pages (Detect, Home, Dataset, Model, About)
```

---

## 💻 Local Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/Priyanshu-143/CropDetect-AI.git
cd CropDetect-AI
```

### 2. Set Up Python Environment
```bash
python -m venv venv
# On Windows:
venv\Scripts\activate
# On macOS / Linux:
source venv/bin/activate

pip install -r requirements.txt
```

---

## 🚀 Running Locally

### Option A: Streamlit Application (Quickest)
```bash
streamlit run app.py
```
The application will launch automatically in your browser at `http://localhost:8501`.

### Option B: Decoupled Full-Stack Application (FastAPI + React)

1. **Start the FastAPI Backend**:
   ```bash
   cd backend
   python -m uvicorn app:app --host 127.0.0.1 --port 8000 --reload
   ```

2. **Start the React Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

---

## ☁️ Streamlit Community Cloud Deployment

To deploy CropDetect AI on [Streamlit Community Cloud](https://streamlit.io/cloud):

1. **Fork or Push** this repository to your GitHub account (`CropDetect-AI`).
2. Navigate to [share.streamlit.io](https://share.streamlit.io/) and log in with GitHub.
3. Click **“New app”**.
4. Configure the deployment settings:
   - **Repository**: `<your-username>/CropDetect-AI`
   - **Branch**: `main`
   - **Main file path**: `app.py`
5. Click **“Deploy!”**. Streamlit will automatically install dependencies from `requirements.txt` and launch the web app.

---

## ⚠️ Academic & Practical Limitations

> **Real-World Notice**: Performance on real-world in-situ field photographs with complex natural backgrounds, variable sunlight angles, and partial occlusions may differ from controlled laboratory datasets like PlantVillage. Guidance provided represents general agronomic practices compiled from plant pathology literature. Always consult certified local agricultural extension specialists before applying chemical fungicides or treatments.

---

## 📜 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
