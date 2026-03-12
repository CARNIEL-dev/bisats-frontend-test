/**
 * SwapDetail
 *
 * Detail view for a single swap by reference.
 * Polls every 2s (max 10 attempts) when the swap is still pending.
 */

import Toast from "@/components/Toast";
import { Badge } from "@/components/ui/badge";
import { formatter } from "@/utils";
import { BACKEND_URLS } from "@/utils/backendUrls";
import Bisatsfetch from "@/redux/fetchWrapper";
import dayjs from "dayjs";
import { Loader2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

type Props = {
  reference: string;
  onClose: () => void;
};

const SwapDetail = ({ reference, onClose }: Props) => {
  const [detail, setDetail] = useState<SwapHistoryTransaction[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [polling, setPolling] = useState(false);
  const pollCountRef = useRef(0);
  const pollRef = useRef<NodeJS.Timeout | null>(null);

  const fetchDetail = useCallback(async () => {
    try {
      const response = await Bisatsfetch(
        `${BACKEND_URLS.SWAP.GET_BY_REFERENCE}/${reference}`,
        { method: "GET" },
      );
      if (response.status === true && response.data) {
        setDetail(response.data);

        // If still pending → poll every 2s, max 10 retries
        if (
          response.data.length === 1 &&
          response.data[0].status === "pending"
        ) {
          pollCountRef.current += 1;
          if (pollCountRef.current < 10) {
            setPolling(true);
            pollRef.current = setTimeout(fetchDetail, 2000);
          } else {
            setPolling(false);
          }
        } else {
          setPolling(false);
        }
      }
    } catch {
      Toast.error("Failed to fetch swap details", "Error");
    } finally {
      setLoading(false);
    }
  }, [reference]);

  useEffect(() => {
    fetchDetail();
    return () => {
      if (pollRef.current) clearTimeout(pollRef.current);
    };
  }, [fetchDetail]);

  const debit = detail?.find((t) => t.type === "swap_debit");
  const credit = detail?.find((t) => t.type === "swap_credit");

  const formatAmount = (amount: number, asset: string) =>
    formatter({
      decimal: asset === "xNGN" || asset === "USDT" ? 2 : 8,
    }).format(amount);

  return (
    <div className="absolute inset-0 bg-background z-10 flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="font-semibold text-lg">Swap Detail</h3>
        <button
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground text-sm font-medium"
        >
          Close
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="p-4 space-y-4 overflow-auto">
          {/* Reference */}
          <div className="border rounded-lg p-4 space-y-1">
            <p className="text-xs text-muted-foreground">Reference</p>
            <p className="font-mono text-sm font-semibold">{reference}</p>
          </div>

          {/* Debit (sold) */}
          {debit && (
            <div className="border rounded-lg p-4 space-y-2">
              <p className="text-xs text-muted-foreground">Sold</p>
              <p className="font-semibold text-sm">
                {formatAmount(debit.amount, debit.asset)} {debit.asset}
              </p>
              <Badge
                variant={
                  debit.status === "success"
                    ? "success"
                    : debit.status === "failed"
                      ? "destructive"
                      : "secondary"
                }
              >
                {debit.status}
              </Badge>
            </div>
          )}

          {/* Credit (received) */}
          {credit && (
            <div className="border rounded-lg p-4 space-y-2">
              <p className="text-xs text-muted-foreground">Received</p>
              <p className="font-semibold text-sm">
                {formatAmount(credit.amount, credit.asset)} {credit.asset}
              </p>
              <Badge variant="success">{credit.status}</Badge>
            </div>
          )}

          {/* Polling indicator */}
          {polling && (
            <div className="flex items-center gap-2 text-sm text-amber-600">
              <Loader2 className="animate-spin size-4" />
              <span>Swap is still processing…</span>
            </div>
          )}

          {/* Metadata */}
          {debit && (
            <div className="text-xs text-muted-foreground space-y-1">
              {debit.partnerReference && (
                <p>Partner Ref: {debit.partnerReference}</p>
              )}
              <p>
                Created:{" "}
                {dayjs(debit.createdAt).format("MMM D, YYYY - h:mm:ss A")}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SwapDetail;
