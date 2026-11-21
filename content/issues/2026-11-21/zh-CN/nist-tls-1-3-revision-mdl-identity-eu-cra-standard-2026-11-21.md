---
title: "NIST启动TLS 1.3后量子修订与移动驾照SP 1800-42指南，欧盟发布首部《网络韧性法案》通用标准并成立EDU-EDIC数字教育联盟"
slug: "nist-tls-1-3-revision-mdl-identity-eu-cra-standard-2026-11-21"
translationKey: "nist-tls-1-3-revision-mdl-identity-eu-cra-standard-2026-11-21"
issue: "2026-11-21"
lang: "zh-CN"
category: "technology"
author: "全球伯乐 News"
authorRole: "资料整理"
date: "2026-11-21"
description: "美国国家标准与技术研究院宣布修订SP 800-52 Rev. 2以推进TLS 1.3与后量子算法并发布移动驾照在线身份验证指南SP 1800-42草案；欧盟委员会同期发布支持《网络韧性法案》的首部欧洲水平安全标准，并联合八个成员国在海牙正式启动欧洲教育数字基础设施联盟（EDU-EDIC）。"
cover: "/news-media/2026-11-21/nist-tls-1-3-revision-mdl-identity-eu-cra-standard-2026-11-21-editorial.webp"
coverAlt: "深色磨光玄武岩平板底座上摆放透明光学玻璃立方体、无标钛金属钥匙胚与黄铜连接器的静物摄影"
tags: ["人工智能","网络安全","科技政策"]
readTime: 5
draft: false
---

