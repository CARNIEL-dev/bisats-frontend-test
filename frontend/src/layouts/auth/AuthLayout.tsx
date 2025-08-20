import SideFrame from "@/assets/illustrations/side-frame1.png";
import BisatLogo from "@/components/shared/Logo";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Outlet } from "react-router-dom";
import { GOOGLE } from "@/utils/googleCred";
import MaxWidth from "@/components/shared/MaxWith";

import AuthOverlay from "@/assets/illustrations/auth_overlay.png";
import AuthIcons from "@/assets/icons/auth_icons.png";

const AuthLayout = () => {
  return (
    <GoogleOAuthProvider clientId={GOOGLE.CLIENT_ID ?? ""}>
      <MaxWidth className={` lg:h-screen w-full pt-8 md:pt-0 max-w-[100rem]`}>
        <div className="md:hidden px-4 mb-4">
          <BisatLogo reload={false} />
        </div>
        <div className="w-full h-full flex flex-col-reverse lg:flex-row lg:justify-start lg:items-center p-3 ">
          {/* SUB: Image Section */}
          <aside className="hidden lg:block lg:w-[561px] 2xl:w-[50%]  bg-black h-[98%] ml-2 rounded-[20px] relative isolate">
            {/*CMT:  Background Pattern */}
            <div className="absolute h-[96%] w-[95%] mx-auto inset-0 overflow-hidden -z-[5]">
              <img
                src={AuthOverlay}
                alt="Background Pattern"
                className="object-cover h-full w-full object-top -z-[10] "
                aria-hidden="true"
                loading="eager"
              />
            </div>
            {/*CMT:  Content */}
            <div className="flex flex-col justify-between h-full">
              <BisatLogo
                reload={false}
                variant="light"
                className="ml-8 mt-12"
              />

              <div className="self-end">
                <img
                  src={AuthIcons}
                  alt="Auth Icons"
                  className="size-[320px] object-cover"
                />
              </div>
            </div>
          </aside>

          {/* SUB: Outlet Section */}
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
