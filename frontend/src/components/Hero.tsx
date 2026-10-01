import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Cpu } from 'lucide-react';
import { LeafScannerVisual } from './LeafScannerVisual';

interface HeroProps {
  onDetectClick: () => void;
  onModelClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onDetectClick, onModelClick }) => {
  return (
    <section className="relative overflow-hidden bg-agri-pattern py-10 sm:py-16 lg:py-20">
      {/* Decorative subtle ambient circles */}
      <div className="absolute top-10 left-1/4 w-72 h-72 bg-emerald-100/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-green-100/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
          {/* Left Column: Headline and Actions */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-6 text-center lg:text-left">
            {/* Green Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#DCFCE7] text-[#166534] border border-[#86EFAC] shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#15803D]" />
              <span>AI-POWERED CROP HEALTH ANALYSIS</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-[#17201A] tracking-tight leading-[1.15]">
              Detect Crop Diseases <br className="hidden sm:inline" />
              with <span className="text-[#15803D] inline-block">Deep Learning</span>
            </h1>

            {/* Description */}
            <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Upload a crop leaf image and use a convolutional neural network to identify potential diseases with confidence-based predictions.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-1 sm:pt-2">
              <button
                onClick={onDetectClick}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl text-base font-semibold bg-[#15803D] text-white hover:bg-[#166534] shadow-md hover:shadow-lg transition-all active:scale-98 cursor-pointer min-h-[44px]"
              >
                <ShieldCheck className="w-5 h-5 text-emerald-200" />
                <span>Detect Disease</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onModelClick}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-base font-semibold bg-white text-[#15803D] border border-[#86EFAC] hover:bg-[#F0FDF4] transition-all cursor-pointer shadow-2xs min-h-[44px]"
              >
                <Cpu className="w-5 h-5 text-[#15803D]" />
                <span>Explore Model</span>
              </button>
            </div>

            {/* Trust points */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-gray-500 font-medium">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#15803D]" />
                <span>PlantVillage Trained Dataset</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#15803D]" />
                <span>38 Category Multi-Class CNN</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#15803D]" />
                <span>Confidence-Ranked Inference</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Leaf Scanning Card */}
          <div className="lg:col-span-5 flex justify-center">
            <LeafScannerVisual />
          </div>
        </div>
      </div>
    </section>
  );
};
