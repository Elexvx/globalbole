---
title: "Modal and Vera: the AI-agent compute bill goes beyond chip benchmarks"
slug: "modal-vera-agent-compute-2026-10-20"
translationKey: "modal-vera-agent-compute-2026-10-20"
issue: "2026-10-20"
lang: "en"
category: "technology"
author: "Global Bole News"
authorRole: "Research and compilation"
date: "2026-10-20"
description: "A meaningful agent-infrastructure comparison must connect verified completions, response-time boundaries, software compatibility, isolation and total operating cost."
cover: "/news-media/2026-10-20/nvidia-headquarters-2018.jpg"
coverAlt: "NVIDIA headquarters in Santa Clara, California, in an archival photograph from August 4, 2018"
tags: ["AI agents", "Cloud computing", "NVIDIA", "Infrastructure"]
readTime: 8
draft: false
---

Modal’s October 19 early tests showed up to double comparable Intel GNR throughput, not universally faster serial tasks; Vera sandbox support remained planned.[^1]

Its public benchmark uses 50 Terminal-Bench oracle tasks in prewarmed, network-free containers, excluding model-turn latency; a completion counts only after its verifier passes.[^2] That distinction makes the announcement a starting point for evaluating infrastructure, rather than an answer to what an entire agent service will cost.

![NVIDIA headquarters in Santa Clara, California, in an archival photograph from August 4, 2018](/news-media/2026-10-20/nvidia-headquarters-2018.jpg)

