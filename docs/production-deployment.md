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

The Vercel Hobby team cannot directly import a private GitHub organization repository. Code is retained in Elexvx; deployments use Vercel CLI. A GitHub push alone does not deploy this project.

```sh
npm test
NEXT_PUBLIC_SITE_URL=https://www.globalbole.com npm run build
npm run check:export
git push origin main
npx vercel@59.11.7 deploy --prod --yes --archive=tgz --scope elexvxs-projects
```

Run these commands from the project root after committing the intended changes. `.vercelignore` excludes local builds, credentials, and dependencies; `--archive=tgz` avoids per-file upload limits. Production builds run `npm ci` and `npm run build`, publishing `out` according to `vercel.json`.
