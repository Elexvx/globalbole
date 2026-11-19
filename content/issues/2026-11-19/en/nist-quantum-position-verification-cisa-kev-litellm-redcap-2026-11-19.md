---
title: "NIST Demonstrates Complete Quantum Position Verification Protocol as CISA Flags Actively Exploited LiteLLM and REDCap Vulnerabilities"
slug: "nist-quantum-position-verification-cisa-kev-litellm-redcap-2026-11-19"
translationKey: "nist-quantum-position-verification-cisa-kev-litellm-redcap-2026-11-19"
issue: "2026-11-19"
lang: "en"
category: "technology"
author: "全球伯乐 News"
authorRole: "Source compilation"
date: "2026-11-19"
description: "NIST physicists published the first complete Quantum Position Verification experiment using untrusted devices in Nature, while CISA added four actively exploited flaws in BerriAI LiteLLM, REDCap, Synology DSM, and Apache Axis to its Known Exploited Vulnerabilities Catalog."
cover: "/news-media/2026-11-19/nist-quantum-position-verification-cisa-kev-litellm-redcap-2026-11-19-editorial.webp"
coverAlt: "Studio tabletop still life of two clear optical beam-splitter cubes, a coiled fiber-optic loop, and a brushed steel security token on dark honed granite"
tags: ["Artificial intelligence","Cybersecurity","Technology policy"]
readTime: 5
draft: false
---

On November 18, 2026, the [National Institute of Standards and Technology (NIST)](https://www.nist.gov/news-events/news/2026/11/quantum-physics-can-verify-persons-location-nist-researchers-show) announced the first complete experimental demonstration of Quantum Position Verification (QPV) operating across remote, untrusted hardware. On the same day, the [Cybersecurity and Infrastructure Security Agency (CISA)](https://www.cisa.gov/news-events/alerts/2026/11/18/cisa-adds-four-known-exploited-vulnerabilities-catalog) added four actively exploited security flaws—spanning the BerriAI LiteLLM artificial intelligence gateway, the Research Electronic Data Capture (REDCap) clinical trial platform, Synology DiskStation Manager, and Apache Axis—to its Known Exploited Vulnerabilities (KEV) Catalog. Together, the dual disclosures illustrate both the physical-layer future of zero-trust authentication and the urgent operational vulnerabilities confronting today's enterprise AI and scientific software stacks[^1][^2].

![Studio tabletop still life of two clear optical beam-splitter cubes, a coiled fiber-optic loop, and a brushed steel security token on dark honed granite](/news-media/2026-11-19/nist-quantum-position-verification-cisa-kev-litellm-redcap-2026-11-19-editorial.webp)

AI-generated editorial illustration: two clear optical beam-splitter glass cubes, a coiled translucent fiber-optic loop, and an unbranded brushed stainless-steel security token resting on dark honed granite symbolize entanglement-based quantum position verification and AI infrastructure vulnerability defense, not an actual photograph from NIST or CISA.

## Entangled Photons and Speed-of-Light Triangulation Forge Unforgeable Physical Location Proofs

Published in the journal *Nature* (`DOI: 10.1038/s41586-026-11247-3`) by lead author Gautam Kavuri alongside [NIST physicists Scott Glancy and Krister Shalm](https://www.nist.gov/news-events/news/2026/11/quantum-physics-can-verify-persons-location-nist-researchers-show), the Boulder, Colorado experiment solved a longstanding dilemma in classical cryptography. While conventional cryptographic credentials verify who holds a key, they cannot verify where a user is physically located—a blind spot that contributed to more than USD 16 billion in U.S. cybercrime losses during 2024, with an apprehension rate below 1 percent. By testing a remote node positioned between two verification stations separated by 195 meters, the research team demonstrated that geographic coordinates themselves can serve as an unforgeable cryptographic credential[^1].

The protocol unites Einstein's relativistic speed-of-light limit, the quantum no-cloning theorem, and a loophole-free Bell test. The two verifying stations transmit synchronized classical signals and entangled photons to the central proving device, which must measure the quantum states and return classical outputs within the exact nanosecond window dictated by light propagation across 195 meters. Empowered by high-efficiency superconducting nanowire single-photon detectors (SNSPDs), the verifiers do not need to trust the prover's terminal hardware: any adversary attempting to intercept, duplicate, or relay the quantum signals from outside the designated perimeter violates the no-cloning theorem or misses the relativistic timing window across millions of repeated trials[^1].

## Active Exploitation Targets AI Model Gateways and Clinical Research Data Infrastructure

While quantum physics establishes long-term architectural defenses, current software infrastructure faces acute exploitation in the wild. In its [November 18 KEV Catalog alert](https://www.cisa.gov/news-events/alerts/2026/11/18/cisa-adds-four-known-exploited-vulnerabilities-catalog), CISA warned that threat actors are actively exploiting `CVE-2026-40217`, an unprotected alternate channel vulnerability in BerriAI LiteLLM, and `CVE-2026-90817`, a code injection vulnerability in Vanderbilt University's REDCap platform. Because LiteLLM acts as a centralized proxy managing API keys and routing traffic across multiple large language models, and REDCap underpins clinical and translational research databases at thousands of medical institutions worldwide, compromise of either system exposes high-value enterprise credentials and regulated biomedical records[^2].

The [CISA directive](https://www.cisa.gov/news-events/alerts/2026/11/18/cisa-adds-four-known-exploited-vulnerabilities-catalog) also mandated remediation for `CVE-2024-10441`, an improper output encoding or escaping flaw in Synology DiskStation Manager (DSM), and `CVE-2026-90436`, an unsafe reflection vulnerability in Apache Axis. Under Binding Operational Directive (BOD) 26-04 (*Prioritizing Security Updates Based on Risk*), Federal Civilian Executive Branch (FCEB) agencies must apply vendor patches by the stipulated deadline or immediately discontinue use of the affected products. CISA urged private-sector cloud operators, healthcare research networks, and AI engineering teams to audit exposed proxy gateways and network-attached storage appliances without delay[^2].

[^1]: 2026-11-18 · [Quantum Physics Can Verify a Person's Location, NIST Researchers Show](https://www.nist.gov/news-events/news/2026/11/quantum-physics-can-verify-persons-location-nist-researchers-show) · National Institute of Standards and Technology (NIST).
[^2]: 2026-11-18 · [CISA Adds Four Known Exploited Vulnerabilities to Catalog](https://www.cisa.gov/news-events/alerts/2026/11/18/cisa-adds-four-known-exploited-vulnerabilities-catalog) · Cybersecurity and Infrastructure Security Agency (CISA).
