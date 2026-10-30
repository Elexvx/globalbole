---
title: "Mistral Large 4 權重可供部署：控制權與授權範圍"
slug: "mistral-large4-open-weights-2026-10-30"
translationKey: "mistral-large4-open-weights-2026-10-30"
issue: "2026-10-30"
lang: "zh-TW"
category: "technology"
author: "全球伯乐 News"
authorRole: "資料整理"
date: "2026-10-30"
description: "Large 4 提供可下載權重。部署控制權擴大，但硬體、獨立測試與附條件授權仍決定實際使用範圍。"
cover: "/news-media/2026-10-30/nersc-server-rack.jpg"
coverAlt: "NERSC 資料中心機架背面的資料照片，並非 Mistral 設施。"
tags: ["人工智慧", "開放權重", "模型部署"]
readTime: 6
draft: false
---

Mistral 於 10 月 6 日公布 Large 4 預覽 API，預告月底開放權重。[^3] Hugging Face 於 10 月 29 日介紹權重已可取得。[^2] 開發者模型庫現已列出可下載檔案、部署說明與授權條款。[^1]

![NERSC 資料中心機架背面的資料照片，並非 Mistral 設施。](/news-media/2026-10-30/nersc-server-rack.jpg)

資料照片：2011 年 10 月 14 日，NERSC 資料中心。[NERSC 資料中心機架背面近照](https://commons.wikimedia.org/wiki/File:Rear_of_rack_at_NERSC_data_center_-_closeup.jpg)，攝影：[Chiara Coetzee](https://www.flickr.com/photos/dcoetzee/6271241131/)；[CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/)。

## 模型規模不等於每次執行的成本

開發者模型文件說明，Large 4 採用混合專家架構，參數總量約一兆，每個詞元實際啟用約 490 億個參數；若計入嵌入層與輸出層，啟用參數約為 520 億。模型接收文字和圖像、輸出文字，標稱上下文長度為 100 萬個詞元。官方提供 FP8 及另一個 NVFP4 檢查點；後者面向 Blackwell GPU，開發者稱可減少顯示記憶體需求。[^1]

這些是模型設計與支援能力的說明，不意味每個組織都能以低成本處理完整長度的上下文。部署所需硬體、顯示記憶體、吞吐量與實際費用，仍取決於權重量化版本與執行設定。總參數、每個詞元啟用的參數，以及上下文容量，回答的是不同問題，不能將其中一個數字當作完整的服務成本指標。

## 自行部署也帶來治理責任

公開權重改變的是控制範圍：企業可在授權允許的範圍內，於自有或選定環境執行模型，並對資料流、模型設定與可用性做更多安排。更大的自主性，也將存取管理、紀錄、模型更新與濫用防護責任交給部署者。

模型文件提供程式設計等基準測試結果，並介紹網路安全能力。這些是開發者公布的表現，並非本站獨立重現；基準成績不等於任何正式運作環境中的發現率、修復品質或安全保證。[^1] 決策前仍須以實際任務測試，分清楚模型是否給出可用答案、系統是否正確執行，以及錯誤能否被發現並限制。

## 開放權重仍受具體授權條款約束

模型與相關文件採用 Mistral Ecosystem Open-Weight License。這是附加條件的修改版 MIT 授權，不能簡寫成無條件的 MIT 或 Apache 開源授權。條款允許相應的使用、複製、修改與部署，同時要求在副本或實質部分中保留著作權及授權通知。[^4]

若授權使用者或其關聯方經營條款所定義的「模型即服務」業務，除第三條規定的例外之外，將模型或其衍生作品用於任何商業目的之前，須另行取得 Mistral 商業授權。條款定義聚焦於第三方能對輸入、參數或訓練資料行使實質控制的模型存取；只在特定功能中嵌入模型的終端產品，以及單純轉送其他託管模型請求的服務，不在該定義內，內部使用與透過 Mistral 官方產品存取則另有例外。不能將這概括成所有託管或所有商業使用，一律受到同一種限制。[^4]

這次發布對希望自行部署大型模型的機構具有實際意義；採購或上線判斷仍須核對授權條款、硬體預算、獨立測試與安全治理，而不能只憑參數規模或排行榜下結論。本文對模型文件進行了編輯整理與翻譯，並保留其署名通知：**2026 - Mistral**；[完整原始授權通知](/news-sources/2026-10-30/mistral-ecosystem-open-weight-license.txt)。這不表示 Mistral 為本文背書。

## 原始許可通知（英文）

> Mistral Ecosystem Open-Weight License 
>
> Mistral Ecosystem Open-Weight License. This license is a modified version of the MIT license. 
> Attribution notice: 2026 - Mistral 
>
> Permission is hereby granted, free of charge, to any person (the “Licensee”) obtaining a copy of this model and associated documentation files - including the model weights, parameters, configuration files, and associated documentation (the “Model”), to deal in the Model without restriction, including without limitation the rights to (a) use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Model; (b) run, deploy, further train or otherwise modify the Model and create derivative works from it; and (c) permit persons to whom the Model is furnished to do so, subject to the following conditions: 
>
> 1. The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Model. 
>
> 2. If the Licensee or any of its affiliates operates a Model as a Service business, the Licensee must enter into a separate commercial license with Mistral before using the Model or its derivative works for any commercial purpose. The Licensee may contact Mistral, using this form: https://mistral.ai/contact/, to request a commercial license. 
>
> "Model as a Service" means giving a third party access to the Model or its derivative works for inference or post-training by any means (for instance via API or hosted endpoints), in a manner that allows such third party to exercise meaningful control over the inputs, parameters, or training data. This does not include (a) end-user products with model capabilities solely embedded within specific features or harnesses, or (b) mere relaying of requests to models hosted by others. 
>
> 3. The requirements set forth in Section 2 do not apply to: (a) internal use of the Model or its derivative works, defined as any use that does not make the Model or its derivative works available to third parties; or (b) any use of the Model accessed through Mistral’s official products. 
>
> THE MODEL AND ANY OUTPUT THEREFROM ARE PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL MISTRAL BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE MODEL OR THE USE OR OTHER DEALINGS IN THE MODEL.
>
> For any questions regarding this license, please contact us using the form here: https://mistral.ai/contact/

[^1]: 模型文件未標明固定發布日期 · [Mistral Large 4 - Le Chonk](https://huggingface.co/mistralai/Mistral-Large-4-1T-A52B/blob/f12dabdc0c1e99e7f7924461a6f308859b05af4d/README.md) · Mistral AI；採用已核對的固定版本文件，參數、能力與測試表述均為開發者說明。
[^2]: 2026-10-29 · [Welcome Le Chonk: Mistral Large 4 on Hugging Face](https://huggingface.co/blog/mistral-large4) · Hugging Face.
[^3]: 2026-10-06 · [Introducing Mistral Large 4](https://mistral.ai/news/mistral-large-4/) · Mistral AI.
[^4]: 授權檔案未標明固定發布日期 · [Mistral Ecosystem Open-Weight License](https://huggingface.co/mistralai/Mistral-Large-4-1T-A52B/blob/f12dabdc0c1e99e7f7924461a6f308859b05af4d/LICENSE) · Mistral AI；具體權利與例外以完整原始條款為準。
