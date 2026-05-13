import {
  PrimaryButton,
  WhiteTransparentButton,
} from "@/components/buttons/Buttons";
import { MultiSelectDropDown } from "@/components/Inputs/MultiSelectInput";
import PrimaryInput from "@/components/Inputs/PrimaryInput";
import WithdrawalConfirmationNGN from "@/components/Modals/WithdrawalConfirmationNGN";
import WithdrawalProcessingModal from "@/components/Modals/WithdrawalProcessingModal";
import Toast from "@/components/Toast";
import Head from "@/pages/wallet/Head";
import {
  Complete_Withdraw_xNGN,
  getNGNCommission,
  useCryptoRates,
  Withdraw_xNGN,
} from "@/redux/actions/walletActions";

import {
  AccountLevel,
  ACTIONS,
  bisats_limit,
} from "@/utils/transaction_limits";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import * as Yup from "yup";

import ModalTemplate from "@/components/Modals/ModalTemplate";
import WithdrawalBankAccount from "@/components/Modals/WithdrawalBankAccount";
import ErrorDisplay from "@/components/shared/ErrorDisplay";
import SummaryCard from "@/components/shared/SummaryCard";
import TokenSelection from "@/components/shared/TokenSelection";

import PreLoader from "@/layouts/PreLoader";
import KycManager from "@/pages/kyc/KYCManager";
import { GET_WITHDRAWAL_LIMIT } from "@/redux/actions/userActions";
import { formatAccountLevel, formatCompactNumber, formatter } from "@/utils";
import { formatNumber } from "@/utils/numberFormat";
import { useQuery } from "@tanstack/react-query";

import { useFormik } from "formik";

import { APP_ROUTES } from "@/constants/app_route";


import CryptoWithdrawal from "@/pages/wallet/withdrawal/CryptoWithdrawal";
import useUserStatus from "@/hooks/use-user-status";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/card";

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
  const { isSuspended } = useUserStatus();

  const location = useLocation();
  const linkedAsset = location.state?.asset;
  const linkedAmount = location.state?.amount;
  const navigate = useNavigate();

  const [selectedToken, setSelectedToken] = useState<string>(linkedAsset);

  const handleSelectionToken = (token: string) => {
    setSelectedToken(token);
  };

  const {
    data: transaction_limits,
    isError,
    isLoading,
    refetch,
  } = useQuery<UserTransactionLimits, Error>({
    queryKey: ["UserTransactions"],
    queryFn: GET_WITHDRAWAL_LIMIT,
    enabled: Boolean(user?.userId),
  });

  const { data: currencyRate } = useCryptoRates({
    isEnabled: Boolean(wallet && userState.user?.userId),
  });

  const userBalance: number = wallet?.[selectedToken] || 0;

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
          <Card className="flex flex-col items-center gap-2">
            <ErrorDisplay message="Failed to fetch transaction limits" />
            <Button size="sm" onClick={() => refetch()}>
              Try again
            </Button>
          </Card>
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
                defaultAmount={linkedAmount}
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
  defaultAmount?: number;
};

