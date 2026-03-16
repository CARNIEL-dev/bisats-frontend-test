/**
 * SwapPage
 *
 * Thin orchestration page — mounts the header/rate bar and swap form.
 * History is now a separate page at /swap/history.
 */

import { APP_ROUTES } from "@/constants/app_route";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Head from "@/pages/wallet/Head";
import { History } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SwapForm from "./components/SwapForm";

const SwapPage = () => {
  const navigate = useNavigate();

  return (
    <div className="grid gap-6">
      <div className="flex flex-col gap-2 w-full">
        {/* SUB: Header */}
        <div className="flex items-center justify-between">
          <Head header="Swap" subHeader="Swap from one asset to the other." />

          <Tooltip>
            <TooltipTrigger
              className="flex items-center justify-center hover:bg-secondary rounded-md p-1"
              onClick={() => navigate(APP_ROUTES.SWAP.HISTORY)}
            >
              <History
                className="!size-6 text-muted-foreground"
                strokeWidth={1.5}
              />
              <span className="sr-only">Swap history</span>
            </TooltipTrigger>
            <TooltipContent>
              <p>View history</p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* SUB: Swap form */}
        <SwapForm />
      </div>
    </div>
  );
};

export default SwapPage;
