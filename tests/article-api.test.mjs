import test from 'node:test';
import assert from 'node:assert/strict';
import { createArticleResponse, parseArticleResponse } from '../lib/article-contract.mjs';
import { buildContent } from '../scripts/content.mjs';

const articles=buildContent();
test('public contract serializes every language without internal fields',()=>{
  const response=createArticleResponse(articles);
  assert.equal(response.total,articles.length);
  assert.equal(response.schemaVersion,1);
  assert.equal(response.data.length,articles.length);
  for (const article of response.data) assert.equal(Object.hasOwn(article,"source"),false);
  assert.deepEqual(parseArticleResponse(JSON.parse(JSON.stringify(response))),response);
  assert.deepEqual(parseArticleResponse({schemaVersion:1,total:0,data:[]}).data,[]);
});
test('contract rejects incomplete or unsafe backend payloads',()=>{
  const good=createArticleResponse([{
    slug:'en-test-article',title:'Test article',lang:'en',translationKey:'test-article',issue:'2026-09-01',category:'technology',categoryLabel:'Technology',author:'Test desk',authorRole:'Editor',date:'2026-09-01',displayDate:'Sep 1, 2026',readTime:2,dek:'A test article.',image:'/reference-assets/4615cdf986890f9d.webp',imageAlt:'Test cover',tags:['Testing'],body:[],markdown:'# Test',
  }]);
  for(const patch of [{lang:'de'},{date:'2026-02-31'},{image:'javascript:alert(1)'},{readTime:0},{markdown:null},{tags:[]},{body:[{}]}]) {
    assert.throws(()=>parseArticleResponse({...good,data:[{...good.data[0],...patch}]}));
  }
  assert.throws(()=>parseArticleResponse({...good,total:2}));
  assert.throws(()=>parseArticleResponse({...good,schemaVersion:2}));
  assert.throws(()=>parseArticleResponse({...good,total:2,data:[good.data[0],good.data[0]]}));
});
