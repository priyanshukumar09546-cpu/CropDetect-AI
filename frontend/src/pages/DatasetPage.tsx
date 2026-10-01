import React from 'react';
import { Database, Image as ImageIcon, PieChart, Layers, CheckCircle2, AlertTriangle, BookOpen } from 'lucide-react';
import { DatasetMetadata } from '../types';
import { DatasetTable } from '../components/DatasetTable';
import { ResponsiveContainer, PieChart as RechartsPie, Pie, Cell, Tooltip, Legend } from 'recharts';

interface DatasetPageProps {
  datasetInfo: DatasetMetadata | null;
  loading: boolean;
}

export const DatasetPage: React.FC<DatasetPageProps> = ({ datasetInfo, loading }) => {
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-12 h-12 border-4 border-[#15803D] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <h3 className="text-lg font-bold text-[#17201A]">Loading Dataset Metadata...</h3>
      </div>
    );
  }

  if (!datasetInfo) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <Database className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-[#17201A]">Dataset Information Unavailable</h2>
        <p className="text-sm text-gray-500 mt-2">
          Unable to retrieve dataset records from the backend API. Please ensure the backend server is running at port 8000.
        </p>
      </div>
    );
  }

  const splitData = [
    { name: 'Training Split (70%)', value: datasetInfo.splits.train.images, color: '#15803D' },
    { name: 'Validation Split (15%)', value: datasetInfo.splits.validation.images, color: '#059669' },
    { name: 'Testing Split (15%)', value: datasetInfo.splits.test.images, color: '#34D399' },
  ];

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 lg:py-12 space-y-8 sm:space-y-12">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#DCFCE7] text-[#166534] border border-[#86EFAC]">
          <Database className="w-3.5 h-3.5 text-[#15803D]" />
          <span>STANDARDIZED BENCHMARK METADATA</span>
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#17201A] tracking-tight">
          PlantVillage Dataset Overview
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed max-w-2xl mx-auto">
          {datasetInfo.description}
        </p>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white rounded-2xl border border-[#DDE8DF] p-6 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase text-gray-500">Total Images</span>
            <ImageIcon className="w-5 h-5 text-[#15803D]" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#17201A]">
            {datasetInfo.total_images.toLocaleString()}
          </div>
          <span className="text-xs text-gray-500 mt-1 block">Laboratory-verified leaf photos</span>
        </div>

        <div className="bg-white rounded-2xl border border-[#DDE8DF] p-6 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase text-gray-500">Disease Classes</span>
            <Layers className="w-5 h-5 text-[#15803D]" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#17201A]">
            {datasetInfo.total_classes}
          </div>
          <span className="text-xs text-gray-500 mt-1 block">Pathology and healthy states</span>
        </div>

        <div className="bg-white rounded-2xl border border-[#DDE8DF] p-6 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase text-gray-500">Agricultural Crops</span>
            <Database className="w-5 h-5 text-[#15803D]" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#17201A]">
            {datasetInfo.total_crops}
          </div>
          <span className="text-xs text-gray-500 mt-1 block">Staple, fruit & cash crops</span>
        </div>

        <div className="bg-white rounded-2xl border border-[#DDE8DF] p-6 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase text-gray-500">Standard Resolution</span>
            <span className="text-xs font-mono font-bold text-[#15803D] bg-[#F0FDF4] px-2 py-0.5 rounded border border-[#BBF7D0]">
              RGB
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#17201A]">
            {datasetInfo.image_resolution}
          </div>
          <span className="text-xs text-gray-500 mt-1 block">Standardized square inputs</span>
        </div>
      </div>

      {/* Dataset Splits Breakdown & Pie Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center bg-white rounded-2xl border border-[#DDE8DF] p-4 sm:p-8 shadow-sm">
        <div className="lg:col-span-6 space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-[#15803D]">
            Data Partitioning Protocol
          </span>
          <h3 className="text-xl sm:text-2xl font-extrabold text-[#17201A]">
            Stratified Train / Val / Test Distribution
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            The dataset is partitioned to prevent data leakage and guarantee genuine generalization on unseen leaves. Augmentation is applied exclusively on the training subset.
          </p>

          <div className="space-y-3 pt-2">
            <div className="p-3 sm:p-3.5 rounded-xl border border-[#BBF7D0] bg-[#F0FDF4] flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <div>
                <span className="text-xs font-bold text-[#166534] block">Training Partition (70%)</span>
                <span className="text-xs text-gray-600">Model parameter weights optimization</span>
              </div>
              <span className="font-mono font-bold text-[#15803D] text-xs sm:text-sm shrink-0">
                {datasetInfo.splits.train.images.toLocaleString()} images
              </span>
            </div>

            <div className="p-3 sm:p-3.5 rounded-xl border border-gray-200 bg-gray-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <div>
                <span className="text-xs font-bold text-gray-800 block">Validation Partition (15%)</span>
                <span className="text-xs text-gray-600">Hyperparameter tuning & early stopping</span>
              </div>
              <span className="font-mono font-bold text-gray-800 text-xs sm:text-sm shrink-0">
                {datasetInfo.splits.validation.images.toLocaleString()} images
              </span>
            </div>

            <div className="p-3 sm:p-3.5 rounded-xl border border-gray-200 bg-gray-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <div>
                <span className="text-xs font-bold text-gray-800 block">Hold-out Test Partition (15%)</span>
                <span className="text-xs text-gray-600">Final unbiased generalization metric</span>
              </div>
              <span className="font-mono font-bold text-gray-800 text-xs sm:text-sm shrink-0">
                {datasetInfo.splits.test.images.toLocaleString()} images
              </span>
            </div>
          </div>
        </div>

        {/* Visual Split Recharts Pie */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center">
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPie>
                <Pie
                  data={splitData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={95}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {splitData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any) => [`${Number(val).toLocaleString()} images`, 'Count']}
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '8px',
                    borderColor: '#DDE8DF',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              </RechartsPie>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            70% Training / 15% Validation / 15% Testing Stratified Split
          </p>
        </div>
      </div>

      {/* Complete Filterable Class Table */}
      <div>
        <div className="mb-4">
          <h3 className="text-xl font-bold text-[#17201A]">
            Comprehensive Class Inventory (38 Classes)
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            Search, filter, and inspect specific crop disease categories, sample distribution, and causal organisms.
          </p>
        </div>
        <DatasetTable classes={datasetInfo.classes} />
      </div>
    </div>
  );
};
