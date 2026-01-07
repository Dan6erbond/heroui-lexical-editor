'use client';

import {
  $isElementNode,
  $isRangeSelection,
  BaseSelection,
  ElementFormatType,
  FORMAT_ELEMENT_COMMAND,
  INDENT_CONTENT_COMMAND,
  OUTDENT_CONTENT_COMMAND,
} from 'lexical';
import {
  AlignCenterIcon,
  AlignJustifyIcon,
  AlignLeftIcon,
  AlignRightIcon,
  IndentDecreaseIcon,
  IndentIncreaseIcon,
} from 'lucide-react';

import { $findMatchingParent } from '@lexical/utils';
import { $isLinkNode } from '@lexical/link';
import { Divider } from '@heroui/react';
import { Toggle } from '@/components/ui/toggle';
import { getSelectedNode } from '../../utils/get-selected-node';
import { useState } from 'react';
import { useToolbarContext } from '../../context/toolbar';
import { useUpdateToolbarHandler } from '../../hooks/use-update-toolbar';

const ELEMENT_FORMAT_OPTIONS = {
  left: {
    icon: <AlignLeftIcon className="size-4" />,
    name: 'Left Align',
  },
  center: {
    icon: <AlignCenterIcon className="size-4" />,
    name: 'Center Align',
  },
  right: {
    icon: <AlignRightIcon className="size-4" />,
    name: 'Right Align',
  },
  justify: {
    icon: <AlignJustifyIcon className="size-4" />,
    name: 'Justify Align',
  },
} as const;

export function ElementFormatToolbarPlugin({ separator = true }: { separator?: boolean }) {
  const { activeEditor } = useToolbarContext();
  const [elementFormat, setElementFormat] = useState<ElementFormatType>('left');

  const $updateToolbar = (selection: BaseSelection) => {
    if ($isRangeSelection(selection)) {
      const node = getSelectedNode(selection);
      const parent = node.getParent();

      let matchingParent;
      if ($isLinkNode(parent)) {
        matchingParent = $findMatchingParent(
          node,
          (parentNode) => $isElementNode(parentNode) && !parentNode.isInline(),
        );
      }

      const format = $isElementNode(matchingParent)
        ? matchingParent.getFormatType()
        : $isElementNode(node)
          ? node.getFormatType()
          : parent?.getFormatType() || 'left';

      setElementFormat(format as ElementFormatType);
    }
  };

  useUpdateToolbarHandler($updateToolbar);

  const formatElement = (type: ElementFormatType) => {
    activeEditor.dispatchCommand(FORMAT_ELEMENT_COMMAND, type);
  };

  return (
    <div className="flex items-center gap-1">
      {/* Alignment Group */}
      <div className="flex items-center gap-1">
        {(Object.entries(ELEMENT_FORMAT_OPTIONS) as [ElementFormatType, any][]).map(([value, option]) => (
          <Toggle
            key={value}
            value={value}
            isSelected={elementFormat === value}
            onToggle={() => formatElement(value)}
            ariaLabel={option.name}
          >
            {option.icon}
          </Toggle>
        ))}
      </div>

      {separator && <Divider orientation="vertical" className="h-7 mx-1" />}

      {/* Indentation Group */}
      <div className="flex items-center gap-1">
        <Toggle
          value="outdent"
          isSelected={false} // Commands are transient, not stateful
          onToggle={() => activeEditor.dispatchCommand(OUTDENT_CONTENT_COMMAND, undefined)}
          ariaLabel="Outdent"
        >
          <IndentDecreaseIcon className="size-4" />
        </Toggle>

        <Toggle
          value="indent"
          isSelected={false}
          onToggle={() => activeEditor.dispatchCommand(INDENT_CONTENT_COMMAND, undefined)}
          ariaLabel="Indent"
        >
          <IndentIncreaseIcon className="size-4" />
        </Toggle>
      </div>
    </div>
  );
}
