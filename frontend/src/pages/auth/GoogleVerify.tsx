import { Loader2 } from "lucide-react";

const GoogleVerify = () => {
  // usePreventScroll(true);

  return (
    <div className="w-full h-full inset-0 fixed grid place-items-center bg-black/60 backdrop-blur-md z-10">
      <div className="p-4 bg-white rounded-xl shadow-md flex justify-center items-center ">
        <Loader2 className="animate-spin size-8" />
      </div>
    </div>
  );
};

export default GoogleVerify;
