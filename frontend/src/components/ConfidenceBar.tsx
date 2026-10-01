import React from 'react';

interface ConfidenceBarProps {
  percentage: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const ConfidenceBar: React.FC<ConfidenceBarProps> = ({
  percentage,
  showLabel = true,
  size = 'md',
}) => {
  // Clamping
  const clamped = Math.max(0, Math.min(100, percentage));

  // Determine height
  const heightClass = size === 'sm' ? 'h-2' : size === 'lg' ? 'h-3.5' : 'h-2.5';

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex items-center justify-between text-xs font-semibold mb-1 text-gray-700">
          <span>Confidence Score</span>
          <span className="font-mono text-[#15803D]">{clamped.toFixed(1)}%</span>
        </div>
      )}
      <div className={`w-full bg-gray-100 rounded-full overflow-hidden ${heightClass} border border-gray-200/60`}>
        <div
          className="h-full bg-gradient-to-r from-[#22C55E] to-[#15803D] rounded-full transition-all duration-700 ease-out"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
};
