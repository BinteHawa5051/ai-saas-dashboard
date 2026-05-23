"use client";

import {
  ModelPerformanceChart,
  ModelPerformanceChartSkeleton,
} from "@/components/dashboard/ModelPerformanceChart";
import { UsageChart, UsageChartSkeleton } from "@/components/dashboard/UsageChart";
import { useUsageChart } from "@/lib/hooks/useDashboard";
import { useModels } from "@/lib/hooks/useModels";
import { useAppStore } from "@/lib/store/useAppStore";

export default function AnalyticsPage() {
  // #4 / #6: dateRange now flows into both charts on this page
  const dateRange = useAppStore((s) => s.selectedDateRange);
  const usage = useUsageChart();
  const models = useModels();

  return (
    <div className="space-y-6">
      {usage.isLoading ? (
        <UsageChartSkeleton />
      ) : usage.data ? (
        <UsageChart data={usage.data} dateRange={dateRange} />
      ) : (
        <p className="text-sm text-destructive">Failed to load usage chart.</p>
      )}

      {models.isLoading ? (
        <ModelPerformanceChartSkeleton />
      ) : models.data ? (
        <ModelPerformanceChart models={models.data} dateRange={dateRange} />
      ) : (
        <p className="text-sm text-destructive">
          Failed to load model performance data.
        </p>
      )}
    </div>
  );
}
