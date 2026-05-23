import type { User } from "@/types/user.types";

const FIRST_NAMES = [
  "Amara",
  "Kenji",
  "Priya",
  "Luca",
  "Fatima",
  "Ethan",
  "Yuki",
  "Ingrid",
  "Mateo",
  "Aisha",
  "Oliver",
  "Zara",
  "Raj",
  "Elena",
  "Noah",
  "Mei",
  "Andre",
  "Chloe",
  "Hassan",
  "Violet",
];

const LAST_NAMES = [
  "Okonkwo",
  "Tanaka",
  "Sharma",
  "Rossi",
  "Al-Farsi",
  "Brooks",
  "Nakamura",
  "Lindqvist",
  "Silva",
  "Khan",
  "Whitmore",
  "Petrov",
  "Menon",
  "Vasquez",
  "Fischer",
  "Chen",
  "Dupont",
  "Nguyen",
  "Rahman",
  "Ashford",
];

const COUNTRIES = [
  { code: "US", flag: "🇺🇸" },
  { code: "GB", flag: "🇬🇧" },
  { code: "DE", flag: "🇩🇪" },
  { code: "JP", flag: "🇯🇵" },
  { code: "IN", flag: "🇮🇳" },
  { code: "BR", flag: "🇧🇷" },
  { code: "CA", flag: "🇨🇦" },
  { code: "AU", flag: "🇦🇺" },
  { code: "FR", flag: "🇫🇷" },
  { code: "SG", flag: "🇸🇬" },
];

const PLANS: User["plan"][] = ["free", "pro", "enterprise"];
const STATUSES: User["status"][] = ["active", "inactive", "suspended"];

function slugify(name: string): string {
  return name.toLowerCase().replace(/\s+/g, ".");
}

function randomDate(monthsAgo: number): string {
  const now = new Date();
  const past = new Date(now);
  past.setMonth(past.getMonth() - monthsAgo);
  past.setDate(past.getDate() - Math.floor(Math.random() * 28));
  return past.toISOString();
}

function recentActive(): string {
  const hoursAgo = Math.floor(Math.random() * 720);
  const date = new Date();
  date.setHours(date.getHours() - hoursAgo);
  return date.toISOString();
}

export const MOCK_USERS: User[] = FIRST_NAMES.map((first, index) => {
  const last = LAST_NAMES[index];
  const name = `${first} ${last}`;
  const plan = PLANS[index % PLANS.length];
  const country = COUNTRIES[index % COUNTRIES.length];
  const monthsAgo = Math.floor(index / 2) + 1;

  const baseCalls =
    plan === "enterprise"
      ? 450000 + index * 12000
      : plan === "pro"
        ? 85000 + index * 5000
        : 12000 + index * 800;

  const monthlySpend =
    plan === "enterprise"
      ? 899 + index * 45
      : plan === "pro"
        ? 99 + index * 8
        : index % 3 === 0
          ? 29
          : 0;

  return {
    id: `user-${String(index + 1).padStart(3, "0")}`,
    name,
    email: `${slugify(name)}@${index % 2 === 0 ? "acme.io" : "techflow.com"}`,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(first)}&backgroundColor=b6e3f4`,
    plan,
    status: index === 17 ? "suspended" : index === 12 ? "inactive" : STATUSES[0],
    apiCalls: baseCalls,
    joinedAt: randomDate(monthsAgo),
    lastActive: recentActive(),
    country: `${country.flag} ${country.code}`,
    monthlySpend,
  };
});
