import { forwardRef, SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[];
  placeholder?: string;
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ options, placeholder, error, className = "", ...props }, ref) => {
    return (
      <div className="w-full">
        <select
          ref={ref}
          className={cn(
            "w-full rounded-lg border",
            "bg-white dark:bg-gray-800",
            "text-gray-900 dark:text-gray-100",
            "focus:outline-none focus:ring-2 focus:border-transparent px-3 py-2",
            error
              ? "border-danger-500 focus:ring-danger-500"
              : "border-gray-300 dark:border-gray-600 focus:ring-primary-500",
            className,
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && (
          <p className="mt-1 text-sm text-danger-600 dark:text-danger-400">
            {error}
          </p>
        )}
      </div>
    );
  },
);

Select.displayName = "Select";
