"use client";

import Image from "next/image";
import { useSession } from "next-auth/react";
import {
  RecentActivity,
  RecentActivitySkeleton,
} from "@/components/dashboard/RecentActivity";
import {
  RevenueChart,
  RevenueChartSkeleton,
} from "@/components/dashboard/RevenueChart";
import { StatsCard, StatsCardSkeleton } from "@/components/dashboard/StatsCard";
import {
  TopModelsTable,
  TopModelsTableSkeleton,
} from "@/components/dashboard/TopModelsTable";
import {
  UsageDonutChart,
  UsageDonutChartSkeleton,
} from "@/components/dashboard/UsageDonutChart";
import { HERO_IMAGE_URL } from "@/lib/constants";
import {
  useModelUsage,
  useRecentActivity,
  useRevenueChart,
  useStats,
} from "@/lib/hooks/useDashboard";
import { useModels } from "@/lib/hooks/useModels";

function StatsGrid() {
  const { data, isLoading, isError } = useStats();

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatsCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (isError || !data) {
    return <p className="text-sm text-destructive">Failed to load statistics.</p>;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {data.map((metric) => (
        <StatsCard key={metric.id} metric={metric} />
      ))}
    </div>
  );
}

function ChartsRow() {
  const modelUsage = useModelUsage();
  const revenue = useRevenueChart();

  return (
    <div className="grid gap-4 lg:grid-cols-5">
      <div className="lg:col-span-3">
        {revenue.isLoading ? (
          <RevenueChartSkeleton />
        ) : revenue.data ? (
          <RevenueChart data={revenue.data} />
        ) : (
          <p className="text-sm text-destructive">Failed to load revenue data.</p>
        )}
      </div>
      <div className="lg:col-span-2">
        {modelUsage.isLoading ? (
          <UsageDonutChartSkeleton />
        ) : modelUsage.data ? (
          <UsageDonutChart data={modelUsage.data} />
        ) : (
          <p className="text-sm text-destructive">Failed to load usage data.</p>
        )}
      </div>
    </div>
  );
}

function BottomRow() {
  const activity = useRecentActivity();
  const models = useModels();

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {activity.isLoading ? (
        <RecentActivitySkeleton />
      ) : activity.data ? (
        <RecentActivity activities={activity.data} />
      ) : (
        <p className="text-sm text-destructive">Failed to load activity.</p>
      )}
      {models.isLoading ? (
        <TopModelsTableSkeleton />
      ) : models.data ? (
        <TopModelsTable models={models.data} />
      ) : (
        <p className="text-sm text-destructive">Failed to load models.</p>
      )}
    </div>
  );
}

export default function OverviewPage() {
  const { data: session } = useSession();
  const firstName = session?.user?.name?.split(" ")[0] ?? "there";

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-xl border border-border">
        <div className="relative h-40 md:h-48">
          <Image
            src={HERO_IMAGE_URL}
            alt="Analytics dashboard"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/60 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-center p-6">
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
              Welcome back, {firstName}
            </h2>
            <p className="mt-1 max-w-lg text-sm text-muted-foreground md:text-base">
              Your AI platform processed 2.4M API calls this month with 99.2%
              uptime across all models.
            </p>
          </div>
        </div>
      </div>

      <StatsGrid />
      <ChartsRow />
      <BottomRow />
    </div>
  );
}
