import { SelectDropDown } from "@/components/Inputs/MultiSelectInput";
import Toast from "@/components/Toast";
import { APP_ROUTES } from "@/constants/app_route";
import { getUserTokenData } from "@/helpers";
import Head from "@/pages/wallet/Head";

import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import CopyButton from "@/components/shared/CopyButton";
import CopyDisplay from "@/components/shared/CopyDisplay";
import SecurityBanner from "@/components/shared/SecurityBanner";
import TextBox from "@/components/shared/TextBox";
import TokenSelection from "@/components/shared/TokenSelection";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/card";
import useUserStatus from "@/hooks/use-user-status";
import { formatAccountLevel, getUpgradeButtonState } from "@/utils";
import { goToNextKycRoute } from "@/utils/kycNavigation";
import { bisats_limit } from "@/utils/transaction_limits";

export type TNetwork = {
  label: string;
  value: string;
};
export type TProxyNetwork = {
  label: string;
  value: string;
  address: string;
};
const DepositPage = () => {
  const location = useLocation();
  const linkedAsset = location.state?.asset;
  const [selectedToken, setSelectedToken] = useState<string>(linkedAsset);
  const [networks, setNetworks] = useState<TNetwork[]>([]);
  const [proxyNetworks, setProxyNetworks] = useState<TProxyNetwork[]>([]);

  const [selectedNetwork, setSelectedNetworks] = useState<string>();

  const navigate = useNavigate();
  const user: UserState = useSelector((state: any) => state.user);
  const { isSuspended } = useUserStatus();

  const { level, isNA } = formatAccountLevel(user?.user?.accountLevel);

  useEffect(() => {
    if (isNA) {
      navigate(APP_ROUTES.KYC.PERSONAL);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isSuspended) {
      Toast.error(
        "Your account is currently suspended. Please contact support for assistance.",
        "Account Suspended",
      );
      navigate(APP_ROUTES.DASHBOARD);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuspended]);

  const accountLevelKey =
    !isNA && level
      ? (`level_${level}` as keyof typeof bisats_limit)
      : "level_1";

  const limit = bisats_limit[accountLevelKey];

  useEffect(() => {
    const tokenList = getUserTokenData();
    for (let token of tokenList) {
      if (token.tokenName === selectedToken) {
        setNetworks(token.networks);
        setProxyNetworks(token.networks);
        return;
      }
    }
  }, [selectedToken]);

  const clickHandler = () => {
    goToNextKycRoute(user);
  };

  const { disabled, label } = useMemo(
    () => getUpgradeButtonState(user.user!, limit),
    [user, limit],
  );

  const getAddress = useMemo(() => {
    for (let network of proxyNetworks) {
      if (selectedNetwork === network.value) {
        return network.address;
      }
    }
  }, [proxyNetworks, selectedNetwork]);

  const userBanks = useMemo(() => {
    const userBanks = user.user?.bankAccounts || [];
    const depositBanks = userBanks.filter(
      (bank: TBank & { bankAccountType: string }) =>
        bank.bankAccountType === "deposit",
    );

    return { depositBanks };
  }, [user.user?.bankAccounts]);

  return (
    <div>
      <Head
        header={"Make a Deposit"}
        subHeader={
          "Securely deposit fiat or crypto to fund your account and start trading."
        }
      />

      <div className="mt-10">
        <TokenSelection
          label="Select Asset"
          error={undefined}
          touched={undefined}
          handleChange={(e) => {
            setSelectedToken(e);
            setSelectedNetworks(undefined);
          }}
          value={selectedToken}
          placeholder="Select an asset"
        />
        {selectedToken === "xNGN" && (
          // in JSX:
          <div className="space-y-4 mt-2">
            {level === 1 ? (
              <div className="flex flex-col gap-2 mt-10 items-center">
                <p className="text-sm animate-pulse rounded-full px-4 py-1 border border-border bg-red-500/10 font-medium text-red-500">
                  Become a Merchant or Super Merchant to deposit xNGN.
                </p>
                <Button
                  onClick={clickHandler}
                  className="w-fit rounded-full px-4 py-2 text-sm"
                  disabled={disabled}
                >
                  {label || "Upgrade"}
                </Button>
              </div>
            ) : level === 2 && !user?.user?.hasAppliedToBecomeAMerchant ? (
              <div className="flex flex-col gap-2 mt-10 items-center">
                <p className="text-sm animate-pulse rounded-full px-4 py-1 border bg-red-500/10 font-medium text-red-500 border-border">
                  Become a Merchant to deposit xNGN.
                </p>
                <Button
                  onClick={clickHandler}
                  className="w-fit rounded-full px-4 py-2"
                >
                  Become a Merchant
                </Button>
              </div>
            ) : (
              <>
                <Card className="px-6 mt-6 gap-2">
                  <p className="text-lg font-semibold ">Deposit Account</p>
                  {userBanks.depositBanks?.length > 0 ? (
                    userBanks.depositBanks?.map((bank: TBank, idx: number) => (
                      <div
                        key={idx}
                        className="flex  flex-wrap items-center justify-between gap-4 my-2 border-b border-muted-foreground/20 pb-4 last:border-0 last:pb-0"
                      >
                        <TextBox
                          label="Account Name"
                          value={bank?.accountName}
                          direction="column"
                          showIndicator={false}
                          labelClass="text-xs"
                        />
                        <TextBox
                          label="Account Number"
                          value={
                            <div className="flex items-center gap-1 bg-background rounded-md pl-3 pr-1 py-0.5 border border-primary/20">
                              <span className="text-muted-foreground">
                                {bank?.accountNumber}
                              </span>
                              <CopyButton
                                text={bank?.accountNumber}
                                title="Copy account number"
                                type="code"
                              />
                            </div>
                          }
                          direction="column"
                          showIndicator={false}
                          labelClass="text-xs"
                        />
                        <TextBox
                          label="Bank Name"
                          value={bank?.bankName}
                          direction="column"
                          showIndicator={false}
                          labelClass="text-xs"
                        />
                      </div>
                    ))
                  ) : (
                    <div className="text-center">
                      <p>No deposit banks found</p>
                      <span className="text-sm text-muted-foreground">
                        Please contact support for assistance.
                      </span>
                    </div>
                  )}
                  <SecurityBanner
                    text={`Deposits can only be made from the registered name on your Bisats account.\nYou may also deposit using the corporate account that has been added to your profile.\nA ₦1,000 processing fee is required, as mandated by the third‑party bank.\nPlease do not process more than ₦100,000,000 (100 million) in a single transaction.\nProcessing time may take up to 2 minutes.`}
                  />
                </Card>
              </>
            )}
          </div>
        )}

        {selectedToken && selectedToken !== "xNGN" && (
          <div>
            <div className="my-3">
              <SelectDropDown
                defaultValue={selectedNetwork}
                placeholder="Select option"
                options={networks}
                error={undefined}
                label={"Select Network"}
                onChange={(e) => setSelectedNetworks(e)}
              />
            </div>
            {getAddress && (
              <CopyDisplay
                title="Wallet Address"
                text={getAddress}
                placeholder="Please select a network"
              />
            )}
            <div className="lg:h-[88px]  border   border-border bg-secondary rounded-md py-3 px-5 flex items-start my-5 ">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="shrink-0 "
              >
                <path
                  d="M7.9987 14.6663C11.6654 14.6663 14.6654 11.6663 14.6654 7.99967C14.6654 4.33301 11.6654 1.33301 7.9987 1.33301C4.33203 1.33301 1.33203 4.33301 1.33203 7.99967C1.33203 11.6663 4.33203 14.6663 7.9987 14.6663Z"
                  stroke="hsl(var(--muted-foreground))"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8 5.33301V8.66634"
                  stroke="hsl(var(--muted-foreground))"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M7.99609 10.667H8.00208"
                  stroke="hsl(var(--muted-foreground))"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              <p className="text-muted-foreground text-xs leading-[16px] font-normal ml-2">
                Please confirm that you are depositing
                <span className="font-semibold ml-1 capitalize text-primary">
                  {selectedToken}
                </span>{" "}
                to this address on the{" "}
                <span className="font-semibold ml-1 capitalize text-primary">
                  {selectedNetwork}
                </span>{" "}
                network.
                <br className="mb-2" />
                Mismatched address indivation may result in the permanent loss
                of your assets.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DepositPage;
