import React from 'react';
import { Database, FolderTree, Cpu, Image as ImageIcon } from 'lucide-react';
import { DatasetMetadata, ModelInfo } from '../types';

interface DatasetStatsProps {
  datasetInfo: DatasetMetadata | null;
  modelInfo: ModelInfo | null;
  loading: boolean;
}

export const DatasetStats: React.FC<DatasetStatsProps> = ({ datasetInfo, modelInfo, loading }) => {
  const cards = [
    {
      title: 'Dataset Images',
      value: loading
        ? 'Loading...'
        : datasetInfo?.total_images
        ? `${datasetInfo.total_images.toLocaleString()} verified leaves`
        : 'Not loaded',
      subtext: datasetInfo ? 'PlantVillage academic benchmark' : 'Requires backend connection',
      icon: ImageIcon,
    },
    {
      title: 'Disease Classes',
      value: loading
        ? 'Loading...'
        : datasetInfo?.total_classes
        ? `${datasetInfo.total_classes} distinct categories`
        : 'Not loaded',
      subtext: datasetInfo ? 'Healthy & pathologically diseased' : 'Requires backend connection',
      icon: FolderTree,
    },
    {
      title: 'Crop Types',
      value: loading
        ? 'Loading...'
        : datasetInfo?.total_crops
        ? `${datasetInfo.total_crops} major agricultural crops`
        : 'Not loaded',
      subtext: datasetInfo ? 'Solanaceous, cucurbit, pomes & more' : 'Requires backend connection',
      icon: Database,
    },
    {
      title: 'Model Architecture',
      value: loading
        ? 'Loading...'
        : modelInfo?.architecture
        ? modelInfo.architecture
        : 'Not loaded',
      subtext: modelInfo ? 'Conv2D + BatchNorm + Softmax Head' : 'Requires backend connection',
      icon: Cpu,
    },
  ];

  return (
    <section className="py-6 sm:py-8 bg-white border-y border-[#DDE8DF]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {cards.map((card, idx) => {
            const Icon = card.icon;
            const isLoaded = card.value !== 'Not loaded' && card.value !== 'Loading...';
            return (
              <div
                key={idx}
                className="bg-[#F0FDF4]/50 border border-[#DDE8DF] rounded-xl p-5 hover-card-rise transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                    {card.title}
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-white border border-[#DDE8DF] flex items-center justify-center text-[#15803D]">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-lg font-bold text-[#17201A] tracking-tight">
                  {card.value}
                </div>
                <div className="flex items-center gap-1.5 mt-1 text-xs text-gray-500">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isLoaded ? 'bg-[#15803D]' : 'bg-gray-400'
                    }`}
                  />
                  <span>{card.subtext}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
