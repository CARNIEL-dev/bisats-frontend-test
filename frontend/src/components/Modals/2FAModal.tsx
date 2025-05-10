import { useEffect, useState } from "react";
import ModalTemplate from "./ModalTemplate"
import { Generate2FA_QRCODE, rehydrateUser, UpdateTwoFactorAuth, VerifyTwoFactorAuth } from "../../redux/actions/userActions";
import { UserState } from "../../redux/reducers/userSlice";
import { useSelector } from "react-redux";
import { PrimaryButton, WhiteTransparentButton } from "../buttons/Buttons";
import Toast from "../Toast";
import PrimaryInput from "../Inputs/PrimaryInput";
interface Props {
    close: () => void;
}
type TCurrentDisplay = "QRCode" | "Manual" | "Code"

const TwoFactorAuthModal: React.FC<Props> = ({ close }) => {
  const userState: UserState = useSelector((state: any) => state.user);
      const user = userState.user
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const [currentDisplay, setCurrentDisplay] = useState<TCurrentDisplay>("QRCode")
  const [qrImg, setQRImg] = useState("");
  const [qrSecret, setQRSecret] = useState("");


  const GetQRCode = async () => {
    const response = await Generate2FA_QRCODE(user?.userId)
    if (response?.status) {
      const img = response.data.qrcode
      const secret = response.data.secret
      setQRSecret(secret)
      setQRImg(img)
    } else {
      Toast.error("Unable to get QR Code","")
    }
  }

  const Verify2FA = async () => {
    setLoading(true)

    try {
      const verificationResponse = await UpdateTwoFactorAuth({
        userId: user?.userId,
        code,
        enable: true,
      });
      if (!verificationResponse?.status) {
        Toast.error(verificationResponse.message, "2FA Verification failed");
      } else {
        Toast.success(verificationResponse.message,"2FA Enabled")
      }
      setLoading(false)
      rehydrateUser()
      close()
    } catch (error) {
      setLoading(false)

      console.error("Error during 2FA verification:", error);
      Toast.error("An unexpected error occurred", "2FA Error");
    }
  };

  const formatKey = () => {
    return qrSecret?.match(/.{1,4}/g)?.join(' ').toUpperCase();
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(qrSecret)
      .then(() => {
        Toast.info(qrSecret, 'Copied to clipboard:');
      })
      .catch((err) => {
        Toast.error(err,'Failed to copy:');
      });
  };

  useEffect(() => {
    GetQRCode()
  },[])
  const QRCodeScan = () => {
    return (
      <div className="p-6 max-w-md mx-auto bg-white space-y-4 text-center text-[#001140]">
        <img src={qrImg} alt="Scan QR Code" className="mx-auto w-40 h-40" />
        <h2 className="text-xl font-[500]">Scan QRCode</h2>
        <p className="">
          From your device, launch Google Authenticator, and scan the QRCode above. Hit done, when you’ve added the key above successfully.
        </p>
        <div className="flex justify-end gap-4 mt-5">
          <WhiteTransparentButton text={"Setup Manually"} loading={false} onClick={() => setCurrentDisplay("Manual")} css="px-3"/>
          <PrimaryButton text={"Done"} loading={false} onClick={() => setCurrentDisplay("Code")} css="px-2" />
        </div>
      </div>
    );
  };
  const ManualSetup = () => {
    const secretKey = formatKey();

    return (
      <div className="p-6 max-w-md mx-auto bg-white  space-y-4 text-center">
        <div className="bg-blue-100 text-blue-800 p-3 rounded font-mono flex items-end" >
          {secretKey}
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto cursor-pointer" onClick={()=>copyToClipboard()}>
            <path d="M16 12.9V17.1C16 20.6 14.6 22 11.1 22H6.9C3.4 22 2 20.6 2 17.1V12.9C2 9.4 3.4 8 6.9 8H11.1C14.6 8 16 9.4 16 12.9Z" stroke="#515B6E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M22 6.9V11.1C22 14.6 20.6 16 17.1 16H16V12.9C16 9.4 14.6 8 11.1 8H8V6.9C8 3.4 9.4 2 12.9 2H17.1C20.6 2 22 3.4 22 6.9Z" stroke="#515B6E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>

        </div>
       
        <h2 className="text-xl font-semibold">Add manually</h2>
        <p className="text-gray-500">
          Tap to copy the key above and paste it in your authenticator to start generating tokens. Hit done, when you’ve added the key above successfully.
        </p>
        
        <div className="flex justify-end gap-4 mt-5">
          <WhiteTransparentButton text={"Use QR"} loading={false} onClick={() => setCurrentDisplay("QRCode")} css="px-3" />
          <PrimaryButton text={"Done"} loading={false} onClick={() => setCurrentDisplay("Code")} css="px-2"/>
        </div>
      </div>
    );
  };
  const CodeEntry = () => {

    return (
      <div className="p-6 max-w-md mx-auto bg-white  text-center space-y-4">
        <h2 className="text-xl font-semibold">Enter code</h2>
        <p className="text-gray-500">
          Enter the 6-digit code for "BISATAS" generated from your authenticator.
        </p>
        <div className="flex justify-center gap-2">
          <PrimaryInput css={"w-full"} label={"Code"} max={4} error={undefined} touched={undefined} onChange={(e) => { let value = e.target.value.replace(/\D/g, ''); setCode(value) } }/>
        </div>
        <div className="flex justify-between mt-4">
          <PrimaryButton text={"Submit"} loading={loading} css="w-full" onClick={()=>Verify2FA()}/>
          {/* <button className="text-blue-600 underline">Start Over</button> */}
          {/* <button className="bg-blue-600 text-white px-4 py-2 rounded">Verify</button> */}
        </div>
      </div>
    );
  };
  return (
    <ModalTemplate onClose={() => close()}>
      {currentDisplay === "QRCode" && QRCodeScan()}
      {currentDisplay === "Manual" && ManualSetup()}
      {currentDisplay === "Code" && CodeEntry()}


      
      </ModalTemplate>
  )
}

export default TwoFactorAuthModal
