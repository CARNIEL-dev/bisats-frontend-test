import {
  PrimaryButton,
  WhiteTransparentButton,
} from "@/components/buttons/Buttons";
import {
  MultiSelectDropDown,
  SelectDropDown,
} from "@/components/Inputs/MultiSelectInput";
import PrimaryInput from "@/components/Inputs/PrimaryInput";
import WithdrawalConfirmationCrypto from "@/components/Modals/WithdrawalConfirmationCrypto";
import WithdrawalConfirmationNGN from "@/components/Modals/WithdrawalConfirmationNGN";
import Toast from "@/components/Toast";
import Head from "@/pages/wallet/Head";
import {
  Complete_Withdraw_xNGN,
  getNetworkFee,
  GetUserBank,
  GetWallet,
  saveWalletAddressHandler,
  useCryptoRates,
  Withdraw_Crypto,
  Withdraw_xNGN,
} from "@/redux/actions/walletActions";

import {
  AccountLevel,
  ACTIONS,
  bisats_limit,
} from "@/utils/transaction_limits";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import * as Yup from "yup";

import ModalTemplate from "@/components/Modals/ModalTemplate";
import WithdrawalBankAccount from "@/components/Modals/WithdrawalBankAccount";
import ErrorDisplay from "@/components/shared/ErrorDisplay";
import SummaryCard from "@/components/shared/SummaryCard";
import TokenSelection from "@/components/shared/TokenSelection";
import { Button } from "@/components/ui/Button";
import { getUserTokenData } from "@/helpers";
import PreLoader from "@/layouts/PreLoader";
import KycManager from "@/pages/kyc/KYCManager";
import {
  GET_WITHDRAWAL_LIMIT,
  GetUserDetails,
} from "@/redux/actions/userActions";
import { cn, formatCompactNumber, formatter } from "@/utils";
import { formatNumber } from "@/utils/numberFormat";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Decimal from "decimal.js";
import { FormikProps, useFormik } from "formik";
import { X } from "lucide-react";
import { APP_ROUTES } from "@/constants/app_route";
import SecurityBanner from "@/components/shared/SecurityBanner";
// @ts-expect-error no types
import WAValidator from "multicoin-address-validator";
import { th } from "date-fns/locale";

export type TNetwork = {
  label: string;
  value: string;
};

export type TCryptoAssets = {
  address: string;
  asset: string;
  assetId: string;
  id: string;
  network: string;
};

type UserBankListType = {
  accountName: string;
  accountNumber: string;
  bankAccountReference: null | string;
  bankAccountType: string;
  bankCode: string;
  bankName: string;
  id: string;
};

const MIN_CRYPTO_WITHDRAWAL_USD = 12;

