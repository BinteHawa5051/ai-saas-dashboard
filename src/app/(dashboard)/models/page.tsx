"use client";

import { useState } from "react";
import Image from "next/image";
import type { AIModel } from "@/types/model.types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useModels } from "@/lib/hooks/useModels";

const STATUS_VARIANT: Record<
  AIModel["status"],
  "default" | "secondary" | "outline"
> = {
  active: "default",
  beta: "secondary",
  deprecated: "outline",
};

function ModelCard({
  model,
  onSelect,
}: {
  model: AIModel;
  onSelect: (model: AIModel) => void;
}) {
  return (
    // Fix A2: use a button role so the card is keyboard-focusable and in tab order
    <Card
      className="cursor-pointer transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      onClick={() => onSelect(model)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(model);
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`View details for ${model.name}`}
    >
      <div className="relative h-36 w-full overflow-hidden rounded-t-lg">
        <Image
          src={model.thumbnail}
          alt={model.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base">{model.name}</CardTitle>
          <Badge variant={STATUS_VARIANT[model.status]} className="capitalize shrink-0">
            {model.status}
          </Badge>
        </div>
        <Badge variant="outline">{model.provider}</Badge>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-muted-foreground">Requests/day</p>
          <p className="font-mono font-medium">
            {model.requestsToday.toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-muted-foreground">Latency</p>
          <p className="font-mono font-medium">{model.avgLatencyMs}ms</p>
        </div>
        <div>
          <p className="text-muted-foreground">Success rate</p>
          <p className="font-mono font-medium">{model.successRate}%</p>
        </div>
        <div>
          <p className="text-muted-foreground">Cost/token</p>
          <p className="font-mono font-medium">
            ${model.costPerToken.toFixed(6)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function ModelsGridSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <Card key={i}>
          <Skeleton className="h-36 w-full rounded-t-lg" />
          <CardHeader>
            <Skeleton className="h-5 w-32" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-20 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function ModelsPage() {
  const { data, isLoading, isError } = useModels();
  const [selected, setSelected] = useState<AIModel | null>(null);

  if (isLoading) {
    return <ModelsGridSkeleton />;
  }

  if (isError || !data) {
    return (
      <p className="text-sm text-destructive">Failed to load AI models.</p>
    );
  }

  return (
    <>
      <div className="mb-6">
        <h2 className="text-lg font-semibold">AI Models</h2>
        <p className="text-sm text-muted-foreground">
          {data.length} models deployed across your infrastructure
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {data.map((model) => (
          <ModelCard key={model.id} model={model} onSelect={setSelected} />
        ))}
      </div>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-lg">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle>{selected.name}</DialogTitle>
                <DialogDescription>
                  {selected.provider} · v{selected.version}
                </DialogDescription>
              </DialogHeader>
              <div className="relative h-48 w-full overflow-hidden rounded-lg">
                <Image
                  src={selected.thumbnail}
                  alt={selected.name}
                  fill
                  className="object-cover"
                  sizes="512px"
                />
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Status</p>
                  <Badge variant={STATUS_VARIANT[selected.status]} className="mt-1 capitalize">
                    {selected.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-muted-foreground">Requests today</p>
                  <p className="font-mono font-medium">
                    {selected.requestsToday.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Avg latency</p>
                  <p className="font-mono font-medium">{selected.avgLatencyMs}ms</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Success rate</p>
                  <p className="font-mono font-medium">{selected.successRate}%</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Cost per token</p>
                  <p className="font-mono font-medium">
                    ${selected.costPerToken.toFixed(6)}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Total revenue</p>
                  <p className="font-mono font-medium">
                    ${selected.totalRevenue.toLocaleString()}
                  </p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
