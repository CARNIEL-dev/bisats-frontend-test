import { PrimaryButton } from "../../components/buttons/Buttons"
import PrimaryInput from "../../components/Inputs/PrimaryInput"
import { VerificationSchema } from "../../formSchemas"
import OtherSide from "../../layouts/auth/OtherSide"
import { useFormik } from "formik"
import { VerifyUser } from "../../redux/actions/userActions"
import { useSelector } from "react-redux"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { APP_ROUTES } from "../../constants/app_route"
import { useSearchParams } from "react-router-dom";
import { ReSendverificationCode } from "../../redux/actions/userActions"

const VerifyEmail = () => {
    const [isLoading, setIsLoading] = useState(false)
    const user = useSelector((state: any) => state.user.user);
    const navigate = useNavigate()
    const [searchParams] = useSearchParams();

    const codeLink = searchParams.get("code");
    const userId = searchParams.get("userId");
    const formik = useFormik({
        initialValues: { code: codeLink ? codeLink : "" },
        validationSchema: VerificationSchema,
        onSubmit: async (values) => {
            setIsLoading(true)
            const payload = (codeLink && userId) ? {
                userId: userId,
                code: codeLink
            } : {
                userId: user.userId,
                code: values.code
            }
            const response = await VerifyUser(payload)
            setIsLoading(false)
            if (response?.statusCode === 200) {
                navigate(APP_ROUTES.AUTH.LOGIN)
            }
        },
    });

    useEffect(() => {
        if (codeLink && userId) {
            formik.submitForm()
        }
    }, [])
    
    return (
        <div className="lg:w-[442px] mx-auto">
            <OtherSide
                header="Verify your account"
                subHeader="An VerifyEmail has been sent to your registered email. Enter the code below to verify your account."
                upperSubHeader={<></>} />
            <form onSubmit={formik.handleSubmit}>

            <div className="w-full mt-10">

                <div className="w-full mb-4">
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
                </div>
                <div className="w-full mb-3">
                        <PrimaryButton css={""} text={"Verify account"} type="submit" loading={isLoading} />
                </div>
                <div className="flex items-center justify-between">
                    <p className="text-[14px] text-[#515B6E] leading-[24px] font-[400] text-left">00:31</p>
                        <span className="text-[#C49600] text-[14px] leading-[24px] font-[600] " onClick={() => ReSendverificationCode({ userId: user?.userId })
                        }>Resend a new code</span>
                </div>
                </div>
            </form>
        </div>
    )
}

export default VerifyEmail
