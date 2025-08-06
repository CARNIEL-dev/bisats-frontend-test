import React from "react";
import { docUpload } from "@/assets/icons";
import Label from "@/components/Inputs/Label";
import { cn } from "@/utils";

interface TFileInput {
  fileName: string;
  handleFileChange: (e: any) => void;
  error: string | boolean | undefined;
  loading?: boolean;
  label: string | React.ReactNode;
  info?: string | React.ReactNode;
  disabled?: boolean;
}

const FileInput: React.FC<TFileInput> = ({
  fileName,
  handleFileChange,
  error,
  loading,
  label,
  info,
  disabled,
}) => {
  return (
    <div>
      <div className="my-3">
        <Label text={label} css={""} />
        <div className={`file-upload-container py-2 `}>
          <label
            htmlFor="file-upload"
            className={cn("file-upload-box", error && "!border-red-400")}
          >
            <img
              className="file-upload-icon w-[24px] h-[24px]"
              src={docUpload}
            />
            <span className="file-upload-text text-[13px] text-[#424A59] leading-[24px]">
              {loading
                ? "Uploading document..."
                : fileName || "Upload (png, jpeg, jpg, pdf only)"}
            </span>

            <input
              id="file-upload"
              type="file"
              accept=".pdf, .jpg, .jpeg"
              onChange={handleFileChange}
              className="file-upload-input"
              disabled={disabled}
            />
          </label>
          {error && (
            <p className="text-xs mt-2 self-start text-red-500">{error}</p>
          )}
        </div>
        {info && (
          <span className="text-left flex justify-start  items-start text-[12px] text-[#707D96] ">
            {info}
          </span>
        )}
      </div>
    </div>
  );
};

export default FileInput;