2026年11月19日至20日，跨大西洋网络安全与数字基础设施标准机构连续推出四项核心技术规范与多国协作架构。[美国国家标准与技术研究院（NIST）计算机安全资源中心](https://csrc.nist.gov/News/2026/nist-will-revise-tls-guidelines)正式宣布修订《传输层安全（TLS）实现的选择、配置与使用指南》（SP 800-52 Rev. 2），同时由国家网络安全卓越中心（NCCoE）发布[《数字身份——移动驾驶证（mDL）：实现安全与互操作的在线使用》（NIST SP 1800-42）公开征求意见草案](https://www.nist.gov/news-events/news/2026/11/nist-project-aims-accelerate-mobile-drivers-license-adoption)。在欧洲，[欧盟委员会数字战略司](https://digital-strategy.ec.europa.eu/en/news/first-european-standard-published-support-cyber-resilience-act)公布了支撑《网络韧性法案》（Cyber Resilience Act）落地的首部欧洲水平标准，并于11月20日会同八个成员国正式启动[欧洲教育数字基础设施联盟（EDU-EDIC）](https://digital-strategy.ec.europa.eu/en/news/member-states-join-forces-develop-sovereign-digital-infrastructure-education)，从传输层加密协议、可验证数字凭证、软硬件全生命周期合规到主权教育云全面收紧安全基线[^1][^2][^3][^4]。

![深色磨光玄武岩平板底座上摆放透明光学玻璃立方体、无标钛金属钥匙胚与黄铜连接器的静物摄影](/news-media/2026-11-21/nist-tls-1-3-revision-mdl-identity-eu-cra-standard-2026-11-21-editorial.webp)

AI生成概念示意图：深色磨光玄武岩平板底座上的切面透明光学玻璃立方体、无字拉丝钛金属几何钥匙胚与精密黄铜同轴连接器静物，象征传输层安全（TLS 1.3）后量子密码迁移、移动驾驶证在线身份核验以及欧盟《网络韧性法案》全生命周期安全标准与数字教育主权基建，并非美国国家标准与技术研究院或欧盟委员会现场照片。

## NIST收紧TLS 1.2淘汰时间表并联合美五大银行验证移动驾照在线核验架构

根据[NIST发布的SP 800-52 Rev. 2修订公告](https://csrc.nist.gov/News/2026/nist-will-revise-tls-guidelines)，本次修订基于2026年5月密码出版物审查委员会收集的行业反馈，对2019年发布的现行版本作出结构性升级。新版指南把联邦服务器对TLS 1.2的支持要求从“应当支持（should）”降级为“可以支持（may）”，严禁使用TLS 1.0与TLS 1.1，并由密码模块验证计划（CMVP）设定过渡时间表，逾期继续使用TLS 1.2必须提交严格的技术正当性说明。指南将全面对齐互联网工程任务组（IETF）最新发布的`RFC 9846`版TLS 1.3规范，彻底废弃使用SHA-1、DSA、静态密钥交换或RSA密钥交换的TLS 1.2密码套件，把最低安全强度提升至128位，强制要求采用认证加密关联数据（AEAD）模式，并首次纳入后量子密码（PQC）算法配置规范[^1]。

在应用层数字身份领域，[NIST关于移动驾驶证（mDL）项目的官方公报](https://www.nist.gov/news-events/news/2026/11/nist-project-aims-accelerate-mobile-drivers-license-adoption)指出，目前美国已有22个州和地区运行移动驾照项目，至少500万张移动驾照投入实际使用，覆盖约47%的美国人口准入范围。由NIST安全工程师比尔·费舍尔（Bill Fisher）牵头的NCCoE项目联合科技厂商、政府机构及美国前十大银行中的五家大型金融机构，搭建了基于商用现货（COTS）组件的参考架构，重点打通三大金融与政务高风险场景：远程开户在线身份核验、大额交易与账户恢复的阶梯式增强验证，以及绑定抗钓鱼身份验证器（如通行密钥Passkey）的凭证签发。该`NIST SP 1800-42`草案同步结合《NIST隐私框架》与`NIST SP 800-53 Rev. 5`提出最小必要属性披露等七项可用性最佳实践，公众意见征集将持续至2026年12月20日[^2]。

## 欧盟颁布首部《网络韧性法案》全周期标准并落地八国EDU-EDIC数字教育主权联盟

在硬件与软件供应链合规方面，[欧盟委员会关于首部《网络韧性法案》欧洲标准的公告](https://digital-strategy.ec.europa.eu/en/news/first-european-standard-published-support-cyber-resilience-act)确认，该标准是欧盟委员会于2025年2月委托欧洲标准化委员会（CEN）、欧洲电工标准化委员会（CENELEC）及欧洲电信标准协会（ETSI）制定的逾30项配套标准中的第一项成果。该水平标准确立了跨类别的通用网络安全词汇表与基于风险的“安全源于设计（secure by design）”方法论，贯穿产品概念设计、研发生产、运维更新、停止支持直至退役报废的完整生命周期，适用于智能门锁、路由器、微处理器、微控制器、操作系统、浏览器、密码管理器及配套云端远程数据处理服务等所有含数字元素的产品[^3]。

为在公共教育领域摆脱对欧盟境外技术供应商的单一依赖，[欧盟委员会11月20日发布的EDU-EDIC启动公报](https://digital-strategy.ec.europa.eu/en/news/member-states-join-forces-develop-sovereign-digital-infrastructure-education)宣布，依据2026年11月4日通过的《欧盟委员会实施决定（EU）2026/2413》，比利时、克罗地亚、芬兰、法国、希腊、荷兰、斯洛文尼亚和西班牙八个成员国正式组建欧洲教育数字基础设施联盟（EDU-EDIC），法定总部设于荷兰海牙。欧盟委员会执行副主席亨娜·维尔库宁（Henna Virkkunen）、罗克萨娜·门扎图（Roxana Mînzatu）与荷兰中小学教育及平等事务大臣朱迪思·蒂伦（Judith Tielen）共同出席启动仪式。该联盟在“2030数字十年政策纲领”框架下重点推进四大支柱：主权与互操作数字教育基础设施、跨境可携带的教育数据治理标准、可信教育人工智能工具研发推广，以及扶持以中小微企业为主体的欧洲教育科技（EdTech）与开源教研生态[^4]。

[^1]: 2026-11-19 · [NIST to Revise SP 800-52 Rev. 2, Guidelines for the Selection, Configuration, and Use of Transport Layer Security (TLS) Implementations](https://csrc.nist.gov/News/2026/nist-will-revise-tls-guidelines) · 美国国家标准与技术研究院（NIST）.
[^2]: 2026-11-19 · [NIST Project Aims to Accelerate Mobile Driver's License Adoption](https://www.nist.gov/news-events/news/2026/11/nist-project-aims-accelerate-mobile-drivers-license-adoption) · 美国国家标准与技术研究院（NIST）.
[^3]: 2026-11-19 · [First European standard published to support the Cyber Resilience Act](https://digital-strategy.ec.europa.eu/en/news/first-european-standard-published-support-cyber-resilience-act) · 欧盟委员会数字战略司.
[^4]: 2026-11-20 · [Member States join forces to develop sovereign digital infrastructure on education](https://digital-strategy.ec.europa.eu/en/news/member-states-join-forces-develop-sovereign-digital-infrastructure-education) · 欧盟委员会数字战略司.
