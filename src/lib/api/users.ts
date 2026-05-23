import { apiClient, registerEndpoint } from "@/lib/api/client";
import { MOCK_USERS } from "@/lib/mock/users.mock";
import type { User } from "@/types/user.types";

const ENDPOINT = "/users";

registerEndpoint(ENDPOINT, () => MOCK_USERS);

export const usersApi = {
  getAll: (): Promise<User[]> => apiClient.get<User[]>(ENDPOINT),
};
