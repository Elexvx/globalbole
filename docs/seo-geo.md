# 全球伯乐 News：SEO / GEO 发布规范

定位：专注科技、创新、商业领域。GEO 指提高内容被生成式搜索正确检索、理解与引用的能力，不是承诺排名或引用。

## 已实现

- 五语言页面独立标题、描述、绝对 canonical、hreflang / x-default、RSS discovery。
- 文章 Open Graph / Twitter 卡片使用实际封面；普通页面使用文字摘要卡，不伪造封面。
- 静态 HTML 中输出 Organization、WebSite、WebPage / Article、BreadcrumbList JSON-LD，转义 `<` 防止注入。
- 文章标题、摘要、作者、发布日期、封面、免费访问声明与实际内容对应。不伪造作者资历、评价、发布日期更新或引用来源。
- 外语前缀下的同一文章副本 canonical 指向原语言地址，并 noindex；无语言前缀的旧入口 noindex/follow。这些兼容路由保留可访问。
- Sitemap 包含本语言文章、栏目、标签、期刊和分页，附语言替代链接；文章 lastmod 当前使用发布日期，后续如有真实修订应新增更新时间字段。
- Markdown 正文静态输出，二级标题自动目录及锚点，不依赖运行时 JSON 请求才能抓取。

## 上线前必须完成

1. 在 Vercel 配置 `NEXT_PUBLIC_SITE_URL=https://正式主域名` 并重新构建。域名尚未由用户最终确认，不能将 localhost 或预览地址提交收录。预览部署启用 Vercel 部署保护，避免预览地址被索引。
2. 当前 150 篇均为功能测试示例。正式收录前将示例移出发布目录或设 `draft: true`，换成经过核实的原创内容；不要只删除“示例”提示后发布。
3. 提供真实主体、作者/编辑介绍、编辑部邮箱、勘误渠道、图片授权。不要编造公司法律名称、社交账号或组织认证。
4. Google Search Console、Bing Webmaster Tools 验证域名并提交 `/sitemap.xml`。用 Rich Results Test 检查上线文章。检查真实页面 HTTP 状态、索引、移动端 Core Web Vitals，再跟踪展示、点击和 AI 引用，而非以构建通过替代结果。
5. 每次 Markdown 更新必须重新部署，保持 HTML、JSON、元数据、RSS 一致。接入远程 JSON 后，仅浏览器数据变更不更新静态 SEO，后端应触发构建 webhook。

## 文章编辑模板（放在 Markdown 正文）

```markdown
## 核心结论
用简短段落回答文章讨论的问题，标明适用范围。

## 事实与分析
区分已验证事实、作者判断、预测与不确定性。数据注明时间、单位、样本与方法。

## 资料来源
- [机构或作者：文献标题](https://来源原始页面)（发布日期，查阅日期）

## 更正与更新
只有实际修订才说明修订时间和变更，不自动刷新日期。
```

译文保持事实、数字与出处一致，共用 translationKey；没有译文时不假装存在。栏目已统一为科技、创新、商业；历史文章按内容重新归类，文章 slug 与 translationKey 保持不变。

## 不采用的手段

不做关键词堆砌、隐藏文本、面向模型的提示注入、虚假 FAQ 或批量低价值内容。`llms.txt` 不是 Google AI 搜索的必需项，本次不以它代替正文与结构化数据。没有配置 IndexNow 密钥，不虚报已提交。

参考：[Google AI 搜索指南](https://developers.google.com/search/docs/appearance/ai-features)、[Article 结构化数据](https://developers.google.com/search/docs/appearance/structured-data/article)、[Bing 指南](https://www.bing.com/webmasters/help/webmaster-guidelines-30fba23a)。
