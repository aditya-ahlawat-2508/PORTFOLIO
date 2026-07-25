# DESIGN_PLAN.md

## 1. Concept

The site is a directed graph you traverse. Sections are nodes; scrolling walks an edge. Colour encodes execution state (pending / active / resolved), not mood. The docked traversal rail is the signature element — everything else stays quiet so it can carry the idea.

## 2. Tokens

| Token | Dark | Light | Role |
|---|---|---|---|
| `--void` | `#0E1116` | `#F4F6F9` | page ground |
| `--surface` | `#161B22` | `#FFFFFF` | raised panels, hairline-bordered |
| `--vellum` | `#DDE3EC` | `#0E1116` | primary text |
| `--muted` | `#79859A` | `#5C6779` | secondary text, metadata, PENDING state (used at ~40% opacity for pending) |
| `--signal` | `#5A6CFF` | `#4453E0` | ACTIVE state — current node, live edges, hover links |
| `--pulse` | `#00C2A8` | `#00947F` | RESOLVED state — completed nodes, shipped work, metrics |

Border: hairline `1px` at 12% opacity of `--muted`. `border-radius` max 2px. No shadows — depth from surface colour + hairlines only. Gradients banned except along an edge path encoding traversal direction (signal → pulse, low opacity).

## 3. Type

- **Display** — Bricolage Grotesque (variable), hero + section headings only, tracking `-0.03em`.
- **Body** — Geist Sans, 16px / 1.6, max measure 68ch.
- **Utility/mono** — Geist Mono, all numbers, labels, eyebrows, tech tags, dates, metrics, node IDs.

Scale (rem): `0.75 / 0.875 / 1 / 1.25 / 1.75 / 2.5 / 4.5`, hero clamped `2.75rem–7rem`.

## 4. Spacing / grid

12-col grid, 1280px max width, gutters 24px mobile / 48px desktop. Content in cols 2–8 or 5–12, alternating — nothing centred except hero headline. Section rhythm 128px desktop / 80px mobile.

## 5. Signature element

One sentence: **a hand-authored SVG graph of the 7 site sections animates its traversal once on load, then docks into a fixed left rail (top strip on mobile) that acts as a live, scroll-synced minimap for the rest of the visit.**

## 6. Wireframes

### Desktop (1280px+)

```
┌─────────────────────────────────────────────────────────────┐
│ [rail] entry — HERO                                          │
│  o      Bricolage headline (cols 2-9), subhead, links        │
│  |      graph fills right/behind, cols 8-12 bleed            │
│  o      mono metric strip: DTU IT '27 · Knight 1862 · 650+   │
│  |                                                             │
│  o  state — ABOUT      prose 60% (cols 2-7) | state panel 40%│
│  |                      (cols 8-12, mono JSON-like)           │
│  o  run — EXPERIENCE   mono header row, hairline bullet list │
│  |                      (cols 2-11)                            │
│  o  build — PROJECTS   full-width panels, alternating cols    │
│  |         panel A: name/thesis/links (2-6) | bullets (7-12)  │
│  |         panel B: bullets (2-7) | name/thesis/links (8-12)  │
│  |         panel C: same as A + "in progress" chip            │
│  o  stack — SKILLS     6 mono groups, dense table (cols 2-11) │
│  |                                                             │
│  o  solve — CP         big mono numerals row (cols 2-11)      │
│  |                                                             │
│  o  reach — CONTACT    mono email cta, links row, résumé btn  │
└─────────────────────────────────────────────────────────────┘
```

### Mobile (360–768px)

```
┌───────────────────────────┐
│ ═══ top rail strip (7 dot)│
├───────────────────────────┤
│ entry — hero, stacked,     │
│ graph behind at low opacity│
│ state — about, stacked     │
│ run — experience           │
│ build — projects (stacked  │
│   col order, no alternation)│
│ stack — skills (1 col)     │
│ solve — cp numerals (2col) │
│ reach — contact             │
└───────────────────────────┘
```

## 7. Critique against anti-patterns (Section 3)

- **Dropped**: an early instinct to give the hero a soft radial glow behind the graph — reads too close to mesh-gradient/aurora territory. Replaced with flat `--void` ground; the only glow permitted is the `--signal` stroke on the currently-animating edge.
- **Dropped**: numbering the project panels (01/02/03) — brief explicitly bans this outside the graph sequence. Panels are distinguished by name + alternating layout only.
- **Changed**: "current state" panel in About was going to be styled as a real JSON code block with syntax highlighting — trimmed to plain mono key: value lines, no braces/quotes, so it doesn't read as a gimmick terminal.
- **Changed**: skills section nearly became tag "pills" with rounded-full borders — switched to sharp-cornered hairline-divided rows to stay consistent with the schematic/2px-radius rule and avoid pill-shaped default-bootstrap look.
- **Confirmed safe**: big mono numerals in `solve` could look like a stat-card dashboard — kept, but no cards/borders around each numeral, just baseline-aligned mono type in a row, so it reads as a printout, not a bento grid.
- **Confirmed safe**: hero headline candidates (final pick bolded):
  1. "Multi-agent systems that check their own work."
  2. **"I build agent pipelines that catch their own hallucinations."**
  3. "LLMs that cite sources, not invent them — that's what I build."
  Picked #2: names the concrete mechanism (catching hallucinations) instead of a vague "AI systems" claim, active voice, no banned words.

## 8. Signature-element implementation note

`graph-data.ts` holds 7 nodes with fixed `{x, y}` coordinates (percentage-based viewBox) and an edge list `[from, to]` in traversal order. `TraversalGraph` renders the hero SVG and runs the once-only entrance animation via Motion; on completion (or immediately under `prefers-reduced-motion`) it hands off to `GraphRail`, a fixed `<nav>` reading the same data file, with active/resolved/pending state derived from an IntersectionObserver-backed scroll hook.

## 9. Final critique (post-build)

Built and screenshotted the full site (light + dark, desktop + mobile, keyboard-only, reduced-motion). One thing cut: the active rail node originally had an infinite `box-shadow` pulse animation running for the entire scroll session. The brief's own rule — "one bold thing, everything else is quiet" — was written for exactly this situation: a second, persistent animated flourish competing with the traversal-graph-to-rail dock for attention. Removed it; the active node is now identified by colour alone (signal blue fill vs. muted outline vs. pulse teal), consistent with the rest of the site's restraint.
