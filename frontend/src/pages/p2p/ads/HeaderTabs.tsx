import { cn } from "@/utils";

const PageData = [
  {
    tab: "Ad Details",
    active: "details",
  },
  {
    tab: "Review & Publish",
    active: "review",
  },
];
const HeaderTabs = ({
  activePage,
  setStage,
}: {
  activePage: string;
  setStage: React.Dispatch<React.SetStateAction<"details" | "review">>;
}) => {
  return (
    <div className=" flex justify-between w-full items-center mx-auto flex-nowrap text-muted-foreground ">
      {PageData.map((page, idx) => (
        <button
          key={idx}
          className={cn(
            "text-[14px] text-muted-foreground py-2 text-center w-full font-semibold",
            activePage === page.active &&
              "border-b-2 border-primary text-[#937000]",
          )}
          onClick={() => setStage(page.active as "details" | "review")}
        >
          {page.tab}
        </button>
      ))}
    </div>
  );
};
export default HeaderTabs;
