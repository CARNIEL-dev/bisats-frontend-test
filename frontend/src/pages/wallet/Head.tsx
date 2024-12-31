interface THeadProp {
    header: string,
    subHeader: string

}
const Head = ({ header, subHeader }: THeadProp) => {
    return (
        <div>
            <h1 className="text-[#0A0E12] text-[34px] leading-[40px] font-[600] ">{header}</h1>
            <p className="text-[#515B6E] text-[14px] leading-[24px] font-[400] my-2 ">{subHeader}</p>
        </div>
    )
}
export default Head