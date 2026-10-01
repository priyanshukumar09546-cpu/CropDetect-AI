import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  BarChart,
  Bar,
} from 'recharts';
import { TrendingUp, Activity, CheckSquare } from 'lucide-react';
import { TrainingMetrics } from '../types';

interface PerformanceChartsProps {
  metrics: TrainingMetrics | null | undefined;
}

export const PerformanceCharts: React.FC<PerformanceChartsProps> = ({ metrics }) => {
  if (!metrics || !metrics.is_trained || !metrics.training_history) {
    return (
      <div className="bg-white rounded-2xl border border-[#DDE8DF] p-8 text-center shadow-xs">
        <Activity className="w-10 h-10 text-gray-300 mx-auto mb-3" />
        <h4 className="text-base font-bold text-gray-700">Model Evaluation Pending</h4>
        <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
          Training epoch loss/accuracy curves and confusion matrices will appear here once the model training pipeline has completed evaluation.
        </p>
      </div>
    );
  }

  // Format accuracy percentage for chart
  const formattedHistory = metrics.training_history.map((item) => ({
    epoch: `Ep ${item.epoch}`,
    'Train Accuracy': (item.accuracy * 100).toFixed(1),
    'Val Accuracy': (item.val_accuracy * 100).toFixed(1),
    'Train Loss': item.loss.toFixed(3),
    'Val Loss': item.val_loss.toFixed(3),
  }));

  return (
    <div className="space-y-6 sm:space-y-8 w-full">
      {/* Accuracy & Loss Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Accuracy Curve */}
        <div className="bg-white rounded-2xl border border-[#DDE8DF] p-4 sm:p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-[#17201A] flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#15803D]" />
                Training vs Validation Accuracy
              </h4>
              <p className="text-[11px] sm:text-xs text-gray-500">25 Epoch Trajectory (PlantVillage Split)</p>
            </div>
            <span className="text-xs font-mono font-bold text-[#15803D] bg-[#F0FDF4] px-2 py-0.5 rounded border border-[#BBF7D0] self-start sm:self-auto">
              Peak Val: {metrics.validation_accuracy}%
            </span>
          </div>

          <div className="h-60 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={formattedHistory} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
                <XAxis dataKey="epoch" tick={{ fontSize: 11, fill: '#6B7280' }} />
                <YAxis domain={[50, 100]} tick={{ fontSize: 11, fill: '#6B7280' }} unit="%" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '8px',
                    borderColor: '#DDE8DF',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Line
                  type="monotone"
                  dataKey="Train Accuracy"
                  stroke="#15803D"
                  strokeWidth={2.5}
                  dot={{ r: 2 }}
                  activeDot={{ r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="Val Accuracy"
                  stroke="#059669"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={{ r: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Loss Curve */}
        <div className="bg-white rounded-2xl border border-[#DDE8DF] p-4 sm:p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-[#17201A] flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#15803D]" />
                Categorical Cross-Entropy Loss
              </h4>
              <p className="text-[11px] sm:text-xs text-gray-500">Convergence vs Epochs</p>
            </div>
            <span className="text-xs font-mono font-bold text-gray-700 bg-gray-50 px-2 py-0.5 rounded border border-gray-200 self-start sm:self-auto">
              Final Loss: {metrics.final_validation_loss}
            </span>
          </div>

          <div className="h-60 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={formattedHistory} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
                <XAxis dataKey="epoch" tick={{ fontSize: 11, fill: '#6B7280' }} />
                <YAxis domain={[0, 1.6]} tick={{ fontSize: 11, fill: '#6B7280' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '8px',
                    borderColor: '#DDE8DF',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Line
                  type="monotone"
                  dataKey="Train Loss"
                  stroke="#DC2626"
                  strokeWidth={2}
                  dot={{ r: 2 }}
                />
                <Line
                  type="monotone"
                  dataKey="Val Loss"
                  stroke="#D97706"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={{ r: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Confusion Matrix Breakdown for Top Pathologies */}
      {metrics.confusion_sample && metrics.confusion_sample.length > 0 && (
        <div className="bg-white rounded-2xl border border-[#DDE8DF] p-4 sm:p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-[#17201A] flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-[#15803D]" />
                Confusion Matrix Sample Analysis (Hold-out Test Partition)
              </h4>
              <p className="text-[11px] sm:text-xs text-gray-500">True Positives vs False Misclassifications</p>
            </div>
            <span className="text-xs text-gray-500 font-mono self-start sm:self-auto">
              F1 Benchmark: {(metrics.f1_score).toFixed(1)}%
            </span>
          </div>

          {/* Controlled internal horizontal scroll container for matrix */}
          <div className="overflow-x-auto rounded-xl border border-gray-100 p-2 bg-gray-50/30">
            <div className="min-w-[520px] h-64 sm:h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={metrics.confusion_sample}
                  margin={{ top: 10, right: 10, left: -20, bottom: 25 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 10, fill: '#4B5563' }}
                    angle={-20}
                    textAnchor="end"
                  />
                  <YAxis tick={{ fontSize: 11, fill: '#6B7280' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '8px',
                      borderColor: '#DDE8DF',
                      fontSize: '12px',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '15px' }} />
                  <Bar dataKey="predicted_true" name="Correctly Classified (TP)" fill="#15803D" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="predicted_false" name="Misclassified" fill="#FCA5A5" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <p className="text-[11px] text-gray-400 mt-2 block sm:hidden">
            Scroll horizontally to view all disease classes →
          </p>
        </div>
      )}
    </div>
  );
};
