import { Search } from "lucide-react";

interface SearchInputProps {
  placeholder?: string;
  value?: string;
  handleChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  iconSize?: number;
}

const SearchInput: React.FC<SearchInputProps> = ({
  placeholder = "Search...",
  value,
  handleChange,
  className = "",
  iconSize = 14,
}) => {
  return (
    <div className={`relative w-full max-w-md ${className}`}>
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2" color="#99A2B4" size={iconSize} />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        className="w-full pr-4 py-2 px-3 pl-10 font-[300] text-[14px] text-[#606C82] rounded-[6px] border-[1px] border-[#D6DAE1] outline-none leading-[24px] focus:border-[#F5BB00] focus:ring-1 focus:ring-[#F5BB00]"
      />
    </div>
  );
};

export default SearchInput;
