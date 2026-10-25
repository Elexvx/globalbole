import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import {
  isCalendarDate, isPublicationTimestamp, validateArticleDates,
  articlePublishedDate, articleModifiedDate, articleLastModified,
  collectionLastModified, latestContentDate, publicationTimeLabel, rssPublicationDate,
} from '../lib/publication-dates.mjs';
import { routeLastModified } from '../lib/sitemap-dates.mjs';
import { pageContentRevision } from '../lib/page-revisions.mjs';
import { createArticleResponse, parseArticleResponse } from '../lib/article-contract.mjs';
import { buildContent } from '../scripts/content.mjs';

const releasedAt = '2026-10-25T07:24:29.538Z';
const now = Date.parse('2026-10-25T08:00:00Z');
const precise = { date: '2026-10-25', publishedAt: releasedAt };

test('publication date validation rejects normalized invalid calendar dates', () => {
  for (const value of ['2024-02-29', '2026-09-01', '2026-12-31']) assert.equal(isCalendarDate(value), true);
  for (const value of ['2026-02-29', '2026-02-31', '2026-04-31', '2026-13-01', '2026-09-00', '2026-9-01', '2026-09-01T00:00:00Z', '', null, new Date()]) assert.equal(isCalendarDate(value), false, String(value));
  assert.throws(() => validateArticleDates({ date: '2026-02-31' }, { now }), /date must be a real/);
});

test('publishedAt requires a real timestamp with seconds and an explicit known offset', () => {
  for (const value of [releasedAt, '2026-10-25T15:24:29.538+08:00', '2026-10-25T00:24:29-07:00', '2026-10-25T07:24:29Z', '2026-10-25T07:24:29.5+00:00']) assert.equal(isPublicationTimestamp(value), true, value);
  for (const value of ['2026-10-25', '2026-10-25T07:24:29', '2026-10-25T07:24Z', '2026-10-25 07:24:29Z', '2026-02-31T07:24:29Z', '2026-10-25T24:00:00Z', '2026-10-25T07:60:00Z', '2026-10-25T07:24:60Z', '2026-10-25T07:24:29+24:00', '2026-10-25T07:24:29+08:60', '2026-10-25T07:24:29-00:00', '2026-10-25T07:24:29.1234Z', '', null, 1792913069538]) assert.equal(isPublicationTimestamp(value), false, String(value));
});

test('publishedAt matches the editorial date in its own timezone and is never future-dated', () => {
  assert.doesNotThrow(() => validateArticleDates(precise, { now }));
  // October 25 locally can still be October 24 UTC, and vice versa.
  assert.doesNotThrow(() => validateArticleDates({ date: '2026-10-25', publishedAt: '2026-10-25T00:10:00+08:00' }, { now }));
  assert.doesNotThrow(() => validateArticleDates({ date: '2026-10-24', publishedAt: '2026-10-24T23:10:00-07:00' }, { now }));
  assert.throws(() => validateArticleDates({ ...precise, date: '2026-10-24' }, { now }), /calendar date must match/);
  assert.throws(() => validateArticleDates({ date: '2026-10-25', publishedAt: '2026-10-25T08:00:00.001Z' }, { now }), /must not be in the future/);
  assert.throws(() => validateArticleDates({ date: '2026-10-25', publishedAt: '2026-10-25T10:00:00+01:00' }, { now }), /must not be in the future/);
  assert.doesNotThrow(() => validateArticleDates({ date: '2026-10-25', publishedAt: '2026-10-25T08:00:00Z' }, { now }));
});

test('original publication, optional editorial revision and precision remain distinct', () => {
  assert.equal(Date.parse(releasedAt), 1792913069538, 'Verified October 25 release epoch');
  assert.equal(articlePublishedDate(precise), releasedAt);
  assert.equal(articleModifiedDate(precise), undefined);
  assert.equal(articleLastModified(precise), releasedAt);
  const sameDayRevision = { ...precise, updatedAt: '2026-10-25' };
  assert.doesNotThrow(() => validateArticleDates(sameDayRevision, { now }));
  assert.equal(articlePublishedDate(sameDayRevision), releasedAt);
  assert.equal(articleModifiedDate(sameDayRevision), '2026-10-25');
  assert.equal(articleLastModified(sameDayRevision), '2026-10-25');
  assert.throws(() => validateArticleDates({ ...precise, updatedAt: '2026-10-24' }, { now }), /must not precede/);
  assert.throws(() => validateArticleDates({ ...precise, updatedAt: '2026-02-31' }, { now }), /updatedAt must be a real/);
  const historical = { date: '2026-10-01' };
  assert.equal(articlePublishedDate(historical), '2026-10-01');
  assert.equal(articleLastModified(historical), '2026-10-01');
  assert.equal(articleModifiedDate(historical), undefined);
});

