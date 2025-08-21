import ResendCodeButton from "@/components/shared/ResendCodeButton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFormik } from "formik";
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Flag from "react-world-flags";
import PrimaryInput from "@/components/Inputs/PrimaryInput";
import Toast from "@/components/Toast";
import { PrimaryButton } from "@/components/buttons/Buttons";
import { APP_ROUTES } from "@/constants/app_route";
import { PhoneSchema, VerificationSchema } from "@/formSchemas";
import OtherSide from "@/layouts/auth/OtherSide";
import {
  GetUserDetails,
  PostPhoneNumber_KYC,
  Resend_OTP_PhoneNumber_KYC,
  Verify_OTP_PhoneNumber_KYC,
} from "@/redux/actions/userActions";

import { countryDataForPhone } from "@/utils/data";
import {
  MultiSelectDropDown,
  SelectDropDown,
} from "@/components/Inputs/MultiSelectInput";

const PhoneVerifcation = () => {
  const user: UserState = useSelector((state: any) => state.user);

  const [selectedCountry, setSelectedCountry] = useState("NG");
  const [verficationScreen, setVerificationScreen] = useState(false);
  const navigate = useNavigate();

  const normalizePhoneNumber = (input: string, selectedCountryCode: string) => {
    const country = countryDataForPhone.find(
      (c) => c.code === selectedCountryCode
    );
    const countryDialCode = country?.dialCode || "234";

    if (!input) return "";

    let phone = input.replace(/\D/g, "");

    if (phone.startsWith("0")) {
      phone = phone.substring(1);
    }

    if (phone.startsWith(countryDialCode)) {
      return phone;
    }

    if (phone.length === 10) {
      return countryDialCode + phone;
    }

    if (
      countryDialCode === "1" &&
      phone.length === 11 &&
      phone.startsWith("1")
    ) {
      return phone;
    }

    return countryDialCode + phone;
  };

  const listOptions = useMemo(() => {
    return countryDataForPhone.slice(0, 1).map((country) => ({
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
            <span className="text-gray-600 text-sm">+ {country.dialCode}</span>
          </div>
        </>
      ),
    }));
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
    validationSchema: PhoneSchema,
    onSubmit: async (values) => {
      const payload = {
        userId: user.user?.userId ?? "",
        phoneNumber: values.phone ?? "",
      };
      const response = await PostPhoneNumber_KYC(payload);

      if (response?.statusCode === 200) {
        setVerificationScreen(true);
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
          <form onSubmit={formik1.handleSubmit}>
            <div className="w-full mt-10">
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

              <ResendCodeButton
                onClick={resendOTP}
                defaultTime={30} // in seconds
                text="Resend OTP"
              />
            </div>
          </form>
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <div className="w-full mt-10">
              <div className="w-full mb-4 relative">
                <SelectDropDown
                  onChange={setSelectedCountry}
                  options={listOptions}
                  defaultValue={selectedCountry}
                  className="w-fit z-10  bg-transparent cursor-pointer px-1  py-0 border rounded-md absolute top-1/2 -translate-y-1/2 left-1 !h-[30px] outline-hidden curor-pointer border-transparent"
                />

                <PrimaryInput
                  className="w-full p-2.5 mb-7 pl-28"
                  label="Phone Number"
                  placeholder="Enter phone number"
                  type="tel"
                  value={formik.values.phone}
                  onChange={(e) => {
                    const rawInput = e.target.value;
                    const normalized = normalizePhoneNumber(
                      rawInput,
                      selectedCountry
                    );
                    formik.setFieldValue("phone", normalized);
                  }}
                  error={formik.errors.phone}
                  touched={undefined}
                />
              </div>
              <div className="w-full mb-3">
                <PrimaryButton
                  className={"w-full"}
                  text={"Send code"}
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
