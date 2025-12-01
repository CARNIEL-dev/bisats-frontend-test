import { PrimaryButton } from "@/components/buttons/Buttons";
import PrimaryInput from "@/components/Inputs/PrimaryInput";
import TextBox from "@/components/shared/TextBox";
import TokenSelection from "@/components/shared/TokenSelection";
import Toast from "@/components/Toast";
import Head from "@/pages/wallet/Head";
import { GetUserInfo } from "@/redux/actions/userActions";
import { formatter } from "@/utils";
import { useFormik } from "formik";
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";

const TransferPage = () => {
  const [userInfo, setUserInfo] = useState<string | undefined>(undefined);
  const [showMoreDetails, setShowMoreDetails] = useState(false);
  const walletState: WalletState = useSelector((state: any) => state.wallet);
  const walletData = walletState.wallet;

  const formik = useFormik({
    initialValues: {
      recipientId: "",
      amount: "",
      asset: "",
    },
    onSubmit: async (values) => {
      if (!showMoreDetails && !userInfo) {
        console.log("Fetching more details");
        // Fetch and display more details about the recipient
        const res = await GetUserInfo({ searchParam: values.recipientId });
        if (res.status && res.data) {
          setUserInfo(`${res.data.firstName} ${res.data.lastName}`);
        } else {
          Toast.error("User not found", "Error");
        }

        return;
      }
      if (!showMoreDetails && userInfo) {
        console.log("Showing more details");
        setShowMoreDetails(true);
        return;
      }
      console.log(values);
    },
  });

  const walletBalance = useMemo(() => {
    if (!walletData || !formik.values.asset) return 0;
    return walletData[formik.values.asset] || 0;
  }, [formik.values.asset, walletData]);

  //   SUB: Determine button text
  const buttonText = useMemo(() => {
    let text = "Confirm Recipient";
    if (userInfo && !showMoreDetails) {
      text = "Continue";
    }
    if (showMoreDetails) {
      text = "Send";
    }

    return text;
  }, [showMoreDetails, userInfo]);

  const handleRecipientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    formik.handleChange(e);
    setUserInfo(undefined);
    setShowMoreDetails(false);
  };
  return (
    <div>
      <Head
        header={"Bisats Transfer"}
        subHeader={
          "Send tokens to other Bisats users directly from your Bisats account"
        }
      />
      <div className="mt-8">
        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-2">
          <PrimaryInput
            label="Recipient (Username or Email)"
            type="text"
            name="recipientId"
            value={formik.values.recipientId}
            onChange={handleRecipientChange}
            placeholder="Username or Email"
            error={formik.errors.recipientId}
            touched={formik.touched.recipientId}
            info={userInfo}
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
              />

              <div className="border  border-[#F3F4F6] bg-[#F9F9FB] rounded-md py-4 px-5  my-2 text-sm flex flex-col gap-2  ">
                <TextBox
                  label="Recipient"
                  value={userInfo || ""}
                  showIndicator={false}
                />
                <TextBox
                  label="Amount to be sent"
                  value={`${
                    formik.values.amount
                      ? formatter({
                          decimal:
                            formik.values.asset === "xNGN" || "USDT" ? 2 : 6,
                        }).format(Number(formik.values.amount))
                      : ""
                  } ${formik.values.asset}`}
                  showIndicator={false}
                />
              </div>
            </>
          )}
          <PrimaryButton
            type="submit"
            loading={formik.isSubmitting}
            text={buttonText}
            className="mt-2 w-full"
          />
        </form>
      </div>
    </div>
  );
};

export default TransferPage;
