import coinss from "@/assets/icons/coinss.png";
import HeroImage from "@/assets/landingPage/heroPhone copy.png";
import { buttonVariants } from "@/components/ui/Button";
import { APP_ROUTES } from "@/constants/app_route";
import { UserState } from "@/redux/reducers/userSlice";
import { cn } from "@/utils";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export const HeroSectionByAnima = (): JSX.Element => {
  const user: UserState = useSelector((state: any) => state.user);
  const isAuthenticated = user.isAuthenticated;

  return (
    <section className="lg:h-[85vh] 2xl:h-fit">
      <div className="flex flex-wrap lg:flex-nowrap justify-between items-center px-5  py-2 ">
        {/* SUB: Left content */}
        <div className="flex flex-col justify-center text-center  w-full lg:text-left lg:w-[740px] items-start gap-4 md:pt-14 pt-12">
          <img
            src={coinss}
            alt="logo-cluster"
            className="h-[24px] mx-auto lg:mx-0"
          />
          <h1 className="text-[42px] leading-[56px] w-full  lg:text-6xl font-semibold text-[#0A0E12]  lg:leading-[65px]">
            Trade, Rest, and <br /> Stay Happy
          </h1>
          <p className="w-full lg:w-[541px] text-[16px] leading-[28px] py-3 lg:text-lg lg:leading-[28px] font-normal text-[#515B6E]">
            With Bisats, you can say goodbye to your struggles with crypto
            peer-to-peer exchanges
          </p>

          <div className="flex flex-wrap lg:flex-nowrap items-center w-full  lg:w-4/6 gap-4 ">
            {isAuthenticated ? (
              <Link
                to={APP_ROUTES.DASHBOARD}
                className={cn(
                  buttonVariants(),
                  "px-8 lg:w-1/2 w-full  h-fit py-3 text-sm"
                )}
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  className={cn(
                    buttonVariants(),
                    "px-8 lg:w-1/2 w-full  h-fit py-3 text-sm"
                  )}
                  to={APP_ROUTES.AUTH.SIGNUP}
                >
                  Create an Account
                </Link>
                <Link
                  className={cn(
                    buttonVariants({ variant: "secondary" }),
                    "px-8 lg:w-1/2 w-full  h-fit py-3 text-sm"
                  )}
                  to={APP_ROUTES.AUTH.LOGIN}
                >
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>

        {/* SUB: Right content */}
        <div className="w-full mt-5 lg:mt-0 lg:w-[539px] p-2 lg:p-6 pb-2 h-[404px] lg:h-[614px] rounded-xl ">
          <img alt="hero-phone-image" src={HeroImage} />
        </div>
      </div>
    </section>
  );
};
