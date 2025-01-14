
const Header = ({ text, subtext }: { text: string, subtext: string }) => {
    return (
        <div>
            <h1 className="font-[600] text-[28px] lg:text-[34px] leading-[40px] text-[#0A0E12] mb-4">{text}</h1>
            <p className="font-[400] text-[px] lg:text-[14px] leading-[24px] text-[#515B6E]">{subtext}</p>
        </div>
    )
}

export default Header