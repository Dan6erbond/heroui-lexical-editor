'use client';

import { JSX, useCallback, useMemo, useState } from 'react';
import { Modal, ModalBody, ModalContent, ModalHeader } from '@heroui/react';

export function useEditorModal(): [
  JSX.Element | null,
  (title: string, showModal: (onClose: () => void) => JSX.Element, closeOnClickOutside?: boolean) => void,
] {
  const [modalContent, setModalContent] = useState<null | {
    closeOnClickOutside: boolean;
    content: JSX.Element;
    title: string;
  }>(null);

  const onClose = useCallback(() => {
    setModalContent(null);
  }, []);

  const modal = useMemo(() => {
    if (modalContent === null) {
      return null;
    }

    const { title, content, closeOnClickOutside } = modalContent;

    return (
      <Modal isOpen={true} onOpenChange={(open) => !open && onClose()} isDismissable={closeOnClickOutside}>
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-default-900">{title}</ModalHeader>
              <ModalBody className="pb-6">{content}</ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    );
  }, [modalContent, onClose]);

  const showModal = useCallback(
    (title: string, getContent: (onClose: () => void) => JSX.Element, closeOnClickOutside = false) => {
      setModalContent({
        closeOnClickOutside,
        content: getContent(onClose),
        title,
      });
    },
    [onClose],
  );

  return [modal, showModal];
}
