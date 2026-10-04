# 前端数据接口契约 v1

## 1. 已实现范围与运行方式

本项目仍然是 Next.js 静态导出的只读网站，没有编辑后台、数据库、鉴权或运行时 Node 服务。

数据流：Markdown 文件 → 启动/构建时解析与校验 → JSON 文件 → 浏览器运行时 GET → 公共数据 Provider → 首页、分类、各期、标签、搜索、详情和语言切换。

- `npm run dev`：启动时扫描 `content/issues/`，文件变化时重新生成 JSON；浏览器刷新后读取新 JSON。
- `npm run content`：单独生成 JSON。
- `npm run build`：生成 JSON、静态 HTML、路由与 RSS，最终 JSON 在 `out/data/v1/articles.json`。
- 浏览器首次打开页面时，先渲染构建快照，随后 GET 最新 JSON；一次挂载请求由全站共享，不会每张卡片各发请求。
- 运行时转换的准确边界：浏览器运行时读取、校验 JSON 并渲染 Markdown；不在浏览器扫描文件夹或执行 gray-matter。静态托管无法运行服务器文件扫描。

## 2. 当前后端只需实现一个读取接口

| 项目 | 约定 |
| --- | --- |
| 方法 | GET |
| 当前静态地址 | `/data/v1/articles.json` |
| 后端示例地址 | `https://api.example.com/v1/articles`（示意，未部署） |
| 配置 | `NEXT_PUBLIC_ARTICLES_URL`，填写完整读取地址或同源绝对路径 |
| 请求参数 | 无；返回全部已发布文章，包含五种语言和完整正文 |
| 请求头 | `Accept: application/json` |
| 身份验证 | 公共只读，无 Cookie、无 Authorization；请求使用 `credentials: omit` |
| 成功 | HTTP 200，`Content-Type: application/json; charset=utf-8` |
| 空内容 | HTTP 200，`{"schemaVersion":1,"total":0,"data":[]}`；会清空文章列表，不使用旧数据冒充成功 |
| 分页 | v1 不在服务端分页，禁止只返回第一页；前端按当前语言每页12篇切分 |
| 缓存 | 前端 `cache: no-cache`；建议后端支持 ETag / Last-Modified 重新验证，勿对固定URL设置 immutable |
| 超时 | 10秒，超时中断请求 |
| 跨域 | 后端允许前端域名的 GET / Accept；开发时允许本地预览域名，无需允许凭证 |

当前是完整内容快照接口，适合现有150篇示例。未来文章量较大时需升级列表/详情分离方案，不能把分页接口直接填进此配置。

### 响应示例

```json
{
  "schemaVersion": 1,
  "total": 1,
  "data": [{
    "slug": "zh-cn-city-field-guide",
    "title": "从一条街到一座城：公共生活观察手册",
    "lang": "zh-CN",
    "translationKey": "city-field-guide",
    "issue": "2026-09-06",
    "category": "innovation",
    "categoryLabel": "Innovation",
    "author": "示例编辑部",
    "authorRole": "Politica",
    "date": "2026-09-08",
    "displayDate": "2026年9月8日",
    "readTime": 3,
    "dek": "从日常场景出发，建立城市观察档案。",
    "image": "/reference-assets/76fb1eb82e0bd569.webp",
    "imageAlt": "城市轨道交通站台示意配图",
    "tags": ["innovation", "2026-09-06"],
    "body": [],
    "markdown": "> 演示文章，不是实时新闻。\n\n## 观察起点\n\n正文内容。"
  }]
}
```

`total` 必须严格等于 `data.length`，代表所有语言总数，不是当前语言数量。`schemaVersion` 当前仅支持整数1。响应不得包含草稿、内部路径、密钥、审核备注或未发布内容。

## 3. Article 数据字段（v1 全部必填）

