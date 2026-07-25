# Aditya Ahlawat — portfolio

A portfolio built around one idea: the site is a directed graph you traverse. See [DESIGN_PLAN.md](DESIGN_PLAN.md) for the full design rationale.

## Run

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build

```bash
pnpm build
pnpm start
```

## Add a project

Everything on the site is driven by [content/profile.ts](content/profile.ts) — nothing is hardcoded in JSX. To add a project:

1. Add an entry to the `projects` array in `content/profile.ts` with `slug`, `name`, `thesis`, `dates`, `github`, `stack`, and `bullets` (each bullet is `{ metric, text }`).
2. If you want a custom architecture schematic for it (like the AWS layer diagram or the TripMate agent graph), build a small SVG component under `components/sections/projects/` and pass it as the `schematic` prop to the corresponding `ProjectPanel` in `components/sections/Projects.tsx`. Panels alternate column order automatically based on index.
3. Everything else — stack chips, GitHub link, metric-led bullets — renders automatically from the data.

## Live data

- `app/api/leetcode/route.ts` and `lib/fetchers.ts` fetch LeetCode solve stats server-side (ISR, 1h revalidate) with a silent static fallback from `content/profile.ts` if the request fails — the section always renders, never an error state.

## Structure

- `content/profile.ts` — single source of truth for all copy, links, and data.
- `components/graph/` — the traversal graph system: coordinate data, the hero intro animation, and the scroll-synced rail nav.
- `components/sections/` — the seven page sections (one per graph node).
- `components/ui/` — small shared primitives (theme toggle, copy-email, tags, section heading, scroll reveal).
- `lib/` — hooks (active section via IntersectionObserver, reduced motion, theme via useSyncExternalStore) and the LeetCode fetcher.
