import { Plugin, unified } from 'unified';
import { type Root as MdastRoot } from 'mdast';
import remarkParse from 'remark-parse';

import { type Npf, parsers } from './npf.js';

const npfify: Plugin<[], MdastRoot, Npf> = function (this) {
  // @ts-expect-error: weird `Node` typing thing
  this.compiler = function (tree: MdastRoot): Npf {
    return {
      content: tree.children
        .map(parsers.rootContent)
        .filter((child) => typeof child !== 'undefined'),
    };
  };
};

export default async function md_to_npf(content: string): Promise<Npf> {
  try {
    const vfile = await unified().use(remarkParse).use(npfify).process(content);
    return vfile.result;
  } catch (error) {
    throw error;
  }
}
