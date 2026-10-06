# 全球伯乐 News：SEO / GEO 发布规范

GEO 指提高内容被生成式搜索正确检索、理解与引用的能力，不是承诺排名或引用。Lighthouse 的技术 SEO 分数也不代表搜索排名、收录或 AI 引用。

## 当前内容与真实边界

文章由 `content/issues/` 中的 Markdown 生成；界面支持 zh-CN、zh-TW、en、ru、fr。只为实际发布的译文建立 hreflang，不根据界面语言虚构文章。保留文章 URL、正文、出处、图片和授权说明。

尚未配置公开编辑部联系方式，作者页是一般说明，不是虚构的个人履历。需要网站所有者提供真实主体、作者或编辑介绍、邮箱和勘误渠道后再增加这些信息及对应结构化数据。不能虚构公司法律名称、社交账号、组织认证或作者资历。

首页分别提供五种语言的简洁标题和说明。说明补充网站报道范围和来源呈现方式，不承诺排名、完整覆盖或独家报道。文章 Markdown 的 `title` 与 `description` 是页面可见标题和摘要；`seoTitle` 与 `seoDescription` 只用于 HTML title/description、Open Graph 和 Twitter metadata。没有填写 SEO 字段时，生成器回退到可见标题和摘要。SEO 文案应自然、准确、彼此有区分，不堆砌关键词或改变事实含义。

## Canonical、语言和兼容入口

- 正式 canonical 源默认为 `https://www.globalbole.com`；`NEXT_PUBLIC_SITE_URL` 可明确覆盖。Vercel 预览部署地址不会自动替换正式域名。预览保护仍应在 Vercel 部署设置中管理。
- `/` 是简体中文首页的 canonical；`/zh-CN/` 保留访问和原有界面，canonical 指向 `/`。两者的 WebPage、WebSite、Organization 和首页 hreflang 保持一致。
- 五语言首页与栏目页保留独立界面和可索引状态。没有本语言文章的栏目显示真实空状态，不挪用其他栏目文章。
- 文章只为真实的 translationKey 对应译文生成 hreflang。外语前缀下的原文兼容副本 canonical 指向实际原语言文章，并 noindex/follow。
- 标签、单期和分页的 hreflang 仅包含实际有相应内容的语言。空集合不会声称是已有内容的译文。
- 无语言前缀的旧文章、信息、栏目、标签、期刊和归档入口在 Vercel 永久重定向到相应语言地址。脱离 Vercel 的静态 HTML 后备页仍有正确 canonical 和 noindex/follow，不再错误指向首页。
- 旧 world/politics/culture/cities 栏目与标签的归档重定向保留优先级。原始 URL、查询参数兼容性和文章 slug 保留。
- Sitemap 使用和 HTML 完全相同的 canonical/语言映射；不包含根首页副本、文章兼容副本或没有本语言内容的单期页。栏目、五语言主页和已翻译的信息页继续保留。

## 结构化数据与可抓取正文

- 静态 HTML 输出稳定的 Organization、WebSite、WebPage；文章单独输出 NewsArticle，正确关联 mainEntityOfPage、publisher 和实际所属栏目。
- 当前文章署名为全球伯乐 News，因此 author 使用 Organization 并链接到实际发布者主页。将来若引入个人作者，应先核实身份、建立可见的作者页面，并扩展作者类型，不能继续套用机构类型。
- NewsArticle 的 headline 和 description 保持可见标题与摘要。SEO 专用标题和说明只进入页面 metadata，不覆盖可见正文或结构化 headline。发布日期来自 `date`；文章日期仅保存到日，不伪造精确发布时间。
- `updatedAt` 是可选的真实编辑修订日期。只有文章实际修订后才填写；未填写时不输出 `dateModified` 或 sitemap `lastmod`。填写后，两处都使用同一个 `updatedAt`，而 RSS 仍使用原始发布日期。
- citation 仅提取正文现有的资料来源脚注链接及标题。不会把图片授权当报道出处，也不会增加不存在的来源。标题与源链接在 Markdown 和静态 HTML 中都能查阅。
- 文章 breadcrumb 是首页 → 实际栏目 → 当前文章；单期是首页 → 期刊 → 当前期刊。首页不输出只有一个项目的 BreadcrumbList。
- JSON-LD 转义 `<` 防止脚本注入；Markdown 正文、标题、表格、目录锚点、图片说明和来源脚注静态可抓取。
- 文章 Open Graph / Twitter 卡片使用实际封面和摘要；不为普通页面伪造封面。RSS 链接直接指向 canonical 文章。

## 验证与发布

执行 `npm test`、`npm run lint`、`npm run build`、`npm run check:export` 和 `npm run check:seo`。SEO 检查逐一核验五种语言的首页 metadata、每篇 canonical 文章的 SEO title/description 与 Open Graph/Twitter、一致的可见标题与 NewsArticle headline，以及真实 `updatedAt` 对应的 sitemap `lastmod`。

SEO 检查覆盖：首页 canonical、唯一 sitemap 地址、每个 sitemap 页面可索引且自指 canonical、语言链接指向实际 canonical 页面并互相对应、NewsArticle 日期/作者/图片/来源与原文一致、旧入口 fallback noindex 和 Vercel 重定向匹配。上线后还应检查真实 HTTP 308/200/404 状态与缓存头；静态构建不能替代托管平台验证。

由网站所有者验证 Google Search Console 和 Bing Webmaster Tools，提交 `/sitemap.xml`，使用 Rich Results Test 和 URL Inspection 检查文章。跟踪真实搜索展示、点击、Core Web Vitals 和 Bing AI Performance 的引用数据。工具访问与账户验证尚未完成时，不声称已经提交或已收录。

每次 Markdown 更新必须重新构建部署，保持 HTML、JSON、元数据和 RSS 一致。浏览器单独更新远程文章 JSON 不能更新静态 SEO；后端发布流程应触发重新构建。

## 后续值得做的编辑工作

发布真实译文后，translationKey 会自动把对应文章纳入语言替代链接。空外语首页、栏目和联系说明仍可访问且可索引；是否在内容增长前暂时 noindex，应由网站所有者结合收录数据单独决定，不能为了 Lighthouse 分数擅自隐藏整个语言站点。

现有文章保留直接、可核查的开头、事实与分析的区分、原始资料链接及图片授权。后续编辑继续注明数据日期、单位、适用范围和不确定性。来源的真实性需要编辑核实，结构化 citation 不构成独立事实核验。

不做关键词堆砌、隐藏内容、模型提示注入、虚假 FAQ、批量低价值内容或虚假权威。Google AI 搜索不要求 `llms.txt` 或特殊 AI schema。未配置 IndexNow 密钥，不虚报提交。

## 官方参考

- [Google AI features and your website](https://developers.google.com/search/docs/appearance/ai-features)
- [Google canonical URLs](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)
- [Google localized versions / hreflang](https://developers.google.com/search/docs/specialty/international/localized-versions)
- [Google Article structured data](https://developers.google.com/search/docs/appearance/structured-data/article)
- [Bing Webmaster Guidelines](https://www.bing.com/webmasters/help/webmaster-guidelines-30fba23a)
- [Bing AI Performance](https://www.bing.com/webmasters/help/ai-performance-9f8e7d6c)
- [Vercel static redirect configuration](https://vercel.com/docs/project-configuration/vercel-json)
