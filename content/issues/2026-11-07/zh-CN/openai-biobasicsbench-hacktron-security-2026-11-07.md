---
title: "OpenAI发布100项湿实验基准BioBasicsBench，并与Hacktron合作排查跨系统连接漏洞"
slug: "openai-biobasicsbench-hacktron-security-2026-11-07"
translationKey: "openai-biobasicsbench-hacktron-security-2026-11-07"
issue: "2026-11-07"
lang: "zh-CN"
category: "technology"
author: "全球伯乐 News"
authorRole: "资料整理"
date: "2026-11-07"
description: "OpenAI联合Ligo构建基于真实实验原始数据的BioBasicsBench，GPT-6 Astra最高得分为66.7%但仍会出现凝胶条带误判；同日宣布与曾发现其论坛RCE漏洞的Hacktron展开红队合作。"
cover: "/news-media/2026-11-07/openai-biobasicsbench-security-editorial.webp"
coverAlt: "AI生成概念示意图：以嵌套透明防护罩内的芯片与培养皿、断开的连接线及放大镜表现人工智能湿实验评测与系统边界安全防护，并非真实实验室或产品界面。"
tags: ["人工智能", "AI安全", "企业软件"]
readTime: 5
draft: false
---

![AI生成概念示意图：以嵌套透明防护罩内的芯片与培养皿、断开的连接线及放大镜表现人工智能湿实验评测与系统边界安全防护，并非真实实验室或产品界面。](/news-media/2026-11-07/openai-biobasicsbench-security-editorial.webp)

AI生成概念示意图：以嵌套透明防护罩内的芯片与培养皿、断开的连接线及放大镜表现人工智能湿实验评测与系统边界安全防护，并非真实实验室或产品界面。

## BioBasicsBench以100项真实湿实验原始数据测试模型，GPT-6 Astra平均得分66.7%但仍会误读凝胶与菌落

OpenAI于2026年11月6日发布题为《衡量AI智能体如何处理日常湿实验科学》的研究公告，联合酶设计生物技术初创公司 Ligo Biosciences 推出包含**100项任务**的 **BioBasicsBench** 基准。与依赖论文精修图表的传统评测不同，该基准全部取材于研究人员日常湿实验产生的原始数据，涵盖凝胶与印迹图像（**31项**）、实验方案与手写或电子实验记录（**27项**）、酶标仪表格与流式细胞术原始导出文件（**20项**），以及琼脂平板菌落照片、显微镜Z轴层扫序列（z-stacks）、测序读段和实验台操作视频；按实验领域分为蛋白质方法（25项）、成像与流式细胞术（23项）、定量与测定（19项）、核酸方法（17项）及分子克隆（16项）。OpenAI对两代共7款内部模型在37种模型与推理强度组合下各运行5次，总计完成**18500次**评分测试。[^1]

在最高推理强度（`xhigh`）下，**GPT-6 Astra** 取得**66.7%**的平均得分（95%置信区间为60.3%至73.1%，单任务平均输出4704个token），高于 **GPT-6.1 Sol**（**62.0%**）、**GPT-5.6 Sol**（**43.8%**）、**GPT-6 Luna**（**38.3%**）、**GPT-5.5**（**35.4%**）、**GPT-5.4**（**33.2%**）及 **GPT-5.2**（**31.2%**，单任务输出27620个token）。在多模态细节识别上，GPT-6 Astra 能够放大读取培养皿边缘手写的 `LB Kan50` 标签并发现卡那霉素对照平板与氨苄青霉素实验不匹配，也能识别525至540纳米波段的荧光通道串色；但OpenAI同时披露了典型失败案例：在菌落PCR琼脂糖凝胶分析中，GPT-6 Astra 虽正确区分了两组条带，却因先入为主假设“条带更大代表插入成功”，错误推荐了携带旧质粒骨架的**4、6、7、8号**菌落而非正确的**5、9、10号**菌落；在转化平板计数中则因合并相邻菌落及误标空白琼脂导致**净高估约12%**，进而将DNA转化效率同步高估12%。[^1]

## OpenAI与Hacktron达成攻防测试合作并开放Daybreak Red权限，聚焦第三方服务连接边界

同在11月6日，OpenAI宣布与旧金山AI网络安全初创公司 **Hacktron** 建立正式攻防安全合作伙伴关系，并向其扩大开放受控前沿网络安全模型层级 **Daybreak Red** 的访问权限（需经身份核验、法律声明、活动监控及沙盒权限控制）。双方工程师与安全研究员将共同选定高优先级测试目标，重点排查 OpenAI 自身系统、云基础设施及身份认证层在与**第三方外部服务和联网AI智能体**交互边界上的复杂漏洞；来自安全研究机构 Cathedral 的研究人员也将加入下一轮安全冲刺。[^2]

此次合作源于 Hacktron 此前通过漏洞悬赏计划提交的高危漏洞披露。据 Hacktron 于2026年9月13日公开的技术报告，其研究员于2026年7月23日至25日在不到72小时内，利用 OpenAI 开发者论坛（`community.openai.com`，基于 Discourse）中 ImageMagick 调用的 `libheif`（1.19.7版本）未回植安全补丁缺陷，通过上传特制 `.heic` 图像实现远程代码执行（RCE），并进一步串联 `auth.openai.com` 单点登录（SSO）配置缺陷实现零交互接管活跃论坛用户的 ChatGPT 与 Codex 账户，于7月25日在内部仓库提交了仅修改 `README.md` 的概念验证请求（PR #1186742）；OpenAI 在约**14小时**内完成修复并支付了**6500美元**悬赏金。在解读11月6日的两项发布时需注意：BioBasicsBench 目前仅评测了 OpenAI 内部模型，**未公布人类科学家得分基线、外部模型对比或开源数据集仓库**；而 Hacktron 合作公告属于攻防测试机制建设，并未披露该正式合作启动后新发现的具体漏洞数量。[^1][^2][^3]

[^1]: 2026-11-06 · [Measuring how AI agents handle everyday wet-lab science](https://openai.com/index/measuring-how-ai-agents-handle-wet-lab-science/) · OpenAI.
[^2]: 2026-11-06 · [Partnering with Hacktron to find vulnerabilities in OpenAI's systems](https://openai.com/index/partnering-with-hacktron/) · OpenAI.
[^3]: 2026-09-13 · [Hacking OpenAI](https://www.hacktron.ai/blog/hacking-openai) · Hacktron.
