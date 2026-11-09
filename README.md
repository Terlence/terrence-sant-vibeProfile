# terrencesant — personal site

Next.js 16 (App Router) · Tailwind CSS v4 · Motion. Dark, data-driven, "enterprise meets edgy".

## Run locally

```bash
npm install
npm run dev          # http://localhost:3000 (hot reload)
# or a production build:
npm run build && npm run start
```

## Editing content

All copy lives in **`src/content/profile.ts`** — roles, highlights, stats, skills, certifications,
interests and portfolio. Components read from it, so most updates never touch JSX.

### Adding a portfolio piece

Find the entry in the `portfolio` array, set `status: "live"` and add an `href`:

```ts
{ index: "01", title: "Real-time, end to end", kind: "Case study",
  description: "…", status: "live", href: "https://…" }
```

The card turns into a link automatically (external links open in a new tab).

## Structure

```
src/app/            layout, page, icon, Open Graph image
src/components/     Hero (live stream canvas), About, Journey, Capabilities, Portfolio, Contact, Nav
src/content/        profile.ts — single source of truth for copy
```

When deploying, set `SITE_URL` (e.g. `https://terrencesant.com`) so social previews resolve correctly.
