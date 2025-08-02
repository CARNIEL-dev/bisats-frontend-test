import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PriceData } from "@/pages/wallet/Assets";
import { GetLivePrice } from "@/redux/actions/walletActions";
import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { WalletState } from "@/redux/reducers/walletSlice";
import { useSelector } from "react-redux";
import { FormikConfig, useFormik } from "formik";
import Toast from "@/components/Toast";
import { AdSchema } from "@/formSchemas";
import CreateAdDetails from "@/pages/p2p/ads/CreateAdDetails";
import MaxWidth from "@/components/shared/MaxWith";
import { UpdateAdStatusResponse } from "@/pages/p2p/MyAds";
import { UpdateAd } from "@/redux/actions/adActions";
import { APP_ROUTES } from "@/constants/app_route";
import ModalTemplate from "@/components/Modals/ModalTemplate";
import { PrimaryButton } from "@/components/buttons/Buttons";
import { InputCheck } from "@/components/Inputs/CheckBox";

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

  const [tokenLivePrices, setTokenLivePrices] = useState<PriceData>();
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  //SUB:  ===== For edit mode =====
  useEffect(() => {
    const fetchPrices = async () => {
      const prices = await GetLivePrice();
      setTokenLivePrices(prices);
    };

    fetchPrices();
  }, []);

  const defaultValues = useMemo(() => {
    return {
      type: adDetail.type === "buy" ? "Buy" : "Sell",
      priceType: adDetail.priceType,
      currency: adDetail.currency || "NGN",
      priceMargin: adDetail.priceMargin,
      asset: adDetail.asset,
      amount: adDetail.amount,
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
            liveRate: tokenLivePrices,
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
    context: { liveRate: tokenLivePrices, userTransactionLimits, walletData },
  } as FormikConfig<IAdRequest> & { context: { liveRate: PriceData; userTransactionLimits: typeof userTransactionLimits; walletData: { [key: string]: any } | null } });
  return (
    <>
      <MaxWidth className="max-w-[38rem] mb-10 border py-4 px-6 rounded-2xl">
        <CreateAdDetails
          formik={formik}
          setStage={() => setShowConfirmModal(true)}
          wallet={walletState}
          liveRate={tokenLivePrices}
        />
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
              {/* <SecondaryButton
                text="Cancel"
                onClick={() => setShowConfirmModal(false)}
              /> */}
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
