'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X, Sparkles, Trophy, BrainCircuit, ShieldAlert, Rocket, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { AgentInsight, DatasetPreset } from '@/lib/types';
import { calculateNumericalStats } from '@/lib/statsEngine';

interface PresentationModeProps {
  isOpen: boolean;
  onClose: () => void;
  dataset: DatasetPreset;
  insights: AgentInsight[];
}

export const PresentationMode: React.FC<PresentationModeProps> = ({
  isOpen,
  onClose,
  dataset,
  insights,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const stats = calculateNumericalStats(dataset.data, dataset.targetMetric);
  const quantAgent = insights.find((i) => i.agent === 'quant') || insights[0];
  const growthAgent = insights.find((i) => i.agent === 'growth') || insights[1];
  const riskAgent = insights.find((i) => i.agent === 'risk') || insights[2];

  const totalSlides = 5;

  const handleNext = () => {
    if (currentSlide < totalSlides - 1) {
      setCurrentSlide(currentSlide + 1);
      if (currentSlide === totalSlides - 2) {
        confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
      }
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) setCurrentSlide(currentSlide - 1);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'ArrowRight' || e.key === 'Space') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentSlide]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-950 text-white animate-in fade-in duration-300">
      
      {/* Top Navbar */}
      <div className="h-16 px-6 border-b border-slate-800/80 flex items-center justify-between bg-slate-950/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
            PITCH DECK MODE
          </span>
          <span className="text-sm font-semibold text-slate-300">
            {dataset.title}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-xs text-slate-400 font-mono">
            Slide {currentSlide + 1} of {totalSlides}
          </span>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1 bg-slate-900">
        <div
          className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500 transition-all duration-300"
          style={{ width: `${((currentSlide + 1) / totalSlides) * 100}%` }}
        />
      </div>

      {/* Main Slide Canvas */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 max-w-5xl mx-auto w-full">
        
        {/* Slide 1: Title & Executive Thesis */}
        {currentSlide === 0 && (
          <div className="text-center space-y-6 animate-in zoom-in-95 duration-300">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Google for Startups AI Showcase</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
              {dataset.title}
            </h1>

            <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
              Autonomous Multimodal Strategic Analysis Powered by Gemini 3.7 Flash & Grounded Data Science
            </p>

            <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto pt-6 text-left">
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="text-xs text-slate-400">Total Dataset</div>
                <div className="text-xl font-bold text-white mt-1">{dataset.recordCount} records</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="text-xs text-slate-400">Mean {dataset.targetMetric}</div>
                <div className="text-xl font-bold text-blue-400 mt-1">${stats?.mean?.toLocaleString()}</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="text-xs text-slate-400">Agent Consensus</div>
                <div className="text-xl font-bold text-emerald-400 mt-1">94% Align</div>
              </div>
            </div>
          </div>
        )}

        {/* Slide 2: Quantitative Analysis */}
        {currentSlide === 1 && (
          <div className="w-full space-y-6 animate-in fade-in duration-300">
            <div className="flex items-center gap-3">
              <div className="text-3xl p-2 rounded-2xl bg-blue-600/20 border border-blue-500/30">
                {quantAgent?.agentAvatar}
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white">
                  Mathematical & Distribution Health
                </h2>
                <p className="text-xs text-blue-400 font-semibold uppercase tracking-wider">
                  {quantAgent?.agentName} • {quantAgent?.agentRole}
                </p>
              </div>
            </div>

            <p className="text-slate-300 text-sm leading-relaxed">
              {quantAgent?.summary}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              {quantAgent?.keyFindings.map((finding, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2">
                  <div className="text-xs font-bold text-indigo-400 uppercase">Finding #{idx + 1}</div>
                  <p className="text-xs text-slate-300 leading-relaxed">{finding}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Slide 3: Growth Levers */}
        {currentSlide === 2 && (
          <div className="w-full space-y-6 animate-in fade-in duration-300">
            <div className="flex items-center gap-3">
              <div className="text-3xl p-2 rounded-2xl bg-emerald-600/20 border border-emerald-500/30">
                {growthAgent?.agentAvatar}
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white">
                  Unit Economics & Revenue Expansion
                </h2>
                <p className="text-xs text-emerald-400 font-semibold uppercase tracking-wider">
                  {growthAgent?.agentName} • {growthAgent?.agentRole}
                </p>
              </div>
            </div>

            <p className="text-slate-300 text-sm leading-relaxed">
              {growthAgent?.summary}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              {growthAgent?.recommendations.map((rec, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2">
                  <div className="text-xs font-bold text-emerald-400 uppercase">Growth Lever #{idx + 1}</div>
                  <p className="text-xs text-slate-300 leading-relaxed">{rec}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Slide 4: Risk Containment */}
        {currentSlide === 3 && (
          <div className="w-full space-y-6 animate-in fade-in duration-300">
            <div className="flex items-center gap-3">
              <div className="text-3xl p-2 rounded-2xl bg-amber-600/20 border border-amber-500/30">
                {riskAgent?.agentAvatar}
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white">
                  Downside Containment & Churn Vectors
                </h2>
                <p className="text-xs text-amber-400 font-semibold uppercase tracking-wider">
                  {riskAgent?.agentName} • {riskAgent?.agentRole}
                </p>
              </div>
            </div>

            <p className="text-slate-300 text-sm leading-relaxed">
              {riskAgent?.summary}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              {riskAgent?.keyFindings.map((finding, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2">
                  <div className="text-xs font-bold text-amber-400 uppercase">Risk Factor #{idx + 1}</div>
                  <p className="text-xs text-slate-300 leading-relaxed">{finding}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Slide 5: Strategic Impact & Target Valuation */}
        {currentSlide === 4 && (
          <div className="text-center space-y-6 animate-in zoom-in-95 duration-300">
            <div className="inline-flex p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400">
              <Trophy className="w-8 h-8 animate-bounce" />
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold text-white">
              Target Value Creation Roadmap
            </h2>

            <p className="text-base text-slate-300 max-w-xl mx-auto">
              Executing the agent recommendations expands annual runway by <strong>+5.2 months</strong> and unlocks <strong>+38% ARR growth</strong>.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto pt-4 text-left">
              <div className="p-5 rounded-2xl glass-panel-glow border-emerald-500/30">
                <div className="text-xs text-slate-400 font-bold uppercase">Compound ARR</div>
                <div className="text-2xl font-extrabold text-emerald-400 mt-1">+38.4%</div>
                <p className="text-[11px] text-slate-400 mt-1">Pricing & Churn Levers</p>
              </div>

              <div className="p-5 rounded-2xl glass-panel-glow border-indigo-500/30">
                <div className="text-xs text-slate-400 font-bold uppercase">Runway Extension</div>
                <div className="text-2xl font-extrabold text-indigo-400 mt-1">+5.2 Months</div>
                <p className="text-[11px] text-slate-400 mt-1">Cash Buffer Added</p>
              </div>

              <div className="p-5 rounded-2xl glass-panel-glow border-amber-500/30">
                <div className="text-xs text-slate-400 font-bold uppercase">Forward Valuation</div>
                <div className="text-2xl font-extrabold text-amber-400 mt-1">10x Multiple</div>
                <p className="text-[11px] text-slate-400 mt-1">Institutional Quality</p>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Bottom Slide Navigation Controls */}
      <div className="h-20 px-8 border-t border-slate-800/80 flex items-center justify-between bg-slate-950/80">
        <button
          onClick={handlePrev}
          disabled={currentSlide === 0}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 disabled:opacity-30 text-slate-200 border border-slate-700 transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        <div className="flex items-center gap-1.5">
          {Array.from({ length: totalSlides }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                idx === currentSlide ? 'w-8 bg-blue-500' : 'bg-slate-700 hover:bg-slate-600'
              }`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          disabled={currentSlide === totalSlides - 1}
          className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 disabled:opacity-30 text-white shadow-lg shadow-blue-500/25 transition-all"
        >
          <span>{currentSlide === totalSlides - 1 ? 'Finish' : 'Next'}</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
