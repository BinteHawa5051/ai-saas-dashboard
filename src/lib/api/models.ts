import { apiClient, registerEndpoint } from "@/lib/api/client";
import { MOCK_MODELS } from "@/lib/mock/models.mock";
import type { AIModel } from "@/types/model.types";

const ENDPOINT = "/models";

registerEndpoint(ENDPOINT, () => MOCK_MODELS);

export const modelsApi = {
  getAll: (): Promise<AIModel[]> => apiClient.get<AIModel[]>(ENDPOINT),
};
