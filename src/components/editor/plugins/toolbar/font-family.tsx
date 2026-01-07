'use client';

import { $getSelection, $isRangeSelection, BaseSelection } from 'lexical';
import { $getSelectionStyleValueForProperty, $patchStyleText } from '@lexical/selection';
import { Select, SelectItem } from '@heroui/react';
import { useCallback, useState } from 'react';

import { TypeIcon } from 'lucide-react';
import { useToolbarContext } from '../../context/toolbar';
import { useUpdateToolbarHandler } from '../../hooks/use-update-toolbar';

const FONT_FAMILY_OPTIONS = ['Arial', 'Verdana', 'Times New Roman', 'Georgia', 'Courier New', 'Trebuchet MS'];

export function FontFamilyToolbarPlugin() {
  const style = 'font-family';
  const [fontFamily, setFontFamily] = useState('Arial');

  const { activeEditor } = useToolbarContext();

  const $updateToolbar = (selection: BaseSelection) => {
    if ($isRangeSelection(selection)) {
      setFontFamily($getSelectionStyleValueForProperty(selection, 'font-family', 'Arial'));
    }
  };

  useUpdateToolbarHandler($updateToolbar);

  const onFontSelect = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value;
      if (!value) return;

      setFontFamily(value);
      activeEditor.update(() => {
        const selection = $getSelection();
        if (selection !== null) {
          $patchStyleText(selection, {
            [style]: value,
          });
        }
      });
    },
    [activeEditor, style],
  );

  return (
    <Select
      aria-label="Font family"
      items={FONT_FAMILY_OPTIONS.map((f) => ({ label: f, value: f }))}
      selectedKeys={[fontFamily]}
      onChange={onFontSelect}
      size="sm"
      variant="flat"
      disallowEmptySelection
      startContent={<TypeIcon className="size-4 text-default-500" />}
      className="min-w-36"
      classNames={{
        trigger: 'h-8 min-h-8 bg-default-100 hover:bg-default-200 shadow-none',
        value: 'text-tiny font-medium',
      }}
      renderValue={(items) => {
        return items.map((item) => (
          <span key={item.key} style={{ fontFamily: item.data?.value }}>
            {item.data?.label}
          </span>
        ));
      }}
    >
      {(font) => (
        <SelectItem key={font.value} textValue={font.label} style={{ fontFamily: font.value }}>
          {font.label}
        </SelectItem>
      )}
    </Select>
  );
}
