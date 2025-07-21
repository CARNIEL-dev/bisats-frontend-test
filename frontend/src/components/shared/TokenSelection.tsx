import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TokenData } from "@/data";
import { WalletState } from "@/redux/reducers/walletSlice";
import { cn } from "@/utils";
import { formatNumber } from "@/utils/numberFormat";
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import Label from "../Inputs/Label";

type IAProps = {
  title: string;
  label?: string;
  error: string | undefined | null;
  touched: boolean | undefined;
  handleChange: (prop: string) => void;
  removexNGN?: boolean;
  showBalance?: boolean;
  disabled?: boolean;
};

const TokenSelection = ({
  label,
  removexNGN,
  title,
  error,
  touched,
  handleChange,
  showBalance = true,
  disabled,
}: IAProps) => {
  const [selected, setSelected] = useState<string | null>(null);
  const walletState: WalletState = useSelector((state: any) => state.wallet);
  const walletData = walletState.wallet;

  //   SUB: Calculate total Balance
  const calculateCurrentWalletBallance = useMemo(() => {
    if (!showBalance) return undefined;
    return walletData
      ? `${formatNumber(walletData[selected ?? "xNGN"])} ${selected}`
      : 0;
  }, [selected, walletData, showBalance]);

  const tokenOptions = useMemo(() => {
    if (removexNGN) return TokenData.slice(1);
    return TokenData;
  }, [removexNGN]);

  return (
    <div>
      {label && (
        <div className="mb-2">
          <Label text={label} css="" />
        </div>
      )}

      <div>
        <Select
          onValueChange={(val) => {
            handleChange(val);
            setSelected(val);
          }}
          defaultValue={title || undefined}
          value={title || undefined}
          disabled={disabled}
        >
          <SelectTrigger
            className={cn("w-full ", error && touched && "border-red-500")}
          >
            <SelectValue placeholder="Select option" />
          </SelectTrigger>
          <SelectContent className="!w-full">
            {tokenOptions.map((token) => (
              <SelectItem key={token.id} value={token.id}>
                <div className="flex items-center gap-2 w-full">
                  {token.tokenLogo}
                  {token.tokenName}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {showBalance && selected && (
        <p className="text-[#606C82] text-[12px] leading-[16px] font-normal mt-2.5">
          Current Balance:{" "}
          <span className="font-semibold text-[#515B6E]">
            {calculateCurrentWalletBallance ?? 0}
          </span>
        </p>
      )}
    </div>
  );
};

export default TokenSelection;
