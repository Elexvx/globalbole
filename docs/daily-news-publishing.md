# 日更新闻发布流程

## 固定目标

- GitHub：`Elexvx/globalbole`，发布分支 `main`
- 简体中文稿件：`content/issues/YYYY-MM-DD/zh-CN/`
- 正式站点：<https://www.globalbole.com/zh-CN/>
- 现有部署方式及项目见 [生产部署说明](production-deployment.md)

## 编辑要求

1. 从当天简报选择与科技、创新、商业相关的独立新闻，不为凑篇数发布未核实内容。
2. 打开原始链接核对事件日期、发布日、数字、限定条件与更新。动态数据页面应同时保留发布日及本次使用的数据期，后续可换为官方归档链接。
3. 原创简短改写；清晰区分事实、报道转述与编辑分析。不移入私人简报中的个人情况、个人建议或内部引用标记。
4. 正文列出可点击来源、来源发布日期和必要的转述说明。文章 `date` 是本站刊发日，不能把旧事件写成当天发生。
5. 使用本站原创示意图或有明确授权的配图，注明示意性质。不要把来源署名视为转载许可。
6. 署名为“全球伯乐 News”，身份“资料整理”，不暗示现场采访。先发简体中文；其他语言仅在提供完整译文后新增。

## 去重和重试

`docs/news-publication-log.json` 记录批次、稳定 `translationKey`、原始来源及日期，只记录公开新闻事实，不保存账户凭据或私人简报内容。

- 开始前同时检查 `main` 最新稿件、日志和正式站点的 `/data/v1/articles.json`。
- 以来源 URL + 事件/数据期 + 主题识别同一新闻。不要仅依靠可变的页面 URL（例如最新月报主页）或当日日期去重。
- 同一稿件复跑时复用路径、slug 和 translationKey。内容与来源未变则跳过提交。
- 已提交但未部署：验证原提交后继续部署该版本，不再生成重复文章。
- 只有存在实质更新时修改旧稿或新写后续稿，正文说明更新日期及变化。
- 批次日期不代表部署已成功。GitHub 提交、部署 READY、正式域名可读分别验证。

## 验证和提交

```sh
npm ci
npm test
NEXT_PUBLIC_SITE_URL=https://www.globalbole.com npm run build
npm run lint
npm run check:export
```

检查首页、每篇正文、来源链接、本地封面、分类页、RSS 和 sitemap；至少查看一篇渲染后的页面。不得跳过失败检查后直接发布。

拉取或读取 `main` 最新 SHA 后创建只包含本批内容与必要校验维护的提交，保留所有原有文件。不强制推送。若在验证期间 `main` 已前进，先合入最新内容并重新验证。

没有 CLI GitHub 凭据时，可用已授权的 GitHub 连接读取仓库，并用 Git Trees/Commits/Refs 接口原子提交：新 tree 以当前 main 的 tree 为基础，commit 以当前 main 为父提交，ref 更新禁止 force。

## 部署成功的定义

本项目现有 Vercel 生产部署来源为 CLI，不能把 GitHub push 当作网站上线。使用已有的 Vercel 项目和已授权部署方式，不新建项目、令牌、权限或付费方案。

部署后确认 Vercel 状态为 READY 且对应本次提交，再从 `https://www.globalbole.com` 读取文章数据和每篇页面。部署不可用时保留已验证的提交，明确报告“稿件已提交，网站部署待完成”，不得报告已上线。
