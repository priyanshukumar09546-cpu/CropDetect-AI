import React from 'react';
import { Hero } from '../components/Hero';
import { DatasetStats } from '../components/DatasetStats';
import { DatasetMetadata, ModelInfo } from '../types';
import { ShieldCheck, Cpu, Database, ArrowRight, CheckCircle2, Sparkles, BookOpen } from 'lucide-react';

interface HomePageProps {
  datasetInfo: DatasetMetadata | null;
  modelInfo: ModelInfo | null;
  loadingStats: boolean;
  onNavigate: (tab: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  datasetInfo,
  modelInfo,
  loadingStats,
  onNavigate,
}) => {
  const steps = [
    {
      num: '01',
      title: 'Upload Crop Leaf Image',
      desc: 'Capture or upload a clear field leaf photograph in standard JPG, JPEG, or PNG format.',
      icon: ShieldCheck,
    },
    {
      num: '02',
      title: 'Deep CNN Inference',
      desc: 'The 4-Block Deep Convolutional Neural Network processes spatial patterns across 38 pathological classes.',
      icon: Cpu,
    },
    {
      num: '03',
      title: 'Actionable Agronomic Profile',
      desc: 'Receive disease identification, confidence ranking, severity ratings, and university-backed management guidelines.',
      icon: Database,
    },
  ];

  const featuredCrops = [
    'Tomato', 'Potato', 'Corn (Maize)', 'Apple', 'Grape',
    'Bell Pepper', 'Peach', 'Strawberry', 'Cherry', 'Squash',
    'Orange', 'Soybean', 'Blueberry', 'Raspberry'
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <Hero
        onDetectClick={() => onNavigate('detect')}
        onModelClick={() => onNavigate('model')}
      />

      {/* Dataset & Model Real Statistics */}
      <DatasetStats
        datasetInfo={datasetInfo}
        modelInfo={modelInfo}
        loading={loadingStats}
      />

      {/* 3-Step Detection Workflow */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-[#15803D] bg-[#DCFCE7] px-3 py-1 rounded-full border border-[#86EFAC]">
            System Architecture
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#17201A] mt-3 tracking-tight">
            How CropDetect AI Works
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-2">
            A standardized, academic end-to-end computer vision pipeline tailored for agricultural plant pathology.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="bg-white rounded-2xl border border-[#DDE8DF] p-6 sm:p-7 shadow-xs hover-card-rise relative transition-all"
              >
                <div className="text-3xl font-black text-[#DCFCE7] absolute top-6 right-6 select-none font-mono">
                  {step.num}
                </div>
                <div className="w-12 h-12 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] flex items-center justify-center text-[#15803D] mb-5">
                  <Icon className="w-6 h-6 stroke-[2.2]" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-[#17201A] mb-2">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Supported Crops Preview */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#F0FDF4]/70 border border-[#86EFAC] rounded-3xl p-6 sm:p-8 lg:p-12 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6 sm:mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#15803D]">
                Multi-Crop Diagnostic Coverage
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-[#17201A] mt-1">
                14 Major Cultivated Crops Supported
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 mt-1 max-w-xl">
                Benchmarked on 54,305 verified plant specimens containing both healthy tissue and fungal, bacterial, or viral disease pathologies.
              </p>
            </div>
            <button
              onClick={() => onNavigate('dataset')}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-white text-[#15803D] border border-[#86EFAC] hover:bg-[#DCFCE7]/50 shadow-2xs transition-all shrink-0 cursor-pointer min-h-[44px]"
            >
              <BookOpen className="w-4 h-4" />
              <span>Explore Dataset</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-wrap gap-2 sm:gap-2.5">
            {featuredCrops.map((crop) => (
              <span
                key={crop}
                className="px-3 py-1.5 sm:px-3.5 rounded-lg text-xs font-semibold bg-white text-gray-800 border border-[#DDE8DF] shadow-2xs flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-[#15803D]" />
                {crop}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Launch CTA Banner */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#15803D] text-white rounded-3xl p-6 sm:p-8 lg:p-12 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs font-semibold text-emerald-200 uppercase tracking-wider">
              Ready for Diagnosis?
            </span>
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight">
              Test the CNN Model with a Leaf Photo
            </h3>
            <p className="text-emerald-100 text-xs sm:text-sm max-w-lg">
              Upload a test sample or field photo to inspect model inference, confidence intervals, and pathology reports.
            </p>
          </div>
          <button
            onClick={() => onNavigate('detect')}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl text-base font-bold bg-white text-[#15803D] hover:bg-emerald-50 shadow-md transition-all active:scale-98 shrink-0 cursor-pointer flex items-center justify-center gap-2 min-h-[44px]"
          >
            <Sparkles className="w-4 h-4 text-[#15803D]" />
            Launch Detector
          </button>
        </div>
      </section>
    </div>
  );
};
