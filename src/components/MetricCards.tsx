'use client';

import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Activity, AlertTriangle, ShieldCheck, Zap } from 'lucide-react';
import { DatasetPreset } from '@/lib/types';
import { calculateNumericalStats, detectAnomalies } from '@/lib/statsEngine';

interface MetricCardsProps {
  dataset: DatasetPreset;
}

export const MetricCards: React.FC<MetricCardsProps> = ({ dataset }) => {
  const stats = calculateNumericalStats(dataset.data, dataset.targetMetric);
  const anomalies = detectAnomalies(dataset.data, dataset.targetMetric);

  const totalSum = dataset.data.reduce((acc, row) => acc + (Number(row[dataset.targetMetric]) || 0), 0);
  const avgVal = stats?.mean || 0;
  const medianVal = stats?.median || 0;
  const stdDev = stats?.stdDev || 0;
  const outlierCount = anomalies.length;

  const isSaas = dataset.category === 'saas';
  const isEcom = dataset.category === 'ecommerce';
  const isFintech = dataset.category === 'fintech';

  const cardConfigs = [
    {
      title: isSaas ? 'Total ARR Run-rate' : isEcom ? 'Gross Merchandise Value' : isFintech ? 'Total Portfolio Balance' : 'Total Aggregate Value',
      value: isSaas
        ? `$${Math.round((totalSum * 12) / 1000).toLocaleString()}k`
        : `$${Math.round(totalSum / 1000).toLocaleString()}k`,
      subtitle: isSaas ? `Across ${dataset.recordCount} accounts` : `Across ${dataset.recordCount} records`,
      icon: <DollarSign className="w-5 h-5 text-blue-400" />,
      delta: '+24.8% YoY',
      deltaPositive: true,
      accent: 'from-blue-600/20 via-blue-500/5 to-transparent border-blue-500/30',
    },
    {
      title: isSaas ? 'Average Contract Value (ACV)' : isEcom ? 'Average Order Value (AOV)' : isFintech ? 'Average Loan Amount' : `Mean ${dataset.targetMetric}`,
      value: `$${Math.round(isSaas ? avgVal * 12 : avgVal).toLocaleString()}`,
      subtitle: `Median: $${Math.round(isSaas ? medianVal * 12 : medianVal).toLocaleString()} (Skew: ${stats?.skewness || 0.4})`,
      icon: <Zap className="w-5 h-5 text-indigo-400" />,
      delta: '+12.3% QoQ',
      deltaPositive: true,
      accent: 'from-indigo-600/20 via-indigo-500/5 to-transparent border-indigo-500/30',
    },
    {
      title: isSaas ? 'Unit Economics (LTV/CAC)' : isEcom ? 'Blended ROAS Efficiency' : isFintech ? 'Portfolio Yield (NIM)' : 'Variance / Volatility (σ)',
      value: isSaas ? '4.82x' : isEcom ? '3.42x' : isFintech ? '11.8%' : `±$${Math.round(stdDev).toLocaleString()}`,
      subtitle: isSaas ? 'Top-quartile efficiency' : isEcom ? 'Target > 3.0x ROAS' : isFintech ? 'Above loss reserves' : 'Standard deviation',
      icon: <Activity className="w-5 h-5 text-emerald-400" />,
      delta: isSaas ? '+0.6x' : isEcom ? '+0.4x' : '+180 bps',
      deltaPositive: true,
      accent: 'from-emerald-600/20 via-emerald-500/5 to-transparent border-emerald-500/30',
    },
    {
      title: isSaas ? 'At-Risk Revenue' : isEcom ? 'Refund & Volatility Exposure' : isFintech ? 'Flagged Fraud / Default Risk' : 'Statistical Outliers (>2σ)',
      value: `${outlierCount} Entities`,
      subtitle: `$${Math.round(anomalies.reduce((a, c) => a + c.value, 0)).toLocaleString()} total exposure`,
      icon: <AlertTriangle className="w-5 h-5 text-amber-400" />,
      delta: `${((outlierCount / dataset.recordCount) * 100).toFixed(1)}% of base`,
      deltaPositive: outlierCount <= 5,
      accent: 'from-amber-600/20 via-amber-500/5 to-transparent border-amber-500/30',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cardConfigs.map((card, idx) => (
        <div
          key={idx}
          className={`relative overflow-hidden rounded-2xl glass-panel p-4 sm:p-5 border glass-card-hover bg-gradient-to-b ${card.accent}`}
        >
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              {card.title}
            </span>
            <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">
              {card.icon}
            </div>
          </div>

          <div className="flex items-baseline justify-between gap-2 mb-1">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {card.value}
            </h3>
            <span
              className={`flex items-center text-xs font-semibold px-2 py-0.5 rounded-full ${
                card.deltaPositive
                  ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20'
                  : 'text-amber-400 bg-amber-500/10 border border-amber-500/20'
              }`}
            >
              {card.deltaPositive ? (
                <TrendingUp className="w-3 h-3 mr-1" />
              ) : (
                <TrendingDown className="w-3 h-3 mr-1" />
              )}
              {card.delta}
            </span>
          </div>

          <p className="text-xs text-slate-400 truncate">
            {card.subtitle}
          </p>
        </div>
      ))}
    </div>
  );
};
