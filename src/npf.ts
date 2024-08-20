import { Heading, PhrasingContent, RootContent } from 'mdast';

import utils from './utils.js';

export type Npf = {
  id?: number;
  blog?: { 'Standard API Short Blog Info object': string };
  content: NpfContent[];
};

type NpfContent = NpfHeadingContent | NpfTextContent;

type NpfFormatting = {
  start: number;
  end: number;
  type: 'bold' | 'italic' | 'strikethrough' | 'small';
};

type NpfTextContent = {
  type: 'text';
  text: string;
  formatting?: NpfFormatting[];
};

type NpfHeadingContent = NpfTextContent & {
  subtype: 'heading1' | 'heading2';
};

const internalParsers = {
  heading(heading: Heading): NpfHeadingContent {
    if (heading.depth > 2) {
      throw Error('only heading1 and heading2 supported');
    }
    const [text, formatting] = this.phrasingContentChildren(heading.children);
    let header: NpfHeadingContent = {
      type: 'text',
      subtype: heading.depth === 1 ? 'heading1' : 'heading2',
      text,
    };
    if (formatting) {
      header.formatting = formatting;
    }
    return header;
  },
  phrasingContentChildren(
    content: PhrasingContent[],
  ): [string, NpfFormatting[] | undefined] {
    let text = '';
    let formatting: NpfFormatting[] = [];

    for (let child of content) {
      switch (child.type) {
        case 'text':
          text += child.value;
          break;
        case 'emphasis':
          {
            const [emText, _] = this.phrasingContentChildren(child.children);
            const currentTextLength = utils.unicodeLength(text);
            const emTextLength = utils.unicodeLength(emText);
            text += emText;
            formatting.push({
              start: currentTextLength,
              end: currentTextLength + emTextLength,
              type: 'italic',
            });
          }
          break;
        case 'strong':
          {
            const [bText, _] = this.phrasingContentChildren(child.children);
            const currentTextLength = utils.unicodeLength(text);
            const bTextLength = utils.unicodeLength(bText);
            text += bText;
            formatting.push({
              start: currentTextLength,
              end: currentTextLength + bTextLength,
              type: 'bold',
            });
          }
          break;
      }
    }

    if (formatting.length !== 0) {
      return [text, formatting];
    } else {
      return [text, undefined];
    }
  },
};

export const parsers = {
  rootContent(child: RootContent): NpfContent | undefined {
    switch (child.type) {
      case 'heading':
        return internalParsers.heading(child);
    }
  },
};

declare module 'unified' {
  interface CompileResultMap {
    Npf: Npf;
  }
}
