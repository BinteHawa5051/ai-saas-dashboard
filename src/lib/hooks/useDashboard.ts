"use client";

import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "@/lib/api/dashboard";

const STALE_TIME = 30_000;

export function useStats() {
  return useQuery({
    queryKey: ["stats"],
    queryFn: () => dashboardApi.getStats(),
    staleTime: STALE_TIME,
  });
}

export function useRevenueChart() {
  return useQuery({
    queryKey: ["revenue"],
    queryFn: () => dashboardApi.getRevenue(),
    staleTime: STALE_TIME,
  });
}

export function useUsageChart() {
  return useQuery({
    queryKey: ["usage"],
    queryFn: () => dashboardApi.getUsage(),
    staleTime: STALE_TIME,
  });
}

export function useModelUsage() {
  return useQuery({
    queryKey: ["model-usage"],
    queryFn: () => dashboardApi.getModelUsage(),
    staleTime: STALE_TIME,
  });
}

export function useRecentActivity() {
  return useQuery({
    queryKey: ["activity"],
    queryFn: () => dashboardApi.getActivity(),
    staleTime: STALE_TIME,
  });
}
// C4: removed unused useDashboardOverview hook
