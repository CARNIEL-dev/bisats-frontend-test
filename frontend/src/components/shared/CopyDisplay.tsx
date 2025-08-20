import Toast from "@/components/Toast";
import { handleCopy } from "@/redux/actions/generalActions";
import { cn } from "@/utils";
import { Check } from "lucide-react";
import { useEffect, useState } from "react";
import Divider from "@/components/shared/Divider";
import QRCode from "react-qr-code";

const CopyDisplay = ({
  title,
  text,
  placeholder,
}: {
  title: string;
  text?: string;
  placeholder: string;
}) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyToClip = async (prop: string) => {
    const result = await handleCopy(prop);
    if (result.status) {
      setIsCopied(true);
    } else {
      Toast.error(result.message, "");
    }
  };

  useEffect(() => {
    if (isCopied) {
      setTimeout(() => {
        setIsCopied(false);
      }, 5000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCopied]);

  return (
    <>
      <div className="lg:h-[84px]  border border-dashed  border-[#F59E0C] bg-[#FFFBEB] rounded-[12px]  lg:py-3 p-2 lg:px-5 mt-3 space-y-2">
        <p className="text-[#2B313B] text-sm font-semibold">{title}</p>
        <div className="flex gap-1 flex-wrap lg:flex-nowrap text-wrap items-center justify-between">
          <p
            className={cn(
              "text-[#515B6E] text-[10px] sm:text-xs lg:text-sm  font-normal break-all"
            )}
          >
            {text || placeholder}
          </p>

          {text &&
            (isCopied ? (
              <Check className="text-green-600" />
            ) : (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="cursor-pointer"
                onClick={() => handleCopyToClip(text ?? "")}
              >
                <path
                  d="M16 12.9V17.1C16 20.6 14.6 22 11.1 22H6.9C3.4 22 2 20.6 2 17.1V12.9C2 9.4 3.4 8 6.9 8H11.1C14.6 8 16 9.4 16 12.9Z"
                  stroke="#515B6E"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M22 6.9V11.1C22 14.6 20.6 16 17.1 16H16V12.9C16 9.4 14.6 8 11.1 8H8V6.9C8 3.4 9.4 2 12.9 2H17.1C20.6 2 22 3.4 22 6.9Z"
                  stroke="#515B6E"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            ))}
        </div>
      </div>
      <Divider text="Or scan Wallet address" />
      <QRCode
        value={text ?? ""} // MUST be a string
        size={180} // px
        level="L" // L, M, Q, H
      />
    </>
  );
};

export default CopyDisplay;
