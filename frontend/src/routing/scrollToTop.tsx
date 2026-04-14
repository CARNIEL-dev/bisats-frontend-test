import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  useEffect(() => {
    const scrollToHash = () => {
      const hash = window.location.hash;

      if (hash) {
        // Wait a short time to allow lazy components to mount
        setTimeout(() => {
          const id = hash.slice(1);
          const element = document.getElementById(id);
          if (element) {
            const rect = element.getBoundingClientRect();
            window.scrollTo({
              top: rect.top + window.scrollY - 130,
              behavior: "smooth",
            });
          }
        }, 100); // delay in ms
      } else {
        // No hash — scroll to top instantly
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      }
    };

    scrollToHash();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, location.hash]);

  return <>{children}</>;
};

export default ScrollToTop;
