'use client';

import React, { useState } from 'react';
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { CorrelationItem } from '@/lib/types';
import { GitCommit, ArrowRight, Zap } from 'lucide-react';

interface CorrelationScatterProps {
  correlations: CorrelationItem[];
  rawData: Record<string, any>[];
  numericColumns: string[];
}

export const CorrelationScatter: React.FC<CorrelationScatterProps> = ({
  correlations,
  rawData,
  numericColumns,
}) => {
  const [selectedColX, setSelectedColX] = useState<string>(
    correlations[0]?.col1 || numericColumns[0] || 'mrr'
  );
  const [selectedColY, setSelectedColY] = useState<string>(
    correlations[0]?.col2 || numericColumns[1] || 'cac'
  );

  // Scatter plot data points
  const scatterData = rawData
    .map((row) => ({
      x: Number(row[selectedColX]),
      y: Number(row[selectedColY]),
      name: row['companyName'] || row['campaignName'] || row['applicantId'] || row['id'] || 'Point',
    }))
    .filter((d) => !isNaN(d.x) && !isNaN(d.y) && isFinite(d.x) && isFinite(d.y));

  const getSignificanceBadge = (sig: CorrelationItem['significance']) => {
    switch (sig) {
      case 'strong_positive':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">Strong Positive</span>;
      case 'moderate_positive':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-teal-500/10 text-teal-300 border border-teal-500/20">Moderate Positive</span>;
      case 'strong_negative':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-500/10 text-rose-300 border border-rose-500/20">Strong Inverse</span>;
      case 'moderate_negative':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/20">Moderate Inverse</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-400 border border-slate-700">Neutral</span>;
    }
  };

  return (
    <div className="w-full rounded-2xl glass-panel p-5 border border-slate-800">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>Statistical Correlation & Scatter Matrix</span>
            </h3>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/20">
              Pearson Coefficient (r)
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Uncover non-obvious mathematical dependencies between dimensions
          </p>
        </div>

        {/* Dimension Selectors */}
        <div className="flex items-center gap-2">
          <select
            value={selectedColX}
            onChange={(e) => setSelectedColX(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 outline-none focus:border-indigo-500"
          >
            {numericColumns.map((col) => (
              <option key={col} value={col}>X: {col}</option>
            ))}
          </select>

          <span className="text-slate-500 text-xs">vs</span>

          <select
            value={selectedColY}
            onChange={(e) => setSelectedColY(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 outline-none focus:border-indigo-500"
          >
            {numericColumns.map((col) => (
              <option key={col} value={col}>Y: {col}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Scatter Plot Visualizer */}
        <div className="lg:col-span-7 h-64 sm:h-72">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 10, right: 15, bottom: 10, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis
                type="number"
                dataKey="x"
                name={selectedColX}
                stroke="#64748b"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#334155' }}
              />
              <YAxis
                type="number"
                dataKey="y"
                name={selectedColY}
                stroke="#64748b"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#334155' }}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="p-2.5 rounded-xl glass-panel-glow border border-violet-500/40 text-xs text-slate-100 shadow-xl">
                        <p className="font-bold text-white mb-1">{data.name}</p>
                        <p className="text-indigo-300">{selectedColX}: {data.x.toLocaleString()}</p>
                        <p className="text-violet-300">{selectedColY}: {data.y.toLocaleString()}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Scatter
                name="Accounts"
                data={scatterData}
                fill="#8b5cf6"
                fillOpacity={0.7}
              />
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        {/* Top Correlation Drivers List */}
        <div className="lg:col-span-5 space-y-2 max-h-72 overflow-y-auto pr-1">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Top Statistical Drivers
          </h4>
          {correlations.slice(0, 5).map((item, idx) => (
            <div
              key={idx}
              onClick={() => {
                setSelectedColX(item.col1);
                setSelectedColY(item.col2);
              }}
              className="p-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-violet-500/40 cursor-pointer transition-all text-xs"
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <div className="font-semibold text-slate-200 flex items-center gap-1.5 truncate">
                  <span>{item.col1}</span>
                  <ArrowRight className="w-3 h-3 text-slate-500 shrink-0" />
                  <span>{item.col2}</span>
                </div>
                <span className="font-mono font-bold text-indigo-400">
                  r={item.r}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <p className="text-[11px] text-slate-400 line-clamp-1">{item.description}</p>
                {getSignificanceBadge(item.significance)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
