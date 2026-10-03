# Global Bole production deployment

- GitHub: https://github.com/Elexvx/globalbole (private, main)
- Vercel project: https://vercel.com/elexvxs-projects/globalbole
- Canonical website: https://www.globalbole.com
- https://globalbole.com redirects permanently (308) to www.
- Production environment: NEXT_PUBLIC_SITE_URL=https://www.globalbole.com

## DNS (Spaceship)

| Type | Host | Value | TTL |
| --- | --- | --- | --- |
| A | @ | 216.198.79.1 | 30 minutes |
| CNAME | www | 18e2aab2618efa37.vercel-dns-017.com | 30 minutes |

Nameservers remain launch1.spaceship.net and launch2.spaceship.net. The five existing Feishu mail records are preserved.

## Updating production

The Vercel Hobby team cannot directly import a private GitHub organization repository. Code is retained in Elexvx. Deployments use an already-authorized Vercel CLI session or the existing-project folder-drop workflow below. A GitHub push alone does not deploy this project.

```sh
npm test
NEXT_PUBLIC_SITE_URL=https://www.globalbole.com npm run build
npm run check:export
git push origin main
npx vercel@59.11.7 deploy --prod --yes --archive=tgz --scope elexvxs-projects
```

Run these commands from the project root after committing the intended changes. `.vercelignore` excludes local builds, credentials, and dependencies; `--archive=tgz` avoids per-file upload limits. Production builds run `npm ci` and `npm run build`, publishing `out` according to `vercel.json`.

## Existing-project browser deployment

Vercel Drop was verified for this existing project on 2026-10-03. Its [official documentation](https://vercel.com/docs/drop) supports dropping a folder onto a project with no Git connection to create a production deployment. Use the existing `globalbole` project overview, not the new-project `/drop` or `/new` screens.

Prepare a clean source folder whose files match the intended Git commit by blob hash. Exclude dependencies, build output, local credentials and unrelated files. In the already-authorized Vercel session, drag that folder onto the existing project, confirm `New Production Deployment` targets `globalbole`, retain the existing Other framework/build settings, and submit once. `.vercelignore` excludes `.env*`, including the sample environment file.

Wait for READY and production aliases. Drop deployments do not automatically carry Git commit metadata, so retain the source-folder/commit hash check and verify public article JSON, each page, assets, feeds and sitemap against the intended build. If the browser session expires, report the login blocker rather than creating credentials or claiming success. See [the daily publishing checklist](daily-news-publishing.md).
