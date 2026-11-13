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
src/lib/            twin-prompt.ts — builds the Digital Twin's instructions from profile.ts
src/app/api/chat/   route.ts — backend endpoint the chat panel talks to
```

## Digital Twin chat

The "Ask my digital twin" button opens an AI chat that answers questions about my career.

- **How it works:** the panel (`src/components/TwinChat.tsx`) sends the conversation to
  `/api/chat`. That endpoint adds the instructions and career facts, calls
  [OpenRouter](https://openrouter.ai), and streams the reply back.
- **What it knows:** only what is in `src/content/profile.ts`, plus anything added to
  `extraNotes` in `src/lib/twin-prompt.ts`. Update the site copy and the twin updates too.
- **API key:** put `OPENROUTER_API_KEY=...` in a `.env` file in the project root (git-ignored).
  When deploying, set the same variable in the host's settings. The key stays on the server.
- **Models:** the `MODELS` list in `src/lib/twin-prompt.ts`, tried in order by the endpoint. They
  are free models on different providers; if one is busy, errors or returns nothing, the next is
  tried. The server log shows which one answered (`[twin] answered by ...`).
