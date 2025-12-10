import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    icon?: React.ReactNode;
    startAdornment?: React.ReactNode;
    inputClassName?: string;
}

export const Input: React.FC<InputProps> = ({
    label,
    error,
    icon,
    startAdornment,
    className = "",
    inputClassName = "",
    id,
    ...props
}) => {
    const inputId = id || props.name || Math.random().toString(36).substr(2, 9);

    return (
        <div className={`w-full ${className}`}>
            {label && (
                <label
                    htmlFor={inputId}
                    className="block text-sm font-medium text-gray-700 mb-1.5 ml-1"
                >
                    {label}
                </label>
            )}
            <div className="relative group flex items-center">
                {/* Absolute Icon (Standard) */}
                {icon && !startAdornment && (
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors z-10">
                        {icon}
                    </div>
                )}

                {/* Start Adornment (Custom - e.g., Country Picker) */}
                {startAdornment && (
                    <div className="absolute inset-y-0 left-0 flex items-center z-20">
                        {startAdornment}
                    </div>
                )}

                <input
                    id={inputId}
                    className={`
            w-full bg-gray-50/50 border rounded-xl py-3 text-gray-900 placeholder-gray-400
            focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white outline-none transition-all duration-200
            disabled:bg-gray-50 disabled:text-gray-500
            ${startAdornment ? "" : icon ? "pl-11" : "pl-4"} pr-4
            ${
                error
                    ? "border-red-500 focus:ring-red-500 focus:border-red-500 bg-red-50/10"
                    : "border-gray-200 hover:border-gray-300"
            }
            ${inputClassName}
          `}
                    {...props}
                />
            </div>
            {error && (
                <p className="mt-1.5 text-xs font-medium text-red-600 ml-1 animate-in slide-in-from-top-1">
                    {error}
                </p>
            )}
        </div>
    );
};
