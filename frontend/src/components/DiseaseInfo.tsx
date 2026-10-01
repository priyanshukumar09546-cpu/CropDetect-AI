import React from 'react';
import { BookOpen, AlertCircle, CheckCircle2, Shield, Leaf, Info } from 'lucide-react';
import { DiseaseInfo as DiseaseInfoType } from '../types';

interface DiseaseInfoProps {
  info: DiseaseInfoType;
}

export const DiseaseInfo: React.FC<DiseaseInfoProps> = ({ info }) => {
  const isHealthy = info.status.toLowerCase() === 'healthy';

  return (
    <div className="bg-white rounded-2xl border border-[#DDE8DF] p-6 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-[#15803D]" />
          <h3 className="text-base font-bold text-[#17201A]">
            Pathological & Agronomic Profile
          </h3>
        </div>
        <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-md">
          {info.crop}
        </span>
      </div>

      {/* Description */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
          About the Diagnosis
        </h4>
        <p className="text-sm text-gray-700 leading-relaxed bg-[#F0FDF4]/50 p-4 rounded-xl border border-[#DDE8DF]">
          {info.description}
        </p>
      </div>

      {/* Quick metadata grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div className="p-3.5 rounded-xl border border-gray-100 bg-gray-50/60">
          <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-1">
            Causal Agent / Pathogen
          </span>
          <span className="text-xs font-mono font-medium text-gray-800">
            {info.causal_agent || 'Non-pathogenic'}
          </span>
        </div>

        <div className="p-3.5 rounded-xl border border-gray-100 bg-gray-50/60">
          <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-1">
            Severity Assessment
          </span>
          <span
            className={`text-xs font-bold ${
              isHealthy
                ? 'text-[#15803D]'
                : info.severity?.toLowerCase().includes('critical')
                ? 'text-red-600'
                : 'text-amber-600'
            }`}
          >
            {info.severity || 'Normal'}
          </span>
        </div>
      </div>

      {/* Symptoms */}
      {info.possible_symptoms && info.possible_symptoms.length > 0 && (
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2.5 flex items-center gap-1.5">
            <Leaf className="w-3.5 h-3.5 text-[#15803D]" />
            Diagnostic Symptoms
          </h4>
          <ul className="space-y-2">
            {info.possible_symptoms.map((symptom, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2.5 text-xs text-gray-700 bg-white p-2.5 rounded-lg border border-gray-100"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#15803D] mt-1.5 shrink-0" />
                <span className="leading-normal">{symptom}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* General Management Guidelines */}
      {info.general_management && info.general_management.length > 0 && (
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2.5 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-[#15803D]" />
            Recommended Agronomic Practices
          </h4>
          <ul className="space-y-2">
            {info.general_management.map((practice, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2.5 text-xs text-gray-700 bg-[#F0FDF4]/30 p-2.5 rounded-lg border border-[#DDE8DF]"
              >
                <CheckCircle2 className="w-4 h-4 text-[#15803D] shrink-0 mt-0.5" />
                <span className="leading-relaxed">{practice}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Scientific & Academic Disclaimer */}
      <div className="pt-3 border-t border-gray-100">
        <div className="p-3 rounded-lg bg-amber-50/70 border border-amber-200/80 text-[11px] text-amber-800 flex items-start gap-2">
          <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <span>
            <strong>Academic Reference Note:</strong> Guidance provided represents general agricultural management practices compiled from plant pathology literature. Consult certified agronomists and local university extension services before chemical application.
          </span>
        </div>
      </div>
    </div>
  );
};
