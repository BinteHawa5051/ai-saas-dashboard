import { apiClient, registerEndpoint } from "@/lib/api/client";
import { MOCK_BILLING } from "@/lib/mock/billing.mock";
import type { BillingOverview } from "@/types/billing.types";

const ENDPOINT = "/billing";

registerEndpoint(ENDPOINT, () => MOCK_BILLING);

export const billingApi = {
  getOverview: (): Promise<BillingOverview> =>
    apiClient.get<BillingOverview>(ENDPOINT),
};
