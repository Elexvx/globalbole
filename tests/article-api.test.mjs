import test from 'node:test';
import assert from 'node:assert/strict';
import { createArticleResponse, parseArticleResponse } from '../lib/article-contract.mjs';
import { buildContent } from '../scripts/content.mjs';

const articles=buildContent();
test('public contract serializes every language without internal fields',()=>{
  const response=createArticleResponse(articles);
  assert.equal(response.total,150);
  assert.equal(response.schemaVersion,1);
  assert.equal(new Set(response.data.map(a=>a.lang)).size,5);
  assert.ok(response.data.every(a=>!('source' in a) && !('draft' in a) && a.markdown));
  assert.deepEqual(parseArticleResponse(JSON.parse(JSON.stringify(response))),response);
  assert.deepEqual(parseArticleResponse({schemaVersion:1,total:0,data:[]}).data,[]);
});
test('contract rejects incomplete or unsafe backend payloads',()=>{
  const good=createArticleResponse(articles.slice(0,1));
  for(const patch of [{lang:'de'},{date:'2026-02-31'},{image:'javascript:alert(1)'},{readTime:0},{markdown:null},{tags:[]},{body:[{}]}]) {
    assert.throws(()=>parseArticleResponse({...good,data:[{...good.data[0],...patch}]}));
  }
  assert.throws(()=>parseArticleResponse({...good,total:2}));
  assert.throws(()=>parseArticleResponse({...good,schemaVersion:2}));
  assert.throws(()=>parseArticleResponse({...good,total:2,data:[good.data[0],good.data[0]]}));
});
