import { GetWallet } from "@/redux/actions/walletActions";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";

const useGetWallet = () => {
  const userState: UserState = useSelector((state: any) => state.user);
  const userId: string = userState?.user?.userId || "";

  const queryClient = useQueryClient();

  useQuery({
    queryKey: ["userWallet", userId],
    queryFn: GetWallet,
    retry: false,
    refetchOnMount: false,
    staleTime: 5 * 60 * 1000,
    enabled: Boolean(userId && userState.isAuthenticated),
  });
  const refreshWallet = () => {
    queryClient.invalidateQueries({
      queryKey: ["userWallet", userId],
      stale: true,
    });
  };

  const refetchWallet = () => {
    queryClient.refetchQueries({
      queryKey: ["userWallet", userId],
    });
  };
  return {
    refreshWallet,
    refetchWallet,
  };
};

export default useGetWallet;
