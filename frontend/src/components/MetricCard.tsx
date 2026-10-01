import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number | null | undefined;
  unit?: string;
  subtext?: string;
  icon: LucideIcon;
  isPending?: boolean;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  unit = '%',
  subtext,
  icon: Icon,
  isPending = false,
}) => {
  const displayValue =
    isPending || value === null || value === undefined
      ? 'Model evaluation pending'
      : typeof value === 'number'
      ? `${value.toFixed(1)}${unit}`
      : `${value}`;

  const isReal = displayValue !== 'Model evaluation pending';

  return (
    <div className="bg-white rounded-2xl border border-[#DDE8DF] p-5 shadow-xs hover-card-rise transition-all">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          {title}
        </span>
        <div className="w-8 h-8 rounded-lg bg-[#F0FDF4] text-[#15803D] border border-[#BBF7D0] flex items-center justify-center">
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div
        className={`font-black tracking-tight ${
          isReal ? 'text-2xl sm:text-3xl text-[#17201A]' : 'text-sm text-gray-400 font-medium'
        }`}
      >
        {displayValue}
      </div>

      {subtext && (
        <p className="text-xs text-gray-500 mt-1.5 flex items-center gap-1.5">
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              isReal ? 'bg-[#15803D]' : 'bg-gray-300'
            }`}
          />
          <span>{subtext}</span>
        </p>
      )}
    </div>
  );
};
