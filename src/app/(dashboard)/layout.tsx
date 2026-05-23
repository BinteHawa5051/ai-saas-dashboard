"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { useAppStore } from "@/lib/store/useAppStore";
import { cn } from "@/lib/utils";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const collapsed = useAppStore((s) => s.sidebarCollapsed);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div
        className={cn(
          "flex min-h-screen flex-col transition-all duration-300",
          collapsed ? "lg:pl-16" : "lg:pl-60",
        )}
      >
        <Navbar />
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
