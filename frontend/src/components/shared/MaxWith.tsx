import { cn } from "@/utils";
import { ElementType, HTMLAttributes, ReactNode } from "react";

type MaxWidthProps<T extends ElementType = "div"> = {
  as?: T;
  children?: ReactNode;
  className?: string;
} & HTMLAttributes<HTMLElement>;

const MaxWidth = <T extends ElementType = "div">({
  as,
  children,
  className,
  ...rest
}: MaxWidthProps<T>) => {
  const Component = as || "div";

  return (
    <Component
      {...rest}
      className={cn("mx-auto w-[92%] max-w-720", className)}
    >
      {children}
    </Component>
  );
};

export default MaxWidth;
