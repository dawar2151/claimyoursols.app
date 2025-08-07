import React from 'react';

interface InputFieldProps {
    type: string;
    value: string | number | undefined;
    onChange: (_: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder: string;
    error?: string;
}

export const XInputField: React.FC<InputFieldProps> = ({ type, value, onChange, placeholder, error }) => {
    return (
        <div>
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`w-full bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-300 placeholder-gray-500 dark:placeholder-gray-400 ${error ? "border-red-500" : "border-gray-300"} rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none p-3 transition-all duration-300 ease-in-out`}
            />
            {error && (
                <p className="text-red-500 mt-1">
                    {error}
                </p>
            )}
        </div>
    );
};