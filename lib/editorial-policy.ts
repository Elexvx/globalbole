import type { Locale } from "./locales";

export const PUBLIC_CONTACT_EMAIL = "globalbole@globalbole.com";
export type InfoPage = "about" | "authors" | "contact" | "privacy";
export type EditorialSection = {
  id: string;
  title: string;
  paragraphs: string[];
  contact?: boolean;
};
export type EditorialPage = {
  title: string;
  description: string;
  intro: string;
  sections: EditorialSection[];
  relatedPages?: InfoPage[];
  contact?: boolean;
};

// Public copy grounded in the publishing workflow. Keep metadata and visible
// policy text together; these are editorial standards, not credentials or guarantees.
export const editorialPages: Record<Locale, Record<InfoPage, EditorialPage>> = {
  "zh-CN": {
    "about": {
      "title": "关于本站",
      "description": "了解全球伯乐 News 的报道范围、原始来源核验、事实与分析区分、图片使用及更正渠道。",
      "intro": "全球伯乐（GlobalBole）按期整理科技、财经、就业与城市生活、国内外要闻、能源产业及创新实践，提供五种语言的阅读界面。文章注明日期、栏目与资料来源；已发布译文通过共同标识关联，尚无译文时保留原文。",
      "sections": [
        {
          "id": "sources",
          "title": "来源与核验",
          "paragraphs": [
            "本站以公开资料为基础整理新闻。编辑流程要求打开原始公告、研究、统计资料及其他引用来源，核对事件日期、数字、适用范围和重要限定，不把来源转述当作现场采访。",
            "文章中的上标对应文末来源附注，供读者查阅原文标题、日期和链接。文章刊发日与事件发生日、数据期可能不同；阅读动态数据时，应以文内说明的数据期为准。"
          ]
        },
        {
          "id": "analysis",
          "title": "事实、背景与分析",
          "paragraphs": [
            "报道应区分已核实的事实、来源方的说法和编辑分析。对机制、影响或前景的分析须说明依据与适用条件；计划、预测和研究结果不等同于已经实现的效果。信息不足时，不以推测补充事实。"
          ]
        },
        {
          "id": "images",
          "title": "图片、版权与 AI 示意图",
          "paragraphs": [
            "图片使用以逐图核验来源及许可为前提，注明来源不等于获得转载授权。照片和原始图表按适用许可保留署名及链接；资料照片须与当前事件区分。",
            "使用 AI 生成的编辑示意图时，图注和图片说明须明确标识，不能冒充现场照片或事件证据。数据图仅使用获准的原始图表，不用 AI 生成或自行重制的图表替代。"
          ]
        },
        {
          "id": "corrections",
          "title": "更正与反馈",
          "paragraphs": [
            "如发现事实、翻译、来源链接或图片署名有误，请提供文章网址、语言版本、具体问题及可核查依据。实质更新应在文章中说明日期与变化；同一问题涉及译文时，也需核对相应语言版本。"
          ],
          "contact": true
        }
      ],
      "relatedPages": [
        "authors",
        "contact"
      ]
    },
    "authors": {
      "title": "作者",
      "description": "说明全球伯乐 News 的机构署名、资料整理方式、AI 辅助编译和多语言编辑流程。",
      "intro": "本站新闻通常署名“全球伯乐 News”，作者说明为“资料整理”。这是刊物层面的编辑署名，不代表一名具名记者，也不意味着现场采访。",
      "sections": [
        {
          "id": "byline",
          "title": "如何理解署名",
          "paragraphs": [
            "文章页面显示署名、作者说明、刊发日期和栏目。组织署名说明资料整理的发布归属，不应被理解为某位个人的履历、专业资格或独立采访经历。"
          ]
        },
        {
          "id": "preparation",
          "title": "AI 辅助与五语编辑",
          "paragraphs": [
            "本站使用 AI 辅助资料整理、写作和翻译。AI 输出本身不是证据，也可能产生事实或翻译错误；编辑流程要求回到原始资料核对，而不是把生成内容当作来源。",
            "发布流程先完成简体中文稿的事实核验，再编辑繁体中文、英文、俄文和法文版本。各版本应保留相同事实、数字、关键限定、来源及分析深度，并通过同篇语言链接关联。"
          ]
        },
        {
          "id": "accountability",
          "title": "依据与责任归属",
          "paragraphs": [
            "读者可通过文末来源附注核对报道依据。资料整理不等于被引用机构对本站内容背书；文中的编辑分析也不应被当作来源方的结论。如对署名、表述或译文有疑问，可通过公开邮箱联系。"
          ],
          "contact": true
        }
      ],
      "relatedPages": [
        "about",
        "contact"
      ]
    },
    "contact": {
      "title": "联系我们",
      "description": "通过 globalbole@globalbole.com 联系全球伯乐 News，提交事实更正、翻译问题、图片版权反馈或新闻线索。",
      "intro": "全球伯乐 News 的公开联系邮箱用于编辑反馈、内容更正、图片与版权问题及新闻线索。",
      "sections": [
        {
          "id": "corrections",
          "title": "事实与翻译更正",
          "paragraphs": [
            "请提供文章网址及语言版本，指出需要核对的句子、数字或链接，并附上支持更正的原始资料。若问题涉及多种语言，可同时列出对应页面，便于核对。"
          ]
        },
        {
          "id": "rights",
          "title": "图片与版权反馈",
          "paragraphs": [
            "请注明相关文章和图片位置、原作品链接、权利归属说明及希望核查的问题。公开可见或附有署名，并不意味着材料可以不受限制地转载。"
          ]
        },
        {
          "id": "tips",
          "title": "新闻线索与来信",
          "paragraphs": [
            "新闻线索请尽量附上原始公告、研究或可公开核查的资料，并区分已发生的事实与尚待确认的信息。请勿发送密码、证件号码等无关敏感信息；邮件不应被视为安全或匿名的投稿渠道。"
          ]
        }
      ],
      "relatedPages": [
        "about",
        "authors"
      ],
      "contact": true
    },
    "privacy": {
      "title": "隐私说明",
      "description": "本网站没有编辑后台、账号系统或邮件收集表单。浏览器保存视觉主题和语言偏好；带语言的网址优先，返回首页时可恢复上次选择。文章公开托管，阅读时托管平台可能记录基本访问日志。",
      "intro": "本网站没有编辑后台、账号系统或邮件收集表单。浏览器保存视觉主题和语言偏好；带语言的网址优先，返回首页时可恢复上次选择。文章公开托管，阅读时托管平台可能记录基本访问日志。",
      "sections": []
    }
  },
  "zh-TW": {
    "about": {
      "title": "關於本站",
      "description": "了解全球伯樂 News 的報導範圍、原始來源核驗、事實與分析區分、圖片使用及更正管道。",
      "intro": "全球伯樂（GlobalBole）按期整理科技、財經、就業與城市生活、國內外要聞、能源產業及創新實踐，提供五種語言的閱讀介面。文章註明日期、欄目與資料來源；已發布譯文透過共同識別碼關聯，尚無譯文時保留原文。",
      "sections": [
        {
          "id": "sources",
          "title": "來源與核驗",
          "paragraphs": [
            "本站以公開資料為基礎整理新聞。編輯流程要求開啟原始公告、研究、統計資料及其他引用來源，核對事件日期、數字、適用範圍和重要限制，不把來源轉述當作現場採訪。",
            "文章中的上標對應文末來源附註，供讀者查閱原文標題、日期和連結。文章刊發日與事件發生日、資料期間可能不同；閱讀動態資料時，應以文內說明的資料期間為準。"
          ]
        },
        {
          "id": "analysis",
          "title": "事實、背景與分析",
          "paragraphs": [
            "報導應區分已核實的事實、來源方的說法和編輯分析。對機制、影響或前景的分析須說明依據與適用條件；計畫、預測和研究結果不等同於已經實現的效果。資訊不足時，不以推測補充事實。"
          ]
        },
        {
          "id": "images",
          "title": "圖片、著作權與 AI 示意圖",
          "paragraphs": [
            "圖片使用以逐圖核驗來源及授權為前提，註明來源不等於取得轉載授權。照片和原始圖表依適用授權保留署名及連結；資料照片須與當前事件區分。",
            "使用 AI 生成的編輯示意圖時，圖說和圖片說明須明確標示，不能冒充現場照片或事件證據。資料圖僅使用獲准的原始圖表，不用 AI 生成或自行重製的圖表替代。"
          ]
        },
        {
          "id": "corrections",
          "title": "更正與回饋",
          "paragraphs": [
            "如發現事實、翻譯、來源連結或圖片署名有誤，請提供文章網址、語言版本、具體問題及可核查依據。實質更新應在文章中說明日期與變化；同一問題涉及譯文時，也需核對相應語言版本。"
          ],
          "contact": true
        }
      ],
      "relatedPages": [
        "authors",
        "contact"
      ]
    },
    "authors": {
      "title": "作者",
      "description": "說明全球伯樂 News 的機構署名、資料整理方式、AI 輔助編譯和多語言編輯流程。",
      "intro": "本站新聞通常署名「全球伯樂 News」，作者說明為「資料整理」。這是刊物層面的編輯署名，不代表一名具名記者，也不意味著現場採訪。",
      "sections": [
        {
          "id": "byline",
          "title": "如何理解署名",
          "paragraphs": [
            "文章頁面顯示署名、作者說明、刊發日期和欄目。組織署名說明資料整理的發布歸屬，不應被理解為某位個人的履歷、專業資格或獨立採訪經歷。"
          ]
        },
        {
          "id": "preparation",
          "title": "AI 輔助與五語編輯",
          "paragraphs": [
            "本站使用 AI 輔助資料整理、寫作和翻譯。AI 輸出本身不是證據，也可能產生事實或翻譯錯誤；編輯流程要求回到原始資料核對，而不是把生成內容當作來源。",
            "發布流程先完成簡體中文稿的事實核驗，再編輯繁體中文、英文、俄文和法文版本。各版本應保留相同事實、數字、關鍵限制、來源及分析深度，並透過同篇語言連結關聯。"
          ]
        },
        {
          "id": "accountability",
          "title": "依據與責任歸屬",
          "paragraphs": [
            "讀者可透過文末來源附註核對報導依據。資料整理不等於被引用機構為本站內容背書；文中的編輯分析也不應被當作來源方的結論。如對署名、表述或譯文有疑問，可透過公開信箱聯絡。"
          ],
          "contact": true
        }
      ],
      "relatedPages": [
        "about",
        "contact"
      ]
    },
    "contact": {
      "title": "聯絡我們",
      "description": "透過 globalbole@globalbole.com 聯絡全球伯樂 News，提交事實更正、翻譯問題、圖片著作權回饋或新聞線索。",
      "intro": "全球伯樂 News 的公開聯絡信箱用於編輯回饋、內容更正、圖片與著作權問題及新聞線索。",
      "sections": [
        {
          "id": "corrections",
          "title": "事實與翻譯更正",
          "paragraphs": [
            "請提供文章網址及語言版本，指出需要核對的句子、數字或連結，並附上支持更正的原始資料。若問題涉及多種語言，可同時列出對應頁面，便於核對。"
          ]
        },
        {
          "id": "rights",
          "title": "圖片與著作權回饋",
          "paragraphs": [
            "請註明相關文章和圖片位置、原作品連結、權利歸屬說明及希望核查的問題。公開可見或附有署名，並不意味著材料可以不受限制地轉載。"
          ]
        },
        {
          "id": "tips",
          "title": "新聞線索與來信",
          "paragraphs": [
            "新聞線索請盡量附上原始公告、研究或可公開核查的資料，並區分已發生的事實與尚待確認的資訊。請勿傳送密碼、證件號碼等無關敏感資訊；電子郵件不應被視為安全或匿名的投稿管道。"
          ]
        }
      ],
      "relatedPages": [
        "about",
        "authors"
      ],
      "contact": true
    },
    "privacy": {
      "title": "隱私說明",
      "description": "本網站沒有編輯後台、帳號系統或信箱收集表單。瀏覽器儲存視覺主題與語言偏好；帶語言的網址優先，返回首頁時可恢復上次選擇。文章公開託管，閱讀時託管平台可能記錄基本存取日誌。",
      "intro": "本網站沒有編輯後台、帳號系統或信箱收集表單。瀏覽器儲存視覺主題與語言偏好；帶語言的網址優先，返回首頁時可恢復上次選擇。文章公開託管，閱讀時託管平台可能記錄基本存取日誌。",
      "sections": []
    }
  },
  "en": {
    "about": {
      "title": "About Global Bole News",
      "description": "How Global Bole News uses primary sources, separates facts from analysis, handles image rights and AI illustrations, and receives corrections.",
      "intro": "Global Bole News (GlobalBole) organizes coverage of technology, finance, work and city life, current affairs, energy and industry, and practical innovation by issue. The reading interface supports five languages. Articles identify their date, section and sources. Available translations are linked; otherwise the original remains available.",
      "sections": [
        {
          "id": "sources",
          "title": "Sources and verification",
          "paragraphs": [
            "Our coverage is compiled from public materials. The editorial workflow requires opening original announcements, research, statistics and other cited sources to check event dates, figures, scope and important qualifications. Compilation is not on-the-ground reporting.",
            "Numbered references in the text lead to source notes with original titles, dates and links. An article’s publication date can differ from the event date or data period. For changing datasets, use the period identified in the article."
          ]
        },
        {
          "id": "analysis",
          "title": "Facts, context and analysis",
          "paragraphs": [
            "Coverage should distinguish verified facts, statements attributed to sources and editorial analysis. Analysis of mechanisms, effects or prospects must explain its evidence and conditions. Plans, forecasts and research findings are not the same as achieved outcomes; missing facts should not be filled with speculation."
          ]
        },
        {
          "id": "images",
          "title": "Images, rights and AI illustrations",
          "paragraphs": [
            "Image use requires checking each image’s source and permission. Attribution alone is not a republication license. Photographs and original charts retain the credits and links required by their licenses; archival photographs must be distinguished from the current event.",
            "AI-generated editorial illustrations must be identified in their captions and image descriptions. They must not pose as event photographs or evidence. Data charts are limited to authorized originals, not AI-generated or independently redrawn substitutes."
          ]
        },
        {
          "id": "corrections",
          "title": "Corrections and feedback",
          "paragraphs": [
            "If you find a factual, translation, source-link or image-credit error, send the article URL, language, specific issue and supporting evidence. Substantive updates should state the date and change in the article; affected language versions also need checking."
          ],
          "contact": true
        }
      ],
      "relatedPages": [
        "authors",
        "contact"
      ]
    },
    "authors": {
      "title": "Authors",
      "description": "Understand Global Bole News’s publication byline, research and compilation, AI-assisted writing and translation, and multilingual editorial workflow.",
      "intro": "News articles generally carry the Global Bole News byline with the role “Research and compilation”. This is a publication-level editorial credit, not the name of an individual reporter or a claim of on-the-ground reporting.",
      "sections": [
        {
          "id": "byline",
          "title": "What the byline means",
          "paragraphs": [
            "Article pages show the byline, role, publication date and section. The organizational credit identifies the publication responsible for the compilation; it does not establish an individual’s biography, professional qualifications or independent reporting experience."
          ]
        },
        {
          "id": "preparation",
          "title": "AI assistance and five-language editing",
          "paragraphs": [
            "Global Bole News uses AI assistance for research compilation, writing and translation. AI output is not evidence and can introduce factual or translation errors. The editorial workflow requires checking original materials rather than treating generated text as a source.",
            "The publishing process starts with fact-checking the Simplified Chinese draft, then preparing Traditional Chinese, English, Russian and French editions. Versions should preserve the same facts, figures, qualifications, sources and analytical depth, and are connected by article-language links."
          ]
        },
        {
          "id": "accountability",
          "title": "Evidence and accountability",
          "paragraphs": [
            "Readers can check the reporting basis in the source notes. Compilation does not imply endorsement by a cited organization, and editorial analysis should not be mistaken for that source’s conclusions. Questions about attribution, wording or translation can be sent to the public mailbox."
          ],
          "contact": true
        }
      ],
      "relatedPages": [
        "about",
        "contact"
      ]
    },
    "contact": {
      "title": "Contact",
      "description": "Contact Global Bole News at globalbole@globalbole.com about factual corrections, translation errors, image rights or news tips.",
      "intro": "The Global Bole News public mailbox accepts editorial feedback, content corrections, image and copyright questions, and news tips.",
      "sections": [
        {
          "id": "corrections",
          "title": "Factual and translation corrections",
          "paragraphs": [
            "Include the article URL and language, identify the sentence, figure or link that needs checking, and provide original material supporting the correction. If several language versions are affected, include those URLs too."
          ]
        },
        {
          "id": "rights",
          "title": "Image and copyright questions",
          "paragraphs": [
            "Identify the article and image, link to the original work, explain the rights involved and describe the issue to investigate. Public availability or attribution does not mean material can be republished without restriction."
          ]
        },
        {
          "id": "tips",
          "title": "News tips and correspondence",
          "paragraphs": [
            "Where possible, include original announcements, research or publicly verifiable material, distinguishing established facts from unconfirmed information. Do not send passwords, identity-document numbers or unrelated sensitive information. Email should not be treated as a secure or anonymous submission channel."
          ]
        }
      ],
      "relatedPages": [
        "about",
        "authors"
      ],
      "contact": true
    },
    "privacy": {
      "title": "Privacy",
      "description": "There is no editor, account system or email collection form. The browser stores visual theme and language preferences. An explicit language URL takes priority; returning to the homepage restores the last selected language. The hosting provider may retain basic access logs when serving public articles.",
      "intro": "There is no editor, account system or email collection form. The browser stores visual theme and language preferences. An explicit language URL takes priority; returning to the homepage restores the last selected language. The hosting provider may retain basic access logs when serving public articles.",
      "sections": []
    }
  },
  "ru": {
    "about": {
      "title": "О Global Bole News",
      "description": "Источники Global Bole News: проверка фактов, отличие анализа от фактов, права на изображения, иллюстрации ИИ и обращения об исправлениях.",
      "intro": "Global Bole News (GlobalBole) объединяет по выпускам материалы о технологиях, экономике, работе и городской жизни, главных новостях, энергетике, промышленности и практических инновациях. Интерфейс доступен на пяти языках. У статей указаны дата, раздел и источники. Доступные переводы связаны между собой; при отсутствии перевода остаётся оригинал.",
      "sections": [
        {
          "id": "sources",
          "title": "Источники и проверка",
          "paragraphs": [
            "Мы готовим материалы на основе общедоступных данных. Редакционный процесс требует обращения к исходным объявлениям, исследованиям, статистике и другим цитируемым источникам для проверки дат событий, чисел, области применимости и важных оговорок. Подготовка по источникам не является репортажем с места событий.",
            "Нумерованные ссылки в тексте ведут к примечаниям с названиями, датами и ссылками на первоисточники. Дата публикации статьи может отличаться от даты события или периода данных. Для меняющихся наборов данных следует учитывать период, указанный в статье."
          ]
        },
        {
          "id": "analysis",
          "title": "Факты, контекст и анализ",
          "paragraphs": [
            "Материал должен различать проверенные факты, утверждения источников и редакционный анализ. Анализ механизмов, последствий и перспектив требует указания оснований и условий применимости. Планы, прогнозы и результаты исследований не равнозначны достигнутым результатам; недостающие факты нельзя заменять предположениями."
          ]
        },
        {
          "id": "images",
          "title": "Изображения, права и иллюстрации ИИ",
          "paragraphs": [
            "Использование изображения требует проверки его источника и разрешения. Указание авторства само по себе не даёт права на перепубликацию. Фотографии и оригинальные графики должны сохранять предусмотренные лицензией подписи и ссылки; архивные снимки необходимо отличать от изображений текущего события.",
            "Иллюстрации, созданные ИИ, должны быть обозначены в подписях и описаниях изображений. Их нельзя выдавать за фотографии события или доказательства. Для графиков данных используются только разрешённые оригиналы, а не созданные ИИ или самостоятельно перерисованные замены."
          ]
        },
        {
          "id": "corrections",
          "title": "Исправления и обратная связь",
          "paragraphs": [
            "Если вы обнаружили ошибку в фактах, переводе, ссылке на источник или подписи к изображению, укажите URL статьи, язык, конкретную проблему и подтверждающие материалы. Существенные обновления должны сопровождаться датой и описанием изменений в статье; затронутые переводы также требуют проверки."
          ],
          "contact": true
        }
      ],
      "relatedPages": [
        "authors",
        "contact"
      ]
    },
    "authors": {
      "title": "Авторы",
      "description": "Как устроены подпись Global Bole News, подготовка по источникам, использование ИИ для текста и перевода и выпуск материалов на пяти языках.",
      "intro": "Новости обычно выходят под подписью Global Bole News с обозначением «Подготовка материалов». Это редакционная подпись издания, а не имя отдельного журналиста и не указание на работу на месте событий.",
      "sections": [
        {
          "id": "byline",
          "title": "Что означает подпись",
          "paragraphs": [
            "На странице статьи указаны подпись, роль, дата публикации и раздел. Подпись издания обозначает, кто публикует подготовленный по источникам материал; она не подтверждает биографию, профессиональную квалификацию или опыт самостоятельных репортажей конкретного человека."
          ]
        },
        {
          "id": "preparation",
          "title": "Помощь ИИ и пять языков",
          "paragraphs": [
            "Global Bole News использует ИИ для помощи в сборе материалов, написании и переводе. Ответ ИИ не является доказательством и может содержать фактические или переводческие ошибки. Редакционный процесс требует проверки исходных материалов, а не использования сгенерированного текста в качестве источника.",
            "Процесс публикации начинается с проверки фактов в тексте на упрощённом китайском, затем готовятся версии на традиционном китайском, английском, русском и французском. Версии должны сохранять те же факты, числа, оговорки, источники и глубину анализа; они связаны переключателем языка статьи."
          ]
        },
        {
          "id": "accountability",
          "title": "Основания и ответственность",
          "paragraphs": [
            "Основания публикации можно проверить по примечаниям об источниках. Подготовка материала не означает одобрения со стороны цитируемой организации; редакционный анализ не следует принимать за её выводы. Вопросы об авторстве, формулировках или переводе можно направить на публичный адрес электронной почты."
          ],
          "contact": true
        }
      ],
      "relatedPages": [
        "about",
        "contact"
      ]
    },
    "contact": {
      "title": "Контакты",
      "description": "Напишите Global Bole News на globalbole@globalbole.com об исправлении фактов, ошибках перевода, правах на изображения или новостной теме.",
      "intro": "Публичный почтовый адрес Global Bole News предназначен для редакционной обратной связи, исправлений, вопросов об изображениях и авторских правах, а также новостных предложений.",
      "sections": [
        {
          "id": "corrections",
          "title": "Исправление фактов и перевода",
          "paragraphs": [
            "Укажите URL статьи и язык, предложение, число или ссылку, требующие проверки, и приложите исходные материалы, подтверждающие исправление. Если затронуты несколько языковых версий, добавьте ссылки на них."
          ]
        },
        {
          "id": "rights",
          "title": "Изображения и авторские права",
          "paragraphs": [
            "Укажите статью и изображение, ссылку на оригинальную работу, сведения о правах и конкретную проблему. Общедоступность или указание авторства не означают возможности неограниченной перепубликации."
          ]
        },
        {
          "id": "tips",
          "title": "Новостные предложения и письма",
          "paragraphs": [
            "По возможности приложите исходные объявления, исследования или открыто проверяемые материалы, отделяя установленные факты от неподтверждённых сведений. Не отправляйте пароли, номера удостоверений личности и не относящиеся к вопросу конфиденциальные данные. Электронную почту не следует считать защищённым или анонимным каналом передачи материалов."
          ]
        }
      ],
      "relatedPages": [
        "about",
        "authors"
      ],
      "contact": true
    },
    "privacy": {
      "title": "Конфиденциальность",
      "description": "На сайте нет редактора, учётных записей и форм сбора почты. Браузер сохраняет тему оформления и выбранный язык. Язык в адресе страницы имеет приоритет; при возвращении на главную восстанавливается последний выбор. Хостинг может хранить базовые журналы доступа к открытым статьям.",
      "intro": "На сайте нет редактора, учётных записей и форм сбора почты. Браузер сохраняет тему оформления и выбранный язык. Язык в адресе страницы имеет приоритет; при возвращении на главную восстанавливается последний выбор. Хостинг может хранить базовые журналы доступа к открытым статьям.",
      "sections": []
    }
  },
  "fr": {
    "about": {
      "title": "À propos de Global Bole News",
      "description": "Les pratiques de Global Bole News : sources originales, vérification, distinction entre faits et analyse, droits des images, illustrations IA et corrections.",
      "intro": "Global Bole News (GlobalBole) rassemble par édition des articles sur la technologie, la finance, l’emploi et la vie urbaine, l’actualité, l’énergie, l’industrie et l’innovation pratique. L’interface est disponible en cinq langues. Les articles indiquent leur date, leur rubrique et leurs sources. Les traductions disponibles sont reliées entre elles ; sinon, le texte original reste accessible.",
      "sections": [
        {
          "id": "sources",
          "title": "Sources et vérification",
          "paragraphs": [
            "Nos articles sont préparés à partir de documents publics. Le processus éditorial exige de consulter les annonces originales, études, statistiques et autres sources citées pour vérifier les dates des événements, les chiffres, leur portée et les réserves importantes. Ce travail de synthèse ne constitue pas un reportage sur place.",
            "Les renvois numérotés conduisent aux notes de sources, qui indiquent titres originaux, dates et liens. La date de publication d’un article peut différer de celle de l’événement ou de la période des données. Pour les données évolutives, il faut se référer à la période précisée dans l’article."
          ]
        },
        {
          "id": "analysis",
          "title": "Faits, contexte et analyse",
          "paragraphs": [
            "Les articles doivent distinguer les faits vérifiés, les déclarations attribuées aux sources et l’analyse éditoriale. L’analyse des mécanismes, effets ou perspectives doit préciser ses fondements et ses conditions. Projets, prévisions et résultats de recherche ne sont pas des effets déjà réalisés ; des suppositions ne doivent pas combler les faits manquants."
          ]
        },
        {
          "id": "images",
          "title": "Images, droits et illustrations IA",
          "paragraphs": [
            "L’utilisation de chaque image nécessite de vérifier sa source et son autorisation. Mentionner un auteur ne vaut pas licence de republication. Les photographies et graphiques originaux conservent les crédits et liens exigés par leur licence ; les photographies d’archives doivent être distinguées de l’événement actuel.",
            "Les illustrations éditoriales générées par IA doivent être identifiées dans leurs légendes et descriptions. Elles ne doivent pas passer pour des photographies de l’événement ou des preuves. Les graphiques de données sont limités aux originaux autorisés, sans remplacement généré par IA ou redessiné par nos soins."
          ]
        },
        {
          "id": "corrections",
          "title": "Corrections et remarques",
          "paragraphs": [
            "Pour signaler une erreur factuelle, de traduction, de lien ou de crédit d’image, précisez l’URL de l’article, la langue, le problème et les éléments vérifiables à l’appui. Les mises à jour substantielles doivent indiquer leur date et les changements dans l’article ; les versions linguistiques concernées doivent aussi être vérifiées."
          ],
          "contact": true
        }
      ],
      "relatedPages": [
        "authors",
        "contact"
      ]
    },
    "authors": {
      "title": "Auteurs",
      "description": "Comprendre la signature Global Bole News, la synthèse des sources, l’aide de l’IA à la rédaction et à la traduction et le travail en cinq langues.",
      "intro": "Les articles portent généralement la signature Global Bole News et une mention de compilation des sources ou de recherche et synthèse. Il s’agit d’une signature éditoriale au nom de la publication, et non d’un journaliste individuel ni d’une indication de reportage sur place.",
      "sections": [
        {
          "id": "byline",
          "title": "Le sens de la signature",
          "paragraphs": [
            "Les pages d’articles affichent la signature, le rôle, la date de publication et la rubrique. La signature de la publication indique qui publie le travail de synthèse ; elle ne constitue pas la biographie, la qualification professionnelle ou l’expérience de reportage d’une personne précise."
          ]
        },
        {
          "id": "preparation",
          "title": "Aide de l’IA et édition en cinq langues",
          "paragraphs": [
            "Global Bole News utilise l’IA pour aider à la recherche documentaire, à la rédaction et à la traduction. Une réponse d’IA n’est pas une preuve et peut comporter des erreurs factuelles ou de traduction. Le processus éditorial exige de vérifier les documents originaux plutôt que de traiter un texte généré comme une source.",
            "La publication commence par la vérification des faits du texte en chinois simplifié, suivie des versions en chinois traditionnel, anglais, russe et français. Celles-ci doivent conserver les mêmes faits, chiffres, réserves, sources et profondeur d’analyse ; elles sont reliées par les liens de langue de l’article."
          ]
        },
        {
          "id": "accountability",
          "title": "Fondements et responsabilité",
          "paragraphs": [
            "Les notes de sources permettent de vérifier les fondements des articles. La synthèse ne signifie pas que les organismes cités approuvent notre contenu ; l’analyse éditoriale ne doit pas être confondue avec leurs conclusions. Les questions sur la signature, les formulations ou la traduction peuvent être adressées à notre boîte publique."
          ],
          "contact": true
        }
      ],
      "relatedPages": [
        "about",
        "contact"
      ]
    },
    "contact": {
      "title": "Contact",
      "description": "Contactez Global Bole News à globalbole@globalbole.com pour une correction factuelle, une erreur de traduction, des droits d’image ou une piste d’actualité.",
      "intro": "L’adresse publique de Global Bole News reçoit les remarques éditoriales, demandes de correction, questions sur les images et les droits d’auteur, ainsi que les pistes d’actualité.",
      "sections": [
        {
          "id": "corrections",
          "title": "Corrections factuelles et traductions",
          "paragraphs": [
            "Indiquez l’URL et la langue de l’article, la phrase, le chiffre ou le lien à vérifier, et joignez les documents originaux justifiant la correction. Si plusieurs versions linguistiques sont concernées, ajoutez leurs liens."
          ]
        },
        {
          "id": "rights",
          "title": "Images et droits d’auteur",
          "paragraphs": [
            "Identifiez l’article et l’image, donnez le lien de l’œuvre originale, précisez les droits concernés et décrivez le problème à examiner. L’accès public ou la mention d’un auteur n’autorisent pas une republication sans restriction."
          ]
        },
        {
          "id": "tips",
          "title": "Pistes d’actualité et correspondance",
          "paragraphs": [
            "Joignez si possible les annonces originales, études ou documents publiquement vérifiables, en distinguant les faits établis des informations non confirmées. N’envoyez pas de mots de passe, numéros de pièces d’identité ou données sensibles sans rapport avec le sujet. Le courriel ne doit pas être considéré comme un canal sécurisé ou anonyme de transmission."
          ]
        }
      ],
      "relatedPages": [
        "about",
        "authors"
      ],
      "contact": true
    },
    "privacy": {
      "title": "Confidentialité",
      "description": "Le site ne comporte ni éditeur, ni comptes, ni collecte d’adresses e-mail. Le navigateur conserve le thème visuel et la langue choisie. La langue indiquée dans l’URL est prioritaire ; le retour à l’accueil rétablit le dernier choix. L’hébergeur peut conserver des journaux d’accès élémentaires aux articles publics.",
      "intro": "Le site ne comporte ni éditeur, ni comptes, ni collecte d’adresses e-mail. Le navigateur conserve le thème visuel et la langue choisie. La langue indiquée dans l’URL est prioritaire ; le retour à l’accueil rétablit le dernier choix. L’hébergeur peut conserver des journaux d’accès élémentaires aux articles publics.",
      "sections": []
    }
  }
};
