import Label from "@/components/Inputs/Label";
import { cn } from "@/utils";
import { FileUp } from "lucide-react";
import React, { useState } from "react";
import Toast from "@/components/Toast";

interface TFileInput {
  fileName: string;
  handleFileChange: (e: any) => void;
  error: string | boolean | undefined;
  label: string | React.ReactNode;
  info?: string | React.ReactNode;
  disabled?: boolean;
}

const FileInput: React.FC<TFileInput> = ({
  // fileName,
  // handleFileChange,
  error,
  label,
  info,
  disabled,
}) => {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const [error1, setError] = useState("");

  const handleFileChange = (e: any) => {
    const file1 = e.target?.files[0];
    if (file1) {
      const allowedTypes = ["application/pdf", "image/jpeg", "image/jpg"];
      if (allowedTypes.includes(file1.type)) {
        setFileName(file1.name);
        setFile(file1);
      } else {
        Toast.warning(
          "Only pdf, jepeg an jpg formats are allowed",
          "Document type"
        );
        setFileName("");
        setError("Only pdf, jepeg an jpg formats are allowed");
      }
    }
  };

  return (
    <div>
      <div className="my-3">
        <Label text={label} className={""} />
        <div className={`file-upload-container py-2 `}>
          <label
            htmlFor="file-upload"
            className={cn(
              "file-upload-box text-gray-500",
              error && "!border-red-400 !bg-red-500/10 !text-red-600"
            )}
          >
            <FileUp className="size-6" />
            <span className="text-xs mt-2 ">
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
