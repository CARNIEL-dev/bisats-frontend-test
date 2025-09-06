import StudentCard from "@/assets/student-card.svg";
import { APP_ROUTES } from "@/constants/app_route";

import { useSelector } from "react-redux";

import { formatCompactNumber } from "@/utils";
import { bisats_limit } from "@/utils/transaction_limits";
import { useMemo } from "react";
import { PrimaryButton, RedTransparentButton } from "../buttons/Buttons";
import ModalTemplate from "./ModalTemplate";

interface Props {
  close: () => void;
}
const KycUpgrade: React.FC<Props> = ({ close }) => {
  const userState: UserState = useSelector((state: any) => state.user);
  const user = userState;

  const userLevel =
    user?.user?.accountLevel === "level_1" || !user?.user?.accountLevel
      ? "level_2"
      : "level_3";

  const limit = bisats_limit[userLevel as keyof typeof bisats_limit];

  const clickHandler = () => {
    if (!user?.user?.phoneNumberVerified) {
      window.location.href = APP_ROUTES.KYC.PHONEVERIFICATION;
    } else if (!user.kyc?.personalInformationVerified) {
      window.location.href = APP_ROUTES.KYC.PERSONAL;
    } else if (!user?.kyc.identificationVerified) {
      window.location.href = APP_ROUTES.KYC.IDENTITY;
    } else if (!user?.kyc?.bvnVerified) {
      window.location.href = APP_ROUTES.KYC.BVNVERIFICATION;
    } else {
      window.location.href = APP_ROUTES.KYC.LEVEL3VERIFICATION;
    }
  };

  const account_level_features = useMemo(() => {
    return [
      `Create sell ads (max ${formatCompactNumber(
        limit.maximum_ad_creation_amount
      )} xNGN in crypto assets)`,
      `Create buy ads (max ${formatCompactNumber(
        limit.maximum_ad_creation_amount
      )} xNGN in crypto assets)`,
      `Max daily limit for withdrawal is ${
        user?.user?.accountLevel === "level_3"
          ? "Unlimited"
          : formatCompactNumber(limit.daily_withdrawal_limit_fiat)
      } xNGN and ${formatCompactNumber(
        limit.daily_withdrawal_limit_crypto
      )} USD in crypto assets`,
    ];
  }, [limit]);

  return (
    <ModalTemplate onClose={close}>
      <div className="flex flex-col justify-center w-full text-center mx-auto">
        <img
          src={StudentCard}
          alt="student-card"
          className="w-[80px] h-[60px] mx-auto mt-7"
        />
        <h1 className="text-[#0A0E12] text-[18px] leading-[32px] lg:text-[18px] lg:leading-[32px] font-semibold ">
          Account Upgrade Required
        </h1>
        <p className="text-[#606C82] text-[14px] leading-[24px] lg:text-[14px] lg:leading-[24px] font-normal my-3">
          To proceed with this action, we need you to upgrade your account to a{" "}
          <span className="text-[#17A34A] font-bold">
            {user?.user?.accountLevel === "level_1"
              ? "Merchant"
              : "Super Merchant"}
          </span>
          . Completing this upgrade will give you access to the following
          features :
        </p>
        <div className="bg-[#F9F9FB] p-2 my-5 w-fit text-left border border-[#F9F9FB] rounded-[8px] text-[12px] text-[#515B6E]  h-fit flex flex-col space-y-2 ">
          {account_level_features.map((feat, idx) => (
            <p className="flex items-center" key={idx}>
              <p className="w-[4px] bg-[#C2C7D2] rounded-[50%]  mr-1.5 h-[4px]"></p>
              <span>{feat}</span>
            </p>
          ))}
        </div>
        <PrimaryButton
          className={"w-full"}
          text={"Upgrade"}
          loading={false}
          onClick={clickHandler}
        />
        <RedTransparentButton
          className={"w-full my-3"}
          text={"Maybe Later"}
          loading={false}
          onClick={close}
        />
      </div>
    </ModalTemplate>
  );
};

export default KycUpgrade;
