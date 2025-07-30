import MaxWidth from "@/components/shared/MaxWith";
import Balance from "@/pages/dashboard/Balance";
import Assets from "@/pages/wallet/Assets";
import Transactions from "@/pages/wallet/Transaction";

const Wallet = () => {
  return (
    <>
      <MaxWidth as="section" className="space-y-8 max-w-6xl lg:pb-5 mb-10 mt-6">
        <div className="w-full space-y-4  ">
          <div className="sm:w-fit sm:min-w-[28rem] max-w-[40rem]">
            <Balance showWithdraw />
          </div>

          <div className="sm:border md:space-y-4 space-y-2 rounded-2xl  sm:p-6">
            <p className="font-semibold md:text-lg text-gray-700">
              Your assets
            </p>
            <Assets />
          </div>

          <div className="sm:border md:space-y-4 space-y-2 rounded-2xl  sm:p-6">
            <p className="font-semibold md:text-lg text-gray-700">
              Wallet History
            </p>
            <Transactions />
          </div>
        </div>
      </MaxWidth>
    </>
  );
};
export default Wallet;
