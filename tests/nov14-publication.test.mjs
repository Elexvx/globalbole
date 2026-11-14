import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const ISSUE = '2026-11-14';
const LOCALES = ['zh-CN', 'zh-TW', 'en', 'ru', 'fr'];
const FORBIDDEN_SLUG = 'taiwan-national-day-maritime-tensions-2026-10-11';

const EXPECTED_SLUGS = [
  {
    slug: 'unfccc-cop31-ai-climate-information-integrity-gggi-facility-2026-11-14',
    category: 'technology',
    expectedTags: {
      'zh-CN': ['人工智能', '数据中心', '科技政策'],
      'zh-TW': ['人工智慧', '資料中心', '科技政策'],
      en: ['Artificial intelligence', 'Data centers', 'Technology policy'],
      ru: ['Искусственный интеллект', 'Дата-центры', 'Технологическая политика'],
      fr: ['Intelligence artificielle', 'Centres de données', 'Politique technologique'],
    },
  },
  {
    slug: 'fda-mibc-durvalumab-approval-who-plastics-health-2026-11-14',
    category: 'innovation',
    expectedTags: {
      'zh-CN': ['产业创新', '公共政策', '美国'],
      'zh-TW': ['產業創新', '公共政策', '美國'],
      en: ['Industrial innovation', 'Public policy', 'United States'],
      ru: ['Промышленные инновации', 'Государственная политика', 'США'],
      fr: ['Innovation industrielle', 'Politiques publiques', 'États-Unis'],
    },
  },
  {
    slug: 'doe-genesis-fusion-digital-convergence-nuclear-cleanup-ai-2026-11-14',
    category: 'energy',
    expectedTags: {
      'zh-CN': ['人工智能', '数据中心', '产业创新'],
      'zh-TW': ['人工智慧', '資料中心', '產業創新'],
      en: ['Artificial intelligence', 'Data centers', 'Industrial innovation'],
      ru: ['Искусственный интеллект', 'Дата-центры', 'Промышленные инновации'],
      fr: ['Intelligence artificielle', 'Centres de données', 'Innovation industrielle'],
    },
  },
  {
    slug: 'eu-gggi-climate-investment-facility-oil-supply-stability-2026-11-14',
    category: 'current-affairs',
    expectedTags: {
      'zh-CN': ['新能源', '电网', '能源安全'],
      'zh-TW': ['新能源', '電網', '能源安全'],
      en: ['Renewable energy', 'Power grid', 'Energy security'],
      ru: ['Новая энергетика', 'Электросети', 'Энергетическая безопасность'],
      fr: ['Énergies renouvelables', 'Réseau électrique', 'Sécurité énergétique'],
    },
  },
  {
    slug: 'imf-vietnam-article-iv-ai-tech-cycle-csrc-appraisal-registry-2026-11-14',
    category: 'business',
    expectedTags: {
      'zh-CN': ['国际贸易', '国际局势', '欧盟'],
      'zh-TW': ['國際貿易', '國際局勢', '歐盟'],
      en: ['International trade', 'International affairs', 'European Union'],
      ru: ['Международная торговля', 'Международная обстановка', 'Европейский союз'],
      fr: ['Commerce international', 'Affaires internationales', 'Union européenne'],
    },
  },
  {
    slug: 'ilo-cop31-just-transition-pavilion-green-skills-workforce-2026-11-14',
    category: 'work-life',
    expectedTags: {
      'zh-CN': ['劳动力市场', '就业', '经济数据'],
      'zh-TW': ['勞動力市場', '就業', '經濟數據'],
      en: ['Labour market', 'Employment', 'Economic data'],
      ru: ['Рынок труда', 'Занятость', 'Экономические данные'],
      fr: ['Marché du travail', 'Emploi', 'Données économiques'],
    },
  },
];

