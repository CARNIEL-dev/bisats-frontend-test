interface THeadProp {
    header: string,
    subHeader: string

}
const Head = ({ header, subHeader }: THeadProp) => {
    return (
        <div>
            <h1 className="text-[#0A0E12] text-[34px] leading-[40px] font-semibold ">{header}</h1>
            <p className="text-[#515B6E] text-[14px] leading-[24px] font-normal my-2 ">{subHeader}</p>
        </div>
    )
}
export default Head