'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { PRESET_DATASETS } from '@/lib/datasets';
import { DatasetPreset, AgentInsight } from '@/lib/types';
import {
  calculateNumericalStats,
  calculateCorrelationMatrix,
  calculateTimeSeriesForecast,
  generateCohortMatrix,
  detectAnomalies,
} from '@/lib/statsEngine';
import { generateAgentDeliberation } from '@/lib/gemini';
import { Navbar } from '@/components/Navbar';
import { DatasetSelector } from '@/components/DatasetSelector';
import { MetricCards } from '@/components/MetricCards';
import { AgentDeliberation } from '@/components/AgentDeliberation';
import { RevenueForecastChart } from '@/components/Charts/RevenueForecastChart';
import { CohortHeatmap } from '@/components/Charts/CohortHeatmap';
import { CorrelationScatter } from '@/components/Charts/CorrelationScatter';
import { AnomalyInspector } from '@/components/Charts/AnomalyInspector';
import { ChannelBreakdown } from '@/components/Charts/ChannelBreakdown';
import { WhatIfSimulator } from '@/components/WhatIfSimulator';
import { QueryConsole } from '@/components/QueryConsole';
import { ExecutiveReportModal } from '@/components/ExecutiveReportModal';
import { PresentationMode } from '@/components/PresentationMode';
import { ApiKeyModal } from '@/components/ApiKeyModal';
import { Sparkles, BrainCircuit, BarChart3 } from 'lucide-react';

