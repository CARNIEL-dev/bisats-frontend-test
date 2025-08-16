import { Separator } from "@/components/ui/separator";
import { cn } from "@/utils";
const Divider = ({
  text,
  textClassName,
  className,
}: {
  text: string;
  textClassName?: string;
  className?: string;
}) => {
  return (
    <div className={cn("relative my-6", className)}>
      <Separator />
      <p
        className={cn(
          "text-[#515B6E] font-normal text-xs absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-2",
          textClassName
        )}
      >
        {text}
      </p>
    </div>
  );
};

export default Divider;
