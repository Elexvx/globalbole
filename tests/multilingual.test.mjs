import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { buildContent, languages } from '../scripts/content.mjs';
import { languageSwitchHref, translatedTagSlug } from '../lib/language-routes.mjs';

const articles=buildContent();
const urls=text=>[...text.matchAll(/\]\((https?:\/\/[^\s)]+)\)/g)].map(match=>match[1]).sort();
const bodyImages=text=>[...text.matchAll(/!\[[^\n]*\]\((\/news-media\/[^\s)]+)\)/g)].map(match=>match[1]).sort();

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
      if(['en','fr','ru'].includes(story.lang)) for(const value of [story.title,story.dek,story.authorRole,story.imageAlt,...story.tags,story.markdown]) assert.doesNotMatch(value,/[\u3400-\u9fff]/,`${key}/${story.lang}: no untranslated Chinese`);
      for(const next of languages){
        const target=group.find(item=>item.lang===next);
        assert.equal(languageSwitchHref({params:{locale:story.lang,slug:story.slug},pathname:`/${story.lang}/post/${story.slug}/`,locale:story.lang,next,stories:articles}),`/${next}/post/${target.slug}/`);
      }
    }
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
