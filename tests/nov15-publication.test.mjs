import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const ISSUE = '2026-11-15';
const LOCALES = ['zh-CN', 'zh-TW', 'en', 'ru', 'fr'];
const FORBIDDEN_SLUG = 'taiwan-national-day-maritime-tensions-2026-10-11';
const CJK_REGEX = /[\u3400-\u9fff]/;

const EXPECTED_AUTHOR_ROLES = {
  'zh-CN': '资料整理',
  'zh-TW': '資料整理',
  en: 'Source compilation',
  ru: 'Подготовка материалов',
  fr: 'Compilation des sources',
};

const EXPECTED_CAPTION_PREFIXES = {
  'zh-CN': 'AI生成概念示意图：',
  'zh-TW': 'AI生成概念示意圖：',
  en: 'AI-generated editorial illustration: ',
  ru: 'Иллюстрация, созданная ИИ: ',
  fr: "Illustration conceptuelle générée par l'IA : ",
};

const EXPECTED_SLUGS = [
  {
    slug: 'doe-genesis-orbit-water-energy-ai-grid-scaling-2026-11-15',
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
    slug: 'who-adult-type1-diabetes-guidelines-clinical-access-2026-11-15',
    category: 'innovation',
    expectedTags: {
      'zh-CN': ['产业创新', '公共政策', '欧盟'],
      'zh-TW': ['產業創新', '公共政策', '歐盟'],
      en: ['Industrial innovation', 'Public policy', 'European Union'],
      ru: ['Промышленные инновации', 'Государственная политика', 'Европейский союз'],
      fr: ['Innovation industrielle', 'Politiques publiques', 'Union européenne'],
    },
  },
  {
    slug: 'imf-asean-ai-capital-markets-us-third-party-bank-risk-2026-11-15',
    category: 'business',
    expectedTags: {
      'zh-CN': ['经济数据', '人工智能', '国际贸易'],
      'zh-TW': ['經濟數據', '人工智慧', '國際貿易'],
      en: ['Economic data', 'Artificial intelligence', 'International trade'],
      ru: ['Экономические данные', 'Искусственный интеллект', 'Международная торговля'],
      fr: ['Données économiques', 'Intelligence artificielle', 'Commerce international'],
    },
  },
  {
    slug: 'doe-genesis-subsurface-strategic-energy-science-challenges-2026-11-15',
    category: 'energy',
    expectedTags: {
      'zh-CN': ['新能源', '电网', '能源安全'],
      'zh-TW': ['新能源', '電網', '能源安全'],
      en: ['Renewable energy', 'Power grid', 'Energy security'],
      ru: ['Новая энергетика', 'Электросети', 'Энергетическая безопасность'],
      fr: ['Énergies renouvelables', 'Réseau électrique', 'Sécurité énergétique'],
    },
  },
  {
    slug: 'unfccc-cop31-midpoint-assessment-un-chief-climate-appeal-2026-11-15',
    category: 'current-affairs',
    expectedTags: {
      'zh-CN': ['国际局势', '公共政策', '新能源'],
      'zh-TW': ['國際局勢', '公共政策', '新能源'],
      en: ['International affairs', 'Public policy', 'Renewable energy'],
      ru: ['Международная обстановка', 'Государственная политика', 'Новая энергетика'],
      fr: ['Affaires internationales', 'Politiques publiques', 'Énergies renouvelables'],
    },
  },
  {
    slug: 'us-bls-october-ppi-wholesale-inflation-census-data-2026-11-15',
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
  'mot-coastal-marine-weather-bulletin-2026-11-15',
  'jpl-night-sky-star-quest-observing-event-2026-11-15',
];

function parseFrontmatterAndBody(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  assert.ok(match, 'Markdown file must start with YAML frontmatter block');
  const fmLines = match[1].split('\n');
  const fm = {};
  for (const line of fmLines) {
    const idx = line.indexOf(':');
    assert.ok(idx !== -1, `Invalid frontmatter line: ${line}`);
    const key = line.slice(0, idx).trim();
    const valRaw = line.slice(idx + 1).trim();
    fm[key] = JSON.parse(valRaw);
  }
  return { fm, body: match[2].trim() };
}

function extractUrls(text) {
  const matches = text.match(/https:\/\/[^\s)]+/g) || [];
  return [...new Set(matches)].sort();
}

