"use client";

import { useEffect, useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { ModelUsageSlice } from "@/types/dashboard.types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ChartErrorBoundary } from "@/components/ui/ChartErrorBoundary";
import { getChartColor } from "@/lib/chart-utils";

interface UsageDonutChartProps {
  data: ModelUsageSlice[];
}

function UsageDonutChartInner({ data }: UsageDonutChartProps) {
  const [colors, setColors] = useState<string[]>([]);
  const total = data.reduce((sum, d) => sum + d.value, 0);

  useEffect(() => {
    const chartVars = ["--chart-1", "--chart-2", "--chart-3", "--chart-4", "--chart-5"];
    setColors(
      data.map((_, i) =>
        getChartColor(chartVars[i % chartVars.length], `hsl(${220 + i * 30} 70% 50%)`),
      ),
    );
  }, [data]);

  return (
    <div className="relative h-80">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={110}
            paddingAngle={2}
            dataKey="value"
            nameKey="name"
          >
            {data.map((entry, index) => (
              <Cell key={entry.name} fill={colors[index] ?? getChartColor("--chart-1", "#888")} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--popover))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
            }}
            formatter={(value, name) => [
              `${Number(value ?? 0).toLocaleString()} (${data.find((d) => d.name === name)?.percentage ?? 0}%)`,
              String(name ?? ""),
            ]}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold">{total.toLocaleString()}</span>
        <span className="text-xs text-muted-foreground">Total API Calls</span>
      </div>
    </div>
  );
}

export function UsageDonutChart({ data }: UsageDonutChartProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Usage by Model</CardTitle>
        <CardDescription>API call distribution across models</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartErrorBoundary>
          <UsageDonutChartInner data={data} />
        </ChartErrorBoundary>
        {/* #7: use hsl(var(--chart-N)) so CSS variable tokens resolve correctly */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          {data.map((item, i) => (
            <div key={item.name} className="flex items-center gap-2 text-xs">
              <span
                className="size-2 shrink-0 rounded-full"
                style={{ backgroundColor: `hsl(var(--chart-${(i % 5) + 1}))` }}
              />
              <span className="truncate text-muted-foreground">{item.name}</span>
              <span className="ml-auto font-medium">{item.percentage}%</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function UsageDonutChartSkeleton() {
  return (
    <Card className="h-full">
      <CardHeader>
        <Skeleton className="h-6 w-36" />
        <Skeleton className="h-4 w-48 mt-2" />
      </CardHeader>
      <CardContent>
        {/* Fix V2: donut shape skeleton (ring) instead of filled circle */}
        <div className="relative mx-auto size-56">
          <Skeleton className="size-56 rounded-full" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="size-36 rounded-full bg-card" />
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-full" />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
