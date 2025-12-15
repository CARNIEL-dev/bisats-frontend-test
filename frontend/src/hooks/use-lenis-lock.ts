// useLenisLock.ts
import { useEffect } from "react";
// If using the newer package:
import { useLenis } from "lenis/dist/lenis-react";
// If using the older package, change to: import { useLenis } from '@studio-freight/react-lenis';

export const useLenisLock = (isLocked: boolean) => {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;

    if (isLocked) {
      lenis.stop(); // Pauses Lenis scroll
    } else {
      lenis.start(); // Resumes Lenis scroll
    }

    // Cleanup ensures scrolling resumes if component unmounts unexpectedly
    return () => {
      lenis.start();
    };
  }, [lenis, isLocked]);
};
