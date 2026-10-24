---
title: "資料中心追逐燃料電池：提前通電的價值與不能省略的成本"
slug: "fuel-cells-datacenter-power-2026-10-24"
translationKey: "fuel-cells-datacenter-power-2026-10-24"
issue: "2026-10-24"
lang: "zh-TW"
category: "energy"
author: "全球伯樂 News"
authorRole: "資料整理"
date: "2026-10-24"
description: "Bloom最新季報讓資料中心現場供電再受關注。燃料電池的機會在於提前獲得可用電力，但市場收入預測、框架規模、簽約容量與可靠運轉必須分開衡量。"
cover: "/news-media/2026-10-24/fuel-cell-power.jpg"
coverAlt: "2010年2月24日展出的Bloom Energy燃料電池發電設備資料照片"
tags: ["資料中心", "能源", "燃料電池"]
readTime: 7
draft: false
---

Bloom Energy於10月22日公布第三季公司總收入12.358億美元，年增138.1%；這不是資料中心業務的單獨收入。[^1]路透社翌日的解讀報導，再次關注AI資料中心對燃料電池供電的需求。[^2]新進展把一個基礎設施問題推向前台：機房需要的，不只是更大的電力承諾，而是何時可以可靠地用上電。

![2010年2月24日展出的Bloom Energy燃料電池發電設備資料照片](/news-media/2026-10-24/fuel-cell-power.jpg)

