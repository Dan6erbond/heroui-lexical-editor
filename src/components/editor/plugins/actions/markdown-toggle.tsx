'use client';

import { $convertFromMarkdownString, $convertToMarkdownString, Transformer } from '@lexical/markdown';
import { $createCodeNode, $isCodeNode } from '@lexical/code';
import { $createTextNode, $getRoot } from 'lexical';

import { Button } from '@heroui/react';
import { FileTextIcon } from 'lucide-react';
import { useCallback } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

export function MarkdownTogglePlugin({
  shouldPreserveNewLinesInMarkdown,
  transformers,
}: {
  shouldPreserveNewLinesInMarkdown: boolean;
  transformers: Array<Transformer>;
}) {
  const [editor] = useLexicalComposerContext();

  const handleMarkdownToggle = useCallback(() => {
    editor.update(() => {
      const root = $getRoot();
      const firstChild = root.getFirstChild();
      if ($isCodeNode(firstChild) && firstChild.getLanguage() === 'markdown') {
        $convertFromMarkdownString(
          firstChild.getTextContent(),
          transformers,
          undefined, // node
          shouldPreserveNewLinesInMarkdown,
        );
      } else {
        const markdown = $convertToMarkdownString(
          transformers,
          undefined, // node
          shouldPreserveNewLinesInMarkdown,
        );
        const codeNode = $createCodeNode('markdown');
        codeNode.append($createTextNode(markdown));
        root.clear().append(codeNode);
        if (markdown.length === 0) {
          codeNode.select();
        }
      }
    });
    // Keeping the original lint-suppression/dependency logic
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor, shouldPreserveNewLinesInMarkdown]);

  return (
    <Button
      isIconOnly
      variant="light"
      size="sm"
      onPress={handleMarkdownToggle}
      title="Convert From Markdown"
      aria-label="Convert from markdown"
      className="text-default-600"
    >
      <FileTextIcon className="size-4" />
    </Button>
  );
}
