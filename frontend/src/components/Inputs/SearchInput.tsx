import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/utils";

interface SearchInputProps {
  placeholder?: string;
  value?: string;
  handleChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  iconSize?: number;
  inputClassName?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({
  placeholder = "Search...",
  value,
  handleChange,
  className = "",
  iconSize = 18,
  inputClassName,
}) => {
  return (
    <div className={cn(`relative w-full`, className)}>
      <Search
        className="absolute left-3 top-1/2 transform -translate-y-1/2"
        color="#99A2B4"
        size={iconSize}
      />
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        className={cn("w-full  pl-9 h-12 ", inputClassName)}
      />
    </div>
  );
};

export default SearchInput;