const DEFERRED_SLUGS = [
  'mot-yangtze-river-tidal-level-bulletin-2026-11-14',
  'mot-jiangyin-channel-buoy-68-unlit-notice-2026-11-13',
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

test('2026-11-14 issue has 30 full five-locale articles with strict structural, tag, and length parity', () => {
  for (const { slug, category, expectedTags } of EXPECTED_SLUGS) {
    let baselineSectionCount = null;
    let baselineParagraphCount = null;
    let baselineFootnoteCount = null;

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
      assert.deepEqual(fm.tags, expectedTags[locale], `Tag mismatch in ${mdPath}`);

      const lines = body.split('\n');
      const headings = lines.filter((l) => l.startsWith('## '));
      assert.ok(headings.length >= 2, `Expected >= 2 ## headings in ${mdPath}`);

      const blocks = body
        .split(/\n\s*\n/)
        .map((b) => b.trim())
        .filter((b) => b.length > 0 && !b.startsWith('## ') && !b.startsWith('![') && !b.startsWith('[^'));

      // blocks[0] is lead, blocks[1] is AI disclosure caption, blocks[2..] are substantive body paragraphs
      assert.ok(blocks.length >= 6, `Expected lead + AI disclosure + >=4 body paragraphs in ${mdPath}`);

      const imgIndex = lines.findIndex((l) => l.startsWith(`![${fm.coverAlt}](${fm.cover})`));
      assert.ok(imgIndex !== -1, `Missing cover image markdown in ${mdPath}`);
      const disclosureLine = lines.slice(imgIndex + 1).find((l) => l.trim().length > 0);
      assert.ok(
        disclosureLine &&
          (disclosureLine.includes('AI') || disclosureLine.includes('ИИ') || disclosureLine.includes('IA')),
        `Missing localized AI illustration disclosure immediately below image in ${mdPath}`
      );

      // Verify inline clickable primary-source links in prose
      const proseText = blocks.filter((_, idx) => idx !== 1).join('\n');
      const inlineLinks = proseText.match(/\[[^\]]+\]\(https:\/\/[^)]+\)/g) || [];
      assert.ok(inlineLinks.length >= 2, `Expected >= 2 inline clickable https links in prose of ${mdPath}`);

      const footnotes = lines.filter((l) => /^\[\^\d+\]: \d{4}-\d{2}-\d{2} · \[.+\]\(https:\/\/.+\) · .+\.$/.test(l));
      assert.ok(footnotes.length >= 2, `Missing formatted primary-source footnotes in ${mdPath}`);

      const proseChars = blocks.filter((_, idx) => idx !== 1).join('').length;
      if (locale === 'zh-CN' || locale === 'zh-TW') {
        assert.ok(proseChars >= 480, `Chinese prose length (${proseChars}) < 480 in ${mdPath}`);
      } else {
        assert.ok(proseChars >= 1500, `${locale} prose length (${proseChars}) < 1500 in ${mdPath}`);
      }

      if (baselineSectionCount === null) {
        baselineSectionCount = headings.length;
        baselineParagraphCount = blocks.length;
        baselineFootnoteCount = footnotes.length;
      } else {
        assert.equal(headings.length, baselineSectionCount, `Section count mismatch in ${locale}/${slug}`);
        assert.equal(blocks.length, baselineParagraphCount, `Paragraph count mismatch in ${locale}/${slug}`);
        assert.equal(footnotes.length, baselineFootnoteCount, `Footnote count mismatch in ${locale}/${slug}`);
      }
    }
  }
});

test('2026-11-14 WebP editorial illustrations strip metadata and match provenance SHA-256 hashes', () => {
  const provPath = path.join(ROOT, 'docs', 'news-media', ISSUE, 'provenance.json');
  const reviewMdPath = path.join(ROOT, 'docs', 'news-media', ISSUE, 'source-review.md');
  assert.ok(fs.existsSync(provPath), 'Missing provenance.json');
  assert.ok(fs.existsSync(reviewMdPath), 'Missing source-review.md');

  const provenance = JSON.parse(fs.readFileSync(provPath, 'utf8'));
  const reviewMd = fs.readFileSync(reviewMdPath, 'utf8');
  const assets = provenance.assets || provenance.items || [];
  assert.equal(assets.length, 6, 'Expected 6 provenance entries');
  assert.equal(provenance.sourceDocument.googleDocId, '1F32P7cJN01zM9iyJ3B0AHHXCEL-nbmYA2cxrFzq5Vls');

  for (const { slug } of EXPECTED_SLUGS) {
    const entry = assets.find((a) => a.slug === slug);
    assert.ok(entry, `Missing provenance entry for ${slug}`);
    assert.equal(entry.kind, 'ai_generated_editorial_illustration');
    assert.equal(entry.generationTool, 'OpenAI image_gen');

    const webpPath = path.join(ROOT, 'public', 'news-media', ISSUE, `${slug}-editorial.webp`);
    assert.ok(fs.existsSync(webpPath), `Missing WebP file: ${webpPath}`);
    const buf = fs.readFileSync(webpPath);
    assert.equal(buf.subarray(0, 4).toString('ascii'), 'RIFF');
    assert.equal(buf.subarray(8, 12).toString('ascii'), 'WEBP');
    assert.ok(!buf.includes(Buffer.from('EXIF')), `EXIF chunk present in ${webpPath}`);
    assert.ok(!buf.includes(Buffer.from('XMP ')), `XMP chunk present in ${webpPath}`);
    assert.ok(!buf.includes(Buffer.from('ICCP')), `ICCP chunk present in ${webpPath}`);

    const actualSha = crypto.createHash('sha256').update(buf).digest('hex');
    assert.equal(actualSha, entry.sha256, `SHA-256 mismatch for ${slug}`);
    assert.ok(reviewMd.includes(slug) && reviewMd.includes(actualSha), `source-review.md missing ${slug} hash`);
  }
});

test('2026-11-14 publication review records 6 published slugs and 2 deferred candidates', () => {
  const reviewPath = path.join(ROOT, 'docs', `news-publication-review-${ISSUE}.json`);
  assert.ok(fs.existsSync(reviewPath), 'Missing news-publication-review-2026-11-14.json');
  const review = JSON.parse(fs.readFileSync(reviewPath, 'utf8'));
  assert.equal(review.issue, ISSUE);
  assert.equal(review.publishedCount, 6);
  assert.equal(review.deferredCount, 2);

  const rawStr = JSON.stringify(review);
  for (const { slug } of EXPECTED_SLUGS) {
    assert.ok(rawStr.includes(slug), `Published slug ${slug} missing in review JSON`);
  }
  for (const defSlug of DEFERRED_SLUGS) {
    assert.ok(rawStr.includes(defSlug), `Deferred slug ${defSlug} missing in review JSON`);
  }
});
