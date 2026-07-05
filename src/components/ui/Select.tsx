import React from 'react';
import * as SelectPrimitive from '@radix-ui/react-select';
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons';

interface SelectProps {
  value: string;
  onValueChange: (value: string) => void;
  options: { label: string; value: string }[] | string[];
  placeholder?: string;
  name?: string;
  style?: React.CSSProperties;
}

export const Select: React.FC<SelectProps> = ({ 
  value, 
  onValueChange, 
  options, 
  placeholder = 'Select...',
  name,
  style 
}) => {
  return (
    <SelectPrimitive.Root value={value} onValueChange={onValueChange} name={name}>
      <SelectPrimitive.Trigger style={{ ...triggerStyle, ...style }} aria-label={placeholder}>
        <SelectPrimitive.Value placeholder={placeholder} />
        <SelectPrimitive.Icon style={iconStyle}>
          <ChevronDownIcon />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>

      <SelectPrimitive.Portal>
        <SelectPrimitive.Content style={contentStyle} position="popper" sideOffset={5}>
          <SelectPrimitive.ScrollUpButton style={scrollButtonStyle}>
            <ChevronUpIcon />
          </SelectPrimitive.ScrollUpButton>
          
          <SelectPrimitive.Viewport style={viewportStyle}>
            {options.map((opt, i) => {
              const optValue = typeof opt === 'string' ? opt : opt.value;
              const optLabel = typeof opt === 'string' ? opt : opt.label;
              return (
                <SelectPrimitive.Item 
                  key={`${optValue}-${i}`} 
                  value={optValue} 
                  style={itemStyle}
                  className="SelectItem"
                >
                  <SelectPrimitive.ItemText>{optLabel}</SelectPrimitive.ItemText>
                  <SelectPrimitive.ItemIndicator style={indicatorStyle}>
                    <CheckIcon />
                  </SelectPrimitive.ItemIndicator>
                </SelectPrimitive.Item>
              );
            })}
          </SelectPrimitive.Viewport>
          
          <SelectPrimitive.ScrollDownButton style={scrollButtonStyle}>
            <ChevronDownIcon />
          </SelectPrimitive.ScrollDownButton>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
};

// Styles
const triggerStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  borderRadius: '8px',
  padding: '0.8rem 1rem',
  fontSize: '1rem',
  lineHeight: 1,
  backgroundColor: '#f9f9f9',
  border: '1px solid #ddd',
  color: 'var(--text-dark, #333)',
  cursor: 'pointer',
  outline: 'none',
  width: '100%',
  transition: 'border-color 0.2s',
};

const iconStyle: React.CSSProperties = {
  color: '#666',
  marginLeft: '10px',
  display: 'flex',
  alignItems: 'center',
};

const contentStyle: React.CSSProperties = {
  overflow: 'hidden',
  backgroundColor: 'white',
  borderRadius: '8px',
  boxShadow: '0px 10px 38px -10px rgba(22, 23, 24, 0.35), 0px 10px 20px -15px rgba(22, 23, 24, 0.2)',
  zIndex: 10000,
  border: '1px solid #eee',
  minWidth: 'var(--radix-select-trigger-width)',
};

const viewportStyle: React.CSSProperties = {
  padding: '5px',
};

const itemStyle: React.CSSProperties = {
  fontSize: '15px',
  lineHeight: 1,
  color: 'var(--text-dark, #333)',
  borderRadius: '4px',
  display: 'flex',
  alignItems: 'center',
  padding: '12px 35px 12px 25px',
  position: 'relative',
  userSelect: 'none',
  cursor: 'pointer',
  outline: 'none',
};

const indicatorStyle: React.CSSProperties = {
  position: 'absolute',
  left: 0,
  width: '25px',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'var(--primary)',
};

const scrollButtonStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '25px',
  backgroundColor: 'white',
  color: 'var(--primary)',
  cursor: 'default',
};
