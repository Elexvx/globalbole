# 三栏目设计与文章迁移

导航固定顺序：科技 → 创新 → 商业。每篇文章只有一个主栏目，标签可补充细分主题；五语言译文保持同一栏目。

| 栏目 | category | 边界 | 每语言篇数 |
| --- | --- | --- | --- |
| 科技 | technology | 数字工具、数据方法、技术应用与基础设施 | 8 |
| 创新 | innovation | 服务设计、协作机制、社区与教育实践改进 | 15 |
| 商业 | business | 企业经营、资源分配、成本与供应链 | 7 |

科技不等于所有新事物，创新也不必是技术发明；跨领域文章以主要讨论的问题选择栏目，不为了数量均分。

## 已迁移的主题

- 科技：digital-services、accessible-forms、offline-reading、data-labels、digital-archives、shared-rivers、rain-gardens、oral-history。重点为数字服务、数据采集、记录保存与环境技术应用。
- 商业：small-business、repair-economy、local-markets、delivery-windows、port-connections、public-budget、shared-workshops。包括经营、物流、预算透明及共享资源运营。
- 创新：cooler-streets、regional-dialogue、public-library、museum-evenings、open-agendas、walking-routes、policy-language、public-benches、meeting-records、neighborhood-stage、translation-desks、city-field-guide、feedback-loops、reading-clubs、student-exchanges。重点为服务、流程、空间与协作设计。

150 个 Markdown 文件均已更新 category、主标签，并追加五语言的栏目视角段落。原标题、主体内容、日期、slug 与 translationKey 保留；这些仍是排版和功能测试示例，不声称为新报道。后续真实稿件应围绕具体技术、创新实践或商业问题撰写，而不是仅追加栏目说明。

## 数据与路由

JSON v1 的 category 只接受 technology / innovation / business；旧后端数据需要先迁移再提供给前端，字段结构和 schemaVersion 不变。导航、首页板块、搜索筛选、期刊、标签、SEO 与 Sitemap 随构建生成。

文章地址不变。旧的 world / politics / culture / cities 栏目与标签在 Vercel 上永久跳转至对应语言的全部文章页，因为一个旧栏目可能拆入多个新栏目；不误导性地全部跳入单一栏目。本地静态服务器不执行 Vercel 重定向。

验收：`npm test`、`npm run build`、`npm run check:export`、`node scripts/check-seo.mjs`。
