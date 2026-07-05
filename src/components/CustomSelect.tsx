import React, { useState, useRef, useEffect } from 'react';

interface CustomSelectProps {
  name: string;
  value: string;
  options: string[] | { label: string; value: string }[];
  onChange: (e: any) => void;
  placeholder?: string;
  style?: React.CSSProperties;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({ name, value, options, onChange, placeholder = 'Select', style }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedLabel = typeof options[0] === 'string' 
    ? value 
    : (options as {label: string, value: string}[]).find(o => o.value === value)?.label;

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%', userSelect: 'none' }}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          ...style,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer',
          backgroundColor: '#f9f9f9',
          outline: isOpen ? '2px solid var(--primary-light)' : 'none'
        }}
      >
        <span style={{ color: value ? '#333' : '#999', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {selectedLabel || placeholder}
        </span>
        <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', marginLeft: '10px', flexShrink: 0 }}>
          <path d="M1 1.5L6 6.5L11 1.5" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 5px)',
          left: 0,
          right: 0,
          backgroundColor: '#fff',
          borderRadius: '8px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
          maxHeight: '220px',
          overflowY: 'auto',
          zIndex: 9999,
          border: '1px solid #eee'
        }}>
          {options.map((opt, idx) => {
            const optVal = typeof opt === 'string' ? opt : opt.value;
            const optLabel = typeof opt === 'string' ? opt : opt.label;
            const isSelected = value === optVal;
            
            return (
              <div 
                key={idx}
                onClick={() => {
                  onChange({ target: { name, value: optVal } });
                  setIsOpen(false);
                }}
                style={{
                  padding: '12px 15px',
                  cursor: 'pointer',
                  borderBottom: idx === options.length - 1 ? 'none' : '1px solid #f5f5f5',
                  backgroundColor: isSelected ? '#f0f7ff' : '#fff',
                  color: isSelected ? 'var(--primary)' : '#333',
                  fontWeight: isSelected ? '600' : '400',
                  display: 'flex',
                  alignItems: 'center',
                  transition: 'background-color 0.15s'
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) e.currentTarget.style.backgroundColor = '#f9f9f9';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = isSelected ? '#f0f7ff' : '#fff';
                }}
              >
                <div style={{ width: '20px', display: 'flex', alignItems: 'center' }}>
                  {isSelected && (
                    <svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 5L4.5 8.5L11 1.5" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
                {optLabel}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
