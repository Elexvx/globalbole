# Markdown 文章指南

## 文件组织

每期单独一个文件夹，每种语言一个子目录：content/issues/2026-09-03/zh-CN/example.md。构建递归读取所有 .md；文件夹用于整理，页面参数以 YAML 内容为准。

## 文件模板

```markdown
---
title: "文章标题"
slug: "article-slug"
translationKey: "article-slug"
issue: "2026-09-03"
lang: "zh-CN"
category: "technology"
author: "作者名称"
authorRole: "编辑"
date: "2026-09-15"
description: "简短摘要，用于列表与搜索结果。"
cover: "/reference-assets/bec2d3d73ab80bea.webp"
coverAlt: "封面图片的文字说明"
tags: ["technology", "公共服务"]
readTime: 3
draft: false
---

## 第一节

这里直接写正文，支持 **加粗**、链接、列表、引用和表格。
```

## 字段规范

| 字段 | 必填 | 规则 |
| --- | --- | --- |
| title | 是 | 当前语言的标题 |
| slug | 是 | 小写英文字母、数字、连字符；同语言唯一 |
| translationKey | 是 | 同一篇所有译文共享的稳定标识 |
| issue | 是 | 期号标识，小写字母、数字、连字符；建议年月-序号 |
| lang | 是 | zh-CN / zh-TW / en / ru / fr |
| category | 是 | technology / innovation / business |
| author | 是 | 作者名称 |
| authorRole | 否 | 默认 Politica |
| date | 是 | 带引号的 YYYY-MM-DD，不使用 YAML 自动日期类型 |
| description | 是 | 当前语言的摘要 |
| cover | 是 | public/ 中的图片，引用时省略 public 前缀 |
| coverAlt | 是 | 当前语言的图片说明 |
| tags | 是 | 非空数组，文字/数字/空格/连字符 |
| readTime | 否 | 1–90 分钟，省略则按正文长度估算 |
| draft | 否 | true 不进入网站；默认 false |

期号不等于发布日期。例如 2026-09-02 表示九月第二期，文章可以在九月八日发布。

## 多语言关联

复制同篇文件到其他语言目录，保留 slug、translationKey、issue、category。修改 lang，并翻译标题、摘要、作者说明、图片说明和 Markdown 正文。URL 自动添加语言和唯一前缀，例如 /fr/post/fr-digital-services/。

不要求一次提供五种译文。缺少译文时，该语言首页不展示未翻译文章；从文章页切换到缺失语言时保留原文并明确提示。不要只修改 lang 而保留未翻译正文。

## 发布与校验

开发：npm run dev 自动监听 Markdown。
验证：npm test、npm run build、npm run check:export。
发布：提交文件与图片，Vercel 自动重建 out/。

正文支持标题、段落、引用、列表、链接、代码块和 GFM 表格。原始 HTML 被忽略，不执行脚本或 JSX。推荐图片和链接使用站点绝对路径，避免依赖 Markdown 所在目录。

错误语言、缺失字段、封面文件不存在、重复 slug/translationKey 等会使构建失败并指出文件位置。草稿不会生成公开文章、RSS 条目或语言切换目标。
