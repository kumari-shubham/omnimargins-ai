'use client';

import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from 'recharts';
import { aggregateByCategory } from '@/lib/statsEngine';
import { Layers } from 'lucide-react';

interface ChannelBreakdownProps {
  rawData: Record<string, any>[];
  targetMetric: string;
  categoryColumns: string[];
  currency?: string;
}

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899', '#06b6d4', '#84cc16'];

export const ChannelBreakdown: React.FC<ChannelBreakdownProps> = ({
  rawData,
  targetMetric,
  categoryColumns,
  currency = '$',
}) => {
  const [selectedCategoryCol, setSelectedCategoryCol] = useState<string>(
    categoryColumns[0] || 'planTier'
  );

  const breakdownData = aggregateByCategory(rawData, selectedCategoryCol, targetMetric).slice(0, 8);

  return (
    <div className="w-full rounded-2xl glass-panel p-5 border border-slate-800">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>Segment & Category Distribution</span>
            </h3>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
              Aggregated Volume
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Total {targetMetric} split across {selectedCategoryCol}
          </p>
        </div>

        {/* Dimension dropdown */}
        {categoryColumns.length > 1 && (
          <select
            value={selectedCategoryCol}
            onChange={(e) => setSelectedCategoryCol(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 outline-none focus:border-indigo-500"
          >
            {categoryColumns.map((col) => (
              <option key={col} value={col}>Group by: {col}</option>
            ))}
          </select>
        )}
      </div>

      <div className="w-full h-64 sm:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={breakdownData} margin={{ top: 10, right: 10, left: 0, bottom: 25 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis
              dataKey="category"
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#334155' }}
              interval={0}
              angle={-20}
              textAnchor="end"
            />
            <YAxis
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#334155' }}
              tickFormatter={(v) => `${currency}${v >= 1000 ? `${Math.round(v / 1000)}k` : v}`}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="p-3 rounded-xl glass-panel-glow border border-emerald-500/40 text-xs text-slate-100 shadow-xl">
                      <p className="font-bold text-white mb-1">{data.category}</p>
                      <p className="text-emerald-300 font-semibold">
                        Total Volume: {currency}{data.sum.toLocaleString()}
                      </p>
                      <p className="text-slate-300">
                        Record Count: {data.count} ({Math.round(data.avg).toLocaleString()} avg)
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="sum" radius={[6, 6, 0, 0]}>
              {breakdownData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
