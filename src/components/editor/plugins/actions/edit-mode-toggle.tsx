'use client';

import { Button, Tooltip } from '@heroui/react';
import { LockIcon, UnlockIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

export function EditModeTogglePlugin() {
  const [editor] = useLexicalComposerContext();
  const [isEditable, setIsEditable] = useState(() => editor.isEditable());

  // Keep local state in sync with Lexical's internal editable state
  useEffect(() => {
    return editor.registerEditableListener((editable) => {
      setIsEditable(editable);
    });
  }, [editor]);

  const toggleEditable = () => {
    editor.setEditable(!isEditable);
  };

  return (
    <Tooltip
      content={isEditable ? 'Switch to Read-Only' : 'Switch to Edit Mode'}
      showArrow
      placement="top"
      delay={0}
      closeDelay={0}
    >
      <Button
        isIconOnly
        size="sm"
        radius="sm"
        // Use 'flat' variant when locked to make it look "active"
        variant={isEditable ? 'light' : 'flat'}
        // Yellow/Warning color suggests a "restricted" or "safe" state
        color={isEditable ? 'default' : 'warning'}
        onPress={toggleEditable}
        aria-label={isEditable ? 'Lock editor' : 'Unlock editor'}
        className="min-w-8 h-8 transition-colors"
      >
        {isEditable ? <UnlockIcon className="size-4 text-default-500" /> : <LockIcon className="size-4" />}
      </Button>
    </Tooltip>
  );
}
