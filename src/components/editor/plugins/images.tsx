'use client';

import { $createImageNode, $isImageNode, ImageNode, ImagePayload } from '../nodes/image';
import {
  $createParagraphNode,
  $createRangeSelection,
  $getSelection,
  $insertNodes,
  $isNodeSelection,
  $isRootOrShadowRoot,
  $setSelection,
  COMMAND_PRIORITY_EDITOR,
  COMMAND_PRIORITY_HIGH,
  COMMAND_PRIORITY_LOW,
  DRAGOVER_COMMAND,
  DRAGSTART_COMMAND,
  DROP_COMMAND,
  LexicalCommand,
  LexicalEditor,
  createCommand,
} from 'lexical';
import { $wrapNodeInElement, mergeRegister } from '@lexical/utils';
import { Button, Input, ModalFooter, Tab, Tabs } from '@heroui/react';
import { JSX, useEffect, useRef, useState } from 'react';

import { CAN_USE_DOM } from '../shared/can-use-dom';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

export type InsertImagePayload = Readonly<ImagePayload>;

const getDOMSelection = (targetWindow: Window | null): Selection | null =>
  CAN_USE_DOM ? (targetWindow || window).getSelection() : null;

export const INSERT_IMAGE_COMMAND: LexicalCommand<InsertImagePayload> = createCommand('INSERT_IMAGE_COMMAND');

export function InsertImageUriDialogBody({ onClick }: { onClick: (payload: InsertImagePayload) => void }) {
  const [src, setSrc] = useState('');
  const [altText, setAltText] = useState('');

  const isDisabled = src === '';

  return (
    <div className="flex flex-col gap-4 py-4">
      <Input
        label="Image URL"
        labelPlacement="outside"
        placeholder="i.e. https://source.unsplash.com/random"
        onChange={(e) => setSrc(e.target.value)}
        value={src}
        variant="bordered"
      />
      <Input
        label="Alt Text"
        labelPlacement="outside"
        placeholder="Random unsplash image"
        onChange={(e) => setAltText(e.target.value)}
        value={altText}
        variant="bordered"
      />
      <ModalFooter className="px-0">
        className="w-full"
        <Button color="primary" disabled={isDisabled} onPress={() => onClick({ altText, src })} fullWidth>
          Confirm
        </Button>
      </ModalFooter>
    </div>
  );
}

export function InsertImageUploadedDialogBody({ onClick }: { onClick: (payload: InsertImagePayload) => void }) {
  const [src, setSrc] = useState('');
  const [altText, setAltText] = useState('');

  const isDisabled = src === '';

  const loadImage = (files: FileList | null) => {
    const reader = new FileReader();
    reader.onload = function () {
      if (typeof reader.result === 'string') {
        setSrc(reader.result);
      }
    };
    if (files !== null) {
      reader.readAsDataURL(files[0]);
    }
  };

  return (
    <div className="flex flex-col gap-4 py-4">
      <Input
        label="Image Upload"
        labelPlacement="outside"
        type="file"
        accept="image/*"
        onChange={(e) => loadImage(e.target.files)}
        variant="bordered"
      />
      <Input
        label="Alt Text"
        labelPlacement="outside"
        placeholder="Descriptive alternative text"
        onChange={(e) => setAltText(e.target.value)}
        value={altText}
        variant="bordered"
      />
      <Button color="primary" disabled={isDisabled} onPress={() => onClick({ altText, src })} fullWidth>
        Confirm
      </Button>
    </div>
  );
}

export function InsertImageDialog({
  activeEditor,
  onClose,
}: {
  activeEditor: LexicalEditor;
  onClose: () => void;
}): JSX.Element {
  const hasModifier = useRef(false);

  useEffect(() => {
    hasModifier.current = false;
    const handler = (e: KeyboardEvent) => {
      hasModifier.current = e.altKey;
    };
    document.addEventListener('keydown', handler);
    return () => {
      document.removeEventListener('keydown', handler);
    };
  }, [activeEditor]);

  const onClick = (payload: InsertImagePayload) => {
    activeEditor.dispatchCommand(INSERT_IMAGE_COMMAND, payload);
    onClose();
  };

  return (
    <Tabs aria-label="Image insertion options" fullWidth variant="underlined" color="primary">
      <Tab key="url" title="URL">
        <InsertImageUriDialogBody onClick={onClick} />
      </Tab>
      <Tab key="file" title="File">
        <InsertImageUploadedDialogBody onClick={onClick} />
      </Tab>
    </Tabs>
  );
}

