import { useState } from "react"
import PrimaryInput from "../../components/Inputs/PrimaryInput"
import AuthPasswordInput from "../../components/Inputs/AuthPasswordInput"
import { PrimaryButton } from "../../components/buttons/Buttons"
import { InputCheck } from "../../components/Inputs/CheckBox"
import OtherSide from "../../layouts/auth/OtherSide"
import { SignUp as Signup } from "../../redux/actions/userActions"
import GoogleButton from "../../components/buttons/GoogleButton"
import { SignupSchema } from "../../formSchemas"
import { useFormik } from "formik"
import { useNavigate } from 'react-router-dom';
import { APP_ROUTES } from '../../constants/app_route';

const SignUp = () => {
    const navigate = useNavigate()
    const [signupBody] = useState({
        email: "",
        password: "",
        confirmPassword: ""
    })
    const [isLoading, setIsLoading] = useState(false)

    const formik = useFormik({
        initialValues: { ...signupBody, agreeToTerms: false },
        validationSchema: SignupSchema,
        onSubmit: async (values) => {
            setIsLoading(true)
            // if (formik.touched.agreeToTerms && formik.errors.agreeToTerms) {
            //     Toast.warning(formik.errors.agreeToTerms, "Terms & Conditions")
            // }
            const { agreeToTerms, ...payload } = values
            const response = await Signup(payload)
            if (response?.statusCode === 200) {
                navigate(APP_ROUTES.AUTH.VERIFY)
            }
            setIsLoading(false)
        },
    });

    return (
        <div className="lg:w-[442px] mx-auto">
            <OtherSide
                header="Create your account"
                subHeader="Exchange fiat and crypto fast, easy and securely."
                upperSubHeader={<></>} />
            <div className="w-full mt-10">
                <form onSubmit={formik.handleSubmit}>
                    <div className="w-full mb-2">
                    <PrimaryInput
                            type="email"
                            name="email"
                        label="email"
                        css="w-full h-[48px] px-3 outline-none "
                            error={formik.errors.email}
                            touched={formik.touched.email}
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />

                    </div>
                    <div className="w-full mb-2">
                        <AuthPasswordInput
                            css="w-full h-[48px] px-3 outline-none"
                            handleChange={formik.handleChange}
                            name="password"
                            error={formik.errors.password}
                            touched={formik.touched.password}
                            check={true}
                            text="Password"
                            value={formik.values.password}
                            onBlur={formik.handleBlur}
                        />
                    </div>
                    <div className="w-full mb-2">
                    <AuthPasswordInput css="w-full h-[48px] px-3 outline-none "
                            // handleChange={(e) => setSignUpBody({ ...signupBody, confirmPassword: e })}
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
                    <div>
                <div className="flex items-center mb-2">
                            <InputCheck type="checkbox"
                                name="agreeToTerms"
                                checked={formik.values.agreeToTerms}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                    <p className="text-[12px] text-[#515B6E] leading-[16px] font-[400] mt-1 ml-2">By creating an account you certify that you are over the age of 18 and agree to the Privacy Policy.</p>
                        </div>
                        {formik.touched.agreeToTerms && formik.errors.agreeToTerms ? (
                            <div style={{ color: 'red' }} className="text-[12px] text-[#515B6E] leading-[16px] font-[400] mb-3">{formik.errors.agreeToTerms}</div>
                        ) : null}
                    </div>
                <div className="w-full mb-3">
                        <PrimaryButton css={(!formik.isValid || !formik.dirty) ? "bg-[lightGrey]" : ""} text={"Create account"} type="submit" disabled={!formik.isValid || !formik.dirty}
                            loading={isLoading}
                        />
                </div>
                </form>
                <div className="w-full flex items-center my-6">
                    <hr className="text-[#F3F4F6] w-1/2 h-[1.5px]" />
                    <span className="text-[12px] text-[#707D96] leading-[16px] font-[400] mx-2">or</span>
                    <hr className="text-[#F3F4F6] w-1/2 h-[1.5px]" />
                </div>
                <GoogleButton text="Sign up with Google" />
                <p className="text-[14px] text-[#515B6E] leading-[24px] font-[600] text-center">Already have an account?<span className="text-[#C49600] pl-3 cursor-pointer" onClick={() => navigate(APP_ROUTES.AUTH.LOGIN)}>Sign In</span></p>

            </div>
        </div>
    )
}

export default SignUp