| 字段 | 类型 / 限制 | 前端用途 / Markdown 来源 |
| --- | --- | --- |
| slug | string，唯一；小写ASCII字母、数字、短横线，带语言前缀 | 详情地址；由 `lang.toLowerCase() + '-' + slug` 生成，不要重复添加前缀 |
| title | 非空string，已翻译 | 卡片、标题、搜索；`title` |
| lang | `zh-CN` / `zh-TW` / `en` / `ru` / `fr` | 语言过滤、HTML语言；`lang` |
| translationKey | 非空string；同语言下唯一 | 同篇文章各语言共享标识；`translationKey` |
| issue | 小写ASCII字母、数字、短横线 | 各期目录和筛选；`issue`，不是日期格式约束 |
| category | 下表六个枚举之一 | 分类筛选；`category` |
| categoryLabel | 非空string，固定英文键 | 前端词典翻译；由分类映射生成 |
| author | 非空string，按语言提供 | 作者和搜索；`author` |
| authorRole | 非空string | 作者说明；`authorRole`，Markdown未填时按语言默认全球伯乐 News / 全球伯樂 News / Global Bole News |
| date | 合法日历日期 `YYYY-MM-DD` | 倒序排序；`date`，不传时间戳 |
| displayDate | 非空string，按lang本地化 | 卡片日期；从date按UTC生成，避免客户端时区偏移 |
| readTime | integer，1–90 | 阅读分钟数；`readTime`，缺省由转换器估计 |
| dek | 非空string，已翻译 | 摘要；Markdown的 `description` |
| image | 同源 `/path` 或完整 `https://` 地址，不允许 `//` / `..`；无可用图片时为空字符串 | 封面；Markdown的 `cover`。跨域后端应返回完整CDN地址，`/`仍指向前端域名 |
| imageAlt | 有图时为非空string，已翻译；无图时与 image 同为空字符串 | 无障碍配图描述；`coverAlt` |
| tags | 非空string[]；字母、数字、空格、短横线 | 标签、搜索、相关阅读；`tags`。空格在标签路由中替换为短横线，请避免归一化后冲突 |
| body | 空数组 `[]` | 保留旧组件兼容字段；v1正文统一用markdown，不填分段对象 |
| markdown | 非空string | 不含YAML头部的完整Markdown正文；支持GFM表格、列表、引用、代码块，不传HTML |

额外字段会被客户端白名单移除，不参与渲染。`source`、`draft` 不属于公共契约。v1 不支持 `quote` 独立字段，请写入 Markdown 引用。

| category | categoryLabel |
| --- | --- |
| business | Business |
| technology | Technology |
| innovation | Innovation |
| work-life | Work & City Life |
| current-affairs | Current Affairs |
| energy | Energy & Industry |

栏目清单来自 `lib/categories.mjs`，转换器与公共契约共享该清单。`categoryLabel` 必须与对应的固定英文键相同，错误键会被拒绝。同一 `translationKey` 的译文必须使用相同栏目，构建时校验。原三个栏目与文章 URL 保留，新栏目避开旧重定向 slug；字段结构与 schemaVersion 不变。分类名称、栏目说明、导航和站点固定文案目前由前端五语言词典维护，不需要后端接口。期刊目录由 `issue` 去重生成，标签目录由 `tags` 生成，译文关联由 `translationKey` 生成。没有作者主页资料、期刊封面或期刊简介的需求；后续增加时再扩展契约。

## 4. 渲染规则与失败处理

