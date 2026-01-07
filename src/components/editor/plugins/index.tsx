import {
  CHECK_LIST,
  ELEMENT_TRANSFORMERS,
  MULTILINE_ELEMENT_TRANSFORMERS,
  TEXT_FORMAT_TRANSFORMERS,
  TEXT_MATCH_TRANSFORMERS,
} from '@lexical/markdown';
import { DynamicTablePickerPlugin, TablePickerPlugin } from './picker/table';

import { ActionsPlugin } from './actions';
import { AlignmentPickerPlugin } from './picker/alignment';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { AutoLinkPlugin } from './auto-link';
import { AutocompletePlugin } from './autocomplete';
import { BlockFormatDropDown } from './toolbar/block-format';
import { BlockInsertPlugin } from './toolbar/block-insert';
import { BulletedListPickerPlugin } from './picker/bulleted-list';
import { CharacterLimitPlugin } from './actions/character-limit';
import { CheckListPickerPlugin } from './picker/check-list';
import { CheckListPlugin } from '@lexical/react/LexicalCheckListPlugin';
import { ClearEditorActionPlugin } from './actions/clear-editor';
import { ClearEditorPlugin } from '@lexical/react/LexicalClearEditorPlugin';
import { ClearFormattingToolbarPlugin } from './toolbar/clear-formatting';
import { ClickableLinkPlugin } from '@lexical/react/LexicalClickableLinkPlugin';
import { CodeActionMenuPlugin } from './code-action-menu';
import { CodeHighlightPlugin } from './code-highlight';
import { CodeLanguageToolbarPlugin } from './toolbar/code-language';
import { CodePickerPlugin } from './picker/code';
import { ColumnsLayoutPickerPlugin } from './picker/columns-layout';
import { ComponentPickerMenuPlugin } from './component-picker-menu';
import { ContentEditable } from '../ui/content-editable';
import { ContextMenuPlugin } from './context-menu';
import { CountCharacterPlugin } from './actions/count-character';
import { Divider } from '@heroui/react';
import { DividerPickerPlugin } from './picker/divider';
import { DragDropPastePlugin } from './drag-drop-paste';
import { DraggableBlockPlugin } from './draggable-block';
import { EMOJI } from '../transformers/markdown-emoji';
import { EditModeTogglePlugin } from './actions/edit-mode-toggle';
import { ElementFormatToolbarPlugin } from './toolbar/element-format';
import { EmojiPickerPlugin } from './picker/emoji';
import { EmojisPlugin } from './emojis';
import { FloatingLinkEditorPlugin } from './floating-link-editor';
import { FloatingTextFormatToolbarPlugin } from './floating-text-format';
import { FontBackgroundToolbarPlugin } from './toolbar/font-background';
import { FontColorToolbarPlugin } from './toolbar/font-color';
import { FontFamilyToolbarPlugin } from './toolbar/font-family';
import { FontFormatToolbarPlugin } from './toolbar/font-format';
import { FontSizeToolbarPlugin } from './toolbar/font-size';
import { HR } from '../transformers/markdown-hr';
import { HashtagPlugin } from '@lexical/react/LexicalHashtagPlugin';
import { HeadingPickerPlugin } from './picker/heading';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { HistoryToolbarPlugin } from './toolbar/history';
import { HorizontalRulePlugin } from '@lexical/react/LexicalHorizontalRulePlugin';
import { IMAGE } from '../transformers/markdown-image';
import { ImagePickerPlugin } from './picker/image';
import { ImagesPlugin } from './images';
import { ImportExportPlugin } from './actions/import-export';
import { KeywordsPlugin } from './keywords';
import { LayoutPlugin } from './layout';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { LinkPlugin } from './link';
import { LinkToolbarPlugin } from './toolbar/link';
import { ListMaxIndentLevelPlugin } from './list-max-indent-level';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { MarkdownTogglePlugin } from './actions/markdown-toggle';
import { MaxLengthPlugin } from './actions/max-length';
import { MentionsPlugin } from './mentions';
import { NumberedListPickerPlugin } from '@/components/editor/plugins/picker/numbered-list';
import { ParagraphPickerPlugin } from './picker/paragraph';
import { QuotePickerPlugin } from './picker/quote';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ShareContentPlugin } from './actions/share-content';
import { SpeechToTextPlugin } from './actions/speech-to-text';
import { SubSuperToolbarPlugin } from './toolbar/sub-super';
import { TABLE } from '../transformers/markdown-table';
import { TWEET } from '../transformers/markdown-tweet';
import { TabFocusPlugin } from './tab-focus';
import { TabIndentationPlugin } from '@lexical/react/LexicalTabIndentationPlugin';
import { TablePlugin } from '@lexical/react/LexicalTablePlugin';
import { ToolbarPlugin } from './toolbar';
import { TreeViewPlugin } from './actions/tree-view';
import { TypingPerfPlugin } from './typing-perf';
import { useState } from 'react';

