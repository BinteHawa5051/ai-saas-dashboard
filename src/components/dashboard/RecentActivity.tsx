"use client";

import { formatDistanceToNow, parseISO } from "date-fns";
import {
  AlertTriangle,
  Brain,
  CreditCard,
  User,
  Zap,
} from "lucide-react";
import type { ActivityItem } from "@/types/dashboard.types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const TYPE_CONFIG = {
  api: { icon: Zap, color: "text-blue-500 bg-blue-500/10" },
  user: { icon: User, color: "text-emerald-500 bg-emerald-500/10" },
  billing: { icon: CreditCard, color: "text-violet-500 bg-violet-500/10" },
  model: { icon: Brain, color: "text-amber-500 bg-amber-500/10" },
  alert: { icon: AlertTriangle, color: "text-red-500 bg-red-500/10" },
} as const;

interface RecentActivityProps {
  activities: ActivityItem[];
}

export function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest events across your workspace</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {activities.map((activity) => {
            const config = TYPE_CONFIG[activity.type];
            const Icon = config.icon;

            return (
              <li key={activity.id} className="flex gap-3">
                <div
                  className={cn(
                    "flex size-9 shrink-0 items-center justify-center rounded-lg",
                    config.color,
                  )}
                >
                  <Icon className="size-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium leading-none">
                    {activity.title}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                    {activity.description}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {formatDistanceToNow(parseISO(activity.timestamp), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}

export function RecentActivitySkeleton() {
  return (
    <Card className="h-full">
      <CardHeader>
        <Skeleton className="h-6 w-36" />
        <Skeleton className="h-4 w-48 mt-2" />
      </CardHeader>
      <CardContent className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex gap-3">
            <Skeleton className="size-9 rounded-lg" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-full" />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
