import {
  ColumnMeta,
  NumericalStats,
  CorrelationItem,
  ForecastPoint,
  CohortRow,
  AnomalyItem,
  SimulationParams,
  SimulationResult,
} from './types';

/**
 * Inactive or empty value checker
 */
function isValidNumber(val: any): boolean {
  if (val === null || val === undefined || val === '') return false;
  const num = Number(val);
  return !isNaN(num) && isFinite(num);
}

/**
 * Infer column metadata and types from a tabular dataset
 */
export function inferColumnTypes(data: Record<string, any>[]): ColumnMeta[] {
  if (!data || data.length === 0) return [];
  const firstRow = data[0];
  const keys = Object.keys(firstRow);

  return keys.map((key) => {
    let numberCount = 0;
    let dateCount = 0;
    let booleanCount = 0;
    let nullCount = 0;
    const values: any[] = [];
    const distinctSet = new Set<string>();

    for (let i = 0; i < Math.min(data.length, 300); i++) {
      const val = data[i][key];
      if (val === null || val === undefined || val === '') {
        nullCount++;
        continue;
      }
      distinctSet.add(String(val));
      if (values.length < 5) values.push(val);

      if (typeof val === 'boolean' || val === 'true' || val === 'false') {
        booleanCount++;
      } else if (isValidNumber(val)) {
        numberCount++;
      } else if (typeof val === 'string' && !isNaN(Date.parse(val)) && (val.includes('-') || val.includes('/') || val.includes('T'))) {
        dateCount++;
      }
    }

    const totalSampled = Math.min(data.length, 300) - nullCount;
    let type: 'number' | 'string' | 'date' | 'boolean' = 'string';

    if (totalSampled > 0) {
      if (numberCount / totalSampled > 0.8) type = 'number';
      else if (dateCount / totalSampled > 0.8) type = 'date';
      else if (booleanCount / totalSampled > 0.8) type = 'boolean';
    }

    const meta: ColumnMeta = {
      name: key,
      type,
      sampleValues: values,
      distinctCount: distinctSet.size,
      nullCount,
    };

    if (type === 'number') {
      const numVals = data
        .map((r) => Number(r[key]))
        .filter((n) => !isNaN(n) && isFinite(n));
      if (numVals.length > 0) {
        meta.min = Math.min(...numVals);
        meta.max = Math.max(...numVals);
        meta.mean = numVals.reduce((a, b) => a + b, 0) / numVals.length;
      }
    }

    return meta;
  });
}

/**
 * Calculate statistical distribution metrics for a numeric column
 */
export function calculateNumericalStats(
  data: Record<string, any>[],
  column: string
): NumericalStats | null {
  const values = data
    .map((d) => Number(d[column]))
    .filter((n) => !isNaN(n) && isFinite(n))
    .sort((a, b) => a - b);

  const count = values.length;
  if (count === 0) return null;

  const sum = values.reduce((acc, v) => acc + v, 0);
  const mean = sum / count;

  // Median & percentiles
  const median = getPercentile(values, 0.5);
  const p25 = getPercentile(values, 0.25);
  const p75 = getPercentile(values, 0.75);
  const iqr = p75 - p25;

  // Standard Deviation & Skewness
  const variance = values.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / (count > 1 ? count - 1 : 1);
  const stdDev = Math.sqrt(variance);

  let skewness = 0;
  if (stdDev > 0 && count > 2) {
    const m3 = values.reduce((acc, v) => acc + Math.pow((v - mean) / stdDev, 3), 0) / count;
    skewness = Number(m3.toFixed(3));
  }

  // Outliers using 1.5 * IQR standard
  const lowerBound = p25 - 1.5 * iqr;
  const upperBound = p75 + 1.5 * iqr;
  const outlierValues = values.filter((v) => v < lowerBound || v > upperBound);

  return {
    column,
    count,
    mean: Number(mean.toFixed(2)),
    median: Number(median.toFixed(2)),
    stdDev: Number(stdDev.toFixed(2)),
    min: values[0],
    max: values[values.length - 1],
    p25: Number(p25.toFixed(2)),
    p75: Number(p75.toFixed(2)),
    iqr: Number(iqr.toFixed(2)),
    skewness,
    outlierCount: outlierValues.length,
    outlierValues: outlierValues.slice(0, 20),
  };
}

