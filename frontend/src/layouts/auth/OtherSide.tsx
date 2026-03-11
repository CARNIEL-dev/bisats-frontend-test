import { cn } from "@/utils";
import { ReactElement } from "react";

type TOtherSideProp = {
  header: string;
  subHeader?: ReactElement | string;
  upperSubHeader?: ReactElement | string;
  headerClassName?: string;
};

const OtherSide = ({
  header,
  subHeader,
  upperSubHeader,
  headerClassName,
}: TOtherSideProp) => {
  return (
    <div className="w-full lg:w-[550px] space-y-2">
      {upperSubHeader}
      <h3
        className={cn(
          "font-semibold  text-xl lg:text-[42px] lg:leading-[40px]",
          headerClassName,
        )}
      >
        {header}
      </h3>
      <p className="text-gray-600 font-normal text-sm">{subHeader}</p>
    </div>
  );
};
export default OtherSide;
