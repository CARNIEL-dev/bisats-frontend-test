import { ReactNode, useState } from "react";
import { TokenData } from "../data";

interface IMultiSelectDropDownProps {
    parentId?: string;
    choices?: Array<{ value: string; label: string }> | [];
    error: string | undefined | null,
    touched: boolean | undefined,
    handleChange: (prop: string) => void,

}

const CryptoFilter = ({ parentId, error, touched, handleChange }: IMultiSelectDropDownProps) => {
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const [selected, setSelected] = useState(TokenData[1]);

    const toggleDropdown = () => {
        setDropdownOpen(!isDropdownOpen);
    };

    return (
        <div className="w-full relative">
            <button
                id={`${parentId}Btn`}
                data-dropdown-toggle={parentId}
                className={`text-[#515B6E] p-2.5 px-4 bg-gradient-to-r from-[#FFFFFF] to-[#EEEFF2] border border-[#E2E4E8] h-[48px] rounded-[8px] rounded inline-flex items-center w-[120px] flex justify-between font-[600] text-[14px] leading-[24px] ${error && touched ? "border-[#EF4444] outline-0 focus:border-[#EF4444]" : ""}`}
                type="button"
                onClick={toggleDropdown}
            >
                {/* <Typography.Text> */}
                {selected.tokenLogo}

                <div className="mx-3">

                    {selected.tokenName}
                </div>
                {/* </Typography.Text> */}

                <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5.99865 4.97656L10.1236 0.851562L11.302 2.0299L5.99865 7.33323L0.695312 2.0299L1.87365 0.851562L5.99865 4.97 656Z" fill="#525C76" />
                </svg>

            </button>

            <div
                // ref={root}
                id={`tokenSelectBtn`}
                className={`absolute mt-1 z-10 transition-all duration-150 ease ${isDropdownOpen ? "visible translate-y-0 opacity-100" : "invisible -translate-y-3 opacity-0"
                    } bg-[#EEEFF2] rounded w-[150px] shadow`}
            >
                <ul
                    className="p-1 space-y-1 text-xs font-secondary h-[230px] overflow-y-scroll"
                    aria-labelledby={`tokenSelectBtn`}
                >
                    <div className=" w-full gap-4 px-3 ">
                        {TokenData.map((token) => (
                            <div className="flex items-center my-5 cursor-pointer" onClick={() => {
                                toggleDropdown(); setSelected(token); handleChange(token.id)
                            }}>
                                <div className="w-[20px] h-[20px] rounded-full mr-2">{token.tokenLogo}</div>
                                <p className="mx-2">{token.tokenName}</p>
                            </div>
                        ))}
                    </div>
                </ul>
            </div>
        </div>
    )
}
export default CryptoFilter
