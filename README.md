# 全球伯乐 News · 多语言 Markdown 阅读站

纯前端新闻/文档站，使用 **Next.js + Tailwind CSS + Radix UI**。没有编辑页面、登录、数据库或运行时 API，所有文章来自项目文件夹内的 Markdown。可直接部署到 Vercel 静态托管。

## 启动与验证

使用 Node.js 22、npm：

```bash
npm ci
npm run dev -- --port 4173
```

开发模式自动监听 content/issues/，增加或修改 Markdown 后自动更新。正式静态产物：

```bash
npm test
npm run build
npm run lint
npm run check:export
npm run preview
```

静态预览：http://localhost:4174/zh-CN/ 。npm start 使用 4173 端口；不要使用 next start 启动静态导出。

## 添加一期文章

```text
content/issues/
  2026-09-01/
    zh-CN/public-budget.md
    zh-TW/public-budget.md
    en/public-budget.md
    ru/public-budget.md
    fr/public-budget.md
  2026-09-02/
    zh-CN/digital-services.md
    ...
```

1. 复制 docs/templates/article.md 到新的期号/语言目录。
2. 填写文件开头的 YAML 参数，在下方写 Markdown 正文。
3. 同一篇的不同译文使用相同 translationKey；lang 分别填写 zh-CN、zh-TW、en、ru、fr。
4. 提交 Markdown 和所用图片到 Git，Vercel 自动重新构建。

无需手动维护文章列表、路由、分类、期刊目录、标签或 RSS。构建时读取文件，自动生成所有内容；draft: true 的文章不发布。部署后不会自行扫描你电脑上的新增文件，必须通过 Git 更新触发一次构建。

详细字段说明见 [发文指南](docs/editorial-guide.md)。当前包含 **六期、30 个主题、五种语言、150 篇 Markdown 示例（每种语言 30 篇，科技 8 篇、创新 15 篇、商业 7 篇）**，均标注为测试示例，不是真实新闻。

## 五种语言

| 语言 | 入口 |
| --- | --- |
| 简体中文 | /zh-CN/ |
| 繁體中文 | /zh-TW/ |
| English | /en/ |
| Русский | /ru/ |
| Français | /fr/ |

顶部语言选择器同步切换导航、栏目、日期、文章和阅读控件。在文章页切换时优先进入同篇译文；缺少译文时明确提示并保留原文。语言由网址决定，刷新、复制链接后不会丢失。正文翻译由独立 Markdown 文件提供，不依赖浏览器机器翻译。

## Vercel 部署

将仓库导入 Vercel，根目录选择 package.json 所在目录。vercel.json 已配置：

- Framework：Other（framework: null，明确作为静态网站托管）
- Install Command：npm ci
- Build Command：npm run build
- Output Directory：out

不需要后端密钥、数据库或 Functions。建议设置 NEXT_PUBLIC_SITE_URL 为最终域名；未设置时自动使用 Vercel 项目域名。本地构建回退为 http://localhost:4173。

参考：[Vercel 官方构建配置](https://vercel.com/docs/builds/configure-a-build)。本次已验证本地静态产物，尚未在你的 Vercel 账户执行实际部署。

## 目录结构

```text
content/issues/       唯一的文章编辑入口：期号 / 语言 / Markdown
content/generated/    自动生成的文章索引，不手工编辑、不提交
app/[locale]/         五语言静态阅读路由
app/post/             文章视图及兼容入口
app/issues/           各期目录
components/           导航、语言选择、Markdown 阅读、分类卡片
lib/                  类型、分类、多语言词典与链接规则
scripts/              内容读取、开发监听、静态产物校验
tests/                内容发现、草稿、重复标识、语言覆盖测试
docs/                 发文、架构、语言及测试文档
docs/archive/         已停用的旧原型文本，不部署、不参与编译
public/               配图和字体
out/                  纯静态构建产物
```

## JSON 数据与后端对接

启动开发服务或构建时，Markdown 自动转换为 `public/data/v1/articles.json`。浏览器运行时通过共享数据层 GET 该文件；可配置 `NEXT_PUBLIC_ARTICLES_URL` 替换为后端地址。接口失败时保留快照并支持重试。

完整字段、响应样例、五语言规则、错误处理及静态路由限制见 [前端接口文档](docs/frontend-api.md)。新增文章路由、SEO与RSS仍需重新构建，不是修改JSON就能全部实时更新。

## 使用边界

不提供编辑后台，不读取旧浏览器草稿，不收集邮箱；订阅使用五语言 RSS。前期原型已归档，旧浏览器 localStorage 未清除。正式公开前请确认参考素材的使用许可，并替换示例内容和联系说明。多语言与 Markdown 改造的验证不等同于全站像素级 1:1 验收。
