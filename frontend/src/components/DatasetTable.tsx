import React, { useState, useMemo } from 'react';
import { Search, Filter, CheckCircle2, AlertTriangle } from 'lucide-react';
import { DatasetClassItem } from '../types';

interface DatasetTableProps {
  classes: DatasetClassItem[];
}

export const DatasetTable: React.FC<DatasetTableProps> = ({ classes }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCrop, setSelectedCrop] = useState('ALL');

  // Extract unique crops
  const uniqueCrops = useMemo(() => {
    const crops = new Set(classes.map((c) => c.crop));
    return ['ALL', ...Array.from(crops).sort()];
  }, [classes]);

  // Filtered dataset
  const filteredClasses = useMemo(() => {
    return classes.filter((item) => {
      const matchesCrop = selectedCrop === 'ALL' || item.crop === selectedCrop;
      const matchesSearch =
        item.disease.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.crop.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.causal_agent.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCrop && matchesSearch;
    });
  }, [classes, selectedCrop, searchTerm]);

  return (
    <div className="bg-white rounded-2xl border border-[#DDE8DF] p-6 shadow-sm space-y-5">
      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 min-w-0">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by disease, crop, or pathogen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#DDE8DF] text-sm text-[#17201A] focus:outline-hidden focus:ring-2 focus:ring-[#15803D] focus:border-transparent bg-gray-50/50"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-gray-500 shrink-0" />
          <select
            value={selectedCrop}
            onChange={(e) => setSelectedCrop(e.target.value)}
            className="w-full sm:w-auto px-3 py-2.5 rounded-xl border border-[#DDE8DF] text-sm text-[#17201A] focus:outline-hidden focus:ring-2 focus:ring-[#15803D] bg-white cursor-pointer"
          >
            {uniqueCrops.map((crop) => (
              <option key={crop} value={crop}>
                {crop === 'ALL' ? 'All Crop Categories' : crop}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-xs text-gray-500 font-medium">
        Showing <span className="font-bold text-[#15803D]">{filteredClasses.length}</span> of {classes.length} dataset classes
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto rounded-xl border border-[#DDE8DF] w-full">
        <table className="w-full text-left text-xs sm:text-sm min-w-[620px]">
          <thead className="bg-[#F0FDF4] text-gray-700 font-semibold border-b border-[#DDE8DF]">
            <tr>
              <th className="py-3 px-4">#</th>
              <th className="py-3 px-4">Crop</th>
              <th className="py-3 px-4">Condition / Disease</th>
              <th className="py-3 px-4">Health Status</th>
              <th className="py-3 px-4">Benchmark Images</th>
              <th className="py-3 px-4">Severity</th>
              <th className="py-3 px-4">Causal Pathogen</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredClasses.length > 0 ? (
              filteredClasses.map((item, idx) => {
                const isHealthy = item.status.toLowerCase() === 'healthy';
                return (
                  <tr
                    key={item.raw_class}
                    className="hover:bg-gray-50/80 transition-colors"
                  >
                    <td className="py-3 px-4 text-gray-400 font-mono text-xs">
                      {idx + 1}
                    </td>
                    <td className="py-3 px-4 font-bold text-[#17201A]">
                      {item.crop}
                    </td>
                    <td className="py-3 px-4 text-gray-800 font-medium">
                      {item.disease}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          isHealthy
                            ? 'bg-[#DCFCE7] text-[#166534]'
                            : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {isHealthy ? (
                          <CheckCircle2 className="w-3 h-3 text-[#15803D]" />
                        ) : (
                          <AlertTriangle className="w-3 h-3 text-amber-600" />
                        )}
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold text-gray-700">
                      {item.sample_count.toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-xs font-medium ${
                          isHealthy
                            ? 'text-gray-400'
                            : item.severity.toLowerCase().includes('critical')
                            ? 'text-red-600 font-bold'
                            : 'text-amber-700'
                        }`}
                      >
                        {item.severity}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600 italic text-xs max-w-xs truncate">
                      {item.causal_agent}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={7} className="py-8 text-center text-gray-400">
                  No dataset classes match the selected search criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
