const Header = ({ text, subtext }: { text: string; subtext: string }) => {
  return (
    <div>
      <h2 className="font-semibold text-[28px] lg:text-[34px]  text-[#0A0E12] mb-1">
        {text}
      </h2>
      <p className="font-normal text-xs lg:text-[14px]  text-[#515B6E]">
        {subtext}
      </p>
    </div>
  );
};

export default Header;
