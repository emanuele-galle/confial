import { ReactNode } from "react";

interface FormFieldProps {
  label: string;
  error?: { message?: string };
  required?: boolean;
  children: ReactNode;
  helperText?: string;
}

export function FormField({
  label,
  error,
  required,
  children,
  helperText,
}: FormFieldProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
      {error && (
        <p className="text-sm text-red-600 flex items-center gap-1">
          <span>⚠</span>
          {error.message}
        </p>
      )}
      {!error && helperText && (
        <p className="text-xs text-gray-500">{helperText}</p>
      )}
    </div>
  );
}
