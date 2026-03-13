interface THeadProp {
  header: string;
  subHeader?: string;
}
const Head = ({ header, subHeader }: THeadProp) => {
  return (
    <div>
      <h1 className="text-foreground text-[34px] leading-[40px] font-semibold ">
        {header}
      </h1>
      {subHeader && (
        <p className="text-muted-foreground text-sm ">{subHeader}</p>
      )}
    </div>
  );
};
export default Head;
