import React from 'react';
import { Info, AlertTriangle, Lightbulb, Target, Layers, Cpu, Compass, CheckCircle2, ShieldCheck } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 lg:py-14 space-y-8 sm:space-y-12">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto space-y-2 sm:space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-[#DCFCE7] text-[#166534] border border-[#86EFAC]">
          <Info className="w-3.5 h-3.5 text-[#15803D]" />
          <span>RESEARCH & ACADEMIC DOCUMENTATION</span>
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#17201A] tracking-tight">
          About the Project
        </h1>
        <p className="text-xs sm:text-base text-gray-600 leading-relaxed max-w-2xl mx-auto">
          This project demonstrates how deep Convolutional Neural Networks (CNNs) can be utilized for automated image-based crop disease classification, providing rapid and accessible diagnostic support.
        </p>
      </div>

      {/* Prominent Real-World Limitations Banner */}
      <div className="bg-amber-50/90 border-2 border-amber-300 rounded-2xl p-4 sm:p-6 lg:p-8 text-amber-900 shadow-xs">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-200/80 flex items-center justify-center shrink-0 text-amber-800 mt-1">
            <AlertTriangle className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-amber-950">
              Critical Academic & Practical Limitation
            </h3>
            <p className="text-sm text-amber-900 leading-relaxed font-medium">
              “Performance on real-world field photographs may differ from performance on controlled dataset images.”
            </p>
            <p className="text-xs text-amber-800 leading-relaxed">
              Laboratory-curated datasets (such as PlantVillage) predominantly feature uniform grey or solid-color backgrounds, single-leaf framing, and controlled lighting. In contrast, in-situ agricultural field conditions introduce complex natural foliage backgrounds, varying sunlight angles, shadows, partial leaf occlusion, and simultaneous co-infections.
            </p>
          </div>
        </div>
      </div>

      {/* Structured Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* The Problem */}
        <div className="bg-white rounded-2xl border border-[#DDE8DF] p-6 sm:p-7 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#F0FDF4] text-[#15803D] border border-[#BBF7D0] flex items-center justify-center">
            <Target className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-[#17201A]">1. The Problem</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            Crop diseases cause significant yield loss worldwide (over 20-40% annually), jeopardizing food security and farmer livelihoods. Traditional diagnosis relies heavily on physical agronomist visits or visual inspection, which is slow, expensive, and inaccessible in remote rural agricultural zones.
          </p>
        </div>

        {/* The Approach */}
        <div className="bg-white rounded-2xl border border-[#DDE8DF] p-6 sm:p-7 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#F0FDF4] text-[#15803D] border border-[#BBF7D0] flex items-center justify-center">
            <Lightbulb className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-[#17201A]">2. The Approach</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            By leveraging computer vision and Deep Convolutional Neural Networks, image feature extraction is automated. A smartphone camera can capture a leaf image, pass it to an optimized CNN inference backend, and produce an instant diagnosis accompanied by probabilistic confidence scores.
          </p>
        </div>

        {/* The Dataset */}
        <div className="bg-white rounded-2xl border border-[#DDE8DF] p-6 sm:p-7 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#F0FDF4] text-[#15803D] border border-[#BBF7D0] flex items-center justify-center">
            <Layers className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-[#17201A]">3. The Dataset</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            Trained and benchmarked on the PlantVillage open dataset containing 54,305 curated RGB images across 14 agricultural crops and 38 distinct classes. Partitioned using a 70% / 15% / 15% train/val/test stratified protocol.
          </p>
        </div>

        {/* The CNN Architecture */}
        <div className="bg-white rounded-2xl border border-[#DDE8DF] p-6 sm:p-7 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#F0FDF4] text-[#15803D] border border-[#BBF7D0] flex items-center justify-center">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-[#17201A]">4. CNN Architecture</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            Features a 4-Block deep sequential architecture with 3×3 convolutions, Batch Normalization, ReLU activations, Max Pooling, Dropout regularization (0.50), and a 38-unit Softmax classification head, trained with the Adam optimizer and Categorical Crossentropy.
          </p>
        </div>
      </div>

      {/* Prediction & Practical Utility */}
      <div className="bg-white rounded-2xl border border-[#DDE8DF] p-5 sm:p-8 shadow-xs space-y-4">
        <h3 className="text-lg sm:text-xl font-bold text-[#17201A] flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-[#15803D]" />
          5. Prediction & Decision Support
        </h3>
        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
          Rather than only outputting a raw class label, the inference service pairs predictions with:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 pt-2">
          <div className="p-3.5 sm:p-4 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0]">
            <span className="text-xs font-bold text-[#15803D] block mb-1">Confidence Calibration</span>
            <p className="text-xs text-gray-600">Top-5 softmax probabilities reveal diagnostic certainty and ambiguity.</p>
          </div>
          <div className="p-3.5 sm:p-4 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0]">
            <span className="text-xs font-bold text-[#15803D] block mb-1">Pathological Profiles</span>
            <p className="text-xs text-gray-600">Underlying causal organisms (fungal, bacterial, viral, or abiotic).</p>
          </div>
          <div className="p-3.5 sm:p-4 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0]">
            <span className="text-xs font-bold text-[#15803D] block mb-1">Agronomic Management</span>
            <p className="text-xs text-gray-600">Culturally sound sanitation, pruning, and crop-rotation guidelines.</p>
          </div>
        </div>
      </div>

      {/* Future Scope */}
      <div className="bg-[#F0FDF4]/60 border border-[#86EFAC] rounded-2xl p-5 sm:p-8 shadow-xs space-y-4">
        <h3 className="text-lg sm:text-xl font-bold text-[#17201A] flex items-center gap-2">
          <Compass className="w-5 h-5 text-[#15803D]" />
          6. Future Scope & Research Directions
        </h3>
        <ul className="space-y-3 text-xs sm:text-sm text-gray-700">
          <li className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-[#15803D] shrink-0 mt-0.5" />
            <span><strong>Explainable AI (Grad-CAM):</strong> Integrate Gradient-weighted Class Activation Mapping to visually heat-map the exact leaf lesions attended to by convolutional feature maps.</span>
          </li>
          <li className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-[#15803D] shrink-0 mt-0.5" />
            <span><strong>Edge & Mobile Optimization:</strong> Quantize model weights via TensorFlow Lite (INT8 / FP16) for real-time offline edge diagnosis on low-cost smartphones without internet connectivity.</span>
          </li>
          <li className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-[#15803D] shrink-0 mt-0.5" />
            <span><strong>Multi-Spectral & Aerial Drone Imagery:</strong> Expand input pipelines to accept multispectral bands (NIR/RedEdge) captured by UAVs for macro-level farm canopy disease mapping.</span>
          </li>
          <li className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-[#15803D] shrink-0 mt-0.5" />
            <span><strong>Transfer Learning Benchmarking:</strong> Comparative evaluation against Vision Transformers (ViT), MobileNetV3, and EfficientNet backbones.</span>
          </li>
        </ul>
      </div>
    </div>
  );
};
