import React from 'react';
import { ShieldCheck, AlertTriangle, CheckCircle2, ChevronRight, BarChart3 } from 'lucide-react';
import type { PredictionSuccessResponse } from '../types';
import { ConfidenceBar } from './ConfidenceBar';

interface PredictionCardProps {
  prediction: PredictionSuccessResponse;
}

export const PredictionCard: React.FC<PredictionCardProps> = ({ prediction }) => {
  const isHealthy = prediction.status.toLowerCase() === 'healthy';

  return (
    <div className="bg-white rounded-2xl border border-[#DDE8DF] p-4 sm:p-6 shadow-sm space-y-5 sm:space-y-6 w-full">
      {/* Header Badge */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3 sm:pb-4">
        <div className="flex items-center gap-2">
          <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-gray-500">
            CNN Classification Result
          </span>
        </div>
        <div
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border shrink-0 ${
            isHealthy
              ? 'bg-[#DCFCE7] text-[#166534] border-[#86EFAC]'
              : 'bg-amber-50 text-amber-800 border-amber-200'
          }`}
        >
          {isHealthy ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-[#15803D]" />
              <span>Plant Healthy</span>
            </>
          ) : (
            <>
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              <span>Pathology Detected</span>
            </>
          )}
        </div>
      </div>

      {/* Primary Diagnosis Highlight */}
      <div className="bg-[#F0FDF4] rounded-xl p-4 sm:p-5 border border-[#BBF7D0]">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
          <div>
            <span className="text-[11px] sm:text-xs text-gray-500 font-medium uppercase tracking-wider block">
              Identified Crop
            </span>
            <span className="text-xl sm:text-2xl font-extrabold text-[#17201A] break-words">
              {prediction.crop}
            </span>
          </div>

          <div>
            <span className="text-[11px] sm:text-xs text-gray-500 font-medium uppercase tracking-wider block">
              Pathological Status
            </span>
            <span
              className={`text-xl sm:text-2xl font-extrabold break-words ${
                isHealthy ? 'text-[#15803D]' : 'text-amber-700'
              }`}
            >
              {prediction.status}
            </span>
          </div>
        </div>

        <div className="pt-3 border-t border-[#DDE8DF]">
          <span className="text-[11px] sm:text-xs text-gray-500 font-medium uppercase tracking-wider block mb-1">
            Diagnosis / Condition
          </span>
          <span className="text-xl sm:text-2xl font-black text-[#15803D] break-words leading-tight block">
            {prediction.disease}
          </span>
        </div>

        {/* Primary Confidence Indicator */}
        <div className="mt-4 pt-2">
          <ConfidenceBar percentage={prediction.confidence} size="lg" />
        </div>
      </div>

      {/* Top Alternative Predictions (Ranked) */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <BarChart3 className="w-4 h-4 text-[#15803D]" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#17201A]">
            Top Alternative Predictions
          </h4>
        </div>

        <div className="space-y-2.5">
          {prediction.top_predictions.map((top, index) => {
            const isTop1 = index === 0;
            return (
              <div
                key={top.raw_class}
                className={`p-3 rounded-xl border transition-all ${
                  isTop1
                    ? 'bg-white border-[#86EFAC] shadow-2xs'
                    : 'bg-gray-50/50 border-gray-100 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-semibold mb-1.5 gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold shrink-0 ${
                        isTop1
                          ? 'bg-[#15803D] text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {index + 1}
                    </span>
                    <span className="text-gray-900 font-medium truncate">
                      {top.crop} — {top.disease}
                    </span>
                  </div>
                  <span className="font-mono text-gray-700 font-bold shrink-0 text-xs sm:text-sm">
                    {top.confidence.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isTop1 ? 'bg-[#15803D]' : 'bg-gray-400'
                    }`}
                    style={{ width: `${top.confidence}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
