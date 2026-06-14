# Deploying Mitoderm

There are three viable paths. Pick the one that matches your hosting.

## A) Vercel (or any serverless / static host) — recommended for marketing-only sites

Push the branch, link the repo on Vercel, set the env vars from
`.env.example`. The marketing pages work out of the box; the admin needs
a writable backing store, so set the **GITHUB_*** vars so saves commit to
the repo (Vercel’s filesystem is read-only).

```
ADMIN_PASSWORD=…long-random…
GITHUB_TOKEN=ghp_…   # fine-grained PAT with Contents: Read+Write
GITHUB_OWNER=gregorydich
GITHUB_REPO=mitoderm
GITHUB_BRANCH=main
```

Every save from `/admin` becomes a commit to `src/data/products.json`,
which triggers a Vercel redeploy. Edits are versioned in git for free.

## B) Docker (any VPS / Coolify / Render / Railway / self-hosted)

For a single container with persistent admin data — no GitHub round-trip
needed. Two named volumes hold the product JSON and the lead submissions.

```bash
# .env (next to docker-compose.yml)
ADMIN_PASSWORD=…long-random…
# Optional:
RESEND_API_KEY=re_…
[email protected]
[email protected]
```

```bash
docker compose up -d --build       # build + start
docker compose logs -f             # follow logs
docker compose down                # stop, keep data
docker compose down -v             # stop and wipe seeded data back to image defaults
```

The image is `node:22-alpine` + a standalone Next.js build (`output:
'standalone'` in `next.config.mjs`); final image is small and runs as a
non-root user.

## C) Hybrid

Run on Docker for the operator UX (writable disk, no GitHub PAT
required), but **also** set the `GITHUB_*` env — every admin save then
both updates the volume immediately AND commits to the repo, so the
data is mirrored to source control without an extra step.
