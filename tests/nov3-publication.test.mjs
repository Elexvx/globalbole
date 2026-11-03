import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync, readdirSync, existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
import matter from 'gray-matter';
import {unified} from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';

const issue = '2026-11-03';
const languages = ['zh-CN', 'zh-TW', 'en', 'ru', 'fr'];
const keys = ['openai-grid-protectors-program-2026-11-03', 'us-october-ism-manufacturing-pmi-2026-11-03'];
const categories = ['energy', 'business'];
const finalMedia = {
  '/news-media/2026-10-23/datacenter.jpg': '09efdb226cc94e9ffcf1a0b464e1c67deda677d9837596e5841948c47ec82c06',
  '/news-media/2026-10-17/ford-kansas-assembly.jpg': '3991aac06a37fe8218e55944a3cae1987a7e3a50f86385b6910b40ef308cea43',
};
const archival = {'zh-CN': /资料/, 'zh-TW': /資料/, en: /archiv/i, fr: /archives/i, ru: /архив/i};
const notCurrent = {'zh-CN': /并非|不是|不代表|非本|不作为/, 'zh-TW': /並非|不是|不代表|非本|不作為/, en: /not |does not/i, fr: /ne .*pas|ni |non /i, ru: /не /i};
const sourceURLs = [
  ['https://openai.com/index/grid-protectors-program/',
    'https://www.georgiapower.com/news-hub/press-releases/georgia-power-to-serve-openai-project-in-effingham-county.html',
    'https://www.georgiapower.com/news-hub/press-releases/contract-openai-approved-part-portfolio-delivering-950-million-annual-savings.html'],
  ['https://www.ismworld.org/supply-management-news-and-reports/reports/ism-pmi-reports/pmi/october/',
    'https://www.prnewswire.com/news-releases/manufacturing-pmi-at-55-5-october-2026-ism-manufacturing-pmi-report-302925617.html'],
];
const read = file => readFileSync(file, 'utf8');
const digest = bytes => createHash('sha256').update(bytes).digest('hex');
const walk = directory => readdirSync(directory, {withFileTypes:true}).flatMap(entry => entry.isDirectory() ? walk(`${directory}/${entry.name}`) : [`${directory}/${entry.name}`]);
const parse = markdown => unified().use(remarkParse).use(remarkGfm).parse(markdown);
const nodes = n => [n, ...(n.children || []).flatMap(nodes)];
const text = n => ['image', 'footnoteReference'].includes(n.type) ? '' : n.value ?? (n.children || []).map(text).join('');
const normalize = value => value.normalize('NFKC').replace(/\s+/g, ' ').trim();
const inventory = walk('content/issues').filter(file => file.endsWith('.md')).sort().map(file => {
  const {data, content} = matter(read(file));
  return {...data, source:file, markdown:content.trim(), ast:parse(content.trim())};
});
const rows = inventory.filter(a => a.issue === issue && !a.draft);
const notes = a => a.ast.children.filter(n => n.type === 'footnoteDefinition');
const urlCounts = ns => Object.fromEntries([...new Set(ns.filter(n => n.type === 'link').map(n => n.url))].sort().map(url => [url, ns.filter(n => n.type === 'link' && n.url === url).length]));
const prose = a => a.ast.children.filter((n, i, siblings) => n.type === 'paragraph' && !nodes(n).some(x => x.type === 'image') && !(i > 0 && nodes(siblings[i - 1]).some(x => x.type === 'image')));
const privateMarkers = /genui|Sentinel_|\/workspace\/|chatgpt\.com\/c\/|turn\d+(?:view|search)|本站整理日期|判断口径|伯乐判断|\ue200|\ue201|\ue202/;
const disclosure = {'zh-CN': /AI\s*生成示意图/, 'zh-TW': /AI\s*生成示意圖/, en: /AI-generated illustration/i, fr: /illustration.*(?:IA|intelligence artificielle)/i, ru: /иллюстраци[яию].*(?:ИИ|искусственн)/i};

