import { InputHTMLAttributes } from "react";
import Label from "./Label";


interface TInput extends InputHTMLAttributes<HTMLInputElement> {
    css: string,
    label: string,
    error: string | undefined | null,
    touched: boolean | undefined
}
const PrimaryInput: React.FC<TInput> = ({ css, label, error, touched, ...props }) => {
    return (
        <div className='w-full h-full'>
            <div className="mb-2">
                <Label text={label} css="" />
            </div>
            <input
                type={props.type ?? "text"}
                style={{outline:"none"}}
                className={`rounded-[6px] text-[14px] leading-[24px] text-[#525C76] font-[300] border-[1px] border-[#D6DAE1] outline-[none] focus:border-[#C49600] focus:shadow-[0_0_10px_#FEF8E5] text-[#606C82] p-1 px-3 ${css} ${error && touched ? "border-[#EF4444] outline-0 focus:border-[#EF4444]" : ""}`}
                {...props}
            />
        </div>
    )
}
export default PrimaryInput