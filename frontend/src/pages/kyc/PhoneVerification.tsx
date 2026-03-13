import PrimaryInput from "@/components/Inputs/PrimaryInput";
import Toast from "@/components/Toast";
import { PrimaryButton } from "@/components/buttons/Buttons";
import ResendCodeButton from "@/components/shared/ResendCodeButton";
import { APP_ROUTES } from "@/constants/app_route";
import { getPhoneSchema, VerificationSchema } from "@/formSchemas";
import OtherSide from "@/layouts/auth/OtherSide";
import {
  GetUserDetails,
  PostPhoneNumber_KYC,
  Resend_OTP_PhoneNumber_KYC,
  Verify_OTP_PhoneNumber_KYC,
} from "@/redux/actions/userActions";
import { countryDataForPhone } from "@/utils/data";
import { useFormik } from "formik";
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Flag from "react-world-flags";

import { SelectDropDown } from "@/components/Inputs/MultiSelectInput";

const verficationScreen = false;

const PhoneVerifcation = () => {
  const user: UserState = useSelector((state: any) => state.user);

  // const isWaitingForVerification =
  //   user?.user?.phoneNumber && !user?.user?.phoneNumberVerified;

  const [selectedCountry, setSelectedCountry] = useState("NG");
  // const [verficationScreen, setVerificationScreen] = useState(false);
  const navigate = useNavigate();

  // Dial code for the selected country
  const countryCode = useMemo(() => {
    const country = countryDataForPhone.find((c) => c.code === selectedCountry);
    return country?.dialCode || "234";
  }, [selectedCountry]);

  // Max national subscriber digits for the selected country (for HTML maxLength)
  const maxNationalLength = useMemo(() => {
    return (
      countryDataForPhone.find((c) => c.code === selectedCountry)
        ?.maxNationalLength ?? 15
    );
  }, [selectedCountry]);

  // Country-aware validation schema — re-built whenever the country changes
  const phoneSchema = useMemo(
    () => getPhoneSchema(selectedCountry),
    [selectedCountry],
  );

  const listOptions = useMemo(() => {
    return countryDataForPhone.slice(0, 4).map((country) => ({
      value: country.code,
      label: (
        <>
          <div className="flex items-center gap-1.5 w-full">
            {country.code && (
              <Flag
                code={country.code}
                style={{
                  width: "15px",
                  height: "18px",
                }}
              />
            )}
            <span className="text-muted-foreground text-sm">
              + {country.dialCode}
            </span>
          </div>
        </>
      ),
    }));
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countryDataForPhone]);

  const formik1 = useFormik({
    initialValues: { code: "" },
    validationSchema: VerificationSchema,
    onSubmit: async (values) => {
      const payload = {
        userId: user.user?.userId ?? "",
        code: values.code ?? "",
      };
      const response = await Verify_OTP_PhoneNumber_KYC(payload);

      if (response?.status) {
        Toast.success(response.message, "Phone number verified");
        GetUserDetails({
          userId: user?.user?.userId!,
          token: user?.user?.token!,
        });
        navigate(APP_ROUTES.KYC.PERSONAL);
      } else {
        Toast.error(response.message, "Verification failed");
      }
    },
  });

  const formik = useFormik({
    initialValues: { phone: "" },
    validationSchema: phoneSchema,
    onSubmit: async (values) => {
      // Assemble E.164 format: +<dialCode><nationalNumber>
      const nationalDigits = values.phone.replace(/\D/g, "");

      // 2. Remove the leading zero if it exists
      const sanitizedNumber = nationalDigits.replace(/^0+/, "");
      const payload = {
        userId: user.user?.userId ?? "",
        phoneNumber: `+${countryCode}${sanitizedNumber}`,
        countryCode,
      };

      const response = await PostPhoneNumber_KYC(payload);

      if (response?.statusCode === 200) {
        // setVerificationScreen(true);
        GetUserDetails({
          userId: user?.user?.userId!,
          token: user?.user?.token!,
        });
        navigate(APP_ROUTES.KYC.PERSONAL);
      } else {
        Toast.error(response.message, "Failed");
      }
    },
  });

  const resendOTP = async () => {
    const response = await Resend_OTP_PhoneNumber_KYC(user?.user?.userId);
    if (response?.status) {
      Toast.success(response.message, "OTP Sent");
      return true;
    } else {
      Toast.error(response.message, "");
      return false;
    }
  };

  return (
    <div className="sm:w-[80%] mx-auto">
      <div className=" py-24 px-5">
        <OtherSide
          header="Verify your Phone number"
          subHeader="We need your phone number to authenticate your details and secure your account"
          upperSubHeader={
            <>
              <p className="text-[14px] text-[#707D96] leading-[24px] font-semibold text-left flex items-center cursor-pointer mb-2">
                Bisats KYC Verification
              </p>
            </>
          }
        />
        {verficationScreen ? (
          <>
            <div className="w-full mt-10">
              <form onSubmit={formik1.handleSubmit}>
                <PrimaryInput
                  type="code"
                  name="code"
                  label="Code"
                  className="w-full h-[48px] px-3 outline-hidden "
                  error={formik1.errors.code}
                  touched={formik1.touched.code}
                  value={formik1.values.code}
                  onChange={formik1.handleChange}
                  onBlur={formik1.handleBlur}
                />
                <div className="w-full my-3">
                  <PrimaryButton
                    className={"w-full"}
                    text={"Enter code"}
                    loading={formik1.isSubmitting}
                    type="submit"
                    disabled={formik1.isSubmitting || !formik1.isValid}
                  />
                </div>
              </form>

              <ResendCodeButton
                onClick={resendOTP}
                defaultTime={30} // in seconds
                text="Resend OTP"
              />
            </div>
          </>
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <div className="w-full mt-10">
              <div className="w-full  relative">
                <SelectDropDown
                  onChange={(val) => {
                    setSelectedCountry(val);
                    // Clear the phone field whenever the country changes
                    formik.setFieldValue("phone", "", false);
                    formik.setFieldTouched("phone", false, false);
                  }}
                  options={listOptions}
                  defaultValue={selectedCountry}
                  className="w-fit z-10  !bg-transparent cursor-pointer px-1  py-0 border rounded-md absolute top-2/3 -translate-y-1/2 left-1 !h-[30px] outline-none  border-transparent"
                />

                <PrimaryInput
                  className="w-full p-2.5 pl-28"
                  label="Phone Number"
                  placeholder="Enter phone number"
                  type="tel"
                  inputMode="numeric"
                  maxLength={maxNationalLength}
                  value={formik.values.phone}
                  onChange={(e) => {
                    // Strip all non-digit characters — no dial code, no leading zeros needed
                    const digits = e.target.value.replace(/\D/g, "");
                    formik.setFieldValue("phone", digits);
                  }}
                  onBlur={formik.handleBlur}
                  name="phone"
                  error={undefined}
                  touched={formik.touched.phone}
                />
              </div>
              {formik.errors.phone && formik.touched.phone && (
                <span className="error-text">{formik.errors.phone}</span>
              )}
              <div className="w-full mb-3 mt-4">
                <PrimaryButton
                  className={"w-full"}
                  text={"Continue"}
                  loading={formik.isSubmitting}
                  type="submit"
                  onSubmit={() => formik.handleSubmit()}
                  disabled={formik.isSubmitting || !formik.isValid}
                />
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default PhoneVerifcation;
