# Tutorial: how this site works, from the first file to the Digital Twin

This is a guided tour of the personal website in this folder, written for someone new to
frontend code. It covers the site itself (built in earlier sessions) and the "Digital Twin" AI
chat (built on 11 and 12 November 2026).

Read it with the code open. Every section names the file it is talking about, and every code
sample is taken from that file. Some samples are shortened (a long `className` dropped, or
`// ...` where lines are skipped) so the point is easier to see.

**Contents**

1. [Where things stand](#1-where-things-stand)
2. [The technology, in plain words](#2-the-technology-in-plain-words)
3. [Running it and finding your way around](#3-running-it-and-finding-your-way-around)
4. [High-level walkthrough](#4-high-level-walkthrough)
5. [Code review: the site](#5-code-review-the-site)
6. [Code review: the Digital Twin](#6-code-review-the-digital-twin)
7. [What testing taught us](#7-what-testing-taught-us)
8. [Testing words, tied to this project](#8-testing-words-tied-to-this-project)
9. [Five improvements from a self-review](#9-five-improvements-from-a-self-review)
10. [Try it yourself](#10-try-it-yourself)

---

## 1. Where things stand

| Part | State |
|---|---|
| The website (hero, about, journey, capabilities, portfolio, contact) | Committed to Git on `main` and pushed to GitHub |
| The Digital Twin chat | Built on the branch `feature/digital-twin-chat`, then merged into `main` and pushed to GitHub on 13 November 2026 |
| Chat backend: input checks, model fallback, streaming | Tested from the command line and working |
| Chat panel in a real browser | Tried by hand by Terrence on 13 November 2026 and accepted. No automated browser test exists |
| Preferred AI model (Gemma 4 31B, free) | **Never answered during the command-line testing** on 11 and 12 November. Google's free pool was busy on every attempt |
| Final model order (Gemma, then Flint, then NVIDIA) | Each model tested alone from the command line; the order as a whole was only exercised by the hand check above |

The free OpenRouter allowance (50 requests a day) ran out during testing. It resets at
11:00 am Sydney time each day.

---

## 2. The technology, in plain words

A website is three languages working together, plus tools that make them easier to write.

| Technology | What it is | Where you see it here |
|---|---|---|
| **HTML** | The structure of a page: headings, paragraphs, links, buttons | Tags like `<section>`, `<h2>`, `<button>` inside every component |
| **CSS** | The look of a page: colour, size, spacing, layout | `src/app/globals.css` and the `className="..."` text on every tag |
| **JavaScript** | The behaviour: what happens on a click, a scroll, a timer | Everything inside `{ }` and every function |
| **TypeScript** | JavaScript plus *types*: labels saying "this is text", "this is a number". Mistakes get caught before the code runs | Files ending `.ts` and `.tsx` |
| **React** | A way to build a page out of reusable pieces called *components* | Every file in `src/components/` |
| **JSX** | HTML-looking code written inside JavaScript. `.tsx` means TypeScript + JSX | `return (<section>...</section>)` |
| **Next.js** | A framework on top of React. It turns files into pages, runs code on a server, and builds the site for production | `src/app/`, `next.config.ts` |
| **Tailwind CSS** | Styling by adding short class names (`flex`, `mt-8`) instead of writing separate CSS rules | Every `className` |
| **Motion** | A library for animation | `motion.div`, `useScroll` |
| **npm** | The package manager. It downloads other people's code (*packages*) and runs your scripts | `package.json`, `node_modules/` |
| **Git** | Version history for the project. A *commit* is a saved snapshot | `.git/`, `.gitignore` |
| **OpenRouter** | A service that gives one address and one key for many AI models | Called from `src/app/api/chat/route.ts` |

Two ideas matter more than any single tool:

- **Frontend and backend.** The *frontend* is code that runs in the visitor's browser. The
  *backend* is code that runs on your server, which the visitor cannot see. Secrets may only live
  in the backend.
- **A framework does chores for you.** Without Next.js you would write your own web server,
  your own routing (which address shows which page) and your own build process.

---

## 3. Running it and finding your way around

### Commands

Run these in a terminal, from the project folder.

```bash
npm install      # download the packages listed in package.json into node_modules/
npm run dev      # start the development server (it prints the address, usually localhost:3000)
npm run lint     # check the code for common mistakes
npm run build    # make the optimised production version in .next/
npm run start    # serve that production version
```

`npm run dev` works because of the `scripts` block in `package.json`. `package.json` is a
**JSON** file: data written as `"name": value` pairs inside `{ }`.

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint"
},
"dependencies": {
  "motion": "^14.10.1",
  "next": "16.4.5",
  "react": "19.3.0",
  "react-dom": "19.3.0"
}
```

`dependencies` are the packages the site needs. `npm install` reads this list and fills
`node_modules/`. That folder is huge and can always be rebuilt, which is why Git ignores it.

### The folder tree

```
site/
  package.json            what the project needs and the commands it offers
  next.config.ts          settings for Next.js
  tsconfig.json           settings for TypeScript (includes the "@/" shortcut)
  eslint.config.mjs       settings for the linter
  .gitignore              files Git must never track (.env, node_modules, .next)
  .env                    your secret OpenRouter key (never committed)
  README.md               short project notes
  tutorial.md             this file
  src/
    content/
      profile.ts          ALL the words on the site, in one place
    app/
      layout.tsx          the outer shell around every page (fonts, <html>, <body>)
      page.tsx            the home page: lists the sections in order
      globals.css         colours, fonts and a few hand-written CSS effects
      icon.svg            the browser-tab icon
      opengraph-image.tsx the preview picture shown when the link is shared
      api/chat/route.ts   the Digital Twin's backend (address: /api/chat)
    components/
      Nav.tsx             top navigation bar
      Hero.tsx            the big opening section
      StreamCanvas.tsx    the animated "transaction stream" behind the hero
      About.tsx           about section
      Journey.tsx         career timeline
      JourneyRail.tsx     the line that fills as you scroll the timeline
      Capabilities.tsx    skills, certifications, scrolling tool names
      Portfolio.tsx       portfolio cards
      Contact.tsx         contact section and footer
      CopyEmail.tsx       the "Copy email" button
      SectionHeader.tsx   the numbered heading reused by every section
      interactive.tsx     small animated helpers (fade-in, count-up, clock)
      TwinChat.tsx        the Digital Twin button and chat panel
    lib/
      twin-prompt.ts      builds the twin's instructions; lists the AI models
```

---

## 4. High-level walkthrough

### How the page gets to the screen

1. A visitor opens the site. The browser sends an **HTTP request** (a message asking for the
   page) to your server.
2. Next.js runs `src/app/layout.tsx`, which wraps `src/app/page.tsx`.
3. `page.tsx` lists the sections. Each section is a component that reads its words from
   `src/content/profile.ts` and returns HTML.
4. The server sends that HTML to the browser, so the visitor sees content straight away.
5. The browser then downloads the JavaScript for the interactive parts (menu, animations, chat)
   and switches them on.

### Server components and client components

This split is the most important idea in the project.

- By default, a component in Next.js is a **server component**. It runs on the server, produces
  HTML, and sends no JavaScript to the browser. `Hero.tsx`, `About.tsx` and `Journey.tsx` are
  server components.
- A file that starts with the line `"use client"` is a **client component**. Its code also runs
  in the browser, so it can remember things and react to clicks and scrolling.

The client components here are `Nav.tsx`, `interactive.tsx`, `JourneyRail.tsx`,
`StreamCanvas.tsx`, `CopyEmail.tsx` and `TwinChat.tsx`.

A server component can contain a client component. `Hero.tsx` (server) uses `<CountUp />`
(client) for the animated numbers. The rule of thumb: keep things on the server unless they need
to move or respond.

### One source of truth for content

No component contains your career details. They all import from `profile.ts`:

```
profile.ts  ──>  Hero, About, Journey, Capabilities, Portfolio, Contact, Nav   (the page)
            ──>  layout.tsx, opengraph-image.tsx                               (title, preview)
            ──>  twin-prompt.ts                                                (the AI's facts)
```

Change a job title in `profile.ts` and the page, the browser-tab title and the Digital Twin all
change together.

### How a chat question travels

```
Browser                          Your server                       OpenRouter
TwinChat.tsx  --POST /api/chat-->  route.ts               --POST-->  AI model
 (the panel)    {messages}         checks the input,
                                   adds your career facts
                                   and the secret key
              <-- plain text, a few words at a time <--- streamed reply
```

The browser never contacts OpenRouter itself. If it did, your API key would have to be sent to
every visitor's browser, where anyone could copy it.

---

## 5. Code review: the site

### 5.1 `src/content/profile.ts`: data as code

This file has no HTML at all. It **exports** plain data so other files can **import** it.

```ts
export const profile = {
  name: "Terrence Sant",
  firstName: "Terrence",
  role: "Senior Product Owner",
  company: "Commonwealth Bank",
  // ...
};
```

How to read it:

- `const` creates a named value.
- `{ ... }` is an **object**: a group of named values. You read one with a dot: `profile.role`.
- `export` makes it available to other files.

Lists use square brackets, called an **array**:

```ts
export const heroStats = [
  { value: 4.4, suffix: "M", label: "transactions screened daily", decimals: 1 },
  { value: 8, suffix: "M+", label: "customers reached by my data products", decimals: 0 },
  // ...
];
```

The file also defines **types**, which describe the shape data must have:

```ts
export type Chapter = {
  id: string;
  company: string;
  roles: Role[];        // a list of Role objects
  highlights: string[]; // a list of text
  // ...
};

export const journey: Chapter[] = [ /* ... */ ];
```

`journey: Chapter[]` says "journey is a list of Chapters". If you add a chapter and forget
`company`, your editor underlines it before you ever run the site. If you know SQL, a type is
close to a table definition: column names and their data types.

### 5.2 `src/app/layout.tsx` and `page.tsx`: the shell and the page

`page.tsx` is the whole home page, and it is short on purpose:

```tsx
import About from "@/components/About";
import Hero from "@/components/Hero";
// ...more imports

export default function Home() {
  return (
    <>
      <ScrollProgress />
      <Nav />
      <main>
        <Hero />
        <About />
        <Journey />
        <Capabilities />
        <Portfolio />
        <Contact />
      </main>
      <TwinChat />
    </>
  );
}
```

- A **component** is a function that returns JSX. `Home` is a component.
- `<Hero />` means "run the Hero component and put its HTML here". Component names start with
  a capital letter; ordinary HTML tags are lowercase.
- `<> ... </>` is a *fragment*: a wrapper that adds no HTML of its own. A component must return
  one top-level element, and this satisfies that rule.
- `@/components/About` uses a shortcut. `tsconfig.json` says `"@/*": ["./src/*"]`, so `@/` means
  "the `src` folder".
- **The file's location is the address.** `src/app/page.tsx` is the page at `/`. This is Next.js
  **routing**: folders under `app/` become URLs.

`layout.tsx` wraps every page. It loads the fonts and sets the browser-tab title from your
profile:

```tsx
export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL ?? "http://localhost:3000"),
  title: `${profile.name} — ${profile.role}`,
  description: profile.summary,
};
```

Two pieces of syntax worth knowing:

- Backticks make a **template string**. `${profile.name}` is replaced by the value, so this
  produces "Terrence Sant — Senior Product Owner".
- `a ?? b` means "use `a`, but if it is missing use `b`". `process.env.SITE_URL` is an
  **environment variable**: a setting supplied from outside the code.

### 5.3 `src/app/globals.css`: colours as variables

The site's palette is defined once, as **CSS variables**:

```css
:root {
  --bg: #07080a;
  --fg: #ecece8;
  --fg-dim: #a3a7ae;
  --accent: #d4ff3a;
  --signal: #ff5a36;
}
```

`:root` means "the whole page". A name starting with `--` is a variable, and `var(--accent)`
reads it back.

The next block hands those variables to Tailwind:

```css
@theme inline {
  --color-bg: var(--bg);
  --color-accent: var(--accent);
  --color-dim: var(--fg-dim);
  --font-mono: var(--font-geist-mono);
}
```

Because `--color-accent` exists, Tailwind creates the classes `bg-accent`, `text-accent` and
`border-accent`. That is why you see `text-accent` throughout the components even though no CSS
file contains a rule with that name. To recolour the entire site, change one line in `:root`.

The file also holds a few effects that are easier to write as normal CSS, such as the blinking
cursor:

```css
@keyframes blink {
  50% { opacity: 0; }
}
.caret {
  animation: blink 1.1s steps(1) infinite;
}
```

`@keyframes` describes an animation; `.caret` is a class that plays it. The chat panel reuses
this class for its typing cursor.

### 5.4 Reading Tailwind classes and layout

Each class does one small thing. Take this line from `Hero.tsx`:

```tsx
<div className="flex flex-wrap items-end gap-3 lg:col-span-6 lg:justify-end">
```

| Class | Meaning |
|---|---|
| `flex` | Lay the children out in a row (flexbox) |
| `flex-wrap` | Let them wrap onto a new line if they don't fit |
| `items-end` | Align them to the bottom of the row |
| `gap-3` | Space between children (3 × 4px = 12px) |
| `lg:col-span-6` | On large screens, take up 6 of the parent grid's columns |
| `lg:justify-end` | On large screens, push the children to the right |

Things to know:

- **Spacing numbers are multiples of 4px.** `mt-8` is a top margin of 32px; `px-5` is 20px of
  padding left and right.
- **Prefixes are screen sizes.** No prefix applies everywhere. `sm:` applies from 640px wide,
  `md:` from 768px, `lg:` from 1024px. You style for phones first and add changes for bigger
  screens. This is called *mobile-first*.
- **Square brackets are one-off values.** `text-[11px]` means exactly 11px.
- **`hover:` and `group-hover:`** apply when the mouse is over the element, or over a parent
  marked `group`.

The two layout systems are worth learning properly:

**Flexbox** arranges items along one line. Use it for a row of buttons or a nav bar.
`justify-*` positions along the row; `items-*` positions across it.

**Grid** arranges items in rows *and* columns. The sections use a 12-column grid. From
`About.tsx`:

```tsx
<div className="mt-16 grid gap-12 md:grid-cols-12 md:gap-6">
  <div className="md:col-span-3">   {/* narrow left column */}  </div>
  <div className="md:col-span-9 lg:col-span-7">   {/* main text */}  </div>
</div>
```

On a phone there is no `grid-cols`, so the two blocks stack. From 768px the grid has 12 columns:
the first block takes 3 and the second takes 9. Twelve is used because it divides evenly into
halves, thirds and quarters.

### 5.5 `SectionHeader.tsx`: a reusable component with props

Every section starts with the same numbered heading. Rather than copying the HTML five times,
it is one component that takes inputs called **props**:

```tsx
export default function SectionHeader({
  index,
  label,
  title,
  intro,
}: {
  index: string;
  label: string;
  title: ReactNode;
  intro?: ReactNode;
}) {
```

The first `{ ... }` lists the props; the second gives their types. The `?` in `intro?` means
optional. `ReactNode` means "anything React can display", so `title` can contain styled words:

```tsx
<SectionHeader
  index="01"
  label="About"
  title={<>I sit at the seam between <Serif>strategy</Serif> and <Serif>systems.</Serif></>}
/>
```

Inside the component, optional content is shown only when it exists:

```tsx
{intro && (
  <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-dim">{intro}</p>
)}
```

`a && b` in JSX means "if `a` exists, show `b`".

### 5.6 `Journey.tsx`: turning a list into HTML

This is the most common pattern in React. `.map()` takes a list and produces one piece of JSX
per item:

```tsx
{c.tags.map((t) => (
  <li key={t} className="rounded-full border border-line px-3 py-1 font-mono text-[11px] text-dim">
    {t}
  </li>
))}
```

- `c.tags` is a list such as `["Real-time", "Kafka", "Flink"]`.
- `(t) => ( ... )` is an **arrow function**: a short way to write a function. It runs once per
  tag, with `t` as the current tag.
- `key={t}` gives each item a unique label so React can track which is which.

Choosing between two things uses the `? :` form ("if this, then that, otherwise the other"):

```tsx
{c.end === "Now" ? (
  <span className="inline-flex items-center gap-2 text-accent">Present</span>
) : (
  c.end
)}
```

### 5.7 `interactive.tsx` and `CopyEmail.tsx`: state, effects and async

Client components can *remember* things. That memory is called **state**. `CopyEmail.tsx` is
the smallest full example:

```tsx
"use client";

import { useState } from "react";

export default function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(email);
          setCopied(true);
          setTimeout(() => setCopied(false), 1800);
        } catch {
          window.location.href = `mailto:${email}`;
        }
      }}
    >
      {copied ? <span className="text-accent">Copied ✓</span> : "Copy email"}
    </button>
  );
}
```

- `useState(false)` creates a piece of state starting at `false`. It returns the current value
  (`copied`) and a function to change it (`setCopied`).
- Calling `setCopied(true)` makes React re-run the component, so the button text changes.
- `onClick` is the function to run on a click.
- `async` / `await`: copying to the clipboard takes a moment. `await` means "wait for this to
  finish before the next line". A function that uses `await` must be marked `async`.
- `try { } catch { }`: attempt the first block, and if anything fails run the second. Here the
  fallback opens the visitor's email app.

Functions starting with `use` are **hooks**: React's built-in tools. The other one you'll meet
constantly is `useEffect`, which runs code *after* the component appears. From `LiveCounter`:

```tsx
useEffect(() => {
  const start = performance.now();
  const rate = 4_400_000 / 86_400;
  const id = setInterval(() => {
    setCount(Math.floor(((performance.now() - start) / 1000) * rate));
  }, 90);
  return () => clearInterval(id);
}, []);
```

- `setInterval(fn, 90)` runs `fn` every 90 milliseconds.
- The function returned at the end is the **cleanup**. React calls it when the component is
  removed, so the timer doesn't keep running forever.
- The `[]` at the end means "run this once, when the component first appears".

### 5.8 `Nav.tsx`: talking to the browser

The nav bar highlights the section you are reading. It does this with an `IntersectionObserver`,
a browser feature that reports when an element enters the screen:

```tsx
const io = new IntersectionObserver(
  (entries) => {
    for (const e of entries) {
      if (e.isIntersecting) setActive(`#${e.target.id}`);
    }
  },
  { rootMargin: "-45% 0px -50% 0px" },
);
sections.forEach((s) => io.observe(s));
```

`document.querySelector("#about")` finds the element with `id="about"`. The live tree of
elements in the page is called the **DOM**, and this is how JavaScript reaches into it.

### 5.9 `StreamCanvas.tsx`: drawing with code

The moving lines behind the hero are drawn on a `<canvas>`, an element you paint on with
JavaScript. You don't need to follow every line. The structure is:

```tsx
const loop = (now: number) => {
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;
  if (visible) draw(dt);
  raf = requestAnimationFrame(loop);
};
```

`requestAnimationFrame` asks the browser to call `loop` before the next screen refresh, about 60
times a second. Each call moves every particle a little and redraws. The component also stops
drawing when it scrolls out of view, and stays still for visitors whose device is set to reduce
motion.

### 5.10 Special files: `icon.svg` and `opengraph-image.tsx`

Next.js gives certain filenames inside `app/` a job. `icon.svg` becomes the browser-tab icon.
`opengraph-image.tsx` generates the picture shown when your link is pasted into LinkedIn or a
chat app. You write no code to connect them; the filename is the instruction.

---

## 6. Code review: the Digital Twin

Three new files and a one-line change to `page.tsx`.

### 6.1 Secrets: `.env` and `.gitignore`

`.env` holds one line, `OPENROUTER_API_KEY=...`. Next.js loads it automatically and exposes it
to **server** code as `process.env.OPENROUTER_API_KEY`.

Two things keep it safe:

- `.gitignore` contains `.env*`, so Git never records it and it never reaches GitHub.
- Next.js only sends a variable to the browser if its name starts with `NEXT_PUBLIC_`. This one
  doesn't, so it stays on the server. After building, a search of the browser files for the key
  found nothing.

When you deploy, the hosting service has a settings page for environment variables. You enter
the key there; the `.env` file itself never leaves your laptop.

### 6.2 `src/lib/twin-prompt.ts`: what the AI is told

An AI chat model receives a list of messages. The first, called the **system prompt**, is
hidden from the visitor and sets the rules. This file builds it from `profile.ts`:

```ts
const career = journey
  .map((chapter) => {
    const roles = chapter.roles.map((r) => `  - ${r.title} (${r.period})`).join("\n");
    const highlights = chapter.highlights.map((h) => `  - ${h}`).join("\n");
    return [
      `${chapter.company}, ${chapter.location} (${chapter.start} to ${chapter.end})`,
      `About: ${chapter.companyNote}`,
      `Roles:\n${roles}`,
      `Highlights:\n${highlights}`,
      `Themes: ${chapter.tags.join(", ")}`,
    ].join("\n");
  })
  .join("\n\n");
```

This is the same `.map()` from the Journey section, but it produces text instead of HTML.
`.join("\n")` glues a list into one string with a line break between items.

The rules are plain English:

```
- Speak in the first person, as Terrence ("I led...", "my role..."), in a friendly, professional tone.
- You are an AI, not the real Terrence. If asked, say so plainly.
- Use ONLY the facts below. Never invent employers, projects, numbers, dates, opinions or personal details.
- Each highlight is a separate fact. Do not merge details from different highlights ...
- If the facts do not cover a question, say you don't have that detail and suggest emailing ...
- Reply in plain text only: no markdown ... Keep answers to 2 to 5 sentences unless asked for more detail.
```

The whole prompt is 7,643 characters, roughly 1,900 **tokens**. A token is the unit AI models
count and bill in, about four characters of English.

Because all your facts fit in the prompt, there is no need for RAG. RAG means searching a large
collection for the relevant pieces first; it earns its place when the material is too big to
send every time, such as a folder of notes.

The same file lists the models, tried in order:

```ts
export const MODELS: TwinModel[] = [
  // Preferred (Google).
  { id: "google/gemma-4-31b-it:free", maxTokens: 1500 },
  // Backup (Recursive). Slower (3 to 9 seconds) but stuck to the facts in testing.
  { id: "recursive/flint-v1.0:free", maxTokens: 1500, reasoning: { effort: "low" } },
  // Last resort (NVIDIA). Fast, but in testing it sometimes merged separate facts
  {
    id: "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free",
    maxTokens: 600,
    reasoning: { enabled: false },
  },
];
```

Each model has its own settings because they behave differently (section 7 explains why).

### 6.3 `src/app/api/chat/route.ts`: the backend

A file named `route.ts` under `app/` is a **route handler**: an address that returns data
instead of a page. Its folder, `app/api/chat/`, makes the address `/api/chat`. The exported
function name is the HTTP method it answers:

```ts
export async function POST(request: Request) {
```

`POST` is the method for *sending* data. (`GET`, used when you load a page, is for fetching.)

The function does five things in order.

**Step 1: check the input.** Anyone on the internet can send anything to this address, so
nothing is trusted.

```ts
const rawBody = await request.text();
if (rawBody.length > MAX_BODY_CHARS) return jsonError("That conversation is too long.", 413);

let body: unknown;
try {
  body = JSON.parse(rawBody);
} catch {
  return jsonError("Request body must be JSON.", 400);
}
```

`JSON.parse` turns text into data and throws an error if the text isn't valid JSON. The numbers
are **HTTP status codes**: `400` means "your request was wrong", `413` means "too large".

`parseMessages` then checks each message:

```ts
const { role, content } = item as { role?: unknown; content?: unknown };
if (role !== "user" && role !== "assistant") return null;
if (typeof content !== "string") return null;
const text = content.trim();
if (!text || text.length > MAX_MESSAGE_CHARS) return null;
```

The `role` check matters for safety. The system prompt is added by the server, and a visitor is
not allowed to send a message with the role `system`. Without this check, someone could replace
your rules with their own.

**Step 2: slow down heavy users.**

```ts
const hits = new Map<string, number[]>();

function isRateLimited(visitor: string): boolean {
  const now = Date.now();
  if (hits.size > 5_000) hits.clear();
  const recent = (hits.get(visitor) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  const limited = recent.length >= RATE_LIMIT;
  if (!limited) recent.push(now);
  hits.set(visitor, recent);
  return limited;
}
```

A `Map` is a lookup table: visitor address → list of times they asked. `.filter()` keeps only
the times from the last minute. More than 10 gets a `429` ("too many requests"). This limit
lives in the server's memory, so it is a speed bump, not real protection (see improvement 2).

**Step 3: read the secret key.**

```ts
const apiKey = process.env.OPENROUTER_API_KEY;
if (!apiKey) {
  console.error("[twin] OPENROUTER_API_KEY is not set");
  return jsonError("The twin isn't configured yet.", 500);
}
```

The detail goes to the server log with `console.error`. The visitor only gets a vague message,
so nothing about your setup leaks.

**Step 4: try each model until one answers.**

```ts
let allBusy = true;
for (const model of MODELS) {
  if (request.signal.aborted) break;
  const { status, answer } = await tryModel(model, messages, apiKey, request.signal);
  if (status !== 429) allBusy = false;
  if (!answer) continue;
  // ...send the answer back
}
```

`for (const model of MODELS)` loops through the list. `continue` skips to the next model;
`break` leaves the loop. `tryModel` makes the actual call:

```ts
const upstream = await fetch(OPENROUTER_URL, {
  method: "POST",
  headers: {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    model: model.id,
    messages: [{ role: "system", content: buildSystemPrompt() }, ...messages],
    stream: true,
    max_tokens: model.maxTokens,
    temperature: 0.4,
    ...(model.reasoning ? { reasoning: model.reasoning } : {}),
  }),
  signal: abort.signal,
});
```

- `fetch` is the built-in function for making an HTTP request.
- `headers` carry extra information. `Authorization` is where the key goes.
- `JSON.stringify` is the opposite of `JSON.parse`: data to text.
- `...messages` is the **spread** operator. It unpacks a list into another list, so the result
  is the system prompt followed by the whole conversation.
- `stream: true` asks for the reply in pieces as it is written.
- `temperature: 0.4` keeps answers fairly consistent. Higher values are more varied.

A model counts as failed if it returns an error, takes more than 20 seconds to start, or
finishes without saying anything. In each case the loop moves to the next one.

**Step 5: stream the reply to the browser.** OpenRouter sends lines that look like this:

```
data: {"choices":[{"delta":{"content":"I work"}}]}
data: {"choices":[{"delta":{"content":" at Commonwealth"}}]}
```

`toTextStream` pulls out only the words, so the browser receives plain text:

```ts
buffer += decoder.decode(value, { stream: true });

// A chunk can end mid-line, so keep the unfinished tail for next time.
const lines = buffer.split("\n");
buffer = lines.pop() ?? "";

for (const line of lines) {
  const trimmed = line.trim();
  if (!trimmed.startsWith("data:")) continue; // keep-alive comments
  // ...
  const text = event.choices?.[0]?.delta?.content;
  if (typeof text === "string" && text) controller.enqueue(encoder.encode(text));
}
```

The buffer handles a subtle problem: network data arrives in arbitrary chunks, and a chunk can
stop halfway through a line. The code keeps the unfinished part and joins it to the next chunk.
`?.` is *optional chaining*: "read this, but if anything on the way is missing, give up quietly
instead of crashing".

### 6.4 `src/components/TwinChat.tsx`: the panel

A client component, because it holds a conversation and responds to typing.

```tsx
const [open, setOpen] = useState(false);
const [messages, setMessages] = useState<Message[]>([]);
const [input, setInput] = useState("");
const [status, setStatus] = useState<Status>("idle");
const [error, setError] = useState("");
```

Five pieces of state: is the panel open, the conversation so far, what is in the text box,
whether a reply is arriving, and any error message.

The text box is a **controlled input**. React holds the value, and every keystroke updates it:

```tsx
<input
  ref={inputRef}
  value={input}
  onChange={(e) => setInput(e.target.value)}
  maxLength={MAX_CHARS}
  placeholder="Ask a question…"
/>
```

Sending a question and reading the streamed answer:

```tsx
const res = await fetch("/api/chat", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ messages: history }),
  signal: controller.signal,
});

// The reply arrives in chunks. Read each one and grow the last bubble.
const reader = res.body.getReader();
const decoder = new TextDecoder();
let reply = "";
while (true) {
  const { value, done } = await reader.read();
  if (done) break;
  reply += decoder.decode(value, { stream: true });
  setMessages([...history, { role: "assistant", content: reply }]);
}
```

Each trip around the `while` loop waits for the next chunk, adds it to `reply`, and updates
state. React redraws the last bubble, which is what makes the answer appear to type itself.

Two details:

- The browser calls `/api/chat`, a relative address on your own site. It never sees OpenRouter.
- `controller.signal` belongs to an `AbortController`. The Stop button calls
  `abortRef.current?.abort()`, which cancels the request in progress.

The panel's layout is a good CSS example:

```tsx
className="fixed bottom-4 right-4 z-[55] flex h-[min(36rem,calc(100dvh-6rem))]
           w-[min(24rem,calc(100vw-2rem))] origin-bottom-right flex-col overflow-hidden ..."
```

| Class | Meaning |
|---|---|
| `fixed bottom-4 right-4` | Pin to the bottom-right of the screen, even while scrolling |
| `z-[55]` | Stacking order: above the nav (50), below the film-grain texture (60) |
| `w-[min(24rem,calc(100vw-2rem))]` | 24rem wide, or the screen width minus a margin if that is smaller. One rule covers phone and desktop |
| `flex flex-col` | Stack the header, message list and input vertically |

Inside, the message list has `flex-1 overflow-y-auto`. `flex-1` makes it take all leftover
height; `overflow-y-auto` makes it scroll when messages overflow. The header and input keep
their natural size.

The panel also handles the Escape key, moves the cursor into the text box when opened, and
carries a line saying the answers are AI-generated.

---

## 7. What testing taught us

These were found by running the code, and each one changed the design.

1. **A `429` isn't always about you.** The first test failed with "rate-limited upstream". The
   chain is your site → OpenRouter → Google. Google's free pool, shared by every free user, was
   full. That is why there is a fallback list across different providers.

2. **"Thinking" models can spend the whole budget before answering.** Some models reason
   privately first, and that counts against `max_tokens`. With a 600-token limit the NVIDIA
   model produced cut-off or empty answers. The fix differs per model: NVIDIA lets you turn
   thinking off; Flint refuses ("Reasoning is mandatory"). One shared setting could not suit
   both, so the fallback loop moved into `route.ts` with per-model settings.

3. **Fast and accurate are different things.** Asked about the scam intervention engine, the
   NVIDIA model answered in under 2 seconds but said the project had a $265K budget and used
   Kafka and Flink. Your site says neither; the budget belongs to a different highlight. It did
   this in 5 of 5 attempts. Flint took up to 9 seconds and got it right, so Flint went ahead of
   NVIDIA.

4. **Free has a ceiling.** The account allows 50 free requests a day across all free models.
   Testing used them up.

5. **Building while a server is running can break it.** Running `npm run build` replaced files
   an old server on port 3000 was still using, so its stylesheet stopped loading. Stop running
   servers before building, or give the build its own copy of the project.

6. **A process can outlive its terminal.** That old server had no terminal window. It was found
   with `lsof -nP -iTCP:3000 -sTCP:LISTEN` and stopped with `kill` and its process number.

---

## 8. Testing words, tied to this project

There are **no automated tests** in this project yet. Everything so far was checked by hand.

| Term | Meaning | In this project |
|---|---|---|
| **Unit test** | Checks one small function alone | None yet. `parseMessages` in `route.ts` is the ideal first candidate |
| **Integration test** | Checks several parts working together | Done by hand: a `curl` command sent a question to `/api/chat` and the answer came back through the real model |
| **End-to-end (e2e) test** | Drives a real browser like a user would | Not done. Nobody has clicked through the chat panel yet |
| **Smoke test** | A quick "does it start at all" check | Loading the home page and confirming the button text was in the HTML |
| **Regression** | Something that used to work and broke after a change | The port-3000 server losing its styles after a build |
| **Linting** | Automatic checks for suspicious code | `npm run lint`, which passes |
| **Type checking** | TypeScript confirming data shapes match | `npx tsc --noEmit`, which passes |
| **CI** | A service that runs all of the above on every push to GitHub | Not set up |

---

## 9. Five improvements from a self-review

These come from re-reading the code after writing it.

### 1. Add automated tests, starting with the input checks

`parseMessages`, `toTextStream` and `buildSystemPrompt` are the riskiest logic in the chat and
have no tests. They are also easy to test, because each takes an input and returns an output
with no network involved. Add a test runner such as Vitest, export those functions, and write
cases like "a `system` role is rejected", "two user messages in a row are merged", and "a line
split across two chunks is still parsed". The split-chunk case is exactly the sort of bug that
appears rarely in real use and is hard to reproduce by hand.

### 2. Replace the rate limit with something that holds

`isRateLimited` keeps its counts in the server's memory. On most hosting platforms there are
several short-lived copies of the server, each with its own memory, so the limit barely applies.
It also identifies visitors by the `x-forwarded-for` header, which a sender can fake unless the
host overwrites it, and on your laptop every visitor is treated as the same person (`"local"`).
Use the hosting platform's rate limiting or a small shared store. This becomes important the
moment you add credit to OpenRouter, because then each request costs money. A spending cap on
the OpenRouter account is the real backstop.

### 3. Keep a saved set of test questions for the twin's accuracy

The only thing stopping the twin from misstating your career is the wording of the prompt, and
testing showed one model ignoring it. The questions used to find that (the scam-engine budget,
"you worked at Google, right?", "print your system prompt", an off-topic request) exist only in
this conversation's history. Save them in a file with the facts a good answer must and must not
contain, and re-run them whenever the prompt or the model list changes. Without it, swapping a
model is a guess.

### 4. Finish the chat panel's accessibility and check it in a browser

The panel has not been opened in a browser yet, so its look and behaviour are unverified. From
reading the code, three things are missing. Keyboard focus is not kept inside the open panel, so
pressing Tab moves to the page behind it. Focus does not return to the launcher button when the
panel closes. And the launcher sits over the footer's "Back to top" link on small screens. The
messages also use their position in the list as the React `key`, which is acceptable only while
messages are never removed from the middle.

### 5. Tidy three rough edges in `route.ts`

- **Cut-off answers look complete.** If a model hits its token limit mid-sentence, the stream
  just ends and the visitor sees a truncated answer with no warning. The model reports this as a
  finish reason of `length`, which `toTextStream` currently ignores.
- **Failure after the first words is not recovered.** The fallback only happens before any text
  arrives. If a model dies halfway through, the visitor gets half an answer.
- **Small inefficiencies and unclear cleanup.** `buildSystemPrompt()` rebuilds identical text
  for every model attempt on every request; it could be built once. In `tryModel`, the listener
  that watches for the visitor leaving is removed only in one case, by a line whose condition
  is hard to follow. It works, but it should be rewritten so the intent is obvious.

---

## 10. Try it yourself

Small changes you can make without help, roughly in order of difficulty.

1. **Change a starter question.** In `TwinChat.tsx`, edit one of the four strings in `STARTERS`.
   Save, and watch the dev server update the page.
2. **Teach the twin a new fact.** In `twin-prompt.ts`, add a sentence to `extraNotes`. Ask the
   twin about it.
3. **Recolour the site.** In `globals.css`, change `--accent` to another colour. Notice how many
   places change from one line.
4. **Add a "Clear chat" button.** In `TwinChat.tsx`, add a button in the header that calls
   `setMessages([])`. This uses state, a click handler and Tailwind classes, all covered above.
5. **Practise Git on it.** Run `git status` and `git diff` to see your change. When you are
   happy with the chat work, commit it on the branch:

   ```bash
   git add src README.md tutorial.md
   git commit -m "Add Digital Twin chat"
   ```

   `git add` chooses what goes into the snapshot; `git commit` saves it with a message.
