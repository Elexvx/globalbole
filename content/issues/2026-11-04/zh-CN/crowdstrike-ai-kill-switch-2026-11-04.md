---
title: "CrowdStrike 推出 AI 智能体“紧急停止”控制：目前先切断模型访问"
slug: "crowdstrike-ai-kill-switch-2026-11-04"
translationKey: "crowdstrike-ai-kill-switch-2026-11-04"
issue: "2026-11-04"
lang: "zh-CN"
category: "technology"
author: "全球伯乐 News"
authorRole: "资料整理"
date: "2026-11-04"
description: "CrowdStrike 公布 Falcon Guardian 新功能。当前的 AI Kill Switch 首先在网关层阻断未经授权的智能体访问模型；跨终端、云与身份系统的联动处置仍属于未来计划。"
cover: "/news-media/2026-11-04/air-force-cyber-operations-2018-biermann.jpg"
coverAlt: "资料图：第624作战中心的一名军人在多台电脑显示器前接听电话"
tags: ["人工智能", "网络安全"]
readTime: 5
draft: false
---

![资料图：第624作战中心的一名军人在多台电脑显示器前接听电话](/news-media/2026-11-04/air-force-cyber-operations-2018-biermann.jpg)

2018年10月23日，美国得克萨斯州圣安东尼奥联合基地拉克兰营区，第624作战中心工作人员执行网络任务。资料图。 并非CrowdStrike设施或产品演示。 摄影: [U.S. Air Force / Tech. Sgt. R.J. Biermann](https://commons.wikimedia.org/wiki/File:AFCYBER_Airmen_reach_%E2%80%98firsts%E2%80%99_in_global_exercises_(5267410).jpg) · [美国公有领域；使用说明](https://www.dvidshub.net/about/copyright). 使用美国战争部（DoW）影像资料不表示或构成该部门的认可或背书。


## 当前控制从模型访问入口执行

企业把 AI 智能体接入代码、文件和业务系统后，安全问题不再只是提示词内容是否可疑，还包括智能体最终调用了什么工具、使用了什么权限，以及能否在异常行为出现时被及时阻断。CrowdStrike 11 月 3 日宣布在 Falcon Guardian 中加入 **AI Kill Switch**，并扩展智能体层钩子、端点网络检查等控制。公司此前已于 9 月提供 Guardian；本次报道的新内容是功能与可用状态的更新，不是把旧产品重新写成首次发布。[^1]

按公司技术说明，现已提供的“停止”动作首先通过 AI 网关执行：安全团队可令连接的网关阻断智能体访问其依赖的模型。Falcon AI Gateway 现已普遍提供，也可接入第三方网关。这个机制可以中断依靠该访问路径继续推理的工作流，但**并不等于目前已经能在所有终端、浏览器、云服务和 SaaS 环境一键终止智能体进程**。公司明确把更广范围的协调处置列为后续功能。[^1][^2]

## 平台支持与未来能力须分开评估

其他功能同样要分清进度：公司称端点网络检查在 **Windows** 上已普遍提供，在 **Mac** 上仍为早期访问；“智能体身份”控制则用将来时描述。公司还宣布了收购 Fiddler AI 的意向，以补充智能体可观测能力。现有公告不能当作交易已经完成，也不能据产品描述断言其检出率或误报率已经过独立验证。[^1]

这次发布反映出安全产品的控制点正在从“读懂提示词”延伸到网关通信和端点实际执行。采购或评估此类工具时应把宣传中的完整架构拆成当前已交付功能、特定操作系统支持、试用阶段功能和并购后才可能整合的能力；尤其要检验智能体是否可以绕开受控网关、以及阻断模型访问后已经发出的工具调用如何处理。公司公告没有给出足以回答这些问题的独立测试数据。

[^1]: 2026-11-03 · [CrowdStrike Delivers AI Security and Safety for the Enterprise](https://www.crowdstrike.com/en-us/press-releases/crowdstrike-delivers-ai-security-safety-for-the-enterprise/) · CrowdStrike。

[^2]: 2026-11-03 · [Introducing AI Kill Switch: Taking Control When AI Agents Go Rogue](https://www.crowdstrike.com/en-us/blog/crowdstrike-introduces-ai-kill-switch/) · CrowdStrike。文末明确提示未发布功能仍可能变化。
