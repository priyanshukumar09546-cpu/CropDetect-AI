import React from 'react';
import { Scan, Sparkles, Activity, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const LeafScannerVisual: React.FC = () => {
  return (
    <div className="relative w-full max-w-lg mx-auto">
      {/* Background glow behind card */}
      <div className="absolute -inset-2 bg-gradient-to-r from-emerald-100 to-green-100 rounded-3xl blur-xl opacity-60 pointer-events-none" />

      {/* Main Container Card */}
      <div className="relative bg-white rounded-2xl border border-[#DDE8DF] p-4 sm:p-6 shadow-xl overflow-hidden w-full">
        {/* Top HUD Header */}
        <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-gray-100 mb-3 sm:mb-4">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#15803D]"></span>
            </span>
            <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-gray-700">
              CNN Model Scanner
            </span>
          </div>
          <span className="text-[11px] sm:text-xs font-mono text-[#15803D] bg-[#F0FDF4] px-2 py-0.5 rounded border border-[#BBF7D0]">
            RGB [224x224x3]
          </span>
        </div>

        {/* Leaf Graphic with Scanning Frame */}
        <div className="relative h-60 sm:h-72 md:h-80 w-full bg-gradient-to-b from-[#F0FDF4]/80 to-[#DCFCE7]/30 rounded-xl border border-[#DDE8DF] overflow-hidden flex items-center justify-center">
          {/* Subtle grid pattern overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#15803D0D_1px,transparent_1px),linear-gradient(to_bottom,#15803D0D_1px,transparent_1px)] bg-[size:16px_16px]" />

          {/* Corner target reticles */}
          <div className="absolute top-2 left-2 sm:top-3 sm:left-3 w-4 h-4 sm:w-5 sm:h-5 border-t-2 border-l-2 border-[#15803D]" />
          <div className="absolute top-2 right-2 sm:top-3 sm:right-3 w-4 h-4 sm:w-5 sm:h-5 border-t-2 border-r-2 border-[#15803D]" />
          <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 w-4 h-4 sm:w-5 sm:h-5 border-b-2 border-l-2 border-[#15803D]" />
          <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 w-4 h-4 sm:w-5 sm:h-5 border-b-2 border-r-2 border-[#15803D]" />

          {/* Realistic High-Res Agricultural Leaf SVG */}
          <svg
            viewBox="0 0 200 240"
            className="w-40 h-48 sm:w-52 sm:h-60 md:w-56 md:h-64 drop-shadow-md transition-transform duration-700 hover:scale-102"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Stem */}
            <path
              d="M100 230 C98 200 95 180 97 150"
              stroke="#5D4037"
              strokeWidth="5"
              strokeLinecap="round"
            />
            {/* Leaf Body Outer Shadow/Glow */}
            <path
              d="M100 25 C145 60 170 120 150 175 C130 220 102 225 100 225 C98 225 70 220 50 175 C30 120 55 60 100 25 Z"
              fill="#15803D"
              opacity="0.9"
            />
            {/* Left Leaf Blade Gradient Layer */}
            <path
              d="M100 25 C75 60 45 110 52 165 C58 200 85 220 100 225 Z"
              fill="#16A34A"
            />
            {/* Right Leaf Blade Subtle Highlight */}
            <path
              d="M100 25 C125 60 155 110 148 165 C142 200 115 220 100 225 Z"
              fill="#22C55E"
              opacity="0.95"
            />
            {/* Main Central Vein */}
            <path
              d="M100 30 C100 80 99 150 100 225"
              stroke="#86EFAC"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            {/* Lateral Veins Left */}
            <path d="M100 60 C85 52 72 58 64 68" stroke="#86EFAC" strokeWidth="2" strokeLinecap="round" opacity="0.85" />
            <path d="M100 90 C80 80 65 92 56 108" stroke="#86EFAC" strokeWidth="2" strokeLinecap="round" opacity="0.85" />
            <path d="M100 125 C78 118 63 132 55 150" stroke="#86EFAC" strokeWidth="2" strokeLinecap="round" opacity="0.85" />
            <path d="M100 160 C85 158 72 170 66 186" stroke="#86EFAC" strokeWidth="2" strokeLinecap="round" opacity="0.85" />
            {/* Lateral Veins Right */}
            <path d="M100 60 C115 52 128 58 136 68" stroke="#86EFAC" strokeWidth="2" strokeLinecap="round" opacity="0.85" />
            <path d="M100 90 C120 80 135 92 144 108" stroke="#86EFAC" strokeWidth="2" strokeLinecap="round" opacity="0.85" />
            <path d="M100 125 C122 118 137 132 145 150" stroke="#86EFAC" strokeWidth="2" strokeLinecap="round" opacity="0.85" />
            <path d="M100 160 C115 158 128 170 134 186" stroke="#86EFAC" strokeWidth="2" strokeLinecap="round" opacity="0.85" />
          </svg>

          {/* Animated AI Scanning Line */}
          <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#22C55E] to-transparent shadow-[0_0_12px_#15803D] animate-scanline pointer-events-none" />

          {/* Central Target Reticle */}
          <div className="absolute w-16 h-16 sm:w-20 sm:h-20 rounded-full border border-dashed border-[#15803D]/60 pointer-events-none animate-spin" style={{ animationDuration: '18s' }} />

          {/* Floating HUD Label 1: Feature Extraction */}
          <div className="absolute top-2 left-2 sm:top-4 sm:left-4 bg-white/90 backdrop-blur-xs px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md border border-[#BBF7D0] shadow-xs flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-[11px] font-medium text-gray-800">
            <Activity className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#15803D]" />
            Feature Map
          </div>

          {/* Floating HUD Label 2: 38 Disease Classes */}
          <div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 bg-white/90 backdrop-blur-xs px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md border border-[#BBF7D0] shadow-xs flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-[11px] font-medium text-gray-800">
            <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#15803D]" />
            38 Classes
          </div>
        </div>

        {/* Bottom Status Panel */}
        <div className="mt-3 sm:mt-4 pt-2.5 sm:pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] sm:text-xs">
          <div className="flex items-center gap-1.5 sm:gap-2 text-gray-600">
            <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#15803D]" />
            <span>Real-time Inference</span>
          </div>
          <div className="flex items-center gap-1 text-[#15803D] font-semibold">
            <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span>TensorFlow / Keras 3</span>
          </div>
        </div>
      </div>
    </div>
  );
};
