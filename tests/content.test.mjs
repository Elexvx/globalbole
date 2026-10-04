import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { buildContent, languages } from "../scripts/content.mjs";

test("empty content stays a valid zero-article edition",()=>{
  const original=process.cwd();
  const directory=mkdtempSync(path.join(tmpdir(),"globalbole-empty-content-test-"));
  try {
    process.chdir(directory);
    assert.deepEqual(buildContent(),[]);
    assert.deepEqual(languages,["zh-CN","zh-TW","en","ru","fr"]);
  } finally { process.chdir(original); rmSync(directory,{recursive:true,force:true}); }
});

test("draft exclusion, new-file discovery and invalid content rejection",()=>{
  const original=process.cwd();
  const fixture=`---
title: "Test article"
slug: "test-article"
translationKey: "test-article"
issue: "2026-09-01"
lang: "en"
category: "technology"
author: "Test desk"
authorRole: "Editor"
date: "2026-09-01"
description: "A test article."
cover: "/reference-assets/4615cdf986890f9d.webp"
coverAlt: "Test cover"
tags: ["Testing"]
draft: false
---

> Test summary

| Field | Value |
| --- | --- |
| Status | Test |

## Test section

Test body.
`;
  const directory=mkdtempSync(path.join(tmpdir(),"politica-content-test-"));
  try{
    process.chdir(directory);
    mkdirSync("content/issues/test",{recursive:true});mkdirSync("public/reference-assets",{recursive:true});
    writeFileSync("public/reference-assets/4615cdf986890f9d.webp","");
    writeFileSync("content/issues/test/example.md",fixture);
    assert.equal(buildContent().length,1);
    const textOnly = fixture.replace('cover: "/reference-assets/4615cdf986890f9d.webp"', 'cover: ""').replace('coverAlt: "Test cover"', 'coverAlt: ""');
    writeFileSync("content/issues/test/example.md",textOnly);
    assert.equal(buildContent()[0].image, "");
    writeFileSync("content/issues/test/example.md",textOnly.replace('coverAlt: ""', 'coverAlt: "Stray caption"'));
    assert.throws(buildContent,/cover and coverAlt/);
    writeFileSync("content/issues/test/example.md",fixture.replace("draft: false","draft: true"));
    assert.equal(buildContent().length,0);
    writeFileSync("content/issues/test/example.md",fixture.replace('lang: "en"','lang: "invalid"'));
    assert.throws(buildContent,/unsupported lang/);
    writeFileSync("content/issues/test/example.md",fixture);
    writeFileSync("content/issues/test/duplicate.md",fixture);
    assert.throws(buildContent,/duplicate/);
  }finally{process.chdir(original);rmSync(directory,{recursive:true,force:true});}
});
