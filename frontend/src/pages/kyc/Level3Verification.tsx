import React, { useEffect, useState } from 'react'
import OtherSide from '../../layouts/auth/OtherSide'
import Header from '../../components/Header'
import Toast from '../../components/Toast'
import { Post_Proof_of_Profile_KYC, Post_Proof_of_Wealth_KYC, PostPOA_KYC } from '../../redux/actions/userActions'
import { APIResponseType } from '../../redux/types'
import { APP_ROUTES } from '../../constants/app_route'
import { useNavigate } from 'react-router-dom'
import { UserState } from '../../redux/reducers/userSlice'
import { useSelector } from 'react-redux'
import FileInput from '../../components/Inputs/FileInput'
import { PrimaryButton } from '../../components/buttons/Buttons'
import Success from "../../assets/icons/success.png"


const Level3Verification = () => {

    const [generalLoader, setgeneralLoader] = useState(false)


    //Utility bill
     const [isLoading1, setIsLoading1] = useState(false)
        const [file1Name, setFile1Name] = useState("");
        const [error1, setError1] = useState(false);
    const [file1, setFile1] = useState<File | null>(null);

// Proof of wealth
    const [isLoading2, setIsLoading2] = useState(false)
    const [file2Name, setFile2Name] = useState("");
    const [error2, setError2] = useState(false);
    const [file2, setFile2] = useState<File | null>(null);

    //Proof of Profile
    const [isLoading3, setIsLoading3] = useState(false)
    const [file3Name, setFile3Name] = useState("");
    const [error3, setError3] = useState(false);
    const [file3, setFile3] = useState<File | null>(null);
    const user: UserState = useSelector((state: any) => state.user);
        const navigate = useNavigate()
    const [responsePending, setResponsePending] = useState(user.kyc?.proofOfProfileVerified)
    useEffect(() => {
        if(!user.kyc?.bvnVerified) navigate(APP_ROUTES.KYC.BVNVERIFICATION)
    },[user.user])

    const handleFile1Change = (e: any) => {
        const file1 = e.target?.files[0];
        console.log(file1)
        if (file1) {
            const allowedTypes = ["application/pdf", "image/jpeg", "image/jpg"];
            if (allowedTypes.includes(file1.type)) {
                setFile1Name(file1.name);
                setFile1(file1);
            } else {
                Toast.warning("Only pdf, jepeg an jpg formats are allowed", "Document type");
                setFile1Name("");
                setError1(true)
            }
        }
    };

    const handleFile2Change = (e: any) => {
        const file2 = e.target.files[0];
        console.log(file2)

        if (file2) {
            const allowedTypes = ["application/pdf", "image/jpeg", "image/jpg"];
            if (allowedTypes.includes(file2.type)) {
                setFile2Name(file2.name);
                setFile2(file2);
            } else {
                Toast.warning("Only pdf, jepeg an jpg formats are allowed", "Document type");
                setFile2Name("");
                setError2(true)

            }
        }
    };
    const handleFile3Change = (e: any) => {
        const file3 = e.target.files[0];
        console.log(file3)

        if (file3) {
            const allowedTypes = ["application/pdf", "image/jpeg", "image/jpg"];
            if (allowedTypes.includes(file3.type)) {
                setFile3Name(file3.name);
                setFile3(file3);
            } else {
                Toast.warning("Only pdf, jepeg an jpg formats are allowed", "Document type");
                setFile3Name("");
                setError3(true)

            }
        }
    };
    const SubmitFile1 = async () => {
        // e.preventDefault();
        if (!file1) {
            Toast.error("Please upload a valid document.", "Document type");
            return;
        }
        setIsLoading1(true)
        const response = await PostPOA_KYC({ userId: user?.user?.userId, file: file1 }) as APIResponseType
        setIsLoading1(false)
        if (response.statusCode === 200) {
            Toast.success("Proof of address uploaded successfully", "Success")
            return true
        } else {
            Toast.error(response.message, "Error")
            return false
        }
    }

    const SubmitFile2 = async () => {
        if (!file1) {
            Toast.error("Please upload a valid document.", "Document type");
            return;
        }
        setIsLoading1(true)
        const response = await Post_Proof_of_Wealth_KYC({ userId: user?.user?.userId, file: file1 }) as APIResponseType
        setIsLoading1(false)
        if (response.statusCode === 200) {
            Toast.success("Source of wealth uploaded successfully", "Success")
            return true
        } else {
            Toast.error(response.message, "Error")
            return false
        }
    }

    const SubmitFile3 = async () => {
        if (!file1) {
            Toast.error("Please upload a valid document.", "Document type");
            return;
        }
        setIsLoading1(true)
        const response = await Post_Proof_of_Profile_KYC({ userId: user?.user?.userId, file: file1 }) as APIResponseType
        setIsLoading1(false)
        if (response.statusCode === 200) {
            Toast.success("Proof of profile uploaded successfully", "Success")
            return true
        } else {
            Toast.error(response.message, "Error")
            return false
        }
    }

    const Submit_Level3_kyc = async (e: React.FormEvent) => {
        e.preventDefault();
        setgeneralLoader(true);

        try {
            if (!user.kyc?.utilityBillVerified) {
                const result1 = await SubmitFile1();
                if (!result1) throw new Error("Utility bill upload failed");
            }

            if (!user.kyc?.sourceOfWealthVerified) {
                const result2 = await SubmitFile2();
                if (!result2) throw new Error("Source of wealth upload failed");
            }

            if (!user.kyc?.proofOfProfileVerified) {
                const result3 = await SubmitFile3();
                if (!result3) throw new Error("Proof of profile upload failed");
            }

            // Optionally show success message or proceed
        } catch (error) {
            console.error("KYC submission failed:", error);
            Toast.error("","KYC submission failed:");
            // Optionally show error toast here
        } finally {
            setResponsePending(true)
            setgeneralLoader(false);
        }
    };

  return (
      <div className="">
          <Header currentPage={""} />
          <div className="lg:w-[442px] mx-auto py-14 px-5">
              <OtherSide
                  header="Upgrade your account"
                  subHeader={<p className="text-[#515B6E] text-[14px]">Upgrade to <span className="text-[#17A34A]"> Level 3 </span>to unlock more access to your Bisats account</p>}
              />

              <div>
                  {
                      responsePending ?
                            <div className="flex flex-col justify-center items-center text-center space-y-2 my-4">
                                                          <img className="w-[32px] h-[32px] mx-auto" src={Success} alt="success" />
                                                          <h1 className="text-[16px] text-[#515B6E]">Your documents have been uploaded successfully</h1>
                                                          <p className="text-[14px] text-[#515B6E]">Your details are currently being reviewed</p>
                                                      
                                                          <div className="w-full mb-3">
                                                              <PrimaryButton css={"w-full"} text={"Go to Dashboard"} onClick={() => navigate(APP_ROUTES.DASHBOARD)} loading={false} />
                                                          </div>
                                                      </div>
                  :
                          <div>

                              <div className="bg-[#F9F9FB] p-2 mt-5 border border-[#F9F9FB] rounded-[8px] text-[12px] text-[#515B6E] w-full h-fit flex flex-col space-y-2 ">
                                  <p>
                                      <span className="w-[4px] bg-[#C2C7D2] rounded-full  mr-1 h-[4px]"></span>
                                      <span>Create sell ads (max 100M NGN in crypto assets)</span>
                                  </p>
                                  <p>
                                      <span className="w-[4px] bg-[#C2C7D2] rounded-full  mr-1 h-[4px]"></span>
                                      <span>Create buy ads (max 100M NGN in crypto assets)</span>
                                  </p>
                                  <p>
                                      <span className="w-[4px] bg-[#C2C7D2] rounded-full  mr-1 h-[4px]"></span>
                                      <span>Max daily limit for withdrawal is unlimited NGN and 3m USD in crypto</span>
                                  </p>

                              </div>


                              <div className='mt-5'>
                                  <form onSubmit={Submit_Level3_kyc}>
                                      <div>
                                          <FileInput fileName={file1Name} handleFileChange={handleFile1Change} error={error1} label={"Upload a recent utility bill (Not later than 4months ago)"} disabled={user?.kyc?.utilityBillVerified} />
                                      </div>
                                      <div>
                                          <FileInput fileName={file2Name} handleFileChange={handleFile2Change} error={error2} label={"Source of wealth"} info={"Personal bank statement or trades from other platforms"} disabled={user?.kyc?.sourceOfWealthVerified} />
                                      </div>
                                      <div>
                                          <FileInput fileName={file3Name} handleFileChange={handleFile3Change} error={error1} label={"Proof of profile from other platforms (optional)"} info={"Profile screenshot"} disabled={user?.kyc?.proofOfProfileVerified} />
                                      </div>
                                      <div className="my-5">
                                          <PrimaryButton css={"w-full"} text={"Submits"} loading={generalLoader} onSubmit={Submit_Level3_kyc} />
                                      </div>
                                  </form>
                              </div>
                          </div>}
              </div>
          </div>
          
         
      
    </div>
  )
}


export default Level3Verification