'use client';

import { $isRangeSelection, BaseSelection, FORMAT_TEXT_COMMAND, TextFormatType } from 'lexical';
import { BoldIcon, ItalicIcon, StrikethroughIcon, UnderlineIcon } from 'lucide-react';
import { useCallback, useState } from 'react';

import { $isTableSelection } from '@lexical/table';
import { Toggle } from '@/components/ui/toggle';
import { useToolbarContext } from '../../context/toolbar';
import { useUpdateToolbarHandler } from '../../hooks/use-update-toolbar';

const FORMATS = [
  { format: 'bold', icon: BoldIcon, label: 'Bold' },
  { format: 'italic', icon: ItalicIcon, label: 'Italic' },
  { format: 'underline', icon: UnderlineIcon, label: 'Underline' },
  { format: 'strikethrough', icon: StrikethroughIcon, label: 'Strikethrough' },
] as const;

export function FontFormatToolbarPlugin() {
  const { activeEditor } = useToolbarContext();
  const [activeFormats, setActiveFormats] = useState<Set<string>>(new Set());

  const $updateToolbar = useCallback((selection: BaseSelection) => {
    if ($isRangeSelection(selection) || $isTableSelection(selection)) {
      const newFormats = new Set<string>();
      FORMATS.forEach(({ format }) => {
        if (selection.hasFormat(format as TextFormatType)) {
          newFormats.add(format);
        }
      });

      setActiveFormats((prev) => {
        if (prev.size !== newFormats.size || ![...newFormats].every((f) => prev.has(f))) {
          return newFormats;
        }
        return prev;
      });
    }
  }, []);

  useUpdateToolbarHandler($updateToolbar);

  return (
    <div className="flex items-center gap-1">
      {FORMATS.map(({ format, icon: Icon, label }) => (
        <Toggle
          key={format}
          value={format}
          isSelected={activeFormats.has(format)}
          onToggle={() => {
            activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, format as TextFormatType);
          }}
          ariaLabel={label}
        >
          <Icon className="size-4" />
        </Toggle>
      ))}
    </div>
  );
}
