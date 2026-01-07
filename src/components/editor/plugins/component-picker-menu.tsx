'use client';

import { Command, CommandGroup, CommandItem, CommandList } from '@/components/ui/command';
import { JSX, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { LexicalTypeaheadMenuPlugin, useBasicTypeaheadTriggerMatch } from '@lexical/react/LexicalTypeaheadMenuPlugin';

import { ComponentPickerOption } from './picker/component-picker-option';
import { TextNode } from 'lexical';
import { createPortal } from 'react-dom';
import { useEditorModal } from '../hooks/use-modal';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

function ComponentPickerMenu({
  options,
  selectedIndex,
  selectOptionAndCleanUp,
  setHighlightedIndex,
}: {
  options: Array<ComponentPickerOption>;
  selectedIndex: number | null;
  selectOptionAndCleanUp: (option: ComponentPickerOption) => void;
  setHighlightedIndex: (index: number) => void;
}) {
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (selectedIndex !== null && itemRefs.current[selectedIndex]) {
      itemRefs.current[selectedIndex]?.scrollIntoView({
        block: 'nearest',
        behavior: 'auto',
      });
    }
  }, [selectedIndex]);

  return (
    <div className="absolute z-50 h-min w-62.5">
      <Command
        onKeyDown={(e) => {
          if (e.key === 'ArrowUp') {
            e.preventDefault();
            setHighlightedIndex(
              selectedIndex !== null ? (selectedIndex - 1 + options.length) % options.length : options.length - 1,
            );
          } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            setHighlightedIndex(selectedIndex !== null ? (selectedIndex + 1) % options.length : 0);
          }
        }}
      >
        <CommandList>
          <CommandGroup>
            {options.map((option, index) => (
              <CommandItem
                key={option.key}
                ref={(el: any) => {
                  itemRefs.current[index] = el;
                }}
                isSelected={selectedIndex === index}
                onSelect={() => {
                  selectOptionAndCleanUp(option);
                }}
                className="flex items-center gap-2"
              >
                <div className="text-default-500 size-4 flex items-center justify-center">{option.icon}</div>
                <span className="text-default-700">{option.title}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  );
}

export function ComponentPickerMenuPlugin({
  baseOptions = [],
  dynamicOptionsFn,
}: {
  baseOptions?: Array<ComponentPickerOption>;
  dynamicOptionsFn?: ({ queryString }: { queryString: string }) => Array<ComponentPickerOption>;
}): JSX.Element {
  const [editor] = useLexicalComposerContext();
  const [modal, showModal] = useEditorModal();
  const [queryString, setQueryString] = useState<string | null>(null);

  const checkForTriggerMatch = useBasicTypeaheadTriggerMatch('/', {
    minLength: 0,
  });

  const options = useMemo(() => {
    if (!queryString) {
      return baseOptions;
    }

    const regex = new RegExp(queryString, 'i');

    return [
      ...(dynamicOptionsFn?.({ queryString }) || []),
      ...baseOptions.filter(
        (option) => regex.test(option.title) || option.keywords.some((keyword) => regex.test(keyword)),
      ),
    ];
  }, [queryString, baseOptions, dynamicOptionsFn]);

  const onSelectOption = useCallback(
    (
      selectedOption: ComponentPickerOption,
      nodeToRemove: TextNode | null,
      closeMenu: () => void,
      matchingString: string,
    ) => {
      editor.update(() => {
        nodeToRemove?.remove();
        selectedOption.onSelect(matchingString, editor, showModal);
        closeMenu();
      });
    },
    [editor, showModal],
  );

  return (
    <>
      {modal}
      <LexicalTypeaheadMenuPlugin
        onQueryChange={setQueryString}
        onSelectOption={onSelectOption}
        triggerFn={checkForTriggerMatch}
        options={options}
        menuRenderFn={(anchorElementRef, { selectedIndex, selectOptionAndCleanUp, setHighlightedIndex }) => {
          return anchorElementRef.current && options.length
            ? createPortal(
                <ComponentPickerMenu
                  options={options}
                  selectedIndex={selectedIndex}
                  selectOptionAndCleanUp={selectOptionAndCleanUp}
                  setHighlightedIndex={setHighlightedIndex}
                />,
                anchorElementRef.current,
              )
            : null;
        }}
      />
    </>
  );
}
