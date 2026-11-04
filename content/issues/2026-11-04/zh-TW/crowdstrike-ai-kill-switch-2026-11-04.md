---
title: "CrowdStrike 推出 AI 代理「緊急停止」控制：目前先切斷模型存取"
slug: "crowdstrike-ai-kill-switch-2026-11-04"
translationKey: "crowdstrike-ai-kill-switch-2026-11-04"
issue: "2026-11-04"
lang: "zh-TW"
category: "technology"
author: "全球伯乐 News"
authorRole: "資料整理"
date: "2026-11-04"
description: "CrowdStrike 公布 Falcon Guardian 新功能。現階段的 AI Kill Switch 先在閘道層阻斷未經授權的 AI 代理存取模型；跨端點、雲端與身分系統的協同處置仍是未來規劃。"
cover: "/news-media/2026-11-04/air-force-cyber-operations-2018-biermann.jpg"
coverAlt: "資料圖：第624作戰中心的一名軍人在多台電腦顯示器前接聽電話"
tags: ["人工智慧", "網路安全"]
readTime: 5
draft: false
---

![資料圖：第624作戰中心的一名軍人在多台電腦顯示器前接聽電話](/news-media/2026-11-04/air-force-cyber-operations-2018-biermann.jpg)

2018年10月23日，美國德克薩斯州聖安東尼奧聯合基地拉克蘭營區，第624作戰中心工作人員執行網路任務。資料圖。 並非CrowdStrike設施或產品展示。 攝影: [U.S. Air Force / Tech. Sgt. R.J. Biermann](https://commons.wikimedia.org/wiki/File:AFCYBER_Airmen_reach_%E2%80%98firsts%E2%80%99_in_global_exercises_(5267410).jpg) · [美國公有領域；使用說明](https://www.dvidshub.net/about/copyright). 使用美國戰爭部（DoW）影像資料不表示或構成該部門的認可或背書。


## 現有停止機制的作用範圍

企業將 AI 代理接入程式碼、檔案及業務系統後，安全問題不再只涉及提示詞內容是否可疑，也包括代理最終呼叫了哪些工具、使用了哪些權限，以及能否在異常行為出現時及時阻斷。CrowdStrike 於 2026 年 11 月 3 日宣布，在 Falcon Guardian 中加入 **AI Kill Switch**，並擴充代理層掛鉤、端點網路檢查等控制。公司已於 9 月提供 Guardian；這次的新資訊是功能與可用狀態的更新，不是產品首度發布。[^1]

依公司技術說明，現階段已提供的停止動作先透過 AI 閘道執行：安全團隊可指示已連接的閘道，阻斷代理存取其依賴的模型。Falcon AI Gateway 現已正式提供，也可接入第三方閘道。此機制可以中斷依靠該存取路徑持續推理的工作流程，但**不等於目前已能在所有端點、瀏覽器、雲端服務及 SaaS 環境一鍵終止代理程序**。公司明確將更廣範圍的協同處置列為後續功能。[^1][^2]

## 可用狀態與評估時仍須驗證的問題

其他功能也須分清進度：公司稱端點網路檢查在 **Windows** 上已正式提供，在 **Mac** 上仍屬早期存取；「代理身分」控制則以未來式描述。公司也宣布收購 Fiddler AI 的意向，以補充代理可觀測能力。現有公告不能視為交易已經完成，也不能根據產品描述，斷言其偵測率或誤報率已經獨立驗證。[^1]

這次發布反映安全產品的控制點，正從理解提示詞延伸至閘道通訊與端點實際執行。採購或評估這類工具時，應將宣傳中的完整架構分成目前已交付功能、特定作業系統支援、試用階段功能，以及併購後才可能整合的能力；尤其要檢驗代理能否繞過受控閘道，以及模型存取遭阻斷後，已發出的工具呼叫會如何處理。公司公告未提供足以回答這些問題的獨立測試資料。

[^1]: 2026-11-03 · [CrowdStrike Delivers AI Security and Safety for the Enterprise](https://www.crowdstrike.com/en-us/press-releases/crowdstrike-delivers-ai-security-safety-for-the-enterprise/) · CrowdStrike。

[^2]: 2026-11-03 · [Introducing AI Kill Switch: Taking Control When AI Agents Go Rogue](https://www.crowdstrike.com/en-us/blog/crowdstrike-introduces-ai-kill-switch/) · CrowdStrike。文末明確提醒，尚未發布的功能仍可能變動。
