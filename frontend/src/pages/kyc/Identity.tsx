import { MultiSelectDropDown } from "@/components/Inputs/MultiSelectInput";
import PrimaryInput from "@/components/Inputs/PrimaryInput";
import { PrimaryButton } from "@/components/buttons/Buttons";
import StepFlow from "./StepFlow";
import { useEffect, useRef, useState } from "react";
import Toast from "@/components/Toast";
import { useFormik } from "formik";
import { PostIdentity_KYC, rehydrateUser } from "@/redux/actions/userActions";
import { APP_ROUTES } from "@/constants/app_route";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { UserState } from "@/redux/reducers/userSlice";
import FileInput from "@/components/Inputs/FileInput";
import { IdentificationSchema } from "@/formSchemas";
import Label from "@/components/Inputs/Label";

const DocTypes = [
  {
    label: "International passport",
    value: "passport",
  },
  {
    label: "Driver's liscence",
    value: "driver-liscense",
  },
  {
    label: "National Identity Number",
    value: "nin",
  },
];
const Identity = () => {
  const navigate = useNavigate();
  const [file1Name, setFile1Name] = useState("");

  const user = useSelector((state: { user: UserState }) => state.user);

  useEffect(() => {
    if (user?.user?.kyc.identificationVerified) {
      navigate(APP_ROUTES.KYC.BVNVERIFICATION);
    }
  }, [user]);

  const formik = useFormik({
    initialValues: { docType: "", identificationNo: "", selfie: "" },
    validationSchema: IdentificationSchema,
    onSubmit: async (values) => {
      const { ...payload } = values;
      const payloadd = {
        ...payload,
        userId: user?.user?.userId,
      };
      const response = await PostIdentity_KYC(payloadd);

      if (response.statusCode === 200) {
        Toast.success("Success", response.message);
        rehydrateUser();
        window.location.href = APP_ROUTES.DASHBOARD;
      } else {
        Toast.error("Error", response.message);
      }
    },
  });

  const handleFile1Change = (e: any) => {
    formik.setErrors({ selfie: "" });
    const file1 = e.target?.files[0];

    if (file1) {
      const allowedTypes = ["application/pdf", "image/jpeg", "image/jpg"];
      if (allowedTypes.includes(file1.type)) {
        setFile1Name(file1.name);
        formik.setFieldValue("selfie", file1);
      } else {
        Toast.warning(
          "Only pdf, jpeg | jpg formats are allowed",
          "Document type"
        );
        setFile1Name("");

        formik.setErrors({
          selfie: "Only pdf, jpeg | jpg formats are allowed",
        });
      }
    }
  };

  return (
    <div className="py-3 px-5">
      <div className="w-full">
        <StepFlow step={3} />
      </div>
      <form onSubmit={formik.handleSubmit}>
        <MultiSelectDropDown
          parentId={""}
          placeholder="Select"
          choices={DocTypes}
          label="Document"
          handleChange={(prop) => formik.setFieldValue("docType", prop)}
          error={formik.errors.docType}
          touched={formik.touched.docType}
        />
        <div className="w-full my-4 ">
          <PrimaryInput
            className="w-full h-[48px]"
            name="identificationNo"
            placeholder="Enter the identification number on your selected document type"
            label={"Identification Number"}
            error={formik.errors.identificationNo}
            touched={formik.touched.identificationNo}
            value={formik.values.identificationNo}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </div>
        <div className="my-4">
          <div>
            <FileInput
              fileName={file1Name}
              handleFileChange={handleFile1Change}
              error={formik.errors.selfie}
              label={"Upload the selected document"}
              disabled={user?.kyc?.utilityBillVerified}
            />
          </div>
        </div>

        <div className="my-4">
          <PrimaryButton
            className={"w-full"}
            text={"Continue"}
            loading={formik.isSubmitting}
          />
        </div>
      </form>
    </div>
  );
};
export default Identity;

