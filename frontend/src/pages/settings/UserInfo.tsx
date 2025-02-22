import { WhiteTransparentButton } from "../../components/buttons/Buttons"
import Label from "../../components/Inputs/Label"
import PrimaryInput from "../../components/Inputs/PrimaryInput"

const UserInfo = () => {

    const UserData = [
        {
            label: "Full Name",
            value: "Chinelo Ubekwe"
        },
        {
            label: "User ID",
            value: "202213122"
        },
        {
            label: "Email Address",
            value: "Chi***24@gmail.com"
        },

        {
            label: "Phone Number",
            value: "0816 **** 981"
        },
        {
            label: "KYC Status",
            value: "Verified"
        },
    ]
    return (
        <div>
            <div className="flex justify-between">

                <h1 className="text-[22px] lg:text-[22px] leading-[32px] font-[600] text-[#2B313B]">User Information</h1>
                <WhiteTransparentButton text={"Save"} loading={false} css="px-7" size="sm" />
            </div>
            <div className="my-5">
                <div className="w-full mb-5">
                    <PrimaryInput css={"w-full py-3"} placeholder="Chinex" label={"Display Name"} error={undefined} touched={undefined} />
                </div>


                <div>
                    {UserData.map((data, idx) =>
                        <div className="flex  justify-between text-[16px] leading-[28px] font-[400] mb-5" key={idx}>
                            <p className="text-[#606C82]">
                                {data.label}

                            </p>
                            <p className={`${data.label === "KYC Status" ? "text-[#17A34A]" : "text-[#707D96]"} flex items-center`}>{data.value} <div className={`${data.label === "KYC Status" && "w-[4px] h-[4px] rounded-full  bg-[#BBF7D0] "} mx-1`}></div>{data.label === "KYC Status" && "Level 1"}</p>
                        </div>)}

                </div></div>


        </div>
    )
}
export default UserInfo
