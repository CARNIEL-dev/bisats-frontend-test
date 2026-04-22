import { HeroSection } from "@/components/shared/HeroSection";
import MaxWidth from "@/components/shared/MaxWith";
import { APP_ROUTES } from "@/constants/app_route";
import { cn } from "@/utils";
import { Link, Outlet, useLocation } from "react-router-dom";

const tabs = [
  { label: "Articles", path: APP_ROUTES.RESOURCES.ARTICLES },
  { label: "Videos", path: APP_ROUTES.RESOURCES.VIDEOS },
];

const ResourcesLayout = () => {
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <div>
      <HeroSection
        title="Resources"
        desc="Deep dives, tutorials, and expert perspectives to sharpen your crypto understanding"
        image="/resources-icon.svg"
        className="!max-h-[70dvh]"
      />
      <MaxWidth className="max-w-6xl">
        <div className="my-10 md:my-16 w-full">
          <div className="grid grid-cols-2 mb-10 max-w-[60rem] mx-auto border-b border-border">
            {tabs.map((tab) => (
              <Link
                key={tab.path}
                to={tab.path}
                className={cn(
                  "inline-flex flex-1 items-center justify-center gap-1.5 border-4 border-transparent px-2 py-4 text-sm font-semibold whitespace-nowrap transition-[color,box-shadow] text-muted-foreground cursor-pointer",
                  pathname.startsWith(tab.path) &&
                    "text-[#937000] border-b-4 border-b-primary",
                )}
              >
                {tab.label}
              </Link>
            ))}
          </div>

          <Outlet />
        </div>
      </MaxWidth>
    </div>
  );
};

export default ResourcesLayout;
