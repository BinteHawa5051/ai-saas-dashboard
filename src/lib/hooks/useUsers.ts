"use client";

import { useQuery } from "@tanstack/react-query";
import { usersApi } from "@/lib/api/users";

export function useUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: () => usersApi.getAll(),
    staleTime: 30_000,
  });
}
