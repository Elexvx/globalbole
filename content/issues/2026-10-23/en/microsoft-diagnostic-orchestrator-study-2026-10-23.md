---
title: "From sequential diagnosis tests to clinical care: what medical AI still needs to prove"
slug: "microsoft-diagnostic-orchestrator-study-2026-10-23"
translationKey: "microsoft-diagnostic-orchestrator-study-2026-10-23"
issue: "2026-10-23"
lang: "en"
category: "technology"
author: "Global Bole News"
authorRole: "Research and compilation"
date: "2026-10-23"
description: "Simulated cases, estimated test costs and patient outcomes answer different questions. Assessing clinical value requires separating these levels of evidence, not relying on one accuracy score."
cover: "/news-media/2026-10-23/medical-diagnostic.png"
coverAlt: "AI-generated editorial illustration: AI-assisted diagnostic research and evidence checking, not an actual clinical scene."
tags: ["Artificial intelligence", "Medical technology", "Clinical research"]
readTime: 6
draft: false
---

On October 22, Microsoft announced MAI-DxO research in Science: complex-case accuracy was 83%, versus physicians’ 36% with references; emergency-case scores were 80% versus 47%.[^1] These are results under specific test conditions, not a comparison of everyday hospital misdiagnosis rates.

![AI-generated editorial illustration: AI-assisted diagnostic research and evidence checking, not an actual clinical scene.](/news-media/2026-10-23/medical-diagnostic.png)

_AI-generated editorial illustration: AI-assisted diagnostic research and evidence checking, not an actual clinical scene._

## Choosing the next question, not just the right answer

Medical examinations generally supply the relevant material in the question. One difficulty in diagnosis is deciding what information is missing. SDBench turns cases into an interaction: the participant receives a limited summary, then chooses to ask questions, order tests or submit a diagnosis. A gatekeeper model provides information on request and can synthesize a case-consistent result when the original record lacks it. Another model scores the submitted diagnosis against a reference.[^2]

This design exposes the route used to obtain information, rather than only the final answer. A simulated finding, however, is not a new examination of a patient. If a system finds a successful path in simulation, researchers must still establish that a hospital can obtain the corresponding information promptly and that its quality does not change the decision. Making a test closer to diagnosis does not recreate an entire clinical encounter.

The authors’ earlier public manuscript describes a complex-case collection of 304 NEJM cases.[^3] Selected difficult cases can test sophisticated reasoning without representing the full outpatient population. Reporting different datasets separately matters: one average cannot answer how a system handles common illnesses, rare disorders and emergencies alike.

## A human participant does not automatically provide effective oversight

Comparing AI and physicians answering independently is different from evaluating physicians using AI. The first tests system capability; the second more closely resembles an assistive tool in practice. A doctor might identify and correct an error, or accept an answer prematurely because it sounds persuasive. These are risks to test, not clinical outcomes already demonstrated by this research.

The 2021 machine-learning medical-device principles from US, UK and Canadian regulators emphasize representative data, independent testing and human–AI performance in clinically relevant conditions.[^4] Applied here, the next evaluation should do more than reproduce an accuracy leaderboard. It should record who followed a recommendation, when it was rejected and how disagreements were resolved. The principles do not constitute approval or certification of MAI-DxO.

An incorrect answer to a difficult case and a failure to recognize an immediately dangerous condition can also have different consequences. Clinical evaluation should specify error types, severity and escalation procedures in advance. Otherwise, a better average leaves unanswered whether safety improved at the most consequential points.

## Estimated test costs are not patients’ bills

The public code supports pricing requested tests and explains that the paper used estimates grounded in a hospital’s public charge schedule. Direct model estimates and prices matched to that schedule are not equivalent.[^2] Cost comparisons therefore first compare diagnostic paths under a chosen calculation method. They do not establish lower patient payments or lower spending across the health system.

Economically, avoiding a test with no useful information may save resources. But if savings come from omitting a necessary test, later treatment costs could rise. Deployment, human review, repeat visits and exception handling also need to be counted. These are categories requiring evaluation, not benefits or losses already observed.

## Open tools still need reproducible clinical evidence

Public SDBench code does not make every case freely downloadable. NEJM material requires licensing, while MIMIC data have access conditions. The repository’s five fully synthetic cases are development examples, not a basis for reporting diagnostic performance.[^2] This distinction determines whether replication uses equivalent data and settings, rather than merely running software with the same name.

Microsoft plans prospective research with Boston’s Beth Israel Deaconess Medical Center.[^1] Until such studies produce results, the useful next step is to define patient populations, workflows and responsibility when the system fails, rather than generalize “better than doctors” to every clinical setting. Improved diagnostic reasoning and safer, more timely care for patients are separate propositions requiring separate evidence.

[^1]: 2026-10-22 · Microsoft AI, MAI Health Team · [Building Medical Superintelligence](https://microsoft.ai/news/building-medical-superintelligence/).

[^2]: Accessed 2026-10-23 · Microsoft · [SDBench: Sequential Diagnosis Benchmark](https://github.com/microsoft/sdbench) · [MIT license](https://github.com/microsoft/sdbench/blob/main/LICENSE). The [official project page](https://microsoft.github.io/sdbench/) identifies the paper as Sequential Diagnosis with Language Models, Science, 2026, DOI: 10.1126/science.aeh7930.

[^3]: Manuscript dated 2025-11-08 · Harsha Nori et al. · [Sequential Diagnosis with Language Models](https://erichorvitz.com/sequential_diagnosis_LM.pdf). Author-hosted manuscript used for methodological background, not treated as the full 2026 published version.

[^4]: 2021-10 · FDA, Health Canada and MHRA · [Good Machine Learning Practice for Medical Device Development: Guiding Principles](https://www.fda.gov/media/153486/download).
