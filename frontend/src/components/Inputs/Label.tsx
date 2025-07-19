
const Label = ({ text, css }: { text: string|React.ReactNode, css: string }) => {
    return (

        <label className={`text-[14px] leading-[24px] font-semibold text-[#606C82]  ${css}`}
        >
            {text}
        </label>

    )
}
export default Label