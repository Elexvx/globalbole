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
| category | 是 | technology / innovation / business / work-life / current-affairs / energy |
| author | 是 | 作者名称 |
| authorRole | 否 | 默认 Politica |
| date | 是 | 带引号的 YYYY-MM-DD，不使用 YAML 自动日期类型 |
| description | 是 | 当前语言的摘要 |
| cover | 是 | public/ 中获准转载的原文图片；无可用原图时设为空字符串 `""` |
| coverAlt | 是 | 当前语言的准确图片说明；cover 为空时同时设为 `""` |
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
发布：提交文件与图片，再按 [生产部署说明](production-deployment.md) 部署。当前项目已连接 main 分支的原生自动部署；推送后仍须验证同一 Git SHA 的部署 READY 与正式域名内容。日更选题、来源核验与去重见 [日更发布流程](daily-news-publishing.md)。

正文支持标题、段落、引用、列表、链接、代码块和 GFM 表格。原始 HTML 被忽略，不执行脚本或 JSX。推荐图片和链接使用站点绝对路径，避免依赖 Markdown 所在目录。

错误语言、缺失字段、封面文件不存在、重复 slug/translationKey 等会使构建失败并指出文件位置。草稿不会生成公开文章、RSS 条目或语言切换目标。

## 新闻稿的封面与来源

- 尽量选用本篇引用的原始报道、公告或研究材料中多张信息互补的原图。须先确认明确的转载许可或公有领域依据；网上可见或注明来源不等于获准转载。不使用无关图库照片凑数，新闻照片与所有数据图均不得自行绘制、重新制图或生成。
- 封面直接复用该篇正文已有的获准原图，填写准确的 `coverAlt`。照片署名、许可和档案日期须可见，原始统计图须完整显示坐标与注释。没有合法可用原图时，将 `cover`、`coverAlt` 同时设为空字符串 `""`，页面、列表与分享元数据使用无图模式；重要数据保留为文字，不生成替代图。
- 以自然、专业的编辑语气完整说明事实、背景与有依据的分析。不写“本站整理日期”“判断口径”等流程化尾注。
- 使用 GFM 脚注作为文末来源附注。正文只用上标关联；每条附注列出时间、原文标题及链接。不要另写空“来源与说明”标题，网站会显示脚注区标题。

```markdown
这里是有来源支持的报道内容。[^1]

[^1]: 2026-10-02 · [原文完整标题](https://example.com/original-report) · 发布机构
```

## 图注格式

图注只写已知的时间、地点、人物、摄影者、授权方与许可原则；缺少的字段直接省略。保留许可要求的作品题名、版权署名、来源和许可链接。不加入图片处理流程或版式说明。直接转载的原始数据图注明数据期、数据来源与原制图机构，附原始作品及许可链接；不编造摄影或授权信息。

所有封面使用等比铺满（object-fit: cover），根据主体检查焦点，避免切掉人脸或关键内容；正文图片保持自然比例完整展示，数据图的坐标、数值及注释须清晰可读。封面复用原图文件，图注不写版式处理说明。若实际修改图片文件或制作改编作品，应先检查具体许可义务。
