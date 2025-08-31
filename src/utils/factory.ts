import { TrailScrubber } from '../core/TrailScrubber';
import { ScrollController } from '../core/ScrollController';
import { TrailScrubConfig } from '../types';

/**
 * Factory function to create a complete trail scrub animation setup
 * Per spec: Easy integration with minimal configuration
 */
export function createTrailScrubber(
  container: string | HTMLElement,
  config: TrailScrubConfig
): { trailScrubber: TrailScrubber; scrollController: ScrollController } {
  
  // Create trail scrubber instance
  const trailScrubber = new TrailScrubber(container, config);
  
  // Create scroll controller
  const scrollController = new ScrollController(trailScrubber);
  
  return { trailScrubber, scrollController };
}

/**
 * Create trail scrubber with default configuration
 */
export function createTrailScrubberWithDefaults(
  container: string | HTMLElement,
  mapboxToken: string
): { trailScrubber: TrailScrubber; scrollController: ScrollController } {
  
  const defaultConfig: TrailScrubConfig = {
    mapboxToken,
    mapStyle: 'mapbox://styles/mapbox/outdoors-v12',
    trailColor: '#ff6b35',
    trailWidth: 4,
    markerColor: '#ff6b35',
    markerSize: 12,
    enableMarker: true,
    reducedMotionFallback: true
  };
  
  return createTrailScrubber(container, defaultConfig);
}
