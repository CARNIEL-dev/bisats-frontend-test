import { QueryClientProvider } from "@tanstack/react-query";
import ReactDOM from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { Provider } from "react-redux";
import App from "@/App";
import "./index.css";
import store from "@/redux/store";
// import reportWebVitals from "./reportWebVitals";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { StrictMode } from "react";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import OfflineBanner from "@/components/shared/OfflineBanner";
import "@/lib/network";
import queryClient from "@/lib/queryClient";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);
root.render(
  <StrictMode>
    <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <ThemeProvider defaultTheme="system" storageKey="theme">
          <App />
          <OfflineBanner />
        </ThemeProvider>
      </Provider>
      <ReactQueryDevtools initialIsOpen={false} buttonPosition="top-left" />
    </QueryClientProvider>
    </HelmetProvider>
  </StrictMode>,
);

// reportWebVitals();
