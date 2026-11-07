---
title: "OpenAI發布100項濕實驗基準BioBasicsBench，並與Hacktron合作排查跨系統連接漏洞"
slug: "openai-biobasicsbench-hacktron-security-2026-11-07"
translationKey: "openai-biobasicsbench-hacktron-security-2026-11-07"
issue: "2026-11-07"
lang: "zh-TW"
category: "technology"
author: "全球伯乐 News"
authorRole: "資料整理"
date: "2026-11-07"
description: "OpenAI聯合Ligo建構基於真實實驗原始數據的BioBasicsBench，GPT-6 Astra最高得分為66.7%但仍會出現凝膠條帶誤判；同日宣布與曾發現其論壇RCE漏洞的Hacktron展開紅隊合作。"
cover: "/news-media/2026-11-07/openai-biobasicsbench-security-editorial.webp"
coverAlt: "AI生成概念示意圖：以雙螺旋分子雕塑、培養皿與幾何防護環模型表現生命科學濕實驗評估與系統安全邊界防護，並非真實實驗室或產品介面。"
tags: ["人工智慧", "AI安全", "企業軟體"]
readTime: 5
draft: false
---

![AI生成概念示意圖：以雙螺旋分子雕塑、培養皿與幾何防護環模型表現生命科學濕實驗評估與系統安全邊界防護，並非真實實驗室或產品介面。](/news-media/2026-11-07/openai-biobasicsbench-security-editorial.webp)

AI生成概念示意圖：以雙螺旋分子雕塑、培養皿與幾何防護環模型表現生命科學濕實驗評估與系統安全邊界防護，並非真實實驗室或產品介面。

## BioBasicsBench以100項真實濕實驗原始數據測試模型，GPT-6 Astra平均得分66.7%但仍會誤讀凝膠與菌落

OpenAI於2026年11月6日發布題為《衡量AI智慧代理如何處理日常濕實驗科學》的研究公告，聯合酶設計生物技術新創公司 Ligo Biosciences 推出包含**100項任務**的 **BioBasicsBench** 基準。與依賴論文精修圖表的傳統評測不同，該基準全部取材於研究人員日常濕實驗產生的原始數據，涵蓋凝膠與印跡圖像（**31項**）、實驗方案與手寫或電子實驗記錄（**27項**）、酶標儀表格與流式細胞術原始匯出檔案（**20項**），以及瓊脂平板菌落照片、顯微鏡Z軸層掃序列（z-stacks）、定序讀段和實驗台操作影片；按實驗領域分為蛋白質方法（25項）、成像與流式細胞術（23項）、定量與測定（19項）、核酸方法（17項）及分子選殖（16項）。OpenAI對兩代共7款內部模型在37種模型與推理強度組合下各運行5次，總計完成**18500次**評分測試。[^1]

在最高推理強度（`xhigh`）下，**GPT-6 Astra** 取得**66.7%**的平均得分（95%信賴區間為60.3%至73.1%，單任務平均輸出4704個token），高於 **GPT-6.1 Sol**（**62.0%**）、**GPT-5.6 Sol**（**43.8%**）、**GPT-6 Luna**（**38.3%**）、**GPT-5.5**（**35.4%**）、**GPT-5.4**（**33.2%**）及 **GPT-5.2**（**31.2%**，單任務輸出27620個token）。在多模態細節識別上，GPT-6 Astra 能夠放大讀取培養皿邊緣手寫的 `LB Kan50` 標籤並發現卡那黴素對照平板與氨苄青黴素實驗不匹配，也能識別525至540奈米波段的螢光通道串色；但OpenAI同時披露了典型失敗案例：在菌落PCR瓊脂糖凝膠分析中，GPT-6 Astra 雖正確區分了兩組條帶，卻因先入為主假設「條帶更大代表插入成功」，錯誤推薦了攜帶舊質體骨架的**4、6、7、8號**菌落而非正確的**5、9、10號**菌落；在轉化平板計數中則因合併相鄰菌落及誤標空白瓊脂導致**淨高估約12%**，進而將DNA轉化效率同步高估12%。[^1]

## OpenAI與Hacktron達成攻防測試合作並開放Daybreak Red權限，聚焦第三方服務連接邊界

同在11月6日，OpenAI宣布與舊金山AI網路安全新創公司 **Hacktron** 建立正式攻防安全合作夥伴關係，並向其擴大開放受控前沿網路安全模型層級 **Daybreak Red** 的存取權限（需經身分核驗、法律聲明、活動監控及沙盒權限控制）。雙方工程師與安全研究員將共同選定高優先級測試目標，重點排查 OpenAI 自身系統、雲端基礎設施及身分認證層在與**第三方外部服務和聯網AI智慧代理**互動邊界上的複雜漏洞；來自安全研究機構 Cathedral 的研究人員也將加入下一輪安全衝刺。[^2]

此次合作源於 Hacktron 此前透過漏洞懸賞計畫提交的高危漏洞披露。據 Hacktron 於2026年9月13日公開的技術報告，其研究員於2026年7月23日至25日在不到72小時內，利用 OpenAI 開發者論壇（`community.openai.com`，基於 Discourse）中 ImageMagick 呼叫的 `libheif`（1.19.7版本）未回植安全修補程式缺陷，透過上傳特製 `.heic` 圖像實現遠端程式碼執行（RCE），並進一步串聯 `auth.openai.com` 單一登入（SSO）配置缺陷實現零互動接管活躍論壇用戶的 ChatGPT 與 Codex 帳戶，於7月25日在內部倉庫提交了僅修改 `README.md` 的概念驗證請求（PR #1186742）；OpenAI 在約**14小時**內完成修復並支付了**6500美元**懸賞金。在解讀11月6日的兩項發布時需注意：BioBasicsBench 目前僅評測了 OpenAI 內部模型，**未公布人類科學家得分基線、外部模型對比或開源數據集倉庫**；而 Hacktron 合作公告屬於攻防測試機制建設，並未披露該正式合作啟動後新發現的具體漏洞數量。[^1][^2][^3]

[^1]: 2026-11-06 · [Measuring how AI agents handle everyday wet-lab science](https://openai.com/index/measuring-how-ai-agents-handle-wet-lab-science/) · OpenAI.
[^2]: 2026-11-06 · [Partnering with Hacktron to find vulnerabilities in OpenAI's systems](https://openai.com/index/partnering-with-hacktron/) · OpenAI.
[^3]: 2026-09-13 · [Hacking OpenAI](https://www.hacktron.ai/blog/hacking-openai) · Hacktron.
