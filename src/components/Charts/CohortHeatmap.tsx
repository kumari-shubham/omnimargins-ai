'use client';

import React from 'react';
import { CohortRow } from '@/lib/types';
import { Layers, Flame } from 'lucide-react';

interface CohortHeatmapProps {
  cohorts: CohortRow[];
  currency?: string;
}

export const CohortHeatmap: React.FC<CohortHeatmapProps> = ({
  cohorts,
  currency = '$',
}) => {
  if (!cohorts || cohorts.length === 0) return null;

  const maxPeriods = 8;
  const periodsHeader = Array.from({ length: maxPeriods }, (_, i) => `M${i}`);

  const getHeatmapColor = (pct: number) => {
    if (pct >= 90) return 'bg-blue-600/90 text-white font-bold';
    if (pct >= 80) return 'bg-blue-600/70 text-blue-100';
    if (pct >= 70) return 'bg-indigo-600/60 text-indigo-100';
    if (pct >= 60) return 'bg-indigo-600/40 text-slate-200';
    if (pct >= 50) return 'bg-slate-700/60 text-slate-300';
    if (pct >= 35) return 'bg-slate-800/80 text-slate-400';
    return 'bg-amber-950/40 text-amber-300';
  };

  return (
    <div className="w-full rounded-2xl glass-panel p-5 border border-slate-800">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>Customer Cohort Retention Matrix</span>
            </h3>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
              Multi-Cohort Decay
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Percentage of original cohort active month-over-month
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
          <span>Decay:</span>
          <span className="px-1.5 py-0.5 rounded bg-blue-600 text-white font-semibold">90%+</span>
          <span className="px-1.5 py-0.5 rounded bg-indigo-600/60 text-white">70%+</span>
          <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">50%+</span>
          <span className="px-1.5 py-0.5 rounded bg-amber-950/60 text-amber-300">&lt;50%</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400">
              <th className="py-2.5 px-3 font-semibold">Cohort</th>
              <th className="py-2.5 px-2 font-semibold">Users</th>
              <th className="py-2.5 px-2 font-semibold">Initial</th>
              {periodsHeader.map((hdr) => (
                <th key={hdr} className="py-2.5 px-2 text-center font-semibold">{hdr}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {cohorts.map((row, rIdx) => (
              <tr key={rIdx} className="hover:bg-slate-900/40 transition-colors">
                <td className="py-2 px-3 font-medium text-slate-200 whitespace-nowrap">
                  {row.cohortName}
                </td>
                <td className="py-2 px-2 text-slate-400 whitespace-nowrap font-mono">
                  {row.initialUsers}
                </td>
                <td className="py-2 px-2 text-slate-300 whitespace-nowrap font-mono">
                  {currency}{Math.round(row.initialRevenue / 1000)}k
                </td>
                {periodsHeader.map((_, pIdx) => {
                  const pData = row.periods[pIdx];
                  if (!pData) {
                    return (
                      <td key={pIdx} className="py-2 px-1 text-center text-slate-700">
                        -
                      </td>
                    );
                  }
                  return (
                    <td key={pIdx} className="py-1 px-1 text-center">
                      <div
                        className={`py-1 px-1.5 rounded-lg text-[11px] font-mono transition-all ${getHeatmapColor(
                          pData.percentage
                        )}`}
                        title={`Month ${pIdx}: ${pData.percentage}% (${pData.userCount} users, ${currency}${Math.round(pData.revenue).toLocaleString()})`}
                      >
                        {pData.percentage}%
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
