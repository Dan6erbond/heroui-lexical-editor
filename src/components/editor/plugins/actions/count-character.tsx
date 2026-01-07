'use client';

import { Chip, Divider } from '@heroui/react';
import { useEffect, useState } from 'react';

import { $rootTextContent } from '@lexical/text';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

let textEncoderInstance: null | TextEncoder = null;

function textEncoder(): null | TextEncoder {
  if (typeof window === 'undefined' || window.TextEncoder === undefined) {
    return null;
  }

  if (textEncoderInstance === null) {
    textEncoderInstance = new window.TextEncoder();
  }

  return textEncoderInstance;
}

function utf8Length(text: string) {
  const currentTextEncoder = textEncoder();

  if (currentTextEncoder === null) {
    const m = encodeURIComponent(text).match(/%[89ABab]/g);
    return text.length + (m ? m.length : 0);
  }

  return currentTextEncoder.encode(text).length;
}

interface CountCharacterPluginProps {
  charset?: 'UTF-8' | 'UTF-16';
}

const strlen = (text: string, charset: 'UTF-8' | 'UTF-16') => {
  if (charset === 'UTF-8') {
    return utf8Length(text);
  }
  return text.length;
};

const countWords = (text: string) => {
  return text.split(/\s+/).filter((word) => word.length > 0).length;
};

export function CountCharacterPlugin({ charset = 'UTF-16' }: CountCharacterPluginProps) {
  const [editor] = useLexicalComposerContext();

  const [stats, setStats] = useState(() => {
    let initialText = '';
    editor.getEditorState().read(() => {
      initialText = $rootTextContent();
    });
    return {
      characters: strlen(initialText, charset),
      words: countWords(initialText),
    };
  });

  useEffect(() => {
    return editor.registerTextContentListener((currentText: string) => {
      setStats({
        characters: strlen(currentText, charset) || 0,
        words: countWords(currentText) || 0,
      });
    });
  }, [editor, charset]);

  return (
    <div className="flex items-center gap-3 px-2 h-7">
      <div className="flex items-center gap-1.5">
        <span className="text-[10px] uppercase font-bold text-default-400 tracking-wider">Characters</span>
        <Chip size="sm" variant="flat" color="default" className="h-5 text-default-600 font-mono">
          {stats.characters}
        </Chip>
      </div>

      <Divider orientation="vertical" className="h-3" />

      <div className="flex items-center gap-1.5">
        <span className="text-[10px] uppercase font-bold text-default-400 tracking-wider">Words</span>
        <Chip size="sm" variant="flat" color="default" className="h-5 text-default-600 font-mono">
          {stats.words}
        </Chip>
      </div>
    </div>
  );
}
