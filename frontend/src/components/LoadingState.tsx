import React, { useEffect, useState } from 'react';
import { Scan, Cpu, Layers, Sparkles, Check } from 'lucide-react';

interface LoadingStateProps {
  currentStage?: number;
}

export const LoadingState: React.FC<LoadingStateProps> = () => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    { label: 'Scanning leaf structure', desc: 'Validating RGB color space and edge contours', icon: Scan },
    { label: 'Extracting visual features', desc: 'Convolving 4 deep feature extraction blocks', icon: Layers },
    { label: 'Running CNN inference', desc: 'Computing Softmax probability distribution', icon: Cpu },
    { label: 'Generating prediction', desc: 'Cross-referencing disease pathology database', icon: Sparkles },
  ];

  useEffect(() => {
    const timer1 = setTimeout(() => setActiveStep(1), 500);
    const timer2 = setTimeout(() => setActiveStep(2), 1100);
    const timer3 = setTimeout(() => setActiveStep(3), 1800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  return (
    <div className="bg-white rounded-2xl border border-[#DDE8DF] p-8 shadow-sm text-center space-y-6">
      {/* Scanner Animation Disc */}
      <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
        {/* Pulsing ring */}
        <div className="absolute inset-0 rounded-full border-2 border-emerald-300 animate-ping opacity-30" />
        <div className="absolute inset-2 rounded-full border-2 border-[#15803D]/40 animate-pulse" />
        <div className="w-16 h-16 rounded-full bg-[#DCFCE7] flex items-center justify-center text-[#15803D] shadow-inner">
          <Scan className="w-8 h-8 animate-spin" style={{ animationDuration: '6s' }} />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold text-[#17201A]">
          AI Leaf Analysis in Progress
        </h3>
        <p className="text-xs text-gray-500 mt-1">
          Passing leaf matrix through the 4-Block Convolutional Neural Network
        </p>
      </div>

      {/* Pipeline Steps Tracker */}
      <div className="max-w-md mx-auto space-y-3 text-left">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isDone = idx < activeStep;
          const isCurrent = idx === activeStep;

          return (
            <div
              key={idx}
              className={`flex items-start gap-3.5 p-3 rounded-xl border transition-all duration-300 ${
                isCurrent
                  ? 'bg-[#F0FDF4] border-[#86EFAC] shadow-xs'
                  : isDone
                  ? 'bg-gray-50/60 border-gray-100 opacity-80'
                  : 'bg-white border-transparent opacity-40'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                  isDone
                    ? 'bg-[#15803D] text-white'
                    : isCurrent
                    ? 'bg-[#DCFCE7] text-[#15803D] ring-2 ring-[#86EFAC]'
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                {isDone ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-[#17201A] flex items-center justify-between">
                  <span>{step.label}</span>
                  {isCurrent && (
                    <span className="text-[10px] text-[#15803D] font-mono animate-pulse">
                      Processing...
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-gray-500 mt-0.5">
                  {step.desc}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
