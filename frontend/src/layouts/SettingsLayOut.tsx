import BackButton from "@/components/shared/BackButton";
import MaxWidth from "@/components/shared/MaxWith";
import { APP_ROUTES } from "@/constants/app_route";
import { cn } from "@/utils";
import { Link, Outlet, useLocation } from "react-router-dom";

const PageData = [
  {
    tab: "Profile",
    link: APP_ROUTES.SETTINGS.PROFILE,
  },
  {
    tab: "Security",
    link: APP_ROUTES.SETTINGS.SECURITY,
  },
  {
    tab: "Payment",
    link: APP_ROUTES.SETTINGS.PAYMENT,
  },
];

const SettingsLayOut = () => {
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <div>
      <div className="md:top-[5rem] top-[4rem] space-y-4 fixed pt-4 pb-4 bg-neutral-50 border-b inset-x-0 z-10">
        <MaxWidth className="space-y-4 max-w-[65rem] ">
          <div className=" flex items-center gap-4">
            <BackButton />
            <h1 className="text-[28px] lg:text-[34px] font-semibold">
              Settings
            </h1>
          </div>
          <div className=" ">
            <div className="w-fit md:px-8 px-6 mx-auto flex justify-center md:gap-10 gap-4  items-center flex-nowrap text-[#515B6E] dashboard-navbar border border-primary  py-3 rounded-full">
              {PageData.map((page) => {
                const isProfile =
                  page.link === APP_ROUTES.SETTINGS.PROFILE &&
                  pathname === APP_ROUTES.SETTINGS.PROFILE;

                const isOtherTab =
                  page.link !== APP_ROUTES.SETTINGS.PROFILE &&
                  pathname.startsWith(page.link);

                return (
                  <Link
                    to={page.link}
                    key={page.link}
                    className={cn(
                      "font-semibold text-sm",
                      isProfile && "active",
                      isOtherTab && "active"
                    )}
                  >
                    {page.tab}
                  </Link>
                );
              })}
            </div>
          </div>
        </MaxWidth>
      </div>
      <MaxWidth className=" mt-40  max-w-[45rem]  md:min-h-[55dvh] mb-10 min-h-[65dvh] w-[90%]">
        <Outlet />
      </MaxWidth>
    </div>
  );
};

export default SettingsLayOut;
