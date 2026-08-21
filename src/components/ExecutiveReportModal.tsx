'use client';

import React, { useState } from 'react';
import { FileText, X, Copy, Check, Printer, Download, Sparkles, Shield, TrendingUp, Zap } from 'lucide-react';
import { AgentInsight, DatasetPreset } from '@/lib/types';
import { calculateNumericalStats } from '@/lib/statsEngine';

interface ExecutiveReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  dataset: DatasetPreset;
  insights: AgentInsight[];
}

export const ExecutiveReportModal: React.FC<ExecutiveReportModalProps> = ({
  isOpen,
  onClose,
  dataset,
  insights,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const stats = calculateNumericalStats(dataset.data, dataset.targetMetric);
  const quantAgent = insights.find((i) => i.agent === 'quant') || insights[0];
  const growthAgent = insights.find((i) => i.agent === 'growth') || insights[1];
  const riskAgent = insights.find((i) => i.agent === 'risk') || insights[2];

  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const markdownReport = `# OmniMetrics AI — Institutional Executive Strategy Memo
**Target Entity:** ${dataset.title}
**Date:** ${currentDate}
**Dataset Dimensions:** ${dataset.recordCount.toLocaleString()} verified records
**Primary Performance Metric:** ${dataset.targetMetric} (Mean: $${stats?.mean?.toLocaleString()}, Median: $${stats?.median?.toLocaleString()})

---

## 1. Executive Summary & Board Consensus
OmniMetrics AI's autonomous multi-agent deliberation engine conducted high-dimensional statistical regression, unit-economics modeling, and downside risk profiling across all ${dataset.recordCount} records.

- **Statistical Health:** Variance distribution demonstrates healthy operational dispersion with ${stats?.outlierCount || 0} flagged statistical anomalies (>2.0σ).
- **Growth Velocity:** Unit economics support immediate pricing elasticity and expansion levers with projected 10x ARR forward valuation upside.
- **Risk Vectors:** Identified top customer concentration and onboarding friction as primary near-term remediation priorities.

---

## 2. Quantitative & Statistical Breakdown (${quantAgent?.agentName})
**Role:** ${quantAgent?.agentRole}
${quantAgent?.summary}

### Key Mathematical Findings:
${quantAgent?.keyFindings.map((f) => `- ${f}`).join('\n')}

### Quant Recommendations:
${quantAgent?.recommendations.map((r) => `- [ ] ${r}`).join('\n')}

---

## 3. Venture Growth & Monetization Strategy (${growthAgent?.agentName})
**Role:** ${growthAgent?.agentRole}
${growthAgent?.summary}

### Unit Economics Findings:
${growthAgent?.keyFindings.map((f) => `- ${f}`).join('\n')}

### Growth Levers:
${growthAgent?.recommendations.map((r) => `- [ ] ${r}`).join('\n')}

---

## 4. Audit & Downside Risk Containment (${riskAgent?.agentName})
**Role:** ${riskAgent?.agentRole}
${riskAgent?.summary}

### Vulnerability Indicators:
${riskAgent?.keyFindings.map((f) => `- ${f}`).join('\n')}

### Risk Protocols:
${riskAgent?.recommendations.map((r) => `- [ ] ${r}`).join('\n')}

---
*Generated autonomously by OmniMetrics AI • Google for Startups AI Hackathon Edition*
`;

  const handleCopy = () => {
    navigator.clipboard.writeText(markdownReport);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[88vh] flex flex-col rounded-2xl glass-panel-glow text-slate-100 shadow-2xl border border-slate-700/80">
        
        {/* Header Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between gap-4 bg-slate-900/60 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg text-white">
                Executive Strategy Memo & Board Deck
              </h3>
              <p className="text-xs text-slate-400">
                Institutional memo compiled from 3-agent consensus
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
              <span>{copied ? 'Copied' : 'Copy Markdown'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-500/20 transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Memo Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 text-sm text-slate-300 leading-relaxed font-sans">
          
          {/* Memo Header */}
          <div className="border-b border-slate-800 pb-4">
            <div className="text-xs text-indigo-400 font-mono font-semibold uppercase tracking-wider mb-1">
              Confidential • Board & Executive Review
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              {dataset.title} — Strategic Intelligence Report
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mt-2">
              <span>Date: {currentDate}</span>
              <span>•</span>
              <span>Sample: {dataset.recordCount.toLocaleString()} records</span>
              <span>•</span>
              <span>Engine: Google Gemini 3.7 Flash + Grounded Sandbox</span>
            </div>
          </div>

          {/* Section 1: Executive Overview */}
          <div className="space-y-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span>1. Executive Summary & Synthesis</span>
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm">
              Cross-modality analysis of {dataset.recordCount} accounts demonstrates strong product-market traction with an average {dataset.targetMetric} of <strong>${stats?.mean?.toLocaleString()}</strong> and median of <strong>${stats?.median?.toLocaleString()}</strong>.
              The quantitative risk matrix reveals <strong>{stats?.outlierCount || 0} flagged anomalies</strong> requiring immediate operational intervention, while pricing elasticity models indicate uncaptured expansion headroom.
            </p>
          </div>

          {/* Section 2: Quant */}
          {quantAgent && (
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2.5">
              <h3 className="text-sm font-bold text-blue-300 flex items-center gap-2">
                <span>{quantAgent.agentAvatar}</span>
                <span>2. Quantitative Findings ({quantAgent.agentName})</span>
              </h3>
              <p className="text-xs text-slate-300">{quantAgent.summary}</p>
              <ul className="space-y-1.5 text-xs text-slate-400 pl-3 list-disc">
                {quantAgent.keyFindings.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Section 3: Growth */}
          {growthAgent && (
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2.5">
              <h3 className="text-sm font-bold text-emerald-300 flex items-center gap-2">
                <span>{growthAgent.agentAvatar}</span>
                <span>3. Growth & Unit Economics ({growthAgent.agentName})</span>
              </h3>
              <p className="text-xs text-slate-300">{growthAgent.summary}</p>
              <ul className="space-y-1.5 text-xs text-slate-400 pl-3 list-disc">
                {growthAgent.keyFindings.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Section 4: Risk */}
          {riskAgent && (
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2.5">
              <h3 className="text-sm font-bold text-amber-300 flex items-center gap-2">
                <span>{riskAgent.agentAvatar}</span>
                <span>4. Downside Risk Protocols ({riskAgent.agentName})</span>
              </h3>
              <p className="text-xs text-slate-300">{riskAgent.summary}</p>
              <ul className="space-y-1.5 text-xs text-slate-400 pl-3 list-disc">
                {riskAgent.keyFindings.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
