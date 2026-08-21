'use client';

import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { Sliders, Sparkles, TrendingUp, DollarSign, Clock, Trophy, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { SimulationParams } from '@/lib/types';
import { runWhatIfSimulation } from '@/lib/statsEngine';

interface WhatIfSimulatorProps {
  baseTotal: number;
  category: string;
}

export const WhatIfSimulator: React.FC<WhatIfSimulatorProps> = ({
  baseTotal,
  category,
}) => {
  const [params, setParams] = useState<SimulationParams>({
    pricingDeltaPct: 15,
    churnReductionPct: 25,
    cacEfficiencyPct: 20,
    expansionRatePct: 15,
  });

  const baseARR = category === 'saas' ? baseTotal * 12 : baseTotal;
  const baseMonthlyChurnPct = 3.2; // 3.2% monthly churn baseline
  const baseCAC = 1200;
  const baseARPU = 500;

  const result = useMemo(() => {
    return runWhatIfSimulation(baseARR, baseMonthlyChurnPct, baseCAC, baseARPU, params);
  }, [baseARR, params]);

  const handleReset = () => {
    setParams({
      pricingDeltaPct: 0,
      churnReductionPct: 0,
      cacEfficiencyPct: 0,
      expansionRatePct: 0,
    });
  };

  const triggerMilestoneConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  return (
    <div className="w-full rounded-2xl glass-panel p-5 sm:p-6 border border-slate-800 shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base sm:text-lg font-bold text-white">
              Interactive What-If Scenario Simulator
            </h3>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
              Live Compounding Engine
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Model the compound ARR, runway extension, and valuation impact of growth levers
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={triggerMilestoneConfetti}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 transition-all"
          >
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>Celebrate Milestone</span>
          </button>

          <button
            onClick={handleReset}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs text-slate-400 hover:text-white bg-slate-900 border border-slate-800 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Interactive Sliders */}
        <div className="lg:col-span-5 space-y-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
          
          {/* Pricing Power Slider */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
              <span className="text-slate-300">Pricing Optimization / ACV</span>
              <span className={`font-mono ${params.pricingDeltaPct >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {params.pricingDeltaPct >= 0 ? `+${params.pricingDeltaPct}%` : `${params.pricingDeltaPct}%`}
              </span>
            </div>
            <input
              type="range"
              min="-20"
              max="40"
              step="5"
              value={params.pricingDeltaPct}
              onChange={(e) => setParams({ ...params, pricingDeltaPct: Number(e.target.value) })}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>-20% (Discount)</span>
              <span>Baseline (0%)</span>
              <span>+40% (Expansion)</span>
            </div>
          </div>

          {/* Churn Reduction Slider */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
              <span className="text-slate-300">Churn Rate Compression</span>
              <span className="font-mono text-indigo-400">
                +{params.churnReductionPct}% better retention
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              step="5"
              value={params.churnReductionPct}
              onChange={(e) => setParams({ ...params, churnReductionPct: Number(e.target.value) })}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>0% (Current)</span>
              <span>+25%</span>
              <span>+50% (Zero Churn)</span>
            </div>
          </div>

          {/* CAC Efficiency Slider */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
              <span className="text-slate-300">CAC Acquisition Efficiency</span>
              <span className="font-mono text-emerald-400">
                +{params.cacEfficiencyPct}% efficiency
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="40"
              step="5"
              value={params.cacEfficiencyPct}
              onChange={(e) => setParams({ ...params, cacEfficiencyPct: Number(e.target.value) })}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>0%</span>
              <span>+20% (Viral Loops)</span>
              <span>+40%</span>
            </div>
          </div>

          {/* Net Expansion Rate Slider */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
              <span className="text-slate-300">Account Expansion (Upsells)</span>
              <span className="font-mono text-violet-400">
                +{params.expansionRatePct}% expansion
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="30"
              step="5"
              value={params.expansionRatePct}
              onChange={(e) => setParams({ ...params, expansionRatePct: Number(e.target.value) })}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-violet-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>0% (Flat)</span>
              <span>+15% NRR</span>
              <span>+30% (Best in Class)</span>
            </div>
          </div>

        </div>

        {/* Real-Time Compounding Chart & Metrics */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
          
          {/* Simulated Impact KPI Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400">Projected ARR</span>
              <div className="text-base font-extrabold text-white mt-0.5">
                ${Math.round(result.simulatedARR / 1000).toLocaleString()}k
              </div>
              <span className="text-[10px] font-bold text-emerald-400">
                +{result.deltaARRPct}% vs Base
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400">Net ARR Delta</span>
              <div className="text-base font-extrabold text-emerald-300 mt-0.5">
                +${Math.round(result.deltaARR / 1000).toLocaleString()}k
              </div>
              <span className="text-[10px] text-slate-400">Pure Upside</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400">Runway Extension</span>
              <div className="text-base font-extrabold text-indigo-300 mt-0.5 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-indigo-400" />
                <span>+{result.runwayMonthsAdded} Mo</span>
              </div>
              <span className="text-[10px] text-slate-400">Cash Buffer</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400">10x Valuation</span>
              <div className="text-base font-extrabold text-amber-300 mt-0.5">
                ${Math.round(result.projectedValuation / 1000000).toLocaleString()}M
              </div>
              <span className="text-[10px] text-slate-400">Enterprise Value</span>
            </div>
          </div>

          {/* Baseline vs. Simulated 12-Month Area Curve */}
          <div className="w-full h-56 sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={result.timeline} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="simulatedArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="baseArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#64748b" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#64748b" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  tickFormatter={(v) => `$${Math.round(v / 1000)}k`}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length >= 2) {
                      const base = payload[0].value as number;
                      const sim = payload[1].value as number;
                      const delta = sim - base;
                      return (
                        <div className="p-3 rounded-xl glass-panel-glow border border-emerald-500/40 text-xs text-slate-100 shadow-xl">
                          <p className="font-bold text-white mb-1">{label}</p>
                          <p className="text-slate-400">Baseline: ${base.toLocaleString()}</p>
                          <p className="text-emerald-300 font-semibold">Simulated: ${sim.toLocaleString()}</p>
                          <p className="text-amber-300 font-bold mt-1">Delta: +${delta.toLocaleString()} ({((delta / base) * 100).toFixed(1)}%)</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area type="monotone" dataKey="baseline" stroke="#64748b" fill="url(#baseArea)" strokeWidth={2} />
                <Area type="monotone" dataKey="simulated" stroke="#10b981" fill="url(#simulatedArea)" strokeWidth={2.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

        </div>
      </div>
    </div>
  );
};
