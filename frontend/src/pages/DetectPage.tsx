import React, { useState } from 'react';
import { UploadZone } from '../components/UploadZone';
import { ImagePreview } from '../components/ImagePreview';
import { LoadingState } from '../components/LoadingState';
import { PredictionCard } from '../components/PredictionCard';
import { DiseaseInfo } from '../components/DiseaseInfo';
import { PredictionHistory } from '../components/PredictionHistory';
import { ErrorState } from '../components/ErrorState';
import { InvalidImageState } from '../components/InvalidImageState';
import type { PredictionResponse, PredictionSuccessResponse, PredictionErrorResponse, PredictionHistoryItem } from '../types';
import { predictCropDisease, ApiError } from '../services/api';
import { ShieldCheck, Sparkles, Image as ImageIcon } from 'lucide-react';

export const DetectPage: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<PredictionSuccessResponse | null>(null);
  const [errorResponse, setErrorResponse] = useState<PredictionErrorResponse | null>(null);
  const [history, setHistory] = useState<PredictionHistoryItem[]>([]);

  // Handle image selected from UploadZone
  const handleImageSelected = (file: File) => {
    setValidationError(null);
    setApiError(null);
    setPrediction(null);
    setErrorResponse(null);

    // Validate type
    const validExtensions = ['jpg', 'jpeg', 'png', 'webp', 'jfif'];
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!validExtensions.includes(ext || '')) {
      setValidationError('Please upload a JPG, JPEG, PNG, or WEBP image.');
      return;
    }

    // Validate size (10 MB)
    if (file.size > 10 * 1024 * 1024) {
      setValidationError('Image size exceeds the allowed limit of 10 MB.');
      return;
    }

    if (file.size < 1024) {
      setValidationError('Image file is too small or corrupt. Minimum size is 1 KB.');
      return;
    }

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  // Remove current image / Upload another
  const handleRemove = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    setPrediction(null);
    setErrorResponse(null);
    setValidationError(null);
    setApiError(null);
  };

  // Analyze leaf request
  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setIsAnalyzing(true);
    setApiError(null);
    setPrediction(null);
    setErrorResponse(null);

    try {
      const result: PredictionResponse = await predictCropDisease(selectedFile);

      if (result.success === true) {
        setPrediction(result);
        setErrorResponse(null);

        // Add to session history ONLY when plant validation passes AND accepted prediction produced
        const historyItem: PredictionHistoryItem = {
          id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          image_url: previewUrl || '',
          crop: result.crop,
          disease: result.disease,
          confidence: result.confidence,
          status: result.status,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          full_result: result,
        };

        setHistory((prev) => [historyItem, ...prev]);
      } else {
        // Intercepted by plant validation or uncertainty threshold
        setErrorResponse(result);
        setPrediction(null);
      }
    } catch (err: any) {
      const message =
        err instanceof ApiError
          ? err.message
          : 'Prediction service is currently unavailable. Please start the backend and try again.';
      setApiError(message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Restore prediction from session history
  const handleSelectHistoryItem = (item: PredictionHistoryItem) => {
    setPreviewUrl(item.image_url);
    setPrediction(item.full_result);
    setErrorResponse(null);
    setApiError(null);
    setValidationError(null);
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  // Clear session history
  const handleClearHistory = () => {
    setHistory([]);
  };

  return (
    <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 lg:py-12 space-y-8 sm:space-y-10">
      {/* Page Title */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#DCFCE7] text-[#166534] border border-[#86EFAC]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#15803D]" />
          <span>REAL-TIME CNN DIAGNOSTIC PORTAL</span>
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#17201A] tracking-tight">
          Crop Leaf Disease Detection
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 max-w-xl mx-auto">
          Upload a photograph of a crop leaf to identify signs of infection, evaluate pathology, and inspect alternative diagnoses.
        </p>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start w-full">
        {/* Left Column: Image Upload & Preview (Desktop & Mobile) */}
        <div className="lg:col-span-5 w-full min-w-0 space-y-6">
          <div className="bg-white rounded-2xl border border-[#DDE8DF] p-4 sm:p-6 shadow-sm w-full">
            <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#17201A] mb-4 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-[#15803D]" />
              Leaf Image Input
            </h2>

            {!selectedFile || !previewUrl ? (
              <UploadZone
                onImageSelected={handleImageSelected}
                error={validationError}
              />
            ) : (
              <ImagePreview
                file={selectedFile}
                previewUrl={previewUrl}
                onRemove={handleRemove}
                onAnalyze={handleAnalyze}
                isAnalyzing={isAnalyzing}
              />
            )}
          </div>

          {/* Desktop Only: Prediction History on Left Column */}
          <div className="hidden lg:block w-full">
            <PredictionHistory
              history={history}
              onSelect={handleSelectHistoryItem}
              onClear={handleClearHistory}
            />
          </div>
        </div>

        {/* Right Column: AI Analysis & Diagnosis Result */}
        <div className="lg:col-span-7 w-full min-w-0 space-y-6">
          {/* Backend Connection Error */}
          {apiError && (
            <ErrorState
              title="Prediction Service Unavailable"
              message={apiError}
              onRetry={handleAnalyze}
            />
          )}

          {/* Active AI Analysis Loading State */}
          {isAnalyzing && <LoadingState />}

          {/* Intercepted Invalid Image or Low Confidence State */}
          {!isAnalyzing && errorResponse && (
            <InvalidImageState
              errorType={errorResponse.error_type}
              message={errorResponse.message}
              confidence={errorResponse.confidence}
              threshold={errorResponse.threshold}
              topPredictions={errorResponse.top_predictions}
              onUploadAnother={handleRemove}
            />
          )}

          {/* Confirmed Diagnosis Result Card and Details */}
          {!isAnalyzing && prediction && (
            <div className="space-y-6 animate-fadeIn w-full min-w-0">
              <PredictionCard prediction={prediction} />
              <DiseaseInfo info={prediction.disease_info} />
            </div>
          )}

          {/* Empty Prompt State when no image analyzed yet */}
          {!isAnalyzing && !prediction && !errorResponse && !apiError && (
            <div className="bg-white rounded-2xl border border-[#DDE8DF] p-6 sm:p-10 lg:p-12 text-center shadow-xs w-full">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#F0FDF4] border border-[#BBF7D0] text-[#15803D] mx-auto flex items-center justify-center mb-4">
                <Sparkles className="w-7 h-7 sm:w-8 sm:h-8" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-[#17201A]">
                Inference Results Standby
              </h3>
              <p className="text-xs text-gray-500 mt-2 max-w-md mx-auto leading-relaxed">
                Select or drag a leaf photograph on the panel and click <strong>“Analyze Leaf”</strong> to generate a multi-class CNN diagnosis, confidence metrics, and agronomic management guidelines.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-2 sm:gap-3 text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#15803D]" /> Plant Leaf Validation
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#15803D]" /> OOD Filtering
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#15803D]" /> Softmax Confidence
                </span>
              </div>
            </div>
          )}

          {/* Mobile Only: Prediction History placed AFTER Prediction & Disease info */}
          <div className="block lg:hidden w-full pt-2">
            <PredictionHistory
              history={history}
              onSelect={handleSelectHistoryItem}
              onClear={handleClearHistory}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
