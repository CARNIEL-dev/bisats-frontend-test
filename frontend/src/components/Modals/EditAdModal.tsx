import {
  PrimaryButton,
  WhiteTransparentButton,
} from "@/components/buttons/Buttons";
import PrimaryInput from "@/components/Inputs/PrimaryInput";
import ModalTemplate from "@/components/Modals/ModalTemplate";
import Toast from "@/components/Toast";
import { APP_ROUTES } from "@/constants/app_route";
import { UpdateAd } from "@/redux/actions/adActions";
import { UserState } from "@/redux/reducers/userSlice";
import { WalletState } from "@/redux/reducers/walletSlice";
import { formatNumber } from "@/utils/numberFormat";
import { AccountLevel, bisats_limit } from "@/utils/transaction_limits";
import { useFormik } from "formik";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";

import { UpdateAdStatusResponse } from "@/pages/p2p/MyAds";
import { cn, formatter } from "@/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Badge } from "../ui/badge";
import { getLivePrice } from "@/helpers";
import { convertAssetToNaira } from "@/utils/conversions";
import { PriceData } from "@/pages/wallet/Assets";
import Divider from "../shared/Divider";

interface Props {
  close: () => void;
  ad?: AdsTypes;
}

type TEditAd = {
  amount: string;
  price: string;
};

const EditAd: React.FC<Props> = ({ close, ad }) => {
  const initialAd: TEditAd = {
    amount: "",
    price: `${ad?.price}`,
  };
  const navigate = useNavigate();
  const walletState: WalletState = useSelector((state: any) => state.wallet);
  const userState: UserState = useSelector((state: any) => state.user);
  const user = userState.user;

  const account_level = user?.accountLevel as AccountLevel;
  const userTransactionLimits = bisats_limit[account_level];

  const liveRate = getLivePrice();

  const walletData = walletState?.wallet;
  const queryClient = useQueryClient();

  //   SUB: Calculate balance
  const calculateDisplayWalletBallance: number = useMemo(() => {
    if (ad?.type.toLowerCase() === "buy") {
      return walletData?.xNGN;
    } else {
      return walletData ? walletData?.[ad?.asset ?? "USDT"] : 0;
    }
  }, [ad?.asset, ad?.type, walletData]);

  const rate = convertAssetToNaira(
    ad?.asset as keyof PriceData,
    1,
    0,
    liveRate as PriceData
  );

  //   HDR: SCHEMA
  const AdSchema = Yup.object().shape({
    price: Yup.number()
      .min(1, "Price must be greater than 0")
      .required("Price is required"),
    amount: Yup.number()
      .moreThan(0, "Amount must be greater than 0")
      .test("max-amount-validation", function (value) {
        const { type } = this.parent; // Access the 'type' field from the form
        const maxAmount = userTransactionLimits?.maximum_ad_creation_amount;

        if (type === "buy") {
          // For buy transactions, just check against the max amount directly
          if (value || 0 > maxAmount) {
            return this.createError({
              message: `Amount must not exceed ${formatNumber(maxAmount)} xNGN`,
            });
          }
        } else if (type === "sell") {
          // For sell transactions, check the naira equivalent
          // Use your rate function here
          if (Number(rate) * (value || 0) > maxAmount) {
            return this.createError({
              message: `Amount must not exceed  ${formatNumber(
                maxAmount
              )} xNGN`,
            });
          }
        }

        return true;
      })
      .test(
        "max-wallet-balance",
        "Amount cannot exceed your current wallet balance",
        function (value) {
          return Number(value) <= calculateDisplayWalletBallance;
        }
      )
      .required("Amount is required"),
  });

  console.log();

  //HDR: Mutation function
  const mutation = useMutation<
    UpdateAdStatusResponse,
    Error,
    Partial<AdsPayload>
  >({
    mutationFn: (payload: Partial<AdsPayload>) => UpdateAd(payload),
    onSuccess: (info, variables) => {
      Toast.success(info?.message, "Ad Updated");
      close();
      navigate(APP_ROUTES.P2P.MY_ADS);
      queryClient.invalidateQueries({
        queryKey: ["userAds", variables.userId],
      });
    },
    onError: (err) => {
      Toast.error(err.message || "Failed to create ad", "Failed");
    },
  });

  const formik = useFormik<TEditAd & { type: string }>({
    initialValues: { ...initialAd, type: ad?.type ?? "Buy" },
    validationSchema: AdSchema,
    validateOnMount: false,
    onSubmit: (values) => {
      const payload = {
        userId: user?.userId ?? "",
        adId: ad?.id ?? "",
        amount: Number(values.amount),
        minimumLimit: Number(ad?.minimumLimit),
        maximumLimit: Number(ad?.maximumLimit),
        price: Number(values.price),
        priceType: ad?.priceType ?? "",
      };
      mutation.mutate(payload);
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
              error={formik.errors.price}
              touched={undefined}
              onChange={(e) => {
                const value = e.target.value;
                // Allow only digits
                const numericValue = value.replace(/\D/g, "");
                formik.setFieldValue("price", numericValue);
              }}
              defaultValue={formik.values.price}
            />
          </div>
          {ad?.type.toLowerCase() === "sell" && (
            <Divider
              text={`Previous Amount: ${formatter({ decimal: 5 }).format(
                ad?.amount || 0
              )} ${ad?.asset}`}
            />
          )}
          <div className="">
            {/* SUB: Top Amount */}
            <PrimaryInput
              css={"w-full py-2 "}
              label={"Top Up Amount"}
              error={formik.errors.amount}
              touched={formik.touched.amount}
              onChange={(e) => {
                const value = e.target.value;
                const isValidDecimal = /^(\d+(\.\d*)?|\.\d+)?$/.test(value);

                if (isValidDecimal) {
                  formik.setFieldValue(
                    "amount",
                    value === "" ? undefined : Number(value)
                  );
                }
              }}
            />
            <div className="flex flex-col gap-2 mt-4">
              <Badge variant={"success"}>
                Balance:{" "}
                {formatter({ decimal: 5 }).format(
                  ad?.type.toLowerCase() === "buy"
                    ? walletState?.wallet?.xNGN
                    : walletState?.wallet?.[ad?.asset ?? "USDT"]
                )}{" "}
                {ad?.type.toLowerCase() === "buy" ? "xNGN" : ad?.asset}
              </Badge>
              {ad?.type.toLowerCase() === "sell" && (
                <Badge variant={"secondary"}>
                  Market Price: {formatNumber(rate || 0)} NGN
                </Badge>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center w-full mt-4 gap-2">
          <WhiteTransparentButton
            text={"Edit Ad details"}
            loading={false}
            onClick={() => {
              navigate(APP_ROUTES.P2P.AD_DETAILS, {
                state: {
                  adDetail: ad,
                  mode: "edit",
                },
              });
            }}
            css=""
            style={{ width: "50%" }}
          />
          <PrimaryButton
            text={"Update Ad"}
            loading={mutation.isPending}
            css="w-1/2"
            onClick={formik.submitForm}
            disabled={mutation.isPending || !formik.dirty || !formik.isValid}
          />
        </div>
      </div>
    </ModalTemplate>
  );
};

export default EditAd;
