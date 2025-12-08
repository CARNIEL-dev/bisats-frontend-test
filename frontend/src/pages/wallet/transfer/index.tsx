import { PrimaryButton } from "@/components/buttons/Buttons";
import Label from "@/components/Inputs/Label";
import PrimaryInput from "@/components/Inputs/PrimaryInput";
import ModalTemplate from "@/components/Modals/ModalTemplate";
import TextBox from "@/components/shared/TextBox";
import TokenSelection from "@/components/shared/TokenSelection";
import Toast from "@/components/Toast";
import { transferSchema } from "@/formSchemas";
import KycManager from "@/pages/kyc/KYCManager";
import Head from "@/pages/wallet/Head";
import { GetUserInfo } from "@/redux/actions/userActions";
import { GetWallet, transferToken } from "@/redux/actions/walletActions";
import { cn, formatter } from "@/utils";
import { ACTIONS } from "@/utils/transaction_limits";
import { FormikConfig, useFormik } from "formik";
import { useCallback, useMemo, useState } from "react";
import { ThreeDot } from "react-loading-indicators";
import { useSelector } from "react-redux";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import verifyBadge from "@/assets/icons/verification-badge.svg";
import envelope from "@/assets/icons/envelope.svg";

import { APP_ROUTES } from "@/constants/app_route";
import { buttonVariants } from "@/components/ui/Button";
import { useQueryClient } from "@tanstack/react-query";

type TransferFormValues = {
  recipient: string;
  amount: string;
  asset: string;
  note?: string;
};

const TransferPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const stateData = (location.state as any)?.data;
  const [searchParam] = useSearchParams();
  const [isTransferring, setIsTransferring] = useState(false);

  const [secureInfo, setSecureInfo] = useState({
    pin: "",
    code: "",
  });
  const [userInfo, setUserInfo] = useState<
    | {
        data: string;
        id: string;
      }
    | undefined
  >(undefined);
  const [showMoreDetails, setShowMoreDetails] = useState(false);
  const walletState: WalletState = useSelector((state: any) => state.wallet);
  const userState: UserState = useSelector((state: any) => state.user);
  const userData = userState.user;
  const walletData = walletState.wallet;

  const queryClient = useQueryClient();

  const isTransferSuccess = useMemo(() => {
    return searchParam.get("success") === "true";
  }, [searchParam]);

  const selfData = useMemo(() => {
    if (!userData || !walletData) return null;
    return [
      userData.email,
      userData.firstName,
      userData.lastName,
      userData.userName,
    ];
  }, [userData]);

  const formik = useFormik({
    initialValues: {
      recipient: "",
      amount: "",
      asset: "",
      note: "",
    },

    validate: (values) => {
      try {
        userInfo?.id &&
          showMoreDetails &&
          transferSchema.validateSync(values, {
            abortEarly: false,
            context: { walletBal: walletData },
          });
        return {};
      } catch (err: any) {
        const errors: Record<string, string> = {};
        if (err.inner) {
          err.inner.forEach((e: any) => {
            if (e.path) errors[e.path] = e.message;
          });
        }
        return errors;
      }
    },
    onSubmit: async (values) => {
      if (
        (!showMoreDetails && !userInfo?.id) ||
        (showMoreDetails && !userInfo?.id)
      ) {
        // Fetch and display more details about the recipient
        const res = await GetUserInfo({ searchParam: values.recipient });

        if (res.status && res.data) {
          if (
            (selfData && selfData.includes(res.data.lastName || "")) ||
            selfData?.includes(res.data.firstName || "")
          ) {
            Toast.error("You cannot transfer to yourself", "Error");
            return;
          }
          setUserInfo({
            data: `${res.data.firstName} ${res.data?.middleName || ""} ${
              res.data.lastName
            }`,
            id: res.data.userId,
          });
        } else {
          Toast.error("User not found", "Error");
        }

        return;
      }
      if (!showMoreDetails && userInfo?.id) {
        setShowMoreDetails(true);
        return;
      }
      const combinedValues = {
        amount: Number(values.amount),
        recipientId: userInfo?.id || "",
        note: values.note || "",
        asset: values.asset || "",
        withdrawalPin: secureInfo.pin || "",
        twoFactorCode: secureInfo.code || "",
      };

      setIsTransferring(true);
      const res = await transferToken(combinedValues);

      console.log("Responses from sending", res);
      if (res.statusCode === 200) {
        const dataInfo = { ...res.data, recipient: userInfo?.data || "" };
        await Promise.all([
          queryClient.refetchQueries({
            queryKey: ["userWalletHistory"],
            exact: false,
          }),
          queryClient.refetchQueries({
            queryKey: ["userNotifications"],
            exact: false,
          }),
          GetWallet(),
        ]).then(() => {
          Toast.success(res.message, "Success");
          navigate(`${APP_ROUTES.WALLET.TRANSFER}?success=true`, {
            replace: true,
            state: { data: dataInfo },
          });

          formik.resetForm();
        });
      } else {
        Toast.error(res.message, "Error");
      }
      setIsTransferring(false);
    },
    context: { walletBal: walletData },
  } as FormikConfig<TransferFormValues> & { context: { walletBal: typeof walletData } });

  // SUB: Determine wallet balance
  const walletBalance = useMemo(() => {
    if (!walletData || !formik.values.asset) return null;

    return walletData[formik.values.asset] || 0;
  }, [formik.values.asset, walletData]);

  //   SUB: Determine button text
  const buttonText = useMemo(() => {
    let text = "Confirm Recipient";
    if (userInfo?.id && !showMoreDetails) {
      text = "Continue";
    }
    if (showMoreDetails && !userInfo?.id) {
      text = "Confirm Recipient";
    }
    if (showMoreDetails && userInfo?.id) {
      text = "Send";
    }

    return text;
  }, [showMoreDetails, userInfo?.id]);

  // SUB: Handle recipient change
  const handleRecipientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    formik.handleChange(e);
    setUserInfo(undefined);
    // setShowMoreDetails(false);
  };

  // SUB: Handle final form submission
  const handleComplete = useCallback(
    (secureData?: Record<string, string>) => {
      setSecureInfo({
        pin: secureData?.pin || "",
        code: secureData?.code || "",
      });

      // Trigger form submission only if we're in the final stage
      if (userInfo?.id && showMoreDetails) {
        formik.submitForm();
      }
    },
    [userInfo, showMoreDetails, formik]
  );

  return (
    <>
      {isTransferring && (
        <ModalTemplate isOpen={true} onClose={() => {}} showCloseButton={false}>
          <div className="flex flex-col justify-center items-center py-6 px-5">
            <ThreeDot
              variant="bob"
              color="#32cd32"
              size="medium"
              text="Transferring..."
              textColor="#32cd32"
            />

            <p className="text-center text-gray-600 text-sm mt-4">
              Your transfer is being processed. Please wait a moment.
            </p>
          </div>
        </ModalTemplate>
      )}

      {isTransferSuccess ? (
        <div>
          <div className="flex flex-col items-center gap-2">
            <div className="relative size-[5rem]">
              <img src={verifyBadge} alt="badge" />
              <img
                src={envelope}
                alt="env"
                className="absolute bottom-2 -right-1"
              />
            </div>
            <h1 className="font-semibold text-lg md:text-2xl text-gray-800">
              Transfer Completed
            </h1>
            <p className="text-center text-gray-600 text-sm ">
              You have successfully sent{" "}
              {formatter({
                decimal:
                  stateData?.asset === "xNGN" || stateData?.asset === "USDT"
                    ? 2
                    : 6,
              }).format(Number(stateData?.amountPaidOut))}{" "}
              {stateData?.asset} to {stateData?.recipient}
            </p>
            <Link
              to={APP_ROUTES.WALLET.HOME}
              className={cn(
                buttonVariants({ size: "lg" }),
                "mt-6 text-sm w-[50%]"
              )}
            >
              Back to Wallet
            </Link>
          </div>
        </div>
      ) : (
        <div>
          <Head
            header={"Bisats Transfer"}
            subHeader={
              "Send tokens to other Bisats users directly from your Bisats account"
            }
          />
          <div className="mt-8">
            <form
              onSubmit={formik.handleSubmit}
              className="flex flex-col gap-2"
            >
              <PrimaryInput
                label="Recipient (Username or Email)"
                type="text"
                name="recipient"
                value={formik.values.recipient}
                onChange={handleRecipientChange}
                placeholder="Username or Email"
                error={formik.errors.recipient}
                touched={undefined}
                info={userInfo?.data}
                infoSuccess
              />
              {showMoreDetails && (
                <>
                  <TokenSelection
                    label="Select Asset"
                    value={formik.values.asset}
                    error={formik.errors.asset}
                    touched={undefined}
                    placeholder="Select asset"
                    handleChange={(val) => {
                      formik.setFieldValue("asset", val);
                    }}
                    variant="dialog"
                  />
                  <div>
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
                      name="amount"
                      maxFnc={() => {
                        if (walletBalance !== null) {
                          if (Number(walletBalance) <= 0) {
                            Toast.error("Insufficient balance", "Error");
                            return;
                          }
                          formik.setFieldValue(
                            "amount",
                            walletBalance.toString()
                          );
                        }
                      }}
                    />
                    <p className="text-sm font-semibold text-gray-600 mt-2  hidden">
                      <span className="font-normal text-gray-500">
                        Available :
                      </span>{" "}
                      {walletBalance !== null
                        ? formatter({
                            decimal:
                              formik.values.asset === "xNGN" || "USDT" ? 2 : 6,
                          }).format(Number(walletBalance)) +
                          " " +
                          formik.values.asset
                        : "-"}
                    </p>
                  </div>

                  <div>
                    <Label text="Note (Optional)" />
                    <textarea
                      className="w-full mt-1.5 p-3 border  rounded-md focus:outline-none focus:ring-1 focus:ring-[#C49600] focus:border-transparent resize-none h-24 placeholder:text-sm font-normal text-[#606C82]"
                      placeholder="Add a note for the recipient (optional)"
                      value={formik.values.note}
                      onChange={(e) =>
                        formik.setFieldValue("note", e.target.value)
                      }
                    />
                  </div>

                  <div className="border  border-[#F3F4F6] bg-[#F9F9FB] rounded-md py-4 px-5  my-2 text-sm flex flex-col gap-2  ">
                    <TextBox
                      label="Recipient"
                      value={userInfo?.data || ""}
                      showIndicator={false}
                    />
                    <TextBox
                      label="Amount to be sent"
                      value={`${
                        walletBalance > 0 && formik.values.amount
                          ? formatter({
                              decimal:
                                formik.values.asset === "xNGN" || "USDT"
                                  ? 2
                                  : 6,
                            }).format(Number(formik.values.amount))
                          : ""
                      } ${formik.values.asset}`}
                      showIndicator={false}
                    />
                  </div>
                </>
              )}
              {userInfo && showMoreDetails ? (
                <KycManager
                  action={ACTIONS.TRANSFER}
                  func={handleComplete}
                  isManual
                >
                  {(validateAndExecute) => (
                    <PrimaryButton
                      type="button"
                      loading={formik.isSubmitting}
                      text={buttonText}
                      className="mt-2 w-full"
                      disabled={!formik.isValid}
                      onClick={validateAndExecute}
                    />
                  )}
                </KycManager>
              ) : (
                <PrimaryButton
                  type="submit"
                  loading={formik.isSubmitting}
                  text={buttonText}
                  className="mt-2 w-full"
                />
              )}
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default TransferPage;
