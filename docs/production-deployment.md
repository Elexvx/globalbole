# Global Bole production deployment

- GitHub: https://github.com/Elexvx/globalbole (public, main)
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

The existing Vercel project is now connected to the public `Elexvx/globalbole` GitHub repository. The production branch is `main`; pushes to other branches create previews. Native Git builds use the existing project and domain configuration, with no new project or paid migration.

```sh
npm ci
npm test
NEXT_PUBLIC_SITE_URL=https://www.globalbole.com npm run build
npm run lint
npm run check:export
node scripts/check-seo.mjs
git push origin main
```

`vercel.json` selects the Other framework, runs `npm ci` and `npm run build`, and publishes `out`. `lib/site-url.ts` keeps canonical URLs on the public custom domain unless the explicit site URL variable is supplied. Never use an ephemeral preview URL as the canonical origin.

A push is not proof of publication. Verify these separately:

1. The expected commit SHA is on GitHub `main`
2. Vercel has a new Git-triggered deployment for that exact SHA
3. The deployment reaches `READY` and production aliases include `www.globalbole.com`
4. `/build-info.json` reports that exact Git SHA, and public article JSON, changed HTML metadata, images, feeds, sitemap and redirects match the intended build

The build marker contains only the public commit SHA, or null for builds without Git metadata. A null marker is not proof of the expected commit.

If a build fails, inspect its logs and fix the specific problem before retrying. Do not create a second project or switch to folder Drop silently. Older releases were deployed through the existing-project Drop workflow before Git was connected; those releases do not carry reliable Git commit metadata.

See [the daily publishing checklist](daily-news-publishing.md) and the PageSpeed audit procedure in the package scripts. Raw audit reports are written under ignored `qa-evidence/`; only verified results belong in the public optimization report.
