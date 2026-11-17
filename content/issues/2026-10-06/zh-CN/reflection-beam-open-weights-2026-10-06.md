---
title: "Reflection公布Beam：5010亿总参数，开放权重仍待本月交付"
slug: "reflection-beam-open-weights-2026-10-06"
translationKey: "reflection-beam-open-weights-2026-10-06"
issue: "2026-10-06"
lang: "zh-CN"
category: "technology"
author: "全球伯乐 News"
authorRole: "资料整理"
date: "2026-10-06"
description: "Beam以230亿激活参数瞄准编程和智能体任务，权重拟于10月开放。公司效率比较未计入全部服务开销，API目前仍处于测试阶段。"
seoTitle: "Reflection发布Beam：5010亿参数，开放权重计划10月推出"
seoDescription: "Beam有230亿激活参数，面向编程和智能体任务；公司计划10月开放权重，效率估算未计入全部服务成本，API仍在测试。"
cover: "/news-media/2026-10-06/beam-editorial.png"
coverAlt: "AI生成示意图：深蓝模块围绕明亮核心，表现模型计算与开放主题"
tags: ["人工智能", "基础设施"]
readTime: 4
draft: false
---

英伟达支持的美国人工智能公司Reflection AI于10月5日公布首款模型Beam，面向编程、推理和智能体任务。模型采用稀疏混合专家架构，总参数为5010亿，每个词元激活约230亿参数。公司把它定位为中国开放权重模型之外的新选择。路透社的报道，也把这次发布放在DeepSeek、Kimi等模型的竞争背景里。[^1][^2]

![AI生成示意图：深蓝模块围绕明亮核心，表现模型计算与开放主题](/news-media/2026-10-06/beam-editorial.png)

*AI生成示意图：深蓝模块围绕明亮核心，表现模型计算与开放主题。*

## 权重尚待发布

Reflection把这次发布定位为预览，Beam仍在完成红队测试与评估。公司计划先向部分用户开放，并在10月发布权重、技术报告、模型卡及开发工具，权重拟采用Apache 2.0许可。权重眼下还不能下载。预览本身，也证明不了模型已经适合全面投入生产部署。[^1]

## 效率与成绩要分开看

Reflection称，Beam在部分推理测试上接近GLM-5.2，所需推理计算量约为对方的三分之一至四分之一。这个估算只按激活参数和生成词元数来算，没有计入输入预处理、随上下文变化的注意力计算，也没有计入服务开销，不能直接换成用户账单。[^1]

公司列出的Terminal-Bench 2.1成绩为Beam 80.1、GLM-5.2 81.0。效率高不高，和这项测试的得分高不高，是两件不同的事。发布方自己的评测汇总，替代不了外部复测。企业得先核对测试条件与自身任务是否相符，再判断分数差距有没有实际意义，不宜只拿一个总分来选定模型。[^1]

## API仍处测试阶段

接入方面，官方开发文档显示，Reflection API处于测试阶段，采用候补名单逐步开放，行为和限制仍可能调整。接口提供与OpenAI兼容的Chat Completions和Models功能。已经写过相关调用代码的开发者，可以沿用一部分工具链；接口兼容，并不代表服务能力、可用性和费用完全相同。[^3] 官方Models页面目前标注，模型上下文窗口为256K，最大输出为128K词元，并提醒测试期间上下文限制可能变化。上下文额度同时覆盖输入和生成输出，超限请求会被拒绝，不会自动截断。长文档再加上多轮工具调用，开发者需要给输出和推理留出空间。[^5]

开发文档还说明，Beam始终进行推理，支持五档推理强度，默认采用中档。把强度调高，通常就要多用词元，等待也更长；推理词元同样计入输出预算。输出额度如果定得过低，模型可能在推理阶段就把额度用完，交出来的答案是空的。需要连续调用工具的应用，会碰到这类边界。它和总参数规模一样，都会影响工程上的体验。[^4]

## 从预览走向实际交付

对企业来说，Beam多了一个值得拿去测试的选项，采购仍得回到具体工作负载上。开放权重的承诺兑现之后，团队才能把部署要求、许可条件、任务成功率与成本核得更完整。现阶段能够确认的信号，是一个新的模型供应者进入赛场。服务能否稳定、是否经济，还要等实际交付来回答。

[^1]: 2026-10-05 · [介绍Beam：Reflection的5010亿参数开放权重模型](https://reflection.ai/blog/introducing-beam) · Reflection · 原题：Introducing Beam: Reflection’s 501B open-weight model

[^2]: 2026-10-05 · [英伟达支持的Reflection推出首款AI模型，挑战中国开放模型](https://www.investing.com/news/stock-market-news/nvidiabacked-reflection-unveils-first-ai-model-to-take-on-chinese-open-models-4932928) · Reuters / Investing.com · 原题：Nvidia-backed Reflection unveils first AI model to take on Chinese open models

[^3]: 未注明发布日期，访问于2026-10-06 · [开发文档导言](https://developers.reflection.ai/introduction) · Reflection Developer Docs · 原题：Introduction

[^4]: 未注明发布日期，访问于2026-10-06 · [推理](https://developers.reflection.ai/reasoning) · Reflection Developer Docs · 原题：Reasoning

[^5]: 未注明发布日期，访问于2026-10-06 · [模型](https://developers.reflection.ai/models.md) · Reflection Developer Docs · 原题：Models
