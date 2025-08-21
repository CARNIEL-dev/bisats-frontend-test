import { CountrySelect } from "@/components/Inputs/CountrySelect";
import PrimaryInput from "@/components/Inputs/PrimaryInput";
import Toast from "@/components/Toast";
import { PrimaryButton } from "@/components/buttons/Buttons";
import { APP_ROUTES } from "@/constants/app_route";

import DatePicker from "@/components/ui/DatePicker";
import { PersonalInformationSchema } from "@/formSchemas";
import {
  GetUserDetails,
  PostPersonalInformation_KYC,
} from "@/redux/actions/userActions";

import { useFormik } from "formik";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import StepFlow from "./StepFlow";

const PersonalInfo = () => {
  const navigate = useNavigate();
  const user = useSelector((state: { user: UserState }) => state.user);
  useEffect(() => {
    if (user?.kyc?.personalInformationVerified) {
      navigate(APP_ROUTES.KYC.IDENTITY);
    }
  }, [user]);

  const formik = useFormik({
    initialValues: {
      firstName: "",
      middleName: "",
      lastName: "",
      dateOfBirth: "",
      nationality: "",
      businessName: "",
      address: "",
    },
    validationSchema: PersonalInformationSchema,

    validateOnMount: false,
    onSubmit: async (values) => {
      const { ...payload } = values;
      const payloadd = {
        ...payload,
        userId: user?.user?.userId,
      };
      const response = await PostPersonalInformation_KYC(payloadd);

      if (response.statusCode === 200) {
        Toast.success(response.message, "Success");
        GetUserDetails({
          userId: user?.user?.userId!,
          token: user?.user?.token!,
        });
        navigate(APP_ROUTES.KYC.IDENTITY);
        return;
      } else {
        console.log(response);
        Toast.error(response.message, "Error");
        return;
      }
    },
  });
  return (
    <div>
      <div className="">
        <StepFlow step={1} />
        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
          <div className="lg:flex items-start justify-between w-full gap-x-1.5 gap-y-2  ">
            <PrimaryInput
              name="firstName"
              className={"w-full  h-[48px]"}
              label={"First Name"}
              error={formik.errors.firstName}
              touched={formik.touched.firstName}
              value={formik.values.firstName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />

            <PrimaryInput
              name="middleName"
              className={"w-full h-[48px]"}
              label={"Middle Name"}
              error={formik.errors.middleName}
              touched={formik.touched.middleName}
              value={formik.values.middleName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />

            <PrimaryInput
              name="lastName"
              className={"w-full  h-[48px]"}
              label={"Last Name"}
              error={formik.errors.lastName}
              touched={formik.touched.lastName}
              value={formik.values.lastName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </div>

          <DatePicker
            title="Select a date"
            label={"Date of Birth"}
            name="dateOfBirth"
            error={formik.errors.dateOfBirth}
            handleChange={formik.handleChange}
            value={formik.values.dateOfBirth}
          />

          <CountrySelect
            placeholder={"Select a country"}
            label={"Nationality"}
            error={formik.errors.nationality}
            touched={formik.touched.nationality}
            handleChange={(prop) => formik.setFieldValue("nationality", prop)}
            value={formik.values.nationality}
          />

          <PrimaryInput
            className="w-full h-[48px]"
            name="address"
            placeholder="Where you live"
            label={"Residential Address"}
            error={formik.errors.address}
            touched={formik.touched.address}
            value={formik.values.address}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />

          <PrimaryInput
            className="w-full h-[48px]"
            name="businessName"
            placeholder="Your business name"
            label={"Business Name"}
            error={formik.errors.businessName}
            touched={formik.touched.businessName}
            value={formik.values.businessName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            info="This is very important in verifying your application to be a merchant"
          />

          <div className="mt-4">
            <PrimaryButton
              className={"w-full"}
              text={"Continue"}
              loading={formik.isSubmitting}
              disabled={formik.isSubmitting || !formik.isValid || !formik.dirty}
            />
          </div>
        </form>
      </div>
    </div>
  );
};
export default PersonalInfo;
