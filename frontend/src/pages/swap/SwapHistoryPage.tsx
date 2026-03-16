import { APP_ROUTES } from "@/constants/app_route";
import Head from "@/pages/wallet/Head";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SwapHistory from "./components/SwapHistory";

const SwapHistoryPage = () => {
  const navigate = useNavigate();

  return (
    <div className="grid gap-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(APP_ROUTES.SWAP.HOME)}
          className="flex items-center justify-center hover:bg-secondary rounded-md p-1"
        >
          <ArrowLeft className="!size-6 text-muted-foreground" strokeWidth={1.5} />
        </button>
        <Head header="Swap History" subHeader="View your past swap transactions" />
      </div>

      <SwapHistory />
    </div>
  );
};

export default SwapHistoryPage;
