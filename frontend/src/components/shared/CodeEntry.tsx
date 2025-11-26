import PrimaryInput from "@/components/Inputs/PrimaryInput";
import { PrimaryButton } from "@/components/buttons/Buttons";
import React from "react";

type Props = {
  code: string;
  setCode: React.Dispatch<React.SetStateAction<string>>;
  onClick: () => Promise<void>;
  loading: boolean;
  enable: boolean;
};

// HDR: Code Entry
const CodeEntry = ({ setCode, onClick, loading, code, enable }: Props) => {
  return (
    <div className="p-6 max-w-md mx-auto  text-center space-y-4">
      <h2 className="text-xl font-semibold">
        {!enable ? "Disable" : "Enter"} code
      </h2>
      <p className="text-gray-500 text-sm">
        Enter the 6-digit code for "BISATS" generated from your authenticator.
      </p>
      <div className="flex items-center gap-2">
        <PrimaryInput
          type="code"
          otpLength={6}
          label={"Code"}
          error={undefined}
          touched={undefined}
          name={"code"}
          value={code}
          onChange={(e) => {
            let value = e.target.value.replace(/\D/g, "");
            setCode(value);
          }}
          className="w-fit mx-auto"
        />
      </div>
      <div className="flex justify-between mt-4">
        <PrimaryButton
          text={"Submit"}
          loading={loading}
          className="w-full"
          onClick={onClick}
          disabled={loading}
        />
      </div>
    </div>
  );
};

export default CodeEntry;
