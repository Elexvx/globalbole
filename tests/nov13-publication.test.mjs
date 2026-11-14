import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const ISSUE = '2026-11-13';
const LOCALES = ['zh-CN', 'zh-TW', 'en', 'ru', 'fr'];
const FORBIDDEN_SLUG = 'taiwan-national-day-maritime-tensions-2026-10-11';

const EXPECTED_SLUGS = [
  { slug: 'mofcom-ciie-eu-medtech-us-tariff-framework-2026-11-13', category: 'business' },
  { slug: 'itu-pp26-global-connectivity-eu-egypt-digital-trust-2026-11-13', category: 'technology' },
  { slug: 'who-global-tuberculosis-report-domestic-investment-2026-11-13', category: 'innovation' },
  { slug: 'unfccc-cop31-industrial-decarbonization-methane-action-2026-11-13', category: 'energy' },
  { slug: 'wmo-undrr-early-warnings-for-all-cop31-report-2026-11-13', category: 'current-affairs' },
  { slug: 'ilo-governing-body-social-dialogue-youth-skills-2026-11-13', category: 'work-life' },
];

const DEFERRED_SLUGS = [
  'mot-yangtze-river-tidal-level-bulletin-2026-11-13',
  'shanghai-minhang-grid-planned-outage-notice-2026-11-13',
];

function parseFrontmatterAndBody(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  assert.ok(match, 'Markdown file must start with YAML frontmatter block');
  const fmLines = match[1].split('\n');
  const fm = {};
  for (const line of fmLines) {
    const idx = line.indexOf(':');
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    const valRaw = line.slice(idx + 1).trim();
    fm[key] = JSON.parse(valRaw);
  }
  return { fm, body: match[2].trim() };
}

test('2026-11-13 issue has 30 full five-locale articles with strict structural and length parity', () => {
  for (const { slug, category } of EXPECTED_SLUGS) {
    let baselineSectionCount = null;
    let baselineParagraphCount = null;

    for (const locale of LOCALES) {
      const mdPath = path.join(ROOT, 'content', 'issues', ISSUE, locale, `${slug}.md`);
      assert.ok(fs.existsSync(mdPath), `Missing article file: ${mdPath}`);
      const raw = fs.readFileSync(mdPath, 'utf8');
      assert.ok(!raw.includes(FORBIDDEN_SLUG), `Forbidden slug detected in ${mdPath}`);

      const { fm, body } = parseFrontmatterAndBody(raw);
      assert.equal(fm.translationKey, slug);
      assert.equal(fm.issue, ISSUE);
      assert.equal(fm.lang, locale);
      assert.equal(fm.category, category);
      assert.equal(fm.author, '全球伯乐 News');
      assert.equal(fm.date, ISSUE);
      assert.equal(fm.cover, `/news-media/${ISSUE}/${slug}-editorial.webp`);
      assert.equal(fm.readTime, 5);
      assert.equal(fm.draft, false);
      assert.equal(fm.publishedAt, undefined);
      assert.equal(fm.updatedAt, undefined);
      assert.ok(Array.isArray(fm.tags) && fm.tags.length === 3, `Expected 3 canonical tags in ${mdPath}`);

      const lines = body.split('\n');
      const headings = lines.filter((l) => l.startsWith('## '));
      assert.ok(headings.length >= 2, `Expected >= 2 ## headings in ${mdPath}`);

      const blocks = body
        .split(/\n\s*\n/)
        .map((b) => b.trim())
        .filter((b) => b.length > 0 && !b.startsWith('## ') && !b.startsWith('![') && !b.startsWith('[^'));

      // blocks[0] is lead, blocks[1] is AI disclosure caption, blocks[2..] are section paragraphs
      assert.ok(blocks.length >= 5, `Expected lead + AI disclosure + >=4 body paragraphs in ${mdPath}`);

      const imgIndex = lines.findIndex((l) => l.startsWith(`![${fm.coverAlt}](${fm.cover})`));
      assert.ok(imgIndex !== -1, `Missing cover image markdown in ${mdPath}`);
      const disclosureLine = lines.slice(imgIndex + 1).find((l) => l.trim().length > 0);
      assert.ok(
        disclosureLine &&
          (disclosureLine.includes('AI') || disclosureLine.includes('ИИ') || disclosureLine.includes('IA')),
        `Missing localized AI illustration disclosure immediately below image in ${mdPath}`
      );

      const footnotes = lines.filter((l) => /^\[\^\d+\]: \d{4}-\d{2}-\d{2} · \[.+\]\(https:\/\/.+\) · .+\.$/.test(l));
      assert.ok(footnotes.length >= 1, `Missing formatted primary-source footnotes in ${mdPath}`);

      const proseChars = blocks.filter((_, idx) => idx !== 1).join('').length;
      if (locale === 'zh-CN' || locale === 'zh-TW') {
        assert.ok(proseChars >= 480, `Chinese prose length (${proseChars}) < 480 in ${mdPath}`);
      } else {
        assert.ok(proseChars >= 1500, `${locale} prose length (${proseChars}) < 1500 in ${mdPath}`);
      }

      if (baselineSectionCount === null) {
        baselineSectionCount = headings.length;
        baselineParagraphCount = blocks.length;
      } else {
        assert.equal(headings.length, baselineSectionCount, `Section count mismatch in ${locale}/${slug}`);
        assert.equal(blocks.length, baselineParagraphCount, `Paragraph count mismatch in ${locale}/${slug}`);
      }
    }
  }
});

