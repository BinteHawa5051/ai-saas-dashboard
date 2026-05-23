import type {
  ActivityItem,
  DashboardOverview,
  ModelUsageSlice,
  RevenueDataPoint,
  StatsMetric,
  UsageDataPoint,
} from "@/types/dashboard.types";
import { MOCK_MODELS } from "@/lib/mock/models.mock";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function generateRevenueData(): RevenueDataPoint[] {
  const startRevenue = 8200;
  const endRevenue = 47000;

  return MONTHS.map((month, index) => {
    const progress = index / (MONTHS.length - 1);
    const base =
      startRevenue + (endRevenue - startRevenue) * Math.pow(progress, 1.35);
    const variance = 1 + (Math.sin(index * 1.2) * 0.08);
    const revenue = Math.round(base * variance);
    const projected = Math.round(revenue * 1.12);
    const expenses = Math.round(revenue * (0.42 + index * 0.015));

    return { month, revenue, projected, expenses };
  });
}

function generateUsageData(): UsageDataPoint[] {
  const data: UsageDataPoint[] = [];
  const now = new Date();

  // Fix F7: generate 365 days so all date range filters (7d/30d/90d/1y) have real data
  for (let i = 364; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const weekendFactor = isWeekend ? 0.72 : 1;
    const baseCalls = 72000 + Math.sin(i * 0.4) * 12000;

    data.push({
      date: date.toISOString().split("T")[0],
      apiCalls: Math.round(baseCalls * weekendFactor + (i % 5) * 1800),
      tokens: Math.round(baseCalls * weekendFactor * 2.4),
      errors: Math.round((baseCalls * weekendFactor) * 0.002 + (i % 3)),
    });
  }

  return data;
}

function generateModelUsage(): ModelUsageSlice[] {
  const total = MOCK_MODELS.reduce((sum, m) => sum + m.requestsToday, 0);

  return MOCK_MODELS.map((model) => {
    const value = model.requestsToday;
    return {
      name: model.name,
      value,
      percentage: Math.round((value / total) * 1000) / 10,
    };
  });
}

export const MOCK_STATS: StatsMetric[] = [
  {
    id: "revenue",
    label: "Total Revenue",
    value: "$124,592",
    change: 12.4,
    changeLabel: "vs last month",
    icon: "DollarSign",
    trend: "up",
    sparkline: [72, 78, 75, 82, 88, 91, 95, 98, 102, 108, 112, 118],
  },
  {
    id: "api-calls",
    label: "API Calls",
    value: "2.4M",
    change: 8.7,
    changeLabel: "vs last month",
    icon: "Zap",
    trend: "up",
    sparkline: [65, 70, 68, 74, 80, 85, 88, 92, 96, 100, 105, 110],
  },
  {
    id: "active-users",
    label: "Active Users",
    value: "8,429",
    change: 5.2,
    changeLabel: "vs last month",
    icon: "Users",
    trend: "up",
    sparkline: [58, 60, 62, 64, 66, 68, 70, 72, 74, 76, 78, 80],
  },
  {
    id: "latency",
    label: "Avg Latency",
    value: "142ms",
    change: -3.8,
    changeLabel: "vs last month",
    icon: "Clock",
    trend: "down",
    sparkline: [160, 155, 152, 150, 148, 145, 143, 142, 141, 140, 142, 142],
  },
];

export const MOCK_RECENT_ACTIVITY: ActivityItem[] = [
  {
    id: "act-001",
    type: "api",
    title: "API spike detected",
    description: "GPT-4o endpoint exceeded 50K requests in the last hour",
    timestamp: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
  },
  {
    id: "act-002",
    type: "user",
    title: "New enterprise signup",
    description: "Acme Robotics upgraded to Enterprise plan",
    timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    user: "Amara Okonkwo",
  },
  {
    id: "act-003",
    type: "billing",
    title: "Invoice paid",
    description: "Pro plan renewal processed — $99.00",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "act-004",
    type: "model",
    title: "Model deployed",
    description: "Claude 3.5 Sonnet v20241022 is now live in production",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "act-005",
    type: "alert",
    title: "Error rate threshold",
    description: "Stable Diffusion XL error rate reached 3.8% in EU region",
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "act-006",
    type: "user",
    title: "Team member invited",
    description: "Priya Sharma invited 3 collaborators to TechFlow workspace",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    user: "Priya Sharma",
  },
];

export const MOCK_REVENUE = generateRevenueData();
export const MOCK_USAGE = generateUsageData();
export const MOCK_MODEL_USAGE = generateModelUsage();

export const MOCK_DASHBOARD_OVERVIEW: DashboardOverview = {
  stats: MOCK_STATS,
  revenue: MOCK_REVENUE,
  usage: MOCK_USAGE,
  modelUsage: MOCK_MODEL_USAGE,
  recentActivity: MOCK_RECENT_ACTIVITY,
};
