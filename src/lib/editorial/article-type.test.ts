import { describe, expect, it } from 'vitest';

import { formatArticleType } from './article-type';

describe('formatArticleType', () => {
  it('maps the two types actually in the corpus', () => {
    // 24 of 25 live articles are `editorial`; one is `story_feature`, and it
    // was the one printing STORY_FEATURE into a reader-facing byline.
    expect(formatArticleType('editorial')).toBe('Editorial');
    expect(formatArticleType('story_feature')).toBe('Feature');
  });

  it('never returns a string containing an underscore', () => {
    for (const token of [
      'editorial',
      'story_feature',
      'story_photo_essay',
      'some_future_type_upstream',
    ]) {
      expect(formatArticleType(token)).not.toMatch(/_/);
    }
  });

  it('degrades an unknown token to Title Case instead of dropping it', () => {
    expect(formatArticleType('some_future_type')).toBe('Some future type');
    expect(formatArticleType('op-ed')).toBe('Op ed');
  });

  it('tolerates the shapes the API actually sends for "no type"', () => {
    expect(formatArticleType(null)).toBeNull();
    expect(formatArticleType(undefined)).toBeNull();
    expect(formatArticleType('')).toBeNull();
    expect(formatArticleType('   ')).toBeNull();
  });

  it('normalises casing and stray whitespace', () => {
    expect(formatArticleType('  STORY_FEATURE  ')).toBe('Feature');
    expect(formatArticleType('Editorial')).toBe('Editorial');
  });
});
