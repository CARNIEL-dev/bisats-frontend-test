import { Button } from "@/components/ui/Button";
import { Check, Copy } from "lucide-react";
import { memo, useCallback, useState } from "react";

interface CopyButtonProps {
  text: string;
  type: "link" | "code";
  children?: React.ReactNode;
  className?: string;
  variant?: "ghost" | "secondary";
  size?: "sm" | "default" | "icon";
  showText?: boolean;
  title?: string;
}

const CopyButton = memo(function CopyButton({
  text,
  type,
  children,
  className = "",
  variant = "ghost",
  size = "sm",
  showText = false,
  title = "Copy",
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    },
    [text],
  );

  const buttonContent = showText ? (
    <>
      {copied ? (
        <>
          <Check className="w-4 h-4 text-green-600" /> Copied
        </>
      ) : children ? (
        children
      ) : (
        <>
          <Copy className="w-4 h-4" /> Copy {type === "code" ? "Code" : "Link"}
        </>
      )}
    </>
  ) : copied ? (
    <Check className="w-4 h-4 text-green-600" />
  ) : children ? (
    children
  ) : (
    <Copy className="w-4 h-4" />
  );

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleCopy}
      title={title}
    >
      {buttonContent}
    </Button>
  );
});

export default CopyButton;
