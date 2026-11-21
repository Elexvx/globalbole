---
title: "NIST啟動TLS 1.3後量子修訂與行動駕照SP 1800-42指南，歐盟發布首部《網路韌性法案》通用標準並成立EDU-EDIC數位教育聯盟"
slug: "nist-tls-1-3-revision-mdl-identity-eu-cra-standard-2026-11-21"
translationKey: "nist-tls-1-3-revision-mdl-identity-eu-cra-standard-2026-11-21"
issue: "2026-11-21"
lang: "zh-TW"
category: "technology"
author: "全球伯乐 News"
authorRole: "資料整理"
date: "2026-11-21"
description: "美國國家標準與技術研究院宣布修訂SP 800-52 Rev. 2以推進TLS 1.3與後量子演算法並發布行動駕照線上身分驗證指南SP 1800-42草案；歐盟委員會同期發布支持《網路韌性法案》的首部歐洲水平安全標準，並聯合八個成員國在海牙正式啟動歐洲教育數位基礎設施聯盟（EDU-EDIC）。"
cover: "/news-media/2026-11-21/nist-tls-1-3-revision-mdl-identity-eu-cra-standard-2026-11-21-editorial.webp"
coverAlt: "深色磨光玄武岩平板底座上擺放透明光學玻璃立方體、無標鈦金屬鑰匙胚與黃銅連接器的靜物攝影"
tags: ["人工智慧","網路安全","科技政策"]
readTime: 5
draft: false
---

