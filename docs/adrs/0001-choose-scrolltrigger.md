# ADR 0001: Choose GSAP ScrollTrigger over Scrollama
- **Status**: Accepted
- **Date**: 2025-08-29
- **Context**: We need scroll-driven scrub control over a Mapbox trail reveal and marker.
- **Decision**: Use GSAP ScrollTrigger with Lenis integration.
- **Consequences**:
  - + Stronger scrub & pin control.
  - + Easy to sync with other animations (charts, text).
  - - Developers need GSAP familiarity.
  - - Consider license for commercial use.
