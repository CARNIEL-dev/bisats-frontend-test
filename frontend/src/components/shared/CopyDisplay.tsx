import Divider from "@/components/shared/Divider";
import { cn } from "@/utils";
import QRCode from "react-qr-code";
import CopyButton from "@/components/shared/CopyButton";

const CopyDisplay = ({
  title,
  text,
  placeholder,
}: {
  title: string;
  text?: string;
  placeholder: string;
}) => {
  return (
    <>
      <div className="lg:h-[84px]  border border-dashed  border-primary/50 bg-secondary rounded-[12px]  lg:py-3 p-2 lg:px-5 mt-3 space-y-2">
        <p className="text-muted-foreground text-sm font-semibold">{title}</p>
        <div className="flex gap-1 flex-wrap lg:flex-nowrap text-wrap items-center justify-between">
          <p
            className={cn(
              "text-[10px] sm:text-xs lg:text-sm  font-normal break-all",
            )}
          >
            {text || placeholder}
          </p>

          {text && <CopyButton text={text} type="code" title="Copy address" />}
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
