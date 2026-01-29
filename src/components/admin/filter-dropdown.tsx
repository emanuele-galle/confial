"use client";

import { ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface FilterOption {
  label: string;
  value: string;
  count?: number;
}

interface FilterDropdownProps {
  options: FilterOption[];
  value: string;
  onChange: (value: string) => void;
  label: string;
  placeholder?: string;
  className?: string;
}

export function FilterDropdown({
  options,
  value,
  onChange,
  label,
  placeholder = "Tutti",
  className,
}: FilterDropdownProps) {
  const selectedOption = options.find((opt) => opt.value === value);

  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
  };

  return (
    <div className={cn("relative inline-block", className)}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            "appearance-none w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg",
            "bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#018856] focus:border-[#018856]",
            "cursor-pointer transition-colors"
          )}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
              {option.count !== undefined && ` (${option.count})`}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </div>
      </div>
      {value && (
        <button
          type="button"
          onClick={handleReset}
          className="absolute top-8 right-8 text-gray-400 hover:text-gray-600 transition-colors pointer-events-auto"
          title="Reset filtro"
        >
          <X className="h-3 w-3" />
        </button>
      )}
      {selectedOption && (
        <div className="mt-1">
          <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-[#018856] text-white rounded-full">
            {selectedOption.label}
            <button
              type="button"
              onClick={handleReset}
              className="ml-1 hover:bg-[#016b43] rounded-full p-0.5"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        </div>
      )}
    </div>
  );
}
