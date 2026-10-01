import React, { useRef, useState } from 'react';
import { UploadCloud, Image as ImageIcon, AlertCircle, Sparkles } from 'lucide-react';

interface UploadZoneProps {
  onImageSelected: (file: File) => void;
  onSampleSelected?: (samplePath: string, name: string) => void;
  error?: string | null;
}

export const UploadZone: React.FC<UploadZoneProps> = ({
  onImageSelected,
  onSampleSelected,
  error,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onImageSelected(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onImageSelected(e.target.files[0]);
    }
  };

  const sampleLeaves = [
    { label: 'Tomato Late Blight', filename: 'tomato_late_blight_leaf.jpg', crop: 'Tomato' },
    { label: 'Tomato Healthy', filename: 'tomato_healthy_leaf.jpg', crop: 'Tomato' },
    { label: 'Potato Early Blight', filename: 'potato_early_blight_leaf.jpg', crop: 'Potato' },
    { label: 'Apple Cedar Rust', filename: 'apple_rust_leaf.jpg', crop: 'Apple' },
    { label: 'Corn Common Rust', filename: 'corn_common_rust_leaf.jpg', crop: 'Corn' },
  ];

  const loadSample = async (filename: string, label: string) => {
    try {
      // Fetch sample leaf from root or backend
      const res = await fetch(`/sample_images/${filename}`);
      if (!res.ok) {
        // Try fallback direct path
        const res2 = await fetch(`http://127.0.0.1:8000/sample_images/${filename}`);
        if (!res2.ok) throw new Error('Sample not found');
        const blob = await res2.blob();
        const file = new File([blob], filename, { type: 'image/jpeg' });
        onImageSelected(file);
        return;
      }
      const blob = await res.blob();
      const file = new File([blob], filename, { type: 'image/jpeg' });
      onImageSelected(file);
    } catch {
      // If fetching static file fails, notify handler
      if (onSampleSelected) {
        onSampleSelected(filename, label);
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Drag & Drop Card */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-5 sm:p-8 lg:p-10 text-center transition-all cursor-pointer ${
          isDragOver
            ? 'border-[#15803D] bg-[#F0FDF4] scale-[1.01]'
            : 'border-[#DDE8DF] hover:border-[#86EFAC] bg-[#F0FDF4]/30 hover:bg-[#F0FDF4]/60'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.webp,.jfif,image/jpeg,image/png,image/webp"
          onChange={handleFileChange}
          className="hidden"
          id="crop-leaf-upload-input"
        />

        <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-white border border-[#DDE8DF] text-[#15803D] flex items-center justify-center shadow-xs mb-3 sm:mb-4">
          <UploadCloud className="w-6 h-6 sm:w-8 sm:h-8" />
        </div>

        <h3 className="text-base sm:text-lg font-bold text-[#17201A]">
          Upload a crop leaf image
        </h3>
        <p className="text-xs sm:text-sm text-gray-500 mt-1 mb-4 sm:mb-5">
          Drag and drop your file here, or browse from device
        </p>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            fileInputRef.current?.click();
          }}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 sm:py-2.5 rounded-xl text-sm font-semibold bg-[#15803D] text-white hover:bg-[#166534] shadow-xs hover:shadow-md transition-all cursor-pointer min-h-[44px]"
        >
          <ImageIcon className="w-4 h-4 text-emerald-200" />
          Choose Image
        </button>

        <p className="text-[11px] sm:text-xs text-gray-400 mt-3 sm:mt-4">
          Supports PNG, JPG, JPEG, or WEBP (Max 10 MB)
        </p>
      </div>

      {/* Guidance Helper Note */}
      <div className="px-3.5 py-2.5 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] text-[11px] text-[#166534] flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-[#15803D] shrink-0" />
        <span className="leading-relaxed">
          Upload a clear image showing the plant leaf. Avoid people, objects, screenshots, or heavily obstructed images.
        </span>
      </div>

      {/* Validation Error Alert */}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-start gap-3 text-sm animate-fadeIn">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-semibold block mb-0.5">Upload Validation Error</span>
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Quick Test Samples */}
      <div className="bg-white rounded-xl border border-[#DDE8DF] p-4">
        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2.5">
          <Sparkles className="w-3.5 h-3.5 text-[#15803D]" />
          <span>Or test with benchmark sample leaves</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {sampleLeaves.map((sample) => (
            <button
              key={sample.filename}
              type="button"
              onClick={() => loadSample(sample.filename, sample.label)}
              className="text-xs font-medium px-3 py-1.5 rounded-lg bg-[#F0FDF4] text-[#15803D] border border-[#BBF7D0] hover:bg-[#DCFCE7] transition-colors cursor-pointer"
            >
              {sample.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
