import {
  PrimaryButton,
  WhiteTransparentButton,
} from "@/components/buttons/Buttons";
import MaxWidth from "@/components/shared/MaxWith";
import TextBox from "@/components/shared/TextBox";
import { Button } from "@/components/ui/Button";
import { APP_ROUTES } from "@/constants/app_route";
import PreLoader from "@/layouts/PreLoader";
import { formatter } from "@/utils";
import dayjs from "dayjs";
import { Check, Copy } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Receipt = () => {
  const { state } = useLocation();
  const [loading, setLoading] = useState(true);
  const [isCopied, setIsCopied] = useState(false);

  const navigate = useNavigate();

  const orderData: OrderHistory | undefined = useMemo(() => {
    if (state) {
      return state;
    } else {
      return undefined;
    }
  }, [state]);

  useEffect(() => {
    if (orderData) {
      setLoading(false);
    }
    if (orderData === undefined) {
      navigate(APP_ROUTES.P2P.HOME);
    }
  }, [orderData]);

  const handleCopy = () => {
    navigator.clipboard.writeText(orderData?.reference || "");
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 3000);
  };

  return (
    <MaxWidth className="max-w-[38rem] shadow-sm border my-12 p-6 rounded-xl">
      {loading && !orderData ? (
        <div className="h-[30rem] grid place-content-center">
          <PreLoader primary={false} />
        </div>
      ) : (
        <>
          <h1 className="text-xl font-semibold  text-green-600">
            Transaction Completed
          </h1>

          <div className=" bg-slate-50 rounded-[12px] py-4 px-6  my-5 text-sm flex flex-col gap-5 ">
            <TextBox
              label="Type"
              value={
                <p
                  className={`border-2 px-4 py-0.5 rounded-full capitalize font-semibold ${
                    orderData?.type === "buy"
                      ? "text-green-600 border-green-500"
                      : "text-red-600 border-red-500"
                  }  `}
                >
                  {orderData?.type}
                </p>
              }
            />
            <TextBox
              label="Asset"
              value={<p className="font-semibold">{orderData?.asset}</p>}
            />
            <TextBox
              label="Amount"
              value={
                <p>
                  <span className="font-bold text-base md:text-lg">
                    {formatter({}).format(orderData?.amount || 0)}
                  </span>{" "}
                  xNGN
                </p>
              }
            />
            <TextBox
              label="Quantity"
              value={
                <p>
                  <span className="font-bold text-base md:text-lg">
                    {orderData?.quantity}
                  </span>{" "}
                  {orderData?.asset}
                </p>
              }
            />
            <TextBox
              label="Price"
              value={
                <p>
                  {formatter({}).format(orderData?.price || 0)} xNGN /{" "}
                  {orderData?.asset}{" "}
                </p>
              }
            />
            {orderData?.type === "buy" && (
              <TextBox
                label={
                  orderData?.type === "buy" ? "Transaction Fees" : "Buyer's Fee"
                }
                value={
                  <p>
                    {formatter({}).format(orderData?.transactionFeeInNGN || 0)}{" "}
                    xNGN
                  </p>
                }
              />
            )}
            <TextBox
              label="Order ref"
              value={
                <div className="flex items-center gap-1">
                  <p>{orderData?.reference}</p>
                  <Button
                    size={"sm"}
                    variant={"secondary"}
                    type="button"
                    onClick={handleCopy}
                  >
                    {isCopied ? <Check className="text-green-500" /> : <Copy />}
                  </Button>
                </div>
              }
            />
            <TextBox
              label="Transaction time"
              value={
                <p>
                  {dayjs(orderData?.createdAt).format("DD MMM YYYY - hh:mm A")}
                </p>
              }
            />
          </div>
          <div className="lg:flex lg:flex-nowrap  gap-x-2 gap-y-4 flex-wrap lg:items-center  w-full lg:justify-between">
            <div className="flex-1">
              <WhiteTransparentButton
                text={"Dashboard"}
                className="w-full"
                loading={false}
                type="button"
                onClick={() => navigate(APP_ROUTES.DASHBOARD)}
              />
            </div>

            <div className="flex-1 ">
              <PrimaryButton
                text={"Go to Market"}
                className="w-full"
                loading={false}
                type="button"
                onClick={() =>
                  navigate(
                    `${APP_ROUTES.P2P.HOME}?type=${
                      orderData?.type ? "buy" : "Sell"
                    }&asset=${orderData?.asset}`
                  )
                }
              />
            </div>
          </div>
        </>
      )}
    </MaxWidth>
  );
};

export default Receipt;
