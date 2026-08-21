'use client';

import React, { useState } from 'react';
import { Sparkles, Bot, BrainCircuit, ShieldAlert, ArrowUpRight, CheckCircle, Volume2, VolumeX, RefreshCw } from 'lucide-react';
import { AgentInsight } from '@/lib/types';

interface AgentDeliberationProps {
  insights: AgentInsight[];
  isLoading: boolean;
  onRefresh: () => void;
  onSpeakText: (text: string) => void;
  isSpeaking: boolean;
}

export const AgentDeliberation: React.FC<AgentDeliberationProps> = ({
  insights,
  isLoading,
  onRefresh,
  onSpeakText,
  isSpeaking,
}) => {
  const [selectedAgentIdx, setSelectedAgentIdx] = useState<number>(0);

  if (isLoading) {
    return (
      <div className="w-full rounded-2xl glass-panel-glow p-8 text-center border border-indigo-500/30">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
          <BrainCircuit className="w-6 h-6 text-indigo-400 animate-pulse" />
        </div>
        <h3 className="text-lg font-bold text-white mb-1">
          Autonomous Agent Board Deliberating...
        </h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Dr. Aris Thorne (Quant), Elena Rostova (Growth), and Marcus Vance (Risk) are running statistical regressions and evaluating strategic levers.
        </p>
      </div>
    );
  }

  if (!insights || insights.length === 0) return null;

  const currentAgent = insights[selectedAgentIdx] || insights[0];

  const getAgentTheme = (agentType: AgentInsight['agent']) => {
    switch (agentType) {
      case 'quant':
        return {
          gradient: 'from-blue-600/20 to-indigo-600/10 border-blue-500/40 text-blue-400',
          badgeBg: 'bg-blue-500/10 text-blue-300 border-blue-500/30',
          activeTab: 'bg-blue-600 text-white shadow-lg shadow-blue-500/30',
        };
      case 'growth':
        return {
          gradient: 'from-emerald-600/20 to-teal-600/10 border-emerald-500/40 text-emerald-400',
          badgeBg: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
          activeTab: 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30',
        };
      case 'risk':
        return {
          gradient: 'from-amber-600/20 to-rose-600/10 border-amber-500/40 text-amber-400',
          badgeBg: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
          activeTab: 'bg-amber-600 text-white shadow-lg shadow-amber-500/30',
        };
    }
  };

  const handleSpeakCurrentAgent = () => {
    const text = `${currentAgent.agentName}, ${currentAgent.agentRole}. ${currentAgent.summary}. Key findings: ${currentAgent.keyFindings.join('. ')}. Recommended actions: ${currentAgent.recommendations.join('. ')}`;
    onSpeakText(text);
  };

  return (
    <div className="w-full rounded-2xl glass-panel border border-slate-800/90 overflow-hidden shadow-xl">
      {/* Top Header & Agent Persona Selector */}
      <div className="p-4 sm:p-5 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-950/60">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping" />
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <span>Multi-Agent Strategy Board</span>
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
                Gemini 2.5 Consensus
              </span>
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Triangulating statistical rigor, venture growth vectors, and downside risk containment
          </p>
        </div>

        {/* Action Controls & Tabs */}
        <div className="flex items-center gap-2">
          <div className="flex p-1 rounded-xl bg-slate-900 border border-slate-800">
            {insights.map((agent, idx) => {
              const isSelected = idx === selectedAgentIdx;
              const theme = getAgentTheme(agent.agent);
              return (
                <button
                  key={agent.agent}
                  onClick={() => setSelectedAgentIdx(idx)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                    isSelected
                      ? theme.activeTab
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <span>{agent.agentAvatar}</span>
                  <span className="hidden sm:inline">{agent.agentName.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>

          <button
            onClick={onRefresh}
            title="Re-run Multi-Agent Deliberation"
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Active Agent Deliberation Card */}
      <div className="p-5 sm:p-6 bg-gradient-to-br from-slate-900/40 via-slate-950/80 to-slate-900/20">
        
        {/* Agent Profile & Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3.5">
            <div className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-slate-800/90 border border-slate-700 text-2xl shadow-inner">
              {currentAgent.agentAvatar}
              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-slate-950 flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-base sm:text-lg">
                  {currentAgent.agentName}
                </h3>
                <span className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full border ${getAgentTheme(currentAgent.agent).badgeBg}`}>
                  {currentAgent.agentRole}
                </span>
              </div>
              <p className="text-xs text-indigo-300/90 font-medium mt-0.5">
                {currentAgent.title}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-right hidden sm:block">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Model Confidence</span>
              <div className="text-sm font-bold text-emerald-400">{currentAgent.confidenceScore}%</div>
            </div>

            <button
              onClick={handleSpeakCurrentAgent}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                isSpeaking
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse'
                  : 'bg-slate-900/90 hover:bg-slate-800 text-slate-200 border-slate-700'
              }`}
            >
              {isSpeaking ? <VolumeX className="w-3.5 h-3.5 text-amber-400" /> : <Volume2 className="w-3.5 h-3.5 text-blue-400" />}
              <span>{isSpeaking ? 'Stop Audio' : `Hear ${currentAgent.agentName.split(' ')[0]}`}</span>
            </button>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800/80 mb-6 text-sm text-slate-200 leading-relaxed">
          <p>{currentAgent.summary}</p>
        </div>

        {/* Quantitative Metrics Highlight */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {currentAgent.metrics.map((m, mIdx) => (
            <div key={mIdx} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <div className="text-[11px] text-slate-400 font-medium mb-1 truncate">{m.label}</div>
              <div className="text-lg font-bold text-white tracking-tight">{m.value}</div>
              {m.delta && (
                <div className="text-[10px] font-semibold text-emerald-400 mt-0.5 truncate">{m.delta}</div>
              )}
            </div>
          ))}
        </div>

        {/* Two Columns: Key Findings & Actionable Recommendations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Key Findings */}
          <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800/80">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-1.5">
              <BrainCircuit className="w-4 h-4 text-indigo-400" />
              <span>Grounded Statistical Findings</span>
            </h4>
            <ul className="space-y-2.5">
              {currentAgent.keyFindings.map((finding, fIdx) => (
                <li key={fIdx} className="text-xs text-slate-300 flex items-start gap-2 leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                  <span>{finding}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Recommendations */}
          <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800/80">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-300 mb-3 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>Prescribed Strategic Levers</span>
            </h4>
            <ul className="space-y-2.5">
              {currentAgent.recommendations.map((rec, rIdx) => (
                <li key={rIdx} className="text-xs text-slate-300 flex items-start gap-2 leading-relaxed">
                  <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

      </div>
    </div>
  );
};
