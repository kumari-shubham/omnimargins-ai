'use client';

import React from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import { ForecastPoint } from '@/lib/types';
import { TrendingUp, Activity } from 'lucide-react';

interface RevenueForecastChartProps {
  data: ForecastPoint[];
  metricLabel: string;
  currency?: string;
}

export const RevenueForecastChart: React.FC<RevenueForecastChartProps> = ({
  data,
  metricLabel,
  currency = '$',
}) => {
  if (!data || data.length === 0) return null;

  return (
    <div className="w-full rounded-2xl glass-panel p-5 border border-slate-800">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>Predictive Trend & 12-Month Forecast</span>
            </h3>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20">
              95% Confidence Band
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Linear autoregressive trajectory projected for {metricLabel}
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            <span>Actual</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-0.5 bg-indigo-400" />
            <span>Forecast</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-indigo-500/20 border border-indigo-500/30" />
            <span>95% CI</span>
          </div>
        </div>
      </div>

      <div className="w-full h-72">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="forecastBand" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0.02} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis
              dataKey="period"
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#334155' }}
            />
            <YAxis
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#334155' }}
              tickFormatter={(v) => `${currency}${v >= 1000 ? `${Math.round(v / 1000)}k` : v}`}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const pData = payload[0].payload as ForecastPoint;
                  return (
                    <div className="p-3 rounded-xl glass-panel-glow border border-indigo-500/40 text-xs text-slate-100 shadow-xl">
                      <p className="font-bold text-white mb-1.5">{label}</p>
                      {pData.actual !== undefined && (
                        <p className="text-blue-400 font-semibold">
                          Actual: {currency}{pData.actual.toLocaleString()}
                        </p>
                      )}
                      <p className="text-indigo-300 font-semibold">
                        Forecast: {currency}{pData.forecast.toLocaleString()}
                      </p>
                      <p className="text-slate-400 text-[10px] mt-1">
                        95% CI: {currency}{pData.lowerBound.toLocaleString()} – {currency}{pData.upperBound.toLocaleString()}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="upperBound"
              stroke="transparent"
              fill="url(#forecastBand)"
            />
            <Area
              type="monotone"
              dataKey="lowerBound"
              stroke="transparent"
              fill="#080c14"
            />
            <Line
              type="monotone"
              dataKey="forecast"
              stroke="#818cf8"
              strokeWidth={2.5}
              strokeDasharray="4 4"
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="actual"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#ffffff' }}
              activeDot={{ r: 6 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
