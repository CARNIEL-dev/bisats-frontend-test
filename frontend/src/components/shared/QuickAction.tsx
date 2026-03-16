import { tokenLogos } from "@/assets/tokens";
import { Button } from "@/components/ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { APP_ROUTES } from "@/constants/app_route";
import {
  setWalletCurrency,
  toggleShowBalance,
  useCryptoRates,
} from "@/redux/actions/walletActions";
import { formatter, getCurrencyBalance } from "@/utils";
import {
  ChevronDown,
  Eye,
  EyeOff,
  Gift,
  LayoutList,
  Megaphone,
  Wallet,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import useClickOutside from "@/hooks/use-clickOutside";

const quickActions = [
  {
    id: "wallet",
    label: "Your Wallet",
    icon: Wallet,
    action: "sheet" as const,
  },
  {
    id: "create-ad",
    label: "Create Ad",
    icon: Megaphone,
    action: "navigate" as const,
    path: APP_ROUTES.P2P.CREATE_AD,
  },
  {
    id: "my-ads",
    label: "My Ads",
    icon: LayoutList,
    action: "navigate" as const,
    path: APP_ROUTES.P2P.MY_ADS,
  },
  {
    id: "referral",
    label: "Referral",
    icon: Gift,
    action: "scroll-navigate" as const,
    path: APP_ROUTES.PROFILE,
    scrollTo: "referral-section",
  },
];

const QuickAction = () => {
  const {
    ref,
    visible: isOpen,
    setVisible: setIsOpen,
  } = useClickOutside(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const navigate = useNavigate();

  const { wallet, showBalance, defaultCurrency } = useSelector(
    (state: { wallet: WalletState }) => state.wallet,
  );

  const { data: currencyRate, isFetching } = useCryptoRates({
    isEnabled: Boolean(wallet),
  });

  const assetsData = useMemo(
    () => [
      {
        asset: "BTC",
        name: "Bitcoin",
        Balance: wallet?.BTC ?? 0,
        USDRate: currencyRate?.bitcoin?.usd ?? 0,
        NairaRate: currencyRate?.bitcoin?.ngn ?? 0,
      },
      {
        asset: "ETH",
        name: "Ethereum",
        Balance: wallet?.ETH ?? 0,
        USDRate: currencyRate?.ethereum?.usd ?? 0,
        NairaRate: currencyRate?.ethereum?.ngn ?? 0,
      },
      {
        asset: "SOL",
        name: "Solana",
        Balance: wallet?.SOL ?? 0,
        USDRate: currencyRate?.solana?.usd ?? 0,
        NairaRate: currencyRate?.solana?.ngn ?? 0,
      },
      {
        asset: "USDT",
        name: "Tether USD",
        Balance: wallet?.USDT ?? 0,
        USDRate: currencyRate?.tether?.usd ?? 0,
        NairaRate: currencyRate?.tether?.ngn ?? 0,
      },
      {
        asset: "xNGN",
        name: "Naira on Bisats",
        Balance: wallet?.xNGN ?? 0,
        USDRate: currencyRate?.tether?.usd ?? 0,
        NairaRate: currencyRate?.tether?.ngn ?? 0,
      },
    ],
    [currencyRate, wallet],
  );

  const totals = useMemo<UserBalanceType | undefined>(() => {
    if (!wallet || !currencyRate) return;
    return assetsData.reduce(
      (totals, item) => {
        const isXNGN = item.asset === "xNGN";
        const val = getCurrencyBalance({
          item,
          isXNGN,
          defaultCurrency: defaultCurrency || "usd",
        });
        return {
          balanceTotal: totals.balanceTotal + val,
          lockedBalanceTotal: 0,
        };
      },
      { balanceTotal: 0, lockedBalanceTotal: 0 },
    );
  }, [assetsData, wallet, currencyRate, defaultCurrency]);

  const symbol = defaultCurrency === "ngn" ? "₦" : "$";

  const handleActionClick = useCallback(
    (action: (typeof quickActions)[number]) => {
      if (!isOpen) return;
      setIsOpen(false);
      if (action.action === "sheet") {
        setSheetOpen(true);
      } else if (action.action === "scroll-navigate" && action.path) {
        navigate(action.path);
        // Wait for navigation, then scroll to the target element
        setTimeout(() => {
          const scrollTo =
            "scrollTo" in action ? (action.scrollTo as string) : null;
          const el = scrollTo ? document.getElementById(scrollTo) : null;
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }, 300);
      } else if (action.path) {
        navigate(action.path);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [navigate, isOpen],
  );

  return (
    <>
      {/* Quick Action Trigger + Menu */}
      <div ref={ref} className="fixed right-0 top-[20%] z-50">
        {/* Action items that fan out below */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="absolute right-[-20dvw] top-full mt-3 flex flex-col items-end gap-2 pr-1"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={{
                hidden: { pointerEvents: "none" as const },
                visible: {
                  right: 0,
                  pointerEvents: "auto" as const,
                  transition: { staggerChildren: 0.08, delayChildren: 0.05 },
                },
              }}
            >
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <motion.button
                    key={action.id}
                    onClick={() => handleActionClick(action)}
                    className="flex items-center gap-2.5 bg-background border border-border shadow-lg rounded-full pl-4 pr-3 py-2 cursor-pointer hover:bg-primary hover:text-primary-foreground dark:hover:text-black transition-colors group whitespace-nowrap"
                    variants={{
                      hidden: {
                        opacity: 0,
                        x: 60,
                        y: 10,
                        scale: 0.3,
                        filter: "blur(4px)",
                      },
                      visible: {
                        opacity: 1,
                        x: 0,
                        y: 0,
                        scale: 1,
                        filter: "blur(0px)",
                        transition: {
                          type: "spring",
                          stiffness: 400,
                          damping: 22,
                          mass: 0.8,
                        },
                      },
                    }}
                    exit={{
                      opacity: 0,
                      x: 40,
                      scale: 0.5,
                      filter: "blur(4px)",
                      transition: {
                        duration: 0.2,
                        delay: (quickActions.length - 1 - index) * 0.05,
                      },
                    }}
                    whileHover={{ scale: 1.05, x: -4 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="text-sm font-medium">{action.label}</span>
                    <Icon className="size-[18px]" />
                  </motion.button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main trigger button */}
        <motion.button
          className="bg-primary flex items-center px-3 py-2.5 rounded-s-full gap-2 cursor-pointer dark:text-black"
          onClick={() => setIsOpen(!isOpen)}
          onMouseEnter={() => setIsOpen(true)}
          whileHover={{ paddingLeft: 16, paddingRight: 14 }}
          whileTap={{ scale: 0.95 }}
        >
          <Zap
            className="size-5 transition-transform duration-300"
            style={{ transform: isOpen ? "rotate(15deg)" : "rotate(0deg)" }}
          />
          <AnimatePresence>
            {isOpen && (
              <motion.span
                className="text-xs font-semibold overflow-hidden whitespace-nowrap"
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "auto", opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
              >
                Quick Actions
              </motion.span>
            )}
          </AnimatePresence>
          <span className="sr-only">Quick Actions</span>
        </motion.button>
      </div>

      {/* Wallet Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="w-screen sm:max-w-none sm:w-[460px] md:w-[540px] lg:w-[600px]">
          <SheetHeader className="gap-0.5">
            <SheetTitle className="text-2xl">Your Wallet</SheetTitle>
            <SheetDescription>Quick access to your wallet</SheetDescription>
          </SheetHeader>

          <div className=" flex flex-col gap-2 mx-4 md:mx-8">
            <div className="flex items-center gap-2">
              <h4 className="text-lg md:text-xl font-semibold">Your Balance</h4>
              <Button
                variant="default"
                className="size-10 rounded-full bg-primary/50"
                onClick={toggleShowBalance}
              >
                {showBalance ? (
                  <Eye className="!size-5" />
                ) : (
                  <EyeOff className="!size-5" />
                )}
              </Button>
            </div>

            <div className="flex items-baseline gap-2 ">
              <span className="text-[28px] font-extrabold">{symbol}</span>
              {showBalance ? (
                <p className="font-extrabold">
                  <span className="text-3xl">
                    {
                      formatter({})
                        .format(totals?.balanceTotal ?? 0)
                        .split(".")[0]
                    }
                  </span>
                  <span className="text-lg">
                    .
                    {
                      formatter({})
                        .format(totals?.balanceTotal ?? 0)
                        .split(".")[1]
                    }
                  </span>
                </p>
              ) : (
                <p className="font-semibold text-2xl">***</p>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger className="outline-none text-sm bg-neutral-100  dark:bg-secondary py-1 px-1.5 rounded-md border border-border uppercase">
                  <div className="flex items-center gap-0.5">
                    {defaultCurrency || "USD"}
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Currency</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuRadioGroup
                    value={defaultCurrency || "usd"}
                    onValueChange={(val) =>
                      setWalletCurrency(val as "usd" | "ngn")
                    }
                  >
                    <DropdownMenuRadioItem value="usd">
                      USD
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="ngn">
                      NGN
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className=" mt-8 rounded-lg border bg-neutral-50 dark:bg-secondary border-border">
              {assetsData.map((item) => {
                const isXNGN = item.asset === "xNGN";
                const approx = getCurrencyBalance({
                  defaultCurrency: defaultCurrency || "usd",
                  item,
                  isXNGN,
                });
                const isUSDT = item.asset === "USDT";
                return (
                  <div
                    key={item.asset}
                    className="flex items-center justify-between p-3 border-b border-border last:border-none"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={tokenLogos[item.asset as keyof typeof tokenLogos]}
                        alt={item.name}
                        className="size-7"
                      />
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-foreground">
                          {item.name}
                        </span>
                        <span className="text-[11px] text-muted-foreground">
                          {item.asset}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-foreground">
                        {showBalance
                          ? `${formatter({
                              decimal: isXNGN || isUSDT ? 2 : 6,
                            }).format(Number(item.Balance) || 0)} ${item.asset}`
                          : "***"}
                      </p>
                      {showBalance && (
                        <p className="text-xs text-muted-foreground">
                          ~
                          {formatter({
                            decimal: 0,
                            style: "currency",
                            currency: defaultCurrency === "usd" ? "USD" : "NGN",
                          }).format(approx)}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
              {isFetching && (
                <div className="p-3 text-xs text-muted-foreground animate-pulse text-center">
                  Updating rates…
                </div>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default QuickAction;
