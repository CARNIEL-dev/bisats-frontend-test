import {
  PrimaryButton,
  WhiteTransparentButton,
} from "@/components/buttons/Buttons";
import PrimaryInput from "@/components/Inputs/PrimaryInput";
import ErrorDisplay from "@/components/shared/ErrorDisplay";
import SearchableDropdown from "@/components/shared/SearchableDropdown";
import Toast from "@/components/Toast";
import { getBankSchema } from "@/formSchemas";
import PreLoader from "@/layouts/PreLoader";
import {
  AddBankAccountForWithdrawal,
  EditBankAccountForWithdrawal,
  ResolveBankAccoutName,
  useGetBankList,
} from "@/redux/actions/walletActions";

import { useFormik } from "formik";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";

interface Props {
  mode: "add" | "edit";
  defaultBank?: TBank;
  close: () => void;
}

const WithdrawalBankAccount: React.FC<Props> = ({
  mode,
  defaultBank,
  close,
}) => {
  const userState: UserState = useSelector((state: any) => state.user);
  const user = userState.user;

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
    userId: user?.userId,
    enabled: Boolean(user?.userId),
  });

  // SUB: Bank List
  const banksList = useMemo(() => {
    if (!banks) return [];

    return banks.map((bank: Banks) => ({
      label: bank?.bank_name,
      value: bank?.bank_name,
    }));
  }, [banks]);

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
    validationSchema: getBankSchema({
      firstName: user?.firstName,
      middleName: user?.middleName,
      lastName: user?.lastName,
    }),
    onSubmit: async (values) => {
      const { ...payload } = values;
      if (mode === "add") {
        await AddBankAccountForWithdrawal({
          ...payload,
        }).then((res) => {
          if (res?.status) {
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
        }).then((res) => {
          if (res?.status) {
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
      userId: user?.userId,
      accountNumber,
      bankCode,
    })
      .then((res) => {
        if (res?.status) {
          formik.setFieldValue("accountName", res?.data?.account_name);
          formik.setFieldTouched("accountName", true, false);
        } else {
          formik.setFieldError("accountNumber", res?.message);
        }
      })
      .catch((err) => {
        formik.setFieldError("accountNumber", err?.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleSelectBank = (e: string) => {
    const selected = banks?.find((bank) => bank?.bank_name === e) ?? null;
    const value = {
      bankCode: selected?.bank_code ?? "",
      bankName: selected?.bank_name ?? "",
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
  }, [accountNumber, bankCode, isAcctNumberFocused]);

  return (
    <>
      <div className="mt-2">
        <h4 className="text-[#2B313B] text-[18px] lg:text-[22px] leading-[32px] font-semibold">
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
            <form onSubmit={formik.handleSubmit}>
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
                  // disabled
                  error={
                    formik.touched.accountName && formik.errors.accountName
                  }
                  touched={formik.touched.accountName}
                  onChange={() => {}}
                  info="Ensure your Bank Account Name matches exactly with your Account Name on Bisats"
                />
              </div>
              <div className="flex items-center gap-2 w-full mt-5">
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
                  type="submit"
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
