'use client';

import { Button, VisuallyHidden, useCheckbox } from '@heroui/react';

import { ReactNode } from 'react';

interface ToggleProps {
  children: ReactNode;
  value: string;
  isSelected: boolean;
  onToggle: (isSelected: boolean) => void;
  ariaLabel?: string;
}

export const Toggle = ({ children, value, isSelected, onToggle, ariaLabel }: ToggleProps) => {
  const { getInputProps, getBaseProps, getLabelProps } = useCheckbox({
    value,
    isSelected,
    onChange: (e) => onToggle(e.target.checked),
    'aria-label': ariaLabel,
  });

  // Extract ONLY the ID and basic ARIA props to avoid FocusEvent conflicts
  const { id, ...labelProps } = getLabelProps();

  return (
    <label {...getBaseProps()} className="flex items-center justify-center p-0 m-0">
      <VisuallyHidden>
        <input {...getInputProps()} />
      </VisuallyHidden>
      <Button
        as="span"
        isIconOnly
        size="sm"
        radius="sm"
        variant={isSelected ? 'flat' : 'light'}
        color={isSelected ? 'primary' : 'default'}
        // We manually assign the ID to link the label/input to this visual element
        id={id}
        className="cursor-pointer min-w-8 h-8 transition-transform active:scale-90"
      >
        {children}
      </Button>
    </label>
  );
};
