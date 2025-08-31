// Main export file for trail scrub animation feature
// Per spec: Production-ready implementation with all acceptance criteria

export { TrailScrubber } from './core/TrailScrubber';
export { ScrollController } from './core/ScrollController';
export { TrailRenderer } from './core/TrailRenderer';
export { MarkerAnimator } from './core/MarkerAnimator';
export { PerformanceMonitor } from './core/PerformanceMonitor';

// Types
export type {
  TrailData,
  TrailPoint,
  TrailScrubConfig,
  PerformanceMetrics,
  ScrollState
} from './types';

// Utility functions
export { createTrailScrubber, createTrailScrubberWithDefaults } from './utils/factory';
export { loadSampleTrailData } from './utils/sampleData';
