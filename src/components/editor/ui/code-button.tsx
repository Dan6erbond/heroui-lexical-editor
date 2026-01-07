/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { $getNearestNodeFromDOMNode, $getSelection, $setSelection, LexicalEditor } from 'lexical';
import { CircleCheckIcon, CopyIcon } from 'lucide-react';

import { $isCodeNode } from '@lexical/code';
import { useDebounce } from '../hooks/use-debounce';
import { useState } from 'react';

interface Props {
  editor: LexicalEditor;
  getCodeDOMNode: () => HTMLElement | null;
}

export function CopyButton({ editor, getCodeDOMNode }: Props) {
  const [isCopyCompleted, setCopyCompleted] = useState<boolean>(false);

  const removeSuccessIcon = useDebounce(() => {
    setCopyCompleted(false);
  }, 1000);

  async function handleClick(): Promise<void> {
    const codeDOMNode = getCodeDOMNode();

    if (!codeDOMNode) {
      return;
    }

    let content = '';

    editor.update(() => {
      const codeNode = $getNearestNodeFromDOMNode(codeDOMNode);

      if ($isCodeNode(codeNode)) {
        content = codeNode.getTextContent();
      }

      const selection = $getSelection();
      $setSelection(selection);
    });

    try {
      await navigator.clipboard.writeText(content);
      setCopyCompleted(true);
      removeSuccessIcon();
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  }

  return (
    <button
      className="text-foreground/50 flex shrink-0 cursor-pointer items-center rounded border border-transparent bg-none p-1 uppercase"
      onClick={handleClick}
      aria-label="copy"
    >
      {isCopyCompleted ? <CircleCheckIcon className="size-4" /> : <CopyIcon className="size-4" />}
    </button>
  );
}