const WithdrawalPage = () => {
  const userState: UserState = useSelector((state: any) => state.user);
  const walletState: WalletState = useSelector((state: any) => state.wallet);
  const wallet: WalletState["wallet"] = walletState?.wallet;
  const user = userState.user;

  const location = useLocation();
  const linkedAsset = location.state?.asset;

  const [selectedToken, setSelectedToken] = useState<string>(linkedAsset);

  const handleSelectionToken = (token: string) => {
    setSelectedToken(token);
  };

  const {
    data: transaction_limits,
    isError,
    isLoading,
  } = useQuery<UserTransactionLimits, Error>({
    queryKey: ["UserTransactions"],
    queryFn: GET_WITHDRAWAL_LIMIT,
    enabled: Boolean(user?.userId),
  });

  const { data: currencyRate } = useCryptoRates({
    isEnabled: Boolean(wallet && userState.user?.userId),
  });

  const userBalance: number = wallet?.[selectedToken] || 0;

  return (
    <div className="mb-20">
      <Head
        header={"Make a Withdrawal"}
        subHeader={"Securely withdraw fiat or crypto from your account."}
      />
      <div className="mt-10">
        {isLoading ? (
          <PreLoader primary={false} />
        ) : isError ? (
          <ErrorDisplay message="Failed to fetch transaction limits" />
        ) : (
          <>
            <TokenSelection
              label="Select Token"
              error={undefined}
              touched={undefined}
              handleChange={handleSelectionToken}
              value={selectedToken}
              placeholder="Select a token"
            />
            {selectedToken === "xNGN" && (
              <NGNWithdrawal
                user={user}
                transaction_limits={transaction_limits}
                userBalance={userBalance}
              />
            )}
            {selectedToken && selectedToken !== "xNGN" && (
              <CryptoWithdrawal
                user={user}
                transaction_limits={transaction_limits}
                userBalance={userBalance}
                asset={selectedToken}
                currencyRate={currencyRate}
                // cryptoAssets={wallet?.cryptoAssests}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default WithdrawalPage;

// HDR: NGN WITHDRAWAL
type PropsNGN = {
  user: UserState["user"];
  transaction_limits: undefined | UserTransactionLimits;
  userBalance: number;
};

const NGNWithdrawal = ({ user, transaction_limits, userBalance }: PropsNGN) => {
  const [withdrawlLoading, setWithdrawlLoading] = useState(false);

  const [addBankModal, setAddBankModal] = useState(false);
  const [withdrawalModal, setWithDrawalModal] = useState(false);
  const [withdrawalData, setWithdrawalData] = useState({
    referenceId: "",
    withdrawalPin: "",
    twoFactorCode: "",
  });

  const navigate = useNavigate();

  const account_level = user?.accountLevel as AccountLevel;
  const userTransactionLimits = bisats_limit[account_level];

  const queryClient = useQueryClient();

  const {
    data: userbank,
    isError,
    isLoading,
    isFetching,
  } = useQuery<UserBankListType[], Error>({
    queryKey: ["UserBankList", user?.userId],
    queryFn: GetUserBank,
    refetchOnMount: false,
    enabled: Boolean(user?.userId),
  });

  // SUB: User bank list
  const userBankList = useMemo(() => {
    if (!userbank) return [];
    return userbank?.map((choice: UserBankListType) => ({
      label: (
        <div className="text-sm flex flex-col">
          <p>{choice?.bankName}</p>
          <p className="my-1">{choice?.accountNumber}</p>
          <p>{choice?.accountName}</p>
        </div>
      ),
      labelDisplay: (
        <div className="text-sm flex items-center gap-2">
          <p className="text-xs">{choice?.bankName}</p>
          <p> - {choice?.accountNumber}</p>
        </div>
      ),
      value: choice?.id,
    }));
  }, [userbank]);

  // SUB: Used up limit
  const usedUpLimit = useMemo(() => {
    return {
      totalUsedAmountFiat: transaction_limits?.totalUsedAmountFiat,
      dailyFiatWithdrawalLimit: transaction_limits?.dailyFiatWithdrawalLimit,
    };
  }, [transaction_limits]);
  const maxWithdrawalLimit =
    userTransactionLimits?.maximum_fiat_withdrawal || Infinity;

  useEffect(() => {
    if (!userbank?.length && !isLoading) {
      setAddBankModal(true);
    }
  }, [userbank, isLoading]);

  /* 
    .max(
          userBalance,
          `Amount cannot exceed your balance (xNGN ${userBalance.toLocaleString()})`
        )
  */

  const formik = useFormik({
    initialValues: {
      amount: "",
      bank: "",
    },
    validationSchema: Yup.object().shape({
      bank: Yup.string().required("Bank is required"),
      amount: Yup.number()
        .transform((_, originalValue) =>
          originalValue === "" || isNaN(originalValue)
            ? undefined
            : Number(originalValue)
        )
        .moreThan(0, "Amount must be greater than 0")
        .max(
          maxWithdrawalLimit,
          `Amount exceeds your limit per withdrawal (xNGN ${maxWithdrawalLimit.toLocaleString()})`
        )
        .test(
          "max-balance",
          `Amount cannot exceed your balance (xNGN ${formatter({}).format(
            userBalance
          )})`,
          (value) => {
            if (value === undefined || value === null) return true;
            const numericValue = Number(value);
            if (Number.isNaN(numericValue)) return true; // let Yup handle required/number errors
            return numericValue <= userBalance;
          }
        )
        .required("Amount is required"),
    }),
    onSubmit: async (values) => {
      const payLoad = {
        amount: Number(values.amount),
        bankAccountId: values.bank,
      };
      await Withdraw_xNGN(payLoad)
        .then(async (res) => {
          if (typeof res?.status === "boolean" && res?.statusCode === 200) {
            setWithdrawalData({
              referenceId: res.data,
              withdrawalPin: "",
              twoFactorCode: "",
            });
            return true;
          } else {
            Toast.error(res.error.message, "");
            return false;
          }
        })
        .catch((err) => {
          Toast.error(err.error.message, "");
          return false;
        });
    },
  });

  const handlCompleteWithdrawl = async () => {
    setWithdrawlLoading(true);
    const payLoad = {
      referenceId: withdrawalData.referenceId,
      withdrawalPin: withdrawalData.withdrawalPin,
      twoFactorCode: withdrawalData.twoFactorCode,
    };
    await Complete_Withdraw_xNGN(payLoad)
      .then(async (res) => {
        if (res?.status || res?.statusCode === 200) {
          Toast.success(res.message, "Withdrawal Initiated");
          await Promise.all([
            queryClient.refetchQueries({
              queryKey: ["userWalletHistory"],
              exact: false,
            }),
            GetWallet(),
          ]).then(() => navigate(APP_ROUTES.WALLET.HOME));
        } else {
          Toast.error(res.message, "");
        }
      })
      .catch((err) => {
        Toast.error(err.message, "");
      })
      .finally(() => {
        setWithDrawalModal(false);
        setWithdrawlLoading(false);
      });
  };

  return (
    <>
      <div className="mt-4">
        {isLoading && isFetching ? (
          <div className="h-[12rem] grid place-content-center">
            <PreLoader primary={false} />
          </div>
        ) : isError ? (
          <div className="h-[5rem] grid place-content-center">
            <ErrorDisplay
              message="Failed to get withdrawal account, Try again later."
              isError={false}
              showIcon={false}
            />
          </div>
        ) : userBankList?.length > 0 ? (
          <>
            <div>
              <MultiSelectDropDown
                parentId={""}
                placeholder={"Select"}
                choices={userBankList}
                error={undefined}
                touched={undefined}
                label={"Select Bank"}
                handleChange={(e) => {
                  formik.setFieldValue("bank", e);
                }}
                value={formik.values.bank}
                defaultLabelDisplay
              />
              <div className="mt-4">
                <PrimaryInput
                  label={`Amount `}
                  placeholder="Enter amount"
                  type="number"
                  min={userTransactionLimits?.minimum_fiat_withdrawal}
                  max={Math.min(userBalance, maxWithdrawalLimit)}
                  inputMode="numeric"
                  error={formik.errors.amount}
                  touched={
                    Number(formik.values.amount) > maxWithdrawalLimit
                      ? true
                      : false
                  }
                  value={formik.values.amount}
                  onChange={(e) => {
                    // let value = e.target.value.replace(/\D/g, "");
                    // const max = maxWithdrawalLimit;
                    // if (max && Number(value) > max) {
                    //   value = max.toString();
                    // }
                    formik.setFieldValue("amount", e.target.value);
                  }}
                  format
                  maxFnc={() => {
                    const val = Math.min(maxWithdrawalLimit, userBalance);
                    formik.setFieldValue("amount", val);
                  }}
                />

                <SummaryCard
                  type="fiat"
                  currency={"xNGN"}
                  dailyLimit={
                    formatCompactNumber(
                      parseFloat(usedUpLimit?.dailyFiatWithdrawalLimit || "0") -
                        (usedUpLimit?.totalUsedAmountFiat || 0)
                    ).endsWith("T")
                      ? "Unlimited"
                      : formatCompactNumber(
                          parseFloat(
                            usedUpLimit?.dailyFiatWithdrawalLimit || "0"
                          ) - (usedUpLimit?.totalUsedAmountFiat || 0)
                        )
                  }
                  fee={
                    !formik.values.amount || !formik.isValid
                      ? "-"
                      : userTransactionLimits?.charge_on_single_withdrawal_fiat
                  }
                  amount={
                    formik.errors.amount || !formik.isValid
                      ? "-"
                      : formatter({ decimal: 2 }).format(
                          isNaN(parseFloat(formik.values.amount))
                            ? 0
                            : parseFloat(formik.values.amount) -
                                userTransactionLimits?.charge_on_single_withdrawal_fiat
                        )
                  }
                  total={`${formatNumber(
                    !formik.values.amount || !formik.isValid
                      ? "-"
                      : Number(formik.values.amount ?? 0)
                  )}`}
                />
                <KycManager
                  action={ACTIONS.WITHDRAW_NGN}
                  func={(val) => {
                    setWithDrawalModal(true);
                    setWithdrawalData((prev) => ({
                      ...prev,
                      twoFactorCode: val?.code,
                      withdrawalPin: val?.pin,
                    }));
                  }}
                  isManual
                >
                  {(validateAndExecute) => (
                    <PrimaryButton
                      className="w-full"
                      text={"Withdraw"}
                      loading={formik.isSubmitting}
                      onClick={async () => {
                        await formik.submitForm();
                        setTimeout(() => {
                          if (withdrawalData.referenceId) {
                            validateAndExecute();
                          }
                        }, 100);
                      }}
                      disabled={!formik.isValid || !formik.dirty}
                    />
                  )}
                </KycManager>
              </div>
            </div>
          </>
        ) : (
          <div className="h-[6rem] pt-6 flex flex-col gap-4">
            <ErrorDisplay
              message="You have not added a withdrawal account yet."
              isError={false}
              showIcon={false}
              capitalize={false}
            />
            <WhiteTransparentButton
              text={"Add Withdrawal Account"}
              loading={false}
              onClick={() => setAddBankModal(true)}
              className="w-fit px-4 py-1 mx-auto"
            />
          </div>
        )}
      </div>

      <ModalTemplate
        isOpen={addBankModal}
        onClose={() => setAddBankModal(false)}
        primary={false}
      >
        <WithdrawalBankAccount
          mode="add"
          close={() => {
            setAddBankModal(false);
            navigate(0);
          }}
        />
      </ModalTemplate>
      {withdrawalModal && (
        <WithdrawalConfirmationNGN
          close={() => setWithDrawalModal(false)}
          transactionFee={`${userTransactionLimits?.charge_on_single_withdrawal_fiat}`}
          withdrawalAmount={`${formik.values.amount}`}
          total={`${
            Number(formik.values.amount ?? 0) +
            userTransactionLimits?.charge_on_single_withdrawal_fiat
          }`}
          submit={handlCompleteWithdrawl}
          isLoading={withdrawlLoading}
        />
      )}
    </>
  );
};

// HDR: CRYPTO WITHDRAWAL

type PropsCrypto = {
  user: UserState["user"];
  transaction_limits: undefined | UserTransactionLimits;
  userBalance: number;
  asset: string;
  currencyRate: CryptoRates | undefined;
  // cryptoAssets: WalletState["wallet"][];
};
const CryptoWithdrawal = ({
  user,
  transaction_limits,
  userBalance,
  asset,
  currencyRate,
}: PropsCrypto) => {
  const [withdrawalModal, setWithDrawalModal] = useState(false);
  const [showSavedAddressModal, setShowSavedAddressModal] = useState(false);

  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const savedAddress = useMemo(() => {
    if (!user?.withdrawalAddresses || !asset) return [];
    return user.withdrawalAddresses.filter(
      (item: TUserWalletAddress) => item.asset === asset
    );
  }, [user?.withdrawalAddresses, asset]);

  const [showSavedAddressOptions, setShowSavedAddressOptions] = useState(
    savedAddress.length > 0
  );

  useEffect(() => {
    setShowSavedAddressOptions(savedAddress.length > 0);
  }, [savedAddress, user]);

  // SUB: ========= Used up limit =======================
  const usedUpLimit = useMemo(() => {
    return {
      totalUsedAmountCrypto: transaction_limits?.totalUsedAmountCrypto,
      dailyCryptoWithdrawalLimit:
        transaction_limits?.dailyCryptoWithdrawalLimit,
    };
  }, [transaction_limits]);

  // HDR: : List of networks
  const tokenData: TNetwork[] = useMemo(() => {
    const token = getUserTokenData();

    const networks = token?.find(
      (item: any) => item.tokenName === asset
    )?.networks;

    return networks || [];
  }, [asset]);

  const assetUsdRate = useMemo(() => {
    if (!asset || !currencyRate) return 0;

    const rateKey = asset.toUpperCase();
    const rateMap: Record<string, number | undefined> = {
      BTC: currencyRate.bitcoin?.usd,
      ETH: currencyRate.ethereum?.usd,
      SOL: currencyRate.solana?.usd,
      USDT: currencyRate.tether?.usd,
      TRX: currencyRate.tron?.usd,
    };

    return rateMap[rateKey] ?? 0;
  }, [asset, currencyRate]);

  const minimumAssetAmount = useMemo(() => {
    if (!assetUsdRate) return null;
    return MIN_CRYPTO_WITHDRAWAL_USD / assetUsdRate;
  }, [assetUsdRate]);

  const formattedMinimumAssetAmount = useMemo(() => {
    if (!minimumAssetAmount) return null;
    const decimals = asset?.toUpperCase() === "USDT" ? 2 : 7;
    return formatter({ decimal: decimals }).format(minimumAssetAmount);
  }, [asset, minimumAssetAmount]);

  // SUB: ================= FOrmik =====================
  const formik = useFormik({
    initialValues: {
      amount: "",
      walletAddress: "",
      network: "",
      walletName: "",
    },
    validationSchema: Yup.object().shape({
      walletAddress: Yup.string()
        .required("Wallet address is required")
        .test("wallet-address-network-validation", function (value) {
          const { network } = this.parent;
          const isValid = WAValidator.validate(
            value,
            network === "BSC" ? "0x" : network
          );

          if (!isValid) {
            return this.createError({
              message: `Please enter a valid wallet address`,
            });
          }

          return isValid;
        }),
      amount: Yup.number()
        .transform((_, originalValue) =>
          originalValue === "" || isNaN(originalValue)
            ? undefined
            : Number(originalValue)
        )
        .moreThan(0, "Amount must be greater than 0")
        .max(
          userBalance,
          `Amount cannot exceed your balance (${userBalance.toLocaleString()} ${asset})`
        )
        .test(
          "min-usd-equivalent",
          `Amount must be at least equivalent to $${MIN_CRYPTO_WITHDRAWAL_USD}`,
          (value) => {
            if (value === undefined || value === null) return true;
            const numericValue = Number(value);
            if (Number.isNaN(numericValue)) return true;
            if (!assetUsdRate) return true;
            const usdEquivalent = numericValue * assetUsdRate;
            return usdEquivalent >= MIN_CRYPTO_WITHDRAWAL_USD;
          }
        )
        .required("Amount is required"),
    }),
    onSubmit: async (values) => {
      const amountVal = parseFloat(values.amount).toFixed(6);
      const inDecimal = new Decimal(amountVal).toNumber();

      const payload = {
        userId: `${user?.userId}`,
        amount: inDecimal,
        address: values.walletAddress ?? "",
        asset: asset,
        chain: values.network,
      };

      await Withdraw_Crypto(payload)
        .then(async (res) => {
          if (res?.status || res?.statusCode === 200) {
            Toast.success(res.message, "Withdrawal Initiated");
            await Promise.all([
              queryClient.invalidateQueries({
                queryKey: ["userWalletHistory"],
                exact: false,
              }),
              GetWallet(),
              navigate(APP_ROUTES.WALLET.HOME),
            ]);
          } else {
            Toast.error(res.message, "");
          }
        })
        .catch((err) => {
          Toast.error(err.message, "");
        })
        .finally(() => {
          setWithDrawalModal(false);
        });
    },
  });

  const [debouncedAmount, setDebouncedAmount] = useState(formik.values.amount);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedAmount(formik.values.amount);
    }, 800);

    return () => clearTimeout(handler);
  }, [formik.values.amount]);

  useEffect(() => {
    if (!assetUsdRate) return;
    if (formik.values.amount) {
      formik.validateField("amount");
    }
  }, [assetUsdRate, formik.values.amount]);

  const isAmountReady =
    debouncedAmount !== "" && !Number.isNaN(Number(debouncedAmount));

  const { data, isLoading, error, isError } = useQuery<{
    assetType: string;
    network: string;
    networkFee: number;
    networkFeeInUSD: string;
  }>({
    queryKey: [
      "networkFee",
      asset,
      debouncedAmount,
      formik.values.walletAddress,
      formik.values.network,
    ],
    queryFn: async () =>
      await getNetworkFee({
        paylod: {
          userId: user?.userId,
          amount: Number(debouncedAmount),
          address: formik.values.walletAddress,
          asset: asset,
          chain: formik.values.network,
        },
      }),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled:
      isAmountReady &&
      Boolean(formik.values.walletAddress) &&
      Boolean(formik.values.network) &&
      formik.isValid,
  });

  useEffect(() => {
    formik.resetForm({
      values: {
        amount: "",
        walletAddress: "",
        network: "",
        walletName: "",
      },
    });
  }, [asset]);

  return (
    <>
      <div className="flex flex-col gap-3 mt-4">
        {showSavedAddressOptions && savedAddress?.length > 0 ? (
          <div>
            <div className="grid grid-cols-[1fr_auto] gap-2">
              <Button
                variant={"outline"}
                className="py-3 justify-start h-fit bg-gray-50 text-sm text-gray-500 hover:text-gray-500/90"
                type="button"
                onClick={() => setShowSavedAddressModal(true)}
              >
                {formik.values.walletName || "Select Saved Address"}
              </Button>
              <Button
                variant={"outline"}
                className="!py-3 h-fit text-sm text-gray-500 hover:text-gray-500/90"
                type="button"
                onClick={() => {
                  setShowSavedAddressOptions(false);
                  formik.resetForm({
                    values: {
                      amount: "",
                      walletAddress: "",
                      network: "",
                      walletName: "",
                    },
                  });
                }}
              >
                <X className="!size-5" />
              </Button>
            </div>
            {formik.values.walletName && (
              <div
                role="button"
                className={cn("bg-gray-50 p-3 relative  rounded-md mt-2 ")}
              >
                {formik.values.walletName && (
                  <span className="absolute top-2 right-2 text-green-600 font-semibold text-sm">
                    Selected
                  </span>
                )}
                <div className="flex flex-col gap-1  text-sm text-gray-500">
                  <h4 className="text-medium text-gray-800">
                    {formik.values.walletName}
                  </h4>
                  <div>
                    <p>Network</p>
                    <p className="font-medium text-gray-600">
                      {formik.values.network}
                    </p>
                  </div>
                  <div>
                    <p>Wallet</p>
                    <p className="font-medium text-gray-600 text-xs">
                      {formik.values.walletAddress}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
            <SelectDropDown
              key={asset}
              placeholder={"Select option"}
              options={tokenData}
              error={formik.errors.network}
              label={"Select Network"}
              onChange={(e) => {
                formik.setFieldValue("network", e);
              }}
              value={formik.values.network || undefined}
            />
            <PrimaryInput
              label={"Wallet Address"}
              placeholder="Enter address"
              error={formik.errors.walletAddress}
              value={formik.values.walletAddress}
              onChange={(e) => {
                formik.setFieldValue("walletAddress", e.target.value);
              }}
              touched={undefined}
            />
          </>
        )}
        {formik.values.walletAddress &&
          formik.values.network &&
          !formik.errors.walletAddress &&
          !showSavedAddressOptions && (
            <SaveWalletAddress
              data={{
                walletAddress: formik.values.walletAddress,
                network: formik.values.network,
                asset: asset,
              }}
              userId={user?.userId}
              token={user?.token}
              parentFormik={formik}
            />
          )}
        <PrimaryInput
          label={`Amount`}
          type="number"
          placeholder="Enter amount"
          value={formik.values.amount}
          onChange={(e) => {
            formik.setFieldValue("amount", e.target.value);
          }}
          format
          error={formik.errors.amount}
          touched={undefined}
          maxFnc={() => {
            formik.setFieldValue("amount", userBalance);
          }}
        />

        <SecurityBanner
          text={`Minimum withdrawal amount is $12 equivalent (~${
            formattedMinimumAssetAmount ?? ""
          } ${formattedMinimumAssetAmount ? asset : ""}).`}
          alertType="info"
        />

        <SummaryCard
          type="crypto"
          loading={isLoading}
          error={error}
          currency={asset}
          dailyLimit={
            formatCompactNumber(
              parseFloat(usedUpLimit?.dailyCryptoWithdrawalLimit || "0") -
                (usedUpLimit?.totalUsedAmountCrypto || 0)
            ).endsWith("T")
              ? "Unlimited"
              : formatCompactNumber(
                  parseFloat(usedUpLimit?.dailyCryptoWithdrawalLimit || "0") -
                    (usedUpLimit?.totalUsedAmountCrypto || 0)
                ) + " USD"
          }
          fee={
            data?.networkFee && formik.isValid
              ? formatter({ decimal: 2 }).format(data.networkFee)
              : "-"
          }
          amount={
            formik.errors.amount || !formik.isValid
              ? "-"
              : formatter({ decimal: asset === "USDT" ? 2 : 5 }).format(
                  isNaN(parseFloat(formik.values.amount))
                    ? 0
                    : parseFloat(formik.values.amount) - (data?.networkFee ?? 0)
                )
          }
          total={
            formik.errors.amount || !formik.isValid
              ? "-"
              : `${formatter({ decimal: asset === "USDT" ? 2 : 5 }).format(
                  !formik.values.amount
                    ? 0
                    : parseFloat(formik.values.amount ?? 0)
                )}`
          }
        />
        <KycManager
          action={ACTIONS.WITHDRAW_CRYPTO}
          func={() => setWithDrawalModal(true)}
        >
          {(validateAndExecute) => (
            <PrimaryButton
              className="w-full"
              text={"Withdraw"}
              loading={false}
              onClick={validateAndExecute}
              disabled={
                !formik.isValid || !formik.dirty || isLoading || isError
              }
            />
          )}
        </KycManager>
      </div>

      <WithdrawalConfirmationCrypto
        open={withdrawalModal}
        close={() => setWithDrawalModal(false)}
        isLoading={formik.isSubmitting}
        amount={formik.values.amount}
        address={formik.values.walletAddress}
        submit={formik.submitForm}
        asset={asset}
        network={formik.values.network}
        fee={
          data?.networkFee && formik.isValid
            ? formatter({ decimal: 2 }).format(data.networkFee)
            : "-"
        }
      />

      {/* SUB: Save address modal */}
      <ModalTemplate
        isOpen={showSavedAddressModal}
        onClose={() => setShowSavedAddressModal(false)}
      >
        <div className="space-y-4 mt-3">
          <h5 className="font-semibold text-xl">Select Saved Address</h5>

          <div className="space-y-3 max-h-[20rem] no-scrollbar overflow-y-auto">
            {savedAddress?.map((item: TUserWalletAddress, index: number) => (
              <div
                key={index}
                onClick={() => {
                  formik.setFieldValue("walletAddress", item.address);
                  formik.setFieldValue("network", item.network);
                  formik.setFieldValue("walletName", item.name);
                  setShowSavedAddressModal(false);
                }}
                role="button"
                className={cn(
                  "bg-gray-50 p-3 relative shadow rounded-md border cursor-pointer hover:border-green-500",
                  formik.values.walletAddress === item.address &&
                    "border-green-500"
                )}
              >
                {formik.values.walletAddress === item.address && (
                  <span className="absolute top-2 right-2 text-green-600 font-semibold text-sm">
                    Selected
                  </span>
                )}
                <div className="flex flex-col gap-1  text-sm text-gray-500">
                  <h4 className="text-medium text-gray-800 text-lg">
                    {item.name}
                  </h4>
                  <div>
                    <p>Network</p>
                    <p className="font-medium text-gray-600">{item.network}</p>
                  </div>
                  <div>
                    <p>Wallet</p>
                    <p className="font-medium text-gray-600 text-xs">
                      {item.address}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ModalTemplate>
    </>
  );
};

// HDR: Save Wallet Address
type SaveWalletAddressProps = {
  data: {
    walletAddress: string;
    network: string;
    asset: string;
  };
  userId: string;
  token: string;
  parentFormik: FormikProps<any>;
};

const SaveWalletAddress = ({
  data,
  userId,
  token,
  parentFormik,
}: SaveWalletAddressProps) => {
  const [saveWalletAddressModal, setSaveWalletAddressModal] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: "",
      address: data?.walletAddress,
      network: data?.network,
      asset: data?.asset,
      userId,
    },
    onSubmit: async (payload) => {
      if (!payload.name) return Toast.error("Name is required", "");
      const dataInfo = {
        ...payload,
        name: payload.name.trim() as string,
      };
      const res = await saveWalletAddressHandler(dataInfo);
      if (res?.status || res?.statusCode === 201) {
        await GetUserDetails({ userId, token });
        Toast.success(res.message, "Success");
        parentFormik.setFieldValue("walletName", dataInfo.name);
        setSaveWalletAddressModal(false);
      } else {
        Toast.error(res.message, "");
      }
    },
  });

  return (
    <>
      <Button
        className="w-fit self-end text-xs border rounded-full"
        onClick={() => setSaveWalletAddressModal(true)}
        type="button"
        variant="secondary"
        size={"sm"}
      >
        Save Address
      </Button>
      <ModalTemplate
        isOpen={saveWalletAddressModal}
        onClose={() => setSaveWalletAddressModal(false)}
        primary={false}
      >
        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
          <div>
            <h4 className="font-semibold text-lg">Save Wallet Address</h4>
            <p className="text-gray-500 text-xs">
              Save your wallet address for faster withdrawal
            </p>
          </div>
          <PrimaryInput
            label="Name"
            placeholder="Enter name"
            value={formik.values.name}
            onChange={(e) => {
              formik.setFieldValue("name", e.target.value);
            }}
            error={undefined}
            touched={undefined}
            info="Nickname to remember your wallet address"
          />
          <div className="text-gray-500 text-xs bg-gray-100 p-2 rounded-md flex flex-col gap-1">
            <p>Address: {data?.walletAddress}</p>
            <p>Network: {data?.network}</p>
            <p>Asset: {data?.asset}</p>
          </div>
          <PrimaryButton
            className="w-fit self-end mt-4 text-sm !h-fit !py-2.5"
            text={"Save Address"}
            loading={formik.isSubmitting}
            type="submit"
            disabled={!formik.isValid || !formik.dirty}
          />
        </form>
      </ModalTemplate>
    </>
  );
};
