import { useState } from "react";
import Header from "../../components/Header";

interface IWithdrawalDetails {
    Asset: string | undefined;
    Address: string | undefined;
    Network: string | undefined;
    Amount: string | undefined;
    Payment: string | undefined;
}

const defaultWithdrawals: IWithdrawalDetails = {
    Asset: "",
    Address: "",
    Network: "",
    Amount: "",
    Payment: "",
};

const Withdrawal = () => {
    const [withdrawalDetails, setWithdrawalDetails] = useState<IWithdrawalDetails>(defaultWithdrawals);

    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = event.target;
        if (name === "Asset") {
            setWithdrawalDetails({
                ...defaultWithdrawals,
                Asset: value,
            })
        } else {
            setWithdrawalDetails((prevState) => ({
                ...prevState,
                [name]: value,
            }));
        }
    };

    return (
        <div>
            <Header currentPage="Wallet" />
            <div className="flex justify-center mt-[30px]">
                <div className="w-[28%] pt-[60px]">
                    <div style={{ lineHeight: "24px" }} className="mb-[20px]">
                        <h2 className="font-semibold mb-4" style={{ color: "#0A0E12", fontSize: "34px" }}>
                            Make A Withdrawal
                        </h2>
                        <p style={{ color: "#515B6E", fontSize: "14px" }}>
                            Securely withdraw fiat or crypto from your account
                        </p>
                    </div>
                    <div className="mb-[20px]">
                        <p style={{ color: "#515B6E", fontSize: "14px" }} className="mb-2">
                            Select Asset
                        </p>
                        <select
                            name="Asset"
                            className="w-[100%] h-[48px] px-[16px] mb-[10px]"
                            style={{ border: "1px solid #E2E4E8", borderRadius: "8px", fontSize: "12px", fontWeight: 200 }}
                            onChange={handleSelectChange}
                        >
                            <option value="" disabled selected>
                                Select option
                            </option>
                            <option value="XNGN">XNGN</option>
                            <option value="USDT">USDT</option>
                            <option value="SOL">SOLANA</option>
                            <option value="ETH">ETH</option>
                        </select>
                        {withdrawalDetails.Asset !== "" && (
                            <p style={{ color: "#606C82", fontSize: "12px" }}>Current Balance: -</p>
                        )}
                    </div>
                    {withdrawalDetails.Asset !== "" && (
                        withdrawalDetails.Asset !== "XNGN" ? (
                            <div className="mb-[10px]">
                                <div className="mb-[10px]">
                                    <p style={{ color: "#515B6E", fontSize: "14px" }} className="mb-2">
                                        Select Network
                                    </p>
                                    <select
                                        name="Network"
                                        className="w-[100%] h-[48px] px-[16px]"
                                        style={{ border: "1px solid #E2E4E8", borderRadius: "8px", fontSize: "12px", fontWeight: 200 }}
                                        value={withdrawalDetails.Network}
                                        onChange={handleSelectChange}
                                    >
                                        <option style={{ color: "#858FA5" }} value="" disabled selected>
                                            Select
                                        </option>
                                        <option value="ETH">Ethereum</option>
                                        <option value="SOL">Solana</option>
                                        <option value="BASE">Base</option>
                                    </select>
                                </div>
                                <div>
                                    <p style={{ color: "#515B6E", fontSize: "14px" }} className="mb-2">
                                        Wallet Address
                                    </p>
                                    <input
                                        type="text"
                                        name="Address"
                                        value={withdrawalDetails.Address}
                                        placeholder="Enter Wallet Address"
                                        className="w-[100%] h-[48px] px-[16px] mb-[10px]"
                                        style={{ border: "1px solid #E2E4E8", borderRadius: "8px", fontSize: "12px", fontWeight: 200 }}
                                        onChange={(e) => setWithdrawalDetails((prevState) => ({ ...prevState, Address: e.target.value }))}
                                    />
                                </div>
                            </div>
                        ) : (
                            <></>
                        )
                    )}

                    {(
                        withdrawalDetails.Asset !== "" && (
                            <div>
                                <div className="mb-[10px]">
                                    <p style={{ color: "#515B6E", fontSize: "14px" }} className="mb-2">
                                        Amount
                                    </p>
                                    <input
                                        type="text"
                                        name="Amount"
                                        value={withdrawalDetails.Amount}
                                        placeholder="Enter Amount"
                                        className="w-[100%] h-[48px] px-[16px] mb-[10px] "
                                        style={{ border: "1px solid #E2E4E8", borderRadius: "8px", fontSize: "12px", fontWeight: 200 }}
                                        onChange={(e) => setWithdrawalDetails((prevState) => ({ ...prevState, Amount: e.target.value }))}
                                    />
                                </div>

                                <div className="mb-[5px] p-[8px]" style={{backgroundColor: "#F9F9FB", color: "#606C82", fontSize: "14px", fontWeight: 400, borderRadius: "8px"}}>
                                    <div className="flex justify-between">
                                        <p>Daily Transaction Limit</p>
                                        <p style={{fontWeight: 600}}> NGN 10000.00</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <p>Transaction Fee</p>
                                        <p style={{fontWeight: 600}}> 0.01 {withdrawalDetails.Asset}</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <p>Withdrawal Amount</p>
                                        <p style={{fontWeight: 600}}> {withdrawalDetails.Amount === "" ? 0 : withdrawalDetails.Amount} {withdrawalDetails.Asset}</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <p>Total</p>
                                        <p style={{fontWeight: 600}}> {(withdrawalDetails.Amount === "" ? 0 : Number(withdrawalDetails.Amount) + 0.01)} {withdrawalDetails.Asset}</p>
                                    </div>
                                </div>

                                <div>
                                    <button
                                        className="w-full h-[48px] py-[10px] px-[16px] font-semibold rounded-md"
                                        style={{ backgroundColor: "#F5BB00", color: "#0A0E12", fontSize: "14px", lineHeight: "24px" }}
                                    >
                                        Withdraw
                                    </button>
                                </div>
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default Withdrawal;
