---
title: "OpenAI unveils 100-task BioBasicsBench wet-lab benchmark and partners with Hacktron on cross-service security testing"
slug: "openai-biobasicsbench-hacktron-security-2026-11-07"
translationKey: "openai-biobasicsbench-hacktron-security-2026-11-07"
issue: "2026-11-07"
lang: "en"
category: "technology"
author: "全球伯乐 News"
authorRole: "Research and compilation"
date: "2026-11-07"
description: "Built with Ligo Biosciences from raw benchtop data, BioBasicsBench shows GPT-6 Astra reaching 66.7% while still misreading PCR gels; separately, OpenAI expanded Daybreak Red access for Hacktron."
cover: "/news-media/2026-11-05/coding.jpg"
coverAlt: "Archival photo: Rust code on a laptop, not a Pierre or Codex product screenshot"
tags: ["Artificial intelligence", "AI safety", "Enterprise software"]
readTime: 5
draft: false
---

![Archival photo: Rust code on a laptop, not a Pierre or Codex product screenshot](/news-media/2026-11-05/coding.jpg)

Rust code on a laptop, February 11, 2026. Software-development reference photo, not a Pierre or Codex product screenshot. Photo: [Slashme](https://commons.wikimedia.org/wiki/File:RustCodeOnScreen.jpg) · [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/).

## BioBasicsBench tests AI models on 100 messy wet-lab tasks as GPT-6 Astra scores 66.7% but misinterprets colony PCR gels

OpenAI published *Measuring how AI agents handle everyday wet-lab science* on November 6, 2026, introducing **BioBasicsBench**, a **100-task** benchmark developed with enzyme-design startup Ligo Biosciences to evaluate how models interpret raw experimental bench data rather than polished journal figures. Every task underwent a three-stage expert review and pairs reference sheets with uncurated laboratory artifacts—including **31** gel and blot images, **27** protocols and handwritten or digital lab notes, and **20** spreadsheet exports, plate-reader tables, and raw flow cytometry files, alongside agar colony photos, microscopy z-stacks, sequencing reads, and benchtop videos. Tasks span five domains: protein methods (25 tasks), imaging and cytometry (23), quantification and assays (19), nucleic acid methods (17), and molecular cloning (16). OpenAI evaluated seven internal models across 37 model-and-reasoning-effort settings at five attempts per task, totaling **18,500 graded attempts**.[^1]

At maximum reasoning effort (`xhigh`), **GPT-6 Astra** achieved a mean reward of **66.7%** (95% confidence interval: 60.3%–73.1%, averaging 4,704 output tokens per task), outperforming **GPT-6.1 Sol** (**62.0%**), **GPT-5.6 Sol** (**43.8%**), **GPT-6 Luna** (**38.3%**), **GPT-5.5** (**35.4%**), **GPT-5.4** (**33.2%**), and **GPT-5.2** (**31.2%**, averaging 27,620 output tokens). While GPT-6 Astra caught a handwritten `LB Kan50` plate label showing an antibiotic mismatch (kanamycin instead of ampicillin) and identified 525–540 nm fluorescence bleed-through, OpenAI highlighted persistent reasoning failures: on a colony PCR agarose gel, GPT-6 Astra correctly grouped the bands into two sets (`{4, 6, 7, 8}` vs. `{5, 9, 10}`) but assumed a larger amplicon meant successful insertion, recommending colonies **4, 6, 7, and 8** (carrying the old plasmid) instead of the correct colonies **5, 9, and 10**; on a transformation plate, it merged adjacent colonies and marked empty agar for a net **12% overcount**, inflating calculated DNA transformation efficiency by 12%.[^1]

## OpenAI partners with Hacktron to probe third-party agent connections and expands Daybreak Red cyber model access

Also on November 6, 2026, OpenAI announced an offensive cybersecurity partnership with San Francisco-based startup **Hacktron**, expanding Hacktron’s access to OpenAI’s frontier cybersecurity models under **Daybreak Red**—OpenAI’s vetted tier for authorized vulnerability research and red teaming subject to identity verification, legal attestations, activity monitoring, and sandboxing. OpenAI engineers and Hacktron researchers will jointly select testing targets focused on the boundaries where OpenAI’s systems, cloud infrastructure, and identity layers connect with **third-party services and autonomous AI agents**, with researchers from Cathedral also joining OpenAI’s next security sprint.[^2]

The formal partnership builds on Hacktron’s earlier bug bounty disclosure, detailed in Hacktron’s September 13, 2026 write-up *Hacking OpenAI*: over 72 hours from July 23 to July 25, 2026, Hacktron researchers chained a missing Debian 12 security backport in `libheif` (v1.19.7) exposed through ImageMagick on OpenAI’s Discourse-hosted developer forum (`community.openai.com`) to achieve remote code execution via a `.heic` image upload, then exploited an `auth.openai.com` Single Sign-On misconfiguration for zero-interaction takeover of active forum users’ ChatGPT and Codex accounts, opening a benign proof-of-concept pull request (`PR #1186742`) in OpenAI’s internal monorepo on July 25; OpenAI patched the flaw within **14 hours** and awarded a **$6,500** bounty. Both November 6 announcements carry important caveats: BioBasicsBench evaluated only internal OpenAI models without a measured human-scientist baseline, external competitor comparison, or public repository link at release, and the Hacktron post announces prospective joint testing rather than new vulnerability counts.[^1][^2][^3]

[^1]: 2026-11-06 · [Measuring how AI agents handle everyday wet-lab science](https://openai.com/index/measuring-how-ai-agents-handle-wet-lab-science/) · OpenAI.
[^2]: 2026-11-06 · [Partnering with Hacktron to find vulnerabilities in OpenAI's systems](https://openai.com/index/partnering-with-hacktron/) · OpenAI.
[^3]: 2026-09-13 · [Hacking OpenAI](https://www.hacktron.ai/blog/hacking-openai) · Hacktron.
