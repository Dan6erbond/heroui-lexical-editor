'use client';

import { $getSelection, $isRangeSelection, BaseSelection } from 'lexical';
import { $getSelectionStyleValueForProperty, $patchStyleText } from '@lexical/selection';
import { Button, ButtonGroup, NumberInput, cn } from '@heroui/react';
import { Minus, Plus } from 'lucide-react';
import { useCallback, useState } from 'react';

import { useToolbarContext } from '../../context/toolbar';
import { useUpdateToolbarHandler } from '../../hooks/use-update-toolbar';

const DEFAULT_FONT_SIZE = 16;
const MIN_FONT_SIZE = 1;
const MAX_FONT_SIZE = 72;

export function FontSizeToolbarPlugin() {
  const style = 'font-size';
  const [fontSize, setFontSize] = useState(DEFAULT_FONT_SIZE);

  const { activeEditor } = useToolbarContext();

  const $updateToolbar = (selection: BaseSelection) => {
    if ($isRangeSelection(selection)) {
      const value = $getSelectionStyleValueForProperty(selection, 'font-size', `${DEFAULT_FONT_SIZE}px`);
      setFontSize(parseInt(value) || DEFAULT_FONT_SIZE);
    }
  };

  useUpdateToolbarHandler($updateToolbar);

  const updateFontSize = useCallback(
    (newSize: number) => {
      const size = Math.min(Math.max(newSize, MIN_FONT_SIZE), MAX_FONT_SIZE);
      activeEditor.update(() => {
        const selection = $getSelection();
        if (selection !== null) {
          $patchStyleText(selection, {
            [style]: `${size}px`,
          });
        }
      });
      setFontSize(size);
    },
    [activeEditor, style],
  );

  return (
    <ButtonGroup variant="flat" size="sm" className="h-8 items-center">
      <Button
        isIconOnly
        className="min-w-8 w-8 rounded-r-none"
        onPress={() => updateFontSize(fontSize - 1)}
        isDisabled={fontSize <= MIN_FONT_SIZE}
        aria-label="Decrease font size"
      >
        <Minus className="size-3" />
      </Button>

      <NumberInput
        aria-label="Font size"
        value={fontSize}
        onValueChange={(val) => !isNaN(val) && updateFontSize(val)}
        minValue={MIN_FONT_SIZE}
        maxValue={MAX_FONT_SIZE}
        size="sm"
        hideStepper
        isWheelDisabled
        classNames={{
          base: 'w-12',
          mainWrapper: 'h-8',
          inputWrapper: cn(
            'h-8',
            'rounded-none',
            'bg-default-100',
            'data-[hover=true]:bg-default-200',
            'group-data-[focus=true]:bg-default-100',
            'shadow-none',
            'border-x-1',
            'border-default-200',
          ),
          input: 'text-center text-tiny font-medium',
        }}
      />

      <Button
        isIconOnly
        className="min-w-8 w-8 rounded-l-none"
        onPress={() => updateFontSize(fontSize + 1)}
        isDisabled={fontSize >= MAX_FONT_SIZE}
        aria-label="Increase font size"
      >
        <Plus className="size-3" />
      </Button>
    </ButtonGroup>
  );
}
