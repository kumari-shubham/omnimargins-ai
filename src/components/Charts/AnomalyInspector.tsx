'use client';

import React from 'react';
import { AnomalyItem } from '@/lib/types';
import { AlertOctagon, AlertTriangle, ShieldAlert, ArrowUpRight } from 'lucide-react';

interface AnomalyInspectorProps {
  anomalies: AnomalyItem[];
  metricName: string;
  currency?: string;
}

export const AnomalyInspector: React.FC<AnomalyInspectorProps> = ({
  anomalies,
  metricName,
  currency = '$',
}) => {
  if (!anomalies || anomalies.length === 0) {
    return (
      <div className="w-full rounded-2xl glass-panel p-5 border border-slate-800 text-center">
        <p className="text-xs text-slate-400">No high-divergence statistical anomalies detected (&gt;2.0σ).</p>
      </div>
    );
  }

  const getSeverityBadge = (severity: AnomalyItem['severity']) => {
    switch (severity) {
      case 'critical':
        return (
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-300 border border-rose-500/30">
            <AlertOctagon className="w-3 h-3 text-rose-400" />
            Critical (&gt;3σ)
          </span>
        );
      case 'medium':
        return (
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
            <AlertTriangle className="w-3 h-3 text-amber-400" />
            Medium (&gt;2.5σ)
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-500/10 text-blue-300 border border-blue-500/20">
            Low (&gt;2.0σ)
          </span>
        );
    }
  };

  return (
    <div className="w-full rounded-2xl glass-panel p-5 border border-slate-800">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>Statistical Anomaly & Outlier Watch</span>
            </h3>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
              {anomalies.length} Flagged
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Entities exhibiting extreme standard deviation variance
          </p>
        </div>
      </div>

      <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
        {anomalies.map((item, idx) => (
          <div
            key={idx}
            className="p-3 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-slate-300">
                #{idx + 1}
              </div>
              <div>
                <div className="font-semibold text-white flex items-center gap-2">
                  <span>{item.label}</span>
                  <span className="text-[10px] text-slate-500 font-mono">({item.id})</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">{item.reason}</div>
              </div>
            </div>

            <div className="flex items-center gap-3 self-end sm:self-center">
              <div className="text-right">
                <div className="font-bold text-slate-200 font-mono">
                  {currency}{item.value.toLocaleString()}
                </div>
                <div className="text-[10px] text-slate-500">
                  Z-Score: {item.zScore}σ
                </div>
              </div>
              {getSeverityBadge(item.severity)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
