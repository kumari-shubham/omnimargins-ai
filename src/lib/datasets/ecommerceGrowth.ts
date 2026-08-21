export interface EcomRecord {
  id: string;
  campaignName: string;
  channel: 'Meta Ads' | 'Google Search' | 'TikTok Ads' | 'Klaviyo Email' | 'Affiliate' | 'Organic SEO';
  spend: number;
  revenue: number;
  orders: number;
  aov: number; // Average Order Value
  roas: number;
  cac: number;
  repeatPurchaseRate: number; // Percentage
  refundRate: number; // Percentage
  grossMarginPct: number;
  netProfit: number;
}

const channels: EcomRecord['channel'][] = [
  'Meta Ads', 'Google Search', 'TikTok Ads', 'Klaviyo Email', 'Affiliate', 'Organic SEO'
];

export function generateEcomDataset(count: number = 150): EcomRecord[] {
  const records: EcomRecord[] = [];

  for (let i = 0; i < count; i++) {
    const channel = channels[i % channels.length];
    let spend = 1000 + Math.floor(Math.random() * 9000);
    let roasBase = 2.4;

    if (channel === 'Klaviyo Email') {
      spend = 300 + Math.floor(Math.random() * 800);
      roasBase = 8.5;
    } else if (channel === 'Organic SEO') {
      spend = 500 + Math.floor(Math.random() * 1200);
      roasBase = 5.2;
    } else if (channel === 'Google Search') {
      roasBase = 3.2;
    } else if (channel === 'Meta Ads') {
      roasBase = 2.6;
    } else if (channel === 'TikTok Ads') {
      roasBase = 1.9;
    }

    const roas = Number((roasBase + (Math.random() * 1.6 - 0.8)).toFixed(2));
    const revenue = Math.round(spend * roas);
    const aov = 65 + Math.floor(Math.random() * 80);
    const orders = Math.max(1, Math.round(revenue / aov));
    const cac = Number((spend / orders).toFixed(2));
    const repeatPurchaseRate = Math.min(65, Math.max(8, Number((18 + (channel === 'Klaviyo Email' ? 25 : 0) + (Math.random() * 10 - 5)).toFixed(1))));
    const refundRate = Math.min(18, Math.max(1.5, Number((4.5 + (channel === 'TikTok Ads' ? 3.5 : 0) + (Math.random() * 3 - 1.5)).toFixed(1))));
    const grossMarginPct = 62 + Math.floor(Math.random() * 12);
    const grossProfit = revenue * (grossMarginPct / 100);
    const netProfit = Math.round(grossProfit - spend - (revenue * (refundRate / 100)));

    records.push({
      id: `CAM-${2000 + i}`,
      campaignName: `${channel} Campaign Q${(i % 4) + 1}-${Math.floor(i / 6) + 1}`,
      channel,
      spend,
      revenue,
      orders,
      aov,
      roas,
      cac,
      repeatPurchaseRate,
      refundRate,
      grossMarginPct,
      netProfit,
    });
  }

  return records;
}
