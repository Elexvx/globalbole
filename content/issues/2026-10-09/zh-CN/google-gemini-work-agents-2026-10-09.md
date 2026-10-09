---
title: "Google宣布Gemini工作代理：跨应用执行、多模型选择与企业管控并行"
slug: "google-gemini-work-agents-2026-10-09"
translationKey: "google-gemini-work-agents-2026-10-09"
issue: "2026-10-09"
lang: "zh-CN"
category: "technology"
author: "全球伯乐 News"
authorRole: "资料整理"
date: "2026-10-09"
description: "Google在10月8日宣布Gemini工作代理，整合知识工作、内容创作和编程；金融与法律专用能力仍为预览，完整开放时间尚未明确。"
cover: "/news-media/2026-10-09/google-gemini-work-agents-2026-10-09.png"
coverAlt: "Google官方图片库中的办公场景资料图"
tags: ["人工智能", "企业软件", "数据治理"]
readTime: 4
draft: false
---

Google在10月8日举行的Gemini at Work 2026活动上宣布Gemini工作代理，希望把问答、知识工作、内容创作和编程放进同一个任务入口。公司强调，用户可以交付工作目标，由代理调用工具、连接业务系统并完成任务。这次发布的重点是工作流程与企业控制的整合，不能等同于所有功能已经向所有客户全面开放。[^1]

![Google官方图片库中的办公场景资料图](/news-media/2026-10-09/google-gemini-work-agents-2026-10-09.png)

*Google官方图片库中的办公场景资料图。 [Source: Google](https://blog.google/image-library/).*

## 从应用入口走向连续任务

Google Cloud首席执行官Thomas Kurian的介绍列出了明确的应用边界：Gemini可直接在Gmail、Drive、Docs、Slides、Sheets、Chat和Calendar中工作；Microsoft 365、Slack等则被列为访问渠道或连接对象，不能据此推断每个外部应用都拥有相同的内嵌操作能力。按公司描述，代理在云端持续运行，跨设备保留记忆和上下文，并可调用子代理处理多步骤任务。[^2]

这种设计针对的是办公自动化中的衔接问题。检索资料、整理文档与运行代码可以分别完成，但一项业务任务往往需要在这些步骤之间传递信息。把它们交给同一代理，有望减少反复交代背景的成本；相应地，企业也需要更清楚地界定哪些资料可以进入共同上下文，哪些操作必须保留人工审批。

Google还介绍了拥有独立身份的团队代理，可获配自己的Workspace账号、邮箱、日历和Drive，并只接触团队向其共享的内容。它与以员工个人身份操作的软件助手，在责任归属上存在重要区别：后续审计需要知道执行者是哪个代理，以及它继承了什么权限。[^2]

![Google Cloud首席执行官Thomas Kurian的官方肖像资料图](/news-media/2026-10-09/google-gemini-work-agents-2026-10-09-kurian.png)

*Google Cloud首席执行官Thomas Kurian的官方肖像资料图。 [Source: Google](https://blog.google/image-library/).*

## 工作代理与底层模型分开选择

Gemini在这里既是产品入口，也承担模型编排。Google称，当前可在自家Gemini系列与Anthropic的Claude模型之间选择；其他私有和开放模型属于未来支持范围。模型可按任务变化，并不意味着组织的工作背景必须随之迁移。[^2]

从产品架构看，这把竞争问题从单次回答质量延伸到完整任务的组织能力。企业采购评估需要同时考虑模型表现、工具连接质量和任务失败后的恢复方式。多模型选择本身也不保证费用更低：只有在工作复杂度、重试次数和执行时间受到管理时，路由策略才能转化为可检验的成本收益。

## 权限、审计与预算进入同一套设计

治理方面，Google列出了代理身份、管理员批准的细粒度访问权限、按代理记录的审计轨迹，以及Agent Sandbox与Agent Gateway。前者为执行任务提供隔离环境，后者负责按组织政策控制网络流量。公司还介绍了项目支出硬上限：触及预算后代理暂停，管理员可选择恢复。[^2]

这些机制回应了企业部署代理时的实际难题。能够生成答案，与能够安全地修改业务资料，并不是同一层要求；日志可追溯，也不等于每次行动天然正确。部署效果仍取决于权限配置、异常处理与人工复核是否真正覆盖高风险步骤。发布材料列出的保护措施，应作为后续测试的对象，而不是零风险的证明。

## 预览、计划与可用性仍须区分

行业版本的进度并不相同。金融服务和法律专用能力处于预览阶段，政府、医疗和零售场景则属于后续计划。公告没有给出覆盖所有产品档位、地区和连接器的完整开放时间表，因此不宜把整套功能写成普遍可用的现成服务。[^2]

这次宣布展示了Google希望把企业AI从分散功能推进为持续执行系统的方向。接下来真正具有比较价值的，是客户在明确权限和预算下能完成多少可核验任务，以及错误率、复核负担和总成本是否改善。公司提供的客户成效案例仍属于其披露的经验，不能直接替代独立测试，也不能自动外推为新代理在所有组织中的表现。[^2]

[^1]: 2026-10-08 · [Google Cloud推出Gemini代理](https://blog.google/innovation-and-ai/infrastructure-and-cloud/google-cloud/gemini-at-work/) · Google · 原题：Google Cloud introduces the Gemini agent.

[^2]: 2026-10-09 · [走进Gemini at Work 2026：介绍Gemini代理](https://cloud.google.com/blog/products/ai-machine-learning/welcome-to-gemini-at-work-2026) · Google Cloud，Thomas Kurian · 原题：Welcome to Gemini at Work 2026: Introducing the Gemini agent
