import { CSSProperties } from "react";
import { RiseLoader } from "react-spinners";

const PreLoader = () => {
  const override: CSSProperties = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
  };
  return (
    <div className="absolute bg-white flex flex-col justify-center items-center top-0 left-0 z-30 w-full h-[100vh]">
      <div className="flex flex-col items-center">
        {/* <img src={favicon} alt="Loading..." className="w-[100px]" /> */}
        <div className="mt-5">
          <RiseLoader
            color={"#007A44"}
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
