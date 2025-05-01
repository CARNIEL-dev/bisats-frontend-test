import PrimaryInput from "../../components/Inputs/PrimaryInput"
import { PrimaryButton } from "../../components/buttons/Buttons"
import { BackArrow } from "../../assets/icons"
import OtherSide from "../../layouts/auth/OtherSide"
import { useFormik } from "formik"
import { useState } from "react"
import { PhoneSchema, VerificationSchema } from "../../formSchemas"
import { useNavigate } from "react-router-dom"
import { APP_ROUTES } from "../../constants/app_route"
import Header from "../../components/Header"
import { countryDataForPhone } from "../../utils/data"
import { useSelector } from "react-redux"
import { UserState } from "../../redux/reducers/userSlice"
import { PostPhoneNumber_KYC, Resend_OTP_PhoneNumber_KYC, Verify_OTP_PhoneNumber_KYC } from "../../redux/actions/userActions"
import Toast from "../../components/Toast"
const PhoneVerifcation = () => {
    const user: UserState = useSelector((state: any) => state.user);

    const [isLoading, setIsLoading] = useState(false)
    const [resendLoading, setResendLoading] = useState(false)
    const [selectedCountry, setSelectedCountry] = useState("NG"); 
    const [verficationScreen, setVerificationScreen]= useState(false)
    const navigate = useNavigate()

    const normalizePhoneNumber=(input: string, selectedCountryCode: string) =>{
        const country = countryDataForPhone.find(c => c.code === selectedCountryCode);
        const countryDialCode = country?.dialCode || "234";

        if (!input) return "";

        let phone = input.replace(/\D/g, '');

        if (phone.startsWith('0')) {
            phone = phone.substring(1);
        }

        if (phone.startsWith(countryDialCode)) {
            return phone;
        }

        if (phone.length === 10) {
            return countryDialCode + phone;
        }

        if ((countryDialCode === "1") && phone.length === 11 && phone.startsWith('1')) {
            return phone;
        }

        return countryDialCode + phone;
    }

     const formik1 = useFormik({
            initialValues: { code: "" },
            validationSchema: VerificationSchema,
            onSubmit: async (values) => {
                setIsLoading(true)
                const payload = {
                    userId: user.user?.userId ?? "",
                    code: values.code ?? ""
                }
                const response = await Verify_OTP_PhoneNumber_KYC(payload)
                setIsLoading(false)
                if (response?.statusCode === 200) {
                    Toast.success(response.message,"Phone number verified")
                    navigate(APP_ROUTES.KYC.PERSONAL)
                } else {
                    Toast.success(response.message, "Verification failed")

                }
            },
        });

    const formik = useFormik({
        initialValues: { phone: "" },
        validationSchema: PhoneSchema,
        onSubmit: async (values) => {
            setIsLoading(true)

            const payload = {
                userId: user.user?.userId ?? "",
                phoneNumber: values.phone ?? ""
            }
            const response = await PostPhoneNumber_KYC(payload)
            setIsLoading(false)
            if (response?.statusCode === 200) {
                setVerificationScreen(true)
            } else {
                Toast.error(response.message,"Failed")
            }          
        },
    });

    const resendOTP = async () => {
        setIsLoading(true)
        const response = await Resend_OTP_PhoneNumber_KYC(user?.user?.userId)
        setIsLoading(false)
        console.log(response)
        if (response?.ok) {

            Toast.success(response.message, "OTP Sent")
            // navigate(APP_ROUTES.WALLET.HOME)
        } else {
            Toast.error(response.message, "")
        }
    }




    return (
        <div className="">
            <Header currentPage={""} />
            <div className="lg:w-[442px] mx-auto py-24">
                <OtherSide
                    header="Verify your Phone number"
                    subHeader="We need your phone number to authenticate your details and secure your account"
                    upperSubHeader={<><p className="text-[14px] text-[#707D96] leading-[24px] font-[600] text-left flex items-center cursor-pointer mb-2">Bisats KYC Verification</p>
                    </>} />
                {
                    verficationScreen ?
                        <form onSubmit={formik1.handleSubmit}>

                        <div className="w-full mt-10">
                            <PrimaryInput
                                type="code"
                                name="code"
                                label="code"
                                css="w-full h-[48px] px-3 outline-none "
                                error={formik1.errors.code}
                                touched={formik1.touched.code}
                                value={formik1.values.code}
                                onChange={formik1.handleChange}
                                onBlur={formik1.handleBlur}
                            />

                            <div className="w-full my-3">
                                <PrimaryButton css={"w-full"} text={"Enter code"} loading={isLoading} type="submit" />
                            </div>



                            <div className="flex items-center justify-between">
                                <p className="text-[14px] text-[#515B6E] leading-[24px] font-[400] text-left">00:31</p>
                                <span className="text-[#C49600] text-[14px] leading-[24px] font-[600] " onClick={()=>resendOTP()}>{resendLoading?"loading...":"Resend OTP"}</span>
                            </div>


                        </div>
                        </form>
                        :
                
                        <form onSubmit={formik.handleSubmit}>

                            <div className="w-full mt-10">
                                <div className="w-full mb-4 relative">
                                    <select
                                        value={selectedCountry}
                                        onChange={(e) => setSelectedCountry(e.target.value)}
                                        className="w-fit  cursor-pointer py-1 border rounded-md absolute top-9 left-1 h-[39px] outline-none curor-pointer border-[transparent]"
                                    >
                                        {countryDataForPhone.map((country) => (
                                            <option key={country.code} value={country.code}>
                                                {country.flag} (+{country.dialCode})
                                            </option>
                                        ))}
                                    </select>

                                    <PrimaryInput
                                        css="w-full p-2.5 mb-7 pl-28"
                                        label="Phone Number"
                                        placeholder="Enter phone number"
                                        type="tel"
                                        value={formik.values.phone}
                                        onChange={(e) => {
                                            const rawInput = e.target.value
                                            const normalized = normalizePhoneNumber(rawInput, selectedCountry)
                                            formik.setFieldValue("phone",normalized)
                                        }}
                                        error={undefined} touched={undefined} />
                                </div>
                                <div className="w-full mb-3">
                                    <PrimaryButton css={"w-full"} text={"Send code"} loading={isLoading} type="submit" onSubmit={()=>formik.handleSubmit()} />
                                </div>
                                {/* <p className="text-[14px] text-[#515B6E] leading-[24px] font-[600] text-left">Need help?<span className="text-[#C49600] pl-2 cursor-pointer">Contact Support</span></p> */}
                            </div>
                        </form>
                }

            </div>
        </div>

    )
}

export default PhoneVerifcation
