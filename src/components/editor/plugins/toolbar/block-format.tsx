'use client';

import { $createHeadingNode, $createQuoteNode, $isHeadingNode, HeadingTagType } from '@lexical/rich-text';
import { $createParagraphNode, $getSelection, $isRangeSelection, $isRootOrShadowRoot, BaseSelection } from 'lexical';
import { $findMatchingParent, $getNearestNodeOfType } from '@lexical/utils';
import {
  $isListNode,
  INSERT_CHECK_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  ListNode,
} from '@lexical/list';
import {
  CodeIcon,
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  ListIcon,
  ListOrderedIcon,
  ListTodoIcon,
  QuoteIcon,
  TextIcon,
} from 'lucide-react';
import { Select, SelectItem, SharedSelection } from '@heroui/react';

import { $createCodeNode } from '@lexical/code';
import { $setBlocksType } from '@lexical/selection';
import React from 'react';
import { useToolbarContext } from '../../context/toolbar';
import { useUpdateToolbarHandler } from '../../hooks/use-update-toolbar';

export const blockTypeToBlockName: Record<string, { label: string; icon: React.ReactNode }> = {
  paragraph: {
    label: 'Paragraph',
    icon: <TextIcon className="size-4" />,
  },
  h1: {
    label: 'Heading 1',
    icon: <Heading1Icon className="size-4" />,
  },
  h2: {
    label: 'Heading 2',
    icon: <Heading2Icon className="size-4" />,
  },
  h3: {
    label: 'Heading 3',
    icon: <Heading3Icon className="size-4" />,
  },
  number: {
    label: 'Numbered List',
    icon: <ListOrderedIcon className="size-4" />,
  },
  bullet: {
    label: 'Bulleted List',
    icon: <ListIcon className="size-4" />,
  },
  check: {
    label: 'Check List',
    icon: <ListTodoIcon className="size-4" />,
  },
  code: {
    label: 'Code Block',
    icon: <CodeIcon className="size-4" />,
  },
  quote: {
    label: 'Quote',
    icon: <QuoteIcon className="size-4" />,
  },
};

export function BlockFormatDropDown() {
  const { activeEditor, blockType, setBlockType } = useToolbarContext();

  // Sync toolbar state with editor selection
  function $updateToolbar(selection: BaseSelection) {
    if ($isRangeSelection(selection)) {
      const anchorNode = selection.anchor.getNode();
      let element =
        anchorNode.getKey() === 'root'
          ? anchorNode
          : $findMatchingParent(anchorNode, (e: any) => {
              const parent = e.getParent();
              return parent !== null && $isRootOrShadowRoot(parent);
            });

      if (element === null) {
        element = anchorNode.getTopLevelElementOrThrow();
      }

      if ($isListNode(element)) {
        const parentList = $getNearestNodeOfType<ListNode>(anchorNode, ListNode);
        setBlockType(parentList ? parentList.getListType() : element.getListType());
      } else {
        const type = $isHeadingNode(element) ? element.getTag() : element.getType();
        if (type in blockTypeToBlockName) {
          setBlockType(type);
        }
      }
    }
  }

  useUpdateToolbarHandler($updateToolbar);

  const formatParagraph = () => {
    activeEditor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createParagraphNode());
      }
    });
  };

  const handleSelectionChange = (keys: SharedSelection) => {
    const selectedValue = Array.from(keys)[0] as string;
    if (!selectedValue) return;

    // Toggle Logic & Command Dispatch
    if (selectedValue === blockType && ['bullet', 'number', 'check'].includes(selectedValue)) {
      formatParagraph();
      return;
    }

    switch (selectedValue) {
      case 'paragraph':
        formatParagraph();
        break;
      case 'h1':
      case 'h2':
      case 'h3':
        activeEditor.update(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            $setBlocksType(selection, () => $createHeadingNode(selectedValue as HeadingTagType));
          }
        });
        break;
      case 'bullet':
        activeEditor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
        break;
      case 'number':
        activeEditor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
        break;
      case 'check':
        activeEditor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined);
        break;
      case 'quote':
        activeEditor.update(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            $setBlocksType(selection, () => $createQuoteNode());
          }
        });
        break;
      case 'code':
        activeEditor.update(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            if (selection.isCollapsed()) {
              $setBlocksType(selection, () => $createCodeNode());
            } else {
              const textContent = selection.getTextContent();
              const codeNode = $createCodeNode();
              selection.insertNodes([codeNode]);
              const newSelection = $getSelection();
              if ($isRangeSelection(newSelection)) newSelection.insertRawText(textContent);
            }
          }
        });
        break;
    }
  };

  return (
    <Select
      aria-label="Block format"
      selectedKeys={new Set([blockType])}
      onSelectionChange={handleSelectionChange}
      size="sm"
      variant="bordered"
      className="min-w-36 max-w-48"
      disallowEmptySelection
      renderValue={() => {
        const selected = blockTypeToBlockName[blockType];
        return (
          <div className="flex items-center gap-2">
            <div className="size-4 text-default-500">{selected.icon}</div>
            <span className="text-small text-default-700">{selected.label}</span>
          </div>
        );
      }}
    >
      {Object.entries(blockTypeToBlockName).map(([key, { label, icon }]) => (
        <SelectItem key={key} textValue={label} startContent={<div className="text-default-500 size-4">{icon}</div>}>
          <span className="text-default-700 font-normal">{label}</span>
        </SelectItem>
      ))}
    </Select>
  );
}
