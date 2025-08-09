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
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import Label from "@/components/Inputs/Label";
import { Badge } from "../ui/badge";

type IAProps = {
  value: string;
  label?: string;
  error: string | undefined | null;
  touched: boolean | undefined;
  handleChange: (prop: string) => void;
  removexNGN?: boolean;
  showBalance?: boolean;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  defaultValue?: string;
};

const TokenSelection = ({
  label,
  removexNGN,
  value,
  error,
  handleChange,
  showBalance = true,
  disabled,
  placeholder,
  className,
  defaultValue,
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

  useEffect(() => {
    if (showBalance) {
      if (value) {
        const defaultSelected = tokenOptions.find(
          (option) => option.tokenName === value
        );
        if (defaultSelected) {
          setSelected(defaultSelected.id);
        }
      }
    }
  }, [value, showBalance]);

  return (
    <div>
      {label && (
        <div className="mb-2">
          <Label text={label} className="" />
        </div>
      )}

      <div>
        <Select
          onValueChange={(val) => {
            handleChange(val);
            setSelected(val);
          }}
          // defaultValue={defaultValue}
          value={value}
          disabled={disabled}
        >
          <SelectTrigger
            className={cn("w-full", error && "border-red-500", className)}
          >
            <SelectValue placeholder={placeholder || "Select option"} />
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
        <Badge variant={"success"} className="!text-sm font-normal mt-4">
          Balance:{" "}
          <span className="font-semibold ]">
            {calculateCurrentWalletBallance ?? 0}
          </span>
        </Badge>
      )}

      {error && <p className="text-red-500 text-xs mt-2.5">{error}</p>}
    </div>
  );
};

export default TokenSelection;