export default function Home() {
  const [presets, setPresets] = useState<DatasetPreset[]>(PRESET_DATASETS);
  const [activeDataset, setActiveDataset] = useState<DatasetPreset>(PRESET_DATASETS[0]);
  const [apiKey, setApiKey] = useState<string>('');
  const [insights, setInsights] = useState<AgentInsight[]>([]);
  const [isDeliberating, setIsDeliberating] = useState<boolean>(false);
  const [isPresentationOpen, setIsPresentationOpen] = useState<boolean>(false);
  const [isReportOpen, setIsReportOpen] = useState<boolean>(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // Load API Key from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedKey = localStorage.getItem('omnimargins_gemini_api_key');
      if (savedKey) setApiKey(savedKey);
    }
  }, []);

  const handleSaveApiKey = (key: string) => {
    setApiKey(key);
    if (typeof window !== 'undefined') {
      localStorage.setItem('omnimargins_gemini_api_key', key);
    }
  };

  // Run multi-agent deliberation on dataset load or switch
  const runDeliberation = async (dataset: DatasetPreset) => {
    setIsDeliberating(true);
    try {
      const agentInsights = await generateAgentDeliberation(dataset, apiKey);
      setInsights(agentInsights);
    } catch (e) {
      console.error('Deliberation failed:', e);
    } finally {
      setIsDeliberating(false);
    }
  };

  useEffect(() => {
    runDeliberation(activeDataset);
  }, [activeDataset, apiKey]);

  const handleSelectPreset = (preset: DatasetPreset) => {
    setActiveDataset(preset);
  };

  const handleCustomDatasetLoaded = (newPreset: DatasetPreset) => {
    setPresets((prev) => [newPreset, ...prev]);
    setActiveDataset(newPreset);
  };

  // Derived Analytics Data
  const numericColumns = useMemo(() => {
    if (!activeDataset.data || activeDataset.data.length === 0) return [];
    return Object.keys(activeDataset.data[0]).filter(
      (k) => typeof activeDataset.data[0][k] === 'number'
    );
  }, [activeDataset]);

  const categoryColumns = useMemo(() => {
    if (!activeDataset.data || activeDataset.data.length === 0) return [];
    return Object.keys(activeDataset.data[0]).filter(
      (k) => typeof activeDataset.data[0][k] === 'string' && k !== 'id' && !k.toLowerCase().includes('name')
    );
  }, [activeDataset]);

  const correlations = useMemo(() => {
    return calculateCorrelationMatrix(activeDataset.data, numericColumns);
  }, [activeDataset, numericColumns]);

  const anomalies = useMemo(() => {
    return detectAnomalies(activeDataset.data, activeDataset.targetMetric);
  }, [activeDataset]);

  const forecastData = useMemo(() => {
    // Generate 6 historical points from dataset
    const periods = ['6M Ago', '5M Ago', '4M Ago', '3M Ago', '2M Ago', 'Current'];
    const totalSum = activeDataset.data.reduce((a, b) => a + (Number(b[activeDataset.targetMetric]) || 0), 0);
    const avg = totalSum / (activeDataset.data.length || 1);

    const history = periods.map((period, i) => ({
      period,
      value: Math.round(avg * (0.8 + i * 0.04 + (Math.random() * 0.05 - 0.025))),
    }));

    return calculateTimeSeriesForecast(history, 6);
  }, [activeDataset]);

  const cohortData = useMemo(() => {
    const cohortNames = ['2025-Q1', '2025-Q2', '2025-Q3', '2025-Q4', '2026-Q1', '2026-Q2'];
    return generateCohortMatrix(cohortNames);
  }, []);

  const totalBaseVal = useMemo(() => {
    return activeDataset.data.reduce((a, b) => a + (Number(b[activeDataset.targetMetric]) || 0), 0);
  }, [activeDataset]);

  // Speech Synthesis
  const handleSpeakText = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const handleToggleVoiceBriefing = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else if (insights && insights.length > 0) {
      const briefing = `OmniMetrics Executive Briefing for ${activeDataset.title}. Overall consensus: ${insights[0]?.summary}. Growth outlook: ${insights[1]?.summary}. Risk alert: ${insights[2]?.summary}`;
      handleSpeakText(briefing);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      
      {/* Top Navbar */}
      <Navbar
        onOpenPresentation={() => setIsPresentationOpen(true)}
        onOpenReport={() => setIsReportOpen(true)}
        onOpenApiKey={() => setIsApiKeyModalOpen(true)}
        isSpeaking={isSpeaking}
        onToggleSpeech={handleToggleVoiceBriefing}
        hasApiKey={!!apiKey && apiKey.length > 10}
        activeDatasetTitle={activeDataset.title}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        
        {/* Dataset Switcher & Ingestion Bar */}
        <DatasetSelector
          presets={presets}
          activePresetId={activeDataset.id}
          onSelectPreset={handleSelectPreset}
          onCustomDatasetLoaded={handleCustomDatasetLoaded}
          isLoading={isDeliberating}
        />

        {/* 4 High-Level Metric Cards */}
        <MetricCards dataset={activeDataset} />

        {/* Hero Multi-Agent Strategy Board */}
        <AgentDeliberation
          insights={insights}
          isLoading={isDeliberating}
          onRefresh={() => runDeliberation(activeDataset)}
          onSpeakText={handleSpeakText}
          isSpeaking={isSpeaking}
        />

        {/* Interactive Data Visualizations Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Forecast Chart */}
          <RevenueForecastChart
            data={forecastData}
            metricLabel={activeDataset.targetMetric}
            currency={activeDataset.currency}
          />

          {/* Cohort Retention Heatmap */}
          <CohortHeatmap
            cohorts={cohortData}
            currency={activeDataset.currency}
          />
        </div>

        {/* Secondary Analytics: Correlation Matrix & Anomaly Inspector */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7">
            <CorrelationScatter
              correlations={correlations}
              rawData={activeDataset.data}
              numericColumns={numericColumns}
            />
          </div>

          <div className="lg:col-span-5">
            <AnomalyInspector
              anomalies={anomalies}
              metricName={activeDataset.targetMetric}
              currency={activeDataset.currency}
            />
          </div>
        </div>

        {/* Segment Distribution */}
        {categoryColumns.length > 0 && (
          <ChannelBreakdown
            rawData={activeDataset.data}
            targetMetric={activeDataset.targetMetric}
            categoryColumns={categoryColumns}
            currency={activeDataset.currency}
          />
        )}

        {/* Interactive What-If Scenario Simulator */}
        <WhatIfSimulator
          baseTotal={totalBaseVal}
          category={activeDataset.category}
        />

        {/* Natural Language & Voice Query Console */}
        <QueryConsole
          dataset={activeDataset}
          apiKey={apiKey}
          onSpeakText={handleSpeakText}
        />

      </main>

      {/* Modals */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        apiKey={apiKey}
        onSaveKey={handleSaveApiKey}
      />

      <ExecutiveReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        dataset={activeDataset}
        insights={insights}
      />

      <PresentationMode
        isOpen={isPresentationOpen}
        onClose={() => setIsPresentationOpen(false)}
        dataset={activeDataset}
        insights={insights}
      />

      {/* Footer */}
      <footer className="w-full border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        <p>OmniMetrics AI • Built for Google for Startups AI Hackathon • Powered by Google Gemini 2.5</p>
      </footer>
    </div>
  );
}
