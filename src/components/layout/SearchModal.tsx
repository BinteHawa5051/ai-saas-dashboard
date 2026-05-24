"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BarChart3,
  Brain,
  CreditCard,
  LayoutDashboard,
  Search,
  Settings,
  User,
  Users,
  X,
} from "lucide-react";
import { useModels } from "@/lib/hooks/useModels";
import { useUsers } from "@/lib/hooks/useUsers";
import { cn } from "@/lib/utils";

/* ─── Static nav pages ─────────────────────────────────── */
const NAV_PAGES = [
  { label: "Overview",   href: "/overview",   icon: LayoutDashboard, group: "Pages" },
  { label: "Analytics",  href: "/analytics",  icon: BarChart3,       group: "Pages" },
  { label: "Models",     href: "/models",     icon: Brain,           group: "Pages" },
  { label: "Users",      href: "/users",      icon: Users,           group: "Pages" },
  { label: "Billing",    href: "/billing",    icon: CreditCard,      group: "Pages" },
  { label: "Settings",   href: "/settings",   icon: Settings,        group: "Pages" },
];

interface SearchResult {
  id: string;
  label: string;
  sublabel?: string;
  href: string;
  icon: React.ElementType;
  group: string;
}

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

export function SearchModal({ open, onClose }: SearchModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: users } = useUsers();
  const { data: models } = useModels();

  // Focus input when modal opens
  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const results = useMemo<SearchResult[]>(() => {
    const q = query.trim().toLowerCase();
    if (!q) return NAV_PAGES.map((p) => ({ ...p, id: p.href, sublabel: undefined }));

    const matched: SearchResult[] = [];

    // Pages
    NAV_PAGES.forEach((p) => {
      if (p.label.toLowerCase().includes(q)) {
        matched.push({ ...p, id: p.href, sublabel: undefined });
      }
    });

    // Models
    models?.forEach((m) => {
      if (
        m.name.toLowerCase().includes(q) ||
        m.provider.toLowerCase().includes(q)
      ) {
        matched.push({
          id: m.id,
          label: m.name,
          sublabel: m.provider,
          href: "/models",
          icon: Brain,
          group: "Models",
        });
      }
    });

    // Users
    users?.forEach((u) => {
      if (
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q)
      ) {
        matched.push({
          id: u.id,
          label: u.name,
          sublabel: u.email,
          href: "/users",
          icon: User,
          group: "Users",
        });
      }
    });

    return matched;
  }, [query, models, users]);

  // Reset active index when results change
  useEffect(() => setActiveIndex(0), [results]);

  const handleSelect = (result: SearchResult) => {
    router.push(result.href);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && results[activeIndex]) {
      handleSelect(results[activeIndex]);
    }
  };

  // Group results
  const grouped = useMemo(() => {
    const map = new Map<string, SearchResult[]>();
    results.forEach((r) => {
      if (!map.has(r.group)) map.set(r.group, []);
      map.get(r.group)!.push(r);
    });
    return map;
  }, [results]);

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search"
        className="fixed left-1/2 top-[15%] z-50 w-full max-w-lg -translate-x-1/2 overflow-hidden rounded-2xl border border-border bg-popover shadow-2xl"
      >
        {/* Input row */}
        <div className="flex items-center gap-3 border-b border-border px-4 py-3">
          <Search className="size-4 shrink-0 text-muted-foreground" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search pages, models, users…"
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            aria-label="Search"
            autoComplete="off"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="rounded p-0.5 text-muted-foreground hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="size-4" />
            </button>
          )}
          <kbd className="hidden rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-xs text-muted-foreground sm:block">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto p-2">
          {results.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No results for &ldquo;{query}&rdquo;
            </p>
          ) : (
            Array.from(grouped.entries()).map(([group, items]) => {
              let offset = 0;
              for (const [g, its] of Array.from(grouped.entries())) {
                if (g === group) break;
                offset += its.length;
              }

              return (
                <div key={group} className="mb-1">
                  <p className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {group}
                  </p>
                  {items.map((result, i) => {
                    const flatIndex = offset + i;
                    const Icon = result.icon;
                    return (
                      <button
                        key={result.id}
                        type="button"
                        onClick={() => handleSelect(result)}
                        onMouseEnter={() => setActiveIndex(flatIndex)}
                        className={cn(
                          "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors",
                          activeIndex === flatIndex
                            ? "bg-accent text-accent-foreground"
                            : "text-foreground hover:bg-accent/50",
                        )}
                      >
                        <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-muted">
                          <Icon className="size-3.5 text-muted-foreground" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-medium">{result.label}</p>
                          {result.sublabel && (
                            <p className="truncate text-xs text-muted-foreground">
                              {result.sublabel}
                            </p>
                          )}
                        </div>
                        <kbd className="hidden shrink-0 rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground sm:block">
                          ↵
                        </kbd>
                      </button>
                    );
                  })}
                </div>
              );
            })
          )}
        </div>

        {/* Footer hint */}
        <div className="flex items-center gap-4 border-t border-border px-4 py-2 text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1"><kbd className="rounded border border-border bg-muted px-1 font-mono">↑↓</kbd> navigate</span>
          <span className="flex items-center gap-1"><kbd className="rounded border border-border bg-muted px-1 font-mono">↵</kbd> open</span>
          <span className="flex items-center gap-1"><kbd className="rounded border border-border bg-muted px-1 font-mono">ESC</kbd> close</span>
        </div>
      </div>
    </>
  );
}
