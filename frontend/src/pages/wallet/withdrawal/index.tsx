import {
  PrimaryButton,
  WhiteTransparentButton,
} from "@/components/buttons/Buttons";
import { MultiSelectDropDown } from "@/components/Inputs/MultiSelectInput";
import PrimaryInput from "@/components/Inputs/PrimaryInput";
import WithdrawalConfirmationCrypto from "@/components/Modals/WithdrawalConfirmationCrypto";
import WithdrawalConfirmationNGN from "@/components/Modals/WithdrawalConfirmationNGN";
import Toast from "@/components/Toast";
import Head from "@/pages/wallet/Head";
import {
  GetUserBank,
  GetWallet,
  Withdraw_Crypto,
  Withdraw_xNGN,
} from "@/redux/actions/walletActions";
import { UserState } from "@/redux/reducers/userSlice";
import {
  AccountLevel,
  ACTIONS,
  bisats_limit,
} from "@/utils/transaction_limits";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import * as Yup from "yup";

import WithdrawalBankAccount from "@/components/Modals/WithdrawalBankAccount";
import ErrorDisplay from "@/components/shared/ErrorDisplay";
import TokenSelection from "@/components/shared/TokenSelection";
import { getUserTokenData } from "@/helpers";
import PreLoader from "@/layouts/PreLoader";
import KycManager from "@/pages/kyc/KYCManager";
import { GET_WITHDRAWAL_LIMIT } from "@/redux/actions/userActions";
import { WalletState } from "@/redux/reducers/walletSlice";
import { formatter } from "@/utils";
import { formatNumber } from "@/utils/numberFormat";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Decimal from "decimal.js";
import { useFormik } from "formik";
import SummaryCard from "@/components/shared/SummaryCard";
import ModalTemplate from "@/components/Modals/ModalTemplate";

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
    queryKey: ["UserTransactions", user?.userId],
    queryFn: () => GET_WITHDRAWAL_LIMIT(user?.userId),
    enabled: Boolean(user?.userId),
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
                cryptoAssets={wallet?.cryptoAssests}
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
  const [addBankModal, setAddBankModal] = useState(false);
  const [withdrawalModal, setWithDrawalModal] = useState(false);

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
    queryFn: () => GetUserBank(user?.userId),
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
          userBalance,
          `Amount cannot exceed your balance (xNGN ${userBalance.toLocaleString()})`
        )
        .max(
          maxWithdrawalLimit,
          `Amount exceeds your limit per withdrawal (xNGN ${maxWithdrawalLimit.toLocaleString()})`
        )
        .required("Amount is required"),
    }),
    onSubmit: async (values) => {
      const payLoad = {
        userId: `${user?.userId}`,
        amount: Number(values.amount),
        bankAccountId: values.bank,
      };
      await Withdraw_xNGN(payLoad)
        .then(async (res) => {
          if (res?.status || res?.statusCode === 200) {
            Toast.success(res.message, "Withdrawal Initiated");
            await Promise.all([
              queryClient.invalidateQueries({
                queryKey: ["userWalletHistory"],
                exact: false,
              }),
              GetWallet(),
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
                  maxFnc={() => {
                    const val = Math.min(maxWithdrawalLimit, userBalance);
                    formik.setFieldValue("amount", val);
                  }}
                />
                <SummaryCard
                  type="fiat"
                  currency={"xNGN"}
                  dailyLimit={
                    usedUpLimit?.dailyFiatWithdrawalLimit?.toLowerCase() ===
                    "unlimited"
                      ? "Unlimited"
                      : formatNumber(
                          parseFloat(
                            usedUpLimit?.dailyFiatWithdrawalLimit || "0"
                          ) - (usedUpLimit?.totalUsedAmountFiat || 0)
                        )
                  }
                  fee={
                    !formik.values.amount
                      ? "-"
                      : userTransactionLimits?.charge_on_single_withdrawal_fiat
                  }
                  amount={formatNumber(formik.values.amount ?? "-")}
                  total={`${formatNumber(
                    !formik.values.amount
                      ? "-"
                      : Number(formik.values.amount ?? 0) +
                          userTransactionLimits?.charge_on_single_withdrawal_fiat
                  )}`}
                />
                <KycManager
                  action={ACTIONS.WITHDRAW_NGN}
                  func={() => setWithDrawalModal(true)}
                >
                  {(validateAndExecute) => (
                    <PrimaryButton
                      className="w-full"
                      text={"Withdraw"}
                      loading={false}
                      onClick={validateAndExecute}
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
          close={() => setAddBankModal(false)}
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
          submit={formik.submitForm}
          isLoading={formik.isSubmitting}
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
  cryptoAssets: WalletState["wallet"][];
};
const CryptoWithdrawal = ({
  user,
  transaction_limits,
  userBalance,
  asset,
  cryptoAssets,
}: PropsCrypto) => {
  const [withdrawalModal, setWithDrawalModal] = useState(false);

  const account_level = user?.accountLevel as AccountLevel;
  const userTransactionLimits = bisats_limit[account_level];

  const queryClient = useQueryClient();

  // SUB: Used up limit
  const usedUpLimit = useMemo(() => {
    return {
      totalUsedAmountCrypto: transaction_limits?.totalUsedAmountCrypto,
      dailyCryptoWithdrawalLimit:
        transaction_limits?.dailyCryptoWithdrawalLimit,
    };
  }, [transaction_limits]);

  // const maxWithdrawalLimit =
  //   userTransactionLimits?.maximum_crypto_withdrawal || Infinity;

  const tokenData: TNetwork[] = useMemo(() => {
    const token = getUserTokenData();

    const networks = token?.find(
      (item: any) => item.tokenName === asset
    )?.networks;

    return networks || [];
  }, [asset]);

  const getCryptoAssetId = (network: string) => {
    const isDev =
      process.env.REACT_APP_NODE_ENV === "development" ||
      process.env.VERCEL_ENV === "development";

    const cryptoAsset = cryptoAssets?.find((item) => item?.network === network);

    return isDev ? cryptoAsset?.assetId : cryptoAsset?.asset;
  };

  const formik = useFormik({
    initialValues: {
      amount: "",
      walletAddress: "",
      network: "",
    },
    validationSchema: Yup.object().shape({
      walletAddress: Yup.string().required("Wallet address is required"),
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
        .required("Amount is required"),
    }),
    onSubmit: async (values) => {
      const amountVal = parseFloat(values.amount).toFixed(6);
      const inDecimal = new Decimal(amountVal).toNumber();

      const payload = {
        userId: `${user?.userId}`,
        amount: inDecimal,
        address: values.walletAddress ?? "",
        asset: getCryptoAssetId(formik.values.network) ?? "",
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

  useEffect(() => {
    formik.resetForm({
      values: {
        amount: "",
        walletAddress: "",
        network: "",
      },
    });
  }, [asset]);

  return (
    <>
      <div className="flex flex-col gap-3 mt-4">
        <MultiSelectDropDown
          key={asset}
          parentId={""}
          placeholder={"Select option"}
          choices={tokenData}
          error={formik.errors.network}
          touched={undefined}
          label={"Select Network"}
          handleChange={(e) => {
            formik.setFieldValue("network", e);
          }}
          value={formik.values.network}
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
        <PrimaryInput
          label={`Amount`}
          type="number"
          placeholder="Enter amount"
          value={formik.values.amount}
          onChange={(e) => {
            formik.setFieldValue("amount", e.target.value);
          }}
          // error={
          //   Number(cryptoWithdrwalAmount || 0) > currentBalance
          //     ? "Amount exceeds balance"
          //     : undefined
          // }
          error={formik.errors.amount}
          touched={undefined}
        />
        <SummaryCard
          type="crypto"
          currency={asset}
          dailyLimit={`${formatNumber(
            userTransactionLimits?.daily_withdrawal_limit_crypto -
              (usedUpLimit?.totalUsedAmountCrypto ?? 0)
          )} USD`}
          fee={formatter({ decimal: asset === "USDT" ? 2 : 5 }).format(
            !formik.values.amount
              ? 0
              : userTransactionLimits?.charge_on_single_withdrawal_crypto
          )}
          amount={formatter({ decimal: asset === "USDT" ? 2 : 5 }).format(
            isNaN(parseFloat(formik.values.amount))
              ? 0
              : parseFloat(formik.values.amount)
          )}
          total={`${formatter({ decimal: asset === "USDT" ? 2 : 5 }).format(
            !formik.values.amount
              ? 0
              : parseFloat(formik.values.amount ?? 0) +
                  userTransactionLimits?.charge_on_single_withdrawal_crypto
          )}`}
        />
        <KycManager
          action={ACTIONS.WITHDRAW_NGN}
          func={() => setWithDrawalModal(true)}
        >
          {(validateAndExecute) => (
            <PrimaryButton
              className="w-full"
              text={"Withdraw"}
              loading={false}
              onClick={validateAndExecute}
              disabled={!formik.isValid || !formik.dirty}
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
      />
    </>
  );
};
