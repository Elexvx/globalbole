---
title: "美國國家標準與技術研究院驗證首套完整量子位置認證協定，網路安全局緊急通報大模型閘道與科研平台在野利用漏洞"
slug: "nist-quantum-position-verification-cisa-kev-litellm-redcap-2026-11-19"
translationKey: "nist-quantum-position-verification-cisa-kev-litellm-redcap-2026-11-19"
issue: "2026-11-19"
lang: "zh-TW"
category: "technology"
author: "全球伯乐 News"
authorRole: "資料整理"
date: "2026-11-19"
description: "美國國家標準與技術研究院在《自然》發表首套基於糾纏光子與無漏洞貝爾測試的完整量子位置認證實驗，美國網路安全和基礎設施安全局同日將 BerriAI LiteLLM 與 REDCap 等四項高危漏洞列入已知被利用漏洞目錄。"
cover: "/news-media/2026-11-19/nist-quantum-position-verification-cisa-kev-litellm-redcap-2026-11-19-editorial.webp"
coverAlt: "深色磨光花崗岩平板底座上的兩枚透明光學分光玻璃立方體、盤繞光纖環與拉絲不鏽鋼安全金鑰器物靜物"
tags: ["人工智慧","網路安全","科技政策"]
readTime: 5
draft: false
---

當地時間2026年11月18日，[美國國家標準與技術研究院（NIST）](https://www.nist.gov/news-events/news/2026/11/quantum-physics-can-verify-persons-location-nist-researchers-show)正式公布全球首套使用遠端非受信任設備的完整量子位置認證（Quantum Position Verification, QPV）實驗成果；同日，[美國網路安全和基礎設施安全局（CISA）](https://www.cisa.gov/news-events/alerts/2026/11/18/cisa-adds-four-known-exploited-vulnerabilities-catalog)將開源大模型代理閘道 BerriAI LiteLLM 與臨床科研電子資料採集系統 REDCap 等四項正在遭受在野利用的漏洞增補進已知被利用漏洞（KEV）目錄。這兩項同日發布的權威公告，分別從下一代量子物理層身分校驗與當下人工智慧及科研軟體供應鏈應急防禦兩個維度，揭示了關鍵數位基礎設施安全架構的深刻演進[^1][^2]。

![深色磨光花崗岩平板底座上的兩枚透明光學分光玻璃立方體、盤繞光纖環與拉絲不鏽鋼安全金鑰器物靜物](/news-media/2026-11-19/nist-quantum-position-verification-cisa-kev-litellm-redcap-2026-11-19-editorial.webp)

AI生成概念示意圖：深色磨光花崗岩平板底座上的兩枚透明光學分光玻璃立方體、無標盤繞光纖環與拉絲不鏽鋼硬體安全金鑰靜物，象徵基於糾纏光子與光速測距的量子位置認證協定及人工智慧與科研基礎設施漏洞防禦，並非美國國家標準與技術研究院或網路安全機構現場照片。

## 量子糾纏與光速三角測距構築不可偽造的物理位置憑證

在發表於《自然》（*Nature*，論文編號 `DOI: 10.1038/s41586-026-11247-3`）的研究中，由高塔姆·卡武里（Gautam Kavuri）、斯科特·格蘭西（Scott Glancy）與克里斯特·沙爾姆（Krister Shalm）領銜的[美國國家標準與技術研究院研究團隊](https://www.nist.gov/news-events/news/2026/11/quantum-physics-can-verify-persons-location-nist-researchers-show)，在科羅拉多州博爾德實驗室相距195公尺的兩個地面驗證站之間完成了首套完整量子位置認證協定測試。研究指出，2024年美國網路犯罪造成的經濟損失已超過160億美元，而由於攻擊者普遍透過跳板隱藏真實物理位置，跨國網路犯罪的緝捕歸案率不足1%。傳統加密協定僅能驗證金鑰持有者身分，卻無法阻止遠端駭客竊取憑證後偽裝成合法終端；量子位置認證則將使用者所處的精確地理座標直接轉化為不可偽造的密碼學存取前提[^1]。

該實驗巧妙融合了量子力學不可複製定理（No-Cloning Theorem）、光速通訊上限與無漏洞貝爾測試（Loophole-Free Bell Test）。兩個驗證站以嚴格同步的時間戳記向居中待驗證節點發送經典位元訊號與糾纏光子，待驗證終端必須在光速傳播設定的微秒級時間窗口內完成單光子測量並向兩側回傳結果。得益於超導奈米線單光子探測器（SNSPD）極高的光子捕獲效率，即便驗證方完全不信任終端側硬體，任何試圖在外部攔截、複製量子態或串謀偽造位置的中間人攻擊都會不可避免地破壞量子糾纏相關性或超出光速往返時限。實驗在數百萬次重複測試中均實現了穩健的位置真實性校驗，為未來金融機構異地交易攔截、關鍵政務終端物理圍欄以及量子網際網路節點互信奠定了實驗基石[^1]。

## 人工智慧閘道與臨床科研資料平台遭遇在野漏洞攻擊

在量子安全協定加速邁向工程化的同時，當前廣泛部署的人工智慧中間層與科研資料系統正面臨嚴峻的傳統漏洞衝擊。[美國網路安全和基礎設施安全局發布的11月18日安全警報](https://www.cisa.gov/news-events/alerts/2026/11/18/cisa-adds-four-known-exploited-vulnerabilities-catalog)顯示，四項被確認存在活躍在野利用的漏洞已被正式寫入 KEV 目錄，其中包括開源大模型統一呼叫閘道 BerriAI LiteLLM 的未受保護備用通道漏洞（`CVE-2026-40217`），以及范德堡大學研發的科研電子資料採集平台 REDCap 的程式碼注入漏洞（`CVE-2026-90817`）。由於 LiteLLM 被大量企業用於統一編排和路由多種大型語言模型 API 金鑰，而 REDCap 支撐著全球數千家醫學院與公共衛生機構的臨床試驗資料庫，這兩項漏洞的在野利用直接威脅到企業人工智慧憑證安全與敏感生物醫學資料資產[^2]。

除上述兩項新型應用層漏洞外，[美國網路安全和基礎設施安全局](https://www.cisa.gov/news-events/alerts/2026/11/18/cisa-adds-four-known-exploited-vulnerabilities-catalog)同批次列入目錄的還包括群暉科技（Synology）DiskStation Manager（DSM）網路附接儲存作業系統的輸出編碼或跳脫字元不當漏洞（`CVE-2024-10441`），以及遺留企業級 Web 服務框架 Apache Axis 的不安全反射漏洞（`CVE-2026-90436`）。根據具有強制約束力的《第26-04號約束性運行指令》（BOD 26-04：《基於風險優先執行安全更新》），美國所有聯邦民事行政部門（FCEB）必須在規定期限內完成修補程式修復或立即停用受影響元件。網路安全監管機構同時敦促全球私營雲端服務商、科研院所與人工智慧開發者立即排查模型閘道與儲存節點的暴露面，建立縱深防禦機制[^2]。

[^1]: 2026-11-18 · [Quantum Physics Can Verify a Person's Location, NIST Researchers Show](https://www.nist.gov/news-events/news/2026/11/quantum-physics-can-verify-persons-location-nist-researchers-show) · 美國國家標準與技術研究院（NIST）.
[^2]: 2026-11-18 · [CISA Adds Four Known Exploited Vulnerabilities to Catalog](https://www.cisa.gov/news-events/alerts/2026/11/18/cisa-adds-four-known-exploited-vulnerabilities-catalog) · 美國網路安全和基礎設施安全局（CISA）.