test('2026-11-15 issue has 30 full five-locale articles with strict structural, URL, tag, CJK-clean, and length parity', () => {
  const provPath = path.join(ROOT, 'docs', 'news-media', ISSUE, 'provenance.json');
  assert.ok(fs.existsSync(provPath), 'Missing provenance.json');
  const provenance = JSON.parse(fs.readFileSync(provPath, 'utf8'));

  for (const { slug, category, expectedTags } of EXPECTED_SLUGS) {
    let baselineSectionCount = null;
    let baselineParagraphCount = null;
    let baselineFootnoteCount = null;
    let baselineUrlSet = null;

    const provEntry = provenance.assets.find((a) => a.slug === slug);
    assert.ok(provEntry, `Missing provenance asset for ${slug}`);

    for (const locale of LOCALES) {
      const mdPath = path.join(ROOT, 'content', 'issues', ISSUE, locale, `${slug}.md`);
      assert.ok(fs.existsSync(mdPath), `Missing article file: ${mdPath}`);
      const raw = fs.readFileSync(mdPath, 'utf8');
      assert.ok(!raw.includes(FORBIDDEN_SLUG), `Forbidden slug detected in ${mdPath}`);

      const { fm, body } = parseFrontmatterAndBody(raw);
      assert.equal(fm.slug, slug);
      assert.equal(fm.translationKey, slug);
      assert.equal(fm.issue, ISSUE);
      assert.equal(fm.lang, locale);
      assert.equal(fm.category, category);
      assert.equal(fm.author, '全球伯乐 News');
      assert.equal(fm.authorRole, EXPECTED_AUTHOR_ROLES[locale]);
      assert.equal(fm.date, ISSUE);
      assert.equal(fm.cover, `/news-media/${ISSUE}/${slug}-editorial.webp`);
      assert.equal(fm.readTime, 5);
      assert.equal(fm.draft, false);
      assert.equal(fm.publishedAt, undefined);
      assert.equal(fm.updatedAt, undefined);
      assert.deepEqual(fm.tags, expectedTags[locale], `Tag mismatch in ${mdPath}`);

      if (locale === 'en' || locale === 'ru' || locale === 'fr') {
        assert.ok(!CJK_REGEX.test(fm.title), `Residual CJK in ${locale} title of ${slug}`);
        assert.ok(!CJK_REGEX.test(fm.description), `Residual CJK in ${locale} description of ${slug}`);
        assert.ok(!CJK_REGEX.test(fm.authorRole), `Residual CJK in ${locale} authorRole of ${slug}`);
        assert.ok(!CJK_REGEX.test(fm.coverAlt), `Residual CJK in ${locale} coverAlt of ${slug}`);
        assert.ok(!fm.tags.some((t) => CJK_REGEX.test(t)), `Residual CJK in ${locale} tags of ${slug}`);
        assert.ok(!CJK_REGEX.test(body), `Residual CJK in ${locale} body/footnotes of ${slug}`);
      }

      const lines = body.split('\n');
      const headings = lines.filter((l) => l.startsWith('## '));
      assert.ok(headings.length >= 2, `Expected >= 2 ## headings in ${mdPath}`);

      const blocks = body
        .split(/\n\s*\n/)
        .map((b) => b.trim())
        .filter((b) => b.length > 0 && !b.startsWith('## ') && !b.startsWith('![') && !b.startsWith('[^'));

      // blocks[0] is lead, blocks[1] is AI disclosure caption, blocks[2..] are substantive body paragraphs
      assert.ok(blocks.length >= 6, `Expected lead + AI disclosure + >=4 body paragraphs in ${mdPath}`);

      const imgIndex = lines.findIndex((l) => l === `![${fm.coverAlt}](${fm.cover})`);
      assert.ok(imgIndex !== -1, `Missing exact cover image markdown in ${mdPath}`);
      const disclosureLine = lines.slice(imgIndex + 1).find((l) => l.trim().length > 0);
      assert.ok(
        disclosureLine && disclosureLine.startsWith(EXPECTED_CAPTION_PREFIXES[locale]),
        `AI caption missing required prefix "${EXPECTED_CAPTION_PREFIXES[locale]}" in ${mdPath}`
      );
      assert.equal(
        disclosureLine,
        provEntry.captions[locale],
        `AI caption in ${mdPath} must match provenance.json captions[${locale}] verbatim`
      );

      const proseText = blocks.filter((_, idx) => idx !== 1).join('\n');
      const inlineLinks = proseText.match(/\[[^\]]+\]\(https:\/\/[^)]+\)/g) || [];
      assert.ok(inlineLinks.length >= 2, `Expected >= 2 inline clickable https links in prose of ${mdPath}`);

      const footnotes = lines.filter((l) => /^\[\^\d+\]: \d{4}-\d{2}-\d{2} · \[.+\]\(https:\/\/.+\) · .+\.$/.test(l));
      assert.ok(footnotes.length >= 2, `Missing formatted primary-source footnotes in ${mdPath}`);

      const proseChars = blocks.filter((_, idx) => idx !== 1).join('').length;
      if (locale === 'zh-CN' || locale === 'zh-TW') {
        assert.ok(proseChars >= 550, `Chinese prose length (${proseChars}) < 550 in ${mdPath}`);
      } else {
        assert.ok(proseChars >= 1700, `${locale} prose length (${proseChars}) < 1700 in ${mdPath}`);
      }

      const urlSet = extractUrls(proseText + '\n' + footnotes.join('\n'));
      assert.ok(urlSet.length >= 2, `Expected >= 2 distinct https URLs in ${mdPath}`);

      if (baselineSectionCount === null) {
        baselineSectionCount = headings.length;
        baselineParagraphCount = blocks.length;
        baselineFootnoteCount = footnotes.length;
        baselineUrlSet = urlSet;
      } else {
        assert.equal(headings.length, baselineSectionCount, `Section count mismatch in ${locale}/${slug}`);
        assert.equal(blocks.length, baselineParagraphCount, `Paragraph count mismatch in ${locale}/${slug}`);
        assert.equal(footnotes.length, baselineFootnoteCount, `Footnote count mismatch in ${locale}/${slug}`);
        assert.deepEqual(urlSet, baselineUrlSet, `URL set mismatch in ${locale}/${slug}`);
      }
    }
  }
});

