import { APP_ROUTES } from "@/constants/app_route";
import { UpdateAd } from "@/redux/actions/adActions";
import { UserState } from "@/redux/reducers/userSlice";
import { WalletState } from "@/redux/reducers/walletSlice";
import { formatNumber } from "@/utils/numberFormat";
import { AccountLevel, bisats_limit } from "@/utils/transaction_limits";
import { useFormik } from "formik";
import { Info } from "lucide-react";
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import {
  PrimaryButton,
  WhiteTransparentButton,
} from "@/components/buttons/Buttons";
import PrimaryInput from "@/components/Inputs/PrimaryInput";
import Toast from "@/components/Toast";
import ModalTemplate from "@/components/Modals/ModalTemplate";
import { IAd } from "@/components/Modals/TableActionMenu";

import Divider from "../shared/Divider";
import { cn } from "@/utils";

interface Props {
  close: () => void;
  ad?: IAd;
}

type TEditAd = {
  minimumLimit: string;
  maximumLimit: string;
  priceUpperLimit: string;
  priceLowerLimit: string;
  amount: string;
  price: string;
  agree?: boolean;
};

const EditAd: React.FC<Props> = ({ close, ad }) => {
  const [amount, setAmount] = useState(`${ad?.amount}`);
  const [price, setPrice] = useState(`${ad?.price}`);

  const initialAd: TEditAd = {
    amount: `${ad?.amount}`,
    price: `${ad?.price}`,
    minimumLimit: ad?.minimumLimit ?? "0",
    maximumLimit: ad?.maximumLimit ?? "0",
    priceUpperLimit: ad?.priceUpperLimit ?? "0",
    priceLowerLimit: ad?.priceLowerLimit ?? "0",
  };
  const navigate = useNavigate();
  const walletState: WalletState = useSelector((state: any) => state.wallet);
  const userState: UserState = useSelector((state: any) => state.user);
  const user = userState.user;

  const account_level = user?.accountLevel as AccountLevel;
  const userTransactionLimits = bisats_limit[account_level];

  const walletData = walletState?.wallet;

  //   SUB: Calculate balance
  const calculateDisplayWalletBallance: number = useMemo(() => {
    if (ad?.type.toLowerCase() === "buy") {
      return walletData?.xNGN;
    } else {
      return walletData ? walletData?.[ad?.asset ?? "USDT"] : 0;
    }
  }, [ad?.asset, ad?.type, walletData]);

  //   HDR: SCHEMA
  const AdSchema = Yup.object().shape({
    price: Yup.number()
      .min(1, "Price must be greater than 0")
      .required("Price is required"),
    amount: Yup.number()
      .min(1, "Amount must be greater than 0")
      .max(
        userTransactionLimits?.maximum_ad_creation_amount,
        `Amount must not exceed ${formatNumber(
          userTransactionLimits?.maximum_ad_creation_amount
        )} xNGN`
      )
      .test(
        "max-wallet-balance",
        "Amount cannot exceed your current wallet balance",
        function (value) {
          if (typeof value !== "number") return false;
          return value <= calculateDisplayWalletBallance;
        }
      )
      .when("type", {
        is: (val: string) => val?.toLowerCase() === "buy",
        then: (schema) => schema.required("Amount is required"),
        otherwise: (schema) => schema.notRequired(),
      }),

    minimumLimit: Yup.number()
      .min(15000, "Minimum must be greater than 15,000 xNGN")
      .max(23000000, "Price must not exceed 23,000,000 xNGN")
      .required()
      .required("Minimum is required"),

    maximumLimit: Yup.number()
      .min(15000, "Maximum must be greater than Minimum")
      .max(23000000, "Price must not exceed 23,000,000 xNGN")
      .required(),
  });

  const [isLoading, setIsLoading] = useState(false);

  const formik = useFormik<TEditAd>({
    initialValues: { ...initialAd, agree: false },
    validationSchema: AdSchema,
    validateOnMount: false,
    onSubmit: async (values) => {
      setIsLoading(true);

      try {
        const payload = {
          userId: user?.userId ?? "",
          adId: ad?.id ?? "",
          amount: Number(values.amount),
          minimumLimit: Number(values.minimumLimit),
          maximumLimit: Number(values.maximumLimit),
          price: Number(values.price),
          priceType: ad?.priceType ?? "",
          priceMargin: ad?.priceMargin,
        };

        const response = await UpdateAd(payload);

        if (response?.status) {
          Toast.success(response?.message, "Add Updated");
          close();
          navigate(APP_ROUTES.P2P.MY_ADS);
        } else {
          Toast.error(response.message, "Failed to update");
        }
      } catch (error) {
        Toast.error("Failed to create ad", "Error");
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <ModalTemplate onClose={close}>
      <div className="relative ">
        <p className="text-[#455062] text-[18px] lg:text-[22px] leading-[32px] font-semibold">
          Edit Ad
        </p>
        <div className="my-3">
          <div
            className={cn(
              "h-fit border  border-[#F3F4F6] bg-[#F9F9FB] rounded-md py-2 px-3 my-2 text-xs flex flex-col gap-1.5 w-full ",
              ad?.type.toLowerCase() === "buy"
                ? "bg-green-600/50"
                : "bg-red-600/50"
            )}
          >
            <div className="flex justify-between items-start  text-wrap w-full">
              <p className={cn(" capitalize font-bold")}>{ad?.type} Ad</p>
              <p className="font-semibold  text-right w-1/2 break-all ">
                NGN/{ad?.asset}
              </p>
            </div>
            <div className="flex justify-between items-start text-wrap w-full">
              <p className=" font-bold ">Ad Price</p>
              <p className=" font-semibold  text-right w-1/2 break-all ">
                {formatNumber(ad?.price ?? 0)}/NGN
              </p>
            </div>
          </div>

          <div className="my-3">
            <PrimaryInput
              css={"w-full py-2 "}
              label={" Price"}
              error={undefined}
              touched={undefined}
              onChange={(e) => {
                const value = e.target.value;
                // Allow only digits
                const numericValue = value.replace(/\D/g, "");
                setPrice(numericValue);
                formik.setFieldValue("price", numericValue);
              }}
              value={price}
            />
          </div>
          <div className="space-y-1">
            {/* SUB: Top Amount */}
            <PrimaryInput
              css={"w-full py-2 "}
              label={"Top Up Amount"}
              error={undefined}
              touched={undefined}
              onChange={(e) => {
                const value = e.target.value;
                // Allow only digits
                const numericValue = value.replace(/\D/g, "");
                setAmount(numericValue);
                formik.setFieldValue("amount", numericValue);
              }}
              // value={amount}
            />
            {ad?.type.toLowerCase() === "buy" ? (
              <small className="text-[#606C82] text-[12px] font-normal">
                Balance: {formatNumber(walletState?.wallet?.xNGN)} xNGN
              </small>
            ) : (
              <small className="text-[#606C82] text-[12px] font-normal">
                Balance: {walletState?.wallet?.[ad?.asset ?? "USDT"]}{" "}
                {ad?.asset}
              </small>
            )}
          </div>

          <div className="mb-4">
            {/* SUB: Divider */}
            <Divider text="Limits (in NGN)" />
            <div className="flex flex-col md:flex-row gap-2  justify-between ">
              <PrimaryInput
                css="p-2.5"
                label={`Min (xNGN${
                  ad?.type === "buy"
                    ? formatNumber(userTransactionLimits?.lower_limit_buy_ad)
                    : formatNumber(userTransactionLimits?.lower_limit_sell_ad)
                })`}
                placeholder="0"
                name="minimumLimit"
                min={
                  ad?.type === "buy"
                    ? userTransactionLimits?.lower_limit_buy_ad
                    : userTransactionLimits?.lower_limit_sell_ad
                }
                error={formik.errors.minimumLimit}
                value={formik.values.minimumLimit}
                touched={formik.touched.minimumLimit}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*$/.test(value)) {
                    formik.setFieldValue(
                      "minimumLimit",
                      value === "" ? 0 : Number(value)
                    );
                  }
                }}
              />
              <PrimaryInput
                css="w-full p-2.5"
                label={`Max (xNGN  ${formatNumber(
                  ad?.type === "buy"
                    ? userTransactionLimits?.upper_limit_buy_ad
                    : userTransactionLimits?.upper_limit_sell_ad
                )})`}
                placeholder="0"
                name="maximumLimit"
                max={
                  ad?.type === "buy"
                    ? userTransactionLimits?.upper_limit_buy_ad
                    : userTransactionLimits?.upper_limit_sell_ad
                }
                error={formik.errors.maximumLimit}
                value={formik.values.maximumLimit}
                touched={formik.touched.maximumLimit}
                maxFnc={() =>
                  formik.setFieldValue(
                    "maximumLimit",
                    ad?.type === "buy"
                      ? ad?.amountAvailable
                      : Number(ad?.amountFilled) * Number(ad?.price)
                  )
                }
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*$/.test(value)) {
                    formik.setFieldValue(
                      "maximumLimit",
                      value === "" ? 0 : Number(value)
                    );
                  }
                }}
              />
            </div>
            <p>
              <Info color="#17A34A" size={12} className="inline mr-1" />
              <span className="text-[#515B6E] text-xs font-light">
                Set limits to control the size of transactions for this ad.
              </span>
            </p>
          </div>
        </div>
        <div className="flex items-center w-full mt-4 gap-2">
          <WhiteTransparentButton
            text={"Cancel"}
            loading={false}
            onClick={close}
            css=""
            style={{ width: "50%" }}
          />
          <PrimaryButton
            text={"Update Ad"}
            loading={isLoading}
            css="w-1/2"
            onClick={formik.submitForm}
          />
        </div>
      </div>
    </ModalTemplate>
  );
};

export default EditAd;
