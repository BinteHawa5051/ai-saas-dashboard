export interface StatsMetric {
  id: string;
  label: string;
  value: string;
  change: number;
  changeLabel: string;
  icon: string;
  trend: "up" | "down" | "neutral";
  sparkline: number[];
}

export interface RevenueDataPoint {
  month: string;
  revenue: number;
  projected: number;
  expenses: number;
}

export interface UsageDataPoint {
  date: string;
  apiCalls: number;
  tokens: number;
  errors: number;
}

export interface ModelUsageSlice {
  name: string;
  value: number;
  percentage: number;
}

export interface ActivityItem {
  id: string;
  type: "api" | "user" | "billing" | "model" | "alert";
  title: string;
  description: string;
  timestamp: string;
  user?: string;
}

export interface DashboardOverview {
  stats: StatsMetric[];
  revenue: RevenueDataPoint[];
  usage: UsageDataPoint[];
  modelUsage: ModelUsageSlice[];
  recentActivity: ActivityItem[];
}
