import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { decodeTagRouteSegment, tagLabel, tagMatchesSlug } from '../lib/tag-routes.mjs';
import { createArticleResponse } from '../lib/article-contract.mjs';
import { buildContent } from '../scripts/content.mjs';

test('tag route decoding accepts Unicode and one encoded segment without decoding twice', () => {
  for (const tag of ['储能', '儲能', '人工智能', 'Anthropic', 'New York', 'AI-powered', 'Énergie', 'Работа']) {
    const slug = tag.replace(/\s+/g, '-');
    assert.equal(decodeTagRouteSegment(slug), slug);
    assert.equal(decodeTagRouteSegment(encodeURIComponent(slug)), slug);
    assert.ok(tagMatchesSlug(tag, decodeTagRouteSegment(encodeURIComponent(slug))));
    assert.equal(tagLabel(slug, [tag]), tag);
    // The language switch must re-encode the decoded segment exactly once.
    assert.equal(encodeURIComponent(decodeTagRouteSegment(encodeURIComponent(slug))), encodeURIComponent(slug));
  }
  assert.equal(decodeTagRouteSegment('%25E5%2582%25A8%25E8%2583%25BD'), '%E5%82%A8%E8%83%BD');
  assert.equal(tagMatchesSlug('储能', decodeTagRouteSegment('%25E5%2582%25A8%25E8%2583%25BD')), false);
  for (const malformed of ['%', '%ZZ', '%E0%A4%A']) assert.equal(decodeTagRouteSegment(malformed), malformed);
  assert.equal(decodeTagRouteSegment('%252F'), '%2F');
  assert.equal(decodeTagRouteSegment('%2F'), '/');
});

test('tag matching preserves case-insensitive links, spaces and stored hyphenated labels', () => {
  assert.ok(tagMatchesSlug('Anthropic', 'anthropic'));
  assert.ok(tagMatchesSlug('New York', 'new-york'));
  assert.ok(tagMatchesSlug('New York', 'NEW YORK'));
  assert.equal(tagLabel('AI-powered', ['AI-powered']), 'AI-powered');
  assert.equal(tagLabel('missing-tag', []), 'missing tag');
  const queryTag = new URLSearchParams('tag=%25E5%2582%25A8').get('tag');
  assert.equal(queryTag, '%E5%82%A8');
  assert.equal(tagMatchesSlug('储', queryTag), false, 'An already-decoded query value must not be decoded again');
});

test('every published tag round-trips and reserved characters remain outside the content contract', () => {
  const articles = buildContent();
  for (const story of articles) for (const tag of story.tags) {
    const segment = encodeURIComponent(tag.replace(/\s+/g, '-'));
    assert.ok(tagMatchesSlug(tag, decodeTagRouteSegment(segment)));
    assert.equal(tagLabel(decodeTagRouteSegment(segment), [tag]), tag);
  }
  if (articles.length) for (const tag of ['a/b', '50%', 'a?b', 'a#b', 'a&b', '<script>']) {
    assert.throws(() => createArticleResponse([{...articles[0], tags:[tag]}]), /tags/);
  }
  const view = readFileSync('app/(site)/tag/[slug]/view.tsx', 'utf8');
  assert.match(view, /queryTag \|\| decodeTagRouteSegment\(legacySlug/);
  assert.doesNotMatch(view, /decodeTagRouteSegment\(query/);
});
