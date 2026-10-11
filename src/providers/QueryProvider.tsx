"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export default function QueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Creating QueryClient inside useState ensures:
  // 1. Each browser session gets its own isolated cache.
  // 2. The client is not recreated on every component re-render.
  // 3. Different requests on the server do not accidentally share cache data.
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // Data remains fresh for 1 minute before refetching
            gcTime: 5 * 60 * 1000, // Unused cache entries are garbage collected after 5 minutes
            refetchOnWindowFocus: false, // Prevents sudden refetches when switching browser tabs
            retry: 1, // Only retry failed requests once before showing error state
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
