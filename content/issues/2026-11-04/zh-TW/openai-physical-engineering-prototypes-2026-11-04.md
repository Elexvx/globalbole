---
title: "OpenAI 展示 AI 輔助硬體設計：原型可製作，量產限制仍須工程師把關"
slug: "openai-physical-engineering-prototypes-2026-11-04"
translationKey: "openai-physical-engineering-prototypes-2026-11-04"
issue: "2026-11-04"
lang: "zh-TW"
category: "innovation"
author: "全球伯乐 News"
authorRole: "資料整理"
date: "2026-11-04"
description: "OpenAI 公布模型參與裝置、機械與電路設計的內部試驗，並提供原型製作時間、基準測試及製造環節的限制。使用量增加不等於生產力等幅提升。"
cover: "/news-media/2026-11-04/printed-circuit-boards-2024-img4512.jpg"
coverAlt: "資料圖：深色桌面上的兩塊綠色印刷電路板，可見晶片、連接器和線路"
tags: ["人工智慧", "製造業"]
readTime: 5
draft: false
---

![資料圖：深色桌面上的兩塊綠色印刷電路板，可見晶片、連接器和線路](/news-media/2026-11-04/printed-circuit-boards-2024-img4512.jpg)

兩塊印刷電路板，攝於2024年8月31日。資料圖。 並非OpenAI原型。 攝影: [IMG 4512](https://commons.wikimedia.org/wiki/File:Printed_circuit_boards_20240831_083726.jpg) · [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/).


## 原型進度與製造限制

OpenAI 於 2026 年 11 月 3 日公布一項將模型用於實體工程的試驗。團隊使用 GPT‑6 協助定義可與 Codex 互動的裝置需求與設計，並描述 GPT‑6 Astra 在外殼結構、印刷電路板、介面、韌體及軟體連接設計中的參與。據公司揭露，兩名成員兼顧其他工作，在不到一週內完成測試裝置設計；合約製造商則在不到一個月內製作了小批原型。這顯示的是特定流程中的原型開發進度，尚非模型能獨立完成商業化硬體開發的證明。[^1]

這類工作之所以複雜，是因為機械尺寸、電子元件位置、軟體功能與製造製程必須相互相容。模型可以協助整理需求、產生設計檔案或準備模擬，但實體產品最終仍須通過公差、組裝順序、供應及生產設備能力的檢驗。OpenAI 自己指出，原型進入製造準備階段後，仍經過數輪人工審核與修改；Astra 對製造商生產限制、公差以及組裝細節的考量並不穩定。[^1]

## 使用量與評測分數不等於量產表現

公司也表示，其硬體團隊使用模型的 token 量已達今年 2 月基準的 **23 倍**。這是使用量指標，**不代表生產力提高 23 倍**。在 BenchCAD 2.0 內部測試中，一個較新的內部模型平均得分 **0.875**，高於 GPT‑6 Astra 在最高推理設定下的 **0.594**；測試評估三維零件重建與電路板連接辨識，不能直接換算為實際產品的可靠性或製造成本。[^1]

OpenAI 正讓外部工程師檢查模型輸出，並與 Chip Ganassi Racing 探索將現有零件的三維掃描轉為可編輯 CAD 模型及二維製造圖面。這裡最有實際價值的場景，可能是在缺少原始設計檔案時，減少逆向整理的重複工作；但可編輯與可製造仍是兩項不同門檻。現階段較審慎的結論是，AI 在工程文件、設計迭代和跨專業協調上展現潛力，最終簽核責任仍在具備設備、材料和製程知識的人員。[^1]

[^1]: 2026-11-03 · [Accelerating engineering for the physical world](https://openai.com/index/accelerating-engineering-for-the-physical-world/) · OpenAI。文中試驗、使用量及 BenchCAD 數字均為公司揭露，未視為經獨立驗證的產業成果。