const NGNWithdrawal = ({
  user,
  transaction_limits,
  userBalance,
  defaultAmount,
}: PropsNGN) => {
  const [withdrawlLoading, setWithdrawlLoading] = useState(false);
  // Tracks whether Withdraw_xNGN succeeded so onClick can gate validateAndExecute().
  // We use a ref (not state) because it must be readable synchronously after
  // `await formik.submitForm()` settles — state updates are batched and async.
  const withdrawSubmitSuccessRef = useRef(false);

  const [addBankModal, setAddBankModal] = useState(false);
  const [withdrawalModal, setWithDrawalModal] = useState(false);
  const [processingModal, setProcessingModal] = useState(false);
  const [withdrawalData, setWithdrawalData] = useState({
    referenceId: "",
    withdrawalPin: "",
    twoFactorCode: "",
  });

  const navigate = useNavigate();

  const { level, isNA } = formatAccountLevel(user?.accountLevel);

  // Map level number → bisats_limit key, fallback to level_1 if none
  const accountLevelKey =
    !isNA && level ? (`level_${level}` as AccountLevel) : "level_1";

  const userTransactionLimits = bisats_limit[accountLevelKey];

  // SUB: Debounced amount for commission fetch
  const [debouncedAmount, setDebouncedAmount] = useState("");

  // SUB: User bank list
  const userBankList = useMemo(() => {
    const bankAccounts = user?.bankAccounts;
    const userbank = bankAccounts?.filter(
      (ba: any) => ba?.bankAccountType === "withdrawal",
    );
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
  }, [user?.bankAccounts]);

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
    if (!userBankList?.length) {
      setAddBankModal(true);
    }
  }, [userBankList]);

  const formik = useFormik({
    initialValues: {
      amount: defaultAmount?.toString() || "",
      bank: "",
    },
    validationSchema: Yup.object().shape({
      bank: Yup.string().required("Bank is required"),
      amount: Yup.number()
        .transform((_, originalValue) =>
          originalValue === "" || isNaN(originalValue)
            ? undefined
            : Number(originalValue),
        )
        .moreThan(0, "Amount must be greater than 0")
        .max(
          maxWithdrawalLimit,
          `Amount exceeds your limit per withdrawal (xNGN ${maxWithdrawalLimit.toLocaleString()})`,
        )
        .test(
          "max-balance",
          `Amount cannot exceed your balance (xNGN ${formatter({}).format(
            userBalance,
          )})`,
          (value) => {
            if (value === undefined || value === null) return true;
            const numericValue = Number(value);
            if (Number.isNaN(numericValue)) return true; // let Yup handle required/number errors
            return numericValue <= userBalance;
          },
        )
        .required("Amount is required"),
    }),
    onSubmit: async (values) => {
      // Reset on every new submission attempt
      withdrawSubmitSuccessRef.current = false;

      const withdrawAmount =
        commissionData?.amountPaidOut || Number(values.amount);

      const payLoad = {
        amount: withdrawAmount,
        bankAccountId: values.bank,
      };

      await Withdraw_xNGN(payLoad)
        .then(async (res) => {
          if (res?.status === true && res?.statusCode === 200) {
            setWithdrawalData({
              referenceId: res.data.reference,
              withdrawalPin: "",
              twoFactorCode: "",
            });
            Toast.success(res.message, "Withdrawal Request");
            // Signal success so onClick can open the KYC / security modal
            withdrawSubmitSuccessRef.current = true;
          } else {
            Toast.error(res.message, "");
            setWithdrawalData({
              referenceId: "",
              withdrawalPin: "",
              twoFactorCode: "",
            });
            withdrawSubmitSuccessRef.current = false;
          }
        })
        .catch((err) => {
          Toast.error(err.error.message, "");
          setWithdrawalData({
            referenceId: "",
            withdrawalPin: "",
            twoFactorCode: "",
          });
          withdrawSubmitSuccessRef.current = false;
        });
    },
  });

  // SUB: Debounce the amount for commission API
  useEffect(() => {
    if (formik.errors.amount) return;

    const handler = setTimeout(() => {
      setDebouncedAmount(formik.values.amount);
    }, 800);

    return () => clearTimeout(handler);
  }, [formik.values.amount, formik.errors.amount]);

  const {
    data: commissionData,
    isLoading: commissionLoading,
    error: commissionError,
  } = useQuery<{
    commission: number;
    amountPaidOut: number;
    totalDebit: number;
  }>({
    queryKey: ["ngnCommission", debouncedAmount],
    queryFn: async () => await getNGNCommission(Number(debouncedAmount)),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: 2 * 60 * 60 * 1000, // 2 hours
    gcTime: 5 * 60 * 60 * 1000, // 5 hours
    enabled:
      debouncedAmount !== "" &&
      !Number.isNaN(Number(debouncedAmount)) &&
      Number(debouncedAmount) > 0 &&
      !formik.errors.amount,
  });

  const commissionFee = commissionData?.commission ?? 0;

  const handlCompleteWithdrawl = async () => {
    setWithdrawlLoading(true);

    const payLoad = {
      referenceId: withdrawalData.referenceId,
      withdrawalPin: withdrawalData.withdrawalPin,
      twoFactorCode: withdrawalData.twoFactorCode,
    };
    await Complete_Withdraw_xNGN(payLoad)
      .then((res) => {
        if (res?.status || res?.statusCode === 200) {
          setWithDrawalModal(false);
          setWithdrawlLoading(false);
          setProcessingModal(true);
        } else {
          Toast.error(res.message, "");
          setWithdrawalData({
            referenceId: "",
            withdrawalPin: "",
            twoFactorCode: "",
          });
          setWithDrawalModal(false);
          setWithdrawlLoading(false);
        }
      })
      .catch((err) => {
        Toast.error(err.message, "");
        setWithdrawalData({
          referenceId: "",
          withdrawalPin: "",
          twoFactorCode: "",
        });
        setWithDrawalModal(false);
        setWithdrawlLoading(false);
      });
  };

  return (
    <>
      <div className="mt-4">
        {userBankList?.length > 0 ? (
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
                  // defaultValue={defaultAmount?.toString() || ""}
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
                        (usedUpLimit?.totalUsedAmountFiat || 0),
                    ).endsWith("T")
                      ? "Unlimited"
                      : formatCompactNumber(
                          parseFloat(
                            usedUpLimit?.dailyFiatWithdrawalLimit || "0",
                          ) - (usedUpLimit?.totalUsedAmountFiat || 0),
                        )
                  }
                  fee={
                    !formik.values.amount || !formik.isValid || !commissionData
                      ? "-"
                      : commissionFee
                  }
                  amount={
                    formik.errors.amount || !formik.isValid || !commissionData
                      ? "-"
                      : formatter({ decimal: 2 }).format(
                          commissionData.amountPaidOut,
                        )
                  }
                  total={`${formatNumber(
                    !formik.values.amount || !formik.isValid || !commissionData
                      ? "-"
                      : commissionData.totalDebit,
                  )}`}
                  loading={commissionLoading}
                  error={commissionError}
                />
                <KycManager
                  action={ACTIONS.WITHDRAW_NGN}
                  preAction={async () => {
                    // formik.submitForm() always resolves to undefined because
                    // Formik's onSubmit is void-typed. We read the ref that
                    // onSubmit populates synchronously to know if the API succeeded.
                    await formik.submitForm();
                    return withdrawSubmitSuccessRef.current;
                  }}
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
                      type="button"
                      className="w-full"
                      text={"Withdraw"}
                      loading={formik.isSubmitting}
                      onClick={() => {
                        validateAndExecute();
                      }}
                      disabled={
                        !formik.isValid || !formik.dirty || commissionLoading
                        // !!commissionError
                      }
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
          transactionFee={`${commissionFee}`}
          withdrawalAmount={`${commissionData?.amountPaidOut ?? formik.values.amount}`}
          total={`${commissionData?.totalDebit ?? Number(formik.values.amount ?? 0)}`}
          submit={handlCompleteWithdrawl}
          isLoading={withdrawlLoading}
        />
      )}
      {processingModal && (
        <WithdrawalProcessingModal
          isOpen={processingModal}
          reference={withdrawalData.referenceId}
          approvalRequired={true}
          onComplete={() => {
            setProcessingModal(false);
            navigate(APP_ROUTES.WALLET.HOME);
          }}
        />
      )}
    </>
  );
};
