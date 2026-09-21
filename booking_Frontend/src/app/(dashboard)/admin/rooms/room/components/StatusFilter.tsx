"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface StatusOption {
  status: "AVAILABLE" | "OCCUPIED" | "MAINTENANCE";
  color?: "default" | "secondary" | "destructive" | "outline";
}

interface StatusFilterProps {
  selectedStatuses: string[];
  onStatusChange: (statuses: string[]) => void;
  title?: string;
  placeholder?: string;
  className?: string;
  multiple?: boolean;
  options: StatusOption[];
}

export function StatusFilter({
  options,
  selectedStatuses,
  onStatusChange,
  title,
  placeholder = "Chọn trạng thái",
  className,
  multiple = true,
}: StatusFilterProps) {
  function changeLanguage(status: string) {
    switch (status) {
      case "AVAILABLE":
        return "Có Sẵn";
      case "OCCUPIED":
        return "Đã Có Người";
      case "MAINTENANCE":
        return "Bảo Trì";
      default:
        return "không tồn tại";
    }
  }
  const [isOpen, setIsOpen] = useState(false);
  const handleStatusToggle = (status: string) => {
    if (multiple) {
      const newStatuses = selectedStatuses.includes(status)
        ? selectedStatuses.filter((s) => s !== status)
        : [...selectedStatuses, status];
      onStatusChange(newStatuses);
    } else {
      onStatusChange(selectedStatuses.includes(status) ? [] : [status]);
      setIsOpen(false);
    }
  };

  const clearAll = () => {
    onStatusChange([]);
  };

  return (
    <div className={cn("relative", className)}>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-foreground">{title}</label>
          {selectedStatuses.length > 0 && (
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
              selectedStatuses.length === 0 && "text-muted-foreground"
            )}
          >
            {!multiple && (
              <span className="truncate">
                {selectedStatuses.length === 0
                  ? placeholder
                  : `${selectedStatuses.length} trạng thái đã chọn`}
              </span>
            )}
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
            <div className="absolute top-full z-50 mt-1 w-full rounded-md border bg-popover p-2 shadow-lg">
              <div className="space-y-1">
                {["AVAILABLE", "OCCUPIED", "MAINTENANCE"].map((option) => {
                  const isSelected = selectedStatuses.includes(option);
                  return (
                    <div
                      key={option}
                      onClick={() => handleStatusToggle(option)}
                      className={cn(
                        "flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm cursor-pointer transition-colors",
                        "hover:bg-accent hover:text-accent-foreground",
                        isSelected && "bg-accent text-accent-foreground"
                      )}
                    >
                      <div
                        className={cn(
                          "h-4 w-4 rounded border-2 flex items-center justify-center",
                          isSelected
                            ? "bg-primary border-primary"
                            : "border-muted-foreground"
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
                      {changeLanguage(option)}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {selectedStatuses.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {selectedStatuses.map((status, index) => {
              const option = options.find((opt) => opt.status === status);
              return (
                <Badge key={index} className="text-xs" variant={option?.color}>
                  {changeLanguage(status)}
                  <button
                    onClick={() => handleStatusToggle(status)}
                    className="ml-1 hover:bg-background/20 rounded-full p-0.5"
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