// import { InsertEmbeds } from "./toolbar/block-insert/insert-embeds";
// import { AutoEmbedPlugin } from "./embeds/auto";
// import { TwitterPlugin } from "./embeds/twitter";
// import { YouTubePlugin } from "./embeds/youtube";
// import { EmbedsPickerPlugin } from "./picker/embeds";

const placeholder = 'Press / for commands...';
const maxLength = 500;

export function Plugins({}) {
  const [floatingAnchorElem, setFloatingAnchorElem] = useState<HTMLDivElement | null>(null);
  const [isLinkEditMode, setIsLinkEditMode] = useState<boolean>(false);

  const onRef = (_floatingAnchorElem: HTMLDivElement) => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem);
    }
  };

  return (
    <div className="relative">
      <ToolbarPlugin>
        {({ blockType }) => (
          <div className="vertical-align-middle sticky top-0 z-10 flex items-center gap-2 overflow-auto border-b p-1">
            <HistoryToolbarPlugin />
            <Divider orientation="vertical" className="h-7" />
            <BlockFormatDropDown />
            {blockType === 'code' ? (
              <CodeLanguageToolbarPlugin />
            ) : (
              <>
                <FontFamilyToolbarPlugin />
                <FontSizeToolbarPlugin />
                <Divider orientation="vertical" className="h-7" />
                <FontFormatToolbarPlugin />
                <Divider orientation="vertical" className="h-7" />
                <SubSuperToolbarPlugin />
                <LinkToolbarPlugin setIsLinkEditMode={setIsLinkEditMode} />
                <Divider orientation="vertical" className="h-7" />
                <ClearFormattingToolbarPlugin />
                <Divider orientation="vertical" className="h-7" />
                <FontColorToolbarPlugin />
                <FontBackgroundToolbarPlugin />
                <Divider orientation="vertical" className="h-7" />
                <ElementFormatToolbarPlugin />
                <Divider orientation="vertical" className="h-7" />
                <BlockInsertPlugin />
              </>
            )}
          </div>
        )}
      </ToolbarPlugin>
      <div className="relative">
        <AutoFocusPlugin />
        <RichTextPlugin
          contentEditable={
            <div className="">
              <div className="" ref={onRef}>
                <ContentEditable
                  placeholder={placeholder}
                  className="ContentEditable__root relative block h-[calc(100vh-570px)] min-h-72 overflow-auto px-8 py-4 focus:outline-none"
                />
              </div>
            </div>
          }
          ErrorBoundary={LexicalErrorBoundary}
        />

        <ClickableLinkPlugin />
        <CheckListPlugin />
        <HorizontalRulePlugin />
        <TablePlugin />
        <ListPlugin />
        <TabIndentationPlugin />
        <HashtagPlugin />
        <HistoryPlugin />

        <MentionsPlugin />
        <DraggableBlockPlugin anchorElem={floatingAnchorElem} />
        <KeywordsPlugin />
        <EmojisPlugin />
        <ImagesPlugin />

        <LayoutPlugin />

        {/* <AutoEmbedPlugin /> */}
        {/* <TwitterPlugin />
        <YouTubePlugin /> */}

        <CodeHighlightPlugin />
        <CodeActionMenuPlugin anchorElem={floatingAnchorElem} />

        <MarkdownShortcutPlugin
          transformers={[
            TABLE,
            HR,
            IMAGE,
            EMOJI,
            TWEET,
            CHECK_LIST,
            ...ELEMENT_TRANSFORMERS,
            ...MULTILINE_ELEMENT_TRANSFORMERS,
            ...TEXT_FORMAT_TRANSFORMERS,
            ...TEXT_MATCH_TRANSFORMERS,
          ]}
        />
        <TypingPerfPlugin />
        <TabFocusPlugin />
        <AutocompletePlugin />
        <AutoLinkPlugin />
        <LinkPlugin />

        <ComponentPickerMenuPlugin
          baseOptions={[
            ParagraphPickerPlugin(),
            HeadingPickerPlugin({ n: 1 }),
            HeadingPickerPlugin({ n: 2 }),
            HeadingPickerPlugin({ n: 3 }),
            TablePickerPlugin(),
            CheckListPickerPlugin(),
            NumberedListPickerPlugin(),
            BulletedListPickerPlugin(),
            QuotePickerPlugin(),
            CodePickerPlugin(),
            DividerPickerPlugin(),
            // EmbedsPickerPlugin({ embed: "tweet" }),
            // EmbedsPickerPlugin({ embed: "youtube-video" }),
            ImagePickerPlugin(),
            ColumnsLayoutPickerPlugin(),
            AlignmentPickerPlugin({ alignment: 'left' }),
            AlignmentPickerPlugin({ alignment: 'center' }),
            AlignmentPickerPlugin({ alignment: 'right' }),
            AlignmentPickerPlugin({ alignment: 'justify' }),
          ]}
          dynamicOptionsFn={DynamicTablePickerPlugin}
        />

        <ContextMenuPlugin />
        <DragDropPastePlugin />
        <EmojiPickerPlugin />

        <FloatingLinkEditorPlugin
          anchorElem={floatingAnchorElem}
          isLinkEditMode={isLinkEditMode}
          setIsLinkEditMode={setIsLinkEditMode}
        />
        <FloatingTextFormatToolbarPlugin anchorElem={floatingAnchorElem} setIsLinkEditMode={setIsLinkEditMode} />

        <ListMaxIndentLevelPlugin />
      </div>
      <ActionsPlugin>
        <div className="clear-both flex items-center justify-between gap-2 overflow-auto border-t p-1">
          <div className="flex flex-1 justify-start">
            <MaxLengthPlugin maxLength={maxLength} />
            <CharacterLimitPlugin maxLength={maxLength} charset="UTF-16" />
          </div>
          <div>
            <CountCharacterPlugin charset="UTF-16" />
          </div>
          <div className="flex flex-1 justify-end">
            <SpeechToTextPlugin />
            <ShareContentPlugin />
            <ImportExportPlugin />
            <MarkdownTogglePlugin
              shouldPreserveNewLinesInMarkdown={true}
              transformers={[
                TABLE,
                HR,
                IMAGE,
                EMOJI,
                TWEET,
                CHECK_LIST,
                ...ELEMENT_TRANSFORMERS,
                ...MULTILINE_ELEMENT_TRANSFORMERS,
                ...TEXT_FORMAT_TRANSFORMERS,
                ...TEXT_MATCH_TRANSFORMERS,
              ]}
            />
            <EditModeTogglePlugin />
            <>
              <ClearEditorActionPlugin />
              <ClearEditorPlugin />
            </>
            <TreeViewPlugin />
          </div>
        </div>
      </ActionsPlugin>
    </div>
  );
}
