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
      <div className="md:top-[5rem] top-[4rem] space-y-4 fixed pt-4  bg-neutral-50 border-b dark:bg-secondary border-border inset-x-0 z-10">
        <MaxWidth className="space-y-4 ">
          <div className=" flex items-center gap-4">
            <BackButton />
            <h1 className="text-[28px] lg:text-[34px] font-semibold">
              Settings
            </h1>
          </div>
          <>
            <div className=" flex mx-6  gap-6  items-center flex-nowrap text-muted-foreground dashboard-navbar   py-3">
              {PageData.map((page) => {
                const isProfileActive =
                  page.link === APP_ROUTES.SETTINGS.PROFILE &&
                  pathname === APP_ROUTES.SETTINGS.PROFILE;

                const isOtherTabActive =
                  page.link !== APP_ROUTES.SETTINGS.PROFILE &&
                  pathname.startsWith(page.link);

                return (
                  <Link
                    to={page.link}
                    key={page.link}
                    className={cn(
                      "font-medium text-sm px-6",
                      isProfileActive && "active",
                      isOtherTabActive && "active",
                    )}
                  >
                    {page.tab}
                  </Link>
                );
              })}
            </div>
          </>
        </MaxWidth>
      </div>
      <MaxWidth className=" mt-40  max-w-[60rem]  md:min-h-[55dvh] mb-20 border border-transparent min-h-[65dvh] w-[90%]">
        <Outlet />
      </MaxWidth>
    </div>
  );
};

export default SettingsLayOut;
