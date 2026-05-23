"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Brush,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { format, parseISO, subDays } from "date-fns";
import type { UsageDataPoint } from "@/types/dashboard.types";
import type { DateRange } from "@/lib/store/useAppStore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ChartErrorBoundary } from "@/components/ui/ChartErrorBoundary";
import { getChartColor } from "@/lib/chart-utils";

interface UsageChartProps {
  data: UsageDataPoint[];
  dateRange?: DateRange;
}

// Fix F7: filter by actual date comparison, not array slice count
function filterByDateRange(data: UsageDataPoint[], range: DateRange): UsageDataPoint[] {
  const daysMap: Record<DateRange, number> = {
    "7d": 7,
    "30d": 30,
    "90d": 90,
    "1y": 365,
  };
  const cutoff = subDays(new Date(), daysMap[range]);
  return data.filter((d) => parseISO(d.date) >= cutoff);
}

function UsageChartInner({ data, dateRange = "30d" }: UsageChartProps) {
  const filtered = useMemo(
    () => filterByDateRange(data, dateRange),
    [data, dateRange],
  );

  const chartData = filtered.map((d) => ({
    ...d,
    label: format(parseISO(d.date), "MMM d"),
  }));

  const [colors, setColors] = useState({
    apiCalls: "hsl(220 70% 50%)",
    tokens: "hsl(160 60% 45%)",
    errors: "hsl(0 70% 50%)",
  });

  useEffect(() => {
    setColors({
      apiCalls: getChartColor("--chart-1", "hsl(220 70% 50%)"),
      tokens: getChartColor("--chart-2", "hsl(160 60% 45%)"),
      errors: getChartColor("--destructive", "hsl(0 70% 50%)"),
    });
  }, []);

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        {/* #30: consistent border color */}
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis
          dataKey="label"
          tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          yAxisId="left"
          tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v: number) =>
            v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v)
          }
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
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
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="apiCalls"
          name="API Calls"
          stroke={colors.apiCalls}
          strokeWidth={2}
          dot={false}
        />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="tokens"
          name="Tokens"
          stroke={colors.tokens}
          strokeWidth={2}
          dot={false}
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="errors"
          name="Errors"
          stroke={colors.errors}
          strokeWidth={2}
          dot={false}
        />
        <Brush dataKey="label" height={24} stroke={colors.apiCalls} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function UsageChart({ data, dateRange }: UsageChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>API Usage Trends</CardTitle>
        <CardDescription>
          API calls, token consumption, and error rates over time
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartErrorBoundary>
          <UsageChartInner data={data} dateRange={dateRange} />
        </ChartErrorBoundary>
      </CardContent>
    </Card>
  );
}

export function UsageChartSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-4 w-64 mt-2" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-96 w-full" />
      </CardContent>
    </Card>
  );
}