test('November3 publishes two complete subjects, five editions each, with date-only metadata', () => {
  assert.equal(rows.length, 10);
  assert.deepEqual([...new Set(rows.map(a => a.translationKey))].sort(), [...keys].sort());
  for (const [index, key] of keys.entries()) {
    const editions = rows.filter(a => a.translationKey === key);
    assert.deepEqual(editions.map(a => a.lang).sort(), [...languages].sort());
    assert.equal(new Set(editions.map(a => a.cover)).size, 1, `${key}: shared cover`);
    assert.equal(new Set(editions.map(a => a.slug)).size, 1, `${key}: stable slug`);
    for (const a of editions) {
      assert.equal(a.category, categories[index]);
      assert.equal(a.date, issue);
      assert.equal(a.publishedAt, undefined, `${a.source}: do not invent a publication time`);
      assert.equal(a.updatedAt, undefined);
      assert.equal(a.draft, false);
      assert.equal(a.slug, key);
      assert.ok(a.title && a.description && a.author && a.authorRole && a.coverAlt);
      assert.ok(a.tags.length >= 2);
      assert.equal(a.source, `content/issues/${issue}/${a.lang}/${key}.md`);
    }
  }
  const log = JSON.parse(read('docs/news-publication-log.json'));
  const batches = log.batches.filter(batch => batch.issue === issue);
  assert.equal(batches.length, 1);
  assert.equal(batches[0].publicationDate, issue);
  assert.deepEqual([...batches[0].languages].sort(), [...languages].sort());
  assert.deepEqual(batches[0].articles.map(a => a.translationKey).sort(), [...keys].sort());
  for (const entry of batches[0].articles) {
    assert.equal(entry.eventDate, '2026-11-02');
    const index = keys.indexOf(entry.translationKey);
    for (const url of sourceURLs[index]) assert.ok(entry.sources.some(s => s.url === url), `${entry.translationKey}: log source ${url}`);
  }
});

