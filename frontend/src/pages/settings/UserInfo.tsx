import { useSelector } from "react-redux";
import { WhiteTransparentButton } from "@/components/buttons/Buttons";
import PrimaryInput from "@/components/Inputs/PrimaryInput";
import { UserState } from "@/redux/reducers/userSlice";
import { useState } from "react";
import { UpdateUserName } from "@/redux/actions/userActions";
import Toast from "@/components/Toast";
import { cn, formatEmail, splitTextInMiddle } from "@/utils";
const UserInfo = () => {
  const userState: UserState = useSelector((state: any) => state.user);
  const user = userState.user;
  const [loading, setLoading] = useState(false);
  const [userDetails, setUserDetails] = useState({
    firstName: user?.firstName,
    lastName: user?.lastName,
    userName: "",
  });

  const onSubmit = async () => {
    setLoading(true);
    const response = await UpdateUserName(userDetails);
    setLoading(false);
    if (response.status) {
      Toast.success(response.message, "User Profile");
      return;
    } else {
      Toast.error(response.message, "User Profile");
      return;
    }
  };

  const UserData = [
    {
      label: "Full Name",
      value: `${user?.firstName ?? "-"} ${user?.middleName ?? "-"} ${
        user?.lastName ?? "-"
      }`,
    },

    {
      label: "Email Address",
      value: formatEmail({
        email: user?.email,
        maxChar: 4,
      }),
    },

    {
      label: "Phone Number",
      value: user?.phoneNumberVerified
        ? splitTextInMiddle({
            str: user?.phoneNumber,
            visibleChars: 5,
            ellipsis: "***",
          })
        : `Unverified : ${user?.phoneNumber}`,
    },
    {
      label: "KYC Status",
      value:
        user?.accountLevel === "level_1" ||
        user?.accountLevel === "level_2" ||
        user?.accountLevel === "level_3"
          ? "Verified"
          : "Unverified",
    },
  ];

  return (
    <div>
      <div className="flex justify-between">
        <h1 className="text-[22px] lg:text-[22px] leading-[32px] font-semibold text-[#2B313B]">
          User Information
        </h1>
        <WhiteTransparentButton
          text={"Save"}
          loading={loading}
          className="px-7"
          size="sm"
          onClick={() => onSubmit()}
        />
      </div>
      <div className="my-5">
        <div className="w-full mb-5">
          <PrimaryInput
            className="w-full py-3 placeholder:capitalize capitalize"
            defaultValue={user?.userName}
            label={"Display Name"}
            error={undefined}
            touched={undefined}
            onChange={(e) =>
              setUserDetails((prevState) => {
                return {
                  ...prevState,
                  userName: e.target.value,
                };
              })
            }
          />
        </div>

        <div className="flex flex-col gap-4">
          {UserData.map((data, idx) => (
            <div className="flex  justify-between font-normal" key={idx}>
              <p className="text-[#606C82]">{data.label}</p>
              <p
                className={cn(
                  "flex items-center",
                  data.label === "KYC Status" && data.value === "Verified"
                    ? "text-[#17A34A] font-semibold text-sm"
                    : "text-slate-500",
                  data.label === "Full Name" && "capitalize"
                )}
              >
                {data.value}{" "}
                <span
                  className={`${
                    data.label === "KYC Status" &&
                    (user?.accountLevel === "level_1" ||
                      user?.accountLevel === "level_2" ||
                      user?.accountLevel === "level_3") &&
                    "w-[4px] h-[4px] rounded-full  bg-[#BBF7D0] "
                  } mx-1`}
                ></span>
                {data.label === "KYC Status" && user?.accountLevel}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default UserInfo;
