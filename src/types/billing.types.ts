export type InvoiceStatus = "paid" | "pending" | "failed";
export type BillingInterval = "monthly" | "yearly";

export interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: InvoiceStatus;
  plan: string;
  description: string;
}

export interface BillingPlan {
  id: string;
  name: string;
  price: number;
  interval: BillingInterval;
  features: string[];
  apiLimit: number;
  currentUsage: number;
  highlighted?: boolean;
}

export interface BillingOverview {
  plans: BillingPlan[];
  invoices: Invoice[];
  currentPlanId: string;
}
