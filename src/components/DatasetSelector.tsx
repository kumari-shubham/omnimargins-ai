'use client';

import React, { useRef, useState } from 'react';
import { Layers, ShoppingBag, ShieldCheck, UploadCloud, FileSpreadsheet, CheckCircle2, Sparkles } from 'lucide-react';
import { DatasetPreset } from '@/lib/types';
import { parseCSVData } from '@/lib/datasets';

interface DatasetSelectorProps {
  presets: DatasetPreset[];
  activePresetId: string;
  onSelectPreset: (preset: DatasetPreset) => void;
  onCustomDatasetLoaded: (dataset: DatasetPreset) => void;
  isLoading: boolean;
}

export const DatasetSelector: React.FC<DatasetSelectorProps> = ({
  presets,
  activePresetId,
  onSelectPreset,
  onCustomDatasetLoaded,
  isLoading,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Layers':
        return <Layers className="w-4 h-4 text-blue-400" />;
      case 'ShoppingBag':
        return <ShoppingBag className="w-4 h-4 text-purple-400" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-4 h-4 text-emerald-400" />;
      default:
        return <FileSpreadsheet className="w-4 h-4 text-amber-400" />;
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const text = await file.text();
      const customDataset = await parseCSVData(text, file.name);
      onCustomDatasetLoaded(customDataset);
    } catch (err: any) {
      alert(`Failed to parse CSV: ${err.message}`);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-2 rounded-2xl glass-panel border border-slate-800">
        
        {/* Preset Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {presets.map((preset) => {
            const isActive = preset.id === activePresetId;
            return (
              <button
                key={preset.id}
                onClick={() => onSelectPreset(preset)}
                disabled={isLoading}
                className={`flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-600/20 text-blue-200 border border-blue-500/40 shadow-sm shadow-blue-500/10'
                    : 'bg-slate-900/60 text-slate-400 border border-transparent hover:border-slate-700 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                {getIcon(preset.icon)}
                <div className="text-left">
                  <div className="font-semibold text-slate-100 flex items-center gap-1.5">
                    {preset.title.split('—')[0].trim()}
                    {isActive && <CheckCircle2 className="w-3 h-3 text-blue-400" />}
                  </div>
                  <div className="text-[10px] text-slate-400 hidden sm:block">
                    {preset.recordCount} rows • {preset.category.toUpperCase()}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Upload Custom CSV File */}
        <div className="flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".csv,text/csv"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading || isLoading}
            className="w-full md:w-auto flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-dashed border-slate-700 hover:border-blue-500/50 transition-all duration-200"
          >
            <UploadCloud className={`w-4 h-4 text-blue-400 ${isUploading ? 'animate-bounce' : ''}`} />
            <span>{isUploading ? 'Analyzing CSV...' : 'Upload Custom CSV'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
