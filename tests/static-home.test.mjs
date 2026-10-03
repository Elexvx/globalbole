import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {assertStaticHomeManifest, staticHomeHtml} from '../scripts/finalize-static-home.mjs';

const html = '<html><head><meta name="msvalidate.01" content="proof"><link rel="preload" as="image" href="/cover.webp"><style>.keep{color:red}</style><link rel="preload" as="script" href="/_next/static/a.js"><script src="/_next/static/a.js" async></script></head><body><header><details><summary>Menu</summary><a href="/zh-CN/">News</a></details><time data-live-clock><span data-clock-date>—</span><span data-clock-time>--:--:--</span></time></header><main><h1>News</h1><img src="/cover.webp" alt="Photo"></main><script type="application/ld+json">{"@type":"WebSite"}</script><script>self.__next_f.push([1,"payload"])</script></body></html>';
test('static entry preserves all content, schema, native controls and image preload while dropping only unused hydration',()=>{
  const result = staticHomeHtml(html);
  assert.ok(result.includes('<main><h1>News</h1><img src="/cover.webp" alt="Photo"></main>'));
  for(const value of ['<details>','application/ld+json','msvalidate.01','as="image"','<style>.keep','data-live-clock','/site-clock.js']) assert.ok(result.includes(value));
  assert.ok(!result.includes('/_next/'));
  assert.ok(!result.includes('__next_f'));
  assert.equal(staticHomeHtml(result),result);
});
test('unknown scripts, pending content and unexpected client widgets fail closed',()=>{
  assert.throws(()=>staticHomeHtml(html.replace('</body>','<script>customFeature()</script></body>')), /Unknown executable/);
  assert.throws(()=>staticHomeHtml(html.replace('<main>','<div hidden id="S:0"><main>')), /fully visible/);
  assertStaticHomeManifest({clientModules:{'[project]/components/root-clock.tsx':{},'[project]/node_modules/lucide-react/dist/esm/Icon.mjs':{},'[project]/node_modules/next/dist/esm/client/components/layout-router.js':{}}});
  assert.throws(()=>assertStaticHomeManifest({clientModules:{'[project]/components/search.tsx':{}}}),/interactive client module/);
  assert.throws(()=>assertStaticHomeManifest({clientModules:{'[project]/node_modules/next/dist/client/form.js':{}}}),/interactive client module/);
});
test('root clock works immediately, every second and after visibility or history restoration',()=>{
  const date={},time={},attrs={},events={};let interval;
  const clock={querySelector:selector=>selector==='[data-clock-date]'?date:time,setAttribute:(k,v)=>attrs[k]=v};
  const document={querySelector:()=>clock,hidden:false,addEventListener:(k,v)=>events[k]=v};
  vm.runInNewContext(readFileSync('public/site-clock.js','utf8'),{document,window:{addEventListener:(k,v)=>events[k]=v},Intl,Date,setInterval:(fn,delay)=>{interval=fn;assert.equal(delay,1000)}});
  assert.match(attrs.datetime,/^\d{4}-\d{2}-\d{2}T/);
  assert.match(date.textContent,/年/);assert.match(time.textContent,/\d{2}:\d{2}:\d{2}/);
  interval();events.visibilitychange();events.pageshow();
});
