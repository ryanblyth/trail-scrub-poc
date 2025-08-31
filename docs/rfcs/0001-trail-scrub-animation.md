# RFC 0001: Trail Scrub Animation
- **Status**: Proposed
- **Owner**: @ryanblyth
- **Date**: 2025-08-31
- **Related**: ADR-0001, Spec: feature-trail-scrub-animation.md

## Problem
We want to visualize hiking trails in a scrollytelling flow where the trail path animates (“draws itself”) as the user scrolls. Needs to be smooth, accessible, performant, and mobile-friendly.

## Goals
- Highlight a trail with a scrubbed animation tied to scroll progress.
- Optional moving marker (“hiker dot”) along the path.
- Keep FPS > 55 desktop, > 30 mobile.
- Support reduced-motion users.

## Non-Goals
- Multi-trail orchestration (future).
- Dynamic elevation charts (future).

## Proposal
- Use Mapbox GL JS with `lineMetrics: true`.
- Add two line layers: base (muted), reveal (scrubbed).
- Use GSAP ScrollTrigger with Lenis scrollerProxy to tie animation to scroll.
- Optionally animate a dot marker with Turf.js `along()`.

## Risks & Mitigations
- Jank with heavy trails → simplify GeoJSON, throttle updates.
- Motion sickness → disable camera follow by default, add reduced-motion fallback.

## Alternatives
- Scrollama + D3 (less control, harder to integrate with Mapbox).
- CSS scroll-timeline (not yet broadly supported).
