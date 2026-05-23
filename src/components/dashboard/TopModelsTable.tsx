"use client";

import Image from "next/image";
import type { AIModel } from "@/types/model.types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface TopModelsTableProps {
  models: AIModel[];
  limit?: number;
}

const STATUS_VARIANT: Record<
  AIModel["status"],
  "default" | "secondary" | "outline"
> = {
  active: "default",
  beta: "secondary",
  deprecated: "outline",
};

export function TopModelsTable({ models, limit = 5 }: TopModelsTableProps) {
  const sorted = [...models]
    .sort((a, b) => b.requestsToday - a.requestsToday)
    .slice(0, limit);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Top Models</CardTitle>
        <CardDescription>Highest traffic models today</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Model</TableHead>
              <TableHead className="text-right">Requests</TableHead>
              <TableHead className="text-right">Latency</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.map((model) => (
              <TableRow key={model.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="relative size-8 overflow-hidden rounded-md">
                      <Image
                        src={model.thumbnail}
                        alt={model.name}
                        fill
                        className="object-cover"
                        sizes="32px"
                      />
                    </div>
                    <div>
                      <p className="font-medium">{model.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {model.provider}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right font-mono text-sm">
                  {model.requestsToday.toLocaleString()}
                </TableCell>
                <TableCell className="text-right font-mono text-sm">
                  {model.avgLatencyMs}ms
                </TableCell>
                <TableCell className="text-right">
                  <Badge variant={STATUS_VARIANT[model.status]}>
                    {model.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export function TopModelsTableSkeleton() {
  return (
    <Card className="h-full">
      <CardHeader>
        <Skeleton className="h-6 w-28" />
        <Skeleton className="h-4 w-40 mt-2" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-48 w-full" />
      </CardContent>
    </Card>
  );
}
