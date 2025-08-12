import SideFrame from "@/assets/illustrations/side-frame1.png";
import BisatLogo from "@/components/shared/Logo";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Outlet } from "react-router-dom";
import { GOOGLE } from "@/utils/googleCred";
import MaxWidth from "@/components/shared/MaxWith";

const AuthLayout = () => {
  return (
    <GoogleOAuthProvider clientId={GOOGLE.CLIENT_ID ?? ""}>
      <MaxWidth className={` lg:h-screen w-full pt-8 md:pt-0 max-w-[100rem]`}>
        <div className="md:hidden px-4 mb-4">
          <BisatLogo reload={false} />
        </div>
        <div className="w-full h-full flex flex-col-reverse lg:flex-row lg:justify-start lg:items-center p-3 ">
          <div className="hidden lg:block lg:w-[561px] 2xl:w-[50%] p-2 bg-pri-black h-full rounded-[16px] relative">
            <div className="absolute top-[8%] left-[6.5%] mix-blend-screen">
              <BisatLogo reload={false} />
            </div>
            <img
              src={SideFrame}
              alt="side frame auth"
              className="w-full h-full"
              loading="lazy"
            />
          </div>
          <div className="w-full lg:w-[50%] 2xl:w-[50%] flex justify-center items-center flex-col h-fit bg-white z-20">
            <div className="w-[90%] max-w-[500px] mx-auto ">
              <Outlet />
            </div>
          </div>
        </div>
      </MaxWidth>
    </GoogleOAuthProvider>
  );
};

export default AuthLayout;
