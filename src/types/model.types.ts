export type ModelProvider =
  | "OpenAI"
  | "Anthropic"
  | "Google"
  | "Meta"
  | "Mistral"
  | "Stability AI";

export type ModelStatus = "active" | "deprecated" | "beta";

export interface AIModel {
  id: string;
  name: string;
  provider: ModelProvider;
  version: string;
  status: ModelStatus;
  requestsToday: number;
  avgLatencyMs: number;
  successRate: number;
  costPerToken: number;
  totalRevenue: number;
  thumbnail: string;
}
