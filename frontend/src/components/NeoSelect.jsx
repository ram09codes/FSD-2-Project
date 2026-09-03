import React, { useState, useRef, useEffect } from 'react';

export default function NeoSelect({ value, onChange, options, placeholder = 'Select Option' }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value || opt === value);
  const displayLabel = selectedOption
    ? typeof selectedOption === 'object'
      ? selectedOption.label || selectedOption.value
      : selectedOption
    : placeholder;

  return (
    <div className="neo-select-wrapper" ref={dropdownRef}>
      {/* Neomorphic Inset Control Button */}
      <button
        type="button"
        className={`neo-select-control ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{displayLabel}</span>
        <span className={`neo-select-arrow ${isOpen ? 'open' : ''}`}>▾</span>
      </button>

      {/* Raised Floating Neomorphic Options Menu */}
      {isOpen && (
        <div className="neo-select-dropdown">
          {options.map((opt, index) => {
            const optVal = typeof opt === 'object' ? opt.value : opt;
            const optLabel = typeof opt === 'object' ? opt.label || opt.value : opt;
            const isSelected = optVal === value;

            return (
              <div
                key={index}
                className={`neo-select-option ${isSelected ? 'selected' : ''}`}
                onClick={() => {
                  onChange(optVal);
                  setIsOpen(false);
                }}
              >
                {optLabel}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}