export function ImagesPlugin({ captionsEnabled }: { captionsEnabled?: boolean }): JSX.Element | null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([ImageNode])) {
      throw new Error('ImagesPlugin: ImageNode not registered on editor');
    }

    return mergeRegister(
      editor.registerCommand<InsertImagePayload>(
        INSERT_IMAGE_COMMAND,
        (payload) => {
          const imageNode = $createImageNode(payload);
          $insertNodes([imageNode]);
          if ($isRootOrShadowRoot(imageNode.getParentOrThrow())) {
            $wrapNodeInElement(imageNode, $createParagraphNode).selectEnd();
          }

          return true;
        },
        COMMAND_PRIORITY_EDITOR,
      ),
      editor.registerCommand<DragEvent>(DRAGSTART_COMMAND, (event) => $onDragStart(event), COMMAND_PRIORITY_HIGH),
      editor.registerCommand<DragEvent>(DRAGOVER_COMMAND, (event) => $onDragover(event), COMMAND_PRIORITY_LOW),
      editor.registerCommand<DragEvent>(DROP_COMMAND, (event) => $onDrop(event, editor), COMMAND_PRIORITY_HIGH),
    );
  }, [captionsEnabled, editor]);

  return null;
}

function $onDragStart(event: DragEvent): boolean {
  const node = $getImageNodeInSelection();
  if (!node) return false;
  const dataTransfer = event.dataTransfer;
  if (!dataTransfer) return false;
  const TRANSPARENT_IMAGE = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
  const img = document.createElement('img');
  img.src = TRANSPARENT_IMAGE;
  dataTransfer.setData('text/plain', '_');
  dataTransfer.setDragImage(img, 0, 0);
  dataTransfer.setData(
    'application/x-lexical-drag',
    JSON.stringify({
      data: {
        altText: node.__altText,
        caption: node.__caption,
        height: node.__height,
        key: node.getKey(),
        maxWidth: node.__maxWidth,
        showCaption: node.__showCaption,
        src: node.__src,
        width: node.__width,
      },
      type: 'image',
    }),
  );
  return true;
}

function $onDragover(event: DragEvent): boolean {
  const node = $getImageNodeInSelection();
  if (!node) return false;
  if (!canDropImage(event)) {
    event.preventDefault();
  }
  return true;
}

function $onDrop(event: DragEvent, editor: LexicalEditor): boolean {
  const node = $getImageNodeInSelection();
  if (!node) return false;
  const data = getDragImageData(event);
  if (!data) return false;
  event.preventDefault();
  if (canDropImage(event)) {
    const range = getDragSelection(event);
    node.remove();
    const rangeSelection = $createRangeSelection();
    if (range !== null && range !== undefined) {
      rangeSelection.applyDOMRange(range);
    }
    $setSelection(rangeSelection);
    editor.dispatchCommand(INSERT_IMAGE_COMMAND, data);
  }
  return true;
}

function $getImageNodeInSelection(): ImageNode | null {
  const selection = $getSelection();
  if (!$isNodeSelection(selection)) return null;
  const nodes = selection.getNodes();
  const node = nodes[0];
  return $isImageNode(node) ? node : null;
}

function getDragImageData(event: DragEvent): null | InsertImagePayload {
  const dragData = event.dataTransfer?.getData('application/x-lexical-drag');
  if (!dragData) return null;
  const { type, data } = JSON.parse(dragData);
  if (type !== 'image') return null;
  return data;
}

function canDropImage(event: DragEvent): boolean {
  const target = event.target;
  return !!(
    target &&
    target instanceof HTMLElement &&
    !target.closest('code, span.editor-image') &&
    target.parentElement &&
    target.parentElement.closest('div.ContentEditable__root')
  );
}

interface FirefoxDragEvent extends DragEvent {
  rangeParent?: Node;
  rangeOffset?: number;
}

function getDragSelection(event: DragEvent): Range | null | undefined {
  let range;
  const target = event.target as null | Element | Document;
  const targetWindow =
    target == null
      ? null
      : target.nodeType === 9
        ? (target as Document).defaultView
        : (target as Element).ownerDocument.defaultView;
  const domSelection = getDOMSelection(targetWindow);

  if (document.caretRangeFromPoint) {
    range = document.caretRangeFromPoint(event.clientX, event.clientY);
  } else if ((event as FirefoxDragEvent).rangeParent && domSelection !== null) {
    domSelection.collapse((event as FirefoxDragEvent).rangeParent!, (event as FirefoxDragEvent).rangeOffset || 0);
  }

  if (!range) {
    throw Error(`Cannot get the selection when dragging`);
  }

  return range;
}
