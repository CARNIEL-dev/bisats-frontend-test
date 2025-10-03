import { PrimaryButton } from "@/components/buttons/Buttons";
import { InputCheck } from "@/components/Inputs/CheckBox";
import ModalTemplate from "@/components/Modals/ModalTemplate";
import ErrorDisplay from "@/components/shared/ErrorDisplay";
import MaxWidth from "@/components/shared/MaxWith";
import Toast from "@/components/Toast";
import { AdSchema } from "@/formSchemas";
import PreLoader from "@/layouts/PreLoader";
import CreateAdDetails from "@/pages/p2p/ads/CreateAdDetails";
import { UpdateAdStatusResponse } from "@/pages/p2p/MyAds";
import { PriceData } from "@/pages/wallet/Assets";
import { UpdateAd } from "@/redux/actions/adActions";
import { useCryptoRates } from "@/redux/actions/walletActions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FormikConfig, useFormik } from "formik";
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

type Props = {
  userId: string;
  userTransactionLimits: { [key: string]: any };
  adDetail: AdsType;
  setMode: React.Dispatch<React.SetStateAction<boolean>>;
};
const EditAds = ({
  userId,
  userTransactionLimits,
  adDetail,
  setMode,
}: Props) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const walletState: WalletState = useSelector((state: any) => state.wallet);
  const walletData = walletState?.wallet;

  const [showConfirmModal, setShowConfirmModal] = useState(false);

  //SUB:  ===== For edit mode =====

  //SUB: Query function
  const {
    data: currencyRates,
    isFetching,
    isError,
  } = useCryptoRates({ isEnabled: Boolean(adDetail.id) });

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

  const amountAvailable = useMemo(() => {
    if (adDetail.type === "buy") {
      return Number(adDetail?.amountAvailable.toFixed(2));
    }
    return adDetail?.amountAvailable;
  }, [adDetail]);

  const defaultValues = useMemo(() => {
    return {
      type: adDetail.type === "buy" ? "Buy" : "Sell",
      priceType: adDetail.priceType,
      currency: adDetail.currency || "NGN",
      priceMargin: adDetail.priceMargin,
      asset: adDetail.asset,
      amount: adDetail.amountAvailable,
      amountToken: adDetail.amountAvailable,
      price: adDetail.price,
      minimumLimit: adDetail.minimumLimit,
      maximumLimit: adDetail.maximumLimit,
      priceUpperLimit: adDetail.priceUpperLimit,
      priceLowerLimit: adDetail.priceLowerLimit,
      agree: false,
    };
  }, [adDetail]);

  const mutation = useMutation<UpdateAdStatusResponse, Error, AdsPayload>({
    mutationFn: (payload: AdsPayload) => UpdateAd(payload),
    onSuccess: (_, variables) => {
      Toast.success("Ad created successfully", "Success");
      setMode(false);
      setShowConfirmModal(false);
      formik.resetForm();

      queryClient.invalidateQueries({
        queryKey: ["userAds", variables.userId],
      });
    },
    onError: (err) => {
      Toast.error(err.message || "Failed to create ad", "Failed");
    },
  });

  //SUB: Formik
  const formik = useFormik<IAdRequest>({
    initialValues: { ...defaultValues, agree: false },
    validateOnMount: false,
    validateOnBlur: true,
    validate: async (values) => {
      try {
        await AdSchema.validate(values, {
          abortEarly: false,
          context: {
            liveRate,
            userTransactionLimits,
            walletData,
            isEditMode: true,
            amountAvailable,
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
        userId,
        adId: adDetail.id,
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
    context: {
      liveRate,
      userTransactionLimits,
      walletData,
      isEditMode: true,
      amountAvailable,
    },
  } as FormikConfig<IAdRequest> & {
    context: {
      liveRate: Partial<PriceData>;
      userTransactionLimits: typeof userTransactionLimits;
      walletData: { [key: string]: any } | null;
      isEditMode: boolean;
      amountAvailable: number;
    };
  });

  return (
    <>
      <MaxWidth className="max-w-[38rem] mb-10 border py-4 px-6 rounded-2xl">
        <>
          {isFetching ? (
            <div className="flex items-center justify-center">
              <PreLoader primary={false} />
            </div>
          ) : isError ? (
            <div>
              <ErrorDisplay
                message="Couldn't fetch currency rates"
                showIcon={false}
                isError={false}
              />
            </div>
          ) : (
            <CreateAdDetails
              formik={formik}
              setStage={() => setShowConfirmModal(true)}
              wallet={walletState}
              liveRate={liveRate}
              editMode
            />
          )}
        </>
      </MaxWidth>
      {showConfirmModal && (
        <ModalTemplate onClose={() => setShowConfirmModal(false)}>
          <div>
            <h2 className="text-lg font-semibold">Update Ads</h2>
            <p className="text-sm text-gray-600">
              You are about to update this ads. Continue?
            </p>
            <div className="flex items-center gap-2 my-4">
              <InputCheck
                type="checkbox"
                name="agree"
                checked={formik.values.agree}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <span className="text-xs  text-gray-500">Accept changes</span>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <PrimaryButton
                text="Confirm"
                onClick={() => {
                  formik.validateForm();
                  formik.handleSubmit();
                }}
                loading={mutation.isPending}
                disabled={
                  !formik.isValid || mutation.isPending || !formik.values.agree
                }
              />
            </div>
          </div>
        </ModalTemplate>
      )}
    </>
  );
};

export default EditAds;
