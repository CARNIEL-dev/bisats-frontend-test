import { useState } from "react"
import PrimaryInput from "../../components/Inputs/PrimaryInput"
import AuthPasswordInput from "../../components/Inputs/AuthPasswordInput"
import { PrimaryButton } from "../../components/buttons/Buttons"
import { InputCheck } from "../../components/Inputs/CheckBox"
import OtherSide from "../../layouts/auth/OtherSide"
import { ResetPassword as RP } from "../../redux/actions/userActions"
import GoogleButton from "../../components/buttons/GoogleButton"
import { ResetPasswordSchema, SignupSchema } from "../../formSchemas"
import { useFormik } from "formik"
import { useNavigate } from 'react-router-dom';
import { APP_ROUTES } from '../../constants/app_route';

const ResetPassword = () => {
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()
    const email = localStorage.getItem("f_email")
    const [passwordBody] = useState({
        email: email ?? "",
        newPassword: "",
        confirmPassword: ""
    })

    const formik = useFormik({
        initialValues: { ...passwordBody },
        validationSchema: ResetPasswordSchema,
        onSubmit: async (values) => {
            setIsLoading(true)
            
            const { ...payload } = values
            const response = await RP(payload)
            if (response?.statusCode === 200) {
                navigate(APP_ROUTES.AUTH.LOGIN)
            }
            setIsLoading(false)
        },
    });
    return (
        <div className="lg:w-[442px] mx-auto">
            <OtherSide
                header="Set a new password"
                subHeader="Your new password should be strong and easy to remember."
                upperSubHeader={<></>} />
            <form onSubmit={formik.handleSubmit}>

            <div className="w-full mb-4">
                    <div className="w-full mb-2">
                        <AuthPasswordInput
                            css="w-full h-[48px] px-3 outline-hidden"
                            handleChange={formik.handleChange}
                            name="newPassword"
                            error={formik.errors.newPassword}
                            touched={formik.touched.newPassword}
                            check={true}
                            text="Password"
                            value={formik.values.newPassword}
                            onBlur={formik.handleBlur}
                        />
                    </div>
            </div>
            <div className="w-full mb-4">
                    <AuthPasswordInput css="w-full h-[48px] px-3 outline-hidden "
                        check={false}
                        text="Repeat password"
                        name="confirmPassword"
                        error={formik.errors.confirmPassword}
                        touched={formik.touched.confirmPassword}
                        value={formik.values.confirmPassword}
                        handleChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
            </div>
                <div className="w-full mb-3">
                    <PrimaryButton css={""} text={"Save password"} loading={isLoading} type="submit" />
                </div>
                <p className="text-[14px] text-[#515B6E] leading-[24px] font-semibold text-center">Don’t have an account?<span className="text-[#C49600] pl-3 cursor-pointer" onClick={() => navigate(APP_ROUTES.AUTH.SIGNUP)}>Sign Up</span></p>
            </form>
            </div>
    )
}

export default ResetPassword
