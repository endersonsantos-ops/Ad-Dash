
export interface RawAdData {
  adName: string;
  impressions: number;
  clicks: number;
  frequency: number;
  cpm: number;
  cpc: number;
  ctr: number;
  sales: number;
  cpa: number;
  revenue: number;
  spend: number;
  roas: number;
  margin: number;
  marginPercent: number;
  cvr: number;
}

export interface ProcessedAd extends RawAdData {
  designer: string;
  format: string;
  funnel: string;
}

export interface FormatCount {
  format: string;
  count: number;
}

export interface DesignerStat {
  name: string;
  highPerfCount: number;
  totalAdsCount: number;
  totalRevenue: number;
  formatBreakdown: FormatCount[];
}

export interface MetricSummary {
  topDesigner: string;
  topFormat: string;
  totalRevenue: number;
  totalAdsAbove100k: number;
}
