import { useState } from "react";

interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  options: Option[];
  placeholder?: string;
  onChange: (value: string) => void;
  className?: string;
  defaultValue?: string;
  value?: string;
  disabled?: boolean;
  required?: boolean;
}

const Select: React.FC<SelectProps> = ({
  options,
  placeholder = "Selecione uma opção",
  onChange,
  className = "",
  defaultValue = "",
  value,
  disabled,
  required = false,
}) => {
  const [internalValue, setInternalValue] = useState<string>(defaultValue || "");
  const selectedValue = value !== undefined ? value : internalValue;

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;
    if (value === undefined) {
      setInternalValue(newValue);
    }
    onChange(newValue);
  };

  return (
    <div className="relative">
      <select
        disabled={disabled}
        className={`w-full appearance-none rounded-lg border border-stroke bg-transparent px-4 py-3 pr-11 text-sm outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white disabled:bg-gray-100 disabled:cursor-not-allowed ${selectedValue
          ? "text-dark dark:text-white"
          : "text-gray-400 dark:text-gray-400"
          } ${className}`}
        value={selectedValue}
        onChange={handleChange}
        required={required}
      >
        <option
          value=""
          disabled
          className="text-dark dark:bg-dark-2 dark:text-gray-400"
        >
          {placeholder}
        </option>
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            className="text-dark dark:bg-dark-2 dark:text-white"
          >
            {option.label}
          </option>
        ))}
      </select>
      {/* Ícone de seta para baixo */}
      <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
        <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
          <path d="M6 8l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </div>
  );
};

export default Select;
