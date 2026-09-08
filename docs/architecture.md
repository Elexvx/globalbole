# 静态架构

## 内容管道

scripts/content.mjs 使用 gray-matter 读取 content/issues/**/*.md，校验 YAML 元信息，过滤草稿并生成 content/generated/articles.json。lib/data.ts 只声明模型和分类，并导入这个生成索引；不再包含硬编码正文。

scripts/dev.mjs 在启动 Next 之前生成索引，并监听 Markdown 文件变更；生产构建先生成索引，再执行 Next 静态导出。

## 阅读与语言

React Markdown + remark-gfm 在构建和浏览器阅读视图中渲染正文，不启用原始 HTML。所有内容是只读文本，无数据库、表单、用户账号或运行时 API。

app/[locale]/[[...path]] 预生成五语言首页、分类、文章、标签、期刊目录和辅助页面。I18nProvider 从 URL 取语言；lib/messages.json 存储界面词典。LanguageSelect 根据 translationKey 查找对应译文，没有则展示原文提示。

LocalizedLink 为站内链接添加语言前缀。每种语言只在首页、列表和搜索中展示自己的文章。主题偏好可存浏览器，其余内容不依赖 localStorage。

## 静态导出

next.config.ts 的 output: export 和 generateStaticParams 保证 out/ 为 HTML/CSS/JS/图片。RSS、robots、sitemap Handler 只在构建时执行。finalize-export.mjs 处理生成后的 HTML lang 标签，并生成五语言 RSS 普通文件；这是构建步骤，不是后端服务。

公开文章包含 canonical 和同篇译文 hreflang。Vercel 按 Other 框架托管 out，不创建 Functions。静态服务本地预览使用 serve，不能用 next start。

## 验证

npm test：例文覆盖、发现新文件、草稿过滤、重复标识及错误语言拒绝。
npm run check:export：所有静态 HTML 的本地链接与素材存在性、五语言 HTML lang、译文关联、Markdown 表格、旧编辑页不存在。

历史实现放在 docs/archive/ 下的 .txt 中，既不是路由也不会进入公开目录。
