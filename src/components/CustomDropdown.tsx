'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import styles from './CustomDropdown.module.css';

export interface DropdownOption {
  value: string;
  label: string;
  badge?: string | number;
  color?: string;
  icon?: React.ReactNode;
}

interface CustomDropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  icon?: React.ReactNode;
  placeholder?: string;
  className?: string;
  fullWidth?: boolean;
  size?: 'sm' | 'md';
  style?: React.CSSProperties;
}

export default function CustomDropdown({
  options,
  value,
  onChange,
  icon,
  placeholder = 'Select option',
  className,
  fullWidth = false,
  size = 'md',
  style,
}: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setIsOpen(false);
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
  };

  return (
    <div
      className={`${styles.dropdownContainer} ${fullWidth ? styles.fullWidth : ''} ${className || ''}`}
      ref={containerRef}
      style={style}
    >
      <button
        type="button"
        className={`${styles.triggerButton} ${size === 'sm' ? styles.sizeSm : ''} ${fullWidth ? styles.triggerFullWidth : ''} ${isOpen ? styles.triggerButtonOpen : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className={styles.triggerContent}>
          {selectedOption?.icon || icon}
          {selectedOption?.color && (
            <span
              className={styles.statusDot}
              style={{ backgroundColor: selectedOption.color }}
            />
          )}
          <span className={styles.triggerLabel}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </span>
        <ChevronDown
          size={size === 'sm' ? 14 : 16}
          className={`${styles.chevronIcon} ${isOpen ? styles.chevronIconRotated : ''}`}
        />
      </button>

      {isOpen && (
        <ul className={`${styles.dropdownMenu} ${fullWidth ? styles.menuFullWidth : ''}`} role="listbox">
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <li
                key={opt.value}
                className={`${styles.dropdownItem} ${isSelected ? styles.dropdownItemActive : ''}`}
                onClick={() => handleSelect(opt.value)}
                role="option"
                aria-selected={isSelected}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                  {opt.icon}
                  {opt.color && (
                    <span
                      className={styles.statusDot}
                      style={{ backgroundColor: opt.color }}
                    />
                  )}
                  <span>{opt.label}</span>
                  {opt.badge !== undefined && (
                    <span className={styles.itemBadge}>{opt.badge}</span>
                  )}
                </div>
                {isSelected && <Check size={15} className={styles.checkIcon} />}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
