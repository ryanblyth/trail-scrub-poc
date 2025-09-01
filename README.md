# trail-scrub-poc
Spec-driven Mapbox GL JS + GSAP ScrollTrigger project that traces Mapbox lines the user scrolls.


## Why this repo
This project is built **docs-first** so AI/codegen (Cursor, ChatGPT) always has the full story:
- Lightweight **RFCs** capture intent and constraints.
- **ADRs** record decisions (and reversals).
- **Feature specs** provide testable acceptance criteria.
- A simple **workflow** keeps specs the source of truth.

## Status
- Docs scaffolding in place  
- Prototype implementation next (layers, marker, reduced-motion)  

## Tech stack
- **Mapbox GL JS** — vector map rendering & `line-progress`
- **GSAP ScrollTrigger** — scroll-scrub, pinning, orchestration
- **Lenis** — smooth scrolling + ScrollTrigger scrollerProxy
- **Turf.js** — geometry helpers (`length`, `along`)

## Repository structure
docs/
adrs/
0001-choose-scrolltrigger.md

rfcs/
0001-trail-scrub-animation.md
workflow.md

specs/
feature-trail-scrub-animation.md

src/ # (to be added in the implementation PRs)

## Development workflow (spec-first)
1. Edit or add a spec/RFC/ADR under `docs/` or `specs/`.
2. Commit with a docs prefix: `spec: clarify marker easing`.
3. Open Cursor and point it at the spec path(s).
4. Generate/modify code to satisfy the **acceptance criteria**.
5. PR must link the spec/RFC/ADR and check the acceptance boxes.

> TL;DR — If the behavior changes, **update the spec first**. If the code misses the spec, **fix the code**.

See: [`docs/workflow.md`](docs/workflow.md)

## Feature: Trail Scrub Animation (overview)
- Base muted trail line + **reveal layer** using `line-gradient` over `["line-progress"]`
- Optional moving “hiker dot” driven by `turf.along(totalLength * progress)`
- Reduced-motion: show full trail, skip scrub
- Performance budget: ≥55 fps desktop, ≥30 fps mid-tier Android

Details: [`specs/feature-trail-scrub-animation.md`](specs/feature-trail-scrub-animation.md)  
Design intent: [`docs/rfcs/0001-trail-scrub-animation.md`](docs/rfcs/0001-trail-scrub-animation.md)  
Decision record: [`docs/adrs/0001-choose-scrolltrigger.md`](docs/adrs/0001-choose-scrolltrigger.md)

## Using with Cursor (quick start)
- Open this repo in Cursor.
- In a new chat, reference the spec:  
  _“Implement `src/` per **specs/feature-trail-scrub-animation.md**. Use Mapbox GL JS + GSAP ScrollTrigger + Lenis. Meet all ACs and perf budget.”_
- Iterate: if behavior changes, update the spec first, then regenerate.

## Environment (when code lands)
- Node 18+ recommended
- Mapbox access token via `.env` (e.g., `VITE_MAPBOX_TOKEN=...`)
- Package manager: npm or pnpm

## Roadmap
- [ ] Minimal demo page with pinned section and scrubbed reveal
- [ ] Moving marker synchronized with progress
- [ ] Reduced-motion fallback + A11y labels
- [ ] Perf pass (layer simplification, update throttling)
- [ ] Record GIF demo and add to README

## Contributing
- PRs must link a spec/RFC/ADR and state which acceptance criteria are satisfied.
- Commit prefixes: `spec:`, `rfc:`, `adr:`, `feat:`, `fix:`, `docs:`.

## License
MIT