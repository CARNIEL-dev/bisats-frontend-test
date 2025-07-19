import React, { useEffect, useState } from "react";

const useClickOutside = (initialState: boolean) => {
  const [visible, setVisible] = useState(initialState);

  const ref = React.useRef<HTMLDivElement | null>(null);

  const handler = (e: MouseEvent) => {
    if (ref?.current && !ref?.current.contains(e.target as Node)) {
      setVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handler);

    return () => {
      document.addEventListener("mousedown", handler);
    };
  }, [ref]);

  return { ref, visible, setVisible };
};

export default useClickOutside;
