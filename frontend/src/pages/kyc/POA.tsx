import Label from "../../components/Inputs/Label"
import StepFlow from "./StepFlow"
import { PrimaryButton } from "../../components/buttons/Buttons"
import { useEffect, useState } from "react"
import { docUpload } from "../../assets/icons"
import Toast from "../../components/Toast"
import { PostPOA_KYC } from "../../redux/actions/userActions"
import { getUser } from "../../helpers"
import { useNavigate } from "react-router-dom"
import { APP_ROUTES } from "../../constants/app_route"
import { APIResponseType } from "../../redux/types"

const POA = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [fileName, setFileName] = useState("");
    const [error, setError] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const user = getUser()
    const navigate = useNavigate()

    useEffect(() => {
        if (user?.kyc.utilityBillVerified) {
            navigate(APP_ROUTES.KYC.IDENTITY)
        }
    }, [user])

    const handleFileChange = (e: any) => {
        const file = e.target.files[0];
        if (file) {
            const allowedTypes = ["application/pdf", "image/jpeg", "image/jpg"];
            if (allowedTypes.includes(file.type)) {
                setFileName(file.name);
                setFile(file);
            } else {
                Toast.warning("Only pdf, jepeg an jpg formats are allowed", "Document type");
                setFileName("");
            }
        }
    };

    const SubmitFile = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) {
            Toast.error("Please upload a valid document.", "Document type");
            return;
        }
        setIsLoading(true)
        const response = await PostPOA_KYC({ userId: user?.userId, file: file }) as APIResponseType
        console.log(response)
        setIsLoading(false)
        if (response.statusCode === 200) {
            Toast.success(response.message, "Success")
            navigate(APP_ROUTES.KYC.IDENTITY)
            return
        } else {
            Toast.error(response.message, "Error")
            return
        }

    }

    return (
        <div className="w-full p-3">
            <StepFlow step={2} />
            <form onSubmit={SubmitFile}>
                <div className="py-4">
                    <Label text={"Upload a recent utility bill"} css={"my-5"} />
                    <div className="file-upload-container my-5 py-5">
                        <label htmlFor="file-upload" className="file-upload-box">
                            <img className="file-upload-icon w-[24px] h-[24px]" src={docUpload} />
                            <span className="file-upload-text text-[14px] text-[#424A59] leading-[24px]">
                                {fileName || "Upload"}
                            </span>
                            <input
                                id="file-upload"
                                type="file"
                                accept=".pdf, .jpg, .jpeg"
                                onChange={handleFileChange}
                                className="file-upload-input"
                            />
                        </label>
                        {error && <p className="error-text">{error}</p>}
                    </div>
                    <div className="my-4">
                        <PrimaryButton css={"w-full"} text={"Continue"} loading={isLoading} />
                    </div>
                </div>


            </form>

        </div>
    )
}
export default POA