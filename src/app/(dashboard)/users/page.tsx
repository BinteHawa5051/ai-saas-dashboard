"use client";

import { UsersTable, UsersTableSkeleton } from "@/components/dashboard/UsersTable";
import { useUsers } from "@/lib/hooks/useUsers";

export default function UsersPage() {
  const { data, isLoading, isError } = useUsers();

  if (isLoading) {
    return <UsersTableSkeleton />;
  }

  if (isError || !data) {
    return (
      <p className="text-sm text-destructive">
        Failed to load users. Please try again later.
      </p>
    );
  }

  return <UsersTable users={data} />;
}
