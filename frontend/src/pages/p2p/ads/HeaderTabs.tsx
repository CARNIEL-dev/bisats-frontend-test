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
    <div className=" flex justify-between w-full items-center mx-auto flex-nowrap text-gray-600 ">
      {PageData.map((page, idx) => (
        <button
          key={idx}
          className={` ${
            activePage === page.active
              ? "border-b-2 border-[#F5BB00] text-[#937000]"
              : ""
          } text-[14px] text-[#515B6E] py-2 text-center w-full font-semibold `}
          onClick={() => setStage(page.active as "details" | "review")}
        >
          {page.tab}
        </button>
      ))}
    </div>
  );
};
export default HeaderTabs;
