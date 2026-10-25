import test from 'node:test';
import assert from 'node:assert/strict';
import { articleCitations } from '../lib/article-citations.mjs';

test('citations retain factual sources and mirrors but separate rights notices', () => {
  const markdown = `A report.[^1]
![Photo](https://example.com/image.jpg)
[Image licensing](https://example.com/photo-license)
[^1]: [Economic concepts](https://www.bea.gov/help/faq/1197); [public-domain reuse policy](https://www.bea.gov/help/faq/145).
[^2]: [Announcement](https://example.com/news); [mirror](https://example.org/news); [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
[^3]: [Privacy controls](https://doi.org/10.6028/NIST.SP.800-53r5); [license](https://www.nist.gov/open/license).
[^4]: [General License No. 135](https://ofac.treasury.gov/media/937216/download?inline=).
[^5]: [Software research](https://github.com/microsoft/sdbench); [MIT license](https://github.com/microsoft/sdbench/blob/main/LICENSE).
[^6]: [Announcement repeated](https://example.com/news).
[^7]: [開放政府許可3.0版](https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/).`;
  const citations = articleCitations(markdown);
  assert.deepEqual(citations.map(item => item.url), [
    'https://www.bea.gov/help/faq/1197', 'https://example.com/news',
    'https://example.org/news', 'https://doi.org/10.6028/NIST.SP.800-53r5',
    'https://ofac.treasury.gov/media/937216/download?inline=', 'https://github.com/microsoft/sdbench',
  ]);
});