test('RSS omits unknown times and never substitutes revision or rebuild dates', () => {
  assert.equal(rssPublicationDate({ date: '2026-10-01' }), undefined);
  assert.equal(rssPublicationDate({ date: '2026-10-01', updatedAt: '2026-10-25' }), undefined);
  assert.equal(rssPublicationDate(precise), 'Sun, 25 Oct 2026 07:24:29 GMT');
  assert.equal(rssPublicationDate({ ...precise, updatedAt: '2026-10-25' }), rssPublicationDate(precise));
  assert.equal(rssPublicationDate({ date: '2026-10-25', publishedAt: '2026-10-25T15:24:29.538+08:00' }), rssPublicationDate(precise));
  assert.equal(Date.parse(rssPublicationDate(precise)), Math.floor(1792913069538 / 1000) * 1000);
});

test('visible exact publication time labels retain their stated offset', () => {
  assert.equal(publicationTimeLabel({ date: '2026-10-01' }), undefined);
  assert.equal(publicationTimeLabel(precise), '07:24:29 UTC');
  assert.equal(publicationTimeLabel({ date: '2026-10-25', publishedAt: '2026-10-25T15:24:29.538+08:00' }), '15:24:29 UTC+08:00');
  assert.equal(publicationTimeLabel({ date: '2026-10-25', publishedAt: '2026-10-25T00:24:29-07:00' }), '00:24:29 UTC-07:00');
});

test('collection lastmod comes only from actual content, preserving its precision', () => {
  assert.equal(collectionLastModified([]), undefined);
  assert.equal(collectionLastModified([{ date: '2026-09-01' }, { date: '2026-09-02' }]), '2026-09-02');
  assert.equal(collectionLastModified([{ date: '2026-09-01', updatedAt: '2026-10-25' }, precise]), '2026-10-25');
  assert.equal(collectionLastModified([precise, { date: '2026-10-25' }]), '2026-10-25');
  assert.equal(collectionLastModified([{ date: '2026-10-25' }, precise]), '2026-10-25');
  assert.equal(latestContentDate([undefined, releasedAt, '2026-10-25']), '2026-10-25');
  assert.equal(latestContentDate(['2026-10-25', '2026-10-26T00:00:00Z']), '2026-10-26T00:00:00Z');
  assert.equal(collectionLastModified([{ date: '2026-09-01', updatedAt: '2026-10-26' }, precise]), '2026-10-26');
  // Offset timestamps must be compared as instants, not lexicographically.
  assert.equal(collectionLastModified([
    { date: '2026-10-25', publishedAt: '2026-10-25T15:00:00+08:00' },
    { date: '2026-10-25', publishedAt: '2026-10-25T08:00:00Z' },
  ]), '2026-10-25T08:00:00Z');
});

test('sitemap dates respect content scope and only evidenced informational-page revisions', () => {
  const stories = [
    { slug: 'en-one', lang: 'en', category: 'technology', issue: 'old-issue', date: '2026-09-01', updatedAt: '2026-10-15', tags: ['AI Systems'] },
    { slug: 'en-two', lang: 'en', category: 'energy', issue: 'new-issue', ...precise, tags: ['Energy'] },
    { slug: 'fr-one', lang: 'fr', category: 'technology', issue: 'old-issue', date: '2026-09-01', tags: ['IA'] },
  ];
  assert.equal(routeLastModified('en', [], stories), releasedAt);
  assert.equal(routeLastModified('en', ['all-news', '2'], stories), releasedAt);
  assert.equal(routeLastModified('en', ['issues'], stories), releasedAt);
  assert.equal(routeLastModified('en', ['post', 'en-one'], stories), '2026-10-15');
  assert.equal(routeLastModified('en', ['post', 'en-two'], stories), releasedAt);
  assert.equal(routeLastModified('fr', ['post', 'fr-one'], stories), '2026-09-01');
  assert.equal(routeLastModified('fr', ['post', 'en-two'], stories), undefined);
  assert.equal(routeLastModified('en', ['category', 'technology'], stories), '2026-10-15');
  assert.equal(routeLastModified('en', ['issue', 'old-issue'], stories), '2026-10-15');
  assert.equal(routeLastModified('en', ['tag', 'ai-systems'], stories), '2026-10-25');
  assert.equal(routeLastModified('en', ['tag', 'AI%20Systems'], stories), '2026-10-25');
  assert.equal(routeLastModified('en', ['tag', 'Energy'], stories), '2026-10-25', 'Tag copy edit retains date precision even alongside a precise article release');
  assert.equal(routeLastModified('fr', [], stories), '2026-09-01');
  for (const route of [['category', 'missing'], ['tag', 'missing'], ['issue', 'missing'], ['privacy']]) assert.equal(routeLastModified('en', route, stories), undefined);
  for (const route of [['about'], ['authors'], ['contact']]) assert.equal(routeLastModified('en', route, stories), '2026-10-25');
  assert.equal(routeLastModified('ru', [], stories), undefined);
});

