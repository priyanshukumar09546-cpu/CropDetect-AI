"""
FastAPI Application for CropDetect AI.
Exposes real REST endpoints for Crop Disease Detection Using Convolutional Neural Networks.
"""
import os
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, File, UploadFile, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from services.prediction_service import PredictionService

logger = logging.getLogger("agri_api")
logging.basicConfig(level=logging.INFO)

# Global service instance holder
prediction_service: PredictionService = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initializes and loads ML assets on server startup."""
    global prediction_service
    logger.info("Initializing AgriLeaf Prediction Service and CNN model...")
    prediction_service = PredictionService.get_instance()
    logger.info(f"Model loaded status: {prediction_service.is_model_loaded}")
    yield
    logger.info("Shutting down AgriLeaf backend service.")

app = FastAPI(
    title="CropDetect AI Backend API",
    description="Convolutional Neural Network (CNN) Service for Crop Disease Identification",
    version="1.0.0",
    lifespan=lifespan
)

# CORS Middleware for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {
        "project": "Crop Disease Detection Using Convolutional Neural Networks",
        "brand": "CropDetect AI",
        "status": "online",
        "endpoints": {
            "predict": "POST /api/predict",
            "model_info": "GET /api/model-info",
            "dataset_info": "GET /api/dataset-info",
            "health": "GET /api/health",
            "docs": "/docs"
        }
    }

@app.get("/api/health")
def get_health():
    """Health check endpoint confirming service status and model readiness."""
    global prediction_service
    if prediction_service is None:
        prediction_service = PredictionService.get_instance()
    return prediction_service.get_health_status()

@app.get("/api/model-info")
def get_model_info():
    """Provides CNN architecture details, layer parameters, and training metrics."""
    global prediction_service
    if prediction_service is None:
        prediction_service = PredictionService.get_instance()
    return prediction_service.get_model_info()

@app.get("/api/dataset-info")
def get_dataset_info():
    """Provides PlantVillage dataset structure, sample counts, and split distributions."""
    global prediction_service
    if prediction_service is None:
        prediction_service = PredictionService.get_instance()
    return prediction_service.get_dataset_info()

@app.post("/api/predict")
async def predict_crop_disease(image: UploadFile = File(...)):
    """
    Accepts multipart/form-data leaf image upload.
    Validates image, performs preprocessing, runs CNN inference,
    and returns predicted crop, disease status, confidence, and management guidelines.
    """
    global prediction_service
    if prediction_service is None:
        prediction_service = PredictionService.get_instance()

    if not image:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No image file provided. Please upload a valid crop leaf image."
        )

    # Validate content-type or filename
    filename = image.filename or "unknown.jpg"
    valid_content_types = [
        "image/jpeg", "image/png", "image/jpg", "image/webp", "image/jfif", "application/octet-stream"
    ]
    if image.content_type and image.content_type.lower() not in valid_content_types:
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={
                "success": False,
                "error_type": "INVALID_IMAGE",
                "message": f"Invalid file format '{image.content_type}'. Please upload a JPG, JPEG, PNG, or WEBP image."
            }
        )

    try:
        image_bytes = await image.read()
    except Exception as err:
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={
                "success": False,
                "error_type": "INVALID_IMAGE",
                "message": f"Failed to read image data: {str(err)}"
            }
        )

    try:
        result = prediction_service.predict(image_bytes=image_bytes, filename=filename)
        return JSONResponse(status_code=status.HTTP_200_OK, content=result)
    except ValueError as ve:
        # Validation error (size, corrupt, invalid dimensions, format)
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={
                "success": False,
                "error_type": "INVALID_IMAGE",
                "message": str(ve)
            }
        )
    except RuntimeError as re:
        # Model not loaded or unavailable
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={
                "success": False,
                "error_type": "MODEL_ERROR",
                "message": str(re)
            }
        )
    except Exception as ex:
        logger.error(f"Inference pipeline exception: {ex}", exc_info=True)
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={
                "success": False,
                "error_type": "MODEL_ERROR",
                "message": f"An unexpected error occurred during CNN inference: {str(ex)}"
            }
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="127.0.0.1", port=8000, reload=True)
