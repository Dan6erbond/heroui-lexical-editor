'use client';

import { $isLinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link';
import { $isRangeSelection, BaseSelection, COMMAND_PRIORITY_NORMAL, KEY_MODIFIER_COMMAND } from 'lexical';
import { Button, Tooltip } from '@heroui/react';
import { useCallback, useEffect, useState } from 'react';

import { LinkIcon } from 'lucide-react';
import { getSelectedNode } from '../../utils/get-selected-node';
import { sanitizeUrl } from '../../utils/url';
import { useToolbarContext } from '../../context/toolbar';
import { useUpdateToolbarHandler } from '../../hooks/use-update-toolbar';

export function LinkToolbarPlugin({ setIsLinkEditMode }: { setIsLinkEditMode: (isEditMode: boolean) => void }) {
  const { activeEditor } = useToolbarContext();
  const [isLink, setIsLink] = useState(false);

  const $updateToolbar = useCallback((selection: BaseSelection) => {
    if ($isRangeSelection(selection)) {
      const node = getSelectedNode(selection);
      const parent = node.getParent();
      if ($isLinkNode(parent) || $isLinkNode(node)) {
        setIsLink(true);
      } else {
        setIsLink(false);
      }
    }
  }, []);

  useUpdateToolbarHandler($updateToolbar);

  const insertLink = useCallback(() => {
    if (!isLink) {
      setIsLinkEditMode(true);
      activeEditor.dispatchCommand(TOGGLE_LINK_COMMAND, sanitizeUrl('https://'));
    } else {
      setIsLinkEditMode(false);
      activeEditor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    }
  }, [activeEditor, isLink, setIsLinkEditMode]);

  useEffect(() => {
    return activeEditor.registerCommand(
      KEY_MODIFIER_COMMAND,
      (payload) => {
        const event: KeyboardEvent = payload;
        const { code, ctrlKey, metaKey } = event;

        if (code === 'KeyK' && (ctrlKey || metaKey)) {
          event.preventDefault();
          insertLink();
          return true;
        }
        return false;
      },
      COMMAND_PRIORITY_NORMAL,
    );
  }, [activeEditor, insertLink]);

  return (
    <Tooltip content={isLink ? 'Remove Link' : 'Insert Link'} delay={500}>
      <Button
        isIconOnly
        size="sm"
        aria-label="Toggle link"
        onPress={insertLink}
        // If toggled: use a subtle primary background (flat) or just primary border
        variant={isLink ? 'flat' : 'bordered'}
        color={isLink ? 'primary' : 'default'}
        className={!isLink ? 'border-default-200' : ''}
      >
        <LinkIcon className={`size-4 ${isLink ? 'text-primary' : 'text-default-600'}`} />
      </Button>
    </Tooltip>
  );
}
