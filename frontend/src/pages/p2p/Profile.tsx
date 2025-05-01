import { isTemplateExpression } from "typescript"
import { PrimaryButton } from "../../components/buttons/Buttons"
import Header from "../../components/Header"


const Profile = () => {
    const kycStatus = [
        {
            type: "Email",
            verified: true
        },
        {
            type: "Phone no",
            verified: true
        },
        {
            type: "Govt ID",
            verified: true
        },
        {
            type: "BVN",
            verified: true
        },
        {
            type: "Proof of Address",
            verified: true
        },
        {
            type: "Source of wealth",
            verified: true
        },
        {
            type: "Proof of Profile",
            verified: true
        },

    ]

    const Limits = [
        {
            limit: "Daily Fiat Withdrawal Limit",
            amount: "10,000,000 NGN"
        },
        {
            limit: "Daily Crypto Withdrawal Limit",
            amount: "1,000,000 USD"
        },
        {
            limit: "Sell Ad Limit",
            amount: "N/A"
        },
        {
            limit: "Buy Ad limit",
            amount: "N/A"
        },
    ]

    const ActivitySummary = [
        {
            type: "Volume Traded (30d)",
            value: "1,001,710 NGN"
        },
        {
            type: "Ads Created (30d) ",
            value: "5"
        },
        {
            type: "Completed Orders (30d)",
            value: "20"
        },

        {
            type: "Current Running Ads",
            value: "2"
        },
        {
            type: "Total Volume Traded",
            value: "10,000,620 NGN"
        },
        {
            type: "Total Ads Created",
            value: "15"
        },
        {
            type: "Total Completed Orders",
            value: "211"
        },
        {
            type: "Total of Ads Created",
            value: "10"
        },
    ]
    return (
        <div>

            <div className=" mt-20 w-[95%] lg:w-2/3 mx-auto ">
                <div className='flex items-center  my-10 '>
                    <h1 className='text-[28px] lg:text-[34px] leading-[40px] font-[600] text-[#0A0E12] mr-4'>Chinex Exchanger</h1>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clip-path="url(#clip0_15475_11815)">
                            <g clip-path="url(#clip1_15475_11815)">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M6.0733 0.960447C5.94704 1.07377 5.81485 1.18032 5.67731 1.27964C5.43891 1.43964 5.17092 1.55004 4.88932 1.60604C4.76692 1.63004 4.63892 1.64044 4.38373 1.66043C3.74294 1.71163 3.42214 1.73723 3.15495 1.83163C2.84935 1.93935 2.57178 2.1142 2.34266 2.34332C2.11353 2.57244 1.93869 2.85001 1.83097 3.15561C1.73657 3.42281 1.71097 3.7436 1.65977 4.38439C1.65059 4.55376 1.63243 4.72253 1.60537 4.88998C1.54937 5.17158 1.43898 5.43957 1.27898 5.67797C1.20938 5.78197 1.12618 5.87957 0.959784 6.07396C0.542991 6.56355 0.334195 6.80835 0.211797 7.06435C-0.0705988 7.65634 -0.0705988 8.34433 0.211797 8.93632C0.334195 9.19231 0.542991 9.43711 0.959784 9.9267C1.12618 10.1211 1.20938 10.2187 1.27898 10.3227C1.43898 10.5611 1.54937 10.8291 1.60537 11.1107C1.62937 11.2331 1.63977 11.3611 1.65977 11.6163C1.71097 12.2571 1.73657 12.5779 1.83097 12.8451C1.93869 13.1507 2.11353 13.4282 2.34266 13.6573C2.57178 13.8865 2.84935 14.0613 3.15495 14.169C3.42214 14.2634 3.74294 14.289 4.38373 14.3402C4.63892 14.3602 4.76692 14.3706 4.88932 14.3946C5.17092 14.4506 5.43891 14.5618 5.67731 14.721C5.7813 14.7906 5.8789 14.8738 6.0733 15.0402C6.56289 15.457 6.80769 15.6658 7.06368 15.7882C7.65567 16.0706 8.34366 16.0706 8.93565 15.7882C9.19165 15.6658 9.43645 15.457 9.92604 15.0402C10.1204 14.8738 10.218 14.7906 10.322 14.721C10.5604 14.561 10.8284 14.4506 11.11 14.3946C11.2324 14.3706 11.3604 14.3602 11.6156 14.3402C12.2564 14.289 12.5772 14.2634 12.8444 14.169C13.15 14.0613 13.4276 13.8865 13.6567 13.6573C13.8858 13.4282 14.0607 13.1507 14.1684 12.8451C14.2628 12.5779 14.2884 12.2571 14.3396 11.6163C14.3596 11.3611 14.37 11.2331 14.394 11.1107C14.45 10.8291 14.5612 10.5611 14.7204 10.3227C14.79 10.2187 14.8732 10.1211 15.0396 9.9267C15.4563 9.43711 15.6651 9.19231 15.7875 8.93632C16.0699 8.34433 16.0699 7.65634 15.7875 7.06435C15.6651 6.80835 15.4563 6.56355 15.0396 6.07396C14.9262 5.9477 14.8197 5.81552 14.7204 5.67797C14.5603 5.43961 14.4493 5.17173 14.394 4.88998C14.3669 4.72253 14.3488 4.55376 14.3396 4.38439C14.2884 3.7436 14.2628 3.42281 14.1684 3.15561C14.0607 2.85001 13.8858 2.57244 13.6567 2.34332C13.4276 2.1142 13.15 1.93935 12.8444 1.83163C12.5772 1.73723 12.2564 1.71163 11.6156 1.66043C11.4462 1.65125 11.2775 1.63309 11.11 1.60604C10.8283 1.55069 10.5604 1.43973 10.322 1.27964C10.1845 1.18032 10.0523 1.07377 9.92604 0.960447C9.43645 0.543653 9.19165 0.334857 8.93565 0.212459C8.64345 0.0725986 8.32362 0 7.99967 0C7.67572 0 7.35589 0.0725986 7.06368 0.212459C6.80769 0.334857 6.56289 0.543653 6.0733 0.960447ZM11.498 6.29076C11.6111 6.16701 11.6721 6.00442 11.6683 5.83684C11.6645 5.66926 11.5963 5.50959 11.4777 5.39106C11.3592 5.27253 11.1995 5.20427 11.0319 5.2005C10.8644 5.19672 10.7018 5.25771 10.578 5.37077L6.69809 9.25071L5.42131 7.97473C5.29756 7.86167 5.13498 7.80068 4.96739 7.80445C4.79981 7.80823 4.64014 7.87649 4.52161 7.99502C4.40308 8.11355 4.33483 8.27322 4.33105 8.4408C4.32727 8.60838 4.38826 8.77097 4.50133 8.89472L6.2373 10.6307C6.35938 10.7525 6.52481 10.821 6.69729 10.821C6.86977 10.821 7.0352 10.7525 7.15728 10.6307L11.498 6.29076Z" fill="#17A34A" />
                            </g>
                        </g>
                        <defs>
                            <clipPath id="clip0_15475_11815">
                                <rect width="16" height="16" rx="8" fill="white" />
                            </clipPath>
                            <clipPath id="clip1_15475_11815">
                                <rect width="16" height="16" fill="white" />
                            </clipPath>
                        </defs>
                    </svg>

                </div>

                <div className="border-[1px] border-[#F3F4F6] rounded-[12px] bg-linear-to-r from-[#FFFFFF] to-[#F6F7F8] w-full mx-auto p-5 lg:px-10" style={{
                    background: "linear-gradient(103.09deg, #FFFFFF 7.36 %, #F6F7F8 95.14 %)"
                }}>
                    <div className="flex items-center text-[18px]  leading-[32px] font-[600] mb-3">
                        <h1 className="text-[#515B6E] ">Account Tier:</h1>
                        <h1 className="text-[#17A34A] mx-2">Level 1</h1>
                        <button type='submit' className={`h-[24px]  px-3 rounded-[6px] bg-[#F5BB00] text-[#0A0E12] text-[12px] leading-[24px] font-[600] text-center  shadow-[0_0_0.8px_#000] `}>Upgrade</button>

                    </div>

                    <div className="flex flex-wrap  items-center">

                        {
                            kycStatus.map((item, idx) =>
                                <div className="flex  items-center mr-3 my-1" key={idx}>
                                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M5 0.125C4.03582 0.125 3.09329 0.410914 2.2916 0.946586C1.48991 1.48226 0.865067 2.24363 0.496089 3.13442C0.127112 4.02521 0.030571 5.00541 0.218674 5.95107C0.406777 6.89672 0.871076 7.76536 1.55286 8.44715C2.23464 9.12893 3.10328 9.59323 4.04894 9.78133C4.99459 9.96943 5.97479 9.87289 6.86558 9.50391C7.75637 9.13494 8.51775 8.51009 9.05342 7.7084C9.58909 6.90671 9.875 5.96418 9.875 5C9.87252 3.70783 9.35811 2.46929 8.44441 1.55559C7.53071 0.641888 6.29217 0.127478 5 0.125ZM7.32031 4.14688L4.57344 6.77188C4.50243 6.83868 4.40843 6.8756 4.31094 6.875C4.26329 6.87568 4.21597 6.86692 4.17172 6.84922C4.12747 6.83152 4.08716 6.80523 4.05313 6.77188L2.67969 5.45938C2.6416 5.42614 2.61061 5.38554 2.58861 5.34003C2.5666 5.29452 2.55403 5.24502 2.55164 5.19452C2.54925 5.14403 2.5571 5.09357 2.57471 5.04618C2.59232 4.99879 2.61933 4.95545 2.65411 4.91877C2.6889 4.88208 2.73074 4.85281 2.77713 4.83271C2.82352 4.81261 2.87349 4.8021 2.92404 4.80181C2.9746 4.80152 3.02469 4.81145 3.07131 4.83101C3.11792 4.85056 3.1601 4.87935 3.19531 4.91562L4.31094 5.97969L6.80469 3.60312C6.8776 3.53951 6.97229 3.50654 7.06894 3.51112C7.1656 3.51569 7.25675 3.55745 7.32333 3.62766C7.38991 3.69788 7.42678 3.79111 7.42621 3.88788C7.42565 3.98464 7.38771 4.07744 7.32031 4.14688Z"
                                            fill={item.verified ? "#22C55D" : "#606C82"} />
                                    </svg>
                                    <p className="text-[12px]  leading-[16px] font-[400] text-[#606C82] ml-1">{item.type}</p>
                                </div>
                            )
                        }

                    </div>


                    <div className="flex flex-wrap items-center justify-between mt-5">
                        {Limits.map((item, idx) =>
                            <div key={idx} className="my-3 lg:my-0 text-left w-1/2 lg:w-fit">
                                <p className="text-[12px]  leading-[16px] font-[400] text-[#707D96] mb-2"> {item.limit}</p>
                                <h1 className="text-[14px]  leading-[24px] font-[600] text-[#515B6E]">{item.amount}</h1>
                            </div>
                        )}



                    </div>

                </div>



                <div className="border-[1px] border-[#F3F4F6] rounded-[12px] bg-linear-to-r from-[#FFFFFF] to-[#F6F7F8] w-full mx-auto p-5 px-10 mt-10" style={{
                    background: "linear-gradient(103.09deg, #FFFFFF 7.36 %, #F6F7F8 95.14 %)"
                }}>
                    <div className="flex items-center text-[18px]  leading-[32px] font-[600] mb-3">
                        <h1 className="text-[#515B6E] ">Activity Summary</h1>
                    </div>



                    <div className="flex  flex-wrap items-center justify-between mt-0 lg:my-5">
                        {ActivitySummary.slice(0, 4).map((item, idx) =>
                            <div key={idx} className="my-3 lg:my-0 text-left w-1/2 lg:w-fit">
                                <p className="text-[12px]  leading-[16px] font-[400] text-[#707D96] mb-2"> {item.type}</p>
                                <h1 className="text-[14px]  leading-[24px] font-[600] text-[#515B6E]">{item.value}</h1>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-wrap items-center justify-between mt-0 lg:mt-5">
                        {ActivitySummary.slice(4).map((item, idx) =>
                            <div key={idx} className="my-3 lg:my-0 text-left w-1/2 lg:w-fit">
                                <p className="text-[12px]  leading-[16px] font-[400] text-[#707D96] mb-2"> {item.type}</p>
                                <h1 className="text-[14px]  leading-[24px] font-[600] text-[#515B6E]">{item.value}</h1>
                            </div>
                        )}
                    </div>


                </div>
            </div>


        </div>
    )
}

export default Profile