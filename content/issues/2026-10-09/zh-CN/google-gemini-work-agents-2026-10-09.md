---
title: "Gemini工作代理：企业如何验证"
slug: "google-gemini-work-agents-2026-10-09"
translationKey: "google-gemini-work-agents-2026-10-09"
issue: "2026-10-09"
lang: "zh-CN"
category: "technology"
author: "全球伯乐 News"
authorRole: "资料整理"
date: "2026-10-09"
updatedAt: "2026-10-15"
description: "NIST指引提供了检查任务可靠性、访问边界、人工复核与故障恢复的方法。这些是评估标准，并非对产品的实测结论。"
cover: "/news-media/2026-10-09/google-gemini-work-agents-2026-10-09.png"
coverAlt: "Google官方图片库中的办公场景资料图"
tags: ["人工智能", "企业软件", "数据治理"]
readTime: 6
draft: false
---

Google于2026年10月8日宣布Gemini工作代理。[^1] 金融服务及法律专用能力，被列为预览。[^2]

*2026年10月15日更新：更正来源发布日期，并补充独立的评估背景。*

![Google官方图片库中的办公场景资料图](/news-media/2026-10-09/google-gemini-work-agents-2026-10-09.png)

*Google官方图片库中的办公场景资料图。[Source: Google](https://blog.google/image-library/)。*

## 从产品公告走向实际部署决策

企业要不要把工作交给代理，产品介绍不够用，还得有一套评估方法。美国国家标准与技术研究院（NIST）在2023年1月发布《人工智能风险管理框架》，把相关工作分成治理、理解部署情境、测量与风险管理。2024年7月的《生成式人工智能概况》，补上了生成式系统特有的风险和建议行动。两份文件都是自愿采用的指引。本文拿它们当独立的评估框架，并不据此认定Google通过了测试，或获得了NIST认证。[^3][^4]

回答看起来有用，不代表周边流程就可靠。框架把人工智能看成一套系统，里面有人、有组织做法，也有部署条件。MAP功能要求把预定用途、目标用户、知识局限和人工监督记下来。放到办公代理上，应先把具体工作说清，再定评测基准。允许读什么、改什么，结果交给谁，出错了谁负责，都要先写明。这是本文对框架的应用，并非新增的Google产品能力声明。[^3]

## 访问权限、证据与恶意输入应分别检查

《生成式人工智能概况》列出的风险包括信息安全、数据隐私，以及用肯定的口吻生成错误信息。直接的恶意指令是一类，间接提示注入是另一类。间接提示注入的做法，是把恶意指令埋进系统随后会检索到的材料里。一份文件可以和任务有关，却没有资格对系统发号施令。NIST建议做安全测试，并在部署前和持续监测期间，核对生成内容的来源与引用。[^4]

可以拿一个假设的采购助手来试。评估时放进供应商文件，故意写上一条指令，要求系统披露无关的内部文件，然后看它是否只把文件当证据、守住任务授权、不把内容泄出去。还可以在流程走到一半时，撤销用户对某份文件的访问权限，再看后面怎么做。这些是建议拿来测试的情境，不是对Gemini漏洞或具体防护能力的报道。记录若要有用，得留下相关输入、授权范围、实际动作，以及复核者的判断，其他团队才核对得了。这样做，是在用NIST关于情境化测试和记录风险测量的原则。[^3][^4]

![Google Cloud首席执行官Thomas Kurian的官方肖像资料图](/news-media/2026-10-09/google-gemini-work-agents-2026-10-09-kurian.png)

*Google Cloud首席执行官Thomas Kurian的官方肖像资料图。[Source: Google](https://blog.google/image-library/)。*

## 衡量完成的工作，也计算人的投入

NIST建议在接近部署环境的条件下测试，并记下结果能够推广的边界。《生成式人工智能概况》写得很明确：不应从范围狭窄或零散的评估推导广泛能力。引用要检查。人的专业知识如何改善系统表现，也要看。演示成功一次，撑不起全组织的部署决定。[^3][^4]

一种做得下去的办法，是固定一组有代表性的任务，动手之前就把验收标准定下来。做供应商比较时，可以要求每一项实质性陈述都对上获准来源；缺了的信息，必须明确保留为待核实。复核者可以分开记：完成了没有，哪些陈述没有依据，有没有越权动作，一共花了多久，人插手了多长时间，纠错又占了多少工作量。同一组任务再跑一遍，才能看出好结果是否还能出现。拿去和现有的人工流程比，才能谈效益。生成得更快，并不等于总工作量更少。这是在用NIST的测量原则，不是NIST规定好的评测基准。[^3][^4]

经济账也按这个办法查。进一步的编辑建议是：只拿真正达到验收标准的工作来比，把供应商费用、集成投入、人工复核和纠错成本放在一起。本文没有据此估算任何节省幅度。单次响应即便便宜，流程若要反复尝试或大量检查，总成本仍可能较高。这是试点应调查的条件，并非针对该产品的实测结果。

## 试点结束后，责任仍然持续

框架里的MANAGE功能，管的是已经识别出的风险怎么应对，也包括一件具体的事：系统表现一旦偏离预定用途，要能够停下来，或者把系统停用。《生成式人工智能概况》在此之外还列出部署后的监测、事件处理、恢复和变更管理。批准部署不是一次就结束的责任。模型换了，接进去的数据源换了，工作流程改了，测试都得跟着继续适用。[^3][^4]

范围先收窄，部署才好安排。谁负责，哪些决定必须由人复核，什么情况下把流程停掉，出了问题怎样恢复，都可以事先写明。这些是依照指引作出的实施选择。过程中留下的证据，可以用来支持扩大、修改，或者否决部署。本文没有证实该产品在各地区的可用性、连接器覆盖、实测可靠性，以及对具体法律制度的合规性。这几项都要各自的证据。实际的结论是，先拿界限清楚的任务把结果记下来并检验过，再考虑把更多权限交给任何企业代理。[^3][^4]

[^1]: 2026-10-08 · [Google Cloud推出Gemini代理](https://blog.google/innovation-and-ai/infrastructure-and-cloud/google-cloud/gemini-at-work/) · Google

[^2]: 2026-10-08 · [欢迎来到Gemini at Work 2026：介绍Gemini代理](https://cloud.google.com/blog/products/ai-machine-learning/welcome-to-gemini-at-work-2026) · Google Cloud，Thomas Kurian

[^3]: 2023-01-26 · Elham Tabassi · [人工智能风险管理框架（AI RMF 1.0）](https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.100-1.pdf) · NIST AI 100-1，重点参见5.1—5.4节。2026-10-15依据[NIST再利用条款](https://www.nist.gov/open/copyright-fair-use-and-licensing-statements-srd-data-software-and-technical-series-publications)为本文摘述、翻译并作应用性改编。承美国国家标准与技术研究院许可转载（Republished courtesy of the National Institute of Standards and Technology）。

[^4]: 2024-07-26 · NIST · [人工智能风险管理框架：生成式人工智能概况](https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf) · NIST AI 600-1，2.2、2.4、2.9节；MEASURE 2.3、2.5、2.7；MANAGE 4.1。2026-10-15依据[NIST再利用条款](https://www.nist.gov/open/copyright-fair-use-and-licensing-statements-srd-data-software-and-technical-series-publications)为本文摘述、翻译并作应用性改编。承美国国家标准与技术研究院许可转载（Republished courtesy of the National Institute of Standards and Technology）。
