import {
  PrimaryButton,
  WhiteTransparentButton,
} from "@/components/buttons/Buttons";
import ModalTemplate from "@/components/Modals/ModalTemplate";
import CodeEntry from "@/components/shared/CodeEntry";
import Toast from "@/components/Toast";
import PreLoader from "@/layouts/PreLoader";
import {
  Generate2FA_QRCODE,
  rehydrateUser,
  UpdateTwoFactorAuth,
} from "@/redux/actions/userActions";
import { UserState } from "@/redux/reducers/userSlice";
import { Check, Copy } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
interface Props {
  close: () => void;
  enable?: boolean;
  open?: boolean;
}
type TCurrentDisplay = "QRCode" | "Manual" | "Code";

const TwoFactorAuthModal: React.FC<Props> = ({
  close,
  enable = true,
  open = true,
}) => {
  const userState: UserState = useSelector((state: any) => state.user);
  const user = userState.user;
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [showQrLoading, setShowQrLoading] = useState(true);
  const [isCopied, setIsCopied] = useState(false);

  const [currentDisplay, setCurrentDisplay] = useState<TCurrentDisplay>(
    !enable ? "Code" : "QRCode"
  );
  const [qrImg, setQRImg] = useState("");
  const [qrSecret, setQRSecret] = useState("");

  const GetQRCode = async () => {
    const response = await Generate2FA_QRCODE(user?.userId);
    if (response?.status) {
      const img = response.data.qrcode;
      const secret = response.data.secret;
      setQRSecret(secret);
      setQRImg(img);
    } else {
      Toast.error("Unable to get QR Code", "");
    }
    setShowQrLoading(false);
  };

  const Verify2FA = async () => {
    setLoading(true);

    try {
      const verificationResponse = await UpdateTwoFactorAuth({
        userId: user?.userId,
        code,
        enable: enable,
      });
      if (!verificationResponse?.status) {
        Toast.error(verificationResponse.message, "2FA Verification failed");
      } else {
        Toast.success(
          verificationResponse.message,
          enable ? "2FA Enabled" : "2FA Disabled"
        );
      }
      setLoading(false);
      rehydrateUser();
      close();
    } catch (error) {
      setLoading(false);

      console.error("Error during 2FA verification:", error);
      Toast.error("An unexpected error occurred", "2FA Error");
    }
  };

  const formatKey = () => {
    return qrSecret
      ?.match(/.{1,4}/g)
      ?.join(" ")
      .toUpperCase();
  };

  const copyToClipboard = () => {
    setIsCopied(true);
    navigator.clipboard
      .writeText(qrSecret)
      .then(() => {
        Toast.info(qrSecret, "Copied to clipboard:");
      })
      .catch((err) => {
        Toast.error(err, "Failed to copy:");
      })
      .finally(() => {
        setTimeout(() => {
          setIsCopied(false);
        }, 3000);
      });
  };

  useEffect(() => {
    if (enable) {
      GetQRCode();
    }
  }, [enable]);

  // HDR: QR Scan
  const QRCodeScan = () => {
    return (
      <div className="p-6 max-w-md mx-auto  flex flex-col gap-4 text-center text-[#001140]">
        <div className="size-40 mx-auto">
          {showQrLoading ? (
            <PreLoader primary={false} />
          ) : (
            <img src={qrImg} alt="Scan QR Code" className=" w-full h-full" />
          )}
        </div>
        <h2 className="text-xl font-medium">Scan QRCode</h2>
        <p className="text-gray-500 text-sm">
          From your device, launch{" "}
          <span className="font-bold text-gray-800">Google Authenticator</span>,
          and scan the QRCode above. Hit done, when you’ve added the key above
          successfully.
        </p>
        <div className="flex justify-end gap-4 mt-4">
          <WhiteTransparentButton
            text={"Setup Manually"}
            loading={false}
            onClick={() => setCurrentDisplay("Manual")}
            className="px-3"
          />
          <PrimaryButton
            text={"Done"}
            loading={false}
            onClick={() => setCurrentDisplay("Code")}
            className="px-2"
          />
        </div>
      </div>
    );
  };

  //HDR: Manual Setup
  const ManualSetup = () => {
    const secretKey = formatKey();

    return (
      <div className="p-6 max-w-md mx-auto bg-white  flex flex-col gap-2 text-center">
        <div className="bg-blue-100 text-blue-800 p-3 rounded font-mono flex items-end">
          {secretKey}

          {isCopied ? (
            <Check className="ml-2 size-10 text-green-500" />
          ) : (
            <Copy
              role="button"
              tabIndex={0}
              className="ml-2 size-10"
              onClick={() => copyToClipboard()}
            />
          )}
        </div>

        <h2 className="text-xl font-semibold mt-4">Add manually</h2>
        <p className="text-gray-500 text-sm">
          Tap to copy the key above and paste it in your authenticator to start
          generating tokens. Hit done, when you’ve added the key above
          successfully.
        </p>

        <div className="flex justify-end gap-4 mt-4">
          <WhiteTransparentButton
            text={"Use QR"}
            loading={false}
            onClick={() => setCurrentDisplay("QRCode")}
            className="px-3"
          />
          <PrimaryButton
            text={"Done"}
            loading={false}
            onClick={() => setCurrentDisplay("Code")}
            className="px-2"
          />
        </div>
      </div>
    );
  };

  return (
    <ModalTemplate onClose={() => close()} isOpen={open}>
      {currentDisplay === "QRCode" && QRCodeScan()}
      {currentDisplay === "Manual" && ManualSetup()}
      {currentDisplay === "Code" && (
        <CodeEntry setCode={setCode} onClick={Verify2FA} loading={loading} />
      )}
    </ModalTemplate>
  );
};

export default TwoFactorAuthModal;
