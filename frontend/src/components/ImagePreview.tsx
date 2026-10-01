import React from 'react';
import { Trash2, Sparkles, CheckCircle2 } from 'lucide-react';

interface ImagePreviewProps {
  file: File;
  previewUrl: string;
  onRemove: () => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({
  file,
  previewUrl,
  onRemove,
  onAnalyze,
  isAnalyzing,
}) => {
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="space-y-4 w-full">
      <div className="flex items-center justify-between">
        <h3 className="text-sm sm:text-base font-bold text-[#17201A] flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#15803D]" />
          Selected Leaf Image
        </h3>
        <span className="text-xs text-gray-500 font-mono">
          {formatFileSize(file.size)}
        </span>
      </div>

      {/* Preview Container */}
      <div className="relative rounded-xl border border-[#DDE8DF] overflow-hidden bg-gray-50 max-h-72 sm:max-h-80 md:max-h-96 flex items-center justify-center w-full">
        <img
          src={previewUrl}
          alt="Selected crop leaf for disease classification"
          className="w-full h-auto max-h-72 sm:max-h-80 md:max-h-96 object-contain rounded-xl"
        />
        {/* Subtle filename badge */}
        <div className="absolute bottom-2 right-2 max-w-[80%] truncate px-2 py-1 rounded bg-black/60 backdrop-blur-xs text-[11px] font-mono text-white">
          {file.name}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 pt-1">
        <button
          type="button"
          onClick={onRemove}
          disabled={isAnalyzing}
          className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 border border-gray-200 transition-colors cursor-pointer disabled:opacity-50 min-h-[44px]"
        >
          <Trash2 className="w-4 h-4 text-gray-500" />
          Remove
        </button>

        <button
          type="button"
          onClick={onAnalyze}
          disabled={isAnalyzing}
          className="w-full sm:flex-[2] inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold bg-[#15803D] text-white hover:bg-[#166534] shadow-md hover:shadow-lg transition-all active:scale-98 cursor-pointer disabled:opacity-60 min-h-[44px]"
        >
          <Sparkles className="w-4 h-4 text-emerald-200 animate-pulse" />
          Analyze Leaf
        </button>
      </div>
    </div>
  );
};
