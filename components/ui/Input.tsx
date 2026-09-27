import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = "", id, ...props }, ref) => {
    const inputId = id || props.name;

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-aiesec-navy">
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={`w-full px-4 py-2.5 bg-aiesec-surface border rounded-xl text-sm text-aiesec-text placeholder:text-aiesec-text-muted transition-all duration-200 focus:outline-none focus:ring-2 ${
            error
              ? "border-aiesec-danger focus:ring-aiesec-danger/20"
              : "border-aiesec-border focus:border-aiesec-blue focus:ring-aiesec-blue/20"
          } ${className}`}
          {...props}
        />
        {error ? (
          <p className="text-xs text-aiesec-danger font-medium">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-aiesec-text-muted">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";