'use client';

import { useState, useRef, useEffect } from 'react';

interface CustomSelectProps {
  options: string[];
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}

export default function CustomSelect({ options, value, onChange, placeholder }: CustomSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const displayed = value || placeholder || options[0];

  return (
    <div className={`custom-select${open ? ' custom-select--open' : ''}`} ref={ref}>
      <button
        type="button"
        className="custom-select__trigger"
        onClick={() => setOpen(v => !v)}
      >
        <span style={!value && placeholder ? { color: 'var(--color-gray-text)' } : undefined}>{displayed}</span>
        <svg className="custom-select__arrow" width="12" height="8" viewBox="0 0 12 8" fill="none">
          <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </button>
      {open && (
        <div className="custom-select__dropdown">
          {placeholder && (
            <button
              type="button"
              className={`custom-select__option${!value ? ' custom-select__option--active' : ''}`}
              onClick={() => { onChange(''); setOpen(false); }}
            >
              {placeholder}
            </button>
          )}
          {options.map(opt => (
            <button
              key={opt}
              type="button"
              className={`custom-select__option${value === opt ? ' custom-select__option--active' : ''}`}
              onClick={() => { onChange(opt); setOpen(false); }}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