_Archive photograph: NVIDIA headquarters, Santa Clara, California, August 4, 2018. Photograph by Coolcaesar; perspective-corrected and cropped derivative by Jacek Halicki, 2020. Source: [NVIDIA Headquarters](https://commons.wikimedia.org/wiki/File:NVIDIA_Headquarters.jpg). [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)._

## Decide where the stopwatch starts

An agent’s service time can include admission to a queue, preparation of an execution environment, model responses, tool execution, verification and delivery of the result. A measurement beginning after the environment is ready answers a different question from one beginning when a customer submits a request. Neither is inherently wrong. Trouble begins when the first is presented as the second.

NIST’s cloud-metrics framework specifies measurement conditions and boundaries.[^3] A practical application here would record when a request arrives, when its environment is ready and when its result is accepted. That separates waiting and preparation from execution without silently moving the stopwatch between platforms.

Consider a purely illustrative workflow taking 100 seconds, of which 30 seconds are accelerated computation and 70 are unchanged waiting or other work. Halving the computational portion produces an 85-second workflow, a 15% time saving, not a 50% saving. This is arithmetic, not a projection for Vera. It shows why identifying the part of the workload that changes is necessary before projecting a component result onto a service.

## Throughput needs a deadline and a correctness test

A service can complete more jobs per hour without making every job finish sooner. Conversely, a fast individual job does not establish how well the system behaves when requests arrive together. For an operator, the more useful comparison is completed, valid work under the response-time promise customers actually receive.

That requires keeping late jobs, timeouts and failed jobs visible. Excluding unsuccessful attempts from the cost numerator while counting only successes in the denominator would make performance look artificially cheap. Reporting the average alone can also conceal the experience of customers at the slow end of the distribution. A median and a high percentile, accompanied by the workload mix and arrival pattern, answer different and complementary questions.

A second hypothetical example illustrates the accounting. Suppose a service costs $100 to run during a measurement window and produces 1,000 accepted results: the cost is ten cents per accepted result. If another configuration also costs $100 but yields only 800 accepted results, it costs 12.5 cents each, regardless of how many attempts it started. These are invented values, not Modal prices or measured failure rates. The acceptance rule must stay unchanged for this comparison to mean anything.

## Pooling changes the question from chips to service capacity

NIST’s definition of cloud computing identifies resource pooling, rapid elasticity and measured service as core characteristics. Resources can be assigned among customers, expanded or released, and metered at a service-appropriate level.[^4] Those characteristics explain why a hardware purchase and a cloud bill are not interchangeable units of comparison.

The editorial implication is that capacity should be valued at the boundary of useful service. If requests arrive too slowly to use additional capacity, a higher maximum processing rate may not reduce a fixed bill. If demand exceeds capacity, the operator must determine whether the binding limit is processing, memory, storage, an external service or the admission policy. Adding compute to a system stalled on a different resource does not remove that other bottleneck.

Similarly, a reserved accelerator may incur cost while waiting for prerequisite work, but a shorter prerequisite only creates an economic gain if it releases billable time or permits additional useful output. It is not enough to multiply seconds saved by a headline hourly price without checking billing increments, reservations and whether the next stage can actually start. This is a system-accounting question, not evidence that a particular chip will deliver a particular margin.

## Compatibility belongs inside the migration budget

Docker lists emulation, native builders and cross-compilation for multi-platform images; container code must match the host architecture.[^5] The existence of a migration route does not make an application portfolio migration-free.

A practical comparison should therefore run the same acceptance tests on both platforms and record which dependencies require rebuilding, replacing or retaining on the old platform. A successfully started container is weaker evidence than a correctly completed business task. Different compiler settings, library versions or fallback paths can change the comparison even when the application name is unchanged.

Migration work is also an expense. Maintaining two image families, duplicate test environments and a rollback path may be sensible, but those costs belong in the evaluation alongside server charges. A gradual move with representative workloads provides a way to discover those costs without assuming that every workload is transferable. None of these considerations establishes that a migration is uneconomic; they establish what must be measured before calling it economical.

## Isolation cannot be treated as a dispensable overhead

NIST’s container-security guidance describes risks across images, registries, orchestration, runtimes and host operating systems. It warns that shared-kernel isolation is not equivalent to hypervisor isolation, and recommends controls such as trusted images, restricted privileges and keeping secrets out of images.[^6] The document is general guidance, not an assessment of Modal’s particular isolation architecture.

For agent infrastructure, the analytical consequence is straightforward: compare performance under the security settings that production will require. Removing a boundary, expanding permissions or omitting audit work to improve a test result changes the service being compared. A cheaper accepted result is not the same product if it carries materially different access or containment risk.

The next persuasive evidence would join a representative workload mix to reproducible configurations, correctness checks, end-to-end latency and fully specified charges. The present announcement raises a worthwhile question about compute for agents. Answering it requires demonstrating that additional processing capacity survives software migration, service-level constraints and security requirements, then translates into useful output rather than merely a larger benchmark number.

[^1]: Modal, October 19, 2026, [“NVIDIA Vera CPUs double throughput for Modal Sandboxes”](https://modal.com/blog/nvidia-vera-sandboxes).
[^2]: Modal Projects, undated; accessed October 20, 2026, [“Agentless Agent Bench”](https://github.com/modal-projects/agentless-agent-bench).
[^3]: Frederic de Vaulx, Eric Simmon and Robert Bohn, NIST, April 2018, [“Cloud Computing Service Metrics Description,” SP 500-307](https://doi.org/10.6028/NIST.SP.500-307).
[^4]: Peter Mell and Timothy Grance, NIST, September 2011, [“The NIST Definition of Cloud Computing,” SP 800-145](https://doi.org/10.6028/NIST.SP.800-145), with an April 27, 2012 editorial correction. Explanatory paraphrase. Republished courtesy of the National Institute of Standards and Technology; [reuse terms](https://www.nist.gov/open/license).
[^5]: Docker, undated; accessed October 20, 2026, [“Multi-platform builds”](https://docs.docker.com/build/building/multi-platform/). [Apache 2.0 license](https://github.com/docker/docs/blob/main/LICENSE).
[^6]: Murugiah Souppaya, John Morello and Karen Scarfone, NIST, September 2017, [“Application Container Security Guide,” SP 800-190](https://doi.org/10.6028/NIST.SP.800-190). Explanatory paraphrase. Republished courtesy of the National Institute of Standards and Technology; [reuse terms](https://www.nist.gov/open/license). No source chart is reproduced.
