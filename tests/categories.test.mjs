import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { categories, categoryLabels, categoryPool } from '../lib/categories.mjs';
import { articleCategories, articleLanguages, createArticleResponse } from '../lib/article-contract.mjs';
import { buildContent } from '../scripts/content.mjs';

const slugs=['technology','innovation','business','work-life','current-affairs','energy'];
const messages=JSON.parse(readFileSync('lib/messages.json','utf8'));
const fixture = category => ({slug:'en-category-test',title:'Category test',lang:'en',translationKey:'category-test',issue:'2026-10-03',category,categoryLabel:categoryLabels[category],author:'Test desk',authorRole:'Editor',date:'2026-10-03',displayDate:'Oct 3, 2026',readTime:1,dek:'Category test.',image:'/test.png',imageAlt:'Test',tags:['Testing'],body:[],markdown:'Test body.'});

test('stable category registry, contract and five-language labels stay aligned',()=>{
  assert.deepEqual(categories.map(category=>category.slug),slugs);
  assert.deepEqual(articleCategories,slugs);
  const declaration=readFileSync('lib/categories.d.mts','utf8').match(/export type CategorySlug = ([^;]+);/)[1];
  assert.deepEqual([...declaration.matchAll(/"([^"]+)"/g)].map(match=>match[1]),slugs);
  for(const category of categories) {
    assert.equal(createArticleResponse([fixture(category.slug)]).data[0].category,category.slug);
    for(const key of [category.label,category.title,category.description]) {
      for(const lang of articleLanguages) assert.ok(messages[key]?.[lang]?.trim(),`${key}: missing ${lang}`);
    }
  }
  assert.throws(()=>createArticleResponse([{...fixture('technology'),category:'unknown'}]),/language\/category/);
  assert.throws(()=>createArticleResponse([{...fixture('energy'),categoryLabel:'Innovation'}]),/categoryLabel/);
});

test('category pools never borrow another desk, including empty innovation and business desks',()=>{
  const articles=['technology','work-life','energy','energy','current-affairs'].map((category,index)=>({...fixture(category),slug:`en-test-${index}`}));
  for(const category of slugs) assert.deepEqual(categoryPool(articles,category),articles.filter(article=>article.category===category));
  assert.deepEqual(categoryPool(articles,'innovation',5),[]);
  assert.deepEqual(categoryPool(articles,'business',5),[]);
  assert.equal(categoryPool(articles,'energy',1).length,1);
});

test('new category routes do not collide with legacy redirects',()=>{
  const redirects=JSON.parse(readFileSync('vercel.json','utf8')).redirects;
  for(const slug of slugs) for(const prefix of ['',...articleLanguages.map(lang=>`/${lang}`)]) {
    assert.ok(!redirects.some(redirect=>redirect.source===`${prefix}/category/${slug}`));
  }
  for(const slug of ['world','politics','culture','cities']) {
    assert.ok(redirects.some(redirect=>redirect.source===`/category/${slug}` && redirect.destination==='/zh-CN/all-news/' && redirect.permanent));
  }
});

test('Markdown accepts every category and rejects unknown or inconsistent translation categories',()=>{
  const original=process.cwd();
  const directory=mkdtempSync(path.join(tmpdir(),'globalbole-category-test-'));
  const markdown=(category,lang='en')=>`---\ntitle: "Category test"\nslug: "category-test"\ntranslationKey: "category-test"\nissue: "2026-10-03"\nlang: "${lang}"\ncategory: "${category}"\nauthor: "Test desk"\ndate: "2026-10-03"\ndescription: "Category test"\ncover: "/test.png"\ncoverAlt: "Test"\ntags: ["Testing"]\n---\nTest body.\n`;
  try {
    process.chdir(directory);mkdirSync('content/issues/test',{recursive:true});mkdirSync('public',{recursive:true});writeFileSync('public/test.png','');
    for(const category of slugs){writeFileSync('content/issues/test/en.md',markdown(category));assert.equal(buildContent()[0].category,category);}
    writeFileSync('content/issues/test/en.md',markdown('unknown'));assert.throws(buildContent,/unknown category/);
    writeFileSync('content/issues/test/en.md',markdown('energy'));writeFileSync('content/issues/test/fr.md',markdown('innovation','fr'));assert.throws(buildContent,/translations must use the same category/);
    writeFileSync('content/issues/test/fr.md',markdown('energy','fr'));assert.equal(buildContent().length,2);
  } finally {process.chdir(original);rmSync(directory,{recursive:true,force:true});}
});
