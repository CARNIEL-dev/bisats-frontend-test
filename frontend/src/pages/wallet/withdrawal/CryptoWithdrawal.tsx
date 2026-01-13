import { PrimaryButton } from "@/components/buttons/Buttons";
import PrimaryInput from "@/components/Inputs/PrimaryInput";
import ModalTemplate from "@/components/Modals/ModalTemplate";
import SecurityBanner from "@/components/shared/SecurityBanner";
import Toast from "@/components/Toast";
import { Button } from "@/components/ui/Button";
import { APP_ROUTES } from "@/constants/app_route";
import { getUserTokenData } from "@/helpers";
import { GetUserDetails } from "@/redux/actions/userActions";
import {
  Complete_Withdraw_Crypto,
  getNetworkFee,
  GetWallet,
  saveWalletAddressHandler,
  Withdraw_Crypto,
} from "@/redux/actions/walletActions";
import { cn, formatCompactNumber, formatter } from "@/utils";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Decimal from "decimal.js";
import { FormikProps, useFormik } from "formik";
import { X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { SelectDropDown } from "@/components/Inputs/MultiSelectInput";
import WithdrawalConfirmationCrypto from "@/components/Modals/WithdrawalConfirmationCrypto";
import SummaryCard from "@/components/shared/SummaryCard";
import KycManager from "@/pages/kyc/KYCManager";
import { TNetwork } from "@/pages/wallet/withdrawal";
import { ACTIONS } from "@/utils/transaction_limits";

// @ts-expect-error no types
import WAValidator from "multicoin-address-validator";
import * as Yup from "yup";

type PropsCrypto = {
  user: UserState["user"];
  transaction_limits: undefined | UserTransactionLimits;
  userBalance: number;
  asset: string;
  currencyRate: CryptoRates | undefined;
  // cryptoAssets: WalletState["wallet"][];
};

const MIN_CRYPTO_WITHDRAWAL_USD = 12;
const CryptoWithdrawal = ({
  user,
  transaction_limits,
  userBalance,
  asset,
  currencyRate,
}: PropsCrypto) => {
  const [withdrawalLoding, setWithdrawalLoding] = useState(false);
  const [withdrawalModal, setWithDrawalModal] = useState(false);
  const [showSavedAddressModal, setShowSavedAddressModal] = useState(false);
  const [withdrawalData, setWithdrawalData] = useState({
    referenceId: "",
    withdrawalPin: "",
    twoFactorCode: "",
  });

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
          if (res?.status === true && res?.statusCode === 200) {
            setWithdrawalData({
              referenceId: res.data,
              withdrawalPin: "",
              twoFactorCode: "",
            });
            return true;
          } else {
            Toast.error(res.message, "");
            setWithdrawalData({
              referenceId: "",
              withdrawalPin: "",
              twoFactorCode: "",
            });

            return false;
          }
        })
        .catch((err) => {
          Toast.error(err.message, "");

          setWithdrawalData({
            referenceId: "",
            withdrawalPin: "",
            twoFactorCode: "",
          });

          return false;
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asset]);

  const handleCompleteWithdrawl = async () => {
    setWithdrawalLoding(true);
    const payLoad = {
      referenceId: withdrawalData.referenceId,
      withdrawalPin: withdrawalData.withdrawalPin,
      twoFactorCode: withdrawalData.twoFactorCode,
    };
    await Complete_Withdraw_Crypto(payLoad)
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
          setWithdrawalData({
            referenceId: "",
            withdrawalPin: "",
            twoFactorCode: "",
          });
        }
      })
      .catch((err) => {
        Toast.error(err.message, "");
        setWithdrawalData({
          referenceId: "",
          withdrawalPin: "",
          twoFactorCode: "",
        });
      })
      .finally(() => {
        setWithDrawalModal(false);
        setWithdrawalLoding(false);
      });
  };

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
                const success = await formik.submitForm();
                if (success) {
                  validateAndExecute(); // Proceeds immediately on success
                }
              }}
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
        isLoading={withdrawalLoding}
        amount={formik.values.amount}
        address={formik.values.walletAddress}
        submit={handleCompleteWithdrawl}
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

export default CryptoWithdrawal;

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
