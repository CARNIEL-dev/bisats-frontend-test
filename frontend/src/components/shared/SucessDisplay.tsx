import { Check } from "lucide-react";
import { PrimaryButton } from "../buttons/Buttons";

const SucessDisplay = ({
  heading,
  subheading,
  onClick,
}: {
  heading: string;
  subheading?: string;
  onClick: () => void;
}) => {
  return (
    <div className="flex items-center flex-col gap-4 w-full">
      <div className="size-10 rounded-full flex items-center justify-center bg-green-500">
        <Check className="size-[25px] text-white" />
      </div>
      <div>
        <h4 className="md:text-xl text-lg font-semibold text-gray-700">
          {heading}
        </h4>
        <p className=" text-gray-500 text-sm">{subheading}</p>
      </div>

      <div className="w-1/2 mx-auto mb-3">
        <PrimaryButton
          className={"w-full"}
          text={"Continue"}
          loading={false}
          onClick={onClick}
        />
      </div>
    </div>
  );
};

export default SucessDisplay;