test('page revision registry is explicit and does not refresh dates on rebuild', () => {
  for (const route of [['about'], ['authors'], ['contact'], ['tag', 'Energy']]) assert.equal(pageContentRevision(route), '2026-10-25');
  for (const route of [[], ['privacy'], ['all-news'], ['category', 'technology'], ['post', 'en-example']]) assert.equal(pageContentRevision(route), undefined);
});

test('public article contract preserves optional publishedAt and rejects unsafe timestamp payloads', () => {
  const article = {
    slug: 'en-test', title: 'Test', lang: 'en', translationKey: 'test', issue: '2026-09-01', category: 'technology', categoryLabel: 'Technology', author: 'Test desk', authorRole: 'Editor', date: '2026-09-01', displayDate: 'Sep 1, 2026', readTime: 2, dek: 'Test article.', image: '/cover.webp', imageAlt: 'Cover', tags: ['Test'], body: [], markdown: 'Test body.',
  };
  const legacy = createArticleResponse([article]);
  assert.equal(Object.hasOwn(legacy.data[0], 'publishedAt'), false);
  const timestamp = '2026-09-01T09:30:00+08:00';
  const published = createArticleResponse([{ ...article, publishedAt: timestamp }]);
  assert.equal(published.data[0].publishedAt, timestamp);
  assert.deepEqual(parseArticleResponse(JSON.parse(JSON.stringify(published))), published);
  for (const publishedAt of [null, '', 1234, '2026-09-01T09:30:00', '2026-09-02T09:30:00Z']) assert.throws(() => createArticleResponse([{ ...article, publishedAt }]), /publishedAt/);
  assert.throws(() => createArticleResponse([{ ...article, date: '9999-01-01', publishedAt: '9999-01-01T00:00:00Z' }]), /future/);
});

test('Markdown generation and public JSON share the same publication validation', () => {
  const original = process.cwd();
  const directory = mkdtempSync(path.join(tmpdir(), 'globalbole-publication-dates-'));
  const fixture = `---\ntitle: "Test"\nslug: "test"\ntranslationKey: "test"\nissue: "2026-09-01"\nlang: "en"\ncategory: "technology"\nauthor: "Test desk"\ndate: "2026-09-01"\ndescription: "Test article."\ncover: "/cover.webp"\ncoverAlt: "Cover"\ntags: ["Test"]\n---\n\nTest body.\n`;
  try {
    process.chdir(directory);
    mkdirSync('content/issues/test', { recursive: true });
    mkdirSync('public', { recursive: true });
    writeFileSync('public/cover.webp', '');
    const save = source => writeFileSync('content/issues/test/test.md', source);
    save(fixture);
    assert.equal(Object.hasOwn(buildContent()[0], 'publishedAt'), false);
    save(fixture.replace('date: "2026-09-01"', 'date: "2026-09-01"\npublishedAt: "2026-09-01T09:30:00+08:00"'));
    assert.equal(buildContent()[0].publishedAt, '2026-09-01T09:30:00+08:00');
    const publicArticle = JSON.parse(readFileSync('public/data/v1/articles.json', 'utf8')).data[0];
    assert.equal(publicArticle.publishedAt, '2026-09-01T09:30:00+08:00');
    for (const dateLine of ['date: "2026-02-31"', 'date: "2026-09-01"\npublishedAt: "2026-09-01T09:30:00"', 'date: "2026-09-01"\npublishedAt: "2026-09-02T09:30:00Z"', 'date: "9999-01-01"\npublishedAt: "9999-01-01T00:00:00Z"']) {
      save(fixture.replace('date: "2026-09-01"', dateLine));
      assert.throws(buildContent, /date must be a real|publishedAt/);
    }
  } finally {
    process.chdir(original);
    rmSync(directory, { recursive: true, force: true });
  }
});
