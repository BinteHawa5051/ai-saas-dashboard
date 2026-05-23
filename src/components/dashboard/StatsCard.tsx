"use client";

import {
  Clock,
  DollarSign,
  TrendingDown,
  TrendingUp,
  Users,
  Zap,
  type LucideIcon,
} from "lucide-react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
} from "recharts";
import type { StatsMetric } from "@/types/dashboard.types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { getChartColor } from "@/lib/chart-utils";

const ICON_MAP: Record<string, LucideIcon> = {
  DollarSign,
  Zap,
  Users,
  Clock,
};

interface StatsCardProps {
  metric: StatsMetric;
}

export function StatsCard({ metric }: StatsCardProps) {
  const Icon = ICON_MAP[metric.icon] ?? Zap;
  const isPositive = metric.trend === "up";
  const isNegativeGood = metric.id === "latency" && metric.change < 0;

  const chartData = metric.sparkline.map((value, index) => ({
    index,
    value,
  }));

  const chartColor = getChartColor("--chart-1", "hsl(220 70% 50%)");

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {metric.label}
        </CardTitle>
        <div className="rounded-lg bg-muted p-2">
          <Icon className="size-4 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{metric.value}</div>
        <div className="mt-1 flex items-center gap-1 text-xs">
          {(isPositive || isNegativeGood) ? (
            <TrendingUp className="size-3 text-emerald-500" />
          ) : metric.change === 0 ? null : (
            <TrendingDown className="size-3 text-red-500" />
          )}
          <span
            className={cn(
              (isPositive || isNegativeGood) && "text-emerald-500",
              !isPositive && !isNegativeGood && metric.change !== 0 && "text-red-500",
              metric.change === 0 && "text-muted-foreground",
            )}
          >
            {metric.change > 0 ? "+" : ""}
            {metric.change}%
          </span>
          <span className="text-muted-foreground">{metric.changeLabel}</span>
        </div>
        <div className="mt-3 h-12">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id={`gradient-${metric.id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={chartColor} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={chartColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="value"
                stroke={chartColor}
                fill={`url(#gradient-${metric.id})`}
                strokeWidth={2}
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export function StatsCardSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <Skeleton className="h-4 w-24" />
      </CardHeader>
      <CardContent className="space-y-3">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-3 w-40" />
        <Skeleton className="h-12 w-full" />
      </CardContent>
    </Card>
  );
}
