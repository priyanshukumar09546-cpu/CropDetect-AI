import { PredictionResponse, ModelInfo, DatasetMetadata, HealthStatus } from '../types';
import {
  isRunningInIframe,
  requestStreamlitPrediction,
  getCachedBridgeMetadata,
} from './streamlitBridge';

const API_BASE = '/api';

export class ApiError extends Error {
  statusCode?: number;
  constructor(message: string, statusCode?: number) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
  }
}

export async function predictCropDisease(file: File): Promise<PredictionResponse> {
  // Client-side validations
  if (!file) {
    throw new ApiError('No file selected. Please choose a crop leaf image.');
  }

  const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'image/jfif'];
  const ext = file.name.split('.').pop()?.toLowerCase();
  if (!validTypes.includes(file.type) && !['jpg', 'jpeg', 'png', 'webp', 'jfif'].includes(ext || '')) {
    throw new ApiError('Please upload a JPG, JPEG, PNG, or WEBP image.');
  }

  const MAX_SIZE = 10 * 1024 * 1024; // 10MB
  if (file.size > MAX_SIZE) {
    throw new ApiError('Image size exceeds the allowed limit of 10 MB.');
  }

  if (file.size < 1024) {
    throw new ApiError('Image file is too small or corrupt. Minimum size is 1 KB.');
  }

  // 1. If running inside Streamlit component iframe, communicate with Python backend via bridge
  if (isRunningInIframe()) {
    try {
      const bridgeResult = await requestStreamlitPrediction(file);
      if (bridgeResult) {
        return bridgeResult;
      }
    } catch (stErr: any) {
      console.warn('Streamlit bridge prediction failed, attempting HTTP fallback:', stErr);
    }
  }

  // 2. Standalone / FastAPI / Local development fallback via HTTP
  const formData = new FormData();
  formData.append('image', file);

  try {
    const response = await fetch(`${API_BASE}/predict`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      let errorMsg = 'Failed to analyze crop leaf.';
      try {
        const errorData = await response.json();
        errorMsg = errorData.detail || errorMsg;
      } catch {
        if (response.status === 503) {
          errorMsg = 'Prediction service is currently unavailable. The CNN model is loading or offline.';
        } else if (response.status === 404) {
          errorMsg = 'API endpoint not found. Please ensure the backend is running.';
        }
      }
      throw new ApiError(errorMsg, response.status);
    }

    const data: PredictionResponse = await response.json();
    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Prediction service is currently unavailable. Please start the backend and try again.');
  }
}

export async function getModelInfo(): Promise<ModelInfo | null> {
  const cached = getCachedBridgeMetadata().modelInfo;
  if (cached) return cached;

  try {
    const response = await fetch(`${API_BASE}/model-info`);
    if (!response.ok) {
      return null;
    }
    return await response.json();
  } catch (error) {
    console.warn('Failed to load model info from backend:', error);
    return null;
  }
}

export async function getDatasetInfo(): Promise<DatasetMetadata | null> {
  const cached = getCachedBridgeMetadata().datasetInfo;
  if (cached) return cached;

  try {
    const response = await fetch(`${API_BASE}/dataset-info`);
    if (!response.ok) {
      return null;
    }
    return await response.json();
  } catch (error) {
    console.warn('Failed to load dataset info from backend:', error);
    return null;
  }
}

export async function getHealth(): Promise<HealthStatus | null> {
  const cached = getCachedBridgeMetadata().healthStatus;
  if (cached) return cached;

  try {
    const response = await fetch(`${API_BASE}/health`);
    if (!response.ok) {
      return null;
    }
    return await response.json();
  } catch (error) {
    return null;
  }
}
