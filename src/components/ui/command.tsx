'use client';

import * as React from 'react';

import { Modal, ModalBody, ModalContent, ModalHeader, cn } from '@heroui/react';

import { SearchIcon } from 'lucide-react';

const Command = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'bg-content1 text-foreground flex h-full w-full flex-col overflow-hidden rounded-md shadow-lg border-small border-default-100',
        className,
      )}
      {...props}
    />
  ),
);
Command.displayName = 'Command';

function CommandDialog({
  isOpen,
  onOpenChange,
  children,
  className,
  title = 'Command Palette',
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
  title?: string;
}) {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      hideCloseButton
      className={cn('overflow-hidden p-0', className)}
      size="lg"
    >
      <ModalContent>
        <ModalHeader className="sr-only">{title}</ModalHeader>
        <ModalBody className="p-0">
          <Command className="border-none shadow-none">{children}</Command>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

const CommandInput = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <div className="flex h-10 items-center gap-2 border-b border-default-100 px-3">
      <SearchIcon className="size-4 shrink-0 opacity-50" />
      <input
        ref={ref}
        className={cn(
          'placeholder:text-default-400 flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        {...props}
      />
    </div>
  ),
);
CommandInput.displayName = 'CommandInput';

const CommandList = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('max-h-75 overflow-x-hidden overflow-y-auto p-1', className)} {...props} />
  ),
);
CommandList.displayName = 'CommandList';

const CommandGroup = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { label?: string }>(
  ({ className, label, children, ...props }, ref) => (
    <div ref={ref} className={cn('overflow-hidden p-1 text-foreground', className)} {...props}>
      {label && <div className="px-2 py-1.5 text-xs font-medium text-default-400">{label}</div>}
      {children}
    </div>
  ),
);
CommandGroup.displayName = 'CommandGroup';

const CommandItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    isSelected?: boolean;
    onSelect?: () => void;
  }
>(({ className, isSelected, onSelect, children, ...props }, ref) => (
  <div
    ref={ref}
    role="option"
    aria-selected={isSelected}
    onClick={onSelect}
    className={cn(
      'relative flex cursor-pointer items-center gap-2 rounded-small px-2 py-1.5 text-sm outline-none select-none transition-colors',
      'hover:bg-default-100',
      isSelected && 'bg-primary/10 text-primary',
      className,
    )}
    {...props}
  >
    {children}
  </div>
));
CommandItem.displayName = 'CommandItem';

export { Command, CommandDialog, CommandGroup, CommandInput, CommandItem, CommandList };
