"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  BarChart3,
  Brain,
  ChevronLeft,
  CreditCard,
  LayoutDashboard,
  Settings,
  Users,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { APP_NAME, NAV_ITEMS } from "@/lib/constants";
import { useAppStore } from "@/lib/store/useAppStore";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

const ICON_MAP: Record<string, LucideIcon> = {
  LayoutDashboard,
  BarChart3,
  Brain,
  Activity,
  Users,
  CreditCard,
  Settings,
};

interface NavItem {
  href: string;
  label: string;
  icon: string;
}

interface NavSectionProps {
  title: string;
  items: readonly NavItem[];
  collapsed: boolean;
  pathname: string;
  onNavigate?: () => void;
}

function NavSection({
  title,
  items,
  collapsed,
  pathname,
  onNavigate,
}: NavSectionProps) {
  return (
    <div className="space-y-1">
      {!collapsed && (
        <p className="px-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {title}
        </p>
      )}
      <nav className="space-y-0.5">
        {items.map((item) => {
          const Icon = ICON_MAP[item.icon];
          const isActive =
            pathname === item.href ||
            (item.href !== "/overview" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href + item.label}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                collapsed && "justify-center px-2",
              )}
              title={collapsed ? item.label : undefined}
              aria-current={isActive ? "page" : undefined}
            >
              {Icon && <Icon className="size-4 shrink-0" />}
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

function SidebarContent({
  collapsed,
  isMobile = false,
  onNavigate,
}: {
  collapsed: boolean;
  isMobile?: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const toggleSidebar = useAppStore((s) => s.toggleSidebar);

  return (
    <div className="flex h-full flex-col">
      {/* #28: logo links to /overview */}
      <div
        className={cn(
          "flex h-14 items-center gap-2 border-b border-border px-4",
          collapsed && "justify-center px-2",
        )}
      >
        <Link
          href="/overview"
          onClick={onNavigate}
          className={cn(
            "flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md",
            collapsed && "justify-center",
          )}
          aria-label={`${APP_NAME} home`}
        >
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Zap className="size-4" />
          </div>
          {!collapsed && (
            <span className="text-lg font-semibold tracking-tight">{APP_NAME}</span>
          )}
        </Link>
      </div>

      <div className="flex-1 space-y-6 overflow-y-auto p-3">
        <NavSection
          title="Main"
          items={NAV_ITEMS.main}
          collapsed={collapsed}
          pathname={pathname}
          onNavigate={onNavigate}
        />
        <NavSection
          title="AI"
          items={NAV_ITEMS.ai}
          collapsed={collapsed}
          pathname={pathname}
          onNavigate={onNavigate}
        />
        <NavSection
          title="Business"
          items={NAV_ITEMS.business}
          collapsed={collapsed}
          pathname={pathname}
          onNavigate={onNavigate}
        />
        <Separator />
        <NavSection
          title="Account"
          items={NAV_ITEMS.account}
          collapsed={collapsed}
          pathname={pathname}
          onNavigate={onNavigate}
        />
      </div>

      {/* #27: hide Collapse button inside mobile sheet — not useful there */}
      {!isMobile && (
        <div className="border-t border-border p-3">
          <Button
            variant="ghost"
            size={collapsed ? "icon" : "default"}
            className={cn("w-full", collapsed && "size-9")}
            onClick={toggleSidebar}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <ChevronLeft
              className={cn(
                "size-4 transition-transform",
                collapsed && "rotate-180",
              )}
            />
            {!collapsed && <span className="ml-2">Collapse</span>}
          </Button>
        </div>
      )}
    </div>
  );
}

export function Sidebar() {
  const collapsed = useAppStore((s) => s.sidebarCollapsed);
  const mobileOpen = useAppStore((s) => s.mobileSidebarOpen);
  const setMobileOpen = useAppStore((s) => s.setMobileSidebarOpen);

  return (
    <>
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 hidden border-r border-border bg-sidebar text-sidebar-foreground transition-all duration-300 lg:block",
          collapsed ? "w-16" : "w-60",
        )}
      >
        <SidebarContent collapsed={collapsed} isMobile={false} />
      </aside>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-60 p-0">
          <SidebarContent
            collapsed={false}
            isMobile={true}
            onNavigate={() => setMobileOpen(false)}
          />
        </SheetContent>
      </Sheet>
    </>
  );
}
