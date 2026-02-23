import Label from "@/components/Inputs/Label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/Button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TokenData } from "@/data";
import { cn, formatter } from "@/utils";
import { ChevronsUpDown } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";

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
  removeToken?: string;
  // New variant prop
  variant?: "primary" | "dialog";
  // New dialog props
  dialogTitle?: string;
  dialogSearchPlaceholder?: string;
  dialogEmptyMessage?: string;
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
  removeToken,
  // New props
  variant = "primary",
  dialogTitle = "Select Asset",
  dialogSearchPlaceholder = "Search asset",
  dialogEmptyMessage = "No asset found.",
}: IAProps) => {
  const [selected, setSelected] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const walletState: WalletState = useSelector((state: any) => state.wallet);
  const walletData = walletState.wallet;

  // Calculate total Balance
  const calculateCurrentWalletBallance = useMemo(() => {
    if (!showBalance) return undefined;
    return walletData
      ? `${formatter({
          decimal: selected === "xNGN" || selected === "USDT" ? 2 : 7,
        }).format(walletData[selected ?? "xNGN"])} ${selected}`
      : 0;
  }, [selected, walletData, showBalance]);

  const tokenOptions = useMemo(() => {
    let options = TokenData.map((token) => {
      return {
        ...token,
        currentBalance: walletData ? walletData[token.id] : undefined,
      };
    });

    if (removexNGN) {
      options = options.slice(1);
    }
    if (removeToken) {
      options = options.filter((token) => token.tokenName !== removeToken);
    }
    return options;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [removexNGN, removeToken]);

  const selectedToken = useMemo(() => {
    return tokenOptions.find((token) => token.id === value);
  }, [value, tokenOptions]);

  useEffect(() => {
    if (showBalance) {
      if (value) {
        const defaultSelected = tokenOptions.find(
          (option) => option.tokenName === value,
        );
        if (defaultSelected) {
          setSelected(defaultSelected.id);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, showBalance]);

  // Handle token selection from dialog
  const handleTokenSelect = (tokenId: string) => {
    handleChange(tokenId);
    setSelected(tokenId);
    setOpen(false);
  };

  //HDR: Render primary variant
  if (variant === "primary") {
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
  }

  //HDR: Render dialog variant
  return (
    <div>
      {label && (
        <div className="mb-2">
          <Label text={label} className="" />
        </div>
      )}

      <div className="space-y-2">
        {/* Dialog Trigger Button */}
        <Button
          type="button"
          variant="outline"
          className={cn(
            "w-full justify-between py-6 text-sm",
            error && "border-red-500",
            !value && "text-muted-foreground",
            className,
          )}
          onClick={() => setOpen(true)}
          disabled={disabled}
        >
          {selectedToken ? (
            <div className="flex items-center gap-2">
              {selectedToken.tokenLogo}
              {selectedToken.tokenName}
            </div>
          ) : (
            <span className="font-normal text-gray-400">{placeholder}</span>
          )}
          <ChevronsUpDown className="size-4 opacity-50" />
        </Button>

        {/* Command Dialog */}
        <CommandDialog open={open} onOpenChange={setOpen} className="px-2 py-6">
          <p className="mt-4 mb-2 text-sm text-gray-600 font-semibold ml-3">
            {dialogTitle}
          </p>
          <CommandInput placeholder={dialogSearchPlaceholder} className="" />
          <CommandList className="mt-2">
            <CommandEmpty>{dialogEmptyMessage}</CommandEmpty>
            <CommandGroup>
              {tokenOptions.map((token) => (
                <CommandItem
                  key={token.id}
                  value={token.tokenName}
                  onSelect={() => handleTokenSelect(token.id)}
                  className="flex items-center gap-2 font-medium text-gray-600"
                  tabIndex={0}
                >
                  {token.tokenLogo}
                  {token.tokenName}
                  <span className="ml-auto  text-sm ">
                    {token.currentBalance !== undefined
                      ? `${formatter({
                          decimal:
                            token.tokenName === "xNGN" ||
                            token.tokenName === "USDT"
                              ? 2
                              : 7,
                        }).format(Number(token.currentBalance))}`
                      : ""}{" "}
                    {token.tokenName}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </CommandDialog>

        {showBalance && selected && (
          <Badge variant={"success"} className="!text-sm font-normal">
            Balance:{" "}
            <span className="font-semibold">
              {calculateCurrentWalletBallance ?? 0}
            </span>
          </Badge>
        )}

        {error && <p className="text-red-500 text-xs mt-2.5">{error}</p>}
      </div>
    </div>
  );
};

export default TokenSelection;
