---
title: "Reflection公布Beam：5010億總參數，開放權重仍待本月交付"
slug: "reflection-beam-open-weights-2026-10-06"
translationKey: "reflection-beam-open-weights-2026-10-06"
issue: "2026-10-06"
lang: "zh-TW"
category: "technology"
author: "全球伯樂 News"
authorRole: "資料整理"
date: "2026-10-06"
description: "Beam以230億啟用參數瞄準程式設計和智慧代理任務，權重擬於10月開放。公司效率比較未計入全部服務開銷，API目前仍處於測試階段。"
seoTitle: "Reflection發布Beam：5010億參數，開放權重預計10月推出"
seoDescription: "Beam有230億啟用參數，面向程式設計和智慧代理任務；公司計畫10月開放權重，效率估算未計入全部服務成本，API仍在測試。"
cover: "/news-media/2026-10-06/beam-editorial.png"
coverAlt: "AI生成示意圖：深藍模組圍繞明亮核心，表現模型運算與開放主題"
tags: ["人工智慧", "基礎設施"]
readTime: 4
draft: false
---

輝達支持的美國人工智慧公司Reflection AI，10月5日公布第一款模型Beam，瞄準程式設計、推理和智慧代理任務。架構是稀疏混合專家，總參數5010億，每個詞元啟用約230億參數。公司把它放在中國開放權重模型之外，當成另一個選項。路透社的報導，也把這次發布放進與DeepSeek、Kimi等模型的競爭裡。[^1][^2]

![AI生成示意圖：深藍模組圍繞明亮核心，表現模型運算與開放主題](/news-media/2026-10-06/beam-editorial.png)

*AI生成示意圖：深藍模組圍繞明亮核心，表現模型運算與開放主題。*

## 權重尚待發布

Reflection把這次發布定調為預覽。Beam的紅隊測試和評估還沒做完。公司計畫先開放給部分使用者，並在10月放出權重、技術報告、模型卡和開發工具，權重打算採用Apache 2.0授權。現在還不能下載權重。預覽本身，也證明不了模型已經適合全面正式部署。[^1]

## 效率與成績要分開看

Reflection說，Beam在部分推理測試上接近GLM-5.2，需要的推理計算量大約是其三分之一至四分之一。這個估算只用啟用參數和生成的詞元數來算，輸入預處理、會隨上下文改變的注意力計算、服務開銷都沒算進去，不能直接換成使用者帳單上的數字。[^1]

公司列出的Terminal-Bench 2.1成績是Beam 80.1、GLM-5.2 81.0。省下來的計算，和任務分數高不高，是兩回事。發布方自己彙整的評測，也取代不了外部複測。企業得先核對測試條件和自己的任務是否相符，再決定分數差距有沒有意義。只拿一個總分選模型，並不夠。[^1]

## API仍處測試階段

串接的部分，官方開發文件寫著：Reflection API還在測試，以候補名單逐步開放，行為和限制仍可能調整。介面提供與OpenAI相容的Chat Completions和Models。已經有相關呼叫程式碼的開發者，可以沿用一部分工具鏈。介面相容，不代表服務能力、可用性和費用都一樣。[^3] 官方Models頁面目前標示，模型上下文視窗為256K，最大輸出為128K詞元，並提醒測試期間上下文限制可能變化。上下文額度把輸入和生成的輸出一起計算。超過上限的請求會被拒絕，不會自動截斷。文件一長，再加上多輪工具呼叫，開發者得自己把輸出和推理的空間留出來。[^5]

開發文件另外說明，Beam始終會做推理，推理強度有五檔，預設是中檔。強度調高，通常就是投入更多詞元、等更久。推理用掉的詞元也計進輸出預算。輸出額度若設得太低，模型可能在推理階段就把額度耗盡，最後答案是空的。需要連續呼叫工具的應用程式，會碰到這類邊界。它和總參數規模一樣，都影響實際的工程體驗。[^4]

## 從預覽走向實際交付

企業若要評估，Beam是多了一個可以拿來測試的選項。要不要採購，還是得回到自己的工作負載。開放權重的承諾真的兌現之後，團隊才比較能把部署需求、授權條件、任務成功率和成本核完整。現階段看得到的，是市場上多了一家模型供應者。服務穩不穩、成本能不能接受，還得靠實際交付來回答。

[^1]: 2026-10-05 · [介紹Beam：Reflection的5010億參數開放權重模型](https://reflection.ai/blog/introducing-beam) · Reflection · 原題：Introducing Beam: Reflection’s 501B open-weight model

[^2]: 2026-10-05 · [輝達支持的Reflection推出首款AI模型，挑戰中國開放模型](https://www.investing.com/news/stock-market-news/nvidiabacked-reflection-unveils-first-ai-model-to-take-on-chinese-open-models-4932928) · Reuters / Investing.com · 原題：Nvidia-backed Reflection unveils first AI model to take on Chinese open models

[^3]: 未註明發布日期，瀏覽於2026-10-06 · [開發文件導言](https://developers.reflection.ai/introduction) · Reflection Developer Docs · 原題：Introduction

[^4]: 未註明發布日期，瀏覽於2026-10-06 · [推理](https://developers.reflection.ai/reasoning) · Reflection Developer Docs · 原題：Reasoning

[^5]: 未註明發布日期，瀏覽於2026-10-06 · [模型](https://developers.reflection.ai/models.md) · Reflection Developer Docs · 原題：Models
