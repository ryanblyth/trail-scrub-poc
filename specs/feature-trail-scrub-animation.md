# Feature Spec: Trail Scrub Animation
**Epic**: Scrollytell Trails  
**Owner**: @ryanblyth  
**Spec version**: 1.0

## Narrative
As a reader, I want to see the Highland Mary Trail “draw” itself as I scroll, so I can understand its geography and feel the journey.

## User Stories
- Desktop: smooth scrubbed animation of trail.
- Mobile: works without jank; responsive layout.
- Accessibility: full trail visible immediately if prefers-reduced-motion = true.

## Acceptance Criteria
- AC1: At `progress=0.0`, reveal length = 0%.
- AC2: At `progress=1.0`, reveal length = 100%.
- AC3: Marker moves along line using turf.along with ±5m accuracy.
- AC4: Performance ≥ 55 fps desktop, ≥ 30 fps mid-tier Android.
- AC5: No content layout shift when pinning section.
- AC6: Reduced-motion shows full trail instantly.

## Data
- Input: `FeatureCollection<LineString>` with ordered coordinates.
- Optional POIs: `FeatureCollection<Point>` with `km_from_start`.

## Non-Functional
- Perf budget: +<60kb gzipped JS.
- SEO: heading visible above fold.
- A11y: ARIA labels, reduced-motion fallback.

## Done When
- Code merged and demo page live.
- All ACs validated.
- Docs and ADRs updated.
