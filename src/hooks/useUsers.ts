import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { User, CreateUserInput } from "@/lib/validations/user";

interface UsersApiResponse {
  success: boolean;
  data: User[];
  page: number;
  limit: number;
}

/**
 * Fetch users list from the server API with TanStack Query.
 * Includes automatic caching, background refetching, and loading/error states.
 */
export function useUsersQuery() {
  return useQuery<User[]>({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await fetch("/api/users");
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const json: UsersApiResponse = await response.json();
      return json.data;
    },
  });
}

/**
 * Create a new user with TanStack useMutation.
 * Automatically invalidates the "users" query cache on success to trigger a refetch.
 */
export function useCreateUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateUserInput) => {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        const errorJson = await response.json().catch(() => ({}));
        throw new Error(errorJson.error || "Failed to create user");
      }

      const json = await response.json();
      return json.data as User;
    },
    onSuccess: () => {
      // Invalidate the cache to immediately refresh any UI consuming ["users"]
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}
