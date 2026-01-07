'use client';

import { COMMAND_PRIORITY_CRITICAL, SELECTION_CHANGE_COMMAND } from 'lexical';
import { useEffect, useState } from 'react';

import { ToolbarContext } from '../../context/toolbar';
import { useEditorModal } from '../../hooks/use-modal';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

export function ToolbarPlugin({ children }: { children: (props: { blockType: string }) => React.ReactNode }) {
  const [editor] = useLexicalComposerContext();

  const [activeEditor, setActiveEditor] = useState(editor);
  const [blockType, setBlockType] = useState<string>('paragraph');

  const [modal, showModal] = useEditorModal();

  const $updateToolbar = () => {};

  useEffect(() => {
    return activeEditor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      (_payload, newEditor) => {
        setActiveEditor(newEditor);
        return false;
      },
      COMMAND_PRIORITY_CRITICAL,
    );
  }, [editor]);

  return (
    <ToolbarContext
      activeEditor={activeEditor}
      $updateToolbar={$updateToolbar}
      blockType={blockType}
      setBlockType={setBlockType}
      showModal={showModal}
    >
      {modal}

      {children({ blockType })}
    </ToolbarContext>
  );
}
