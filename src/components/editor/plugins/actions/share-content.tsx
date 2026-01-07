'use client';

import { Button, Tooltip, addToast } from '@heroui/react';
import { docFromHash, docToHash } from '../../utils/doc-serialization';
import { editorStateFromSerializedDocument, serializedDocumentFromEditorState } from '@lexical/file';
import { useEffect, useState } from 'react';

import { CLEAR_HISTORY_COMMAND } from 'lexical';
import { SendIcon } from 'lucide-react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

export function ShareContentPlugin() {
  const [editor] = useLexicalComposerContext();
  const [isSharing, setIsSharing] = useState(false);

  // Sync editor with URL Hash on initial load
  useEffect(() => {
    docFromHash(window.location.hash).then((doc) => {
      if (doc && doc.source === 'editor') {
        editor.setEditorState(editorStateFromSerializedDocument(editor, doc));
        editor.dispatchCommand(CLEAR_HISTORY_COMMAND, undefined);
      }
    });
  }, [editor]);

  async function handleShare() {
    setIsSharing(true);

    const sharePromise = (async () => {
      const doc = serializedDocumentFromEditorState(editor.getEditorState(), {
        source: 'editor',
      });

      const url = new URL(window.location.toString());
      url.hash = await docToHash(doc);
      const newUrl = url.toString();

      window.history.replaceState({}, '', newUrl);
      await window.navigator.clipboard.writeText(newUrl);
      return newUrl;
    })();

    addToast({
      title: 'Sharing Content',
      description: 'Generating link and copying to clipboard...',
      promise: sharePromise,
      // Customizing the success/error behavior within the promise toast
      severity: 'primary',
    });

    try {
      await sharePromise;
    } catch (error) {
      console.error('Sharing failed', error);
    } finally {
      setIsSharing(false);
    }
  }

  return (
    <Tooltip content="Share Content" showArrow placement="top" delay={0} closeDelay={0}>
      <Button
        isIconOnly
        variant="light"
        size="sm"
        onPress={handleShare}
        isLoading={isSharing}
        aria-label="Share editor state link"
        className="text-default-500 hover:text-primary min-w-8 h-8"
      >
        {!isSharing && <SendIcon className="size-4" />}
      </Button>
    </Tooltip>
  );
}
