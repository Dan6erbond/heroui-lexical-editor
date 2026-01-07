'use client';

import { $isRangeSelection, BaseSelection, FORMAT_TEXT_COMMAND } from 'lexical';
import { SubscriptIcon, SuperscriptIcon } from 'lucide-react';

import { $isTableSelection } from '@lexical/table';
import { Toggle } from '@/components/ui/toggle';
import { useState } from 'react';
import { useToolbarContext } from '../../context/toolbar';
import { useUpdateToolbarHandler } from '../../hooks/use-update-toolbar';

export function SubSuperToolbarPlugin() {
  const { activeEditor } = useToolbarContext();
  const [isSubscript, setIsSubscript] = useState(false);
  const [isSuperscript, setIsSuperscript] = useState(false);

  const $updateToolbar = (selection: BaseSelection) => {
    if ($isRangeSelection(selection) || $isTableSelection(selection)) {
      // @ts-ignore - formatting is a string literal union in Lexical
      setIsSubscript(selection.hasFormat('subscript'));
      // @ts-ignore
      setIsSuperscript(selection.hasFormat('superscript'));
    }
  };

  useUpdateToolbarHandler($updateToolbar);

  return (
    <div className="flex items-center gap-1">
      <Toggle
        value="subscript"
        isSelected={isSubscript}
        onToggle={() => {
          activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'subscript');
        }}
        ariaLabel="Toggle Subscript"
      >
        <SubscriptIcon className="size-4" />
      </Toggle>

      <Toggle
        value="superscript"
        isSelected={isSuperscript}
        onToggle={() => {
          activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'superscript');
        }}
        ariaLabel="Toggle Superscript"
      >
        <SuperscriptIcon className="size-4" />
      </Toggle>
    </div>
  );
}
