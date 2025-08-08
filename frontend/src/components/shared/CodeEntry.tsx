import PrimaryInput from "@/components/Inputs/PrimaryInput";
import { PrimaryButton } from "@/components/buttons/Buttons";
import React from "react";

type Props = {
  setCode: React.Dispatch<React.SetStateAction<string>>;
  onClick: () => Promise<void>;
  loading: boolean;
};

// HDR: Code Entry
const CodeEntry = ({ setCode, onClick, loading }: Props) => {
  return (
    <div className="p-6 max-w-md mx-auto bg-white  text-center space-y-4">
      <h2 className="text-xl font-semibold">Enter code</h2>
      <p className="text-gray-500 text-sm">
        Enter the 6-digit code for "BISATAS" generated from your authenticator.
      </p>
      <div className="flex justify-center gap-2">
        <PrimaryInput
          className={"w-full"}
          label={"Code"}
          max={4}
          error={undefined}
          touched={undefined}
          onChange={(e) => {
            let value = e.target.value.replace(/\D/g, "");
            setCode(value);
          }}
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
