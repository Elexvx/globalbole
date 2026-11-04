import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync, readdirSync, existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
import matter from 'gray-matter';
import {unified} from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import sharp from 'sharp';

const issue = '2026-11-04';
const languages = ['zh-CN', 'zh-TW', 'en', 'ru', 'fr'];
const keys = ['us-september-jolts-2026-11-04', 'openai-physical-engineering-prototypes-2026-11-04', 'lg-energy-storage-orders-capacity-2026-11-04', 'camillus-solar-operating-permission-2026-11-04', 'crowdstrike-ai-kill-switch-2026-11-04'];
const categories = ['work-life', 'innovation', 'energy', 'energy', 'technology'];
const approvedMedia = {
  "/news-media/2026-11-04/first-source-job-fair-2014-mscala.jpg": "88760f17fe932ea10a5f4137745b9b77dd4be5569e85907048e6ee3309f0513c",
  "/news-media/2026-11-04/printed-circuit-boards-2024-img4512.jpg": "f983aae6b4bf69721fa01cdf1792cafc0b393b8ffc7c93edfa97bc41dbb61bc4",
  "/news-media/2026-11-04/stanton-battery-storage-2024-chiocciola.jpg": "e171b6f5fcff072c4d92520893be0c2e57b5ab815b4420f972ee249b67e07a20",
  "/news-media/2026-11-04/reid-gardner-bess-2025-chiocciola.jpg": "a59a0abfe681f15b60d1fc943e7f1a24a3369a45e25ac0ddd669e2f1aa56d261",
  "/news-media/2026-11-04/eichelbuck-landfill-solar-2019-schwarzkopf.jpg": "6b6c04ba9617e0fe7517524d25418acbb7fbfb29dc1e8ffcd33342268cf71950",
  "/news-media/2026-11-04/air-force-cyber-operations-2018-biermann.jpg": "92bc67d2c1087542c22adce0a3602d78cbb9f4775fb9c9e15057fc2ce52d140d"
};
const approvedOptimizerAddition = "  // November 4: reviewed full-frame equipment, circuitry, faces and solar-panel detail.\n  \"/news-media/2026-11-04/reid-gardner-bess-2025-chiocciola.jpg\": 59,\n  \"/news-media/2026-11-04/printed-circuit-boards-2024-img4512.jpg\": 61,\n  \"/news-media/2026-11-04/first-source-job-fair-2014-mscala.jpg\": 62,\n  \"/news-media/2026-11-04/eichelbuck-landfill-solar-2019-schwarzkopf.jpg\": 61,\n";
const historicalTestMaintenance = {
  "tests/oct31-publication.test.mjs": {
    "before": "test('October31 preserves all five accepted image-cache repair files byte-for-byte',()=>{for(const [file,sha]of Object.entries(repairBaseline))assert.equal(hash(file),sha,file);});\n",
    "after": "// Only the reviewed November 4 exact-path quality entries may extend this repair baseline.\nconst approvedNov4AvifAddition = \"  // November 4: reviewed full-frame equipment, circuitry, faces and solar-panel detail.\\n  \\\"/news-media/2026-11-04/reid-gardner-bess-2025-chiocciola.jpg\\\": 59,\\n  \\\"/news-media/2026-11-04/printed-circuit-boards-2024-img4512.jpg\\\": 61,\\n  \\\"/news-media/2026-11-04/first-source-job-fair-2014-mscala.jpg\\\": 62,\\n  \\\"/news-media/2026-11-04/eichelbuck-landfill-solar-2019-schwarzkopf.jpg\\\": 61,\\n\";\nfunction acceptedRepairHash(file) {\n  if (file !== 'scripts/optimize-images.mjs') return hash(file);\n  const current = read(file);\n  assert.equal(current.split(approvedNov4AvifAddition).length, 2, 'approved November 4 quality block occurs exactly once');\n  assert.ok(current.includes('const photoAvifQuality = {\\n' + approvedNov4AvifAddition), 'approved entries remain inside the per-photo map');\n  return createHash('sha256').update(current.replace(approvedNov4AvifAddition, '')).digest('hex');\n}\ntest('October31 preserves all five accepted image-cache repair files byte-for-byte',()=>{for(const [file,sha]of Object.entries(repairBaseline))assert.equal(acceptedRepairHash(file),sha,file);});\n"
  },
  "tests/nov1-publication.test.mjs": {
    "before": "test('November1 preserves all five accepted cache repair files byte for byte',()=>{for(const [file,sha]of Object.entries(repairBaseline))assert.equal(hash(file),sha,file);});\n",
    "after": "// Only the reviewed November 4 exact-path quality entries may extend this repair baseline.\nconst approvedNov4AvifAddition = \"  // November 4: reviewed full-frame equipment, circuitry, faces and solar-panel detail.\\n  \\\"/news-media/2026-11-04/reid-gardner-bess-2025-chiocciola.jpg\\\": 59,\\n  \\\"/news-media/2026-11-04/printed-circuit-boards-2024-img4512.jpg\\\": 61,\\n  \\\"/news-media/2026-11-04/first-source-job-fair-2014-mscala.jpg\\\": 62,\\n  \\\"/news-media/2026-11-04/eichelbuck-landfill-solar-2019-schwarzkopf.jpg\\\": 61,\\n\";\nfunction acceptedRepairHash(file) {\n  if (file !== 'scripts/optimize-images.mjs') return hash(file);\n  const current = read(file);\n  assert.equal(current.split(approvedNov4AvifAddition).length, 2, 'approved November 4 quality block occurs exactly once');\n  assert.ok(current.includes('const photoAvifQuality = {\\n' + approvedNov4AvifAddition), 'approved entries remain inside the per-photo map');\n  return createHash('sha256').update(current.replace(approvedNov4AvifAddition, '')).digest('hex');\n}\ntest('November1 preserves all five accepted cache repair files byte for byte',()=>{for(const [file,sha]of Object.entries(repairBaseline))assert.equal(acceptedRepairHash(file),sha,file);});\n"
  }
};
const priorBatchIDs = ["2026-10-03-zh-CN", "2026-10-04-zh-CN", "2026-10-05-zh-CN", "2026-10-06-zh-CN", "2026-10-09-zh-CN", "2026-10-10-zh-CN", "2026-10-11-zh-CN", "2026-10-12-zh-CN", "2026-10-14-zh-CN", "2026-10-15-zh-CN", "2026-10-16-zh-CN", "2026-10-17-zh-CN", "2026-10-18-zh-CN", "2026-10-19-zh-CN", "2026-10-20-zh-CN", "2026-10-22-zh-CN", "2026-10-23-zh-CN", "2026-10-24-zh-CN", "2026-10-25-zh-CN", "2026-10-26-zh-CN", "2026-10-28-zh-CN", "2026-10-29-zh-CN", "2026-10-30-zh-CN", "2026-10-31-zh-CN", "2026-11-01-zh-CN", "2026-11-03-zh-CN"];
const archival = {'zh-CN': /资料/, 'zh-TW': /資料/, en: /archiv/i, fr: /archives/i, ru: /архив/i};
const notCurrent = {'zh-CN': /并非|不是|不代表|非本|不作为/, 'zh-TW': /並非|不是|不代表|非本|不作為/, en: /not |does not/i, fr: /ne .*pas|ni |non /i, ru: /не /i};
const sourceURLs = [
  ['https://www.bls.gov/news.release/jolts.htm'],
  ['https://openai.com/index/accelerating-engineering-for-the-physical-world/'],
  ['https://www.lgcorp.com/media/release/30742', 'https://lg.co.kr/media/release/30650'],
  ['https://www.prnewswire.com/news-releases/powerbank-secures-permission-to-operate-for-3-26-mw-new-york-solar-project-valued-at-us7-3-million-302927417.html', 'https://powerbankcorp.com/7-3-million-usd-transaction-entered-into-with-solar-advocate-development-llc-for-the-sale-and-construction-of-the-camillus-solar-project/'],
  ['https://www.crowdstrike.com/en-us/press-releases/crowdstrike-delivers-ai-security-safety-for-the-enterprise/', 'https://www.crowdstrike.com/en-us/blog/crowdstrike-introduces-ai-kill-switch/'],
];
const read = file => readFileSync(file, 'utf8');
const digest = bytes => createHash('sha256').update(bytes).digest('hex');
function originalProtectedBytes(file) {
  const patch = historicalTestMaintenance[file];
  if (!patch) return readFileSync(file);
  const current = read(file);
  assert.equal(current.split(patch.after).length, 2, `${file}: exact approved historical-test maintenance only`);
  return current.replace(patch.after, patch.before);
}

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

