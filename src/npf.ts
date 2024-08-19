import { Heading } from 'mdast';

export type Npf = {
  id?: number;
  blog?: { 'Standard API Short Blog Info object': string };
  content: NpfContent[];
};

type NpfContent = NpfTextContent;

type NpfTextContent = {
  type: 'text';
  subtype?: 'heading1' | 'heading2';
  text: string;
};

export const parsers = {
  heading(heading: Heading): NpfTextContent {
    if (heading.depth > 2) {
      throw Error('only heading1 and heading2 supported');
    }
    return {
      type: 'text',
      subtype: heading.depth === 1 ? 'heading1' : 'heading2',
      text: '',
    };
  },
};

declare module 'unified' {
  interface CompileResultMap {
    Npf: Npf;
  }
}
