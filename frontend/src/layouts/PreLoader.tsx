import { CSSProperties } from "react";
import {  GridLoader,  } from "react-spinners";

const PreLoader = () => {
  const override: CSSProperties = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
  };
  return (
    <div className=" mx-auto w-full h-fit">
      <div className="flex flex-col items-center">
        {/* <img src={favicon} alt="Loading..." className="w-[100px]" /> */}
        <div className="mt-5">
          <GridLoader
            color={"#000"}
            loading={true}
            cssOverride={override}
            size={20}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
      </div>
    </div>
  );
};

export default PreLoader;
