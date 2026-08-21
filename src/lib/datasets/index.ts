import Papa from 'papaparse';
import { DatasetPreset } from '../types';
import { generateSaaSDataset } from './saasMetrics';
import { generateEcomDataset } from './ecommerceGrowth';
import { generateFintechDataset } from './fintechRisk';

const saasData = generateSaaSDataset(180);
const ecomData = generateEcomDataset(150);
const fintechData = generateFintechDataset(160);

export const PRESET_DATASETS: DatasetPreset[] = [
  {
    id: 'saas',
    title: 'NexusFlow AI — B2B SaaS',
    subtitle: '180 Enterprise & Growth Accounts • Churn, CAC, MRR & Cohorts',
    category: 'saas',
    icon: 'Layers',
    recordCount: saasData.length,
    data: saasData,
    targetMetric: 'mrr',
    currency: '$',
  },
  {
    id: 'ecommerce',
    title: 'AuraWear Studio — DTC Brand',
    subtitle: '150 Multi-Channel Ad Campaigns • ROAS, AOV, Margin & LTV',
    category: 'ecommerce',
    icon: 'ShoppingBag',
    recordCount: ecomData.length,
    data: ecomData,
    targetMetric: 'revenue',
    currency: '$',
  },
  {
    id: 'fintech',
    title: 'ApexCapital — Credit & Lending',
    subtitle: '160 Loan Portfolio Underwriting • Default Risk, Fraud & DTI',
    category: 'fintech',
    icon: 'ShieldCheck',
    recordCount: fintechData.length,
    data: fintechData,
    targetMetric: 'loanAmount',
    currency: '$',
  },
];

/**
 * Parse uploaded CSV text into structured JSON records and extract preset metadata
 */
export function parseCSVData(csvText: string, filename: string): Promise<DatasetPreset> {
  return new Promise((resolve, reject) => {
    Papa.parse(csvText, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (!results.data || results.data.length === 0) {
          reject(new Error('CSV file appears to be empty or unreadable.'));
          return;
        }

        const rawData = results.data as Record<string, any>[];
        // Find the most prominent numeric column as default target metric
        const firstRow = rawData[0];
        let chosenMetric = Object.keys(firstRow)[0];

        for (const key of Object.keys(firstRow)) {
          const val = Number(firstRow[key]);
          if (!isNaN(val) && (key.toLowerCase().includes('mrr') || key.toLowerCase().includes('rev') || key.toLowerCase().includes('amount') || key.toLowerCase().includes('price') || key.toLowerCase().includes('sales') || key.toLowerCase().includes('spend'))) {
            chosenMetric = key;
            break;
          }
        }

        const cleanName = filename.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');

        const customPreset: DatasetPreset = {
          id: `custom-${Date.now()}`,
          title: cleanName.charAt(0).toUpperCase() + cleanName.slice(1),
          subtitle: `Uploaded CSV • ${rawData.length.toLocaleString()} records • Auto-detected ${Object.keys(firstRow).length} dimensions`,
          category: 'custom',
          icon: 'FileSpreadsheet',
          recordCount: rawData.length,
          data: rawData,
          targetMetric: chosenMetric,
          currency: '$',
        };

        resolve(customPreset);
      },
      error: (err: any) => reject(err),
    });
  });
}
