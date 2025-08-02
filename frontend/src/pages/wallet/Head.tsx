interface THeadProp {
  header: string;
  subHeader: string;
}
const Head = ({ header, subHeader }: THeadProp) => {
  return (
    <div>
      <h1 className="text-[#0A0E12] text-[34px] leading-[40px] font-semibold ">
        {header}
      </h1>
      <p className="text-gray-500 text-sm ">{subHeader}</p>
    </div>
  );
};
export default Head;
