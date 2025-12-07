'use client';

import React, { useState, useEffect, useRef } from 'react';
interface SelectOption {
  label: string;
  value: string;
}

interface CustomSelectProps {
  options: SelectOption[];
  onSelect?: (option: SelectOption) => void;
  placeholder?: string;
  width?: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  onSelect = () => {},
  placeholder,
  width = '200px',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<SelectOption>(
    options[0] || { label: 'Select', value: '' }
  );
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Toggle dropdown
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Handle option click
  const handleOptionClick = (option: SelectOption) => {
    setSelectedOption(option);
    onSelect(option);
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
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

  return (
    <div
      ref={dropdownRef}
      className="dropdown-content custom-select relative"
      style={{ width }}
    >
      {/* Select Button */}
      <div
        className={`select-selected whitespace-nowrap cursor-pointer ${
          isOpen ? 'select-arrow-active' : ''
        }`}
        onClick={toggleDropdown}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            toggleDropdown();
          }
        }}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        {selectedOption.label}
      </div>

      {/* Dropdown Items */}
      <div className={`select-items ${isOpen ? '' : 'select-hide'}`} role="listbox">
        {options.map((option, index) => (
          <div
            key={`${option.value}-${index}`}
            className={`select-item ${
              selectedOption.value === option.value ? 'same-as-selected' : ''
            }`}
            onClick={() => handleOptionClick(option)}
            role="option"
            aria-selected={selectedOption.value === option.value}
          >
            {option.label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomSelect;