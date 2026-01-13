import React, { ChangeEvent } from 'react';

interface CpfInputProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  name: string;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
}

export const CpfInput: React.FC<CpfInputProps> = ({
  value,
  onChange,
  name,
  disabled = false,
  className = '',
  placeholder = '000.000.000-00',
}) => {
  const formatCpf = (value: string): string => {
    // Remove tudo que não é dígito
    const numbers = value.replace(/\D/g, '');
    
    // Limita a 11 dígitos
    const limited = numbers.slice(0, 11);
    
    // Aplica a máscara
    if (limited.length <= 3) {
      return limited;
    } else if (limited.length <= 6) {
      return `${limited.slice(0, 3)}.${limited.slice(3)}`;
    } else if (limited.length <= 9) {
      return `${limited.slice(0, 3)}.${limited.slice(3, 6)}.${limited.slice(6)}`;
    } else {
      return `${limited.slice(0, 3)}.${limited.slice(3, 6)}.${limited.slice(6, 9)}-${limited.slice(9)}`;
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCpf(e.target.value);
    
    // Cria um novo evento com o valor formatado
    const syntheticEvent = {
      ...e,
      target: {
        ...e.target,
        value: formatted,
        name,
      },
    } as ChangeEvent<HTMLInputElement>;
    
    onChange(syntheticEvent);
  };

  return (
    <input
      type="text"
      name={name}
      value={value}
      onChange={handleChange}
      disabled={disabled}
      placeholder={placeholder}
      className={className}
      maxLength={14} // 000.000.000-00
      inputMode="numeric"
    />
  );
};
