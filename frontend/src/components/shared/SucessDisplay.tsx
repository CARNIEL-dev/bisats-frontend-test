import { Check } from "lucide-react";
import { PrimaryButton } from "@/components/buttons/Buttons";
import { Link } from "react-router-dom";
import { APP_ROUTES } from "@/constants/app_route";
import { cn } from "@/utils";
import { buttonVariants } from "@/components/ui/Button";

const SucessDisplay = ({
  heading,
  subheading,
  onClick,
  user,
}: {
  heading: string;
  subheading?: string;
  onClick: () => void;
  user: TUser | { [key: string]: any };
}) => {
  const isPending =
    (user.accountLevel === "level_1" && user.kyc.bvnVerified) ||
    (user.accountLevel === "level_2" &&
      user.kyc.bvnVerified &&
      !user.hasAppliedToBecomeAMerchant);

  return (
    <div className="flex items-center flex-col gap-4 w-full">
      <div className="size-10 rounded-full flex items-center justify-center bg-amber-300">
        <Check className="size-[25px] text-white" />
      </div>
      <div>
        <h4 className="md:text-xl text-lg font-semibold text-gray-700">
          {heading}
        </h4>
        <p className=" text-gray-500 text-sm">{subheading}</p>
      </div>

      <div className="w-1/2 mx-auto mb-3">
        {isPending ? (
          <Link
            className={cn(buttonVariants({}), "w-full py-4 h-fit text-sm")}
            to={APP_ROUTES.DASHBOARD}
          >
            Back to Dashboard
          </Link>
        ) : (
          <PrimaryButton
            className={"w-full"}
            text={"Continue"}
            loading={false}
            onClick={onClick}
            disabled={isPending}
          />
        )}
      </div>
    </div>
  );
};

export default SucessDisplay;