function getPercentile(sorted: number[], p: number): number {
  if (sorted.length === 0) return 0;
  if (sorted.length === 1) return sorted[0];
  const index = (sorted.length - 1) * p;
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  const weight = index - lower;
  return sorted[lower] * (1 - weight) + sorted[upper] * weight;
}

/**
 * Calculate Pearson Correlation Matrix across all numerical columns
 */
export function calculateCorrelationMatrix(
  data: Record<string, any>[],
  numericColumns: string[]
): CorrelationItem[] {
  const results: CorrelationItem[] = [];

  for (let i = 0; i < numericColumns.length; i++) {
    for (let j = i + 1; j < numericColumns.length; j++) {
      const col1 = numericColumns[i];
      const col2 = numericColumns[j];

      const pairs = data
        .map((d) => ({
          x: Number(d[col1]),
          y: Number(d[col2]),
        }))
        .filter((p) => isValidNumber(p.x) && isValidNumber(p.y));

      if (pairs.length < 5) continue;

      const n = pairs.length;
      const sumX = pairs.reduce((acc, p) => acc + p.x, 0);
      const sumY = pairs.reduce((acc, p) => acc + p.y, 0);
      const meanX = sumX / n;
      const meanY = sumY / n;

      let num = 0;
      let denX = 0;
      let denY = 0;

      for (const p of pairs) {
        const dx = p.x - meanX;
        const dy = p.y - meanY;
        num += dx * dy;
        denX += dx * dx;
        denY += dy * dy;
      }

      const den = Math.sqrt(denX * denY);
      const r = den === 0 ? 0 : Number((num / den).toFixed(3));

      let significance: CorrelationItem['significance'] = 'neutral';
      let description = `Weak or no correlation between ${col1} and ${col2}.`;

      if (r >= 0.7) {
        significance = 'strong_positive';
        description = `Strong positive correlation (${r}): As ${col1} increases, ${col2} rises significantly.`;
      } else if (r >= 0.35) {
        significance = 'moderate_positive';
        description = `Moderate positive correlation (${r}): Positive trend between ${col1} and ${col2}.`;
      } else if (r <= -0.7) {
        significance = 'strong_negative';
        description = `Strong inverse correlation (${r}): Higher ${col1} is strongly tied to lower ${col2}.`;
      } else if (r <= -0.35) {
        significance = 'moderate_negative';
        description = `Moderate inverse correlation (${r}): ${col2} decreases as ${col1} grows.`;
      }

      results.push({
        col1,
        col2,
        r,
        significance,
        description,
      });
    }
  }

  // Sort by absolute correlation magnitude descending
  return results.sort((a, b) => Math.abs(b.r) - Math.abs(a.r));
}

/**
 * Time-series trend and future 6-12 period forecast with confidence intervals
 */
export function calculateTimeSeriesForecast(
  history: { period: string; value: number }[],
  forecastPeriods: number = 6
): ForecastPoint[] {
  if (!history || history.length < 2) return [];

  const n = history.length;
  const xVals = history.map((_, idx) => idx);
  const yVals = history.map((h) => h.value);

  // Linear Regression y = mx + c
  const meanX = xVals.reduce((a, b) => a + b, 0) / n;
  const meanY = yVals.reduce((a, b) => a + b, 0) / n;

  let num = 0;
  let den = 0;
  for (let i = 0; i < n; i++) {
    num += (xVals[i] - meanX) * (yVals[i] - meanY);
    den += Math.pow(xVals[i] - meanX, 2);
  }

  const slope = den === 0 ? 0 : num / den;
  const intercept = meanY - slope * meanX;

  // Residual variance for standard error of estimate
  let residualSumSquares = 0;
  for (let i = 0; i < n; i++) {
    const fitted = slope * i + intercept;
    residualSumSquares += Math.pow(yVals[i] - fitted, 2);
  }
  const stdError = Math.sqrt(residualSumSquares / Math.max(1, n - 2));

  const result: ForecastPoint[] = [];

  // Historical points
  history.forEach((h, idx) => {
    result.push({
      period: h.period,
      actual: Math.round(h.value),
      forecast: Math.round(slope * idx + intercept),
      lowerBound: Math.round(Math.max(0, slope * idx + intercept - 1.96 * stdError)),
      upperBound: Math.round(slope * idx + intercept + 1.96 * stdError),
    });
  });

  // Future projected periods
  const lastPeriod = history[history.length - 1].period;
  for (let step = 1; step <= forecastPeriods; step++) {
    const projectedIdx = n - 1 + step;
    const projectedVal = Math.max(0, slope * projectedIdx + intercept);
    // Confidence interval expands into future
    const intervalMultiplier = 1.96 * stdError * Math.sqrt(1 + 1 / n + Math.pow(projectedIdx - meanX, 2) / (den || 1));

    result.push({
      period: `+${step}M`,
      forecast: Math.round(projectedVal),
      lowerBound: Math.round(Math.max(0, projectedVal - intervalMultiplier)),
      upperBound: Math.round(projectedVal + intervalMultiplier),
    });
  }

  return result;
}

