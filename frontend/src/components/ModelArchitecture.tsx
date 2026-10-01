import React, { useState } from 'react';
import { Layers, ArrowDown, Cpu, Sparkles, Filter, Grid, Sliders, CheckCircle2 } from 'lucide-react';
import { ModelLayer } from '../types';

interface ModelArchitectureProps {
  layers: ModelLayer[];
}

export const ModelArchitecture: React.FC<ModelArchitectureProps> = ({ layers }) => {
  const [selectedLayerIndex, setSelectedLayerIndex] = useState<number>(0);

  // Fallback default layer definitions matching the actual Keras Sequential model
  const defaultPipeline = [
    {
      name: 'Input Photograph',
      shape: 'Variable [JPG/PNG]',
      type: 'Raw Image Input',
      color: 'bg-gray-50 text-gray-800 border-gray-200',
      description: 'Receives user-uploaded leaf photograph from camera or gallery upload.',
    },
    {
      name: 'OOD Plant / Leaf Validator',
      shape: 'Multi-Stage Filter',
      type: 'Domain Integrity Gate',
      color: 'bg-emerald-100 text-[#166534] border-[#86EFAC]',
      description: 'Crucial Out-of-Distribution layer: combines Laplacian blur analysis, OpenCV biometric face/upperbody filter, HSV chlorophyll spectrum verification, and MobileNetV2 ImageNet classification to intercept non-plant images (people, cars, animals, everyday objects) before disease inference.',
    },
    {
      name: 'Preprocessing Rescaling',
      shape: '224 × 224 × 3',
      type: 'Scale [1/255.0]',
      color: 'bg-green-50 text-green-800 border-green-200',
      description: 'Maps 8-bit integer pixel values [0, 255] into normalized floating-point range [0.0, 1.0].',
    },
    {
      name: 'Convolution Block 1',
      shape: '32 Filters (3×3), ReLu + BN',
      type: 'Feature Extraction',
      color: 'bg-[#F0FDF4] text-[#15803D] border-[#86EFAC]',
      description: 'Captures low-level spatial features including leaf edges, chlorophyll lines, and surface texture gradients.',
    },
    {
      name: 'Max Pooling 1',
      shape: 'Pool Size (2×2)',
      type: 'Spatial Downsampling',
      color: 'bg-emerald-50/70 text-emerald-800 border-emerald-200',
      description: 'Reduces spatial grid to 112×112 while providing translational invariance for localized lesions.',
    },
    {
      name: 'Convolution Block 2',
      shape: '64 Filters (3×3), ReLu + BN',
      type: 'Feature Extraction',
      color: 'bg-[#F0FDF4] text-[#15803D] border-[#86EFAC]',
      description: 'Extracts intermediate geometric structures such as vein bifurcation patterns and leaf margins.',
    },
    {
      name: 'Max Pooling 2',
      shape: 'Pool Size (2×2)',
      type: 'Spatial Downsampling',
      color: 'bg-emerald-50/70 text-emerald-800 border-emerald-200',
      description: 'Downsamples feature map to 56×56 dimensions to expand effective receptive field.',
    },
    {
      name: 'Convolution Block 3',
      shape: '128 Filters (3×3), ReLu + BN',
      type: 'Feature Extraction',
      color: 'bg-[#F0FDF4] text-[#15803D] border-[#86EFAC]',
      description: 'Synthesizes complex disease symptom patterns: concentric necrotic rings, rust pustules, and fungal powdery patches.',
    },
    {
      name: 'Max Pooling 3',
      shape: 'Pool Size (2×2)',
      type: 'Spatial Downsampling',
      color: 'bg-emerald-50/70 text-emerald-800 border-emerald-200',
      description: 'Downsamples to 28×28 feature representations.',
    },
    {
      name: 'Convolution Block 4',
      shape: '128 Filters (3×3), ReLu + BN',
      type: 'Feature Extraction',
      color: 'bg-[#F0FDF4] text-[#15803D] border-[#86EFAC]',
      description: 'Learns abstract, high-level pathology indicators across diverse crop species.',
    },
    {
      name: 'Max Pooling 4',
      shape: 'Pool Size (2×2)',
      type: 'Spatial Downsampling',
      color: 'bg-emerald-50/70 text-emerald-800 border-emerald-200',
      description: 'Compresses to final 14×14 compact spatial representation.',
    },
    {
      name: 'Flatten Layer',
      shape: 'Vector (25,088 Dim)',
      type: 'Reshaping',
      color: 'bg-gray-50 text-gray-800 border-gray-200',
      description: 'Converts multidimensional feature maps into a 1D feature embedding vector.',
    },
    {
      name: 'Dense Fully-Connected',
      shape: '512 Neurons, ReLu',
      type: 'Dense Classification',
      color: 'bg-[#F0FDF4] text-[#166534] border-[#86EFAC]',
      description: 'High-capacity classification layer synthesizing extracted feature representations.',
    },
    {
      name: 'Dropout Regularization',
      shape: 'Rate 0.50 (50%)',
      type: 'Regularization',
      color: 'bg-amber-50 text-amber-800 border-amber-200',
      description: 'Randomly drops 50% of activations during training to prevent co-adaptation and overfitting.',
    },
    {
      name: 'Softmax Output Layer',
      shape: '38 Categorical Classes',
      type: 'Probability Distribution',
      color: 'bg-[#15803D] text-white border-[#166534]',
      description: 'Computes normalized multi-class probabilities summing strictly to 1.0 across all 38 PlantVillage classes.',
    },
  ];

  const selectedStep = defaultPipeline[selectedLayerIndex];

  return (
    <div className="bg-white rounded-2xl border border-[#DDE8DF] p-4 sm:p-6 lg:p-8 shadow-sm space-y-6 sm:space-y-8 w-full">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Cpu className="w-5 h-5 text-[#15803D]" />
          <h3 className="text-lg sm:text-xl font-bold text-[#17201A]">
            CNN Computational Pipeline
          </h3>
        </div>
        <p className="text-xs sm:text-sm text-gray-600">
          Interactive visual walkthrough of the custom 4-Block Deep Convolutional Neural Network.
        </p>
      </div>

      {/* Pipeline Flow Visualization */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start w-full">
        {/* Step list (left) */}
        <div className="md:col-span-7 space-y-2.5 max-h-[480px] sm:max-h-[520px] overflow-y-auto pr-1 sm:pr-2">
          {defaultPipeline.map((step, idx) => {
            const isSelected = selectedLayerIndex === idx;
            return (
              <div
                key={idx}
                onClick={() => setSelectedLayerIndex(idx)}
                className={`p-3 sm:p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between min-h-[44px] gap-2 ${
                  isSelected
                    ? 'border-[#15803D] bg-[#F0FDF4] shadow-xs'
                    : 'border-gray-100 bg-white hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                  <span
                    className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 ${
                      isSelected
                        ? 'bg-[#15803D] text-white'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-[#17201A] truncate">{step.name}</h4>
                    <p className="text-[10px] sm:text-[11px] text-gray-500 font-mono truncate">{step.shape}</p>
                  </div>
                </div>

                <span
                  className={`text-[9px] sm:text-[10px] font-semibold px-2 py-0.5 rounded-full border shrink-0 ${step.color}`}
                >
                  {step.type}
                </span>
              </div>
            );
          })}
        </div>

        {/* Selected Layer Details Card (right) */}
        <div className="md:col-span-5 md:sticky md:top-24 w-full">
          <div className="bg-[#F0FDF4]/70 border border-[#86EFAC] rounded-2xl p-4 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#15803D] uppercase tracking-wider">
                Layer {selectedLayerIndex + 1} of {defaultPipeline.length}
              </span>
              <span className="text-[11px] font-mono bg-white px-2 py-0.5 rounded border border-[#BBF7D0] text-gray-700">
                Keras Layer
              </span>
            </div>

            <h4 className="text-lg font-black text-[#17201A]">
              {selectedStep.name}
            </h4>

            <div className="p-3 bg-white rounded-xl border border-[#DDE8DF]">
              <span className="text-[11px] text-gray-400 uppercase font-semibold block mb-0.5">
                Output Tensor Dimension / Filter Specification
              </span>
              <span className="text-sm font-mono font-bold text-[#15803D]">
                {selectedStep.shape}
              </span>
            </div>

            <div>
              <span className="text-[11px] text-gray-400 uppercase font-semibold block mb-1">
                Mathematical Function & Purpose
              </span>
              <p className="text-xs text-gray-700 leading-relaxed bg-white p-3 rounded-xl border border-[#DDE8DF]">
                {selectedStep.description}
              </p>
            </div>

            <div className="pt-2 border-t border-[#BBF7D0]/60 flex items-center justify-between text-xs text-gray-600">
              <span>Activation Function:</span>
              <span className="font-mono font-bold text-[#15803D]">
                {selectedStep.name.includes('Softmax') ? 'Softmax' : selectedStep.name.includes('Block') || selectedStep.name.includes('Dense') ? 'ReLU' : 'Linear'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
