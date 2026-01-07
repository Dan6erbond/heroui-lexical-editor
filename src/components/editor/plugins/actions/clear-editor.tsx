'use client';

import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Tooltip,
  useDisclosure,
} from '@heroui/react';

import { CLEAR_EDITOR_COMMAND } from 'lexical';
import { Trash2Icon } from 'lucide-react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

export function ClearEditorActionPlugin() {
  const [editor] = useLexicalComposerContext();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const handleClear = (onClose: () => void) => {
    editor.dispatchCommand(CLEAR_EDITOR_COMMAND, undefined);
    onClose();
  };

  return (
    <>
      <Tooltip content="Clear Editor" closeDelay={0}>
        <Button
          isIconOnly
          size="sm"
          variant="light"
          onPress={onOpen}
          aria-label="Clear Editor"
          className="text-default-500"
        >
          <Trash2Icon className="h-4 w-4" />
        </Button>
      </Tooltip>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="sm">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Clear Editor</ModalHeader>
              <ModalBody>
                <p className="text-default-600">
                  Are you sure you want to clear the editor? This action cannot be undone.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button variant="bordered" onPress={onClose} className="text-default-700">
                  Cancel
                </Button>
                <Button color="danger" onPress={() => handleClear(onClose)}>
                  Clear
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
