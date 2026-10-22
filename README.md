# bhavish — personal site

Personal site for Bhavish, AI engineer. The concept is **"Measured, not asserted."** The site reads like an instrumented research notebook. Every claim carries a citation `[n]` that resolves to the repo, README or benchmark where it was measured.

Next.js 15 (App Router) · TypeScript · Tailwind v4 · GSAP + ScrollTrigger · Lenis · Framer Motion (mini) · fully static.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build (also runs lint + type-check)
npm start        # serve the production build
```

## Editing content

All copy lives in typed files under `content/`. You shouldn't need to touch components to update the site.

| File | What it holds |
| --- | --- |
| `content/site.ts` | Name, role, email, hero statement, about copy, "Into" list, "Currently" strip, socials |
| `content/projects.ts` | Projects in display order. A project with a `caseStudy` gets a `/work/[slug]` page; one without links to its repo |
| `content/references.ts` | The numbered citations. `metric.ref` on a project and `statement.cite` in `site.ts` point here |
| `content/toolkit.ts` | The two marquee rows and where each tool was used |
| `content/experience.ts` | Timeline entries |

Search for `TODO` to find draft copy that needs your words: `grep -rn TODO content components`.

**Add a project:** append an object to `projects` in `content/projects.ts`. For a visual, pick an existing `plate` (`legal`, `lsm`, `rag`, `gpt`, `turbofan`, `agent`). For a new one, add an SVG function to `components/work/Plate.tsx` and register it in `PLATES`. Add a `caseStudy` block to generate a full page. The template is `components/work/CaseStudy.tsx`.

**Add a social link:** fill in `href` in `site.socials`. Entries with an empty `href` stay hidden.

**Add a portrait:** put the photo at `public/portrait.jpg` and follow the comment at the top of `components/sections/Portrait.tsx`.

## Swapping fonts and colours

- **Colours** are tokens in `app/globals.css` under `@theme` (`--color-ink`, `--color-paper`, `--color-signal`, …). Tailwind utilities like `bg-ink` and `text-signal` are generated from them, so a change there restyles everything. Keep `--color-signal` rare: citations, focus and live state only.
- **Fonts** load through `next/font` in `app/layout.tsx` (self-hosted at build time). Swap `Fraunces` / `Geist` / `Geist_Mono` for any Google font and keep the CSS variable names. The share image uses static copies in `assets/fonts/`, so replace those too if you change the display face.
- **Type scale** is the `--fs-*` variables in `app/globals.css` (fluid `clamp()` values).
- **Motion** uses two curves, defined twice to stay in sync: `--ease-out` / `--ease-in-out` in CSS and `EASE` in `lib/gsap.ts`.

## How the motion works

- `components/layout/SmoothScroll.tsx` runs Lenis on GSAP's ticker and feeds ScrollTrigger.
- `components/layout/RevealController.tsx` animates any element with `data-reveal="words|fade|clip|rule"` as it scrolls in. Server components only need the attribute. `components/ui/SplitWords.tsx` prepares masked word reveals.
- `components/layout/Preloader.tsx` plays on the first visit to `/` only (flag in `localStorage`). Any click or key skips it.
- `components/layout/PageTransition.tsx` handles route changes: a paper curtain rises with the destination title. Use `TransitionLink` for internal links and `AnchorLink` for home-page sections.
- `components/hero/Hero.tsx` holds the signature moment: the `[1]` citation draws a leader line and resolves into its evidence card.
- Everything respects `prefers-reduced-motion`. Content is never hidden without JS, and the custom cursor turns off on touch devices.

## SEO

Metadata and JSON-LD `Person` schema are in `app/layout.tsx`. Share images come from `app/opengraph-image.tsx` and `app/work/[slug]/opengraph-image.tsx` (template in `lib/og.tsx`). The rest: `app/icon.svg`, `app/apple-icon.tsx`, `app/sitemap.ts`, `app/robots.ts`.

Set `NEXT_PUBLIC_SITE_URL` to your final domain (e.g. `https://bhavish.dev`). On Vercel it falls back to the production URL automatically.

## Deploy (Vercel, zero config)

1. Push this folder to a GitHub repo.
2. Go to vercel.com/new, import the repo, keep the defaults and click Deploy.
3. Optional: add a custom domain under *Settings → Domains* and set `NEXT_PUBLIC_SITE_URL` under *Settings → Environment Variables*, then redeploy.

Or from the terminal: `npx vercel` (preview) and `npx vercel --prod`.
