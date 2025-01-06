import { useState } from "react";
import Header from "../../components/Header";

interface IDepositDetails {
    Asset: string | undefined;
    Network: string | undefined;
    Amount: string | undefined;
    Payment: string | undefined;
}

const defaultDeposits: IDepositDetails = {
    Asset: "",
    Network: "",
    Amount: "",
    Payment: "",
};

const Deposit = () => {
    const [depositDetails, setDepositDetails] = useState<IDepositDetails>(defaultDeposits);

    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = event.target;
        if (name === "Asset") {
            setDepositDetails({
                ...defaultDeposits,
                Asset: value,
            })
        } else {
            setDepositDetails((prevState) => ({
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
                            Make A Deposit
                        </h2>
                        <p style={{ color: "#515B6E", fontSize: "14px" }}>
                            Securely deposit fiat or crypto to fund your account and start trading.
                        </p>
                    </div>
                    <div className="mb-[20px]">
                        <p style={{ color: "#515B6E", fontSize: "14px" }} className="mb-2">
                            Select Asset
                        </p>
                        <select
                            name="Asset"
                            className="w-[100%] h-[48px] px-[16px] mb-[10px]"
                            style={{ border: "1px solid #E2E4E8", borderRadius: "8px" }}
                            onChange={handleSelectChange}
                        >
                            <option value="" disabled selected>
                                Select option
                            </option>
                            <option value="xngn">XNGN</option>
                            <option value="usd">USD</option>
                            <option value="sol">Solana</option>
                            <option value="eth">ETH</option>
                        </select>
                        {depositDetails.Asset !== "" && (
                            <p style={{ color: "#606C82", fontSize: "12px" }}>Current Balance: -</p>
                        )}
                    </div>
                    {depositDetails.Asset !== "" && (
                        depositDetails.Asset !== "xngn" ? (
                            <div className="mb-[5px]">
                                <p style={{ color: "#515B6E", fontSize: "14px" }} className="mb-2">
                                    Select Network
                                </p>
                                <select
                                    name="Network"
                                    className="w-[100%] h-[48px] px-[16px]"
                                    style={{ border: "1px solid #E2E4E8", borderRadius: "8px", fontSize: "16px" }}
                                    value={depositDetails.Network}
                                    onChange={handleSelectChange}
                                >
                                    <option style={{ color: "#858FA5", fontSize: "12px" }} value="" disabled selected>
                                        Select
                                    </option>
                                    <option value="eth">Ethereum</option>
                                    <option value="sol">Solana</option>
                                    <option value="base">Base</option>
                                </select>
                            </div>
                        ) : (
                            <div className="mb-[5px]">
                                <p style={{ color: "#515B6E", fontSize: "14px" }} className="mb-2">
                                    Payment Option
                                </p>
                                <select
                                    name="Payment"
                                    className="w-[100%] h-[48px] px-[16px]"
                                    style={{ border: "1px solid #E2E4E8", borderRadius: "8px", fontSize: "16px" }}
                                    value={depositDetails.Payment}
                                    onChange={handleSelectChange}
                                >
                                    <option value="" disabled selected>
                                        Select
                                    </option>
                                    <option value="budpay">Budpay</option>
                                    <option value="flutterwave">Flutterwave</option>
                                    <option value="paystack">Others</option>
                                </select>
                            </div>
                        )
                    )}
                    {depositDetails.Network !== "" && depositDetails.Asset !== "xngn" && (
                        <div className="border border-dashed h-[84px] p-[16px] mb-[15px]" style={{ borderColor: "#F59E0C", borderRadius: "12px", lineHeight: "24px" }}>
                            <p style={{ color: "#2B313B", fontSize: "14px", fontWeight: 600 }}>Wallet Address</p>
                            <p style={{ color: "#515B6E", fontSize: "14px", fontWeight: 400 }}>0x8708bcabde9d58fedcd164ebf0d3742486284b90</p>
                        </div>
                    )}
                    {(depositDetails.Network !== "" || depositDetails.Asset === "xngn") && (
                        <div className="mt-[10px]">
                            <div>
                                <input
                                    type="text"
                                    name="Amount"
                                    placeholder="Enter Amount"
                                    className="w-[100%] h-[48px] px-[16px] mb-[10px]"
                                    style={{ border: "1px solid #E2E4E8", borderRadius: "8px" }}
                                    onChange={(e) => setDepositDetails((prevState) => ({ ...prevState, Amount: e.target.value }))}
                                />
                            </div>
                            <div>
                                <button
                                    className="w-full h-[48px] py-[10px] px-[16px] font-semibold rounded-md"
                                    style={{ backgroundColor: "#F5BB00", color: "#0A0E12", fontSize: "14px", lineHeight: "24px" }}
                                >
                                    Proceed
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Deposit;
