"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface RoomTypeOption {
  id: string;
  name: string;
  maxOccupancy?: number;
}

interface RoomTypeFilterProps {
  options?: RoomTypeOption[] | null;
  isLoading?: boolean;
  errorMessage?: string;
  selectedTypes: string[];
  onTypeChange: (types: string[]) => void;
  title?: string;
  placeholder?: string;
  className?: string;
  multiple?: boolean;
  showCapacity?: boolean;
}

export function RoomTypeFilter({
  options: suppliedOptions,
  isLoading = false,
  errorMessage,
  selectedTypes,
  onTypeChange,
  title,
  placeholder = "Chọn loại phòng",
  className,
  multiple = true,
  showCapacity = false,
}: RoomTypeFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const options = Array.isArray(suppliedOptions) ? suppliedOptions : [];

  const handleTypeToggle = (type: string) => {
    if (multiple) {
      const newTypes = selectedTypes.includes(type)
        ? selectedTypes.filter((t) => t !== type)
        : [...selectedTypes, type];
      onTypeChange(newTypes);
    } else {
      onTypeChange(selectedTypes.includes(type) ? [] : [type]);
    }
  };

  const clearAll = () => {
    onTypeChange([]);
  };

  return (
    <div className={cn("relative", className)}>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-foreground">{title}</label>
          {selectedTypes.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAll}
              className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
            >
              Xóa tất cả
            </Button>
          )}
        </div>

        <div className="relative">
          <Button
            variant="outline"
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
              "w-full justify-between text-left font-normal",
              selectedTypes.length === 0 && "text-muted-foreground"
            )}
          >
            <span className="truncate">
              {selectedTypes.length === 0
                ? placeholder
                : `${selectedTypes.length} loại phòng đã chọn`}
            </span>
            <svg
              className={cn(
                "h-4 w-4 transition-transform",
                isOpen && "rotate-180"
              )}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </Button>

          {isOpen && (
            <div className="absolute top-full z-40 mt-1 w-full rounded-md border bg-popover p-2 shadow-lg max-h-80 overflow-y-auto">
              <div className="space-y-1">
                {(isLoading || errorMessage || options.length === 0) && (
                  <p role="status" className="px-3 py-2 text-sm text-muted-foreground">
                    {errorMessage || (isLoading ? "Đang tải loại phòng…" : "Chưa có loại phòng.")}
                  </p>
                )}
                {options.map((option) => {
                  const isSelected = selectedTypes.includes(option.name);
                  return (
                    <div
                      key={option.id}
                      onClick={() => handleTypeToggle(option.name)}
                      className={cn(
                        "flex items-start gap-3 rounded-sm px-3 py-2 cursor-pointer transition-colors",
                        "hover:bg-accent hover:text-accent-foreground",
                        isSelected && "bg-accent text-accent-foreground"
                      )}
                    >
                      <div
                        className={cn(
                          "h-4 w-4 rounded border-2 flex items-center justify-center mt-0.5 flex-shrink-0",
                          isSelected
                            ? "bg-primary border-primary"
                            : "border-muted-foreground "
                        )}
                      >
                        {isSelected && (
                          <svg
                            className="h-3 w-3 text-primary-foreground"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{option.name}</span>
                        </div>

                        <div className="flex items-center gap-4 mt-1">
                          {showCapacity && option.maxOccupancy && (
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <svg
                                className="h-3 w-3"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              {option.maxOccupancy} người
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {selectedTypes.length > 0 && (
          <div className="flex justify-around gap-1">
            {selectedTypes.map((type) => {
              const option = options.find((opt) => opt.name === type);
              return (
                <Badge key={type} variant="secondary" className="text-xs">
                  {option?.name || type}
                  <button
                    onClick={() => handleTypeToggle(type)}
                    className="ml-1 hover:bg-background/20 rounded-full p-0.5 hover:text-red-500 cursor-pointer"
                  >
                    <svg
                      className="h-3 w-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </Badge>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
