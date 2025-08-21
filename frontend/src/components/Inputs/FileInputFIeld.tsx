/** @format */

import React, { useId, useState } from "react";
import { FormikProps } from "formik";
import { FileUp, Loader2 } from "lucide-react";
import Label from "@/components/Inputs/Label";
import Toast from "@/components/Toast";
import { cn } from "@/utils";

type UploadResult =
  | string
  | { value?: any; url?: string; name?: string; [k: string]: any }
  | undefined;

type ValueMapper = (file: File, result?: UploadResult) => any;

interface FileInputProps {
  formik: FormikProps<any>;

  name: string;
  label: string | React.ReactNode;
  info?: string | React.ReactNode;
  disabled?: boolean;
  accept?: string;
  allowedTypes?: string[];
  uploadFile?: (file: File) => Promise<UploadResult>;
  autoUpload?: boolean;
  valueMapper?: ValueMapper;
  className?: string;

  placeholder?: string;
}

const DEFAULT_ALLOWED = [
  "application/pdf",
  "image/jpeg",
  "image/jpg",
  "image/png",
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

const FileInputField: React.FC<FileInputProps> = ({
  formik,
  name,
  label,
  info,
  disabled,
  uploadFile,
  autoUpload = true,
  valueMapper = defaultValueMapper,
  accept = ".pdf, .jpg, .jpeg, .png",
  allowedTypes = DEFAULT_ALLOWED,
  placeholder = "Upload (png, jpeg, jpg, pdf only)",
  className,
}) => {
  const inputId = useId();
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target?.files?.[0];
    if (!f) return;

    // reset UI state for a new selection
    setSuccess(false);
    setFileName("");

    if (!allowedTypes.includes(f.type)) {
      const msg = "Only PDF, JPEG/JPG, or PNG are allowed";
      Toast.warning(msg, "Document type");
      setFieldFail(msg);
      e.target.value = ""; // reset the input
      if (!autoUpload) {
        formik.setErrors({ [name]: msg });
      }
      return;
    }

    setFileName(f.name);
    formik.setFieldTouched(name, true, false);

    // If no uploader or autoUpload=false → just set the File (parent can upload on submit)
    if (!uploadFile || autoUpload === false) {
      formik.setFieldValue(name, f, true);
      setFieldOk(f);
      return;
    }

    // Upload immediately
    try {
      setLoading(true);
      const result = await uploadFile(f);
      const value = valueMapper(f, result);

      setFieldOk(value);
      Toast.success("Document uploaded successfully", "Upload");
    } catch (err: any) {
      const msg = err?.message || "Failed to upload document";
      setFieldFail(msg);
      Toast.error(msg, "Upload");
      // keep filename visible but show error style
    } finally {
      setLoading(false);
    }
  };

  // Dynamic styles
  const boxStateClasses = hasFormikError
    ? "!border-red-400 !bg-red-500/10 !text-red-600"
    : success
    ? "!border-emerald-400 !bg-emerald-500/10 !text-emerald-700"
    : "text-gray-500";

  return (
    <div className={cn(className)}>
      <Label text={label} className="" />
      <div className="file-upload-container py-2">
        <label
          htmlFor={inputId}
          className={cn(
            "file-upload-box",
            boxStateClasses,
            (loading || disabled) &&
              "opacity-50 !pointer-events-none !bg-[#f1f1f1]"
          )}
        >
          {loading ? (
            <Loader2 className="animate-spin size-6" />
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
            disabled={disabled || loading}
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
  );
};

export default FileInputField;
