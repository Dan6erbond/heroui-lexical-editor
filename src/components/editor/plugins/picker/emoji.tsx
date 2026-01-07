'use client';

import { $createTextNode, $getSelection, $isRangeSelection, TextNode } from 'lexical';
import { Card, Listbox, ListboxItem, ScrollShadow } from '@heroui/react';
import {
  LexicalTypeaheadMenuPlugin,
  MenuOption,
  useBasicTypeaheadTriggerMatch,
} from '@lexical/react/LexicalTypeaheadMenuPlugin';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { createPortal } from 'react-dom';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

class EmojiOption extends MenuOption {
  title: string;
  emoji: string;
  keywords: Array<string>;

  constructor(title: string, emoji: string, options: { keywords?: Array<string> }) {
    super(title);
    this.title = title;
    this.emoji = emoji;
    this.keywords = options.keywords || [];
  }
}

type Emoji = {
  emoji: string;
  description: string;
  category: string;
  aliases: Array<string>;
  tags: Array<string>;
};

const MAX_EMOJI_SUGGESTION_COUNT = 15;

export function EmojiPickerPlugin() {
  const [editor] = useLexicalComposerContext();
  const [queryString, setQueryString] = useState<string | null>(null);
  const [emojis, setEmojis] = useState<Array<Emoji>>([]);

  useEffect(() => {
    import('../../utils/emoji-list').then((file) => setEmojis(file.default));
  }, []);

  const emojiOptions = useMemo(
    () =>
      emojis.map(
        ({ emoji, aliases, tags }) =>
          new EmojiOption(aliases[0], emoji, {
            keywords: [...aliases, ...tags],
          }),
      ),
    [emojis],
  );

  const checkForTriggerMatch = useBasicTypeaheadTriggerMatch(':', {
    minLength: 0,
  });

  const filteredOptions = useMemo(() => {
    if (queryString === null) return emojiOptions.slice(0, MAX_EMOJI_SUGGESTION_COUNT);

    const regex = new RegExp(queryString, 'gi');
    return emojiOptions
      .filter((option) => regex.test(option.title) || option.keywords.some((k) => regex.test(k)))
      .slice(0, MAX_EMOJI_SUGGESTION_COUNT);
  }, [emojiOptions, queryString]);

  const onSelectOption = useCallback(
    (selectedOption: EmojiOption, nodeToRemove: TextNode | null, closeMenu: () => void) => {
      editor.update(() => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) return;

        if (nodeToRemove) nodeToRemove.remove();
        selection.insertNodes([$createTextNode(selectedOption.emoji)]);
        closeMenu();
      });
    },
    [editor],
  );

  return (
    <LexicalTypeaheadMenuPlugin
      onQueryChange={setQueryString}
      onSelectOption={onSelectOption}
      triggerFn={checkForTriggerMatch}
      options={filteredOptions}
      menuRenderFn={(anchorElementRef, { selectedIndex, selectOptionAndCleanUp, setHighlightedIndex }) => {
        if (!anchorElementRef.current || filteredOptions.length === 0) return null;

        return createPortal(
          <Card className="fixed z-[100] w-[240px] shadow-xl border-1 border-default-200 bg-background/90 backdrop-blur-lg">
            <ScrollShadow className="max-h-[300px]">
              <Listbox
                aria-label="Emoji suggestions"
                variant="flat"
                // Sync HeroUI selection with Lexical's internal index
                selectedKeys={selectedIndex !== null ? [filteredOptions[selectedIndex].key] : []}
                onAction={(key) => {
                  const option = filteredOptions.find((o) => o.key === key);
                  if (option) selectOptionAndCleanUp(option);
                }}
              >
                {filteredOptions.map((option, index) => (
                  <ListboxItem
                    key={option.key}
                    textValue={option.title}
                    // Update Lexical's index on hover for mouse support
                    onMouseEnter={() => setHighlightedIndex(index)}
                    startContent={<span className="text-xl">{option.emoji}</span>}
                  >
                    <span className="text-tiny text-default-600">:{option.title}:</span>
                  </ListboxItem>
                ))}
              </Listbox>
            </ScrollShadow>
          </Card>,
          anchorElementRef.current,
        );
      }}
    />
  );
}
