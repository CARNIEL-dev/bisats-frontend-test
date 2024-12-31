import { CountrySelect } from "../../components/Inputs/CountrySelect"
import PrimaryInput from "../../components/Inputs/PrimaryInput"
import StepFlow from "./StepFlow"
import DateInput from "../../components/Inputs/DateInput"
import { PrimaryButton } from "../../components/buttons/Buttons"
import { useFormik } from "formik"
import { PersonalInformationSchema } from "../../formSchemas/KYC"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { PostPersonalInformation_KYC, GetUserDetails } from "../../redux/actions/userActions"
import { getUser } from "../../helpers"
import Toast from "../../components/Toast"
import { APP_ROUTES } from "../../constants/app_route"

const PersonalInfo = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [personalInfo] = useState({
        firstName: "",
        middleName: "",
        lastName: "",
        dateOfBirth: "",
        nationality: "",
        address: ""
    })
    const navigate = useNavigate()
    const user = getUser()

    useEffect(() => {
        if (user?.kyc.personalInformationVerified) {
            navigate(APP_ROUTES.KYC.POA)
        }
    }, [user])

    const formik = useFormik({
        initialValues: { ...personalInfo },
        validationSchema: PersonalInformationSchema,
        onSubmit: async (values) => {
            setIsLoading(true)
            const { ...payload } = values
            const payloadd = {
                ...payload,
                userId: user.userId
            }
            const response = await PostPersonalInformation_KYC(payloadd)
            setIsLoading(false)
            if (response.statusCode === 200) {
                Toast.success(response.message, "Success")
                GetUserDetails()
                navigate(APP_ROUTES.KYC.POA)
                return
            } else {
                Toast.error(response.message, "Error")
                return
            }
        },
    });
    return (
        <div>
            <div className="w-full p-3">
                <StepFlow step={1} />
                <form onSubmit={formik.handleSubmit}>
                <div className="my-4">
                        <div className="lg:flex items-center justify-between w-full lg:w-5/6">
                            <div className="w-full lg:w-[142px]">
                                <PrimaryInput
                                    name="firstName"
                                    css={"w-full lg:w-[142px] h-[48px]"}
                                    label={"First Name"}
                                    error={formik.errors.firstName}
                                    touched={formik.touched.firstName}
                                    value={formik.values.firstName}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </div>
                            <div className="w-full lg:w-[142px] lg:mx-5">
                                <PrimaryInput
                                    name="middleName"
                                    css={"w-full lg:w-[142px] h-[48px]"}
                                    label={"Middle Name"}
                                    error={formik.errors.middleName}
                                    touched={formik.touched.middleName}
                                    value={formik.values.middleName}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />

                        </div>
                            <div className="w-full lg:w-[142px]">
                                <PrimaryInput
                                    name="lastName"
                                    css={"w-full lg:w-[142px] h-[48px]"}
                                    label={"Last Name"}
                                    error={formik.errors.lastName}
                                    touched={formik.touched.lastName}
                                    value={formik.values.lastName}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="my-4">
                        <DateInput
                            parentId={""}
                            title={"Select a date"}
                            label={"Date of Birth"}
                            name="dateOfBirth"
                            error={formik.errors.dateOfBirth}
                            touched={formik.touched.dateOfBirth}
                            handleChange={formik.handleChange}
                        />
                    </div>
                    <div className="my-4">
                        <CountrySelect
                            parentId={""} title={"Select a country"}
                            choices={[]} label={"Nationality"}
                            error={formik.errors.nationality}
                            touched={formik.touched.nationality}
                            handleChange={(prop) => formik.setFieldValue("nationality", prop)}

                        />
                    </div>

                    <div className="w-full ">
                        <PrimaryInput
                            css="w-full h-[48px]" name="address" placeholder="Where you live"
                            label={"Residential Address"} error={formik.errors.address} touched={formik.touched.address}
                            value={formik.values.address}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}

                        />
                    </div>

                    <div className="my-4">
                        <PrimaryButton css={""} text={"Continue"} loading={isLoading} />
                    </div>
                </form>
            </div>

        </div>
    )
}
export default PersonalInfo