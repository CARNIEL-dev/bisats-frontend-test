import { PrimaryButton } from "@/components/buttons/Buttons";
import { MultiSelectDropDown } from "@/components/Inputs/MultiSelectInput";
import PrimaryInput from "@/components/Inputs/PrimaryInput";
import Toast from "@/components/Toast";
import { APP_ROUTES } from "@/constants/app_route";
import { getUserTokenData, setDepositTranscBreakDown } from "@/helpers";
import Head from "@/pages/wallet/Head";
import { DepositTranscBreakDown } from "@/redux/actions/walletActions";
import { UserState } from "@/redux/reducers/userSlice";
import { useFormik } from "formik";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import CopyDisplay from "@/components/shared/CopyDisplay";
import TokenSelection from "@/components/shared/TokenSelection";
import KycManager from "@/pages/kyc/KYCManager";
import { formatter } from "@/utils";
import { ACTIONS, bisats_limit } from "@/utils/transaction_limits";
import * as Yup from "yup";

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
  const [isLoading, setIsLoading] = useState(false);
  const [selectedToken, setSelectedToken] = useState<string>(linkedAsset);
  const [networks, setNetworks] = useState<TNetwork[]>([]);
  const [proxyNetworks, setProxyNetworks] = useState<TProxyNetwork[]>([]);

  const [selectedNetwork, setSelectedNetworks] = useState<string>();

  const navigate = useNavigate();
  const user: UserState = useSelector((state: any) => state.user);

  const maxDeposit = useMemo(() => {
    return bisats_limit[user?.user?.accountLevel as keyof typeof bisats_limit]
      .max_deposit_per_transaction_fiat;
  }, [user?.user?.accountLevel]);

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

  const depositSchema = Yup.object().shape({
    amount: Yup.number()
      .transform((value, originalValue) => {
        if (originalValue === "" || isNaN(originalValue)) return undefined;
        return Number(originalValue);
      })
      .moreThan(0, "Amount must be greater than 0")

      .required("Amount is required")
      .test(
        "max-deposit",
        `Amount cannot exceed xNGN ${formatter({}).format(maxDeposit)}`,
        (value) => {
          if (!value) return true;
          const numericValue = Number(value);
          return numericValue <= maxDeposit;
        }
      ),
  });

  //   HDR: FORMIK
  const formik = useFormik({
    initialValues: { amount: "" },
    validationSchema: depositSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      const { ...payload } = values;
      const payloadd = {
        ...payload,
        userId: `${user?.user?.userId}`,
        amount: Number(payload.amount),
      };
      const response = await DepositTranscBreakDown(payloadd);
      setIsLoading(false);
      if (response.statusCode === 200) {
        setDepositTranscBreakDown(response.data);
        navigate(APP_ROUTES.WALLET.TRANSACTION_BREAKDOWN);
        return;
      } else {
        Toast.error(response.message, "Error");
        return;
      }
    },
  });

  const getAddress = useMemo(() => {
    for (let network of proxyNetworks) {
      if (selectedNetwork === network.value) {
        return network.address;
      }
    }
  }, [proxyNetworks, selectedNetwork]);

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
          }}
          value={selectedToken}
          placeholder="Select an asset"
        />
        {selectedToken === "xNGN" && (
          <div className="space-y-4 mt-2">
            <PrimaryInput
              className={"w-full"}
              label={"Amount"}
              placeholder="Enter amount"
              name="amount"
              type="number"
              error={formik.errors.amount}
              value={formik.values.amount}
              touched={formik.touched.amount}
              onChange={(e) => {
                formik.setFieldValue("amount", e.target.value);
              }}
            />
            <KycManager action={ACTIONS.DEPOSIT_NGN} func={formik.handleSubmit}>
              {(validateAndExecute) => (
                <PrimaryButton
                  className={"w-full"}
                  text={"Proceed"}
                  loading={isLoading}
                  onClick={validateAndExecute}
                />
              )}
            </KycManager>
          </div>
        )}

        {selectedToken && selectedToken !== "xNGN" && (
          <div>
            <div className="my-3">
              <MultiSelectDropDown
                parentId={""}
                value={selectedNetwork}
                placeholder="Select option"
                choices={networks}
                error={undefined}
                touched={undefined}
                label={"Select Network"}
                handleChange={(e) => setSelectedNetworks(e)}
              />
            </div>
            {getAddress && (
              <CopyDisplay
                title="Wallet Address"
                text={getAddress}
                placeholder="Please select a network"
              />
            )}
            <div className="lg:h-[88px]  border   border-[#F3F4F6] bg-[#F9F9FB] rounded-md py-3 px-5 flex items-start my-5 ">
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
                  stroke="#858FA5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8 5.33301V8.66634"
                  stroke="#858FA5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M7.99609 10.667H8.00208"
                  stroke="#858FA5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              <p className="text-[#606C82] text-[12px] leading-[16px] font-normal ml-2">
                Please confirm that you are depositing
                <span className="font-semibold ml-1 capitalize">
                  {selectedToken}
                </span>{" "}
                to this address on the{" "}
                <span className="font-semibold ml-1 capitalize">
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
