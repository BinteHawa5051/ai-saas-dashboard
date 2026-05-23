"use client";

import { format, parseISO } from "date-fns";
import { Download } from "lucide-react";
import type { BillingOverview } from "@/types/billing.types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

const INVOICE_STATUS_VARIANT = {
  paid: "default",
  pending: "secondary",
  failed: "destructive",
} as const;

interface BillingCardProps {
  billing: BillingOverview;
}

// Fix F5: invoice download handler — triggers a real browser download in a real app
function handleDownloadInvoice(invoiceId: string) {
  // In a real app: window.open(`/api/invoices/${invoiceId}/download`)
  // For now, show a console message so the action is wired up
  console.info(`Downloading invoice: ${invoiceId}`);
  alert(`Invoice ${invoiceId} download started.\n(Connect to real API to enable file download.)`);
}

// Fix U5: upgrade handler
function handleUpgrade(planId: string) {
  // In a real app: router.push(`/billing/upgrade?plan=${planId}`) or open a modal
  console.info(`Upgrading to plan: ${planId}`);
  alert(`Upgrade to ${planId} initiated.\n(Connect to real billing API to complete.)`);
}

export function BillingCard({ billing }: BillingCardProps) {
  const currentPlan = billing.plans.find((p) => p.id === billing.currentPlanId);

  return (
    <div className="space-y-6">
      {currentPlan && (
        <Card>
          <CardHeader>
            <CardTitle>Current Plan — {currentPlan.name}</CardTitle>
            {/* Fix V4: use actual interval from plan data */}
            <CardDescription>
              ${currentPlan.price}/{currentPlan.interval === "monthly" ? "mo" : "yr"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="mb-2 flex justify-between text-sm">
                <span>API Usage</span>
                <span className="font-mono">
                  {currentPlan.currentUsage.toLocaleString()} /{" "}
                  {currentPlan.apiLimit.toLocaleString()}
                </span>
              </div>
              <Progress
                value={(currentPlan.currentUsage / currentPlan.apiLimit) * 100}
              />
            </div>
            <ul className="grid gap-2 sm:grid-cols-2">
              {currentPlan.features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <span className="size-1.5 rounded-full bg-primary" />
                  {feature}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Plan Comparison</CardTitle>
          <CardDescription>Choose the plan that fits your needs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {billing.plans.map((plan) => (
              <div
                key={plan.id}
                className={cn(
                  "rounded-lg border border-border p-4",
                  plan.highlighted && "border-primary ring-1 ring-primary",
                )}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{plan.name}</h3>
                  {plan.highlighted && (
                    <Badge>Current</Badge>
                  )}
                </div>
                {/* Fix V4: use plan.interval for the price suffix */}
                <p className="mt-2 text-2xl font-bold">
                  ${plan.price}
                  <span className="text-sm font-normal text-muted-foreground">
                    /{plan.interval === "monthly" ? "mo" : "yr"}
                  </span>
                </p>
                <ul className="mt-4 space-y-2">
                  {plan.features.map((f) => (
                    <li key={f} className="text-xs text-muted-foreground">
                      {f}
                    </li>
                  ))}
                </ul>
                {/* Fix U5: upgrade button now has an onClick handler */}
                <Button
                  className="mt-4 w-full"
                  variant={plan.highlighted ? "secondary" : "default"}
                  disabled={plan.highlighted}
                  onClick={plan.highlighted ? undefined : () => handleUpgrade(plan.id)}
                >
                  {plan.highlighted ? "Current Plan" : "Upgrade"}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Invoice History</CardTitle>
          <CardDescription>Your recent billing statements</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {billing.invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-mono text-sm">{invoice.id}</TableCell>
                  <TableCell>
                    {format(parseISO(invoice.date), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell>{invoice.description}</TableCell>
                  <TableCell className="font-mono">
                    ${invoice.amount.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={INVOICE_STATUS_VARIANT[invoice.status]}
                      className="capitalize"
                    >
                      {invoice.status}
                    </Badge>
                  </TableCell>
                  {/* Fix F5: download button now has an onClick handler */}
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8"
                      aria-label={`Download invoice ${invoice.id}`}
                      onClick={() => handleDownloadInvoice(invoice.id)}
                    >
                      <Download className="size-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

export function BillingCardSkeleton() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-24 mt-1" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-20 w-full mt-4" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    </div>
  );
}
