import TableActionMenu from "@/components/Modals/TableActionMenu";
import Switch from "@/components/Switch";
import Toast from "@/components/Toast";
import { DataTable } from "@/components/ui/data-table";
import Header from "@/pages/p2p/components/Header";
import { cn, formatter } from "@/utils";
import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { useSelector } from "react-redux";

import KycBanner from "@/components/KycBanner";
import ErrorDisplay from "@/components/shared/ErrorDisplay";
import { Button, buttonVariants } from "@/components/ui/Button";
import { APP_ROUTES } from "@/constants/app_route";
import PreLoader from "@/layouts/PreLoader";
import KycManager from "@/pages/kyc/KYCManager";
import { updateAdStatus, useFetchUserAds } from "@/redux/actions/walletActions";

import { ACTIONS } from "@/utils/transaction_limits";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Check } from "lucide-react";
import ModalTemplate from "@/components/Modals/ModalTemplate";

export interface Ad {
  id: string;
  type: string;
  asset: string;
  price: number;
  quantity?: number;
  amountFilled: number;
  status: string;
  createdAt?: string;
  closedAt?: string;
  priceType: string;
  priceMargin: number;
}

export type UpdateAdStatusResponse = {
  status: boolean;
  data: any;
  message: string;
};

const MyAds = () => {
  const userState: UserState = useSelector((state: any) => state.user);
  const userId: string = userState?.user?.userId || "";
  const queryClient = useQueryClient();

  const navigate = useNavigate();

  const isKycVerified = [
    userState?.kyc?.personalInformationVerified,
    // userState.user?.phoneNumberVerified,
  ].every(Boolean);

  const {
    data: userAds = [],
    isError,
    error,
    isLoading,
  } = useFetchUserAds({
    userId,
    isKycVerified: isKycVerified || !userState.user?.hasAppliedToBeInLevelOne,
  });

  const adsData = useMemo(() => {
    const activeAds = userAds.filter((ad) => ad.status !== "closed");
    const closedAds = userAds.filter((ad) => ad.status === "closed");
    return {
      activeAds,
      closedAds,
    };
  }, [userAds]);

  //HDR: Mutation function
  const mutation = useMutation<
    UpdateAdStatusResponse,
    Error,
    UpdateAdStatusVars
  >({
    mutationFn: ({ userId, adId, status }: UpdateAdStatusVars) =>
      updateAdStatus({ userId, adId, newStatus: status }),
    onSuccess(_, variables) {
      queryClient.invalidateQueries({
        queryKey: ["userAds", variables.userId],
      });
      queryClient.invalidateQueries({
        queryKey: ["userNotifications", variables.userId],
      });
    },
    onError(err) {
      console.log(err);
      Toast.error(err.message || "Failed to update ad status", "Failed");
    },
  });

  //   HDR: Update ads status
  const handleStatusToggle = (ad: AdsTypes) => {
    const newStatus = ad.status === "active" ? "disabled" : "active";
    mutation.mutate({
      userId,
      adId: ad.id,
      status: newStatus,
    });
  };

  // SUB: Disabled reason modal state
  const [showReasonAd, setShowReasonAd] = useState<AdsTypes | null>(null);

  const handleCloseAd = (adId: string) => {
    mutation.mutate({
      userId,
      adId,
      status: "closed",
    });
  };

  //   HDR: Columns
  const column: ColumnDef<AdsTypes>[] = [
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => {
        const ad = row.original.type;

        return (
          <span
            className={cn(
              "font-semibold capitalize",
              ad.toLowerCase() === "sell" ? "text-red-500" : "text-green-600"
            )}
          >
            {ad}
          </span>
        );
      },
    },
    {
      accessorKey: "asset",
      header: "Asset",
      cell: ({ row }) => {
        const asset = row.original.asset;
        return <span className="font-semibold text-gray-600 ">{asset}</span>;
      },
    },
    {
      accessorKey: "price",
      header: "Price (xNGN)",
      cell: ({ row }) => {
        const price = row.original.price;
        return (
          <span className="text-gray-600 ">
            {formatter({
              decimal: 0,
            }).format(price || 0)}
          </span>
        );
      },
    },
    // {
    //   accessorKey: "minimumLimit",
    //   header: "Minimum Limit (xNGN)",
    //   cell: ({ row }) => {
    //     const price = row.original.minimumLimit;
    //     return (
    //       <span className="text-gray-600 ">
    //         {formatter({
    //           decimal: 0,
    //         }).format(price || 0)}
    //       </span>
    //     );
    //   },
    // },
    // {
    //   accessorKey: "maximumLimit",
    //   header: "Maximum Limit (xNGN)",
    //   cell: ({ row }) => {
    //     const price = row.original.maximumLimit;
    //     return (
    //       <span className="text-gray-600 ">
    //         {formatter({
    //           decimal: 0,
    //         }).format(price || 0)}
    //       </span>
    //     );
    //   },
    // },
    {
      accessorKey: "amountFilled",
      header: () => {
        return (
          <div className="text-gray-600 flex items-center gap-2 ">
            Amount Fulfilled
            <span className="inline-grid border border-green-600  place-content-center rounded-full size-4">
              <Check className="size-3 text-green-500" />
            </span>
          </div>
        );
      },
      cell: ({ row }) => {
        const item = row.original;
        const amount =
          item.type !== "buy"
            ? formatter({ decimal: item.asset === "USDT" ? 2 : 5 }).format(
                item.amountFilled
              )
            : formatter({ decimal: item.asset === "USDT" ? 2 : 5 }).format(
                item.amountFilled / item.price
              );
        return (
          <div className="text-gray-600 uppercase ">
            {amount} <span className="text-gray-400 text-xs">{item.asset}</span>{" "}
          </div>
        );
      },
    },

    {
      accessorKey: "amountAvailable",
      header: "Amount Available",
      cell: ({ row }) => {
        const item = row.original;
        const amount =
          item.type !== "buy"
            ? formatter({ decimal: item.asset === "USDT" ? 2 : 5 }).format(
                item.amountAvailable
              )
            : formatter({ decimal: item.asset === "USDT" ? 2 : 5 }).format(
                item.amountAvailable / item.price
              );
        return (
          <div className="text-gray-600 uppercase ">
            {amount} <span className="text-gray-400 text-xs">{item.asset}</span>{" "}
          </div>
        );
      },
    },
    {
      accessorKey: "amount",
      header: "Total Amount ",
      cell: ({ row }) => {
        const item = row.original;
        const amount =
          item.type !== "buy"
            ? formatter({ decimal: 5 }).format(item.amount)
            : formatter({ decimal: 5 }).format(item.amount / item.price);
        return (
          <div className="text-gray-600 uppercase ">
            {amount} <span className="text-gray-400 text-xs">{item.asset}</span>{" "}
          </div>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) => {
        const created = row.original.createdAt;
        return (
          <span className="text-gray-500">
            {created ? dayjs(created).format("DD/MM/YYYY") : "N/A"}
          </span>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
        const reason = (row.original as any)?.reason as string | undefined;
        const hasAdminReason =
          status?.toLowerCase() === "disabled" &&
          Boolean(reason && reason.trim());
        const isUpdating =
          mutation.isPending && mutation.variables?.adId === row.original.id;
        return (
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "font-medium capitalize text-xs",
                status.toLowerCase() === "active"
                  ? "text-green-600"
                  : status.toLowerCase() === "closed"
                  ? "text-red-500"
                  : "text-gray-500"
              )}
            >
              {status}
            </span>

            {status.toLowerCase() !== "closed" &&
              (isUpdating ? (
                <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
              ) : hasAdminReason ? (
                <button
                  type="button"
                  onClick={() => setShowReasonAd(row.original)}
                  className="text-[11px] text-red-600 underline underline-offset-2"
                >
                  View reason
                </button>
              ) : (
                <Switch
                  checked={status === "active"}
                  onCheckedChange={() => {
                    handleStatusToggle(row.original);
                  }}
                  disabled={isUpdating}
                  className="data-[state=checked]:bg-green-600"
                />
              ))}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const ad = row.original;

        return <TableActionMenu adDetail={ad} onCloseAd={handleCloseAd} />;
      },
    },
  ];

  return (
    <div className="w-full space-y-8">
      <div className="flex flex-col p-4 rounded-xl bg-neutral-100 md:flex-row md:items-center justify-between gap-2">
        <Header
          text="My Ads"
          subtext="Create, view and manage your ads on Bisats here"
        />

        <KycManager
          action={ACTIONS.CREATE_AD}
          func={() => navigate(APP_ROUTES.P2P.CREATE_AD)}
        >
          {(validateAndExecute) => (
            <Button
              className={cn()}
              onClick={() => {
                validateAndExecute();
              }}
              disabled={!userState?.user?.accountLevel}
            >
              {userState?.user?.hasAppliedToBeInLevelOne &&
              !userState.user.accountLevel
                ? "Pending Verification"
                : "Create Ad"}
            </Button>
          )}
        </KycManager>
      </div>

      <div>
        {!isKycVerified ? (
          <KycBanner />
        ) : userState?.user?.hasAppliedToBeInLevelOne &&
          !userState.user.accountLevel ? (
          <div className="flex flex-col items-center gap-2  border w-fit p-6 mx-auto rounded-md">
            <h4 className="font-semibold text-lg">
              Your Acoount is being reviewed
            </h4>
            <p className="text-gray-500 text-sm">
              Please wait for admin approval
            </p>
          </div>
        ) : isLoading ? (
          <PreLoader />
        ) : isError ? (
          <ErrorDisplay
            message={error.message}
            isError={false}
            showIcon={false}
          />
        ) : (
          <div className="space-y-16">
            <div className="space-y-3">
              <p className="text-lg font-semibold mb-3 text-green-600 border border-green-500 rounded-lg px-3 py-2 bg-green-500/10">
                Active Ads
              </p>

              <DataTable
                columns={column}
                data={adsData.activeAds}
                paginated={false}
              />
            </div>
            <div className="space-y-3">
              <p className="text-lg font-semibold text-red-600 border border-red-500 rounded-lg px-3 py-2 bg-red-500/10">
                Closed Ads
              </p>

              <DataTable columns={column} data={adsData.closedAds} />
            </div>
          </div>
        )}
      </div>

      {/* SUB: Disabled reason modal */}
      <ModalTemplate
        isOpen={Boolean(showReasonAd)}
        onClose={() => setShowReasonAd(null)}
        // primary={false}
      >
        {showReasonAd && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-800">Ad Disabled</h3>
            <div className="text-sm text-gray-600 grid grid-cols-2 gap-2">
              <p>
                <span className="text-gray-400">Type:</span> {showReasonAd.type}
              </p>
              <p>
                <span className="text-gray-400">Asset:</span>{" "}
                {showReasonAd.asset}
              </p>
              <p>
                <span className="text-gray-400">Price:</span> xNGN{" "}
                {formatter({ decimal: 0 }).format(showReasonAd.price)}
              </p>
              <p>
                <span className="text-gray-400">Created:</span>{" "}
                {showReasonAd.createdAt
                  ? dayjs(showReasonAd.createdAt).format("DD/MM/YYYY")
                  : "N/A"}
              </p>
            </div>

            <div className="rounded-md border bg-neutral-50 p-3">
              <p className="text-xs text-gray-500 mb-1">Reason</p>
              <p className="text-sm text-gray-800 whitespace-pre-wrap">
                {(showReasonAd as any)?.reason || "No reason provided"}
              </p>
            </div>
            <p className="text-[11px] text-gray-500">
              If you believe this action was a mistake, please contact support
              to rectify.
            </p>
            <div className="flex justify-end">
              <Button onClick={() => setShowReasonAd(null)}>Close</Button>
            </div>
          </div>
        )}
      </ModalTemplate>
    </div>
  );
};

export default MyAds;
