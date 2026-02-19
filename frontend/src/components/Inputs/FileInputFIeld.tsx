/** @format */

import React, { useId, useRef, useState } from "react";
import { FormikProps } from "formik";
import { FileUp, Loader2 } from "lucide-react";
import Label from "@/components/Inputs/Label";
import Toast from "@/components/Toast";
import { cn } from "@/utils";
import { heicTo, isHeic } from "heic-to";
import ReactCrop, { type Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import ModalTemplate from "../Modals/ModalTemplate";
import { Button } from "../ui/Button";
import { uploadFile } from "@/redux/actions/generalActions";

type UploadResult =
  | string
  | { value?: any; url?: string; name?: string; [k: string]: any }
  | undefined;

type ValueMapper = (file: File, result?: UploadResult) => any;

interface FileInputProps {
  formik: FormikProps<any>;
  name: string;
  label?: string;
  info?: string;
  disabled?: boolean;
  uploadFile?: (file: File) => Promise<any>;
  autoUpload?: boolean;
  valueMapper?: (file: File, result: any) => any;
  accept?: string;
  allowedTypes?: string[];
  maxSizeMB?: number;
  placeholder?: string;
  className?: string;
  // Crop options
  cropAspect?: number; // Aspect ratio for cropping (e.g., 1 for square, 16/9 for wide, etc.)
  cropMinWidth?: number;
  cropMinHeight?: number;
}

const DEFAULT_ALLOWED = [
  "application/pdf",
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/heif",
  "image/heic",
];

const defaultValueMapper: ValueMapper = (file, result) => {
  if (typeof result === "string") return result;
  if (
    result &&
    typeof result === "object" &&
    "value" in result &&
    result.value !== undefined
  )
    return (result as any).value;
  return file; // fallback
};

// Props interface

const FileInputField: React.FC<FileInputProps> = ({
  formik,
  name,
  label,
  info,
  disabled,
  autoUpload = true,
  valueMapper = defaultValueMapper,
  accept = ".pdf, .jpg, .jpeg, .png, image/*",
  allowedTypes = DEFAULT_ALLOWED,
  maxSizeMB = 0.7,
  placeholder = "Upload (png, jpeg, jpg, pdf only)",
  className,
  cropAspect,
  cropMinWidth = 100,
  cropMinHeight = 100,
}) => {
  const inputId = useId();
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isConverting, setIsConverting] = useState(false);

  // Crop modal states
  const [showCropModal, setShowCropModal] = useState(false);
  const [cropSrc, setCropSrc] = useState<string | undefined>(undefined);
  const [cropFile, setCropFile] = useState<File | undefined>(undefined);
  const [crop, setCrop] = useState<Crop>({
    unit: "%",
    width: 90,
    height: 90,
    x: 5,
    y: 5,
  });
  const [completedCrop, setCompletedCrop] = useState<Crop | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const hasFormikError =
    Boolean(formik.touched[name]) && Boolean(formik.errors[name]);
  const errorText =
    (formik.touched[name] && (formik.errors[name] as string)) || "";

  const setFieldOk = (val: any) => {
    setSuccess(true);
    formik.setFieldValue(name, val, true);
    formik.setFieldError(name, undefined);
  };

  const setFieldFail = (msg: string) => {
    setSuccess(false);
    formik.setFieldTouched(name, true, false);
    formik.setFieldError(name, msg);
  };

  const clearFiedError = () => {
    formik.setFieldError(name, undefined);
    setFileName("");
  };

  // Function to get cropped image blob
  const getCroppedImg = async (
    image: HTMLImageElement,
    crop: Crop,
  ): Promise<Blob> => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) throw new Error("No 2d context");

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = crop.width!;
    canvas.height = crop.height!;

    ctx.drawImage(
      image,
      crop.x! * scaleX,
      crop.y! * scaleY,
      crop.width! * scaleX,
      crop.height! * scaleY,
      0,
      0,
      crop.width!,
      crop.height!,
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Canvas is empty"));
            return;
          }
          resolve(blob);
        },
        "image/jpeg",
        0.9, // Quality
      );
    });
  };

  // Handle crop confirmation
  const handleCropConfirm = async () => {
    if (!imgRef.current || !completedCrop || !cropFile) return;

    try {
      const croppedBlob = await getCroppedImg(imgRef.current, completedCrop);
      const croppedFile = new File(
        [croppedBlob],
        cropFile.name.replace(/\.[^/.]+$/, "") + "_cropped.jpg",
        { type: "image/jpeg" },
      );

      // Close modal
      setShowCropModal(false);
      setCropSrc(undefined);
      setCropFile(undefined);

      // Process the cropped file
      await processFileForUpload(croppedFile);
    } catch (error) {
      console.error("Error cropping image:", error);
      Toast.error("Failed to crop image", "Crop Error");
      setShowCropModal(false);
      setCropSrc(undefined);
      setCropFile(undefined);
    }
  };

  // Handle crop cancel
  const handleCropCancel = () => {
    setShowCropModal(false);
    setCropSrc(undefined);
    setCropFile(undefined);
    // Reset file input
    const input = document.getElementById(inputId) as HTMLInputElement;
    if (input) input.value = "";
  };

  // Process file for upload (common logic for both cropped and non-cropped files)
  const processFileForUpload = async (file: File) => {
    setFileName(file.name);
    formik.setFieldTouched(name, true, false);

    // If no uploader or autoUpload=false → just set the File
    if (autoUpload === false) {
      formik.setFieldValue(name, file, true);
      setFieldOk(file);
      return;
    }

    // Upload immediately
    try {
      setLoading(true);
      clearFiedError();
      const fileTo64 = await fileToBase64(file);
      const data = {
        image: fileTo64,
        fileName: file.name.replace(/\s/g, ""),
        contentType: file.type,
      };
      const result: string = await uploadFile(data);
      // const value = valueMapper(file, result);
      setFieldOk(result);
      Toast.success("Document uploaded successfully", "Upload");
    } catch (err: any) {
      const msg = "Failed to upload document";
      setFieldFail(msg);
      Toast.error(msg, "Upload");
      // Reset file input
      const input = document.getElementById(inputId) as HTMLInputElement;
      if (input) input.value = "";
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    let file = e.target?.files?.[0];
    if (!file) return;

    // Reset UI state for a new selection
    setSuccess(false);
    setFileName("");

    // Validate file type
    if (!allowedTypes.includes(file.type)) {
      const msg = "Only PDF, JPEG/JPG, or PNG are allowed";
      Toast.warning(msg, "Document type");
      setFieldFail(msg);
      e.target.value = ""; // reset the input
      if (!autoUpload) {
        formik.setErrors({ [name]: msg });
      }
      return;
    }

    // Validate file size
    const maxBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxBytes) {
      const friendlySize = `${maxSizeMB}MB`;
      const msg = `File is too large. Maximum allowed size is ${friendlySize}`;
      Toast.warning(msg, "File size");
      setFieldFail(msg);
      e.target.value = ""; // reset the input
      if (!autoUpload) {
        formik.setErrors({ [name]: msg });
      }
      return;
    }

    // Handle HEIC conversion
    const isHeicFile = await isHeic(file);
    if (isHeicFile) {
      setIsConverting(true);
      const response = await heicTo({
        blob: file,
        type: "image/png",
        quality: 0.8,
      });

      if (response) {
        file = new File([response], file.name.replace(/\.[^/.]+$/, ".png"), {
          type: "image/png",
        });
        setIsConverting(false);
      } else {
        const msg = "Failed to convert HEIC image.";
        Toast.error(msg, "File conversion");
        setFieldFail(msg);
        e.target.value = ""; // reset the input
        setIsConverting(false);
        return;
      }
    }

    // Check if file is an image (not PDF) to show crop modal
    const isImage =
      file.type.startsWith("image/") && file.type !== "application/pdf";

    if (isImage && autoUpload) {
      // For images, show crop modal
      const reader = new FileReader();
      reader.onload = () => {
        setCropSrc(reader.result as string);
        setCropFile(file);
        setShowCropModal(true);
      };
      reader.readAsDataURL(file);
    } else {
      // For PDFs or if no upload function, process directly
      await processFileForUpload(file);
    }
  };

  // Dynamic styles
  const boxStateClasses = hasFormikError
    ? "!border-red-400 !bg-red-500/10 !text-red-600"
    : success
      ? "!border-emerald-400 !bg-emerald-500/10 !text-emerald-700"
      : "text-gray-500";

  return (
    <>
      <div className={cn(className)}>
        <Label text={label} className="" />
        <div className="file-upload-container py-2">
          <label
            htmlFor={inputId}
            className={cn(
              "file-upload-box",
              boxStateClasses,
              (loading || disabled) &&
                "opacity-50 !pointer-events-none !bg-[#f1f1f1]",
            )}
          >
            {loading ? (
              <Loader2 className="animate-spin size-6" />
            ) : isConverting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="animate-spin size-6" /> Converting...
              </span>
            ) : (
              <FileUp className="size-6" />
            )}
            <span className="text-xs mt-2">
              {loading ? "Uploading document..." : fileName || placeholder}
              {!hasFormikError &&
                success &&
                autoUpload &&
                " Upload successful"}{" "}
              {hasFormikError && autoUpload && " Upload unsuccessful"}
            </span>

            <input
              id={inputId}
              name={name}
              type="file"
              accept={accept}
              onChange={handleFileChange}
              className="file-upload-input hidden"
              disabled={disabled || loading || isConverting}
            />
          </label>

          {hasFormikError && (
            <p className="text-xs mt-2 self-start text-red-500">{errorText}</p>
          )}
        </div>

        {info && (
          <span className="text-left flex justify-start items-start text-[12px] text-[#707D96]">
            {info}
          </span>
        )}
      </div>

      {/* Crop Modal */}

      <ModalTemplate
        isOpen={showCropModal}
        onClose={handleCropCancel}
        key={"Crop Image"}
        className="sm:!max-w-4xl"
      >
        <div>
          <h3 className="text-lg font-semibold mb-4">Crop Image</h3>

          <div className="mb-6 max-h-[70vh] overflow-auto">
            {cropSrc && (
              <ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={cropAspect}
                minWidth={cropMinWidth}
                minHeight={cropMinHeight}
              >
                <img
                  ref={imgRef}
                  src={cropSrc}
                  alt="Crop preview"
                  className="max-w-full"
                />
              </ReactCrop>
            )}
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={handleCropCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
            >
              Cancel
            </button>
            <Button
              type="button"
              onClick={handleCropConfirm}
              className="px-4 py-2 text-sm font-medium  rounded-md"
            >
              Crop & Upload
            </Button>
          </div>
        </div>
      </ModalTemplate>
    </>
  );
};

export default FileInputField;

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};
