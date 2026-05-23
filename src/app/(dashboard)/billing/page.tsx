"use client";

import { BillingCard, BillingCardSkeleton } from "@/components/dashboard/BillingCard";
import { useBilling } from "@/lib/hooks/useBilling";

export default function BillingPage() {
  const { data, isLoading, isError } = useBilling();

  if (isLoading) {
    return <BillingCardSkeleton />;
  }

  if (isError || !data) {
    return (
      <p className="text-sm text-destructive">Failed to load billing information.</p>
    );
  }

  return <BillingCard billing={data} />;
}
