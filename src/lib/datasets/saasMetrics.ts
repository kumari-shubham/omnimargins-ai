export interface SaaSAccount {
  id: string;
  companyName: string;
  planTier: 'Starter' | 'Pro' | 'Enterprise' | 'Scale';
  mrr: number;
  arr: number;
  cac: number;
  nps: number;
  churnRisk: number; // 0 - 100
  status: 'Active' | 'Churned' | 'At Risk';
  industry: 'FinTech' | 'HealthTech' | 'DevTools' | 'E-Commerce' | 'Cybersecurity' | 'EdTech';
  acquisitionChannel: 'Google Ads' | 'Organic Search' | 'Outbound SDR' | 'Product-Led Referral' | 'Partner';
  supportTickets: number;
  activeUsers: number;
  signupCohort: string;
}

const companies = [
  'StripeClone Inc', 'Veritas Health', 'PulseFlow Labs', 'FinScale Global', 'DataStreamer IO',
  'NexusForge', 'Acuity Vision', 'HyperCloud Dev', 'CyberSentinel', 'OmniPay Systems',
  'QuantMatrix AI', 'BioSynth Analytics', 'AeroLogistics', 'Krypton Pay', 'Zenith Logistics',
  'Atlas Cloud', 'Beacon Media', 'Cobalt Security', 'Driftwave', 'EchoSignal',
  'Falcon Dynamics', 'Granite Labs', 'Helix Biotech', 'Ionosphere Net', 'Jupiter Fleet',
  'Kestrel Aero', 'Lunar Robotics', 'Mantle Energy', 'NovaGrid', 'Orion Logistics',
  'Polaris Med', 'Quantum Reach', 'Radiant Solar', 'Stratum AI', 'Terraform Data',
  'Umbra Defense', 'Vanguard Bio', 'Wavelength', 'Xenon Logic', 'YieldFlow',
  'Aether Bio', 'Borealis Net', 'Catalyst CRM', 'Dynamo Retail', 'Elysium Health',
  'Flux Capacitor AI', 'Genesis Gov', 'Horizon Energy', 'InfiniScale', 'JuiceFlow DTC'
];

const tiers: SaaSAccount['planTier'][] = ['Starter', 'Pro', 'Enterprise', 'Scale'];
const industries: SaaSAccount['industry'][] = ['FinTech', 'HealthTech', 'DevTools', 'E-Commerce', 'Cybersecurity', 'EdTech'];
const channels: SaaSAccount['acquisitionChannel'][] = ['Google Ads', 'Organic Search', 'Outbound SDR', 'Product-Led Referral', 'Partner'];
const cohorts = ['2025-Q1', '2025-Q2', '2025-Q3', '2025-Q4', '2026-Q1', '2026-Q2'];

export function generateSaaSDataset(count: number = 180): SaaSAccount[] {
  const accounts: SaaSAccount[] = [];

  for (let i = 0; i < count; i++) {
    const baseName = companies[i % companies.length];
    const companyName = i < companies.length ? baseName : `${baseName} ${Math.floor(i / companies.length) + 1}`;
    
    // Distribute tiers: 40% Pro, 30% Starter, 20% Enterprise, 10% Scale
    const randTier = Math.random();
    let planTier: SaaSAccount['planTier'] = 'Pro';
    let baseMRR = 499;
    let baseCAC = 1200;

    if (randTier < 0.3) {
      planTier = 'Starter';
      baseMRR = 99 + Math.floor(Math.random() * 150);
      baseCAC = 350 + Math.floor(Math.random() * 200);
    } else if (randTier < 0.7) {
      planTier = 'Pro';
      baseMRR = 499 + Math.floor(Math.random() * 400);
      baseCAC = 1200 + Math.floor(Math.random() * 600);
    } else if (randTier < 0.9) {
      planTier = 'Enterprise';
      baseMRR = 2500 + Math.floor(Math.random() * 3000);
      baseCAC = 5000 + Math.floor(Math.random() * 2500);
    } else {
      planTier = 'Scale';
      baseMRR = 7500 + Math.floor(Math.random() * 8000);
      baseCAC = 12000 + Math.floor(Math.random() * 5000);
    }

    const industry = industries[i % industries.length];
    const acquisitionChannel = channels[Math.floor(Math.random() * channels.length)];
    const signupCohort = cohorts[Math.floor(Math.random() * cohorts.length)];
    const supportTickets = Math.floor(Math.random() * 14);
    const activeUsers = planTier === 'Starter' ? 3 + Math.floor(Math.random() * 8)
      : planTier === 'Pro' ? 12 + Math.floor(Math.random() * 25)
      : planTier === 'Enterprise' ? 50 + Math.floor(Math.random() * 120)
      : 180 + Math.floor(Math.random() * 400);

    // Calculate NPS and Churn risk with correlation
    const nps = Math.min(10, Math.max(1, Math.floor(10 - supportTickets * 0.4 + (Math.random() * 3 - 1))));
    let churnRisk = Math.min(98, Math.max(2, Math.floor((10 - nps) * 9 + supportTickets * 3 + (Math.random() * 15 - 7))));

    let status: SaaSAccount['status'] = 'Active';
    if (churnRisk > 75) {
      status = Math.random() > 0.4 ? 'Churned' : 'At Risk';
    } else if (churnRisk > 45) {
      status = 'At Risk';
    }

    accounts.push({
      id: `ACC-${1000 + i}`,
      companyName,
      planTier,
      mrr: baseMRR,
      arr: baseMRR * 12,
      cac: baseCAC,
      nps,
      churnRisk,
      status,
      industry,
      acquisitionChannel,
      supportTickets,
      activeUsers,
      signupCohort,
    });
  }

  return accounts;
}