- 列表按当前语言过滤，按 `date` 降序；首页同日期再按issue降序。正文保持Markdown顺序。
- 搜索在前端执行，匹配标题、分类名、作者和标签，不搜索正文，最多显示5项。
- 各期、分类和标签筛选都使用同一份运行时数据，不各自请求。分类结果只包含当前语言、同一栏目稿件；没有稿件时显示本地化空态。首页栏目不使用其他栏目稿件回填。
- 缺少某种译文时保留原文并显示“译文不可用”提示，不自动机器翻译。
- API错误、非JSON、版本不符、任一字段不合法或超时：整批拒绝，保留当前快照，显示五语言提示及重试按钮；不将半份数据混入列表。
- 首次失败保留构建快照；若之前已成功，则保留最近成功的数据。刷新页面将重新请求，不写入localStorage。
- ReactMarkdown使用 `skipHtml`，不执行Markdown中的HTML或脚本。后端仍需控制外链、图片来源及内容发布权限。
- Provider暴露 `status: loading | ready | fallback`，`retry()`，`allArticles`；`useArticles()`返回当前语言列表，页面不直接使用fetch。

建议错误体：`{"error":{"code":"SERVICE_UNAVAILABLE","message":"Temporarily unavailable"}}`，使用适当HTTP 4xx/5xx。当前前端不直接显示后端message（防止泄露内部信息），统一显示友好提示；不能用HTTP200包装错误体。

## 5. 后端接入步骤和静态路由边界

1. 后端按本契约返回所有已发布文章，保证日期、语言、唯一性及可访问图片。
2. 设置 `NEXT_PUBLIC_ARTICLES_URL=https://your-api.example/v1/articles` 并重新构建。该环境变量会公开到浏览器，禁止放密钥。
3. 配置CORS、HTTPS及缓存策略；用JSON样例与客户端校验器联调。
4. 已存在的文章内容可以从接口更新，浏览器刷新后生效；SEO元数据、静态HTML、RSS、sitemap仍是构建快照，需要重新构建才能更新。
5. **新增文章slug、issue、tag或分页页数不是仅修改JSON就能完整上线**：目前路由由构建时Markdown生成。后端接入阶段还需在构建前同步后端内容到构建数据，重新生成路由；本轮未实现该同步任务。
6. 删除文章也要重新部署，才能删除旧静态HTML；切勿用客户端列表删除代替敏感内容下线。

如需“后端一发文章，新URL立刻可访问且SEO立即更新”，需要另行改为服务器动态路由/SSR，或改用可承接任意slug的SPA方案。它超出现阶段纯静态实现范围。

## 6. 大规模后端的下一阶段接口（建议，尚未实现）

- `GET /v2/articles?lang=zh-CN&category=innovation&issue=2026-09-06&tag=innovation&q=街道&page=1&pageSize=12`：返回不含正文的列表和total/page/pageSize；排序默认date降序、slug升序作为稳定次序。
- `GET /v2/articles/{slug}`：返回正文详情及translations；不存在时HTTP404。
- `GET /v2/issues?lang=zh-CN`：返回期刊ID、标题、发布日期、文章数。
- `GET /v2/categories?lang=zh-CN`：需要后台可配置分类时再提供。

这些接口需同时改造前端数据层、分页、搜索和路由生成，不是v1已接入的端点。发文、编辑、上传、登录、审核均属于未来管理端后端需求，本只读前端当前不调用POST/PUT/DELETE。

## 7. 代码与验收入口

- `scripts/content.mjs`：Markdown解析、生成内部快照及公共JSON。
- `lib/article-contract.mjs` / `.d.mts`：公共字段白名单、运行时校验、TypeScript契约。
- `lib/article-client.ts`：唯一HTTP读取入口。
- `lib/articles.tsx`：共享状态、超时、取消、失败回退与重试。
- `tests/article-api.test.mjs`：序列化、五语言、内部字段排除、非法响应校验。
- 本地预览数据：`http://localhost:4174/data/v1/articles.json`。

### 本轮验收

构建、类型检查、5项自动测试、静态导出链接检查均通过。浏览器刷新后数据状态从loading变为ready；临时移走生成的JSON模拟404时，首页35个文章展示链接仍保留并出现重试提示；恢复JSON后点击重试，状态恢复ready且提示消失。测试文件已恢复，预览继续正常服务。本轮未连接真实后端或部署公开API。
