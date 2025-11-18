'use client';

import { useState, useRef, useEffect } from 'react';

interface TTLOption {
  value: number;
  label: string;
}

interface TTLSelectorProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

const ttlOptions: TTLOption[] = [
  { value: 3600, label: '1 hour' },
  { value: 86400, label: '1 day' },
  { value: 604800, label: '1 week' },
  { value: 2592000, label: '30 days' },
];

export default function TTLSelector({ value, onChange, disabled = false }: TTLSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = ttlOptions.find((opt) => opt.value === value) || ttlOptions[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (option: TTLOption) => {
    onChange(option.value);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-sm text-cyan-400 mb-2">Time to Live</label>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className="w-full p-3 bg-black border border-cyan-500/30 rounded-lg text-cyan-50 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-between hover:border-cyan-500/50 transition-colors"
      >
        <span className="font-mono text-sm">{selectedOption.label}</span>
        <svg
          className={`w-4 h-4 text-cyan-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-2 bg-black border border-cyan-500/30 rounded-lg shadow-lg overflow-hidden animate-fade-in">
          {ttlOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSelect(option)}
              className={`w-full px-4 py-3 text-left text-sm font-mono transition-colors cursor-pointer ${
                option.value === value
                  ? 'bg-cyan-500/20 text-cyan-300 border-l-2 border-cyan-500'
                  : 'text-cyan-50 hover:bg-cyan-500/10 hover:text-cyan-300'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

