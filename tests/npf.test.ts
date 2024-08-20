import { describe, expect, test } from '@jest/globals';

import { Heading } from 'mdast';
import { emphasis, heading, strong, text } from 'mdast-builder';

import { parsers } from '../src/npf.js';

describe('NPF parsers', () => {
  test('parses simple heading', () => {
    expect(parsers.rootContent(heading(1, text('howdy')) as Heading)).toEqual({
      type: 'text',
      text: 'howdy',
      subtype: 'heading1',
    });
  });
  test('parses heading with emphasis', () => {
    expect(
      parsers.rootContent(
        heading(1, [
          text('howdy '),
          emphasis(text('all')),
          text(" y'all"),
        ]) as Heading,
      ),
    ).toEqual({
      type: 'text',
      text: "howdy all y'all",
      subtype: 'heading1',
      formatting: [{ start: 6, end: 9, type: 'italic' }],
    });
  });
  test('parses heading with strong', () => {
    expect(
      parsers.rootContent(
        heading(1, [
          text('howdy '),
          strong(text('all')),
          text(" y'all"),
        ]) as Heading,
      ),
    ).toEqual({
      type: 'text',
      text: "howdy all y'all",
      subtype: 'heading1',
      formatting: [{ start: 6, end: 9, type: 'bold' }],
    });
  });
});
