import { Outlet } from "react-router-dom";
import HomeLogo from "../../assets/logo";

import SideFrame from "../../assets/illustrations/sideFrame.png"



const AuthLayout = () => {
    return (
        <div className={`bg-white bg-no-repeat bg-cover h-[100vh] w-full`}>
            <div className="w-full h-full flex flex-col-reverse lg:flex-row lg:justify-start lg:items-start p-6">
                <div className="hidden lg:block lg:w-[561px] p-5 bg-priBlack h-full rounded-[16px] relative">
                    <img src={SideFrame} alt="side frame auth" className="w-full h-full" />
                    <div className="absolute top-[4%] right-[4%] w-[516px] h-[289.06px]">
                        <HomeLogo />
                    </div>
                </div>
                <div className="w-full lg:w-[50%] flex justify-center items-center flex-col h-screen bg-white z-20">
                    <div className="w-[90%] max-w-[500px] mx-auto my-8 lg:my-24">
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
