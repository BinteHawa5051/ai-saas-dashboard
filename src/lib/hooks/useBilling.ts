"use client";

import { useQuery } from "@tanstack/react-query";
import { billingApi } from "@/lib/api/billing";

export function useBilling() {
  return useQuery({
    queryKey: ["billing"],
    queryFn: () => billingApi.getOverview(),
    staleTime: 30_000,
  });
}
