import React from 'react';
import { AlertOctagon, HelpCircle, ArrowLeft, RefreshCw, ShieldAlert, Sparkles } from 'lucide-react';
import { TopPrediction } from '../types';

interface InvalidImageStateProps {
  errorType: 'INVALID_IMAGE' | 'LOW_CONFIDENCE' | 'MODEL_ERROR';
  message: string;
  confidence?: number;
  threshold?: number;
  topPredictions?: TopPrediction[];
  onUploadAnother: () => void;
}

export const InvalidImageState: React.FC<InvalidImageStateProps> = ({
  errorType,
  message,
  confidence,
  threshold,
  topPredictions,
  onUploadAnother,
}) => {
  if (errorType === 'LOW_CONFIDENCE') {
    return (
      <div className="bg-white rounded-2xl border-2 border-amber-300 p-5 sm:p-8 shadow-sm space-y-5 sm:space-y-6 animate-fadeIn w-full">
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center mx-auto">
          <HelpCircle className="w-6 h-6 sm:w-7 sm:h-7" />
        </div>

        <div className="text-center space-y-2 max-w-md mx-auto">
          <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider bg-amber-100/70 px-2.5 py-0.5 rounded-full border border-amber-200">
            Uncertain Inference
          </span>
          <h3 className="text-lg sm:text-xl font-extrabold text-[#17201A]">
            Unable to Confidently Identify Disease
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            {message}
          </p>
        </div>

        {/* Confidence metric indicator */}
        {confidence !== undefined && threshold !== undefined && (
          <div className="p-3 sm:p-4 rounded-xl bg-amber-50/50 border border-amber-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <span className="text-gray-600">Model Diagnostic Confidence:</span>
            <span className="font-mono font-bold text-amber-800">
              {confidence.toFixed(1)}% (Threshold: {threshold.toFixed(0)}%)
            </span>
          </div>
        )}

        {/* Tentative matches if available */}
        {topPredictions && topPredictions.length > 0 && (
          <div className="pt-2 border-t border-gray-100">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-2">
              Tentative Low-Probability Matches (Unverified)
            </span>
            <div className="space-y-1.5">
              {topPredictions.slice(0, 3).map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between text-xs p-2 rounded-lg bg-gray-50 border border-gray-100 text-gray-600 gap-2"
                >
                  <span className="truncate">
                    {item.crop} — {item.disease}
                  </span>
                  <span className="font-mono font-semibold shrink-0">{item.confidence.toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="pt-2 flex justify-center">
          <button
            type="button"
            onClick={onUploadAnother}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold bg-[#15803D] text-white hover:bg-[#166534] shadow-md transition-all active:scale-98 cursor-pointer min-h-[44px]"
          >
            <ArrowLeft className="w-4 h-4" />
            Upload Another Image
          </button>
        </div>
      </div>
    );
  }

  // Dedicated INVALID_IMAGE State (Non-leaf, Human, Object, Car, Blank, etc.)
  return (
    <div className="bg-white rounded-2xl border-2 border-red-300 p-5 sm:p-8 lg:p-10 shadow-sm text-center space-y-5 sm:space-y-6 animate-fadeIn w-full">
      {/* Red/Amber Warning Disc */}
      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-red-50 text-red-600 border border-red-200 flex items-center justify-center mx-auto shadow-xs">
        <AlertOctagon className="w-7 h-7 sm:w-8 sm:h-8" />
      </div>

      <div className="space-y-2 max-w-md mx-auto">
        <span className="text-[11px] font-bold text-red-700 uppercase tracking-wider bg-red-100/70 px-3 py-1 rounded-full border border-red-200">
          Validation Interception
        </span>
        <h3 className="text-xl sm:text-2xl font-black text-[#17201A] tracking-tight">
          Image Not Suitable
        </h3>
        <p className="text-xs sm:text-sm font-semibold text-red-700">
          This image does not appear to contain a crop or plant leaf.
        </p>
        <p className="text-xs text-gray-500 leading-relaxed pt-1">
          {message || 'Please upload a clear photograph of a crop leaf for disease detection.'}
        </p>
      </div>

      {/* Guidelines reminder box */}
      <div className="max-w-md mx-auto p-3.5 sm:p-4 rounded-xl bg-gray-50 border border-gray-200 text-left text-xs space-y-1.5 text-gray-600">
        <span className="font-bold text-[#17201A] block mb-1">
          Requirements for Crop Disease Analysis:
        </span>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#15803D] shrink-0" />
          <span>Foliage or leaf blade must be clearly visible</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
          <span>No people, faces, human bodies, animals, or vehicles</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
          <span>No screenshots, blurry photos, or random household items</span>
        </div>
      </div>

      {/* Primary Action Button */}
      <div className="pt-2 flex justify-center">
        <button
          type="button"
          onClick={onUploadAnother}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold bg-[#15803D] text-white hover:bg-[#166534] shadow-md hover:shadow-lg transition-all active:scale-98 cursor-pointer min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4" />
          Upload Another Image
        </button>
      </div>
    </div>
  );
};
