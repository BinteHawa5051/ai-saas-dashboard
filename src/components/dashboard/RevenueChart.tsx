"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { RevenueDataPoint } from "@/types/dashboard.types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ChartErrorBoundary } from "@/components/ui/ChartErrorBoundary";
import { getChartColor } from "@/lib/chart-utils";

interface RevenueChartProps {
  data: RevenueDataPoint[];
}

// Revenue data is monthly (12 points) — always show the full year.
// The date range selector affects daily usage charts, not this monthly summary.
function RevenueChartInner({ data }: RevenueChartProps) {
  const filtered = useMemo(() => data, [data]);

  const [colors, setColors] = useState({
    revenue: "hsl(221 83% 53%)",
    projected: "hsl(160 60% 45%)",
    expenses: "hsl(30 80% 55%)",
  });

  useEffect(() => {
    // #30: consistent — getChartColor returns hsl(...) resolved value
    setColors({
      revenue: getChartColor("--chart-1", "hsl(221 83% 53%)"),
      projected: getChartColor("--chart-2", "hsl(160 60% 45%)"),
      expenses: getChartColor("--chart-3", "hsl(30 80% 55%)"),
    });
  }, []);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={filtered} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={colors.revenue} stopOpacity={0.35} />
            <stop offset="95%" stopColor={colors.revenue} stopOpacity={0} />
          </linearGradient>
          <linearGradient id="projectedGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={colors.projected} stopOpacity={0.25} />
            <stop offset="95%" stopColor={colors.projected} stopOpacity={0} />
          </linearGradient>
          <linearGradient id="expensesGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={colors.expenses} stopOpacity={0.25} />
            <stop offset="95%" stopColor={colors.expenses} stopOpacity={0} />
          </linearGradient>
        </defs>
        {/* #30: axes use hsl(var(--muted-foreground)) consistently */}
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis
          dataKey="month"
          tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--popover))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "8px",
            color: "hsl(var(--popover-foreground))",
          }}
          formatter={(value) => [`$${Number(value ?? 0).toLocaleString()}`, ""]}
        />
        <Legend />
        <Area
          type="monotone"
          dataKey="revenue"
          name="Revenue"
          stroke={colors.revenue}
          fill="url(#revenueGradient)"
          strokeWidth={2}
        />
        <Area
          type="monotone"
          dataKey="projected"
          name="Projected"
          stroke={colors.projected}
          fill="url(#projectedGradient)"
          strokeWidth={2}
          strokeDasharray="4 4"
        />
        <Area
          type="monotone"
          dataKey="expenses"
          name="Expenses"
          stroke={colors.expenses}
          fill="url(#expensesGradient)"
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function RevenueChart({ data }: RevenueChartProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Revenue Overview</CardTitle>
        <CardDescription>Monthly revenue, projections, and expenses</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartErrorBoundary>
          <RevenueChartInner data={data} />
        </ChartErrorBoundary>
      </CardContent>
    </Card>
  );
}

export function RevenueChartSkeleton() {
  return (
    <Card className="h-full">
      <CardHeader>
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-4 w-56 mt-2" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-[300px] w-full" />
      </CardContent>
    </Card>
  );
}