test('November4 publishes five complete subjects, five editions each, with date-only metadata', () => {
  assert.equal(rows.length, 25);
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
      assert.equal(a.readTime, 5, `${a.source}: consistent full-edition reading time`);
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
    assert.equal(entry.eventDate, '2026-11-03');
    const index = keys.indexOf(entry.translationKey);
    for (const url of sourceURLs[index]) assert.ok(entry.sources.some(s => s.url === url), `${entry.translationKey}: log source ${url}`);
  }
});

test('November4 retains four substantive paragraphs, two sections and visible, complete source notes', () => {
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
    for (const url of expected) {
      assert.equal(links.filter(n => n.url === url).length, 1, `${a.source}: one complete original source ${url}`);
      const sourceDate = url.includes('30650') ? '2026-10-08' : url.includes('7-3-million-usd-transaction') ? '2025-03-19' : '2026-11-03';
      const definition = definitions.find(n => nodes(n).some(x => x.type === 'link' && x.url === url));
      assert.ok(text(definition).includes(sourceDate), `${a.source}: original release date ${sourceDate}`);
    }
    for (const definition of definitions) {
      assert.match(text(definition), /20\d{2}-\d{2}-\d{2}/, `${a.source}: source publication date`);
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
  'zh-CN': [ [/9月|9 月|九月/, /8月|8 月|八月/, /月末|最后一个营业日/, /修订/, /不能|不等于/], [/2月|2 月|二月/, /原型/, /制造|制造商/, /不是|不等于|并不/, /使用量/], [/表后/, /2027/, /计划|目标/, /未披露/, /10月|10 月/, /此前|后续|初步/], [/直流/, /许可/, /融资/, /2025/, /实际发电|发电量/, /并非|不是|不等于/], [/网关/, /Windows/, /Mac/, /早期访问/, /未来|后续|将来/, /意向|拟收购|计划收购/, /不等于|不能|并非|不代表/] ],
  'zh-TW': [ [/9月|9 月|九月/, /8月|8 月|八月/, /月末|最後一個營業日/, /修訂/, /不能|不等於/], [/2月|2 月|二月/, /原型/, /製造|製造商/, /不是|不等於|並不|不代表/, /使用量/], [/表後/, /2027/, /計畫|計劃|目標/, /未披露|未公布/, /10月|10 月/, /此前|後續|初步/], [/直流/, /許可/, /融資/, /2025/, /實際發電|發電量/, /並非|不是|不等於/], [/閘道|網關/, /Windows/, /Mac/, /早期存取|早期訪問|早期存取階段/, /未來|後續|將來/, /意向|擬收購|計畫收購/, /不等於|不能|並非|不代表/] ],
  en: [ [/September/i, /August/i, /last business day|end.of.month|month.end/i, /revis/i, /cannot|not /i], [/February/i, /prototype/i, /manufactur/i, /not /i, /usage|use|token/i], [/behind.the.meter/i, /2027/, /plan|target/i, /undisclosed|not disclose|did not disclose|not been disclosed|did not identify/i, /October/i, /earlier|follow.up|preliminary/i], [/DC|direct.current/, /permission/i, /financing/i, /2025/, /generation|output/i, /not /i], [/gateway/i, /Windows/, /Mac/, /early.access/i, /future|planned|later|forthcoming/i, /intent|intention|plan.*acquir/i, /not /i] ],
  fr: [ [/septembre/i, /août/i, /dernier jour ouvr|fin du mois/i, /révis/i, /pas|ne .*ni/i], [/février/i, /prototype/i, /fabrication|fabricant/i, /pas|ne .*ni/i, /utilisation|usage|token/i], [/derrière le compteur|en aval du compteur/i, /2027/, /prévoit|prévu|objectif|plan/i, /pas.*(?:nom|montant|volume)|non divul|non communiqué|n’a pas.*(?:nom|montant|volume)|ni.*montant|ne.*(?:précis|divul|communiqu)/i, /octobre/i, /antérieur|suivi|préliminaire/i], [/courant continu|DC/, /autorisation/i, /financement/i, /2025/, /production|électricité/i, /pas|ne .*ni/i], [/passerelle/i, /Windows/, /Mac/, /accès anticipé/i, /futur|ultérieur|venir|prévu/i, /intention|projet.*acquisition|envisag/i, /pas|ne .*ni/i] ],
  ru: [ [/сентябр/i, /август/i, /последн.*рабоч|конец месяца/i, /пересмотр|уточн/i, /не |нельзя/i], [/феврал/i, /прототип/i, /производ|изготов/i, /не /i, /использован|токен/i], [/за счетчик|за счётчик|после счетчик|после счётчик/i, /2027/, /план|цел/i, /не раскр|не назв|не сообщ/i, /октябр/i, /раньше|ранее|предваритель|продолж/i], [/постоянн.*ток|DC/, /разрешен|разрешён/i, /финансир/i, /2025/, /выработ|генерац|электроэнерг/i, /не /i], [/шлюз/i, /Windows/, /Mac/, /ранн.*доступ/i, /будущ|планир|впоследствии/i, /намерен|план.*приобр/i, /не /i] ],
};
const figureGroups = [
  [['750','7.5'], ['4.5'], ['540','5.4'], ['530','5.3'], ['340','3.4'], ['160','1.6'], ['11.1','111000','111'], ['720','7.2'], ['10.4','104000','104'], ['15.8','158000','158'], ['19.7','197000','197'], ['7','70000','70']],
  [['23'], ['0.875'], ['0.594'], ['2.0']],
  [['2027'], ['70'], ['9.6434','9643.4'], ['7560','756'], ['9.6','9600'], ['4169','416.9']],
  [['3.26'], ['730','7.3'], ['2025']],
  [],
];
test('November4 retains numerical facts, data periods, novelty and scope qualifiers in every edition', () => {
  for (const a of rows) {
    const body = prose(a).map(text).join('\n');
    const noGrouping = body.replace(/(?<=\d)[\s\u00a0\u202f](?=\d)/g, '');
    const normalized = ['fr', 'ru'].includes(a.lang) ? noGrouping.replace(/,/g, '.') : noGrouping.replace(/,(?=\d{3}(?:\D|$))/g, '');
    const quantities = new Set(normalized.match(/\d+(?:\.\d+)?/g));
    const index = keys.indexOf(a.translationKey);
    for (const variants of figureGroups[index]) assert.ok(variants.some(n => quantities.has(n)), `${a.source}: retained factual quantity ${variants.join('/')}`);
    for (const pattern of qualifiers[a.lang][index]) assert.match(`${a.description}\n${body}`, pattern, `${a.source}: retained factual qualifier ${pattern}`);
    if (index === 1) {
      assert.match(body, /BenchCAD/);
      assert.match(body, /Chip Ganassi Racing/);
      assert.doesNotMatch(body, /(?:增长|增長)\s*(?:\*\*)?23\s*(?:\*\*)?\s*倍/, `${a.source}: usage reached 23 times February, not increased by 23 times`);
    }
    if (index === 2) assert.match(body, /DSX Ready BESS/);
    if (index === 3) {
      assert.match(body, /Solar Simplified/);
      assert.match(body, /Solar Advocate Development LLC/);
    }
    if (index === 4) assert.match(body, /Fiddler AI/);
  }
});

test('November4 media have inspected file hashes, full localized credits and cover/body reuse', async () => {
  const p = JSON.parse(read(`docs/news-media/${issue}/provenance.json`));
  assert.deepEqual(p.assets.map(asset => asset.localPath).sort(), Object.keys(approvedMedia).sort(), 'the six reviewed real photographs');
  assert.doesNotMatch(JSON.stringify(p), privateMarkers);
  for (const file of walk(`docs/news-media/${issue}`)) assert.doesNotMatch(read(file), privateMarkers, `${file}: no private handoff markers or filesystem paths`);
  assert.equal(new Set(p.assets.map(asset => asset.localPath)).size, p.assets.length);
  const referencedImages = new Set(rows.flatMap(a => nodes(a.ast).filter(n => n.type === 'image').map(n => n.url)));
  assert.deepEqual([...referencedImages].sort(), p.assets.map(asset => asset.localPath).sort(), 'no unexplained extra or missing issue assets');
  for (const asset of p.assets) {
    assert.equal(asset.sha256, approvedMedia[asset.localPath], 'exact reviewed image bytes');
    assert.ok(asset.localPath.startsWith(`/news-media/${issue}/`), 'new issue media are isolated from historical media');
    assert.notEqual(asset.aiGenerated, true);
    assert.equal(asset.eventEvidence, false);
    assert.ok(existsSync(`public${asset.localPath}`));
    assert.equal(digest(readFileSync(`public${asset.localPath}`)), asset.sha256);
    assert.equal(asset.pixelsInspected, true);
    assert.equal(asset.fullyDecoded, true);
    assert.ok(asset.width > 0 && asset.height > 0);
    const metadata = await sharp(`public${asset.localPath}`).metadata();
    assert.equal(metadata.width, asset.width);
    assert.equal(metadata.height, asset.height);
    assert.equal(metadata.exif, undefined, `${asset.localPath}: unnecessary EXIF removed`);
    assert.equal(metadata.xmp, undefined, `${asset.localPath}: unnecessary XMP removed`);
    assert.equal(metadata.iptc, undefined, `${asset.localPath}: unnecessary IPTC removed`);
    await sharp(`public${asset.localPath}`).stats();
    assert.ok(asset.privacySanitization, `${asset.localPath}: metadata inspection record`);
    assert.ok(asset.rightsBasis, `${asset.localPath}: rights basis, not attribution alone`);
  }
  for (const a of rows) {
    const images = nodes(a.ast).filter(n => n.type === 'image');
    assert.ok(p.assets.some(asset => asset.localPath === a.cover && (asset.article === a.translationKey || asset.articles?.includes(a.translationKey))), `${a.source}: reviewed subject-specific cover`);
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


test('November4 preserves 595 earlier editions, all historical records and protected files', () => {
  const historical = inventory.filter(a => a.issue < issue);
  assert.equal(historical.length, 595);
  assert.equal(new Set(historical.map(a => a.translationKey)).size, 119);
  const fingerprint = historical.map(a => `${a.source}\0${digest(readFileSync(a.source))}\n`).join('');
  assert.equal(digest(fingerprint), '4295f9f5cb005b591e63f1bb1824e379502b6a31c5f16b07e1293c54e2f7ff64', 'baseline 2dca4223: previous article files remain byte-for-byte unchanged');
  const throughIssue = inventory.filter(a => a.issue <= issue && !a.draft);
  assert.equal(throughIssue.length, 620);
  assert.equal(new Set(throughIssue.map(a => a.translationKey)).size, 124);
  assert.ok(!inventory.some(a => a.issue === '2026-11-02'));
  const log = JSON.parse(read('docs/news-publication-log.json'));
  assert.equal(digest(JSON.stringify(log.batches.filter(batch => priorBatchIDs.includes(batch.id)))), '41783973313abbd41cc5b37b527edd5859a5030f2e9f3dc1f45224400e8810db', 'all prior publication and withdrawal records unchanged');
  const withdrawn = log.batches.flatMap(batch => batch.articles).filter(a => a.status === 'withdrawn');
  assert.ok(withdrawn.length > 0);
  for (const entry of withdrawn) {
    assert.equal(entry.republish, false);
    assert.equal(entry.withdrawalScope, 'all-language-editions');
    assert.ok(!inventory.some(a => a.translationKey === entry.translationKey));
    for (const media of entry.withdrawnMedia || []) assert.equal(existsSync(`public${media}`), false);
  }
  const optimizer = read('scripts/optimize-images.mjs');
  assert.equal(optimizer.split(approvedOptimizerAddition).length, 2, 'exact reviewed November 4 quality block appears once');
  assert.ok(optimizer.includes('const photoAvifQuality = {\n' + approvedOptimizerAddition));
  assert.equal(digest(optimizer.replace(approvedOptimizerAddition, '')), '4541c29519997ae03a1ae1472bc164beb65fa1f5cb255b1f7cd765947e4c72e0', 'all prior optimizer behavior, defaults and encoder settings unchanged');
  for (const [label, files, expected] of protectedGroups) {
    assert.equal(digest(files.map(file => `${file}\0${digest(originalProtectedBytes(file))}\n`).join('')), expected, `${label}: all baseline files preserved`);
  }
});

const protectedGroups = [
  [
    "protected",
    [
      "app/(root)/page.tsx",
      "app/(site)/[locale]/[...path]/page.tsx",
      "app/(site)/[locale]/all-news/[[...page]]/page.tsx",
      "app/(site)/[locale]/page.tsx",
      "app/(site)/[locale]/post/[slug]/page.tsx",
      "app/(site)/about/page.tsx",
      "app/(site)/all-news/[[...page]]/page.tsx",
      "app/(site)/all-news/[[...page]]/view.tsx",
      "app/(site)/authors/page.tsx",
      "app/(site)/category/[slug]/page.tsx",
      "app/(site)/category/[slug]/view.tsx",
      "app/(site)/contact/page.tsx",
      "app/(site)/issue/[slug]/page.tsx",
      "app/(site)/issues/layout.tsx",
      "app/(site)/issues/page.tsx",
      "app/(site)/layout.tsx",
      "app/(site)/post/[slug]/page.tsx",
      "app/(site)/post/[slug]/view.tsx",
      "app/(site)/privacy/page.tsx",
      "app/(site)/robots.txt/route.ts",
      "app/(site)/rss.xml/route.ts",
      "app/(site)/sitemap.xml/route.ts",
      "app/(site)/tag/[slug]/page.tsx",
      "app/(site)/tag/[slug]/view.tsx",
      "app/globals.css",
      "app/home-client.tsx",
      "app/layout.tsx",
      "components/article-markdown.tsx",
      "components/client-markdown.tsx",
      "components/header-clock.tsx",
      "components/info-view.tsx",
      "components/issue-view.tsx",
      "components/language-select.tsx",
      "components/localized-link.tsx",
      "components/reference-home.tsx",
      "components/root-clock.tsx",
      "components/route-view.tsx",
      "components/rss-banner.tsx",
      "components/site-footer.tsx",
      "components/site-header.tsx",
      "components/static-site-chrome.tsx",
      "components/story-components.tsx",
      "components/wire-ticker.tsx",
      "lib/article-citations.d.mts",
      "lib/article-citations.mjs",
      "lib/article-client.ts",
      "lib/article-contract.d.mts",
      "lib/article-contract.mjs",
      "lib/article-media.ts",
      "lib/articles.tsx",
      "lib/categories.d.mts",
      "lib/categories.mjs",
      "lib/data.ts",
      "lib/editorial-policy.ts",
      "lib/home-selection.d.mts",
      "lib/home-selection.mjs",
      "lib/home-seo.d.mts",
      "lib/home-seo.mjs",
      "lib/i18n.tsx",
      "lib/image-assets.ts",
      "lib/language-routes.d.mts",
      "lib/language-routes.mjs",
      "lib/links.ts",
      "lib/locales.ts",
      "lib/messages.json",
      "lib/page-revisions.d.mts",
      "lib/page-revisions.mjs",
      "lib/publication-dates.d.mts",
      "lib/publication-dates.mjs",
      "lib/rss-copy.json",
      "lib/seo.tsx",
      "lib/site-brand.ts",
      "lib/site-url.ts",
      "lib/sitemap-dates.d.mts",
      "lib/sitemap-dates.mjs",
      "lib/tag-descriptions.d.mts",
      "lib/tag-descriptions.mjs",
      "lib/tag-routes.d.mts",
      "lib/tag-routes.mjs",
      "scripts/audit-pagespeed.mjs",
      "scripts/check-category-export.mjs",
      "scripts/check-export.mjs",
      "scripts/check-seo.mjs",
      "scripts/check-tag-export.mjs",
      "scripts/content.mjs",
      "scripts/dev.mjs",
      "scripts/finalize-export.mjs",
      "scripts/finalize-static-home.mjs",
      "scripts/image-build-cache.mjs",
      "scripts/publication-withdrawals.mjs",
      "tests/article-api.test.mjs",
      "tests/article-citations.test.mjs",
      "tests/article-markdown.test.mjs",
      "tests/brand-identity.test.mjs",
      "tests/categories.test.mjs",
      "tests/category-layout.test.mjs",
      "tests/content.test.mjs",
      "tests/cover-fit.test.mjs",
      "tests/editorial-layout.test.mjs",
      "tests/editorial-policy.test.mjs",
      "tests/home-gap.test.mjs",
      "tests/home-layout.test.mjs",
      "tests/image-assets.test.mjs",
      "tests/image-build-cache.test.mjs",
      "tests/image-optimizer.test.mjs",
      "tests/localized-entries.test.mjs",
      "tests/multilingual.test.mjs",
      "tests/news-caption-style.test.mjs",
      "tests/news-media.test.mjs",
      "tests/nov1-publication.test.mjs",
      "tests/nov3-publication.test.mjs",
      "tests/oct18-publication.test.mjs",
      "tests/oct19-publication.test.mjs",
      "tests/oct20-publication.test.mjs",
      "tests/oct22-publication.test.mjs",
      "tests/oct23-publication.test.mjs",
      "tests/oct24-publication.test.mjs",
      "tests/oct25-publication.test.mjs",
      "tests/oct26-publication.test.mjs",
      "tests/oct28-publication.test.mjs",
      "tests/oct29-publication.test.mjs",
      "tests/oct30-publication.test.mjs",
      "tests/oct31-publication.test.mjs",
      "tests/october-catchup.test.mjs",
      "tests/publication-dates.test.mjs",
      "tests/publication-withdrawals.test.mjs",
      "tests/rss-banner.test.mjs",
      "tests/seo-config.test.mjs",
      "tests/static-home.test.mjs",
      "tests/tag-descriptions.test.mjs",
      "tests/tag-routes.test.mjs",
      "tests/tech-rank-layout.test.mjs",
      "tests/ticker.test.mjs",
      "tests/viewport-scale.test.mjs",
      "tests/visual-alignment.test.mjs"
    ],
    "7e69b2e28edc58b99f5bdf1d78d52fed7d6cc6a77ecf42e0d63fb66fe3c71f80"
  ],
  [
    "media",
    [
      "public/news-art/2026-10-03/README.md",
      "public/news-art/2026-10-03/anthropic-regulation.svg",
      "public/news-art/2026-10-03/g20-trade.svg",
      "public/news-art/2026-10-03/g7-energy.svg",
      "public/news-art/2026-10-03/mispel-storage.svg",
      "public/news-art/2026-10-03/us-employment.svg",
      "public/news-media/2026-10-03/bls-september-2026-payroll-original.png",
      "public/news-media/2026-10-03/bls-september-2026-unemployment-original.png",
      "public/news-media/2026-10-04/P20260929DT-1750-1200.jpg",
      "public/news-media/2026-10-04/P20260929JB-0074-1200.jpg",
      "public/news-media/2026-10-04/ai-infrastructure-editorial-illustration.webp",
      "public/news-media/2026-10-04/anthropic-policy-editorial-illustration.webp",
      "public/news-media/2026-10-04/g20-trade-editorial-illustration.webp",
      "public/news-media/2026-10-04/g7-energy-reserves-editorial-illustration.webp",
      "public/news-media/2026-10-04/iea-india-hourly-demand.png",
      "public/news-media/2026-10-04/iea-india-summer-net-load.png",
      "public/news-media/2026-10-04/korea-missile-tensions-editorial-illustration.webp",
      "public/news-media/2026-10-04/mispel-storage-editorial-illustration.webp",
      "public/news-media/2026-10-04/ssu-oil-sites-20261002.jpg",
      "public/news-media/2026-10-04/whitehouse-ai-luncheon-20260929.jpg",
      "public/news-media/2026-10-05/battery-duration-editorial.png",
      "public/news-media/2026-10-05/brazil-election-editorial.png",
      "public/news-media/2026-10-05/climate-court-editorial.png",
      "public/news-media/2026-10-05/red-sea-shipping-editorial.png",
      "public/news-media/2026-10-05/us-ai-task-force-editorial.png",
      "public/news-media/2026-10-06/beam-editorial.png",
      "public/news-media/2026-10-06/eu-ev-editorial.png",
      "public/news-media/2026-10-06/eu-trade-editorial.png",
      "public/news-media/2026-10-06/nepal-recovery-editorial.png",
      "public/news-media/2026-10-06/telekom-official.jpg",
      "public/news-media/2026-10-09/asean-energy-security-grid-2026-10-09.png",
      "public/news-media/2026-10-09/byd-overseas-geopolitics-2026-10-09.png",
      "public/news-media/2026-10-09/china-yuan-policy-europe-trade-2026-10-09.png",
      "public/news-media/2026-10-09/flock-safety-planned-job-cuts-2026-10-09.png",
      "public/news-media/2026-10-09/google-gemini-work-agents-2026-10-09-kurian.png",
      "public/news-media/2026-10-09/google-gemini-work-agents-2026-10-09.png",
      "public/news-media/2026-10-09/lg-energy-solution-q3-profit-2026-10-09.png",
      "public/news-media/2026-10-09/oil-ai-financing-market-pressure-2026-10-09.png",
      "public/news-media/2026-10-09/us-weekly-jobless-claims-2026-10-09.png",
      "public/news-media/2026-10-10/china-ai-productive-forces-guidelines-2026-10-10.png",
      "public/news-media/2026-10-10/china-eu-hybrid-trade-understanding-2026-10-10.png",
      "public/news-media/2026-10-10/china-unused-debt-quota-2026-10-10.png",
      "public/news-media/2026-10-10/firmus-ipo-private-funding-2026-10-10.png",
      "public/news-media/2026-10-10/globalfoundries-tsmc-interposers-2026-10-10.png",
      "public/news-media/2026-10-10/miami-ukraine-talks-russian-diesel-2026-10-10.png",
      "public/news-media/2026-10-10/south-korea-kgx-energy-transition-2026-10-10.png",
      "public/news-media/2026-10-10/us-perm-suspension-tcs-2026-10-10.png",
      "public/news-media/2026-10-11/china-auto-innovative-design-draft-2026-10-11.png",
      "public/news-media/2026-10-11/china-urban-employment-services-2026-10-11.png",
      "public/news-media/2026-10-11/data-centre-flexible-power-2026-10-11.png",
      "public/news-media/2026-10-11/india-rbi-forex-oil-window-2026-10-11.jpg",
      "public/news-media/2026-10-11/india-thane-data-centre-community-2026-10-11.png",
      "public/news-media/2026-10-11/ukraine-us-diesel-refinery-dispute-2026-10-11.png",
      "public/news-media/2026-10-11/us-ai-server-export-guilty-plea-2026-10-11.png",
      "public/news-media/2026-10-12/anthropic-agent-evaluation-boundaries-2026-10-12.png",
      "public/news-media/2026-10-12/isaias-goes19-20261010-0120utc.webp",
      "public/news-media/2026-10-12/tesla-assisted-driving-europe-approval-2026-10-12.png",
      "public/news-media/2026-10-12/us-inflation-bank-earnings-week-2026-10-12.png",
      "public/news-media/2026-10-14/shanghai-supermarket-2014.jpg",
      "public/news-media/2026-10-14/us-cpi-gas-pump-2025.jpg",
      "public/news-media/2026-10-15/rba-sydney-2025.jpg",
      "public/news-media/2026-10-17/byd-frankfurt.jpg",
      "public/news-media/2026-10-17/cardinal-ohio-power.jpg",
      "public/news-media/2026-10-17/ev-el-paso.jpg",
      "public/news-media/2026-10-17/ford-kansas-assembly.jpg",
      "public/news-media/2026-10-17/ourisman-bethesda.jpg",
      "public/news-media/2026-10-17/permian-pumpjack.jpg",
      "public/news-media/2026-10-17/walmart-wallkill.jpg",
      "public/news-media/2026-10-18/centinela-oxidos-encuentro-2017.jpg",
      "public/news-media/2026-10-18/kjuube-pv-battery-cabinet-2020.jpg",
      "public/news-media/2026-10-18/theiss-battery-storage-2024.jpg",
      "public/news-media/2026-10-19/anthropic-logo.svg",
      "public/news-media/2026-10-19/anthropic-public-benefit-illustration.png",
      "public/news-media/2026-10-19/canning-waste-truck.jpg",
      "public/news-media/2026-10-19/china-economy-illustration.png",
      "public/news-media/2026-10-19/hydrogen-station.jpg",
      "public/news-media/2026-10-20/ai-credit-illustration.webp",
      "public/news-media/2026-10-20/housing-affordability-ai.webp",
      "public/news-media/2026-10-20/huaihe-storage-ai.webp",
      "public/news-media/2026-10-20/nvidia-headquarters-2018.jpg",
      "public/news-media/2026-10-20/spr-inventory-doe-2026-10-16.png",
      "public/news-media/2026-10-20/spr-nederland-doe-2014.jpg",
      "public/news-media/2026-10-20/yinwang-swap-ai.webp",
      "public/news-media/2026-10-22/ebay-editorial.png",
      "public/news-media/2026-10-22/kmi-editorial.png",
      "public/news-media/2026-10-22/meta-editorial.png",
      "public/news-media/2026-10-22/openai-editorial.png",
      "public/news-media/2026-10-22/samsung-editorial.png",
      "public/news-media/2026-10-22/tesla-editorial.png",
      "public/news-media/2026-10-22/tesla-model-y-69-official.jpg",
      "public/news-media/2026-10-22/tesla-model-y-70-official.jpg",
      "public/news-media/2026-10-23/bank-of-japan.jpg",
      "public/news-media/2026-10-23/barclays.jpg",
      "public/news-media/2026-10-23/beijing-cbd.jpg",
      "public/news-media/2026-10-23/datacenter.jpg",
      "public/news-media/2026-10-23/market-editorial.png",
      "public/news-media/2026-10-23/medical-diagnostic.png",
      "public/news-media/2026-10-24/amex-workforce.jpg",
      "public/news-media/2026-10-24/cyber-response.png",
      "public/news-media/2026-10-24/fuel-cell-power.jpg",
      "public/news-media/2026-10-24/oil-supply.jpg",
      "public/news-media/2026-10-24/oil-tanker.jpg",
      "public/news-media/2026-10-24/openai-containment.png",
      "public/news-media/2026-10-24/uk-biosecurity.png",
      "public/news-media/2026-10-25/audi-gerd-walker.jpg",
      "public/news-media/2026-10-25/audi-q9-us.jpg",
      "public/news-media/2026-10-25/fed-june-fomc-meeting.jpg",
      "public/news-media/2026-10-25/fed-september-press-conference.jpg",
      "public/news-media/2026-10-25/kimi-cyber-risk-concept.png",
      "public/news-media/2026-10-25/uk-hm-treasury-plaque.jpg",
      "public/news-media/2026-10-25/varopreem-cressier-refinery.jpg",
      "public/news-media/2026-10-26/brazil-lula-official.jpg",
      "public/news-media/2026-10-26/nextdc-grid.png",
      "public/news-media/2026-10-26/serbia-transition.png",
      "public/news-media/2026-10-26/spacex-gpu-finance.png",
      "public/news-media/2026-10-26/uk-housing-support.png",
      "public/news-media/2026-10-26/uk-rough-sleeping-official.svg",
      "public/news-media/2026-10-28/meta-headquarters.jpg",
      "public/news-media/2026-10-28/microsoft-campus.jpg",
      "public/news-media/2026-10-28/natural-gas-flare.jpg",
      "public/news-media/2026-10-28/renewable-windfarm.jpg",
      "public/news-media/2026-10-28/us-home-sale.jpg",
      "public/news-media/2026-10-29/federal-reserve-annex.jpg",
      "public/news-media/2026-10-29/googleplex-plaza.jpg",
      "public/news-media/2026-10-29/maryland-parkton-solar.jpg",
      "public/news-media/2026-10-29/microsoft-redmond-campus.jpg",
      "public/news-media/2026-10-29/skhynix-ddr5-mrdimm.jpg",
      "public/news-media/2026-10-30/argonne-battery-xray.jpg",
      "public/news-media/2026-10-30/argonne-electrode-winding.jpg",
      "public/news-media/2026-10-30/commerce-hoover-building.jpg",
      "public/news-media/2026-10-30/las-vegas-supermarket.jpg",
      "public/news-media/2026-10-30/manhattan-apartments.jpg",
      "public/news-media/2026-10-30/nersc-server-rack.jpg",
      "public/news-media/2026-10-31/bls-employment-cost-illustration.png",
      "public/news-media/2026-10-31/cma-publisher-terms-illustration.png",
      "public/news-media/2026-10-31/eia-chart2.svg",
      "public/news-media/2026-10-31/eia-main.svg",
      "public/news-media/2026-10-31/eia-solar-storage-illustration.png",
      "public/news-media/2026-11-01/amazon-day1-2017.webp",
      "public/news-media/2026-11-01/china-manufacturing-planning-illustration.png",
      "public/news-media/2026-11-01/delhi-sunset-archive.webp",
      "public/news-media/2026-11-01/india-charging-archive.webp",
      "public/news-sources/2026-10-16/census-retail-sales-september-2026-CB26-165.pdf",
      "public/news-sources/2026-10-30/mistral-ecosystem-open-weight-license.txt",
      "public/reference-assets/0048513dfc04949d.webp",
      "public/reference-assets/015802bf0ee7bc88.svg",
      "public/reference-assets/03933840bbc618cb.woff2",
      "public/reference-assets/07cd823535e44ee7.webp",
      "public/reference-assets/09144649adce1941.webp",
      "public/reference-assets/0e27d29ecc151e89.svg",
      "public/reference-assets/0fb30a0160f09853.webp",
      "public/reference-assets/1003e0e5955e786b.webp",
      "public/reference-assets/1314e8d8ac6f88cc.webp",
      "public/reference-assets/132f4bdc83fa9674.webp",
      "public/reference-assets/13f58068aedad150.webp",
      "public/reference-assets/15f8d24c24591919.webp",
      "public/reference-assets/194f453a94ed2a4b.svg",
      "public/reference-assets/20eee5a6502db327.webp",
      "public/reference-assets/21c74a857a15e60d.webp",
      "public/reference-assets/2441801cfb7c62c0.webp",
      "public/reference-assets/286351bcdd767e27.webp",
      "public/reference-assets/28ca7f3e6724cf93.webp",
      "public/reference-assets/2a9b40c31ed5a6c5.webp",
      "public/reference-assets/2d51413685fa1a5b.webp",
      "public/reference-assets/416ae71947c590f3.webp",
      "public/reference-assets/420ca76a64e5d29a.webp",
      "public/reference-assets/426db226492f0098.webp",
      "public/reference-assets/4382c015be892ae0.webp",
      "public/reference-assets/442146ec3774f5f7.webp",
      "public/reference-assets/446bd4685bb75787.webp",
      "public/reference-assets/451ae021500bbf78.webp",
      "public/reference-assets/4615cdf986890f9d.webp",
      "public/reference-assets/4869a2ccc86bbaa9.svg",
      "public/reference-assets/4d2b69df0b7ffa5a.webp",
      "public/reference-assets/4dbbc4a9d9560de5.webp",
      "public/reference-assets/4fc3cd76e0745b1c.webp",
      "public/reference-assets/51321e5a444f1575.webp",
      "public/reference-assets/55166011f6919ed4.webp",
      "public/reference-assets/5db13ec097293dae.woff2",
      "public/reference-assets/5f3483537c3e3902.webp",
      "public/reference-assets/5feee35f48616cbe.svg",
      "public/reference-assets/630ccd5630f10d06.webp",
      "public/reference-assets/63b3f5c588caed70.webp",
      "public/reference-assets/6b93c19cb56f5909.webp",
      "public/reference-assets/6bc94ca35b738021.svg",
      "public/reference-assets/743166af2266c610.webp",
      "public/reference-assets/751060d85f42dcf6.webp",
      "public/reference-assets/76fb1eb82e0bd569.webp",
      "public/reference-assets/7bbf45db2dd8c6f1.webp",
      "public/reference-assets/7f1ad388069061e8.webp",
      "public/reference-assets/81a4f057e39e4cb1.webp",
      "public/reference-assets/87228f277f3b899d.webp",
      "public/reference-assets/8a51ddcbdb01884b.webp",
      "public/reference-assets/8c1f8badc694b12c.webp",
      "public/reference-assets/8c2917a0c01e406b.webp",
      "public/reference-assets/958a58880c906232.webp",
      "public/reference-assets/9ba2e5515a40f9b5.webp",
      "public/reference-assets/9dcd338598ce81c5.webp",
      "public/reference-assets/a0f9025ef54c5202.webp",
      "public/reference-assets/a17dedc7ea0e4072.webp",
      "public/reference-assets/a440953f495a0249.webp",
      "public/reference-assets/a59d58b907be61c7.webp",
      "public/reference-assets/b6aa2a748f441886.webp",
      "public/reference-assets/b8563acae2a05c44.webp",
      "public/reference-assets/b8c8f84ee8ae9020.webp",
      "public/reference-assets/bb36c2398ecefa8e.webp",
      "public/reference-assets/bb4cb8fca4cab0ce.woff2",
      "public/reference-assets/bd7e3c872ead6fd8.webp",
      "public/reference-assets/be177d817c8e8593.svg",
      "public/reference-assets/bec2d3d73ab80bea.webp",
      "public/reference-assets/c05dfb7f48101166.svg",
      "public/reference-assets/c103a3e13e580418.webp",
      "public/reference-assets/c3434beb6d59f947.webp",
      "public/reference-assets/c46c5a8c5a58dfc8.webp",
      "public/reference-assets/c4f7e50791dd2f3a.webp",
      "public/reference-assets/c5a4f819c5387b8c.webp",
      "public/reference-assets/c5ffbe04be4f472b.webp",
      "public/reference-assets/c6156234f316bc0d.webp",
      "public/reference-assets/c72825f7067bf99f.webp",
      "public/reference-assets/c763e1831083f16d.webp",
      "public/reference-assets/d502ce9f79c132d5.css",
      "public/reference-assets/d9b4c4837ecd9212.webp",
      "public/reference-assets/e390d6e80ae86960.webp",
      "public/reference-assets/e888798b3157c5c8.webp",
      "public/reference-assets/eb0b4513644ccd57.svg",
      "public/reference-assets/f5f79510c435b75b.svg",
      "public/reference-assets/fbf98ac0bad1d761.webp",
      "public/reference-assets/fe807cc2c5210228.webp",
      "public/reference-assets/ff5a4bc64853c3bd.svg",
      "public/reference-assets/manifest.json"
    ],
    "f6c2c00add705b05d80990d7fdc05b13e3c38c8c660111300b3f0ffeb4cd19a0"
  ],
  [
    "records",
    [
      "docs/news-media/2026-10-03/inline-blocks.md",
      "docs/news-media/2026-10-03/provenance.json",
      "docs/news-media/2026-10-04/ai-accord-repair-2026-10-15.json",
      "docs/news-media/2026-10-04/ai-financing-repair-2026-10-15.json",
      "docs/news-media/2026-10-04/inline-blocks.md",
      "docs/news-media/2026-10-04/provenance.json",
      "docs/news-media/2026-10-04/remediation-audit.json",
      "docs/news-media/2026-10-05/provenance.json",
      "docs/news-media/2026-10-06/provenance.json",
      "docs/news-media/2026-10-06/trade-repair-2026-10-15.json",
      "docs/news-media/2026-10-09/google-agent-repair-2026-10-15.json",
      "docs/news-media/2026-10-09/lg-energy-repair-2026-10-15.json",
      "docs/news-media/2026-10-09/provenance.json",
      "docs/news-media/2026-10-10/provenance.json",
      "docs/news-media/2026-10-11/provenance.json",
      "docs/news-media/2026-10-12/editorial-audit.json",
      "docs/news-media/2026-10-12/provenance.json",
      "docs/news-media/2026-10-14/provenance.json",
      "docs/news-media/2026-10-15/provenance.json",
      "docs/news-media/2026-10-15/text-editions-review.json",
      "docs/news-media/2026-10-17/provenance.json",
      "docs/news-media/2026-10-18/provenance.json",
      "docs/news-media/2026-10-19/anthropic-evidence.json",
      "docs/news-media/2026-10-19/cleanaway-evidence.json",
      "docs/news-media/2026-10-19/gdp-evidence.json",
      "docs/news-media/2026-10-19/hydrogen-evidence.json",
      "docs/news-media/2026-10-19/provenance.json",
      "docs/news-media/2026-10-20/credit-source-audit.json",
      "docs/news-media/2026-10-20/first-three-source-audit.json",
      "docs/news-media/2026-10-20/huaihe-source-audit.json",
      "docs/news-media/2026-10-20/provenance.json",
      "docs/news-media/2026-10-20/yinwang-source-audit.json",
      "docs/news-media/2026-10-22/provenance.json",
      "docs/news-media/2026-10-23/provenance.json",
      "docs/news-media/2026-10-24/provenance.json",
      "docs/news-media/2026-10-25/provenance.json",
      "docs/news-media/2026-10-25/source-use-audit.json",
      "docs/news-media/2026-10-26/README.md",
      "docs/news-media/2026-10-26/official-result-snapshots.json",
      "docs/news-media/2026-10-26/provenance.json",
      "docs/news-media/2026-10-26/source-use-audit.json",
      "docs/news-media/2026-10-28/README.md",
      "docs/news-media/2026-10-28/original-candidate-media.json",
      "docs/news-media/2026-10-28/provenance.json",
      "docs/news-media/2026-10-28/source-use-audit.json",
      "docs/news-media/2026-10-29/README.md",
      "docs/news-media/2026-10-29/original-candidate-media.json",
      "docs/news-media/2026-10-29/provenance.json",
      "docs/news-media/2026-10-29/source-use-audit.json",
      "docs/news-media/2026-10-30/README.md",
      "docs/news-media/2026-10-30/original-candidate-media.json",
      "docs/news-media/2026-10-30/provenance.json",
      "docs/news-media/2026-10-30/source-use-audit.json",
      "docs/news-media/2026-10-31/README.md",
      "docs/news-media/2026-10-31/original-candidate-media.json",
      "docs/news-media/2026-10-31/provenance.json",
      "docs/news-media/2026-10-31/source-use-audit.json",
      "docs/news-media/2026-11-01/README.md",
      "docs/news-media/2026-11-01/original-candidate-media.json",
      "docs/news-media/2026-11-01/provenance.json",
      "docs/news-media/2026-11-01/source-use-audit.json",
      "docs/news-media/2026-11-03/original-candidate-media.json",
      "docs/news-media/2026-11-03/provenance.json",
      "docs/news-media/2026-11-03/source-use-audit.json",
      "docs/news-publication-review-2026-10-15.json",
      "docs/news-publication-review-2026-10-17.json",
      "docs/news-publication-review-2026-10-18.json",
      "docs/news-publication-review-2026-10-19.json",
      "docs/news-publication-review-2026-10-20.json",
      "docs/news-publication-review-2026-10-22.json",
      "docs/news-publication-review-2026-10-23.json",
      "docs/news-publication-review-2026-10-24.json",
      "docs/news-publication-review-2026-10-25.json",
      "docs/news-publication-review-2026-10-28.json",
      "docs/news-publication-review-2026-10-29.json",
      "docs/news-publication-review-2026-10-30.json",
      "docs/news-publication-review-2026-10-31.json",
      "docs/news-publication-review-2026-11-01.json",
      "docs/news-publication-review-2026-11-03.json"
    ],
    "63921a2d0ec25b28ef45512a5aa6e1663a49e0ea77ecd0d6d8d3d96e9201e743"
  ]
];
