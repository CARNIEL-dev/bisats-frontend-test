const Label = ({
  text,
  className,
}: {
  text: string | React.ReactNode;
  className?: string;
}) => {
  return (
    <label
      className={`text-[14px] leading-[24px] font-semibold text-foreground  ${className}`}
    >
      {text}
    </label>
  );
};
export default Label;
