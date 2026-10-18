# Tech Notes

Backend engineering notes by Trung Nguyen.

Dark documentation site. Opening it shows SQL ISOLATION: the domain sidebar, the note, and the "On this page" list. Interview prep, quick review, and tags stay in the top nav. Built with Next.js, Fumadocs, MDX, Tailwind CSS, and Shiki. Search is the Fumadocs `⌘K` dialog. Fumadocs 16.17 builds that index with its bundled engine (ZBSearch). Orama is still the optional cloud add-on and is not required for this site.

## Scripts

```bash
npm install
npm run dev
npm run build
```

`npm run build` generates the static pages and the search index. Running the site requires `SITE_PASSWORD` and `SESSION_SECRET`. Copy `.env.example` to `.env.local` and fill those in locally. Do not commit a real password.

## Content

Notes live in `content/notes`, one folder per domain. Interview pages live in `content/interview`.

A few notes are written out (transaction isolation, the event loop, JWT, Kafka, and others). Every other title in the category tree is a short placeholder so the sidebar is complete. Placeholders are marked Draft. They are original outlines, not a Notion export.

Regenerate the tree with:

```bash
node scripts/seed-content.mjs
```

That overwrites `content/`. Edit the MDX afterwards if you want to keep a change.

## Deploy on Vercel

This repository is not connected to Vercel yet. There is no token in the project, and nothing here deploys itself.

1. Open [vercel.com/new](https://vercel.com/new) and sign in with the GitHub account that owns this repo.
2. Import `MinhTrung2031997/Tech_graph`.
3. Framework preset: **Next.js**. Build command: `npm run build`. Output: leave the default (do not set a static export directory).
4. Environment variables: set `SITE_PASSWORD` (the shared login password) and `SESSION_SECRET` (a long random string that signs the session cookie). After the project has a URL, you can also set `NEXT_PUBLIC_SITE_URL` to that URL (for example `https://tech-graph-xxxxx.vercel.app`) and redeploy so the sitemap and Open Graph links use it.
5. Deploy. The Hobby plan is enough. Pull requests get preview deployments once the GitHub app is installed.

Production branch should be `main` after this pull request is merged.

## Search

Fumadocs 16 serves search from `app/api/search/route.ts`. The index is built at compile time from the MDX pages (notes and interview). The dialog opens with `⌘K` or `Ctrl+K`.