const SelfieSnap = () => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  function base64ToFile(base64String: string, fileName: string): File {
    // Split the base64 string into parts
    const [header, base64Data] = base64String.split(",");

    // Get the MIME type from the header (e.g., "image/jpeg")
    const mimeType = header.match(/:(.*?);/)?.[1] || "application/octet-stream";

    // Decode the Base64 string into a binary array
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    // Create a Uint8Array from the byte numbers
    const byteArray = new Uint8Array(byteNumbers);

    // Create a File object
    return new File([byteArray], fileName, { type: mimeType });
  }

  const startCamera = async () => {
    setIsCapturing(true);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      console.error("Error accessing camera: ", err);
      alert("Camera access is required to take a selfie.");
    }
  };

  const captureSelfie = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      console.log(video, canvas);
      const context = canvas.getContext("2d");
      context?.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageDataUrl = canvas.toDataURL("image/jpeg");
      const file = base64ToFile(imageDataUrl, "user-image.jpg");
      setCapturedImage(imageDataUrl);
      //   formik.setFieldValue("selfie", file);
      stopCamera();
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      setIsCapturing(false);
    }
  };
  return (
    <div className="py-4">
      <Label text={"Take a selfie"} className={""} />
      <div className="file-upload-container my-4">
        {isCapturing ? (
          <div className="camera-container relative">
            <video
              ref={videoRef}
              autoPlay
              muted
              className="video-feed w-full max-w-md border border-gray-300 rounded-lg"
            ></video>
            <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
            <button
              type="button" // Prevents form submission
              onClick={captureSelfie}
              className="capture-button mt-4 bg-blue-500 text-white px-4 py-2 rounded"
            >
              Capture Selfie
            </button>
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              onClick={stopCamera}
              className=" absolute top-2 right-2 cursor-pointer"
            >
              <rect width="20" height="20" rx="10" fill="#F3F4F6" />
              <path
                d="M10.0025 8.82208L13.538 5.28653C13.8635 4.96109 14.3911 4.96109 14.7165 5.28653C15.042 5.61196 15.042 6.13959 14.7165 6.46502L11.181 10.0006L14.7165 13.5361C15.042 13.8615 15.042 14.3891 14.7165 14.7146C14.3911 15.04 13.8635 15.04 13.538 14.7146L10.0025 11.1791L6.46698 14.7146C6.14154 15.04 5.61391 15.04 5.28848 14.7146C4.96304 14.3892 4.96304 13.8615 5.28848 13.5361L8.82404 10.0006L5.28847 6.46503C4.96304 6.13959 4.96304 5.61196 5.28847 5.28652C5.61391 4.96108 6.14154 4.96108 6.46698 5.28652L10.0025 8.82208Z"
                fill="#707D96"
              />
            </svg>
          </div>
        ) : capturedImage ? (
          <div className="selfie-preview my-4 w-full lg:w-[442px] mx-auto relative">
            <img
              src={capturedImage}
              alt="Selfie Preview"
              className="selfie-image w-full max-w-xs rounded-lg"
            />
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              onClick={() => {
                stopCamera();
                startCamera();
              }}
              className=" absolute top-2 right-2 cursor-pointer"
            >
              <rect width="20" height="20" rx="10" fill="#F3F4F6" />
              <path
                d="M10.0025 8.82208L13.538 5.28653C13.8635 4.96109 14.3911 4.96109 14.7165 5.28653C15.042 5.61196 15.042 6.13959 14.7165 6.46502L11.181 10.0006L14.7165 13.5361C15.042 13.8615 15.042 14.3891 14.7165 14.7146C14.3911 15.04 13.8635 15.04 13.538 14.7146L10.0025 11.1791L6.46698 14.7146C6.14154 15.04 5.61391 15.04 5.28848 14.7146C4.96304 14.3892 4.96304 13.8615 5.28848 13.5361L8.82404 10.0006L5.28847 6.46503C4.96304 6.13959 4.96304 5.61196 5.28847 5.28652C5.61391 4.96108 6.14154 4.96108 6.46698 5.28652L10.0025 8.82208Z"
                fill="#707D96"
              />
            </svg>
          </div>
        ) : (
          <label
            onClick={startCamera}
            className="file-upload-box cursor-pointer"
          >
            {/* <img className="file-upload-icon w-[24px] h-[24px]" src={camera} /> */}
            <span className="file-upload-text text-[14px] text-[#424A59] leading-[24px]">
              {capturedImage ? "Selfie Captured" : "Open Camera"}
            </span>
          </label>
        )}
        {/* {formik.errors.selfie && (
              <p className="error-text capitalize">{formik.errors.selfie}</p>
            )} */}
      </div>
    </div>
  );
};