/**
 * Cohort Retention Matrix calculation
 */
export function generateCohortMatrix(
  cohortLabels: string[],
  baseRetentionRates: number[] = [100, 88, 81, 76, 72, 69, 66, 64, 62, 61, 60, 59]
): CohortRow[] {
  return cohortLabels.map((cohortName, cIdx) => {
    const initialUsers = 120 + (cIdx * 25) + Math.floor(Math.random() * 20);
    const initialARPU = 140 + (cIdx * 8);
    const initialRevenue = initialUsers * initialARPU;

    const periods: CohortRow['periods'] = [];
    const maxPeriods = Math.min(12, cohortLabels.length - cIdx + 4);

    for (let p = 0; p < maxPeriods; p++) {
      // Natural decay + slight random variation
      const baseRate = baseRetentionRates[p] ?? 55;
      const jitter = (Math.random() * 4 - 2);
      const retentionPct = Math.min(100, Math.max(15, Number((baseRate + jitter).toFixed(1))));
      const currentUsers = Math.round((initialUsers * retentionPct) / 100);
      const currentRevenue = Math.round(currentUsers * (initialARPU * (1 + p * 0.02)));

      periods.push({
        period: p,
        percentage: retentionPct,
        userCount: currentUsers,
        revenue: currentRevenue,
      });
    }

    return {
      cohortName,
      initialUsers,
      initialRevenue,
      periods,
    };
  });
}

/**
 * Anomaly and Outlier detection
 */
export function detectAnomalies(
  data: Record<string, any>[],
  targetMetric: string,
  idColumn: string = 'id'
): AnomalyItem[] {
  const values = data
    .map((d) => ({
      id: d[idColumn] || d['name'] || d['customerId'] || 'Unknown',
      label: String(d['name'] || d['company'] || d['customerName'] || d['channel'] || d[idColumn] || 'Entity'),
      val: Number(d[targetMetric]),
      raw: d,
    }))
    .filter((d) => isValidNumber(d.val));

  if (values.length < 5) return [];

  const count = values.length;
  const mean = values.reduce((acc, v) => acc + v.val, 0) / count;
  const variance = values.reduce((acc, v) => acc + Math.pow(v.val - mean, 2), 0) / (count - 1);
  const stdDev = Math.sqrt(variance);

  if (stdDev === 0) return [];

  const anomalies: AnomalyItem[] = [];

  values.forEach((v) => {
    const zScore = (v.val - mean) / stdDev;
    const absZ = Math.abs(zScore);

    if (absZ >= 2.0) {
      let severity: AnomalyItem['severity'] = 'low';
      if (absZ >= 3.0) severity = 'critical';
      else if (absZ >= 2.5) severity = 'medium';

      const direction = zScore > 0 ? 'spike' : 'drop';
      const reason = `${Math.abs(zScore).toFixed(1)}σ ${direction} from average (${targetMetric}: ${v.val.toLocaleString()} vs avg ${Math.round(mean).toLocaleString()})`;

      anomalies.push({
        id: v.id,
        label: v.label,
        metric: targetMetric,
        value: v.val,
        zScore: Number(zScore.toFixed(2)),
        severity,
        reason,
      });
    }
  });

  return anomalies.sort((a, b) => Math.abs(b.zScore) - Math.abs(a.zScore)).slice(0, 10);
}

