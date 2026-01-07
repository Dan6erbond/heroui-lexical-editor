'use client';

import { $getSelection, $isRangeSelection, BaseSelection } from 'lexical';
import { $getSelectionStyleValueForProperty, $patchStyleText } from '@lexical/selection';
import {
  ColorPickerRoot as ColorPicker,
  ColorPickerAlphaSlider,
  ColorPickerArea,
  ColorPickerContent,
  ColorPickerEyeDropper,
  ColorPickerFormatSelect,
  ColorPickerHueSlider,
  ColorPickerInput,
  ColorPickerTrigger,
} from '@/components/ui/color-picker';
import { useCallback, useState } from 'react';

import { BaselineIcon } from 'lucide-react';
import { Tooltip } from '@heroui/react';
import { useToolbarContext } from '../../context/toolbar';
import { useUpdateToolbarHandler } from '../../hooks/use-update-toolbar';

export function FontColorToolbarPlugin() {
  const { activeEditor } = useToolbarContext();
  const [fontColor, setFontColor] = useState('#000000');

  const $updateToolbar = (selection: BaseSelection) => {
    if ($isRangeSelection(selection)) {
      setFontColor($getSelectionStyleValueForProperty(selection, 'color', '#000000'));
    }
  };

  useUpdateToolbarHandler($updateToolbar);

  const applyStyleText = useCallback(
    (styles: Record<string, string>) => {
      activeEditor.update(
        () => {
          const selection = $getSelection();
          if (selection !== null) {
            $patchStyleText(selection, styles);
          }
        },
        { tag: 'historic' },
      );
    },
    [activeEditor],
  );

  const onFontColorSelect = useCallback(
    (value: string) => {
      applyStyleText({ color: value });
    },
    [applyStyleText],
  );

  return (
    <ColorPicker
      defaultFormat="hex"
      value={fontColor}
      onValueChange={onFontColorSelect}
      onOpenChange={(open) => {
        if (open) {
          activeEditor.setEditable(false);
        } else {
          activeEditor.setEditable(true);
          setTimeout(() => activeEditor.focus(), 0);
        }
      }}
    >
      <Tooltip content="Text Color" placement="top" showArrow delay={500}>
        <ColorPickerTrigger isIconOnly variant="light" size="sm" className="min-w-8 h-8" aria-label="Text Color">
          <div className="relative">
            <BaselineIcon className="size-4 text-default-600" />
            <div
              className="absolute -bottom-1 left-0 w-full h-1 rounded-full border border-default-200"
              style={{ backgroundColor: fontColor }}
            />
          </div>
        </ColorPickerTrigger>
      </Tooltip>

      <ColorPickerContent className="z-100">
        <ColorPickerArea />
        <div className="flex items-center gap-2 w-full">
          <ColorPickerEyeDropper />
          <div className="flex flex-1 flex-col gap-2">
            <ColorPickerHueSlider />
            <ColorPickerAlphaSlider />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ColorPickerFormatSelect />
          <ColorPickerInput />
        </div>
      </ColorPickerContent>
    </ColorPicker>
  );
}
