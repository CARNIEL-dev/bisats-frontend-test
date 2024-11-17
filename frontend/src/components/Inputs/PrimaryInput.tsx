import { InputHTMLAttributes } from "react";


interface TInput extends InputHTMLAttributes<HTMLInputElement> {
    css: string
}
const PrimaryInput: React.FC<TInput> = ({ css, ...props }) => {
    return (
        <div className='w-full h-full'>

            <input
                type={props.type ?? "text"}
                className={`rounded-[6px] border-[1px] border-[#D6DAE1] outline-[none] focus:border-[#C49600] focus:shadow-[0_0_10px_#FEF8E5] text-[#606C82] p-1 ${css}`}
                {...props}
            />

        </div>
    )
}
export default PrimaryInput