import { useEffect } from "react";

const usePreventScroll = (isActive: boolean) => {
  useEffect(() => {
    if (isActive) {
      document.body.classList.add("scroll-disabled");
    } else {
      document.body.classList.remove("scroll-disabled");
    }
  });
  return null;
};

export default usePreventScroll;