_資料照片：2010年2月24日，展出的Bloom Energy燃料電池發電設備。作品《Bloom Energy Servers》，攝影：© Jakub Mosur，發布方：Bloom Energy。來源：[Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Bloom_Energy_Servers.jpg)；[CC BY 2.0](https://creativecommons.org/licenses/by/2.0/)。_

## 大數字首先要分清是什麼

Rystad的6月25日預測：燃料電池年度市場收入從2025年28億美元增至2030年300億美元。這是年度收入，而非累計投資，也不是10月的新預測。[^3]

Bloom在4月13日宣布，Oracle擬採購最多2.8吉瓦，其中1.2吉瓦已經簽約：上限不等於全部容量的確定訂單，也不等於已經投運。[^4]

對市場的理解因此需要兩套帳：收入是一個時期的金額，裝置容量是設備能夠提供的功率。若沒有設備價格、服務範圍和認列收入的時間安排，不能把兩者直接換算。公司整體營收的高速增長，也無法單獨證明某一客戶類別貢獻了多少，或說明每個現場專案都已達到承諾的運轉表現。

## 提前通電為何值得付出成本

美國能源部介紹，燃料電池透過電化學過程把燃料的化學能轉為電力；只要持續供應燃料，就能持續發電，並不像普通蓄電池那樣需要先充滿再放電。[^5]因此，將發電設備布置在負載附近，提供的是一種供電路徑，而不是憑空創造無需輸入的能源。

從專案經濟性看，如果伺服器和建築已經準備好，而接入電網的時間仍不確定，提前取得可用電力可能減少設備閒置。這種價值來自「早一點開始運轉」，不應簡單等同於「每度電更便宜」。判斷方案是否合理，需要把提前產生的營運價值，與新增設備、燃料、維護和備用安排的成本放在同一時間範圍內比較。

這也解釋了為什麼不同園區可能得出不同答案。尚未完成建設的專案，不一定能立即兌現提前供電的價值；已經具備接電條件的專案，也未必需要為另一套長期供電系統付費。燃料電池的吸引力取決於具體專案的關鍵進度約束，而不是所有AI設施共同面對的一個固定電價。

## 發電模組之外，系統仍需配套

能源部對燃料電池系統的說明，把電堆、燃料處理和電力調節分別列出。燃料雜質可能影響設備效率與壽命；電堆產生直流電，如果用電設備需要交流電，還涉及轉換和電力品質控制。[^6]所以，採購清單上的模組功率並不自動等於機房可以穩定使用的完整供電能力。

固態氧化物燃料電池的高溫運轉有利於處理多種燃料，但也帶來啟動較慢、隔熱和材料耐久性方面的要求。[^7]這些是技術類別的基本特徵，不代表某家供應商的具體產品一定存在同樣程度的限制。實際專案仍需核對設備配置和測試結果。

由此推論，持續發電與負載突然變化，是兩種不同的工程任務。設計者需要說明設備維護或故障時如何供電、備用系統能支撐多久，以及電力調節如何滿足機房要求。不能僅憑「全天候」這樣的描述，就跳過對整套系統備援和切換能力的審查。

## 不接公共電網，也不等於擺脫依賴

現場發電會改變依賴的對象，但不會消除依賴。燃料供應路線、設備交期、維護支援以及當地建設和運轉許可，仍是專案需要確認的條件。若原本的電力等待被轉化為另一項燃料或設備等待，預計節省的時間就可能縮水。這裡討論的是盡職調查應涵蓋的風險，不是宣稱上述企業已遭遇這些障礙。

排放也必須按燃料區分。能源部指出，純氫燃料電池在運轉端產生水和熱，而以含碳燃料進行重組會釋放二氧化碳。[^5][^6]因此，「燃料電池」本身不是零碳標籤；使用天然氣的系統，不能直接套用純氫在使用端的排放描述。

更完整的比較，還要考慮燃料如何生產和運輸，以及比較對象是什麼。使用端排放、全供應鏈排放和相對於另一供電方案的減排量，是三個不同的問題。沒有一致的邊界和專案數據，不能僅憑技術名稱宣布環境收益。

可靠性也應落實到站點，而不只是設備平均表現。多個發電模組如果共享同一條燃料入口，某類故障就可能同時影響全部模組。增加模組數量未必消除了共同故障點。專案比較應說明哪些風險真正分散了、哪些仍然集中，並把這種邊界寫入運轉設計，而不是僅以總容量判斷安全餘裕。

## 從擴張故事轉向運轉證據

下一步值得觀察的，是意向容量如何變為簽約設備、設備如何變為按時交付的電力，以及運轉數據是否支持原有經濟測算。對採購方而言，明確的服務責任、維護窗口和交付條件，比籠統的市場規模預測更能約束專案風險。

燃料電池可以成為資料中心供電組合的重要候選，但它的商業價值需要同時通過時間、成本與可靠性三項檢驗。若提前通電的收益足以涵蓋新增系統成本，現場發電就可能創造實際價值；若只是把一個未解決的依賴轉移到另一個環節，宏大的市場數字便不能替代可用的電力。

[^1]: 2026-10-22 · Bloom Energy · [Bloom Energy Reports Record Third Quarter 2026 Financial Results and Raises Full Year 2026 Guidance](https://www.bloomenergy.com/news/bloom-energy-reports-record-third-quarter-2026-financial-results-and-raises-full-year-2026-guidance/)（譯名：Bloom Energy公布創紀錄的2026年第三季業績並上調全年指引）；報告期截至2026-09-30。

[^2]: 2026-10-23 · Arunima Kumar、Shivansh Tiwary / Reuters，經The Star轉載 · [Explainer-Why AI data centers are powering a boom in fuel-cell demand](https://www.thestar.com.my/tech/tech-news/2026/10/23/explainer-why-ai-data-centers-are-powering-a-boom-in-fuel-cell-demand)（譯名：解讀：AI資料中心為何推動燃料電池需求增長）。

[^3]: 2026-06-25 · Rystad Energy · [Fuel cell investment by data centers set to grow tenfold, reaching $30 billion by 2030](https://www.rystadenergy.com/news/data-center-fuel-cell-power-demand)（譯名：資料中心燃料電池投資預計增長十倍，2030年達到300億美元）。

[^4]: 2026-04-13 · Bloom Energy · [Bloom Energy and Oracle Expand Strategic Partnership to Deploy up to 2.8 GW to Accelerate AI Infrastructure Build-Out](https://www.bloomenergy.com/news/bloom-energy-and-oracle-expand-strategic-partnership-to-deploy-up-to-2-8-gw-to-accelerate-ai-infrastructure-build-out/)（譯名：Bloom Energy與Oracle擴大合作，擬部署最多2.8吉瓦以加快AI基礎設施建設）。

[^5]: 頁面日期2013-08-14，更新於2026-10-09 · 美國能源部 · [Fuel Cells](https://www.energy.gov/cmei/fuels/fuel-cells)（譯名：燃料電池）。

[^6]: 首發2014-02-25，更新於2026-06-02 · 美國能源部 · [Fuel Cell Systems](https://www.energy.gov/cmei/fuels/fuel-cell-systems)（譯名：燃料電池系統）。

[^7]: 首發2014-02-25，更新於2026-06-02 · 美國能源部 · [Types of Fuel Cells](https://www.energy.gov/cmei/fuels/types-fuel-cells)（譯名：燃料電池類型）。
