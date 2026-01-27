import {
  PrimaryButton,
  WhiteTransparentButton,
} from "@/components/buttons/Buttons";
import PrimaryInput from "@/components/Inputs/PrimaryInput";
import ErrorDisplay from "@/components/shared/ErrorDisplay";
import SearchableDropdown from "@/components/shared/SearchableDropdown";
import Toast from "@/components/Toast";
import { getBankSchema } from "@/formSchemas";
import useGetWallet from "@/hooks/use-getWallet";
import PreLoader from "@/layouts/PreLoader";
import { GetUserDetails } from "@/redux/actions/userActions";
import {
  AddBankAccountForWithdrawal,
  EditBankAccountForWithdrawal,
  ResolveBankAccoutName,
  useGetBankList,
} from "@/redux/actions/walletActions";
import { cn } from "@/utils";

import { useFormik } from "formik";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";

interface Props {
  mode: "add" | "edit" | "custom";
  defaultBank?: TBank;
  close: () => void;
  customSetValue?: (value: {
    accountNumber: string;
    accountName: string;
    bankName: string;
  }) => void;
}

const WithdrawalBankAccount: React.FC<Props> = ({
  mode,
  defaultBank,
  close,
  customSetValue,
}) => {
  const userState: UserState = useSelector((state: any) => state.user);
  const user = userState.user;
  const { refetchWallet } = useGetWallet();
  const [loading, setLoading] = useState(false);
  const [isAcctNumberFocused, setIsAcctNumberFocused] = useState(false);

  // prevent duplicate calls for the same pair
  const lastKeyRef = useRef<string | null>(null);

  // SUB: Query
  const {
    data: banks,
    isLoading,
    isError,
  } = useGetBankList({
    enabled: Boolean(user?.userId),
  });

  // SUB: Bank List
  const banksList = useMemo(() => {
    if (!banks) return [];

    return banks?.map((bank: Banks) => ({
      label: bank?.name,
      value: bank?.name,
    }));
  }, [banks]);

  const corporateName = useMemo(() => {
    const corporateName = user?.cooperateAccountVerificationRequest;
    if (!corporateName?.status || corporateName.status !== "approved")
      return "";
    return `${corporateName.businessName}`;
  }, [user]);

  const formik = useFormik({
    initialValues: {
      userId: user?.userId as string,
      accountNumber: defaultBank?.accountNumber || "",
      accountName: defaultBank?.accountName || "",
      bankCode: defaultBank?.bankCode || "",
      bankName: defaultBank?.bankName || "",
    },
    validateOnMount: false,
    validateOnChange: true,
    validationSchema:
      mode === "custom"
        ? undefined
        : getBankSchema({
            firstName: user?.firstName,
            middleName: user?.middleName,
            lastName: user?.lastName,
            businessName: corporateName,
          }),
    onSubmit: async (values) => {
      const { ...payload } = values;

      if (mode === "add") {
        await AddBankAccountForWithdrawal({
          ...payload,
        }).then(async (res) => {
          if (res?.status || res?.statusCode === 201) {
            await GetUserDetails({ userId: user?.userId, token: user?.token });
            refetchWallet();
            Toast.success(res.message, "Account Added");

            close();
          } else {
            Toast.error(res.message, "Failed");
          }
        });
      } else {
        await EditBankAccountForWithdrawal({
          ...payload,
          bankId: defaultBank?.id,
        }).then(async (res) => {
          if (res?.status) {
            await GetUserDetails({ userId: user?.userId, token: user?.token });
            refetchWallet();
            Toast.success(res.message, "Account Updated");
            close();
          } else {
            Toast.error(res.message, "Failed");
          }
        });
      }
    },
  });

  const validateAccountName = async ({
    accountNumber,
    bankCode,
  }: {
    accountNumber: string;
    bankCode: string;
  }) => {
    setLoading(true);
    await ResolveBankAccoutName({
      accountNumber,
      bankCode,
    })
      .then((res) => {
        // console.log("Resolve bank response ", res);
        if (res?.status) {
          formik.setFieldValue("accountName", res?.data?.account_name);
          formik.setFieldTouched("accountName", true, false);
        } else {
          formik.setFieldError("accountNumber", res?.message);
        }
      })
      .catch((err) => {
        // console.log("Resolve bank error ", err);
        formik.setFieldError("accountNumber", err?.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleSelectBank = (e: string) => {
    const selected = banks?.find((bank) => bank?.name === e) ?? null;
    const value = {
      bankCode: selected?.code ?? "",
      bankName: selected?.name ?? "",
    };
    formik.setFieldValue("bankCode", value.bankCode);
    formik.setFieldValue("bankName", value.bankName);
    setIsAcctNumberFocused(false);
  };

  //SUB: Run the account name resolve
  const accountNumber = (formik.values.accountNumber || "").replace(/\s/g, "");
  const bankCode = formik.values.bankCode || "";

  useEffect(() => {
    if (!isAcctNumberFocused) return;
    if (loading) return;
    if (!bankCode) return;
    if (accountNumber.length < 10) return;

    // avoid re-validating same (bankCode, accountNumber)
    const key = `${bankCode}:${accountNumber}`;
    if (lastKeyRef.current === key) return;
    lastKeyRef.current = key;

    validateAccountName({ accountNumber, bankCode });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountNumber, bankCode, isAcctNumberFocused]);

  useEffect(() => {
    if (mode === "custom" && customSetValue) {
      if (
        formik.values.accountNumber &&
        formik.values.bankName &&
        formik.values.accountName
      ) {
        customSetValue({
          accountNumber: formik.values.accountNumber,
          accountName: formik.values.accountName,
          bankName: formik.values.bankName,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formik.values, mode === "custom"]);

  return (
    <>
      <div className="mt-2">
        <h4
          className={cn(
            "text-[#2B313B] text-[18px] lg:text-[22px] leading-[32px] font-semibold",
            mode === "custom" && "hidden",
          )}
        >
          <span className="capitalize">{mode}</span> Withdrawal Bank Account
        </h4>
        <div>
          {isLoading ? (
            <div className="h-[23rem] grid place-content-center">
              <PreLoader primary={false} />
            </div>
          ) : isError ? (
            <div className="h-[23rem] grid place-content-center">
              <ErrorDisplay
                message="Failed to get bank list, try again later"
                isError={false}
                showIcon={false}
              />
            </div>
          ) : (
            <form
              onSubmit={mode === "custom" ? undefined : formik.handleSubmit}
            >
              <div className="my-5 space-y-2">
                <SearchableDropdown
                  items={banksList}
                  onChange={handleSelectBank}
                  label="Bank"
                  widthClass=""
                  align="start"
                  placeholder="Select Bank"
                  value={formik.values?.bankName ?? ""}
                  // error={"Select Bank"}
                  error={formik.errors.bankName ?? ""}
                />

                <PrimaryInput
                  className={"w-full "}
                  label={"Account Number"}
                  error={formik.errors.accountNumber ?? ""}
                  touched={formik.touched.accountNumber}
                  onChange={(e) => {
                    const value = e.target.value;
                    const numericValue = value.replace(/\D/g, "");
                    formik.setFieldValue("accountNumber", numericValue);
                  }}
                  value={formik.values.accountNumber}
                  onFocus={() => setIsAcctNumberFocused(true)}
                />

                <PrimaryInput
                  className={"w-full "}
                  label={"Account Name"}
                  loading={loading}
                  value={formik.values.accountName || ""}
                  readOnly
                  disabled
                  error={
                    formik.touched.accountName && formik.errors.accountName
                  }
                  touched={formik.touched.accountName}
                  onChange={() => {}}
                  info={
                    mode !== "custom"
                      ? "Ensure your Bank Account Name matches exactly with your Account Name on Bisats"
                      : undefined
                  }
                />
              </div>
              <div
                className={cn(
                  "flex items-center gap-2 w-full mt-5",
                  mode === "custom" && "hidden",
                )}
              >
                <WhiteTransparentButton
                  text={"Cancel"}
                  loading={false}
                  type="button"
                  onClick={() => close()}
                  className="w-[]"
                  style={{ width: "50%" }}
                />
                <PrimaryButton
                  text={mode === "edit" ? "Update Account" : "Save Account"}
                  loading={formik.isSubmitting}
                  className="w-1/2 "
                  type={mode === "custom" ? "button" : "submit"}
                  disabled={
                    formik.isSubmitting ||
                    !formik.isValid ||
                    !formik.dirty ||
                    loading
                  }
                />
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default WithdrawalBankAccount;
