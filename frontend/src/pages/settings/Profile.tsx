import { WhiteTransparentButton } from "@/components/buttons/Buttons";
import PrimaryInput from "@/components/Inputs/PrimaryInput";
import Divider from "@/components/shared/Divider";
import TextBox from "@/components/shared/TextBox";
import Toast from "@/components/Toast";
import { Button } from "@/components/ui/Button";
import DateInput from "@/components/ui/DatePicker";
import { UpdateUserName } from "@/redux/actions/userActions";

import { cn, formatEmail, splitTextInMiddle } from "@/utils";
import { goToNextKycRoute } from "@/utils/kycNavigation";
import dayjs from "dayjs";

import { useFormik } from "formik";
import { Edit, X } from "lucide-react";
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
const Profile = () => {
  const userState: UserState = useSelector((state: any) => state.user);
  const user = userState.user;
  const [isEditing, setIsEditing] = useState(false);

  const UserData = [
    {
      label: "Display Name",
      value: `${user?.userName ?? "- - -"}`,
    },
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
      label: "Date of Birth",
      value: user?.dateOfBirth
        ? dayjs(user?.dateOfBirth).format("MMMM D, YYYY")
        : "- - -",
    },

    {
      label: "Phone Number",
      value: user?.phoneNumberVerified
        ? splitTextInMiddle({
            str: user?.phoneNumber,
            visibleChars: 5,
            ellipsis: "***",
          })
        : `Unverified`,
    },
  ];

  const isBvnVerified = user?.kyc.bvnVerified;

  const InitialValue = useMemo(() => {
    return {
      userName: user?.userName || "",
      firstName: user?.firstName || "",
      middleName: user?.middleName || "",
      lastName: user?.lastName || "",
      dateOfBirth: user?.dateOfBirth || "",
    };
  }, [user]);

  const formik = useFormik({
    initialValues: InitialValue,
    validateOnMount: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      const { ...payload } = values;
      const payloadd = isBvnVerified
        ? {
            userName: payload.userName,
            userId: user?.userId,
          }
        : {
            ...payload,
            userId: user?.userId,
          };

      const response = await UpdateUserName(payloadd);
      if (response.status) {
        Toast.success(response.message, "User Profile");
        setIsEditing(false);
        return;
      } else {
        Toast.error(response.message, "User Profile");
        return;
      }
    },
  });

  const clickHandler = () => {
    goToNextKycRoute(userState);
  };

  const lastUserNameChange = user?.lastUserNameChange
    ? dayjs(user?.lastUserNameChange).fromNow()
    : null;

  //? Calculate next edit date (6 months from last change)
  const nextEdit = lastUserNameChange
    ? dayjs(user?.lastUserNameChange).add(6, "month")
    : null;

  //? Disable display name input if less than 6 months since last change
  const canEditDisplayName = !nextEdit || dayjs().isAfter(nextEdit);

  return (
    <>
      <div className="flex justify-between">
        <h3 className="text-[22px] lg:text-[22px] leading-[32px] font-semibold text-[#2B313B]">
          Profile
        </h3>

        {isEditing ? (
          <div className="flex items-center gap-2">
            <WhiteTransparentButton
              text={"Save"}
              loading={formik.isSubmitting}
              className="px-7"
              size="sm"
              disabled={
                formik.isSubmitting || (!canEditDisplayName && isBvnVerified)
              }
              onClick={() => formik.handleSubmit()}
            />
            <Button
              variant={"secondary"}
              size="sm"
              className={cn("text-gray-500 text-sm ")}
              onClick={() => setIsEditing(false)}
            >
              <X />
              <span>Cancel</span>
            </Button>
          </div>
        ) : (
          <Button
            variant={"ghost"}
            size="sm"
            className={cn(
              "text-gray-500 text-sm hover:bg-primary/20 rounded-full"
            )}
            onClick={() => setIsEditing(true)}
            disabled={!user?.accountLevel}
          >
            <Edit />
            <span>Edit</span>
          </Button>
        )}
      </div>
      <div className="my-6">
        <div className="flex flex-col gap-6">
          {isEditing ? (
            <div className="flex flex-col gap-4">
              <PrimaryInput
                className="w-full py-3 placeholder:capitalize capitalize"
                defaultValue={user?.userName}
                label={"Display Name"}
                error={undefined}
                touched={undefined}
                onChange={(e) =>
                  formik.setFieldValue("userName", e.target.value)
                }
                info="Your display name can only be edited once every 6 months"
                // info={
                //   nextEdit
                //     ? `Next edit available: ${nextEdit.format("MMMM D, YYYY")}`
                //     : "Your display name can only be edited once every 6 months"
                // }
                disabled={!canEditDisplayName}
              />
              {(lastUserNameChange || nextEdit) && (
                <div className="border space-y-1 font-medium bg-gray-50 rounded-md p-2 text-xs  w-fit shadow">
                  {lastUserNameChange && (
                    <p className="text-[#606C82] capitalize">
                      Changed: {lastUserNameChange}
                    </p>
                  )}
                  {nextEdit && (
                    <p className="text-[#606C82] capitalize">
                      Next edit: {nextEdit.format("MMMM D, YYYY")}
                    </p>
                  )}
                </div>
              )}
              {isBvnVerified && (
                <Divider
                  text="Bvn Verified : Not Editable"
                  className="mb-1 mt-5"
                  textClassName="bg-gray-100 text-center text-nowrap border  rounded-full"
                />
              )}
              <PrimaryInput
                className="w-full py-3 placeholder:capitalize capitalize"
                defaultValue={user?.firstName}
                label={"First Name"}
                error={undefined}
                touched={undefined}
                onChange={(e) => {
                  formik.setFieldValue("firstName", e.target.value);
                }}
                readOnly={isBvnVerified}
              />
              <PrimaryInput
                className="w-full py-3 placeholder:capitalize capitalize"
                defaultValue={user?.middleName}
                label={"Middle Name"}
                error={undefined}
                touched={undefined}
                onChange={(e) =>
                  formik.setFieldValue("middleName", e.target.value)
                }
                readOnly={isBvnVerified}
              />
              <PrimaryInput
                className="w-full py-3 placeholder:capitalize capitalize"
                defaultValue={user?.lastName}
                label={"Last Name"}
                error={undefined}
                touched={undefined}
                onChange={(e) =>
                  formik.setFieldValue("lastName", e.target.value)
                }
                readOnly={isBvnVerified}
              />

              <DateInput
                name="dateOfBirth"
                label={"Date of Birth"}
                value={user?.dateOfBirth ? user?.dateOfBirth : null}
                handleChange={(e) =>
                  formik.setFieldValue("dateOfBirth", String(e.target.value))
                }
                disabled={isBvnVerified}
              />
            </div>
          ) : (
            UserData.map((data, idx) => (
              <TextBox
                key={idx}
                label={data.label}
                value={
                  <p
                    className={cn(
                      "flex items-center gap-2",
                      data.label === "Full Name" && "capitalize"
                    )}
                  >
                    {data.value}
                  </p>
                }
                labelClass="text-gray-500"
              />
            ))
          )}

          <TextBox
            labelClass="text-gray-500"
            label="KYC Status"
            showIndicator={false}
            value={
              <>
                <div
                  className={cn(
                    "flex items-center gap-2 text-sm font-semibold",
                    user?.accountLevel ? "text-[#17A34A]" : "text-gray-500"
                  )}
                >
                  {user?.accountLevel ? "Verified" : "Unverified"}{" "}
                  <span
                    className={cn("size-[4px] rounded-full  bg-[#BBF7D0]")}
                  />
                  {user?.accountLevel ? (
                    <span className="capitalize">
                      {user?.accountLevel?.replace("_", " ")}
                    </span>
                  ) : (
                    <Button
                      size={"sm"}
                      variant="link"
                      className={cn(
                        "text-sm px-0 text-green-500 underline font-semibold"
                      )}
                      type="button"
                      onClick={clickHandler}
                    >
                      Verify Now
                    </Button>
                  )}
                </div>
              </>
            }
          />
        </div>
      </div>
    </>
  );
};
export default Profile;
