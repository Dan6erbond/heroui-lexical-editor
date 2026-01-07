"use client";

import { $getSelection, $isRangeSelection, BaseSelection } from "lexical";
import {
  $getSelectionStyleValueForProperty,
  $patchStyleText,
} from "@lexical/selection";
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
import { useCallback, useState } from "react";

import { PaintBucketIcon } from "lucide-react";
import { Tooltip } from "@heroui/react";
import { useToolbarContext } from "../../context/toolbar";
import { useUpdateToolbarHandler } from "../../hooks/use-update-toolbar";

export function FontBackgroundToolbarPlugin() {
  const { activeEditor } = useToolbarContext();
  const [bgColor, setBgColor] = useState("rgba(0, 0, 0, 0)");

  const $updateToolbar = (selection: BaseSelection) => {
    if ($isRangeSelection(selection)) {
      setBgColor(
        $getSelectionStyleValueForProperty(
          selection,
          "background-color",
          "rgba(0, 0, 0, 0)"
        )
      );
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
        { tag: "historic" }
      );
    },
    [activeEditor]
  );

  const onBgColorSelect = useCallback(
    (value: string) => {
      applyStyleText({ "background-color": value });
    },
    [applyStyleText]
  );

  const onOpenChange = useCallback(
    (open: boolean) => {
      if (!open) {
        activeEditor.setEditable(true);
        activeEditor.focus();
      }
    },
    [activeEditor]
  );

  return (
    <ColorPicker
      defaultFormat="hex"
      value={bgColor}
      onValueChange={onBgColorSelect}
      onOpenChange={onOpenChange}
    >
      <Tooltip content="Background Color" placement="top" showArrow delay={500}>
        <ColorPickerTrigger
          isIconOnly
          variant="light"
          size="sm"
          className="min-w-8 h-8"
          aria-label="Font Background Color"
        >
          <div className="relative">
            <PaintBucketIcon className="size-4 text-default-600" />
            <div
              className="absolute -bottom-1 left-0 w-full h-1 rounded-full border border-default-200"
              style={{ backgroundColor: bgColor }}
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
