import TableActionMenu from "@/components/Modals/TableActionMenu";
import Switch from "@/components/Switch";
import Toast from "@/components/Toast";
import { DataTable } from "@/components/ui/data-table";
import Header from "@/pages/p2p/components/Header";
import Bisatsfetch from "@/redux/fetchWrapper";
import { cn, formatter } from "@/utils";
import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { buttonVariants } from "@/components/ui/Button";
import { APP_ROUTES } from "@/constants/app_route";
import { Link } from "react-router-dom";

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

interface RootState {
  user: {
    user: {
      userId: string;
    } | null;
  };
}

const MyAds = () => {
  const [userAds, setUserAds] = useState<Ad[]>([]);
  const user = useSelector((state: RootState) => state.user.user);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingAdId, setUpdatingAdId] = useState<string | null>(null);

  useEffect(() => {
    if (user?.userId) {
      fetchUserAds();
    }
  }, [user?.userId]);

  const fetchUserAds = async () => {
    setLoading(true);
    setError(null);

    try {
      const endpoint = `/api/v1/user/${user?.userId}/ads/get-user-ads`;

      const response = await Bisatsfetch(endpoint, {
        method: "GET",
      });

      if (response.status) {
        setUserAds(response.data || []);
      } else {
        setUserAds([]);
        if (response.message) {
          setError(response.message);
        }
      }
    } catch (err) {
      console.error("Error fetching user ads:", err);
      setError("Failed to fetch ads. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  //   HDR: Update ads status
  const updateAdStatus = useCallback(
    async (adId: string, newStatus: string) => {
      setUpdatingAdId(adId);

      try {
        const endpoint = `/api/v1/user/${user?.userId}/ads/${adId}/update-ads-status`;

        const response = await Bisatsfetch(endpoint, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        });

        if (response.status) {
          setUserAds((prevAds) =>
            prevAds.map((ad) =>
              ad.id === adId ? { ...ad, status: newStatus } : ad
            )
          );
        } else {
          Toast.error(
            response.message || "Failed to update ad status",
            "Failed"
          );
        }
      } catch (err) {
        console.error("Error updating ad status:", err);
        Toast.error("Failed to update ad status. Please try again.", "Failed");
      } finally {
        setUpdatingAdId(null);
      }
    },
    [user?.userId, setUserAds] // include necessary dependencies
  );

  const handleStatusToggle = (ad: Ad) => {
    const newStatus = ad.status === "active" ? "disabled" : "active";
    updateAdStatus(ad.id, newStatus);
  };

  const handleCloseAd = (adId: string) => {
    updateAdStatus(adId, "closed");
  };

  //   HDR: Columns
  const column: ColumnDef<Ad>[] = [
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
      header: "Price",
      cell: ({ row }) => {
        const price = row.original.price;
        return (
          <span className="text-gray-600 ">
            {formatter({
              decimal: 0,
              currency: "NGN",
              style: "currency",
            }).format(price || 0)}
          </span>
        );
      },
    },
    {
      accessorKey: "quantity",
      header: "Quantity",
      cell: ({ row }) => {
        const quantity = row.original.quantity;
        return <span className="text-gray-500 ">{quantity || "N/A"}</span>;
      },
    },
    {
      accessorKey: "amountFilled",
      header: "Amount Filled",
      cell: ({ row }) => {
        const amountFilled = row.original.amountFilled;
        return (
          <span className="text-gray-500 ">
            {amountFilled
              ? formatter({
                  decimal: 0,
                  currency: "NGN",
                  style: "currency",
                }).format(amountFilled)
              : "N/A"}
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
              (updatingAdId === row.original.id ? (
                <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
              ) : (
                <Switch
                  checked={status === "active"}
                  onCheckedChange={() => {
                    handleStatusToggle(row.original);
                  }}
                  disabled={updatingAdId === row.original.id}
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

        <Link to={APP_ROUTES.P2P.CREATE_AD} className={cn(buttonVariants())}>
          Create Ad
        </Link>
      </div>

      <div>
        <p className="text-lg font-semibold mb-3 text-gray-600">All Ads</p>
        <div className="hidden md:block">
          <DataTable columns={column} data={userAds} />
        </div>
      </div>
    </div>
  );
};

export default MyAds;
