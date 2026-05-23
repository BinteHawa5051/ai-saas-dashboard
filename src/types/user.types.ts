export type UserPlan = "free" | "pro" | "enterprise";
export type UserStatus = "active" | "inactive" | "suspended";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  plan: UserPlan;
  status: UserStatus;
  apiCalls: number;
  joinedAt: string;
  lastActive: string;
  country: string;
  monthlySpend: number;
}

export interface CurrentUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  company: string;
}
