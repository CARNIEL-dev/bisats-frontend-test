import React, { ButtonHTMLAttributes } from 'react'
import { BounceLoader, DotLoader } from 'react-spinners'


interface TButtons extends ButtonHTMLAttributes<HTMLButtonElement> {
    css: string,
    text: string,
    loading: boolean
}
export const PrimaryButton: React.FC<TButtons> = ({ css, text, loading, ...props }) => {
    return (
        <button type='submit' className={`h-[48px] w-full rounded-[6px] bg-[#F5BB00] text-[#0A0E12] text-[14px] leading-[24px] font-[600] text-center py-3 shadow-[0_0_0.8px_#000] ${props.disabled ? "bg-[lightGrey] text-grey" : ""}`}
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
        <button type='submit' className={`h-[48px] w-full rounded-[6px] bg-transparent text-[#DC2625] text-[14px] leading-[24px] font-[600] text-center py-3`}
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
