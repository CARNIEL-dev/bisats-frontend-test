import React, { ReactElement } from "react";

type TOtherSideProp = {
  header: string;
  subHeader?: ReactElement | string;
  upperSubHeader?: ReactElement | string;
};

const OtherSide = ({
  header,
  subHeader,
  upperSubHeader = <div></div>,
}: TOtherSideProp) => {
  return (
    <div className="w-full lg:w-[452px]">
      {upperSubHeader}
      <h1 className="font-semibold lg:text-[42px] lg:leading-[56px]">
        {header}
      </h1>
      <p className="text-gray-600 font-normal text-sm">{subHeader}</p>
    </div>
  );
};
export default OtherSide;
