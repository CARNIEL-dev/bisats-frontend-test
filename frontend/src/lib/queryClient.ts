import { QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      networkMode: "offlineFirst",
      staleTime: 1000 * 60 * 10, // 10 minutes
      gcTime: 1000 * 60 * 20, // 20 minutes
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
  },
});

export default queryClient;
