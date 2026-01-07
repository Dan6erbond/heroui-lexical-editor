'use client';

import { Button, Tooltip } from '@heroui/react';
import { DownloadIcon, UploadIcon } from 'lucide-react';
import { exportFile, importFile } from '@lexical/file';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

export function ImportExportPlugin() {
  const [editor] = useLexicalComposerContext();

  return (
    <div className="flex items-center gap-1">
      <Tooltip content="Import Content" delay={500} closeDelay={0}>
        <Button
          isIconOnly
          variant="light"
          size="sm"
          onPress={() => importFile(editor)}
          aria-label="Import editor state from JSON"
          title="Import"
        >
          <UploadIcon className="size-4 text-default-600" />
        </Button>
      </Tooltip>

      <Tooltip content="Export Content" delay={500} closeDelay={0}>
        <Button
          isIconOnly
          variant="light"
          size="sm"
          onPress={() =>
            exportFile(editor, {
              fileName: `Editor ${new Date().toISOString()}`,
              source: 'Lexical Editor',
            })
          }
          aria-label="Export editor state to JSON"
          title="Export"
        >
          <DownloadIcon className="size-4 text-default-600" />
        </Button>
      </Tooltip>
    </div>
  );
}
