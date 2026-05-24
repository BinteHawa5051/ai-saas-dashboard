"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  CreditCard,
  LogOut,
  Menu,
  Search,
  Settings,
  User,
} from "lucide-react";
import { CURRENT_USER, DATE_RANGE_OPTIONS, PAGE_TITLES } from "@/lib/constants";
import { useAppStore } from "@/lib/store/useAppStore";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { SearchModal } from "@/components/layout/SearchModal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const setMobileOpen = useAppStore((s) => s.setMobileSidebarOpen);
  const collapsed = useAppStore((s) => s.sidebarCollapsed);
  const dateRange = useAppStore((s) => s.selectedDateRange);
  const setDateRange = useAppStore((s) => s.setDateRange);
  const notifications = useAppStore((s) => s.notifications);
  const markAllRead = useAppStore((s) => s.markAllRead);

  const [searchOpen, setSearchOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const basePath = pathname.split("?")[0];
  const pageTitle = PAGE_TITLES[basePath] ?? "Dashboard";

  const handleSignOut = () => router.push("/");

  // ⌘K / Ctrl+K opens search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-20 flex h-14 items-center gap-4 border-b border-border bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        collapsed ? "lg:pl-16" : "lg:pl-60",
      )}
    >
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={() => setMobileOpen(true)}
        aria-label="Open menu"
      >
        <Menu className="size-5" />
      </Button>

      <h1 className="text-lg font-semibold tracking-tight">{pageTitle}</h1>

      {/* Search button — opens command palette modal */}
      <div className="mx-auto hidden max-w-md flex-1 md:block">
        <button
          type="button"
          onClick={() => setSearchOpen(true)}
          className="flex h-9 w-full items-center gap-2 rounded-lg border border-input bg-muted/50 px-3 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="Open search"
        >
          <Search className="size-4 shrink-0" />
          <span className="flex-1 text-left">Search pages, models, users…</span>
          <kbd className="hidden items-center gap-1 rounded border border-border bg-background px-1.5 font-mono text-xs sm:flex">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Search modal */}
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />

      <div className="ml-auto flex items-center gap-2">
        <Select
          value={dateRange}
          onValueChange={(v) => {
            if (v) setDateRange(v as typeof dateRange);
          }}
        >
          <SelectTrigger className="hidden h-9 w-36 sm:flex" aria-label="Select date range">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {DATE_RANGE_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <ThemeToggle />

        {/* #3 / A1: DropdownMenuLabel is inside DropdownMenuGroup; aria-label on trigger */}
        <DropdownMenu>
          <DropdownMenuTrigger
            className={cn(
              buttonVariants({ variant: "ghost", size: "icon" }),
              "relative size-9",
            )}
            aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ""}`}
          >
            <Bell className="size-4" />
            {unreadCount > 0 && (
              <Badge className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full p-0 text-[10px]">
                {unreadCount}
              </Badge>
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            {/* #3: DropdownMenuLabel must be inside a DropdownMenuGroup */}
            <DropdownMenuGroup>
              <DropdownMenuLabel className="flex items-center justify-between">
                <span>Notifications</span>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={markAllRead}
                    className="text-xs font-normal text-primary hover:underline"
                  >
                    Mark all read
                  </button>
                )}
              </DropdownMenuLabel>
              {notifications.map((n) => (
                <DropdownMenuItem
                  key={n.id}
                  className={cn(
                    "flex flex-col items-start gap-1",
                    !n.read && "bg-accent/50",
                  )}
                >
                  <span className="font-medium">{n.title}</span>
                  <span className="text-xs text-muted-foreground">{n.message}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* A1: aria-label on user avatar trigger */}
        <DropdownMenu>
          <DropdownMenuTrigger
            className={cn(
              buttonVariants({ variant: "ghost", size: "icon" }),
              "relative size-9 rounded-full p-0",
            )}
            aria-label={`User menu for ${CURRENT_USER.name}`}
          >
            <Avatar className="size-8">
              <AvatarImage src={CURRENT_USER.avatar} alt={CURRENT_USER.name} />
              <AvatarFallback>
                {CURRENT_USER.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {/* #3: label inside group */}
            <DropdownMenuGroup>
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span>{CURRENT_USER.name}</span>
                  <span className="text-xs font-normal text-muted-foreground">
                    {CURRENT_USER.email}
                  </span>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                render={
                  <Link
                    href="/settings?tab=profile"
                    className="flex w-full items-center gap-2"
                  />
                }
              >
                <User className="size-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem
                render={
                  <Link href="/settings" className="flex w-full items-center gap-2" />
                }
              >
                <Settings className="size-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem
                render={
                  <Link href="/billing" className="flex w-full items-center gap-2" />
                }
              >
                <CreditCard className="size-4" />
                Billing
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {/* #16: sign out wired up */}
              <DropdownMenuItem
                variant="destructive"
                className="text-destructive focus:text-destructive"
                onClick={handleSignOut}
              >
                <LogOut className="size-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
