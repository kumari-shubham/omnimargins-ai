'use client';

import React, { useState, useEffect } from 'react';
import { Search, Mic, MicOff, Sparkles, CornerDownLeft, BarChart3, TrendingUp, AlertCircle, ArrowRight } from 'lucide-react';
import { DatasetPreset, QueryResult } from '@/lib/types';
import { executeNaturalLanguageQuery } from '@/lib/gemini';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface QueryConsoleProps {
  dataset: DatasetPreset;
  apiKey?: string;
  onSpeakText: (text: string) => void;
}

export const QueryConsole: React.FC<QueryConsoleProps> = ({
  dataset,
  apiKey,
  onSpeakText,
}) => {
  const [queryInput, setQueryInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeResult, setActiveResult] = useState<QueryResult | null>(null);
  const [isListening, setIsListening] = useState(false);

  const sampleChips = dataset.category === 'saas'
    ? [
        'Which customer tier has highest churn risk?',
        'Breakdown MRR by acquisition channel',
        'Find statistical anomalies > 2.5 sigma',
        'What is our enterprise expansion rate?',
      ]
    : dataset.category === 'ecommerce'
    ? [
        'Which ad channel produces best ROAS?',
        'Show refund rate variance by campaign',
        'Top 5 campaigns by net profit',
        'How does repeat purchase rate impact CAC?',
      ]
    : [
        'Show default probability by credit tier',
        'Identify potential fraud score outliers',
        'Compare interest yield vs DTI',
        'Which loan cohort has fastest velocity?',
      ];

  const handleRunQuery = async (queryToRun: string) => {
    if (!queryToRun.trim() || isProcessing) return;
    setIsProcessing(true);
    try {
      const res = await executeNaturalLanguageQuery(queryToRun, dataset, apiKey);
      setActiveResult(res);
    } catch (e: any) {
      alert(`Query failed: ${e.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  // Web Speech API for voice querying
  const toggleSpeechRecognition = () => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please use Google Chrome.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setQueryInput(transcript);
        setIsListening(false);
        handleRunQuery(transcript);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      console.error(err);
      setIsListening(false);
    }
  };

  return (
    <div className="w-full rounded-2xl glass-panel p-5 sm:p-6 border border-slate-800 shadow-xl">
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="w-5 h-5 text-blue-400" />
        <h3 className="text-base sm:text-lg font-bold text-white">
          Natural Language & Voice Query Engine
        </h3>
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20">
          Grounded Code Sandbox
        </span>
      </div>
      <p className="text-xs text-slate-400 mb-4">
        Ask complex statistical questions in plain English or speak directly into your microphone
      </p>

      {/* Query Bar */}
      <div className="relative flex items-center gap-2 mb-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={queryInput}
            onChange={(e) => setQueryInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleRunQuery(queryInput)}
            placeholder={`Ask anything about ${dataset.title}... (e.g. "${sampleChips[0]}")`}
            className="w-full pl-10 pr-24 py-3 rounded-xl bg-slate-900/90 border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm text-white placeholder-slate-500 outline-none transition-all shadow-inner"
          />
          <button
            onClick={() => handleRunQuery(queryInput)}
            disabled={isProcessing || !queryInput.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-50 transition-all shadow-md shadow-blue-500/20"
          >
            <span>{isProcessing ? 'Analyzing...' : 'Ask'}</span>
            <CornerDownLeft className="w-3 h-3" />
          </button>
        </div>

        {/* Voice Input Mic */}
        <button
          onClick={toggleSpeechRecognition}
          className={`p-3 rounded-xl border transition-all ${
            isListening
              ? 'bg-rose-500/20 text-rose-400 border-rose-500/40 animate-pulse'
              : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-slate-600 hover:bg-slate-800'
          }`}
          title={isListening ? 'Listening... Speak now' : 'Voice search'}
        >
          {isListening ? <Mic className="w-4 h-4 text-rose-400 animate-bounce" /> : <Mic className="w-4 h-4 text-slate-300" />}
        </button>
      </div>

      {/* Suggested Query Chips */}
      <div className="flex flex-wrap items-center gap-1.5 mb-6">
        <span className="text-[11px] text-slate-500 font-medium mr-1">Try:</span>
        {sampleChips.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => {
              setQueryInput(chip);
              handleRunQuery(chip);
            }}
            className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-900/70 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 transition-all"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Query Result View */}
      {activeResult && (
        <div className="p-5 rounded-xl bg-slate-950/80 border border-indigo-500/30 text-slate-200 animate-in fade-in duration-300">
          <div className="flex items-center justify-between gap-2 mb-3 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                {activeResult.intent}
              </span>
              <span className="text-xs text-slate-400 font-medium italic">
                &ldquo;{activeResult.query}&rdquo;
              </span>
            </div>
            <button
              onClick={() => onSpeakText(activeResult.executiveSummary)}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
            >
              Read Answer
            </button>
          </div>

          <p className="text-sm font-medium text-white mb-4 leading-relaxed">
            {activeResult.executiveSummary}
          </p>

          {/* Computed Stats Badges */}
          {activeResult.computedStats && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-4">
              {Object.entries(activeResult.computedStats).map(([key, val], idx) => (
                <div key={idx} className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800">
                  <div className="text-[10px] text-slate-400 truncate">{key}</div>
                  <div className="text-sm font-bold text-indigo-300 mt-0.5">{String(val)}</div>
                </div>
              ))}
            </div>
          )}

          {/* Rendered Chart if available */}
          {activeResult.chartData && activeResult.chartData.length > 0 && (
            <div className="w-full h-48 mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={activeResult.chartData} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="category" stroke="#64748b" fontSize={10} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const d = payload[0].payload;
                        return (
                          <div className="p-2 rounded-lg glass-panel-glow text-xs text-white">
                            <p className="font-bold">{d.category}</p>
                            <p className="text-indigo-300">${d.sum?.toLocaleString()}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="sum" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Actionable Takeaway */}
          <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20 text-xs text-emerald-300 flex items-start gap-2">
            <ArrowRight className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Executive Action: </span>
              {activeResult.actionableTakeaway}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
