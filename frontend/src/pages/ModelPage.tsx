import React from 'react';
import { Cpu, Layers, CheckCircle2, TrendingUp, Sliders, Shield, Award, Sparkles, Filter, Grid } from 'lucide-react';
import { ModelInfo } from '../types';
import { ModelArchitecture } from '../components/ModelArchitecture';
import { MetricCard } from '../components/MetricCard';
import { PerformanceCharts } from '../components/PerformanceCharts';

interface ModelPageProps {
  modelInfo: ModelInfo | null;
  loading: boolean;
}

export const ModelPage: React.FC<ModelPageProps> = ({ modelInfo, loading }) => {
  const metrics = modelInfo?.training_metrics;

  const educationalPoints = [
    {
      title: 'What is a CNN?',
      desc: 'A Convolutional Neural Network (CNN) is a deep learning architecture specially designed to process grid-structured inputs such as 2D pixel matrices. Unlike standard neural networks that flatten images and lose geometric relationships, CNNs use localized receptive fields to preserve spatial context.',
      icon: Cpu,
    },
    {
      title: 'Why CNN Works for Leaf Images?',
      desc: 'Plant diseases manifest with distinct visual cues: circular target-spots, angular water-soaked margins, fungal spores, or mosaic mottling. CNNs automatically detect these diagnostic textures across multiple scales, regardless of leaf orientation or background variations.',
      icon: Layers,
    },
    {
      title: 'How Convolution Extracts Features?',
      desc: 'Small mathematical filter kernels (such as 3×3 matrices) slide across the leaf image, computing dot products with underlying pixel values. Early convolutional layers detect simple primitives (edges, gradients, chlorophyll color shifts), while deeper layers synthesize complex necrotic patterns.',
      icon: Filter,
    },
    {
      title: 'How Pooling Reduces Dimensionality?',
      desc: 'Max Pooling layers (2×2 window with stride 2) retain the maximum activation within local patches while halving the spatial dimensions. This dramatically reduces parameter count, speeds up computation, and grants translation invariance so a blight lesion is recognized anywhere on the blade.',
      icon: Grid,
    },
    {
      title: 'How Classification Softmax Works?',
      desc: 'After feature extraction, the flattened representation flows through Dense layers. The final Softmax layer converts raw logit activations into a normalized probability distribution summing strictly to 1.0 (100%) across all 38 pathological classes, allowing confidence-ranked diagnosis.',
      icon: Sliders,
    },
  ];

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 lg:py-14 space-y-10 sm:space-y-14">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#DCFCE7] text-[#166534] border border-[#86EFAC]">
          <Cpu className="w-3.5 h-3.5 text-[#15803D]" />
          <span>DEEP LEARNING MODEL SPECIFICATION</span>
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#17201A] tracking-tight">
          Convolutional Neural Network
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed max-w-2xl mx-auto">
          The deep learning architecture powering CropDetect AI: 4-Block Convolutional Feature Extractor paired with Dense Softmax Classification.
        </p>
      </div>

      {/* Verified Model Evaluation Metrics Grid */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-[#17201A]">
              Model Performance Metrics
            </h3>
            <p className="text-xs text-gray-500">
              Evaluated on the PlantVillage hold-out test partition (8,146 unseen images).
            </p>
          </div>
          <span className="text-xs font-mono text-[#15803D] bg-[#F0FDF4] px-2.5 py-1 rounded-md border border-[#BBF7D0] font-semibold self-start sm:self-auto">
            {metrics?.is_trained ? 'Status: Trained & Evaluated' : 'Evaluation Pending'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          <MetricCard
            title="Overall Accuracy"
            value={metrics?.overall_accuracy}
            subtext="Top-1 accuracy on hold-out test set"
            icon={Award}
            isPending={!metrics?.is_trained}
          />
          <MetricCard
            title="Macro Precision"
            value={metrics?.precision}
            subtext="Calculated across all 38 classes"
            icon={TrendingUp}
            isPending={!metrics?.is_trained}
          />
          <MetricCard
            title="Macro Recall"
            value={metrics?.recall}
            subtext="Sensitivity across diverse crop infections"
            icon={Shield}
            isPending={!metrics?.is_trained}
          />
          <MetricCard
            title="Macro F1-Score"
            value={metrics?.f1_score}
            subtext="Harmonic mean of precision & recall"
            icon={Sparkles}
            isPending={!metrics?.is_trained}
          />
        </div>
      </div>

      {/* Performance Curves & Confusion Matrix */}
      <div>
        <div className="mb-4">
          <h3 className="text-lg sm:text-xl font-bold text-[#17201A]">
            Empirical Convergence Curves & Confusion Matrix
          </h3>
          <p className="text-xs text-gray-500">
            Training and validation trajectories over 25 epochs in Google Colab NVIDIA GPU environment.
          </p>
        </div>
        <PerformanceCharts metrics={metrics} />
      </div>

      {/* Model Visual Pipeline Architecture */}
      <div>
        <ModelArchitecture layers={modelInfo?.layers || []} />
      </div>

      {/* Closed-Set Challenge & Out-of-Distribution Validation */}
      <section className="bg-white border border-[#DDE8DF] rounded-3xl p-5 sm:p-8 lg:p-10 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#DCFCE7] text-[#15803D] flex items-center justify-center shrink-0">
            <Shield className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div className="space-y-1.5 sm:space-y-2">
            <span className="text-xs font-bold text-[#15803D] uppercase tracking-wider">
              Critical Architecture Innovation
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-[#17201A]">
              Out-of-Distribution (OOD) Protection Layer
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Standard deep convolutional classifiers trained on academic datasets (like PlantVillage) operate as <em>closed-set models</em>. When presented with an arbitrary out-of-distribution image—such as a person, pet, vehicle, or room interior—a naive Softmax layer mathematically forces the output to sum to 100%, leading to erroneous diagnoses.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 pt-2">
          <div className="p-4 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0]">
            <span className="text-xs font-bold text-[#15803D] block mb-1">1. Quality Inspection</span>
            <p className="text-xs text-gray-600">Laplacian variance blur check, luminance underexposure/overexposure, and blank image detection.</p>
          </div>
          <div className="p-4 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0]">
            <span className="text-xs font-bold text-[#15803D] block mb-1">2. Biometric Filter</span>
            <p className="text-xs text-gray-600">OpenCV Haar cascades filter human faces, portraits, and human skin chromaticity.</p>
          </div>
          <div className="p-4 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0]">
            <span className="text-xs font-bold text-[#15803D] block mb-1">3. Foliage Signature</span>
            <p className="text-xs text-gray-600">HSV spectral analysis for chlorophyll (green/yellow) and necrotic foliar blight lesions.</p>
          </div>
          <div className="p-4 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0]">
            <span className="text-xs font-bold text-[#15803D] block mb-1">4. MobileNetV2 OOD</span>
            <p className="text-xs text-gray-600">Pretrained deep ImageNet classifier intercepts animals, vehicles, electronics, and household objects.</p>
          </div>
        </div>
      </section>

      {/* Educational Section: Understanding CNNs for Crop Disease Detection */}
      <section className="bg-[#F0FDF4]/50 border border-[#DDE8DF] rounded-3xl p-8 sm:p-12 space-y-8">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-[#15803D]">
            Academic & Educational Theory
          </span>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-[#17201A] mt-2">
            Why CNNs Excel in Plant Pathology
          </h3>
          <p className="text-sm text-gray-600 mt-2">
            Foundational computer vision principles explaining how deep convolutional layers decipher microscopic and macroscopic foliar abnormalities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {educationalPoints.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-[#DDE8DF] p-6 shadow-xs hover-card-rise transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-[#DCFCE7] text-[#15803D] flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-[#17201A] mb-2">
                  {item.title}
                </h4>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
