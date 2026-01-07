'use client';

import {
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_EDITOR,
  REDO_COMMAND,
  UNDO_COMMAND,
  createCommand,
} from 'lexical';
import { Button, Tooltip } from '@heroui/react';
import type { LexicalCommand, LexicalEditor, RangeSelection } from 'lexical';
import { useEffect, useRef, useState } from 'react';

import { CAN_USE_DOM } from '../../shared/can-use-dom';
import { MicIcon } from 'lucide-react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useReport } from '../../hooks/use-report';

export const SPEECH_TO_TEXT_COMMAND: LexicalCommand<boolean> = createCommand('SPEECH_TO_TEXT_COMMAND');

const VOICE_COMMANDS: Readonly<Record<string, (arg0: { editor: LexicalEditor; selection: RangeSelection }) => void>> = {
  '\n': ({ selection }) => {
    selection.insertParagraph();
  },
  redo: ({ editor }) => {
    editor.dispatchCommand(REDO_COMMAND, undefined);
  },
  undo: ({ editor }) => {
    editor.dispatchCommand(UNDO_COMMAND, undefined);
  },
};

export const SUPPORT_SPEECH_RECOGNITION: boolean =
  CAN_USE_DOM && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

function SpeechToTextPluginImpl() {
  const [editor] = useLexicalComposerContext();
  const [isEnabled, setIsEnabled] = useState<boolean>(false);

  // We can derive the state from isEnabled, but Lexical likes explicit commands
  const [isSpeechToText, setIsSpeechToText] = useState<boolean>(false);

  const SpeechRecognition =
    // @ts-expect-error missing type
    CAN_USE_DOM && (window.SpeechRecognition || window.webkitSpeechRecognition);

  const recognition = useRef<typeof SpeechRecognition | null>(null);
  const report = useReport();

  useEffect(() => {
    if (isEnabled && recognition.current === null) {
      recognition.current = new SpeechRecognition();
      recognition.current.continuous = true;
      recognition.current.interimResults = true;
      recognition.current.addEventListener('result', (event: any) => {
        const resultItem = event.results.item(event.resultIndex);
        const { transcript } = resultItem.item(0);
        report(transcript);

        if (!resultItem.isFinal) {
          return;
        }

        editor.update(() => {
          const selection = $getSelection();

          if ($isRangeSelection(selection)) {
            const command = VOICE_COMMANDS[transcript.toLowerCase().trim()];

            if (command) {
              command({ editor, selection });
            } else if (transcript.match(/\s*\n\s*/)) {
              selection.insertParagraph();
            } else {
              selection.insertText(transcript);
            }
          }
        });
      });
    }

    if (recognition.current) {
      if (isEnabled) {
        recognition.current.start();
      } else {
        recognition.current.stop();
      }
    }

    return () => {
      if (recognition.current !== null) {
        recognition.current.stop();
      }
    };
  }, [SpeechRecognition, editor, isEnabled, report]);

  useEffect(() => {
    return editor.registerCommand(
      SPEECH_TO_TEXT_COMMAND,
      (_isEnabled: boolean) => {
        setIsEnabled(_isEnabled);
        setIsSpeechToText(_isEnabled);
        return true;
      },
      COMMAND_PRIORITY_EDITOR,
    );
  }, [editor]);

  return (
    <Tooltip content={isSpeechToText ? 'Stop Listening' : 'Speech to Text'} showArrow placement="top">
      <Button
        isIconOnly
        size="sm"
        radius="sm"
        aria-label="Speech to Text"
        // HeroUI logic: use 'flat' + 'danger' when recording to alert user
        variant={isSpeechToText ? 'flat' : 'light'}
        color={isSpeechToText ? 'danger' : 'default'}
        onPress={() => {
          editor.dispatchCommand(SPEECH_TO_TEXT_COMMAND, !isSpeechToText);
        }}
        className={`min-w-8 h-8 ${isSpeechToText ? 'animate-pulse' : ''}`}
      >
        {isSpeechToText ? <MicIcon className="size-4 text-danger" /> : <MicIcon className="size-4 text-default-500" />}
      </Button>
    </Tooltip>
  );
}

export const SpeechToTextPlugin = SUPPORT_SPEECH_RECOGNITION ? SpeechToTextPluginImpl : () => null;
