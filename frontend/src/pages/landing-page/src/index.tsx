import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Bisats } from "./screens/Bisats";

createRoot(document.getElementById("app") as HTMLElement).render(
  <StrictMode>
    <Bisats />
  </StrictMode>,
);
