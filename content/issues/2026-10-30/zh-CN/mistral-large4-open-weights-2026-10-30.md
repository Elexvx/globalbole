---
title: "Mistral Large 4 权重可供部署：控制权与许可边界"
slug: "mistral-large4-open-weights-2026-10-30"
translationKey: "mistral-large4-open-weights-2026-10-30"
issue: "2026-10-30"
lang: "zh-CN"
category: "technology"
author: "全球伯乐 News"
authorRole: "资料整理"
date: "2026-10-30"
description: "Large 4 提供可下载权重。部署控制权扩大，但硬件、独立测试和附条件许可仍决定实际使用边界。"
cover: "/news-media/2026-10-30/nersc-server-rack.jpg"
coverAlt: "NERSC 数据中心机架背面的资料照片，不是 Mistral 设施。"
tags: ["人工智能", "开放权重", "模型部署"]
readTime: 6
draft: false
---

Mistral 在 10 月 6 日公布 Large 4 预览 API，预告月底开放权重。[^3] Hugging Face 于 10 月 29 日介绍权重可用。[^2] 开发者模型库现已列出可下载文件、部署说明与许可。[^1]

![NERSC 数据中心机架背面的资料照片，不是 Mistral 设施。](/news-media/2026-10-30/nersc-server-rack.jpg)

资料图：2011 年 10 月 14 日，NERSC 数据中心。[Rear of rack at NERSC data center - closeup](https://commons.wikimedia.org/wiki/File:Rear_of_rack_at_NERSC_data_center_-_closeup.jpg)，摄影：[Chiara Coetzee](https://www.flickr.com/photos/dcoetzee/6271241131/)；[CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/)。

## 模型规模不等于每次运行的成本

开发者模型文档说明，Large 4 采用混合专家架构，参数总量约一万亿，每个词元实际启用约 490 亿参数；若计入嵌入及输出层，活跃参数约 520 亿。模型接收文字和图像、输出文字，标称上下文长度为 100 万词元。官方提供 FP8 与另一个 NVFP4 检查点；后者面向 Blackwell GPU，开发者称其可减少显存需求。[^1]

这些是模型设计与支持能力的说明，不意味着每个组织都能以低成本处理满长上下文。部署所需硬件、显存、吞吐量和实际费用，仍取决于权重量化版本与运行配置。总参数、每个词元启用的参数以及上下文容量回答不同问题，不能把其中一个数当成完整的服务成本指标。

## 自行部署同时带来治理责任

公开权重改变的是控制边界：企业可以在许可允许的范围内，在自有或选定环境中运行模型，并对数据流、模型配置和可用性作更多安排。更强的自主性也把访问管理、日志、模型更新与滥用防护责任交给部署者。

模型文档提供编程等基准结果，并介绍网络安全能力。这些属于开发者公布的表现，不是本站独立复现；基准成绩不等于任意生产环境中的发现率、修复质量或安全保证。[^1] 决策前仍要用实际任务测试，区分模型是否给出可用答案、系统是否正确执行，以及错误能否被发现和限制。

## 开放权重仍受具体许可约束

模型及相关文档采用 Mistral Ecosystem Open-Weight License，这是带有附加条件的修改版 MIT 许可，不能简写成无条件的 MIT 或 Apache 开源。条款允许相应使用、复制、修改和部署，同时要求在副本或实质部分中保留版权及许可通知。[^4]

若许可使用者或其关联方经营条款所定义的“模型即服务”业务，除第三条规定的例外外，将模型或其衍生作品用于任何商业目的之前，须另行取得 Mistral 商业许可。条款定义聚焦于第三方能对输入、参数或训练数据行使实质控制的模型访问；仅在特定功能中嵌入模型的终端产品、单纯转发其他托管模型请求不在该定义内，内部使用与通过 Mistral 官方产品访问另有例外。不能把这概括成所有托管或所有商业使用一律受同一种限制。[^4]

这次发布对希望自行部署大模型的机构有实际意义；采购或上线判断仍须核对许可、硬件预算、独立测试及安全治理，而不能仅凭参数规模或排行榜下结论。本文对模型文档作了编辑整理与翻译，保留其署名通知：**2026 - Mistral**；[完整原始许可通知](/news-sources/2026-10-30/mistral-ecosystem-open-weight-license.txt)。这不表示 Mistral 对本文提供背书。

## 原始许可通知（英文）

> Mistral Ecosystem Open-Weight License 
>
> Mistral Ecosystem Open-Weight License. This license is a modified version of the MIT license. 
> Attribution notice: 2026 - Mistral 
>
> Permission is hereby granted, free of charge, to any person (the “Licensee”) obtaining a copy of this model and associated documentation files - including the model weights, parameters, configuration files, and associated documentation (the “Model”), to deal in the Model without restriction, including without limitation the rights to (a) use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Model; (b) run, deploy, further train or otherwise modify the Model and create derivative works from it; and (c) permit persons to whom the Model is furnished to do so, subject to the following conditions: 
>
> 1. The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Model. 
>
> 2. If the Licensee or any of its affiliates operates a Model as a Service business, the Licensee must enter into a separate commercial license with Mistral before using the Model or its derivative works for any commercial purpose. The Licensee may contact Mistral, using this form: https://mistral.ai/contact/, to request a commercial license. 
>
> "Model as a Service" means giving a third party access to the Model or its derivative works for inference or post-training by any means (for instance via API or hosted endpoints), in a manner that allows such third party to exercise meaningful control over the inputs, parameters, or training data. This does not include (a) end-user products with model capabilities solely embedded within specific features or harnesses, or (b) mere relaying of requests to models hosted by others. 
>
> 3. The requirements set forth in Section 2 do not apply to: (a) internal use of the Model or its derivative works, defined as any use that does not make the Model or its derivative works available to third parties; or (b) any use of the Model accessed through Mistral’s official products. 
>
> THE MODEL AND ANY OUTPUT THEREFROM ARE PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL MISTRAL BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE MODEL OR THE USE OR OTHER DEALINGS IN THE MODEL.
>
> For any questions regarding this license, please contact us using the form here: https://mistral.ai/contact/

[^1]: 模型文档未标明固定发布日期 · [Mistral Large 4 - Le Chonk](https://huggingface.co/mistralai/Mistral-Large-4-1T-A52B/blob/f12dabdc0c1e99e7f7924461a6f308859b05af4d/README.md) · Mistral AI；使用已核对的固定版本文档，参数、能力及测试表述均为开发者说明。
[^2]: 2026-10-29 · [Welcome Le Chonk: Mistral Large 4 on Hugging Face](https://huggingface.co/blog/mistral-large4) · Hugging Face.
[^3]: 2026-10-06 · [Introducing Mistral Large 4](https://mistral.ai/news/mistral-large-4/) · Mistral AI.
[^4]: 许可文件未标明固定发布日期 · [Mistral Ecosystem Open-Weight License](https://huggingface.co/mistralai/Mistral-Large-4-1T-A52B/blob/f12dabdc0c1e99e7f7924461a6f308859b05af4d/LICENSE) · Mistral AI；具体权利与例外以完整原始条款为准。
