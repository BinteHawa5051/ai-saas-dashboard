import { Skeleton } from "@/components/ui/skeleton";

// Route-level loading UI — shown by Next.js while the page segment is loading
export default function DashboardLoading() {
  return (
    <div className="space-y-6 p-4 md:p-6">
      <Skeleton className="h-8 w-48" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-32 w-full rounded-xl" />
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-5">
        <Skeleton className="h-72 w-full rounded-xl lg:col-span-3" />
        <Skeleton className="h-72 w-full rounded-xl lg:col-span-2" />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Skeleton className="h-64 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    </div>
  );
}
