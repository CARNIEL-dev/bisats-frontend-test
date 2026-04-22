import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatNumber } from "@/utils/numberFormat";
import { toPng } from "html-to-image";
import { Share2 } from "lucide-react";
import QRCode from "react-qr-code";
import React, { useEffect, useRef, useState } from "react";

// HDR: AdShare
// Self-contained component: pre-generates a shareable PNG card from ad details,
// exposes a Share button that uses the Web Share API (with download fallback).
const AdShare = ({ adDetail }: { adDetail: AdsType | undefined }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isShareReady, setIsShareReady] = useState(false);
  const shareCardRef = useRef<HTMLDivElement>(null);
  const shareBlobRef = useRef<Blob | null>(null);

  // Pre-generate blob on mount so the click handler stays synchronous.
  // The Web Share API requires a direct user gesture — any async gap before
  // navigator.share() is called causes a NotAllowedError.
  useEffect(() => {
    if (!adDetail?.id) return;
    let cancelled = false;

    const generate = async () => {
      await new Promise((r) => requestAnimationFrame(r)); // wait for render
      if (cancelled || !shareCardRef.current) return;
      setIsGenerating(true);
      try {
        const dataUrl = await toPng(shareCardRef.current, { cacheBust: true });
        if (cancelled) return;
        const blob = await fetch(dataUrl).then((r) => r.blob());
        if (!cancelled) {
          shareBlobRef.current = blob;
          setIsShareReady(true);
        }
      } finally {
        if (!cancelled) setIsGenerating(false);
      }
    };

    generate();
    return () => {
      cancelled = true;
    };
  }, [adDetail?.id]);

  const triggerDownload = (blob: Blob) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = `bisats-ad-${adDetail?.id}.png`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleShare = () => {
    const blob = shareBlobRef.current;
    if (!blob) return;

    const file = new File([blob], `bisats-ad-${adDetail?.id}.png`, {
      type: "image/png",
    });

    if (navigator.share && navigator.canShare?.({ files: [file] })) {
      navigator
        .share({ files: [file], title: "P2P Ad on BISATS" })
        .catch(() => triggerDownload(blob));
    } else {
      triggerDownload(blob);
    }
  };

  if (!adDetail?.id) return null;

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={handleShare}
            disabled={isGenerating || !isShareReady}
            className="flex items-center justify-center border border-border rounded-md p-2.5 text-muted-foreground hover:bg-secondary transition-colors disabled:opacity-50 cursor-pointer"
          >
            <Share2 size={16} />
          </button>
        </TooltipTrigger>
        <TooltipContent>Share this Ad</TooltipContent>
      </Tooltip>

      {/* Hidden card rendered off-screen; captured by html-to-image */}
      <div style={{ position: "absolute", left: "-9999px", top: 0 }}>
        <AdShareCard ref={shareCardRef} adDetail={adDetail} />
      </div>
    </>
  );
};

export default AdShare;

// HDR: AdShareCard
const AdShareCard = React.forwardRef<HTMLDivElement, { adDetail: AdsType }>(
  ({ adDetail }, ref) => {
    const initial = (adDetail.user?.userName?.[0] ?? "?").toUpperCase();
    const isOrderBuy = adDetail.orderType === "buy";
    const pageUrl = window.location.href;

    return (
      <div
        ref={ref}
        style={{
          width: 390,
          background: "#ffffff",
          fontFamily: "Geist, sans-serif",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingBottom: 0,
          overflow: "hidden",
        }}
      >
        {/* Avatar */}
        <div
          style={{
            marginTop: 48,
            width: 96,
            height: 96,
            borderRadius: "50%",
            background: "#F5A623",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 42,
            fontWeight: 700,
            color: "#fff",
          }}
        >
          {initial}
        </div>

        {/* Username */}
        <p
          style={{
            marginTop: 16,
            fontSize: 28,
            fontWeight: 700,
            color: "#111",
            letterSpacing: 1,
            textTransform: "uppercase",
          }}
        >
          {adDetail.user?.userName ?? "—"}
        </p>

        {/* QR Code */}
        <div
          style={{
            marginTop: 28,
            background: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: 16,
            padding: 20,
          }}
        >
          <QRCode value={pageUrl} size={200} level="M" />
        </div>

        <p style={{ marginTop: 12, color: "#9ca3af", fontSize: 12 }}>
          Scan to view on Bisats
        </p>

        {/* Details card */}
        <div
          style={{
            marginTop: 24,
            width: 320,
            background: "#f9fafb",
            border: "1px solid #e5e7eb",
            borderRadius: 16,
            padding: "20px 24px",
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: "#9ca3af", fontSize: 14 }}>Price</span>
            <span style={{ fontWeight: 700, fontSize: 14, color: "#111" }}>
              {formatNumber(Number(adDetail.price))} NGN/{adDetail.asset}
            </span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: "#9ca3af", fontSize: 14 }}>Type</span>
            <span style={{ fontSize: 14, fontWeight: 600 }}>
              <span style={{ color: isOrderBuy ? "#16a34a" : "#dc2626" }}>
                {isOrderBuy ? "Buy" : "Sell"}
              </span>{" "}
              <span style={{ color: "#111" }}>{adDetail.asset}</span>
            </span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: "#9ca3af", fontSize: 14 }}>Limits</span>
            <span style={{ fontWeight: 700, fontSize: 14, color: "#111" }}>
              {formatNumber(Number(adDetail.minimumLimit))}–
              {formatNumber(Number(adDetail.maximumLimit))} NGN
            </span>
          </div>

          <div style={{ borderTop: "1px solid #e5e7eb", margin: "4px 0" }} />

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 4,
                height: 16,
                borderRadius: 2,
                background: "#F5A623",
              }}
            />
            <span style={{ fontSize: 14, color: "#374151" }}>P2P</span>
          </div>
        </div>

        {/* Branding footer */}
        <div
          style={{
            marginTop: 28,
            width: "100%",
            background: "#F5A623",
            borderRadius: "60% 60% 0 0 / 30px 30px 0 0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px 0 32px",
          }}
        >
          <span
            style={{
              fontSize: 28,
              fontWeight: 900,
              color: "#fff",
              letterSpacing: 4,
            }}
          >
            BISATS
          </span>
        </div>
      </div>
    );
  },
);
AdShareCard.displayName = "AdShareCard";