test('November3 retains four substantive paragraphs, two sections and visible, complete source notes', () => {
  for (const a of rows) {
    const ns = nodes(a.ast), definitions = notes(a), refs = ns.filter(n => n.type === 'footnoteReference');
    const paragraphs = prose(a);
    const threshold = a.lang.startsWith('zh') ? 100 : 240;
    assert.ok(paragraphs.filter(p => normalize(text(p)).length >= threshold).length >= 4, `${a.source}: four substantial reporting/analysis paragraphs, excluding captions and notes`);
    assert.ok(paragraphs.reduce((length, p) => length + normalize(text(p)).length, 0) >= (a.lang.startsWith('zh') ? 600 : 1800), `${a.source}: full edition, not a brief`);
    assert.equal(new Set(paragraphs.map(p => normalize(text(p)))).size, paragraphs.length, `${a.source}: no duplicate prose padding`);
    assert.equal(a.ast.children.filter(n => n.type === 'heading' && n.depth === 2).length, 2, `${a.source}: two substantive sections`);
    assert.ok(ns.some(n => n.type === 'strong'), `${a.source}: retained editorial emphasis`);
    assert.doesNotMatch(a.markdown, privateMarkers);
    for (const heading of ns.filter(n => n.type === 'heading')) assert.doesNotMatch(text(heading), /来源|來源|source notes|notes et sources|источники/i, `${a.source}: the renderer provides its own footnote heading`);
    assert.equal(ns.filter(n => n.type === 'html').length, 0, `${a.source}: no raw HTML citations or hidden text`);
    const defined = definitions.map(n => n.identifier), referenced = refs.map(n => n.identifier);
    assert.equal(new Set(defined).size, defined.length, `${a.source}: unique note definitions`);
    assert.deepEqual([...new Set(defined)].sort(), [...new Set(referenced)].sort(), `${a.source}: every source note is referenced and every reference defined`);
    const expected = sourceURLs[keys.indexOf(a.translationKey)];
    const links = definitions.flatMap(nodes).filter(n => n.type === 'link');
    for (const url of expected) assert.equal(links.filter(n => n.url === url).length, 1, `${a.source}: one complete original source ${url}`);
    for (const definition of definitions) {
      assert.match(text(definition), /2026/);
      assert.ok(nodes(definition).some(n => n.type === 'link' && normalize(text(n)).length >= 8), `${a.source}: titled source note`);
    }
    for (const link of ns.filter(n => n.type === 'link')) {
      assert.match(link.url, /^https:\/\//);
      assert.doesNotMatch(link.url, /[）；。]$/);
    }
  }
  for (const key of keys) {
    const editions = rows.filter(a => a.translationKey === key);
    const expectedURLs = urlCounts(nodes(editions.find(a => a.lang === 'zh-CN').ast));
    const expectedRefCounts = notes(editions[0]).map(n => [n.identifier, nodes(editions[0].ast).filter(x => x.type === 'footnoteReference' && x.identifier === n.identifier).length]);
    for (const a of editions) {
      assert.deepEqual(urlCounts(nodes(a.ast)), expectedURLs, `${a.source}: source and license link multiplicity aligned`);
      assert.deepEqual(notes(a).map(n => [n.identifier, nodes(a.ast).filter(x => x.type === 'footnoteReference' && x.identifier === n.identifier).length]), expectedRefCounts, `${a.source}: source references aligned`);
    }
  }
});

const qualifiers = {
  'zh-CN': {grid: [/最高|上限/, /组合/, /预测|预计/, /并非|不是|不等于|仍在|仍属/], pmi: [/扩散指数/, /交货.*(?:变慢|放缓)|交货.*慢/, /不是|不能|不等于/, /GDP/, /岗位|人数/]},
  'zh-TW': {grid: [/最高|上限/, /組合/, /預測|預計/, /並非|不是|不等於|仍在|仍屬/], pmi: [/擴散指數/, /交貨.*(?:變慢|放緩)|交貨.*慢/, /不是|不能|不等於/, /GDP/, /職位|崗位|人數/]},
  en: {grid: [/up to|maximum|ceiling/i, /portfolio/i, /forecast|project|expect/i, /not|remain|still/i], pmi: [/diffusion index|diffusion indices|diffusion indexes/i, /slower|slowdown|slowing/i, /not|cannot/i, /GDP/, /jobs|headcount|employment count/i]},
  fr: {grid: [/jusqu[’']à|maximum|plafond/i, /portefeuille/i, /prévi|prévoi|projete|projeté|estime/i, /pas|ne constitue|reste/i], pmi: [/diffusion|indices ne mesurent directement ni/i, /ralenti|plus lent/i, /pas|ne mesure|ne permet/i, /PIB|GDP/, /emplois|effectifs|postes|embauches/i]},
  ru: {grid: [/до|максим|предел/i, /портфел/i, /прогноз|ожида|рассчит/i, /не |оста[её]т/i], pmi: [/диффузион/i, /замедл|медлен/i, /не |нельзя/i, /ВВП|GDP/, /рабочих мест|занятых|численност/i]},
};
test('November3 numerical facts and factual qualifiers survive every translation', () => {
  for (const a of rows) {
    const body = prose(a).map(text).join('\n');
    const normalized = body.replace(/(?<=\d)[\s\u00a0\u202f](?=\d{3}(?:\D|$))/g, '').replace(/,/g, '.');
    const isGrid = a.translationKey === keys[0];
    const figures = isGrid ? ['25', '2029', '15'] : ['55.5', '54.5', '1.0', '59.0', '52.4', '59.1', '51.4', '2.3', '2021', '0.2', '52.7', '77.9', '75.2'];
    for (const figure of figures) assert.ok(normalized.includes(figure), `${a.source}: ${figure} in reporting prose, not just notes`);
    if (isGrid) {
      for (const variants of [['3200', '3.200'], ['1000', '1.000'], ['9.5', '950', '0.95']]) assert.ok(variants.some(n => normalized.includes(n)), `${a.source}: retained amount ${variants.join('/')}`);
      assert.match(body, /Georgia Power/);
    }
    for (const pattern of qualifiers[a.lang][isGrid ? 'grid' : 'pmi']) assert.match(`${a.description}\n${body}`, pattern, `${a.source}: scope/interpretation qualifier ${pattern}`);
  }
});

test('November3 media have inspected file hashes, full localized credits and cover/body reuse', () => {
  const p = JSON.parse(read(`docs/news-media/${issue}/provenance.json`));
  assert.equal(p.assets.length, 2);
  assert.deepEqual(p.assets.map(asset => asset.localPath).sort(), Object.keys(finalMedia).sort());
  assert.equal(new Set(p.assets.map(asset => asset.localPath)).size, p.assets.length);
  const referencedImages = new Set(rows.flatMap(a => nodes(a.ast).filter(n => n.type === 'image').map(n => n.url)));
  assert.deepEqual([...referencedImages].sort(), p.assets.map(asset => asset.localPath).sort(), 'no unexplained extra or missing issue assets');
  for (const asset of p.assets) {
    assert.equal(asset.sha256, finalMedia[asset.localPath], 'reuse the exact accepted original without changing historical media');
    assert.notEqual(asset.aiGenerated, true);
    assert.equal(asset.eventEvidence, false);
    assert.ok(existsSync(`public${asset.localPath}`));
    assert.equal(digest(readFileSync(`public${asset.localPath}`)), asset.sha256);
    assert.equal(asset.pixelsInspected, true);
    assert.equal(asset.fullyDecoded, true);
    assert.ok(asset.width > 0 && asset.height > 0);
    assert.ok(asset.privacySanitization, `${asset.localPath}: metadata inspection record`);
    assert.ok(asset.rightsBasis, `${asset.localPath}: rights basis, not attribution alone`);
  }
  for (const a of rows) {
    const images = nodes(a.ast).filter(n => n.type === 'image');
    assert.equal(a.cover, Object.keys(finalMedia)[keys.indexOf(a.translationKey)], `${a.source}: selected subject-specific archival photo`);
    assert.equal(images.filter(n => n.url === a.cover).length, 1, `${a.source}: exact cover reused once in body`);
    for (const image of images) {
      const asset = p.assets.find(x => x.localPath === image.url);
      assert.ok(asset, `${a.source}: image provenance`);
      assert.ok(asset.captions?.[a.lang], `${a.source}: localized full caption`);
      assert.match(asset.captions[a.lang], archival[a.lang], `${a.source}: archival disclosure`);
      assert.match(asset.captions[a.lang], notCurrent[a.lang], `${a.source}: not the current event`);
      assert.match(a.coverAlt, archival[a.lang], `${a.source}: archival cover alt`);
      const captionText = normalize(text(parse(asset.captions[a.lang])));
      assert.ok(a.ast.children.some(n => n.type === 'paragraph' && normalize(text(n)) === captionText), `${a.source}: complete visible credit`);
      if (image.url === a.cover) assert.equal(a.coverAlt, asset.coverAlt?.[a.lang]);
      if (asset.aiGenerated) {
        assert.match(a.coverAlt, disclosure[a.lang]);
        assert.match(asset.captions[a.lang], disclosure[a.lang]);
        assert.equal(asset.eventEvidence, false);
      } else {
        const work = asset.workPage || asset.rightsEvidenceURL;
        const license = asset.licenseUrl || asset.licenseURL;
        assert.match(work, /^https:\/\//);
        assert.match(license, /^https:\/\//);
        const captionLinks = nodes(parse(asset.captions[a.lang])).filter(n => n.type === 'link').map(n => n.url);
        assert.ok(captionLinks.includes(work) && captionLinks.includes(license), `${a.source}: visible work and license links`);
      }
    }
  }
});

test('November3 preserves all 585 earlier editions and the withdrawal, without a November2 issue', () => {
  const historical = inventory.filter(a => a.issue < issue);
  assert.equal(historical.length, 585);
  assert.equal(new Set(historical.map(a => a.translationKey)).size, 117);
  const fingerprint = historical.map(a => `${a.source}\0${digest(readFileSync(a.source))}\n`).join('');
  assert.equal(digest(fingerprint), 'da4d97aba2d603ba2b25fc96780d422ba331bde5da7c306df039fe97786dd1c8', 'baseline 1877d713: no previous article edits or missing editions');
  const throughIssue = inventory.filter(a => a.issue <= issue && !a.draft);
  assert.equal(throughIssue.length, 595);
  assert.equal(new Set(throughIssue.map(a => a.translationKey)).size, 119);
  assert.ok(!inventory.some(a => a.issue === '2026-11-02'));
  assert.equal(existsSync('content/issues/2026-11-02'), false);
  const log = JSON.parse(read('docs/news-publication-log.json'));
  assert.ok(!log.batches.some(batch => batch.issue === '2026-11-02'));
  const withdrawn = log.batches.flatMap(batch => batch.articles).filter(a => a.status === 'withdrawn');
  assert.ok(withdrawn.length > 0);
  for (const entry of withdrawn) {
    assert.equal(entry.republish, false);
    assert.equal(entry.withdrawalScope, 'all-language-editions');
    assert.ok(!inventory.some(a => a.translationKey === entry.translationKey));
    for (const media of entry.withdrawnMedia || []) assert.equal(existsSync(`public${media}`), false);
  }
});
