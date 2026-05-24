import { create } from "zustand";
import { CURRENT_USER } from "@/lib/constants";

export type DateRange = "7d" | "30d" | "90d" | "1y";

export interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface UserProfile {
  name: string;
  email: string;
  company: string;
  bio: string;
  avatar: string;
}

interface AppStore {
  // User profile — editable from Settings
  currentUser: UserProfile;
  updateProfile: (profile: Partial<UserProfile>) => void;

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
  // Seed from the constants default user
  currentUser: {
    name: CURRENT_USER.name,
    email: CURRENT_USER.email,
    company: CURRENT_USER.company,
    bio: "Building intelligent products with NeuralDesk AI infrastructure.",
    avatar: CURRENT_USER.avatar,
  },
  updateProfile: (profile) =>
    set((state) => ({
      currentUser: { ...state.currentUser, ...profile },
    })),

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
