import { describe, expect, test } from '@jest/globals';

import { Heading, Paragraph } from 'mdast';
import { emphasis, heading, paragraph, strong, text } from 'mdast-builder';

import { parsers } from '../src/npf.js';

describe('NPF heading parsers', () => {
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
  test('parses heading with emphasis and strong', () => {
    expect(
      parsers.rootContent(
        heading(1, [
          emphasis(text('howdy')),
          text(' '),
          strong(text('all')),
          text(' '),
          emphasis(text("y'all")),
        ]) as Heading,
      ),
    ).toEqual({
      type: 'text',
      text: "howdy all y'all",
      subtype: 'heading1',
      formatting: [
        { start: 0, end: 5, type: 'italic' },
        { start: 6, end: 9, type: 'bold' },
        { start: 10, end: 15, type: 'italic' },
      ],
    });
  });
  test('parses heading with combined formatting', () => {
    expect(
      parsers.rootContent(
        heading(1, [
          text('howdy '),
          emphasis(strong(text('all'))),
          text(" y'all"),
        ]) as Heading,
      ),
    ).toEqual({
      type: 'text',
      text: "howdy all y'all",
      subtype: 'heading1',
      formatting: [
        { start: 6, end: 9, type: 'bold' },
        { start: 6, end: 9, type: 'italic' },
      ],
    });
  });
  test('parses heading with multiple instances of emphasis', () => {
    expect(
      parsers.rootContent(
        heading(1, [
          emphasis(text('howdy')),
          text(' all '),
          emphasis(text("y'all")),
        ]) as Heading,
      ),
    ).toEqual({
      type: 'text',
      text: "howdy all y'all",
      subtype: 'heading1',
      formatting: [
        { start: 0, end: 5, type: 'italic' },
        { start: 10, end: 15, type: 'italic' },
      ],
    });
  });
});

describe('NPF paragraph parsers', () => {
  test('parses simple paragraph', () => {
    expect(
      parsers.rootContent(paragraph(text("it's delicious!!!")) as Paragraph),
    ).toEqual({ type: 'text', text: "it's delicious!!!" });
  });
  test('parses paragraph with emphasis', () => {
    expect(
      parsers.rootContent(
        paragraph([
          text("it's "),
          emphasis(text('delicious')),
          text('!'),
        ]) as Paragraph,
      ),
    ).toEqual({
      type: 'text',
      text: "it's delicious!",
      formatting: [{ start: 5, end: 14, type: 'italic' }],
    });
  });
  test('parses paragraph with strong', () => {
    expect(
      parsers.rootContent(
        paragraph([
          text("it's "),
          strong(text('delicious')),
          text('!'),
        ]) as Paragraph,
      ),
    ).toEqual({
      type: 'text',
      text: "it's delicious!",
      formatting: [{ start: 5, end: 14, type: 'bold' }],
    });
  });
});
