import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { LandingPage } from "@/pages/landing-page/src/screens/Bisats/LandingPage";

createRoot(document.getElementById("app") as HTMLElement).render(
  <StrictMode>
    <LandingPage />
  </StrictMode>
);
