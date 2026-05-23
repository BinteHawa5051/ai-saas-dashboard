import type { CurrentUser } from "@/types/user.types";

export const APP_NAME = "NeuralDesk";

export const CURRENT_USER: CurrentUser = {
  id: "user-001",
  name: "Sofia Martinez",
  email: "sofia.martinez@neuraldesk.io",
  avatar:
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Sofia&backgroundColor=b6e3f4",
  role: "Admin",
  company: "NeuralDesk Inc.",
};

export const HERO_IMAGE_URL =
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80";

// #4 / #5: limit date range options to what the mock data actually supports (365 days)
export const DATE_RANGE_OPTIONS = [
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "90d", label: "Last 90 days" },
  { value: "1y", label: "Last year" },
] as const;

// #8: removed duplicate /analytics "Usage" entry — replaced with dedicated /models link
export const NAV_ITEMS = {
  main: [
    { href: "/overview", label: "Overview", icon: "LayoutDashboard" },
    { href: "/analytics", label: "Analytics", icon: "BarChart3" },
  ],
  ai: [
    { href: "/models", label: "Models", icon: "Brain" },
    { href: "/users", label: "Usage", icon: "Activity" },
  ],
  business: [
    { href: "/users", label: "Users", icon: "Users" },
    { href: "/billing", label: "Billing", icon: "CreditCard" },
  ],
  account: [
    { href: "/settings", label: "Settings", icon: "Settings" },
  ],
} as const;

// #9: PAGE_TITLES covers /settings with and without query params
export const PAGE_TITLES: Record<string, string> = {
  "/overview": "Overview",
  "/analytics": "Analytics",
  "/users": "Users",
  "/models": "Models",
  "/billing": "Billing",
  "/settings": "Settings",
};
