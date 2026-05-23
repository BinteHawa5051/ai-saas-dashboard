"use client";

import { useQuery } from "@tanstack/react-query";
import { modelsApi } from "@/lib/api/models";

export function useModels() {
  return useQuery({
    queryKey: ["models"],
    queryFn: () => modelsApi.getAll(),
    staleTime: 30_000,
  });
}
