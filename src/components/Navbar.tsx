'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Volume2,
  VolumeX,
  Presentation,
  FileText,
  Key,
  Database,
  Cpu,
  Layers
} from 'lucide-react';

interface NavbarProps {
  onOpenPresentation: () => void;
  onOpenReport: () => void;
  onOpenApiKey: () => void;
  isSpeaking: boolean;
  onToggleSpeech: () => void;
  hasApiKey: boolean;
  activeDatasetTitle: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenPresentation,
  onOpenReport,
  onOpenApiKey,
  isSpeaking,
  onToggleSpeech,
  hasApiKey,
  activeDatasetTitle,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand & Badge */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-500 shadow-lg shadow-blue-500/20">
            <Cpu className="w-5 h-5 text-white animate-pulse" />
            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                OmniMetrics
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold tracking-wider uppercase bg-blue-500/10 text-blue-400 border border-blue-500/20">
                AI Agent Studio
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-1.5">
              <span>Google for Startups AI</span>
              <span className="w-1 h-1 rounded-full bg-slate-600" />
              <span className="text-indigo-400 font-medium truncate max-w-[180px] sm:max-w-xs">{activeDatasetTitle}</span>
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Voice Executive Audio Briefing */}
          <button
            onClick={onToggleSpeech}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 border ${
              isSpeaking
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse'
                : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-slate-600 hover:bg-slate-800'
            }`}
            title={isSpeaking ? 'Stop Audio Briefing' : 'Listen to AI Agent Voice Briefing'}
          >
            {isSpeaking ? <VolumeX className="w-3.5 h-3.5 text-amber-400" /> : <Volume2 className="w-3.5 h-3.5 text-blue-400" />}
            <span className="hidden sm:inline">{isSpeaking ? 'Mute Briefing' : 'Voice Briefing'}</span>
          </button>

          {/* Presentation Mode */}
          <button
            onClick={onOpenPresentation}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-md shadow-indigo-500/20 transition-all duration-200 border border-indigo-400/30"
          >
            <Presentation className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Pitch Mode</span>
          </button>

          {/* Executive Report / PDF */}
          <button
            onClick={onOpenReport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-slate-600 transition-all duration-200"
          >
            <FileText className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Executive Memo</span>
          </button>

          {/* API Key Modal */}
          <button
            onClick={onOpenApiKey}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200 ${
              hasApiKey
                ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
            }`}
            title="Configure Google Gemini API Key"
          >
            <Key className={`w-3.5 h-3.5 ${hasApiKey ? 'text-emerald-400' : 'text-slate-400'}`} />
            <span className="hidden md:inline">{hasApiKey ? 'Gemini Active' : 'Gemini Key'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
