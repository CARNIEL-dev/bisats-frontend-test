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
import { cn } from "@/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";

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
          return Number(value) <= calculateDisplayWalletBallance;
        }
      )
      .when("type", {
        is: (val: string) => val?.toLowerCase() === "buy",
        then: (schema) => schema.required("Amount is required"),
        otherwise: (schema) => schema.notRequired(),
      })
      .required("Amount is required"),
  });

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

  const formik = useFormik<TEditAd>({
    initialValues: { ...initialAd },
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
          <div className="space-y-1">
            {/* SUB: Top Amount */}
            <PrimaryInput
              css={"w-full py-2 "}
              label={"Top Up Amount"}
              error={formik.errors.amount}
              touched={undefined}
              onChange={(e) => {
                const value = e.target.value;
                // Allow only digits
                const numericValue = value.replace(/\D/g, "");

                formik.setFieldValue("amount", numericValue);
              }}
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

          {/* <div className="mb-4 ">
         
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
          </div> */}
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
