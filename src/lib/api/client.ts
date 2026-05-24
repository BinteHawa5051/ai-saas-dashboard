type EndpointHandler<T> = () => T | Promise<T>;

const endpointRegistry = new Map<string, EndpointHandler<unknown>>();

export function registerEndpoint<T>(
  endpoint: string,
  handler: EndpointHandler<T>,
): void {
  endpointRegistry.set(endpoint, handler as EndpointHandler<unknown>);
}

class ApiClient {
  private baseDelay = 100; // reduced from 300ms
  // #25: set to a number 0–1 to simulate random failures (e.g. 0.1 = 10% failure rate)
  // Keep at 0 in production; set to 0.3 in dev to test error UI
  private errorRate = 0;

  async get<T>(endpoint: string, delay?: number): Promise<T> {
    await this.simulateLatency(delay ?? this.baseDelay);

    // #25: simulate random API failures so isError branches are testable
    if (this.errorRate > 0 && Math.random() < this.errorRate) {
      throw new Error(`Simulated failure for endpoint: ${endpoint}`);
    }

    const handler = endpointRegistry.get(endpoint);
    if (!handler) {
      throw new Error(`No handler registered for endpoint: ${endpoint}`);
    }

    return (await handler()) as T;
  }

  /** Call this in dev to test error states: apiClient.setErrorRate(0.3) */
  setErrorRate(rate: number): void {
    this.errorRate = Math.max(0, Math.min(1, rate));
  }

  private simulateLatency(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export const apiClient = new ApiClient();
