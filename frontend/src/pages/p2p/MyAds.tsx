import TableActionMenu from "@/components/Modals/TableActionMenu";
import Switch from "@/components/Switch";
import Toast from "@/components/Toast";
import { DataTable } from "@/components/ui/data-table";
import Header from "@/pages/p2p/components/Header";
import { cn, formatter } from "@/utils";
import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { useSelector } from "react-redux";

import ErrorDisplay from "@/components/shared/ErrorDisplay";
import { buttonVariants } from "@/components/ui/Button";
import { APP_ROUTES } from "@/constants/app_route";
import PreLoader from "@/layouts/PreLoader";
import { updateAdStatus, useFetchUserAds } from "@/redux/actions/walletActions";
import { ACTIONS } from "@/utils/transaction_limits";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import KycManager from "@/pages/kyc/KYCManager";
import { UserState } from "@/redux/reducers/userSlice";
import KycBanner from "@/components/KycBanner";
import {
  collapseTextChangeRangesAcrossMultipleVersions,
  isConstructorDeclaration,
} from "typescript";

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
    userState?.kyc?.identificationVerified,
    userState?.kyc?.personalInformationVerified,
    userState.user?.phoneNumberVerified,
  ].some(Boolean);

  const {
    data: userAds = [],
    isError,
    error,
    isFetching,
  } = useFetchUserAds({ userId, isKycVerified });

  console.log("Isfetching", isFetching);
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
    {
      accessorKey: "minimumLimit",
      header: "Minimum Price (xNGN)",
      cell: ({ row }) => {
        const price = row.original.minimumLimit;
        return (
          <span className="text-gray-600 ">
            {formatter({
              decimal: 0,
            }).format(price || 0)}
          </span>
        );
      },
    },
    {
      accessorKey: "maximumLimit",
      header: "Maximum Price (xNGN)",
      cell: ({ row }) => {
        const price = row.original.maximumLimit;
        return (
          <span className="text-gray-600 ">
            {formatter({
              decimal: 0,
            }).format(price || 0)}
          </span>
        );
      },
    },

    {
      accessorKey: "amountFilled",
      header: "Amount Filled",
      cell: ({ row }) => {
        const amount = row.original.amountAvailable;
        return (
          <span className="text-gray-500 space-x-1">
            {amount
              ? formatter({
                  decimal: 2,
                }).format(amount)
              : "N/A"}{" "}
            {row.original.asset}
          </span>
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
            <Link
              to={APP_ROUTES.P2P.CREATE_AD}
              className={cn(buttonVariants())}
              onClick={(e) => {
                e.preventDefault();
                validateAndExecute();
              }}
            >
              Create Ad
            </Link>
          )}
        </KycManager>
      </div>

      <div>
        {!isKycVerified ? (
          <KycBanner />
        ) : isFetching ? (
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

              <DataTable columns={column} data={adsData.activeAds} />
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
    </div>
  );
};

export default MyAds;
