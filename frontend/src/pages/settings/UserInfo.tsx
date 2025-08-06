import { useSelector } from "react-redux";
import { WhiteTransparentButton } from "@/components/buttons/Buttons";
import PrimaryInput from "@/components/Inputs/PrimaryInput";
import { UserState } from "@/redux/reducers/userSlice";
import { useState } from "react";
import { UpdateUserName } from "@/redux/actions/userActions";
import Toast from "@/components/Toast";
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
      value: user?.email,
    },

    {
      label: "Phone Number",
      value: user?.phoneNumberVerified
        ? user?.phoneNumber
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
          css="px-7"
          size="sm"
          onClick={() => onSubmit()}
        />
      </div>
      <div className="my-5">
        <div className="w-full mb-5">
          <PrimaryInput
            css={"w-full py-3"}
            placeholder={user?.userName}
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

        <div>
          {UserData.map((data, idx) => (
            <div
              className="flex  justify-between text-[16px] leading-[28px] font-normal mb-5"
              key={idx}
            >
              <p className="text-[#606C82]">{data.label}</p>
              <p
                className={`${
                  data.label === "KYC Status" && data.value === "Verified"
                    ? "text-[#17A34A]"
                    : "text-[#707D96]"
                } flex items-center`}
              >
                {data.value}{" "}
                <div
                  className={`${
                    (user?.accountLevel === "level_1" ||
                      user?.accountLevel === "level_2" ||
                      user?.accountLevel === "level_3") &&
                    "w-[4px] h-[4px] rounded-full  bg-[#BBF7D0] "
                  } mx-1`}
                ></div>
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
