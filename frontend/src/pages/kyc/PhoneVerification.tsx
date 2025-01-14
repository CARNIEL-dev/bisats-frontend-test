import PrimaryInput from "../../components/Inputs/PrimaryInput"
import { PrimaryButton } from "../../components/buttons/Buttons"
import { BackArrow } from "../../assets/icons"
import OtherSide from "../../layouts/auth/OtherSide"
import { useFormik } from "formik"
import { useState } from "react"
import { PhoneSchema } from "../../formSchemas"
import { useNavigate } from "react-router-dom"
import { APP_ROUTES } from "../../constants/app_route"
import Header from "../../components/Header"
const PhoneVerifcation = () => {
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()

    const formik = useFormik({
        initialValues: { phone: "" },
        validationSchema: PhoneSchema,
        onSubmit: async (values) => {
            setIsLoading(true)
            navigate(APP_ROUTES.KYC.PERSONAL)
            // if (formik.touched.agreeToTerms && formik.errors.agreeToTerms) {
            //     Toast.warning(formik.errors.agreeToTerms, "Terms & Conditions")
            // }
            // localStorage.setItem("f_email", values.email)
            // const { ...payload } = values
            // const response = await FP(payload)
            // if (response?.statusCode === 200) {
            //     navigate(APP_ROUTES.AUTH.OTP)
            // }
            // setIsLoading(false)
        },
    });


    return (
        <div className="">
            <Header currentPage={""} />
            <div className="lg:w-[442px] mx-auto py-24">
                <OtherSide
                    header="Verify your Phone number"
                    subHeader="We need your phone number to authenticate your details and secure your account"
                    upperSubHeader={<><p className="text-[14px] text-[#707D96] leading-[24px] font-[600] text-left flex items-center cursor-pointer mb-2">Bisats KYC Verification</p>
                    </>} />
                <form onSubmit={formik.handleSubmit}>

                    <div className="w-full mt-10">
                        <div className="w-full mb-4">
                            <PrimaryInput
                                type="text"
                                name="phone"
                                label="Phone number"
                                css="w-full h-[48px] px-3 outline-none "
                                error={formik.errors.phone}
                                touched={formik.touched.phone}
                                value={formik.values.phone}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </div>
                        <div className="w-full mb-3">
                            <PrimaryButton css={""} text={"Send code"} loading={isLoading} type="submit" />
                        </div>
                        <p className="text-[14px] text-[#515B6E] leading-[24px] font-[600] text-left">Need help?<span className="text-[#C49600] pl-2 cursor-pointer">Contact Support</span></p>
                    </div>
                </form>

            </div>
        </div>

    )
}

export default PhoneVerifcation
