'use client';

import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ScrollShadow,
  Tooltip,
  useDisclosure,
} from '@heroui/react';

import { JSX } from 'react';
import { NotebookPenIcon } from 'lucide-react';
import { TreeView } from '@lexical/react/LexicalTreeView';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

export function TreeViewPlugin(): JSX.Element {
  const [editor] = useLexicalComposerContext();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Tooltip content="Debug Tree View" placement="top" showArrow>
        <Button
          isIconOnly
          size="sm"
          variant="light"
          onPress={onOpen}
          className="min-w-8 h-8 text-default-500"
          aria-label="Open Tree View"
        >
          <NotebookPenIcon className="size-4" />
        </Button>
      </Tooltip>

      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="3xl"
        scrollBehavior="inside"
        backdrop="blur"
        classNames={{
          base: 'border-1 border-default-200',
          header: 'border-b-1 border-default-100',
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Editor State Tree View</ModalHeader>
              <ModalBody className="p-4 bg-zinc-950 dark:bg-black overflow-hidden">
                <ScrollShadow className="h-125 w-full">
                  <div className="text-zinc-100 font-mono text-xs leading-relaxed">
                    <TreeView
                      viewClassName="tree-view-output"
                      treeTypeButtonClassName="debug-treetype-button px-2 py-1 bg-zinc-800 rounded text-[10px] mb-2 hover:bg-zinc-700 transition-colors"
                      timeTravelPanelClassName="debug-timetravel-panel border-t border-zinc-800 mt-4 pt-4"
                      timeTravelButtonClassName="debug-timetravel-button px-2 py-1 bg-blue-600 rounded text-[10px] mr-2"
                      timeTravelPanelSliderClassName="debug-timetravel-panel-slider w-full h-1 bg-zinc-700 appearance-none rounded-lg mt-2"
                      timeTravelPanelButtonClassName="debug-timetravel-panel-button px-2 py-1 bg-zinc-800 rounded text-[10px] mt-2"
                      editor={editor}
                    />
                  </div>
                </ScrollShadow>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
