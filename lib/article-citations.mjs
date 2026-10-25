// These are rights notices linked alongside reporting sources, not evidence for
// the reported event. Match URLs rather than words such as “privacy” or “license”:
// those words can also occur in genuine reporting and research titles.
const rightsNotices = new Set([
  'https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/',
  'https://www.sec.gov/about/privacy-information',
  'https://www.nist.gov/open/copyright-fair-use-and-licensing-statements-srd-data-software-and-technical-series-publications',
  'https://commission.europa.eu/legal-notice_en',
  'https://www.kogl.or.kr/info/license.do',
  'https://eur-lex.europa.eu/content/legal-notice/legal-notice.html',
  'https://www.stats.gov.cn/wzgl/202302/t20230217_1912857.html',
  'https://www.abs.gov.au/website-privacy-copyright-and-disclaimer',
  'https://www.eia.gov/about/copyrights_reuse.php',
  'https://www.nist.gov/open/license',
  'https://www.consumerfinance.gov/privacy/website-privacy-policy/',
  'https://www.energy.gov/web-policies',
  'https://www.stat.go.jp/info/riyou.html',
  'https://www.bea.gov/help/faq/145',
  'https://www.bls.gov/opub/copyright-information.htm',
  'https://www.federalreserve.gov/disclaimer.htm',
  'https://www.sec.gov/files/privacy.htm',
]);

export function isRightsNotice(link) {
  const url = new URL(link);
  return rightsNotices.has(url.origin + url.pathname)
    || (url.hostname === 'creativecommons.org' && url.pathname.startsWith('/licenses/'))
    || (url.hostname === 'github.com' && /\/blob\/[^/]+\/LICENSE(?:\.[^/]+)?$/i.test(url.pathname));
}

export function articleCitations(markdown = '') {
  const citations = new Map();
  for (const footnote of markdown.matchAll(/^\[\^[^\]]+\]:\s*(.+)$/gm)) {
    for (const link of footnote[1].matchAll(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g)) {
      if (!isRightsNotice(link[2])) citations.set(link[2], { '@type': 'CreativeWork', name: link[1], url: link[2] });
    }
  }
  return [...citations.values()];
}
