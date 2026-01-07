'use client';

import { $getNodeByKey, $isRangeSelection, $isRootOrShadowRoot, BaseSelection } from 'lexical';
import { $isCodeNode, CODE_LANGUAGE_FRIENDLY_NAME_MAP, getLanguageFriendlyName } from '@lexical/code';
import React, { useCallback, useState } from 'react';
import { Select, SelectItem, SharedSelection } from '@heroui/react';

import { $findMatchingParent } from '@lexical/utils';
import { $isListNode } from '@lexical/list';
import { useToolbarContext } from '../../context/toolbar';
import { useUpdateToolbarHandler } from '../../hooks/use-update-toolbar';

/** * Generates the options list once outside the component
 */
const CODE_LANGUAGE_OPTIONS = Object.entries(CODE_LANGUAGE_FRIENDLY_NAME_MAP);

export function CodeLanguageToolbarPlugin() {
  const { activeEditor, blockType } = useToolbarContext();
  const [codeLanguage, setCodeLanguage] = useState<string>('');
  const [selectedElementKey, setSelectedElementKey] = useState<string | null>(null);

  /**
   * Syncs the select state with the editor's current CodeNode
   */
  const $updateToolbar = useCallback(
    (selection: BaseSelection) => {
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

        const elementKey = element.getKey();
        if (activeEditor.getElementByKey(elementKey) !== null) {
          setSelectedElementKey(elementKey);

          if (!$isListNode(element) && $isCodeNode(element)) {
            setCodeLanguage(element.getLanguage() || '');
          }
        }
      }
    },
    [activeEditor],
  );

  useUpdateToolbarHandler($updateToolbar);

  /**
   * Updates the CodeNode language attribute
   */
  const onCodeLanguageSelect = (keys: SharedSelection) => {
    const value = Array.from(keys)[0] as string;
    if (!value) return;

    activeEditor.update(() => {
      if (selectedElementKey !== null) {
        const node = $getNodeByKey(selectedElementKey);
        if ($isCodeNode(node)) {
          node.setLanguage(value);
        }
      }
    });
    setCodeLanguage(value);
  };

  // Only render the language selector if the current block is a code block
  if (blockType !== 'code') {
    return null;
  }

  return (
    <Select
      aria-label="Select code language"
      size="sm"
      variant="bordered"
      className="w-40"
      selectedKeys={new Set([codeLanguage])}
      onSelectionChange={onCodeLanguageSelect}
      disallowEmptySelection
      // Ensure the dropdown has a scrollable area for the long list of languages
      scrollShadowProps={{
        isEnabled: true,
      }}
      popoverProps={{
        className: 'min-w-[200px]',
      }}
      renderValue={() => (
        <span className="text-small text-default-700">
          {getLanguageFriendlyName(codeLanguage) || 'Select Language'}
        </span>
      )}
    >
      {CODE_LANGUAGE_OPTIONS.map(([value, label]) => (
        <SelectItem key={value} textValue={label}>
          {label}
        </SelectItem>
      ))}
    </Select>
  );
}
