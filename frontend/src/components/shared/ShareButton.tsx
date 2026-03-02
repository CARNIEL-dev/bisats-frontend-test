import { useCallback, memo } from "react";
import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Toast from "@/components/Toast";

interface ShareButtonProps {
  referralLink: string;
  className?: string;
  title?: string;
  children?: React.ReactNode;
}

const ShareButton = memo(function ShareButton({
  referralLink,
  className = "",
  title = "Share Link",
  children,
}: ShareButtonProps) {
  const handleShare = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();

      if (navigator.share) {
        try {
          await navigator.share({
            title: "Join me on BISATS!",
            text: "Register using my referral link to get amazing benefits on our P2P platform.",
            url: referralLink,
          });
          Toast.success("Shared successfully", "Referral");
        } catch (error) {
          // User cancelled or error occurred
          console.log("Error sharing", error);
        }
      } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(referralLink);
        Toast.success("Link copied to clipboard to share!", "Referral");
      }
    },
    [referralLink],
  );

  return (
    <Button
      variant="ghost"
      size="sm"
      className={className}
      onClick={handleShare}
      title={title}
    >
      {children || <Share2 className="w-4 h-4" />}
    </Button>
  );
});

export default ShareButton;
