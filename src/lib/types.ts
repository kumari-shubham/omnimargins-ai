export type DataType = 'number' | 'string' | 'date' | 'boolean';

export interface ColumnMeta {
  name: string;
  type: DataType;
  sampleValues: (string | number | boolean)[];
  distinctCount: number;
  nullCount: number;
  min?: number;
  max?: number;
  mean?: number;
}

export interface NumericalStats {
  column: string;
  count: number;
  mean: number;
  median: number;
  stdDev: number;
  min: number;
  max: number;
  p25: number;
  p75: number;
  iqr: number;
  skewness: number;
  outlierCount: number;
  outlierValues: number[];
}

export interface CorrelationItem {
  col1: string;
  col2: string;
  r: number;
  significance: 'strong_positive' | 'moderate_positive' | 'neutral' | 'moderate_negative' | 'strong_negative';
  description: string;
}

export interface ForecastPoint {
  period: string;
  actual?: number;
  forecast: number;
  lowerBound: number;
  upperBound: number;
}

export interface CohortPeriod {
  period: number; // Month 0, Month 1, etc.
  percentage: number;
  revenue: number;
  userCount: number;
}

export interface CohortRow {
  cohortName: string;
  initialUsers: number;
  initialRevenue: number;
  periods: CohortPeriod[];
}

export interface AnomalyItem {
  id: string | number;
  label: string;
  metric: string;
  value: number;
  zScore: number;
  severity: 'low' | 'medium' | 'critical';
  reason: string;
}

export interface AgentInsight {
  agent: 'quant' | 'growth' | 'risk';
  agentName: string;
  agentRole: string;
  agentAvatar: string;
  title: string;
  summary: string;
  metrics: { label: string; value: string; delta?: string; status?: 'positive' | 'negative' | 'neutral' }[];
  keyFindings: string[];
  recommendations: string[];
  confidenceScore: number; // 0 - 100
}

export interface SimulationParams {
  pricingDeltaPct: number; // e.g. +10%
  churnReductionPct: number; // e.g. -15%
  cacEfficiencyPct: number; // e.g. +20%
  expansionRatePct: number; // e.g. +10%
}

export interface SimulationResult {
  baseARR: number;
  simulatedARR: number;
  deltaARR: number;
  deltaARRPct: number;
  baseLtvCac: number;
  simulatedLtvCac: number;
  runwayMonthsAdded: number;
  projectedValuation: number; // at 10x ARR multiple
  timeline: {
    month: string;
    baseline: number;
    simulated: number;
  }[];
}

export interface DatasetPreset {
  id: string;
  title: string;
  subtitle: string;
  category: 'saas' | 'ecommerce' | 'fintech' | 'custom';
  icon: string;
  recordCount: number;
  data: Record<string, any>[];
  targetMetric: string;
  currency: string;
}

export interface QueryResult {
  query: string;
  intent: string;
  executiveSummary: string;
  computedStats?: Record<string, string | number>;
  recommendedChart: 'kpi' | 'line' | 'bar' | 'scatter' | 'cohort' | 'table';
  chartData?: any[];
  chartKeys?: { x: string; y: string; category?: string };
  actionableTakeaway: string;
}