/**
 * Interactive What-If Scenario Modeling Engine
 */
export function runWhatIfSimulation(
  baseARR: number,
  baseMonthlyChurnPct: number,
  baseCAC: number,
  baseARPU: number,
  params: SimulationParams
): SimulationResult {
  // Apply parameter multipliers
  const effectiveChurnRate = Math.max(0.2, (baseMonthlyChurnPct * (100 - params.churnReductionPct)) / 100);
  const effectiveARPU = baseARPU * (1 + params.pricingDeltaPct / 100);
  const effectiveCAC = baseCAC * (1 - params.cacEfficiencyPct / 100);
  const expansionBoost = params.expansionRatePct / 100;

  // LTV = ARPU / Monthly Churn
  const baseLtv = (baseARPU / (baseMonthlyChurnPct / 100));
  const baseLtvCac = Number((baseLtv / (baseCAC || 1)).toFixed(2));

  const simulatedLtv = (effectiveARPU / (effectiveChurnRate / 100));
  const simulatedLtvCac = Number((simulatedLtv / (effectiveCAC || 1)).toFixed(2));

  // 12-Month ARR Compound Simulation
  const timeline: SimulationResult['timeline'] = [];
  const months = ['Current', 'M+1', 'M+2', 'M+3', 'M+4', 'M+5', 'M+6', 'M+7', 'M+8', 'M+9', 'M+10', 'M+11', 'M+12'];

  let currBaseARR = baseARR;
  let currSimARR = baseARR;

  timeline.push({
    month: months[0],
    baseline: Math.round(currBaseARR),
    simulated: Math.round(currSimARR),
  });

  // Base monthly growth assumption: 3.5% organic net new ARR
  const baseMonthlyNetGrowth = 0.035 - (baseMonthlyChurnPct / 100);
  // Simulated monthly net growth: takes into account churn reduction, pricing, and expansion
  const simMonthlyNetGrowth = 0.035 - (effectiveChurnRate / 100) + (params.pricingDeltaPct / 100) * 0.15 + expansionBoost * 0.2;

  for (let i = 1; i <= 12; i++) {
    currBaseARR = currBaseARR * (1 + baseMonthlyNetGrowth);
    currSimARR = currSimARR * (1 + simMonthlyNetGrowth);

    timeline.push({
      month: months[i],
      baseline: Math.round(currBaseARR),
      simulated: Math.round(currSimARR),
    });
  }

  const finalBaseARR = Math.round(currBaseARR);
  const finalSimARR = Math.round(currSimARR);
  const deltaARR = finalSimARR - finalBaseARR;
  const deltaARRPct = Number(((deltaARR / finalBaseARR) * 100).toFixed(1));

  // Runway impact estimation: each $100k extra ARR adds ~1.2 months of cash runway extension
  const runwayMonthsAdded = Number(Math.max(0, (deltaARR / 85000)).toFixed(1));
  const projectedValuation = Math.round(finalSimARR * 10); // Standard 10x ARR forward valuation

  return {
    baseARR: finalBaseARR,
    simulatedARR: finalSimARR,
    deltaARR,
    deltaARRPct,
    baseLtvCac,
    simulatedLtvCac,
    runwayMonthsAdded,
    projectedValuation,
    timeline,
  };
}

/**
 * Group by categorical aggregation
 */
export function aggregateByCategory(
  data: Record<string, any>[],
  categoryCol: string,
  metricCol: string
): { category: string; sum: number; avg: number; count: number }[] {
  const groups: Record<string, { sum: number; count: number }> = {};

  data.forEach((row) => {
    const cat = String(row[categoryCol] || 'Other');
    const val = Number(row[metricCol]);
    if (!isValidNumber(val)) return;

    if (!groups[cat]) {
      groups[cat] = { sum: 0, count: 0 };
    }
    groups[cat].sum += val;
    groups[cat].count += 1;
  });

  return Object.keys(groups)
    .map((category) => ({
      category,
      sum: Math.round(groups[category].sum),
      count: groups[category].count,
      avg: Math.round(groups[category].sum / groups[category].count),
    }))
    .sort((a, b) => b.sum - a.sum);
}
