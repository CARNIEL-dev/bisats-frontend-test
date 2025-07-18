import React from "react";

const Empty: React.FC = () => {
  return (
    <div className="flex flex-col gap-2 justify-center items-center my-6 ">
      <img className="h-[35px] w-[35px]" src="/no_record.png" alt="Empty" />
      <p className="text-slate-600 text-sm">No Record Available</p>
    </div>
  );
};

export default Empty;
