import { apiClient, registerEndpoint } from "@/lib/api/client";
import {
  MOCK_DASHBOARD_OVERVIEW,
  MOCK_MODEL_USAGE,
  MOCK_RECENT_ACTIVITY,
  MOCK_REVENUE,
  MOCK_STATS,
  MOCK_USAGE,
} from "@/lib/mock/dashboard.mock";
import type {
  ActivityItem,
  ModelUsageSlice,
  RevenueDataPoint,
  StatsMetric,
  UsageDataPoint,
} from "@/types/dashboard.types";

const ENDPOINTS = {
  stats: "/dashboard/stats",
  revenue: "/dashboard/revenue",
  usage: "/dashboard/usage",
  modelUsage: "/dashboard/model-usage",
  activity: "/dashboard/activity",
  overview: "/dashboard/overview",
} as const;

registerEndpoint(ENDPOINTS.stats, () => MOCK_STATS);
registerEndpoint(ENDPOINTS.revenue, () => MOCK_REVENUE);
registerEndpoint(ENDPOINTS.usage, () => MOCK_USAGE);
registerEndpoint(ENDPOINTS.modelUsage, () => MOCK_MODEL_USAGE);
registerEndpoint(ENDPOINTS.activity, () => MOCK_RECENT_ACTIVITY);
registerEndpoint(ENDPOINTS.overview, () => MOCK_DASHBOARD_OVERVIEW);

export const dashboardApi = {
  getStats: (): Promise<StatsMetric[]> =>
    apiClient.get<StatsMetric[]>(ENDPOINTS.stats),
  getRevenue: (): Promise<RevenueDataPoint[]> =>
    apiClient.get<RevenueDataPoint[]>(ENDPOINTS.revenue),
  getUsage: (): Promise<UsageDataPoint[]> =>
    apiClient.get<UsageDataPoint[]>(ENDPOINTS.usage),
  getModelUsage: (): Promise<ModelUsageSlice[]> =>
    apiClient.get<ModelUsageSlice[]>(ENDPOINTS.modelUsage),
  getActivity: (): Promise<ActivityItem[]> =>
    apiClient.get<ActivityItem[]>(ENDPOINTS.activity),
  getOverview: () => apiClient.get(ENDPOINTS.overview),
};
