import { ReactSVGElement, useMemo, useState } from "react";
import Label from "./Label";
import { TokenData } from "../../data";
import { TNetwork } from "../../pages/wallet/deposits";
import { WalletState } from "../../redux/reducers/walletSlice";
import { useSelector } from "react-redux";
import { formatNumber } from "../../utils/numberFormat";

interface TTokenSelectProps {
    title: string,
    label: string,
    error: string | undefined | null,
    touched: boolean | undefined,
    handleChange: (prop: string) => void,
    removexNGN?: boolean
    hideDropdown?:boolean

}

type TTokenOption = {
    id: string,
    tokenName: string,
    currentBalance: string,
    networks: TNetwork[],
    tokenLogo: JSX.Element

} | null


const TokenSelect = ({ title, label, error, touched, handleChange,removexNGN,hideDropdown }: TTokenSelectProps) => {
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const [selected, setSelected] = useState<TTokenOption>(null);
    const walletState: WalletState = useSelector((state: any) => state.wallet);
    const walletData= walletState.wallet


    const toggleDropdown = () => {
        setDropdownOpen(!isDropdownOpen);
    };

     const calculateCurrentWalletBallance = useMemo(() => {
           console.log(walletData,selected)
                return walletData ? `${formatNumber( walletData[selected?.id??"xNGN"] )} ${selected?.id}`: 0
            
        }, [selected?.id, walletData])
    return (
        <div className="w-full relative">
            {label && (
                <div className="mb-2">
                    <Label text={label} css="" />
                </div>

            )}
            <button
                id={`tokenSelectBtn`}
                // data-dropdown-toggle={parentId}
                className={`text-[#515B6E] p-2.5 bg-gradient-to-r from-[#FFFFFF] to-[#EEEFF2] border border-[#E2E4E8] h-[48px] rounded-[8px] rounded inline-flex items-center w-full flex justify-between font-[600] text-[14px] leading-[24px]  ${error && touched ? "border-[#EF4444] outline-0 focus:border-[#EF4444]" : ""}`}
                type="button"
                onClick={toggleDropdown}
            >
                {selected ? selected.tokenName : title}
                <div className="flex items-center">
                    {
                        selected ? <div className="w-[20px] h-[20px] rounded-full">{selected.tokenLogo}</div>
                            :
                            <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5.99865 4.97656L10.1236 0.851562L11.302 2.0299L5.99865 7.33323L0.695312 2.0299L1.87365 0.851562L5.99865 4.97 656Z" fill="#525C76" />
                            </svg>
                    }
                </div>
            </button>
            {selected && <p className="text-[#606C82] text-[12px] leading-[16px] font-[400] mt-2.5">Current Balance: <span className="font-[600] text-[#515B6E]">{( calculateCurrentWalletBallance??0)}</span></p>
            }
            {
                !hideDropdown &&

                <div
                    // ref={root}
                    id={`tokenSelectBtn`}
                    className={`absolute mt-1 z-10 transition-all duration-150 ease ${isDropdownOpen ? "visible translate-y-0 opacity-100" : "invisible -translate-y-3 opacity-0"
                        } bg-[#EEEFF2] rounded w-full shadow`}
                >
                    <ul
                        className="p-1 space-y-1 text-xs font-secondary h-[230px] overflow-y-scroll"
                        aria-labelledby={`tokenSelectBtn`}
                    >
                        <div className=" w-full gap-4 px-3 ">
                            {
                                !removexNGN ? TokenData.map((token) => (
                                    <div className="flex items-center my-5 cursor-pointer" onClick={() => {
                                        toggleDropdown(); setSelected(token); handleChange(token.id)
                                    }}>
                                        <div className="w-[20px] h-[20px] rounded-full mr-2">{token.tokenLogo}</div>
                                        <p className="mx-2">{token.tokenName}</p>
                                    </div>
                                )) :
                                    TokenData.slice(1).map((token) => (
                                        <div className="flex items-center my-5 cursor-pointer" onClick={() => {
                                            toggleDropdown(); setSelected(token); handleChange(token.id)
                                        }}>
                                            <div className="w-[20px] h-[20px] rounded-full mr-2">{token.tokenLogo}</div>
                                            <p className="mx-2">{token.tokenName}</p>
                                        </div>
                                    ))
                    
                            }
                        </div>
                    </ul>
                </div>}
        </div>
    )
}


export default TokenSelect