test('2026-11-13 WebP editorial illustrations strip metadata and match provenance SHA-256 hashes', () => {
  const provPath = path.join(ROOT, 'docs', 'news-media', ISSUE, 'provenance.json');
  const reviewMdPath = path.join(ROOT, 'docs', 'news-media', ISSUE, 'source-review.md');
  assert.ok(fs.existsSync(provPath), 'Missing provenance.json');
  assert.ok(fs.existsSync(reviewMdPath), 'Missing source-review.md');

  const provenance = JSON.parse(fs.readFileSync(provPath, 'utf8'));
  const reviewMd = fs.readFileSync(reviewMdPath, 'utf8');
  const assets = provenance.assets || provenance.items || [];
  assert.equal(assets.length, 6, 'Expected 6 provenance entries');

  for (const { slug } of EXPECTED_SLUGS) {
    const entry = assets.find((a) => a.slug === slug);
    assert.ok(entry, `Missing provenance entry for ${slug}`);
    assert.equal(entry.kind, 'ai_generated_editorial_illustration');

    const webpPath = path.join(ROOT, 'public', 'news-media', ISSUE, `${slug}-editorial.webp`);
    assert.ok(fs.existsSync(webpPath), `Missing WebP file: ${webpPath}`);
    const buf = fs.readFileSync(webpPath);
    assert.equal(buf.subarray(0, 4).toString('ascii'), 'RIFF');
    assert.equal(buf.subarray(8, 12).toString('ascii'), 'WEBP');
    assert.ok(!buf.includes(Buffer.from('EXIF')), `EXIF chunk present in ${webpPath}`);
    assert.ok(!buf.includes(Buffer.from('XMP ')), `XMP chunk present in ${webpPath}`);

    const actualSha = crypto.createHash('sha256').update(buf).digest('hex');
    assert.equal(actualSha, entry.sha256, `SHA-256 mismatch for ${slug}`);
    assert.ok(reviewMd.includes(slug) && reviewMd.includes(actualSha), `source-review.md missing ${slug} hash`);
  }
});

test('2026-11-13 publication review records 6 published slugs and 2 deferred candidates', () => {
  const reviewPath = path.join(ROOT, 'docs', `news-publication-review-${ISSUE}.json`);
  assert.ok(fs.existsSync(reviewPath), 'Missing news-publication-review-2026-11-13.json');
  const review = JSON.parse(fs.readFileSync(reviewPath, 'utf8'));
  assert.equal(review.issue, ISSUE);

  const rawStr = JSON.stringify(review);
  for (const { slug } of EXPECTED_SLUGS) {
    assert.ok(rawStr.includes(slug), `Published slug ${slug} missing in review JSON`);
  }
  for (const defSlug of DEFERRED_SLUGS) {
    assert.ok(rawStr.includes(defSlug), `Deferred slug ${defSlug} missing in review JSON`);
  }
});
