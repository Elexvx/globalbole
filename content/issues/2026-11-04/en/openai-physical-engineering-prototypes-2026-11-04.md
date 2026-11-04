---
title: "OpenAI demonstrates AI-assisted hardware design, with manufacturing constraints still requiring engineers"
slug: "openai-physical-engineering-prototypes-2026-11-04"
translationKey: "openai-physical-engineering-prototypes-2026-11-04"
issue: "2026-11-04"
lang: "en"
category: "innovation"
author: "全球伯乐 News"
authorRole: "Research and compilation"
date: "2026-11-04"
description: "OpenAI reports internal trials involving device, mechanical and circuit design, including prototype timelines, benchmark results and limits encountered in manufacturing preparation."
cover: "/news-media/2026-11-04/printed-circuit-boards-2024-img4512.jpg"
coverAlt: "Archival photo: Two green printed circuit boards with chips, connectors and traces on a dark tabletop"
tags: ["Artificial intelligence", "Manufacturing"]
readTime: 5
draft: false
---

![Archival photo: Two green printed circuit boards with chips, connectors and traces on a dark tabletop](/news-media/2026-11-04/printed-circuit-boards-2024-img4512.jpg)

Two printed circuit boards, photographed on August 31, 2024. Archival photo. These are not OpenAI prototypes. Photo: [IMG 4512](https://commons.wikimedia.org/wiki/File:Printed_circuit_boards_20240831_083726.jpg) · [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/).


## Prototype design still requires manufacturing review

OpenAI disclosed an experiment in applying models to physical engineering on November 3. The team used GPT‑6 to define requirements for a device that could interact with Codex, and described GPT‑6 Astra's involvement in designing the enclosure, printed circuit board, interface, firmware and software connections. According to the company, two team members completed the test device's design in less than a week while working on it alongside their other responsibilities. A contract manufacturer then produced a small batch of prototypes in less than a month. This demonstrates progress toward a prototype within a particular workflow, rather than independent model-led development of a commercial hardware product.[^1]

Such work is complex because mechanical dimensions, component placement, software functions and manufacturing processes must all fit together. A model can help organise requirements, generate design files or prepare simulations, but a physical product must still satisfy tolerances, assembly sequences, supply constraints and the capabilities of production equipment. OpenAI itself reported several rounds of human review and revision as the prototype moved into manufacturing preparation. Astra did not consistently account for the manufacturer's production limits, tolerances or assembly details.[^1]

## What usage and benchmark gains can establish

The company also said its hardware teams' model usage, measured in tokens, had reached **23 times its February baseline**. That is a usage measure, **not evidence of a 23-fold productivity improvement**. In internal BenchCAD 2.0 testing, a newer internal model achieved an average score of **0.875**, compared with **0.594** for GPT‑6 Astra at its highest reasoning setting. The tests assess reconstruction of three-dimensional parts and identification of circuit-board connections; their scores cannot be translated directly into real products' reliability or manufacturing costs.[^1]

OpenAI is having external engineers review model outputs and is working with Chip Ganassi Racing to explore turning three-dimensional scans of existing parts into editable CAD models and two-dimensional manufacturing drawings. One potentially useful application is reducing repetitive reverse-engineering work when original design files are missing. Yet an editable design and a manufacturable one remain different thresholds. At this stage, the more cautious conclusion is that AI shows potential in engineering documentation, design iteration and coordination across disciplines, while final approval remains the responsibility of people who understand the equipment, materials and production processes.[^1]

[^1]: 2026-11-03 · [Accelerating engineering for the physical world](https://openai.com/index/accelerating-engineering-for-the-physical-world/) · OpenAI. The trials, usage figures and BenchCAD results are company disclosures, not independently verified industry results.