2026年11月19日至20日，跨大西洋網路安全與數位基礎設施標準機構連續推出四項核心技術規範與多國協作架構。[美國國家標準與技術研究院（NIST）電腦安全資源中心](https://csrc.nist.gov/News/2026/nist-will-revise-tls-guidelines)正式宣布修訂《傳輸層安全（TLS）實作的選擇、配置與使用指南》（SP 800-52 Rev. 2），同時由國家網路安全卓越中心（NCCoE）發布[《數位身分——行動駕駛證（mDL）：實現安全與互操作的線上使用》（NIST SP 1800-42）公開徵求意見草案](https://www.nist.gov/news-events/news/2026/11/nist-project-aims-accelerate-mobile-drivers-license-adoption)。在歐洲，[歐盟委員會數位戰略司](https://digital-strategy.ec.europa.eu/en/news/first-european-standard-published-support-cyber-resilience-act)公布了支撐《網路韌性法案》（Cyber Resilience Act）落地的首部歐洲水平標準，並於11月20日會同八個成員國正式啟動[歐洲教育數位基礎設施聯盟（EDU-EDIC）](https://digital-strategy.ec.europa.eu/en/news/member-states-join-forces-develop-sovereign-digital-infrastructure-education)，從傳輸層加密協定、可驗證數位憑證、軟硬體全生命周期合規到主權教育雲全面收緊安全基線[^1][^2][^3][^4]。

![深色磨光玄武岩平板底座上擺放透明光學玻璃立方體、無標鈦金屬鑰匙胚與黃銅連接器的靜物攝影](/news-media/2026-11-21/nist-tls-1-3-revision-mdl-identity-eu-cra-standard-2026-11-21-editorial.webp)

AI生成概念示意圖：深色磨光玄武岩平板底座上的切面透明光學玻璃立方體、無字拉絲鈦金屬幾何鑰匙胚與精密黃銅同軸連接器靜物，象徵傳輸層安全（TLS 1.3）後量子密碼遷移、行動駕駛證線上身分核驗以及歐盟《網路韌性法案》全生命周期安全標準與數位教育主權基建，並非美國國家標準與技術研究院或歐盟委員會現場照片。

## NIST收緊TLS 1.2淘汰時間表並聯合美五大銀行驗證行動駕照線上核驗架構

根據[NIST發布的SP 800-52 Rev. 2修訂公告](https://csrc.nist.gov/News/2026/nist-will-revise-tls-guidelines)，本次修訂基於2026年5月密碼出版物審查委員會收集的產業回饋，對2019年發布的現行版本作出結構性升級。新版指南把聯邦伺服器對TLS 1.2的支援要求從「應當支援（should）」降級為「可以支援（may）」，嚴禁使用TLS 1.0與TLS 1.1，並由密碼模組驗證計畫（CMVP）設定過渡時間表，逾期繼續使用TLS 1.2必須提交嚴格的技術正當性說明。指南將全面對齊網際網路工程任務組（IETF）最新發布的`RFC 9846`版TLS 1.3規範，徹底廢棄使用SHA-1、DSA、靜態金鑰交換或RSA金鑰交換的TLS 1.2密碼套件，把最低安全強度提升至128位元，強制要求採用認證加密關聯資料（AEAD）模式，並首次納入後量子密碼（PQC）演算法配置規範[^1]。

在應用層數位身分領域，[NIST關於行動駕駛證（mDL）專案的官方公報](https://www.nist.gov/news-events/news/2026/11/nist-project-aims-accelerate-mobile-drivers-license-adoption)指出，目前美國已有22個州和地區運行行動駕照專案，至少500萬張行動駕照投入實際使用，涵蓋約47%的美國人口准入範圍。由NIST安全工程師比爾·費舍爾（Bill Fisher）牽頭的NCCoE專案聯合科技廠商、政府機構及美國前十大銀行中的五家大型金融機構，搭建了基於商用現貨（COTS）組件的參考架構，重點打通三大金融與政務高風險場景：遠端開戶線上身分核驗、大額交易與帳戶恢復的階梯式增強驗證，以及綁定抗釣魚身分驗證器（如通行金鑰Passkey）的憑證簽發。該`NIST SP 1800-42`草案同步結合《NIST隱私框架》與`NIST SP 800-53 Rev. 5`提出最小必要屬性揭露等七項可用性最佳實踐，公眾意見徵集將持續至2026年12月20日[^2]。

## 歐盟頒布首部《網路韌性法案》全周期標準並落地八國EDU-EDIC數位教育主權聯盟

在硬體與軟體供應鏈合規方面，[歐盟委員會關於首部《網路韌性法案》歐洲標準的公告](https://digital-strategy.ec.europa.eu/en/news/first-european-standard-published-support-cyber-resilience-act)確認，該標準是歐盟委員會於2025年2月委託歐洲標準化委員會（CEN）、歐洲電工標準化委員會（CENELEC）及歐洲電信標準協會（ETSI）制定的逾30項配套標準中的第一項成果。該水平標準確立了跨類別的通用網路安全詞彙表與基於風險的「安全源於設計（secure by design）」方法論，貫穿產品概念設計、研發生產、維運更新、停止支援直至退役報廢的完整生命周期，適用於智慧門鎖、路由器、微處理器、微控制器、作業系統、瀏覽器、密碼管理器及配套雲端遠端資料處理服務等所有含數位元素的產品[^3]。

為在公共教育領域擺脫對歐盟境外技術供應商的單一依賴，[歐盟委員會11月20日發布的EDU-EDIC啟動公報](https://digital-strategy.ec.europa.eu/en/news/member-states-join-forces-develop-sovereign-digital-infrastructure-education)宣布，依據2026年11月4日通過的《歐盟委員會實施決定（EU）2026/2413》，比利時、克羅埃西亞、芬蘭、法國、希臘、荷蘭、斯洛維尼亞和西班牙八個成員國正式組建歐洲教育數位基礎設施聯盟（EDU-EDIC），法定總部設於荷蘭海牙。歐盟委員會執行副主席亨娜·維爾庫寧（Henna Virkkunen）、羅克薩娜·門扎圖（Roxana Mînzatu）與荷蘭中小學教育及平等事務大臣朱迪思·蒂倫（Judith Tielen）共同出席啟動儀式。該聯盟在「2030數位十年政策綱領」框架下重點推進四大支柱：主權與互操作數位教育基礎設施、跨境可攜帶的教育資料治理標準、可信教育人工智慧工具研發推廣，以及扶持以中小微企業為主體的歐洲教育科技（EdTech）與開源教研生態[^4]。

[^1]: 2026-11-19 · [NIST to Revise SP 800-52 Rev. 2, Guidelines for the Selection, Configuration, and Use of Transport Layer Security (TLS) Implementations](https://csrc.nist.gov/News/2026/nist-will-revise-tls-guidelines) · 美國國家標準與技術研究院（NIST）.
[^2]: 2026-11-19 · [NIST Project Aims to Accelerate Mobile Driver's License Adoption](https://www.nist.gov/news-events/news/2026/11/nist-project-aims-accelerate-mobile-drivers-license-adoption) · 美國國家標準與技術研究院（NIST）.
[^3]: 2026-11-19 · [First European standard published to support the Cyber Resilience Act](https://digital-strategy.ec.europa.eu/en/news/first-european-standard-published-support-cyber-resilience-act) · 歐盟委員會數位戰略司.
[^4]: 2026-11-20 · [Member States join forces to develop sovereign digital infrastructure on education](https://digital-strategy.ec.europa.eu/en/news/member-states-join-forces-develop-sovereign-digital-infrastructure-education) · 歐盟委員會數位戰略司.
