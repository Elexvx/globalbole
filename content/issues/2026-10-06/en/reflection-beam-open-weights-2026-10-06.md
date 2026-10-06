---
title: "Reflection unveils Beam: 501 billion parameters, with open weights still due this month"
slug: "reflection-beam-open-weights-2026-10-06"
translationKey: "reflection-beam-open-weights-2026-10-06"
issue: "2026-10-06"
lang: "en"
category: "technology"
author: "Global Bole News"
authorRole: "Source research and synthesis"
date: "2026-10-06"
description: "Beam targets coding and agentic work with 23 billion active parameters. Weights are planned for October; company efficiency estimates exclude some serving overhead, and API access remains in beta."
cover: "/news-media/2026-10-06/beam-editorial.png"
coverAlt: "AI-generated editorial illustration: navy modules surround a bright core, evoking model computation and openness"
tags: ["Artificial intelligence", "Infrastructure"]
readTime: 4
draft: false
---

Nvidia-backed US AI company Reflection AI unveiled its first model, Beam, on October 5, targeting coding, reasoning and agentic tasks. The sparse mixture-of-experts model has 501 billion total parameters and activates about 23 billion per token. The company positions it as a new alternative to Chinese open-weight models; Reuters also framed the announcement against competition from models such as DeepSeek and Kimi.[^1][^2]

![AI-generated editorial illustration: navy modules surround a bright core, evoking model computation and openness](/news-media/2026-10-06/beam-editorial.png)

*AI-generated editorial illustration: navy modules surround a bright core, evoking model computation and openness.*

## Weights are still to come

Reflection describes Beam as a preview still undergoing red-teaming and evaluation. Selected users will get access first; weights, a technical report, model card and developer tools are planned for October, with Apache 2.0 licensing for the weights. The announcement therefore does not yet mean downloadable weights or demonstrate production readiness.[^1]

## Efficiency and benchmark scores measure different things

Reflection says Beam approaches GLM-5.2 on some reasoning tests with roughly one-third to one-quarter as much inference compute. That is an estimate based on active parameters and generated tokens. It excludes prompt prefill, context-dependent attention and serving overhead, and cannot be directly translated into customer bills.[^1]

The company’s Terminal-Bench 2.1 table scores Beam at 80.1 and GLM-5.2 at 81.0. Efficiency and peak task performance are different dimensions, and a developer’s evaluation compilation cannot replace external reproduction. Enterprises need to match test conditions to their own workloads before deciding whether score differences matter, rather than selecting a model on one aggregate score.[^1]

## The API remains in beta

For integration, official developer documentation says the Reflection API is in beta, with access opening gradually through a waitlist and behavior and limits still subject to change. Its OpenAI-compatible interface provides Chat Completions and Models functionality, allowing developers with relevant existing code to retain part of their tooling. Interface compatibility does not mean that capabilities, availability and charges are identical.[^3] The official Models page currently lists a 256K context window and a 128K-token maximum output, while warning that the context limit may change during beta. Context counts both input and generated output; oversized requests are rejected rather than automatically truncated. Developers combining long documents with repeated tool calls therefore need to reserve room for output and reasoning.[^5]

The documentation also says Beam always reasons, with five reasoning-effort levels and medium as the default. Higher effort typically means more tokens and latency, and reasoning tokens count toward the output budget. If that budget is too low, the model may exhaust it during reasoning and return no final answer. For applications that call tools repeatedly, these constraints matter to engineering experience alongside total parameter count.[^4]

## From preview to delivery

For enterprises, Beam adds another candidate worth testing, but procurement decisions should remain grounded in specific workloads. Once the open-weight commitment is fulfilled, teams will be better placed to evaluate deployment requirements, licensing, task success rates and cost. The clearest signal today is the arrival of a new model supplier; whether it can consistently deliver reliable, economical service will depend on actual delivery.

[^1]: 2026-10-05 · [Introducing Beam: Reflection’s 501B open-weight model](https://reflection.ai/blog/introducing-beam) · Reflection

[^2]: 2026-10-05 · [Nvidia-backed Reflection unveils first AI model to take on Chinese open models](https://www.investing.com/news/stock-market-news/nvidiabacked-reflection-unveils-first-ai-model-to-take-on-chinese-open-models-4932928) · Reuters / Investing.com

[^3]: Undated; accessed 2026-10-06 · [Introduction](https://developers.reflection.ai/introduction) · Reflection Developer Docs

[^4]: Undated; accessed 2026-10-06 · [Reasoning](https://developers.reflection.ai/reasoning) · Reflection Developer Docs

[^5]: Undated; accessed 2026-10-06 · [Models](https://developers.reflection.ai/models.md) · Reflection Developer Docs
