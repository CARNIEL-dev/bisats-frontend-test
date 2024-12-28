import { Outlet } from "react-router-dom";
import OtherSide from "./auth/OtherSide";

const KycLayOut = () => {
    return (
        <div className={`bg-white bg-no-repeat bg-cover h-full w-full py-20`}>
            <div className="w-full lg:w-1/3 mx-auto h-full  lg:items-center ">
                <OtherSide
                    header="Complete your KYC"
                    subHeader="Verify Your Identity to fully unlock your Bisats account"
                    upperSubHeader={<></>}
                />

                <div className="w-full  flex justify-center items-center py-5 bg-white">
                    <div className="w-full">
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default KycLayOut