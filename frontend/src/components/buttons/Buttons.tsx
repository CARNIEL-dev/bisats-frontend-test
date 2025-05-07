import React, { ButtonHTMLAttributes } from 'react'
import { BounceLoader, DotLoader } from 'react-spinners'


interface TButtons extends ButtonHTMLAttributes<HTMLButtonElement> {
    css?: string,
    text: string|React.ReactNode,
    loading: boolean
    size?: "sm" | "md"

}
export const PrimaryButton: React.FC<TButtons> = ({ css, text, loading, ...props }) => {
    return (
        <button
            type='submit'
        disabled={loading}
            className={`flex justify-center h-[48px]  px-5 rounded-[6px] bg-[#F5BB00] text-[#0A0E12] text-[14px] leading-[24px] font-[600] text-center py-3 shadow-[0_0_0.8px_#000] ${props.disabled ? "bg-[lightGrey] text-grey" : ""} ${css}`}
            {...props}>
            {
                loading ? <DotLoader
                    color={"#0A0E12"}
                    loading={loading}
                    // cssOverride={override}
                    size={30}
                    aria-label="Loading Spinner"
                    data-testid="loader" /> : text
            }
        </button>
    )
}

export const RedTransparentButton: React.FC<TButtons> = ({ css, text, loading, ...props }) => {
    return (
        <button type='submit' className={`h-[48px] rounded-[6px] bg-transparent text-[#DC2625] text-[14px] leading-[24px] font-[600] text-center py-3`}
            {...props}>
            {
                loading ? <DotLoader
                    color={"#0A0E12"}
                    loading={loading}
                    // cssOverride={override}
                    size={30}
                    aria-label="Loading Spinner"
                    data-testid="loader" /> : text
            }
        </button>
    )
}


export const WhiteTransparentButton: React.FC<TButtons> = ({ size, css, text, loading, ...props }) => {
    return (
        <button type='submit' className={`flex justify-center ${css} ${size === "sm" ? "h-[32px] text-[12px] py-0.5 px-3" : "h-[48px] text-[14px] py-3"}  rounded-[6px] bg-transparent text-[#525C76] border-[1px] border-[#D6DAE1]  leading-[24px] font-[600] text-center`}
            {...props}>
            {
                loading ? <DotLoader
                    color={"#0A0E12"}
                    loading={loading}
                    // cssOverride={override}
                    size={20}
                    aria-label="Loading Spinner"
                    data-testid="loader" /> : text
            }
        </button>
    )
}