test('2026-11-15 WebP editorial illustrations strip metadata and match provenance SHA-256 hashes', () => {
  const provPath = path.join(ROOT, 'docs', 'news-media', ISSUE, 'provenance.json');
  const reviewMdPath = path.join(ROOT, 'docs', 'news-media', ISSUE, 'source-review.md');
  assert.ok(fs.existsSync(provPath), 'Missing provenance.json');
  assert.ok(fs.existsSync(reviewMdPath), 'Missing source-review.md');

  const provenance = JSON.parse(fs.readFileSync(provPath, 'utf8'));
  const reviewMd = fs.readFileSync(reviewMdPath, 'utf8');
  assert.equal(provenance.issue, ISSUE);
  assert.equal(provenance.sourceDocument.title, 'Globalbole_2026_11_15_Direct_Release_Package');

  const assets = provenance.assets || [];
  assert.equal(assets.length, 6, 'Expected 6 provenance entries');

  for (const { slug, category } of EXPECTED_SLUGS) {
    const entry = assets.find((a) => a.slug === slug);
    assert.ok(entry, `Missing provenance entry for ${slug}`);
    assert.equal(entry.category, category);
    assert.equal(entry.localPath, `/news-media/${ISSUE}/${slug}-editorial.webp`);
    assert.equal(entry.publicPath, `/news-media/${ISSUE}/${slug}-editorial.webp`);
    assert.equal(entry.fileName, `${slug}-editorial.webp`);
    assert.equal(entry.kind, 'ai_generated_editorial_illustration');
    assert.equal(entry.generationTool, 'OpenAI image_gen');
    assert.equal(entry.format, 'webp');
    assert.equal(entry.metadataStripped, true);
    assert.equal(entry.disclosureRequired, true);
    assert.equal(entry.caption, entry.captions['zh-CN']);
    assert.ok(typeof entry.prompt === 'string' && entry.prompt.length > 50);
    assert.ok(typeof entry.rightsBasis === 'string' && entry.rightsBasis.length > 20);
    assert.ok(Array.isArray(entry.primarySources) && entry.primarySources.length >= 2);

    const webpPath = path.join(ROOT, 'public', 'news-media', ISSUE, `${slug}-editorial.webp`);
    assert.ok(fs.existsSync(webpPath), `Missing WebP file: ${webpPath}`);
    const buf = fs.readFileSync(webpPath);
    assert.equal(buf.length, entry.bytes, `Byte size mismatch for ${slug}`);
    assert.equal(buf.subarray(0, 4).toString('ascii'), 'RIFF');
    assert.equal(buf.subarray(8, 12).toString('ascii'), 'WEBP');
    assert.ok(!buf.includes(Buffer.from('EXIF')), `EXIF chunk present in ${webpPath}`);
    assert.ok(!buf.includes(Buffer.from('IPTC')), `IPTC chunk present in ${webpPath}`);
    assert.ok(!buf.includes(Buffer.from('XMP ')), `XMP chunk present in ${webpPath}`);
    assert.ok(!buf.includes(Buffer.from('ICCP')), `ICCP chunk present in ${webpPath}`);

    const actualSha = crypto.createHash('sha256').update(buf).digest('hex');
    assert.equal(actualSha, entry.sha256, `SHA-256 mismatch for ${slug}`);
    assert.ok(reviewMd.includes(slug) && reviewMd.includes(actualSha), `source-review.md missing ${slug} hash`);
  }
});

test('2026-11-15 publication review records 6 published slugs and 2 deferred candidates', () => {
  const reviewPath = path.join(ROOT, 'docs', `news-publication-review-${ISSUE}.json`);
  assert.ok(fs.existsSync(reviewPath), 'Missing news-publication-review-2026-11-15.json');
  const review = JSON.parse(fs.readFileSync(reviewPath, 'utf8'));
  assert.equal(review.issue, ISSUE);
  assert.equal(review.screenedCandidates, 8);
  assert.equal(review.publishedCount, 6);
  assert.equal(review.deferredCount, 2);
  assert.equal(review.published.length, 6);
  assert.equal(review.deferred.length, 2);

  const rawStr = JSON.stringify(review);
  for (const { slug } of EXPECTED_SLUGS) {
    assert.ok(rawStr.includes(slug), `Published slug ${slug} missing in review JSON`);
  }
  for (const defSlug of DEFERRED_SLUGS) {
    assert.ok(rawStr.includes(defSlug), `Deferred slug ${defSlug} missing in review JSON`);
  }
});
