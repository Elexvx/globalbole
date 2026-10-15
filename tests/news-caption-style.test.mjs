import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import ReactMarkdown from 'react-markdown';

test('new archival photo captions and credits render with the established caption emphasis',()=>{
  let editions=0;
  for(const issue of ['2026-10-14','2026-10-15']) for(const lang of ['zh-CN','zh-TW','en','ru','fr']) {
    const dir=`content/issues/${issue}/${lang}`;
    for(const name of readdirSync(dir).filter(x=>x.endsWith('.md'))) {
      const blocks=readFileSync(`${dir}/${name}`,'utf8').split('\n\n');
      const image=blocks.findIndex(x=>x.startsWith('!['));
      assert.ok(image>=0);
      const count=name.startsWith('australia-')?2:1;
      for(const caption of blocks.slice(image+1,image+1+count)) {
        const html=renderToStaticMarkup(createElement(ReactMarkdown,null,caption));
        assert.match(html,/^<p><em>[\s\S]*<\/em><\/p>$/,`${lang}/${name}: caption must match shared CSS`);
        assert.doesNotMatch(html,/<(?:img|script|h[1-6])\b/);
      }
      editions++;
    }
  }
  assert.equal(editions,15);
});
