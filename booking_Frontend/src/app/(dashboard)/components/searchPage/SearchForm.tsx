"use client";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import React from "react";

interface SearchFormProps {
  search: string | number;
  setSearch: (search: string) => void;
  setPage: (page: number) => void;
  placeholder: string;
  resetPage?: boolean;
  className?: string;
}

const SearchForm = ({
  search,
  setPage,
  setSearch,
  placeholder,
  resetPage = true,
  className = "",
}: SearchFormProps) => {
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    if (resetPage) setPage?.(1);
  };

  const handleClear = () => {
    setSearch("");
    if (resetPage) setPage?.(1);
  };

  const hasValue = String(search).length > 0;

  return (
    <div className={`relative group w-full sm:w-auto ${className}`}>
      {/* Search icon */}
      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />

      <Input
        placeholder={placeholder}
        className="pl-10 pr-10 py-5 w-full sm:w-80 rounded-xl border border-input bg-background shadow-sm transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:border-primary hover:border-primary/50 placeholder:text-muted-foreground/60 text-sm"
        value={search}
        onChange={handleSearch}
      />

      {/* Clear button */}
      {hasValue && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-muted hover:bg-muted-foreground/20 flex items-center justify-center transition-colors"
          type="button"
        >
          <X className="h-3 w-3 text-muted-foreground" />
        </button>
      )}
    </div>
  );
};

export default SearchForm;
