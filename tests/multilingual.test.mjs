import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { buildContent, languages } from '../scripts/content.mjs';
import { languageSwitchHref, translatedTagSlug } from '../lib/language-routes.mjs';

const articles=buildContent();
const urls=text=>[...text.matchAll(/\]\((https?:\/\/[^\s)]+)\)/g)].map(match=>match[1]).sort();
const bodyImages=text=>[...text.matchAll(/!\[[^\n]*\]\((\/news-media\/[^\s)]+)\)/g)].map(match=>match[1]).sort();
const publicationLog=JSON.parse(readFileSync('docs/news-publication-log.json','utf8'));
const documentedSources=key=>publicationLog.batches.flatMap(batch=>batch.articles)
  .filter(article=>article.translationKey===key).flatMap(article=>article.sources || []);
// The bibliography preserves genuine source-language titles. Only an exact
// title/URL pair in this article's reviewed source log is exempt, and only in
// a footnote definition. All prose, captions and unverified labels stay checked.
const translatedMarkdown=(markdown,sources)=>markdown.split('\n').map(line=>
  /^\[\^[^\]]+\]:/.test(line)
    ? line.replace(/(?<!!)\[([^\]\n]+)\]\((https?:\/\/[^\s)]+)\)/g,(link,label,url)=>
      sources.some(source=>source.url===url && (source.title===label || source.publisher===label))
        ? `[source](${url})` : link)
    : line).join('\n');
const translatedValues=(story,sources)=>[story.title,story.dek,story.authorRole,story.imageAlt,...story.tags,translatedMarkdown(story.markdown,sources)];

test('every published story has complete five-language content and the same sources and imagery',()=>{
  const keys=[...new Set(articles.map(story=>story.translationKey))];
  for(const key of keys){
    const group=articles.filter(story=>story.translationKey===key);
    assert.deepEqual(group.map(story=>story.lang).sort(),[...languages].sort(),`${key}: five editions required`);
    const source=group.find(story=>story.lang==='zh-CN');
    for(const story of group){
      for(const field of ['date','issue','category','image','readTime']) assert.equal(story[field],source[field],`${key}: preserve ${field}`);
      assert.equal(story.tags.length,source.tags.length);
      assert.deepEqual(urls(story.markdown),urls(source.markdown),`${key}/${story.lang}: all sources retained`);
      assert.deepEqual(bodyImages(story.markdown),bodyImages(source.markdown),`${key}/${story.lang}: existing assets reused`);
      assert.equal((story.markdown.match(/^## /gm)||[]).length,(source.markdown.match(/^## /gm)||[]).length,`${key}: all sections translated`);
      assert.equal((story.markdown.match(/^\[\^[^\]]+\]:/gm)||[]).length,(source.markdown.match(/^\[\^[^\]]+\]:/gm)||[]).length,`${key}: all footnotes translated`);
      if(['en','fr','ru'].includes(story.lang)) for(const value of translatedValues(story,documentedSources(key))) assert.doesNotMatch(value,/[\u3400-\u9fff]/,`${key}/${story.lang}: no untranslated Chinese outside verified source identifiers`);
      for(const next of languages){
        const target=group.find(item=>item.lang===next);
        assert.equal(languageSwitchHref({params:{locale:story.lang,slug:story.slug},pathname:`/${story.lang}/post/${story.slug}/`,locale:story.lang,next,stories:articles}),`/${next}/post/${target.slug}/`);
      }
    }
  }
});

test('original source-title exceptions cannot hide untranslated prose or altered source labels',()=>{
  const url='https://example.org/source';
  const sources=[{url,title:'真实原文标题',publisher:'原始来源'}];
  const note=`[^1]: 2026-10-10 · [真实原文标题](${url}) · Publisher.`;
  assert.doesNotMatch(translatedMarkdown(`Translated body.\n\n${note}`,sources),/[\u3400-\u9fff]/);
  assert.doesNotMatch(translatedMarkdown(`[^1]: [原始来源](${url})`,sources),/[\u3400-\u9fff]/);
  for(const markdown of [
    `正文没有翻译。\n\n${note}`,
    `## 中文小标题\n\n${note}`,
    `![中文图片说明](/news-media/photo.jpg)\n\n${note}`,
    `*中文图注*\n\n${note}`,
    `[真实原文标题](${url})\n\n${note}`,
    note+' 中文来源说明',
    note+'\n    中文续行',
    note.replace('真实原文标题','改写的中文标题'),
    note.replace(url,'https://example.org/unverified'),
    note.replace('[真实原文标题]','![真实原文标题]'),
  ]) assert.match(translatedMarkdown(markdown,sources),/[\u3400-\u9fff]/,markdown);
  assert.match(translatedMarkdown(note,[]),/[\u3400-\u9fff]/,'An unlogged title has no exception');
  const story={title:'Title',dek:'Summary',authorRole:'Editor',imageAlt:'Photo',tags:['Topic'],markdown:note};
  for(const field of ['title','dek','authorRole','imageAlt','tags']) {
    const untranslated={...story,[field]:field==='tags'?['中文标签']:'中文内容'};
    assert.ok(translatedValues(untranslated,sources).some(value=>/[\u3400-\u9fff]/.test(value)),`${field} cannot use the source-title exception`);
  }
});

test('translated tag labels stay consistent and language switching retains the topic',()=>{
  const source=articles.filter(story=>story.lang==='zh-CN');
  const tags=[...new Set(source.flatMap(story=>story.tags))];
  for(const tag of tags) for(const locale of languages){
    const labels=new Set(source.filter(story=>story.tags.includes(tag)).map(story=>articles.find(item=>item.translationKey===story.translationKey&&item.lang===locale)?.tags[story.tags.indexOf(tag)]));
    assert.equal(labels.size,1,`${tag}/${locale}: use one translated label`);
    const target=[...labels][0];
    assert.equal(translatedTagSlug({slug:tag.replace(/\s+/g,'-'),locale:'zh-CN',next:locale,stories:articles}),target.replace(/\s+/g,'-'));
  }
});

test('root language preference is optional, safe and explicit URLs are never overridden',()=>{
  const code=readFileSync('public/site-preferences.js','utf8');
  function run(saved,pathname='/',blocked=false){
    let destination=null,click;const writes=[];
    vm.runInNewContext(code,{localStorage:{getItem(){if(blocked)throw Error('blocked');return saved},setItem:(...args)=>writes.push(args)},location:{pathname,search:'',hash:'',replace:value=>{destination=value}},document:{addEventListener:(name,fn)=>{click=fn}}});
    return {destination,click,writes};
  }
  assert.equal(run('fr').destination,'/fr/');
  assert.equal(run('ru').destination,'/ru/');
  for(const preference of [null,'zh-CN','invalid','https://evil.invalid']) assert.equal(run(preference).destination,null);
  assert.equal(run('fr','/en/').destination,null);
  assert.equal(run('fr','/',true).destination,null);
  const result=run(null);
  result.click({target:{closest:()=>({getAttribute:()=> 'zh-TW'})}});
  assert.deepEqual(result.writes,[['globalbole-locale','zh-TW']]);
});

test('language menus are present on static root and localized desktop/mobile headers',()=>{
  assert.match(readFileSync('components/site-header.tsx','utf8'),/<LanguageSelect \/>/);
  assert.match(readFileSync('components/static-site-chrome.tsx','utf8'),/data-language=\{locale\}/);
  assert.match(readFileSync('components/language-select.tsx','utf8'),/languageSwitchHref/);
  assert.match(readFileSync('components/language-select.tsx','utf8'),/<details className="language-menu">/);
});
