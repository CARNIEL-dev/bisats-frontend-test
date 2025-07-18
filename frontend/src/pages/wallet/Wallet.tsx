import MaxWidth from "@/components/shared/MaxWith";
import Balance from "@/pages/dashboard/Balance";
import Assets from "@/pages/wallet/Assets";
import Transactions from "@/pages/wallet/Transaction";

const Wallet = () => {
  return (
    <>
      <MaxWidth
        as="section"
        className="space-y-8 max-w-[72rem] lg:pb-5 mb-10 mt-6"
      >
        <div className="w-full space-y-4  ">
          <div className="sm:w-[40%]">
            <Balance showWithdraw />
          </div>
          <div
            className="sm:border-[1px] w-full sm:p-6 p-4"
            style={{ borderRadius: "12px", borderColor: "#D6DAE1" }}
          >
            <div className="mb-[12px]">
              <p style={{ fontSize: "15px" }}>
                <span
                  style={{
                    fontSize: "18px",
                    fontWeight: "600",
                    color: "#0A0E12",
                  }}
                  className="mr-[8px]"
                >
                  Your assets
                </span>
                {/* <button
									style={{
										color: "#C49600",
										fontSize: "14px",
										fontWeight: "600",
									}}
								>
									view all
								</button> */}
              </p>
            </div>
            <Assets />
          </div>
          <div
            className="sm:border-[1px] w-full sm:p-6 p-4"
            style={{ borderRadius: "12px", borderColor: "#D6DAE1" }}
          >
            <div className="mb-[12px]">
              <p style={{ fontSize: "15px" }}>
                <span
                  style={{
                    fontSize: "18px",
                    fontWeight: "600",
                    color: "#0A0E12",
                  }}
                  className="mr-[8px]"
                >
                  Wallet History
                </span>
                {/* <button
									style={{
										color: "#C49600",
										fontSize: "14px",
										fontWeight: "600",
									}}
								>
									view all
								</button> */}
              </p>
              <Transactions />
            </div>
          </div>
        </div>
      </MaxWidth>
    </>
  );
};
export default Wallet;
