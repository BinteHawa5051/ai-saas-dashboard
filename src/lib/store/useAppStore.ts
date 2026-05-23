import { create } from "zustand";

export type DateRange = "7d" | "30d" | "90d" | "1y";

export interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

interface AppStore {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  selectedDateRange: DateRange;
  setDateRange: (range: DateRange) => void;
  notifications: Notification[];
  markAllRead: () => void;
  mobileSidebarOpen: boolean;
  setMobileSidebarOpen: (open: boolean) => void;
}

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: "n1",
    title: "API limit warning",
    message: "You have used 92% of your monthly API quota.",
    read: false,
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
  {
    id: "n2",
    title: "New model available",
    message: "Claude 3.5 Sonnet is now available in your region.",
    read: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "n3",
    title: "Invoice ready",
    message: "Your May 2025 invoice is ready for download.",
    read: true,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const useAppStore = create<AppStore>((set) => ({
  sidebarCollapsed: false,
  toggleSidebar: () =>
    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  selectedDateRange: "30d",
  setDateRange: (range) => set({ selectedDateRange: range }),
  notifications: INITIAL_NOTIFICATIONS,
  markAllRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
    })),
  mobileSidebarOpen: false,
  setMobileSidebarOpen: (open) => set({ mobileSidebarOpen: open }),
}));
