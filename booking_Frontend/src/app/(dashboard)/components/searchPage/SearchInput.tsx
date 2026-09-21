import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import React from "react";

interface SearchInputProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  placeholder?: string;
}
const SearchInput = ({
  searchTerm,
  setSearchTerm,
  placeholder,
}: SearchInputProps) => {
  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder={placeholder || "Search customers..."}
          className="pl-8 w-[250px] md:w-[300px]"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
    </div>
  );
};

export default SearchInput;
