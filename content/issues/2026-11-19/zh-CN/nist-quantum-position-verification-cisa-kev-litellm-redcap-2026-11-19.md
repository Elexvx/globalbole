---
title: "美国国家标准与技术研究院验证首套完整量子位置认证协议，网络安全局紧急通报大模型网关与科研平台在野利用漏洞"
slug: "nist-quantum-position-verification-cisa-kev-litellm-redcap-2026-11-19"
translationKey: "nist-quantum-position-verification-cisa-kev-litellm-redcap-2026-11-19"
issue: "2026-11-19"
lang: "zh-CN"
category: "technology"
author: "全球伯乐 News"
authorRole: "资料整理"
date: "2026-11-19"
description: "美国国家标准与技术研究院在《自然》发表首套基于纠缠光子与无漏洞贝尔测试的完整量子位置认证实验，美国网络安全和基础设施安全局同日将 BerriAI LiteLLM 与 REDCap 等四项高危漏洞列入已知被利用漏洞目录。"
cover: "/news-media/2026-11-19/nist-quantum-position-verification-2026-11-18.jpg"
coverAlt: "美国国家标准与技术研究院研究人员 Krister Shalm（左）与 Marty Stevens 佩戴激光护目镜将纠缠光子导入光纤的实验现场照片"
tags: ["人工智能","网络安全","科技政策"]
readTime: 5
draft: false
---

当地时间2026年11月18日，[美国国家标准与技术研究院（NIST）](https://www.nist.gov/news-events/news/2026/11/quantum-physics-can-verify-persons-location-nist-researchers-show)正式公布全球首套使用远程非受信任设备的完整量子位置认证（Quantum Position Verification, QPV）实验成果；同日，[美国网络安全和基础设施安全局（CISA）](https://www.cisa.gov/news-events/alerts/2026/11/18/cisa-adds-four-known-exploited-vulnerabilities-catalog)将开源大模型代理网关 BerriAI LiteLLM 与临床科研电子数据采集系统 REDCap 等四项正在遭受在野利用的漏洞增补进已知被利用漏洞（KEV）目录。这两项同日发布的权威公告，分别从下一代量子物理层身份校验与当下人工智能及科研软件供应链应急防御两个维度，揭示了关键数字基础设施安全架构的深刻演进[^1][^2]。

![美国国家标准与技术研究院研究人员 Krister Shalm（左）与 Marty Stevens 佩戴激光护目镜将纠缠光子导入光纤的实验现场照片](/news-media/2026-11-19/nist-quantum-position-verification-2026-11-18.jpg)

美国国家标准与技术研究院（NIST）研究人员克里斯特·沙尔姆（Krister Shalm，左）与马蒂·史蒂文斯（Marty Stevens）使用光学组件将纠缠光子导入光纤，用于验证远程当事方的真实物理位置。摄影：Riley Wilson/NIST；图源：[NIST 官方新闻公报](https://www.nist.gov/news-events/news/2026/11/quantum-physics-can-verify-persons-location-nist-researchers-show)，[美国联邦政府公有领域作品及使用说明](https://www.nist.gov/oism/copyrights)。使用此图不代表 NIST 或美国政府认可本站。

## 量子纠缠与光速三角测距构筑不可伪造的物理位置凭证

在发表于《自然》（*Nature*，论文编号 `DOI: 10.1038/s41586-026-11247-3`）的研究中，由高塔姆·卡武里（Gautam Kavuri）、斯科特·格兰西（Scott Glancy）与克里斯特·沙尔姆（Krister Shalm）领衔的[美国国家标准与技术研究院研究团队](https://www.nist.gov/news-events/news/2026/11/quantum-physics-can-verify-persons-location-nist-researchers-show)，在科罗拉多州博尔德实验室相距195米的两个地面验证站之间完成了首套完整量子位置认证协议测试。研究指出，2024年美国网络犯罪造成的经济损失已超过160亿美元，而由于攻击者普遍通过跳板隐藏真实物理位置，跨国网络犯罪的缉捕归案率不足1%。传统加密协议仅能验证密钥持有者身份，却无法阻止远程黑客窃取凭证后伪装成合法终端；量子位置认证则将用户所处的精确地理坐标直接转化为不可伪造的密码学访问前提[^1]。

该实验巧妙融合了量子力学不可克隆定理（No-Cloning Theorem）、光速通信上限与无漏洞贝尔测试（Loophole-Free Bell Test）。两个验证站以严格同步的时间戳向居中待验证节点发送经典比特信号与纠缠光子，待验证终端必须在光速传播设定的微秒级时间窗口内完成单光子测量并向两侧回传结果。得益于超导纳米线单光子探测器（SNSPD）极高的光子捕获效率，即便验证方完全不信任终端侧硬件，任何试图在外部拦截、复制量子态或串谋伪造位置的中间人攻击都会不可避免地破坏量子纠缠相关性或超出光速往返时限。实验在数百万次重复测试中均实现了稳健的位置真实性校验，为未来金融机构异地交易拦截、关键政务终端物理围栏以及量子互联网节点互信奠定了实验基石[^1]。

## 人工智能网关与临床科研数据平台遭遇在野漏洞攻击

在量子安全协议加速迈向工程化的同时，当前广泛部署的人工智能中间层与科研数据系统正面临严峻的传统漏洞冲击。[美国网络安全和基础设施安全局发布的11月18日安全警报](https://www.cisa.gov/news-events/alerts/2026/11/18/cisa-adds-four-known-exploited-vulnerabilities-catalog)显示，四项被确认存在活跃在野利用的漏洞已被正式写入 KEV 目录，其中包括开源大模型统一调用网关 BerriAI LiteLLM 的未受保护备用通道漏洞（`CVE-2026-40217`），以及范德堡大学研发的科研电子数据采集平台 REDCap 的代码注入漏洞（`CVE-2026-90817`）。由于 LiteLLM 被大量企业用于统一编排和路由多种大语言模型 API 密钥，而 REDCap 支撑着全球数千家医学院校与公共卫生机构的临床试验数据库，这两项漏洞的在野利用直接威胁到企业人工智能凭证安全与敏感生物医学数据资产[^2]。

除上述两项新型应用层漏洞外，[美国网络安全和基础设施安全局](https://www.cisa.gov/news-events/alerts/2026/11/18/cisa-adds-four-known-exploited-vulnerabilities-catalog)同批次列入目录的还包括群晖科技（Synology）DiskStation Manager（DSM）网络附属存储操作系统的输出编码或转义不当漏洞（`CVE-2024-10441`），以及遗留企业级 Web 服务框架 Apache Axis 的不安全反射漏洞（`CVE-2026-90436`）。根据具有强制约束力的《第26-04号约束性运行指令》（BOD 26-04：《基于风险优先执行安全更新》），美国所有联邦民事行政部门（FCEB）必须在规定期限内完成补丁修复或立即停用受影响组件。网络安全监管机构同时敦促全球私营云服务商、科研院所与人工智能开发者立即排查模型网关与存储节点的暴露面，建立纵深防御机制[^2]。

[^1]: 2026-11-18 · [Quantum Physics Can Verify a Person's Location, NIST Researchers Show](https://www.nist.gov/news-events/news/2026/11/quantum-physics-can-verify-persons-location-nist-researchers-show) · 美国国家标准与技术研究院（NIST）.
[^2]: 2026-11-18 · [CISA Adds Four Known Exploited Vulnerabilities to Catalog](https://www.cisa.gov/news-events/alerts/2026/11/18/cisa-adds-four-known-exploited-vulnerabilities-catalog) · 美国网络安全和基础设施安全局（CISA）.
