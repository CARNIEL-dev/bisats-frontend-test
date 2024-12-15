
const Label = ({ text, css }: { text: string, css: string }) => {
    return (

        <label className={`text-[14px] leading-[24px] font-[600] text-[#606C82] capitalize ${css}`}
        >
            {text}
        </label>

    )
}
export default Label