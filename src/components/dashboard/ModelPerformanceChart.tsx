"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { AIModel } from "@/types/model.types";
import type { DateRange } from "@/lib/store/useAppStore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ChartErrorBoundary } from "@/components/ui/ChartErrorBoundary";
import { getChartColor } from "@/lib/chart-utils";

interface ModelPerformanceChartProps {
  models: AIModel[];
  // #6: accept dateRange so the chart can reflect the selected period
  dateRange?: DateRange;
}

// Short but unambiguous label — up to 2 words, max 12 chars
function getShortName(name: string): string {
  const words = name.split(" ").slice(0, 2).join(" ");
  return words.length > 12 ? `${words.slice(0, 11)}…` : words;
}

// #6: simulate date-range effect by scaling requestsToday proportionally
// (real app would re-fetch with date params; here we scale the mock values)
function applyDateRange(models: AIModel[], range: DateRange): AIModel[] {
  const scaleMap: Record<DateRange, number> = {
    "7d": 7 / 30,
    "30d": 1,
    "90d": 3,
    "1y": 12,
  };
  const scale = scaleMap[range];
  return models.map((m) => ({
    ...m,
    requestsToday: Math.round(m.requestsToday * scale),
  }));
}

function ModelPerformanceChartInner({ models, dateRange = "30d" }: ModelPerformanceChartProps) {
  const scaled = useMemo(() => applyDateRange(models, dateRange), [models, dateRange]);

  const chartData = scaled.map((m) => ({
    name: getShortName(m.name),
    latency: m.avgLatencyMs,
    successRate: m.successRate,
  }));

  const [colors, setColors] = useState({
    latency: "hsl(221 83% 53%)",
    successRate: "hsl(160 60% 45%)",
  });

  useEffect(() => {
    setColors({
      latency: getChartColor("--chart-1", "hsl(221 83% 53%)"),
      successRate: getChartColor("--chart-2", "hsl(160 60% 45%)"),
    });
  }, []);

  return (
    <ResponsiveContainer width="100%" height={360}>
      <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        {/* #30: consistent border color */}
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis
          dataKey="name"
          tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          yAxisId="left"
          tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          label={{ value: "Latency (ms)", angle: -90, position: "insideLeft", fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          domain={[90, 100]}
          tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          label={{ value: "Success %", angle: 90, position: "insideRight", fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--popover))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "8px",
            color: "hsl(var(--popover-foreground))",
          }}
        />
        <Legend />
        <Bar
          yAxisId="left"
          dataKey="latency"
          name="Avg Latency (ms)"
          fill={colors.latency}
          radius={[4, 4, 0, 0]}
        />
        <Bar
          yAxisId="right"
          dataKey="successRate"
          name="Success Rate (%)"
          fill={colors.successRate}
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function ModelPerformanceChart({ models, dateRange }: ModelPerformanceChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Model Performance</CardTitle>
        <CardDescription>
          Latency and success rate comparison across all models
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartErrorBoundary>
          <ModelPerformanceChartInner models={models} dateRange={dateRange} />
        </ChartErrorBoundary>
      </CardContent>
    </Card>
  );
}

export function ModelPerformanceChartSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-44" />
        <Skeleton className="h-4 w-64 mt-2" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-96 w-full" />
      </CardContent>
    </Card>
  );
}
