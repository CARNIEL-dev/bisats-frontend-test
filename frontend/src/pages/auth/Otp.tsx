import { PrimaryButton } from "../../components/buttons/Buttons"
import PrimaryInput from "../../components/Inputs/PrimaryInput"
import { BackArrow } from "../../assets/icons"
import OtherSide from "../../layouts/auth/OtherSide"
import { VerificationSchema } from "../../formSchemas"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useFormik } from "formik"
import { VerifyForgotPassword } from "../../redux/actions/userActions"
import { APP_ROUTES } from "../../constants/app_route"
import { useSearchParams } from "react-router-dom";

const OTP = () => {
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()
    const email = localStorage.getItem("f_email")
    const [searchParams] = useSearchParams();

    const codeLink = searchParams.get("code");
    const emaill = searchParams.get("email");

    const formik = useFormik({
        initialValues: { code: "" },
        validationSchema: VerificationSchema,
        onSubmit: async (values) => {
            setIsLoading(true)
            const payload = {
                email: email ?? "",
                code: values.code ?? ""
            }
            console.log('Form data:', values);
            const response = await VerifyForgotPassword(payload)
            setIsLoading(false)
            if (response?.statusCode === 200) {
                navigate(APP_ROUTES.AUTH.RESET_PASSWORD)
            }
        },
    });
    useEffect(() => {

     }, [])
    return (
        <div className="lg:w-[442px] mx-auto">
            <OtherSide
                header="Enter OTP"
                subHeader="Type in the code sent to your email to reset your password"
                upperSubHeader={<>            <p className="text-[14px] text-[#707D96] leading-[24px] font-[600] text-left flex items-center cursor-pointer mb-2"> <span className="mr-2"><BackArrow /></span> Back to Log in</p>
                </>} />
            <form onSubmit={formik.handleSubmit}>

            <div className="w-full mt-10">
                    <PrimaryInput
                        type="code"
                        name="code"
                        label="code"
                        css="w-full h-[48px] px-3 outline-none "
                        error={formik.errors.code}
                        touched={formik.touched.code}
                        value={formik.values.code}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />

                <div className="w-full mb-3">
                        <PrimaryButton css={""} text={"Enter code"} loading={isLoading} type="submit" />
                    </div>



                <div className="flex items-center justify-between">
                    <p className="text-[14px] text-[#515B6E] leading-[24px] font-[400] text-left">00:31</p>
                    <span className="text-[#C49600] text-[14px] leading-[24px] font-[600] ">Contact Support</span>
                </div>


                </div>
            </form>
        </div>
    )
}

export default OTP
