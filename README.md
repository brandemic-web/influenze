# influenze.ai

Marketing site for Influenze.ai — Astro 7, Tailwind v4, GSAP, deployed to
Cloudflare Workers Assets.

## Getting started

Requires Node 22.12 or later.

```sh
npm install
npm run dev        # http://localhost:4321
```

## Commands

| Command | Action |
| :------ | :----- |
| `npm run dev` | Dev server at `localhost:4321` |
| `npm run build` | Production build to `./dist/` |
| `npm run preview` | Serve the build locally |
| `npx astro check` | Typecheck the project |
| `npm run deploy` | Build and deploy to Cloudflare |

## Where things are

All copy and content lives in `src/data/` — one file per page section, so a
wording change never means opening a component. Routes are `src/pages/`,
sections are `src/components/<route>/`, and client behaviour is `src/scripts/`.

`src/components/app/` reproduces the product UI as markup for the hero
animation; see `src/components/app/APP-SPEC.md` before touching it.

See `AGENTS.md` for conventions and the current pre-launch checklist.
