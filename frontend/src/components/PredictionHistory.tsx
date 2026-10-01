import React from 'react';
import { History, Trash2, Clock, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { PredictionHistoryItem } from '../types';

interface PredictionHistoryProps {
  history: PredictionHistoryItem[];
  onSelect: (item: PredictionHistoryItem) => void;
  onClear: () => void;
}

export const PredictionHistory: React.FC<PredictionHistoryProps> = ({
  history,
  onSelect,
  onClear,
}) => {
  if (history.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-[#DDE8DF] p-6 text-center shadow-xs">
        <div className="w-10 h-10 rounded-xl bg-gray-100 text-gray-400 mx-auto flex items-center justify-center mb-2">
          <History className="w-5 h-5" />
        </div>
        <h4 className="text-sm font-semibold text-gray-700">No predictions yet</h4>
        <p className="text-xs text-gray-400 mt-1 max-w-xs mx-auto">
          Leaf images analyzed during this session will appear here with full diagnostic logs.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-[#DDE8DF] p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-[#15803D]" />
          <h3 className="text-sm font-bold text-[#17201A]">Session Prediction History</h3>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#DCFCE7] text-[#166534] font-semibold">
            {history.length}
          </span>
        </div>
        <button
          onClick={onClear}
          className="text-xs font-semibold text-gray-500 hover:text-red-600 flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Clear History
        </button>
      </div>

      <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
        {history.map((item) => {
          const isHealthy = item.status.toLowerCase() === 'healthy';
          return (
            <div
              key={item.id}
              onClick={() => onSelect(item)}
              className="flex items-center justify-between p-3 rounded-xl border border-gray-100 bg-[#F0FDF4]/30 hover:bg-[#DCFCE7]/40 hover:border-[#86EFAC] transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={item.image_url}
                  alt={item.crop}
                  className="w-12 h-12 rounded-lg object-cover border border-[#DDE8DF] shrink-0"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-[#17201A] truncate">
                      {item.crop}
                    </span>
                    <span
                      className={`text-[10px] font-semibold px-1.5 py-0.2 rounded ${
                        isHealthy
                          ? 'bg-[#DCFCE7] text-[#166534]'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                  <div className="text-xs text-gray-600 font-medium truncate">
                    {item.disease}
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-gray-400 mt-0.5">
                    <span className="flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" />
                      {item.timestamp}
                    </span>
                    <span>•</span>
                    <span className="font-mono text-[#15803D] font-semibold">
                      {item.confidence.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-gray-400 group-hover:text-[#15803D] group-hover:translate-x-0.5 transition-all">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
