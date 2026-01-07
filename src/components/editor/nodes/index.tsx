import { AutoLinkNode, LinkNode } from '@lexical/link';
import { CodeHighlightNode, CodeNode } from '@lexical/code';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { Klass, LexicalNode, LexicalNodeReplacement, ParagraphNode, TextNode } from 'lexical';
import { ListItemNode, ListNode } from '@lexical/list';
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table';

import { AutocompleteNode } from './autocomplete';
import { EmojiNode } from './emoji';
import { HashtagNode } from '@lexical/hashtag';
import { HorizontalRuleNode } from '@lexical/react/LexicalHorizontalRuleNode';
import { ImageNode } from './image';
import { KeywordNode } from './keyword';
import { LayoutContainerNode } from './layout-container';
import { LayoutItemNode } from './layout-item';
import { MentionNode } from './mention';
import { OverflowNode } from '@lexical/overflow';
import { TweetNode } from './embeds/tweet';
import { YouTubeNode } from './embeds/youtube';

export const nodes: ReadonlyArray<Klass<LexicalNode> | LexicalNodeReplacement> = [
  HeadingNode,
  ParagraphNode,
  TextNode,
  QuoteNode,
  ListNode,
  ListItemNode,
  LinkNode,
  OverflowNode,
  HashtagNode,
  TableNode,
  TableCellNode,
  TableRowNode,
  CodeNode,
  CodeHighlightNode,
  HorizontalRuleNode,
  MentionNode,
  ImageNode,
  EmojiNode,
  KeywordNode,
  LayoutContainerNode,
  LayoutItemNode,
  AutoLinkNode,
  TweetNode,
  YouTubeNode,
  AutocompleteNode,
];
