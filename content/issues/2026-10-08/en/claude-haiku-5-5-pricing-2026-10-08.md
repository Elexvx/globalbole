---
title: "Haiku 5.5 cuts short-prompt token prices by 90%; task savings depend on the workload"
slug: "claude-haiku-5-5-pricing-2026-10-08"
translationKey: "claude-haiku-5-5-pricing-2026-10-08"
issue: "2026-10-08"
lang: "en"
category: "technology"
author: "Global Bole News"
authorRole: "Research and compilation"
date: "2026-10-08"
description: "Anthropic’s new small model introduces two price tiers. Its estimated 75% average task-cost reduction differs from the 90% reduction in short-prompt token prices."
seoTitle: "Haiku 5.5 cuts short-prompt token prices by 90%; task savings depend on the workload"
seoDescription: "Anthropic’s new small model introduces two price tiers. Its estimated 75% average task-cost reduction differs from the 90% reduction in short-prompt token prices."
cover: "/news-media/2026-10-08/haiku-editorial.png"
coverAlt: "AI-generated editorial illustration: a computing tile and blank paper sheets evoke focused AI processing."
tags: ["Artificial intelligence", "Anthropic", "Corporate governance"]
readTime: 4
draft: false
---

Anthropic launched Claude Haiku 5.5 on October 7, adding a lower-cost option for narrowly scoped AI work. The important distinction is between the price of tokens and the cost of finishing a task. For prompts of up to 100,000 tokens, the company lists input at $0.10 and output at $0.50 per million tokens, against $1.00 and $5.00 for Haiku 4.5. That is a 90% reduction in those unit prices.[^1]

![AI-generated editorial illustration: a computing tile and blank paper sheets evoke focused AI processing.](/news-media/2026-10-08/haiku-editorial.png)

*AI-generated editorial illustration: a computing tile and blank paper sheets evoke focused AI processing.*

## Two price tiers, two different comparisons

Above 100,000 prompt tokens, the new input and output rates are $0.50 and $2.50 per million. Anthropic’s estimate of roughly 75% lower average task cost incorporates its request mix and changes in token usage. The company says the updated tokenizer uses slightly more tokens for the same work. The estimate is therefore a vendor-calculated average, not a promise that every customer’s invoice falls by three quarters.[^1]

A simple arithmetic example shows why the distinction matters. Assume 1,000 separate requests each use 1,000 input and 100 output tokens, with no caching or other charges. The listed short-prompt rates imply $0.15 in token charges, compared with $1.50 at the older rates, if the token counts are held identical. This example illustrates the tariff alone; it does not measure whether either model completes the work correctly, needs retries or produces longer answers.

## Lower-cost processing still needs task-level tests

The announcement positions Haiku for applications such as classification, summarization and supporting subagents. Anthropic also says its larger models remain more suitable for complex agentic coding. This is a product-positioning claim, rather than evidence that any particular organization can replace its existing workflow without testing.[^1]

An independent benchmark for how to assess that decision comes from NIST’s AI Risk Management Framework playbook. Its measurement guidance calls for tests suited to the intended use, acceptable performance limits, documented blind spots and comparison of performance before and after deployment. It also stresses that results obtained in one setting may not transfer to another. The guidance is general and is not an evaluation or endorsement of Haiku 5.5.[^2]

## The useful business metric is a correct completed task

For an application processing routine documents, a meaningful comparison would hold the test set and acceptance criteria constant, then count successful outputs, retries and human corrections alongside token consumption. A cheaper first response can still be expensive if staff must repair it; a slightly costlier call may be worthwhile if it avoids several subsequent steps.

The launch consequently changes the starting economics of experimentation, while leaving the deployment decision open. The strongest case for a small model is a clearly bounded job with measurable accuracy and a reliable escalation path. A lower tariff expands that opportunity, but does not establish the final service cost on its own.

[^1]: 2026-10-07 · [Introducing Claude Haiku 5.5](https://www.anthropic.com/claude-haiku-5-5) · Anthropic

[^2]: Accessed 2026-10-08; publication date not stated · [Measure — AI RMF Playbook](https://airc.nist.gov/airmf-resources/playbook/measure/) · NIST
