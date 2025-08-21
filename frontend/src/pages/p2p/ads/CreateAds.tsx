import { FormikConfig, FormikProps, useFormik } from "formik";
import { useMemo, useState, useTransition } from "react";
import { useSelector } from "react-redux";
import * as Yup from "yup";

import { PrimaryButton } from "@/components/buttons/Buttons";
import BackButton from "@/components/shared/BackButton";
import ErrorDisplay from "@/components/shared/ErrorDisplay";
import MaxWidth from "@/components/shared/MaxWith";
import Toast from "@/components/Toast";
import { APP_ROUTES } from "@/constants/app_route";
import { AdSchema } from "@/formSchemas";
import PreLoader from "@/layouts/PreLoader";
import AdReview from "@/pages/p2p/ads/AdReview";
import CreateAdDetails from "@/pages/p2p/ads/CreateAdDetails";
import HeaderTabs from "@/pages/p2p/ads/HeaderTabs";
import { PriceData } from "@/pages/wallet/Assets";
import Head from "@/pages/wallet/Head";
import { CreateAds, useCryptoRates } from "@/redux/actions/walletActions";

import { AccountLevel, bisats_limit } from "@/utils/transaction_limits";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { UpdateAdStatusResponse } from "../MyAds";

export type TNetwork = {
  label: string;
  value: string;
};

const initialAd: IAdRequest = {
  type: "Buy",
  asset: "USDT",
  amount: undefined,
  amountToken: undefined,
  priceType: "Static",
  price: undefined,
  currency: "NGN",
  priceMargin: 0.0,
  minimumLimit: undefined,
  maximumLimit: undefined,
  priceUpperLimit: undefined,
  priceLowerLimit: undefined,
  agree: false,
};

export interface AdsProps {
  formik: FormikProps<IAdRequest>;
  setStage: React.Dispatch<React.SetStateAction<"details" | "review">>;
  liveRate?: Partial<PriceData>;
  wallet?: WalletState;
}

const CreateAd = () => {
  const [isPending, startTransition] = useTransition();
  const [stage, setStage] = useState<"details" | "review">("details");
  // const [fetching, setIsFetching] = useState(true);
  const user: UserState = useSelector((state: any) => state.user);
  const userr = user.user;
  const account_level = userr?.accountLevel as AccountLevel;
  const userTransactionLimits = bisats_limit[account_level];

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const walletState: WalletState = useSelector((state: any) => state.wallet);
  const walletData = walletState?.wallet;

  const [currentSchema, setCurrentSchema] =
    useState<Yup.ObjectSchema<any>>(AdSchema);

  //SUB: Query function
  const {
    data: currencyRates,
    isFetching: fetching,
    isError,
  } = useCryptoRates({ isEnabled: Boolean(user) });

  const liveRate = useMemo(() => {
    return {
      xNGN:
        (currencyRates?.tether?.usd || 0) * (currencyRates?.tether?.ngn || 0),
      BTC: currencyRates?.bitcoin?.ngn ?? 0,
      ETH: currencyRates?.ethereum?.ngn ?? 0,
      SOL: currencyRates?.solana?.ngn ?? 0,
      USDT: currencyRates?.tether?.ngn ?? 0,
    };
  }, [currencyRates]);

  const mutation = useMutation<UpdateAdStatusResponse, Error, AdsPayload>({
    mutationFn: (payload: AdsPayload) => CreateAds(payload),
    onSuccess: (_, variables) => {
      Toast.success("Ad created successfully", "Success");
      startTransition(() => {
        queryClient.invalidateQueries({
          queryKey: ["userNotifications", variables.userId],
          exact: true,
          refetchType: "all",
        });
        queryClient
          .invalidateQueries({
            queryKey: ["userAds", variables.userId],
            exact: true,
            refetchType: "all",
          })
          .then(() => {
            navigate(APP_ROUTES.P2P.MY_ADS);
          });
      });
    },
    onError: (err) => {
      Toast.error(err.message || "Failed to create ad", "Failed");
    },
  });

  //SUB: Formik
  const formik = useFormik<IAdRequest>({
    initialValues: { ...initialAd, agree: false },
    validateOnMount: false,
    validateOnBlur: true,
    validateOnChange: true,
    validate: async (values) => {
      try {
        await currentSchema.validate(values, {
          abortEarly: false,
          context: {
            liveRate,
            userTransactionLimits,
            walletData,
          },
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
    onSubmit: (values) => {
      if (!values.agree) {
        Toast.error("Agree to the terms of use", "Agree to the terms");
        return;
      }

      const payload = {
        userId: user?.user?.userId ?? "",
        asset: values.asset,
        type: values.type.toLowerCase(),
        amount: Number(
          values.type.toLowerCase() === "buy"
            ? values.amount
            : values?.amountToken
        ),
        minimumLimit: Number(values.minimumLimit),
        maximumLimit: Number(values.maximumLimit),
        priceType: values.priceType.toLowerCase(),
        price: Number(values.price),
        priceMargin: Number(values.priceMargin ?? 0),
        priceUpperLimit: Number(values.priceUpperLimit),
        priceLowerLimit: Number(values.priceLowerLimit),
      };
      mutation.mutate(payload);
    },
    context: { liveRate, userTransactionLimits, walletData },
  } as FormikConfig<IAdRequest> & {
    context: {
      liveRate: Partial<PriceData>;
      userTransactionLimits: typeof userTransactionLimits;
      walletData: { [key: string]: any } | null;
    };
  });

  return (
    <MaxWidth className="max-w-[45rem] min-h-[90dvh] flex flex-col gap-6 mb-20">
      <BackButton />
      <Head
        header="Create an Ad"
        subHeader="Buy or sell assets with your own preferred price."
      />
      <HeaderTabs activePage={stage} setStage={setStage} />

      {fetching ? (
        <PreLoader />
      ) : isError ? (
        <div className="h-[12rem] text-gray-400 text-sm flex items-center justify-center">
          <ErrorDisplay
            message="Failed to fetch live rate. Please try again"
            isError={false}
            showIcon={false}
          />
        </div>
      ) : (
        <form className="" method="POST">
          {stage === "details" ? (
            <CreateAdDetails
              formik={formik}
              setStage={setStage}
              wallet={walletState}
              liveRate={liveRate}
            />
          ) : (
            <>
              <AdReview formik={formik} setStage={setStage} />
              <PrimaryButton
                className="w-full disabled"
                type="button"
                text="PublishAd"
                loading={mutation.isPending || isPending}
                disabled={
                  !(formik.values.agree && formik.isValid) ||
                  mutation.isPending ||
                  isPending
                }
                onClick={() => {
                  const newSchema =
                    formik.values.type.toLowerCase() === "buy"
                      ? AdSchema.omit(["amountToken"])
                      : AdSchema.omit(["amount"]);
                  setCurrentSchema(newSchema);
                  formik.validateForm(); // force validation with new schema
                  formik.handleSubmit();
                }}
              />
            </>
          )}
        </form>
      )}
    </MaxWidth>
  );
};

export default CreateAd;
