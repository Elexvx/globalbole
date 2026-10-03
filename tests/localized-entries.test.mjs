import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { stripTypeScriptTypes } from 'node:module';
import { categoryLabels } from '../lib/categories.mjs';
import { languageSwitchHref } from '../lib/language-routes.mjs';

const locales = ['zh-CN', 'zh-TW', 'en', 'ru', 'fr'];
const stories = JSON.parse(readFileSync('content/generated/articles.json', 'utf8'));
const categories = Object.keys(categoryLabels).map(slug => ({slug}));
const root = 'app/(site)/[locale]';
function staticParams(file, articles = stories) {
  const source = readFileSync(file, 'utf8');
  const body = source.match(/export function generateStaticParams\(\) \{([\s\S]*?)\n\}/)?.[1];
  assert.ok(body, `Static params implementation is available: ${file}`);
  const compiled = stripTypeScriptTypes('function generate() {' + body + '}');
  return Function('locales', 'stories', 'categories', compiled + '; return generate();')(locales, articles, categories);
}
const pathKey = (locale, path) => '/' + locale + '/' + (path.length ? path.join('/') + '/' : '');

test('explicit entries and required fallback preserve the exact published localized URL set', () => {
  const tags = [...new Set(stories.flatMap(story => story.tags.map(tag => tag.replace(/\s+/g, '-'))))];
  const issues = [...new Set(stories.map(story => story.issue).filter(Boolean))];
  const paths = [[], ['all-news'], ['issues'], ...['about','authors','contact','privacy'].map(item => [item]), ...categories.map(item => ['category',item.slug]), ...stories.map(item => ['post',item.slug]), ...tags.map(tag => ['tag',tag]), ...issues.map(issue => ['issue',issue])];
  const expected = locales.flatMap(locale => [...paths, ...Array.from({length:Math.max(0,Math.ceil(stories.filter(story=>story.lang===locale).length/12)-1)}, (_,index) => ['all-news',String(index+2)])].map(path => pathKey(locale,path))).sort();
  const actual = [
    ...staticParams(`${root}/page.tsx`).map(({locale}) => pathKey(locale,[])),
    ...staticParams(`${root}/all-news/[[...page]]/page.tsx`).map(({locale,page}) => pathKey(locale,['all-news',...page])),
    ...staticParams(`${root}/post/[slug]/page.tsx`).map(({locale,slug}) => pathKey(locale,['post',slug])),
    ...staticParams(`${root}/[...path]/page.tsx`).map(({locale,path}) => pathKey(locale,path)),
  ];
  assert.equal(new Set(actual).size, actual.length, 'Each exported URL belongs to exactly one entry');
  assert.deepEqual(actual.sort(), expected);
});

test('archive params retain all future pagination pages independently per locale', () => {
  const articles = [...Array.from({length:25}, () => ({lang:'zh-CN'})), ...Array.from({length:13}, () => ({lang:'en'}))];
  assert.deepEqual(staticParams(`${root}/all-news/[[...page]]/page.tsx`, articles), [
    {locale:'zh-CN',page:[]},{locale:'zh-CN',page:['2']},{locale:'zh-CN',page:['3']},
    {locale:'zh-TW',page:[]},{locale:'en',page:[]},{locale:'en',page:['2']},
    {locale:'ru',page:[]},{locale:'fr',page:[]},
  ]);
});

test('explicit entries select existing views directly without route-level streaming or dynamic imports', () => {
  for (const file of ['page.tsx','all-news/[[...page]]/page.tsx','post/[slug]/page.tsx']) {
    const source = readFileSync(`${root}/${file}`, 'utf8');
    assert.doesNotMatch(source, /use client|RouteView|Suspense|next\/dynamic|\blazy\(|\bimport\(/);
    assert.match(source, /routeSeo\(/);
    assert.match(source, /<JsonLd /);
    assert.match(source, /dynamicParams = false/);
    assert.match(source, /isLocale\(locale\)/);
  }
});

const articles = [
  {slug:'zh-cn-story',translationKey:'story',lang:'zh-CN'},
  {slug:'en-story',translationKey:'story',lang:'en'},
];
function href(params, pathname, next='en', source=articles) {
  return languageSwitchHref({params,pathname,locale:'zh-CN',next,stories:source});
}

test('language switching keeps explicit archive paths and translated article identity', () => {
  assert.equal(href({locale:'zh-CN'},'/zh-CN/'),'/en/');
  assert.equal(href({locale:'zh-CN'},'/zh-CN/all-news/'),'/en/all-news/');
  assert.equal(href({locale:'zh-CN',page:['2']},'/zh-CN/all-news/2/'),'/en/all-news/2/');
  assert.equal(href({locale:'zh-CN',slug:'zh-cn-story'},'/zh-CN/post/zh-cn-story/'),'/en/post/en-story/');
  assert.equal(href({locale:'zh-CN',slug:'zh-cn-story'},'/zh-CN/post/zh-cn-story/','fr'),'/fr/post/zh-cn-story/');
  assert.equal(href({locale:'zh-CN',slug:'zh-cn-story'},'/zh-CN/post/zh-cn-story/','en',[]),'/en/post/zh-cn-story/');
});

test('language switching preserves catch-all and legacy behavior including single tag decoding', () => {
  assert.equal(href({locale:'zh-CN',path:['post','zh-cn-story']},'/zh-CN/post/zh-cn-story/'),'/en/post/en-story/');
  for (const segments of [['category','energy'],['issue','2026-10-03'],['issues'],['about'],['all-news','2']]) {
    assert.equal(href({locale:'zh-CN',path:segments},'/unused/'),'/en/'+segments.join('/')+'/');
  }
  const tag = encodeURIComponent('人工智能');
  assert.equal(href({locale:'zh-CN',path:['tag',tag]},'/zh-CN/tag/'+tag+'/'),'/en/tag/'+tag+'/');
  assert.equal(href({locale:'zh-CN',path:['tag','%252F']},'/unused/'),'/en/tag/%252F/');
  assert.equal(href({slug:'zh-cn-story'},'/post/zh-cn-story/'),'/en/');
});
