import mapboxgl from 'mapbox-gl';
import { TrailData, TrailPoint, TrailScrubConfig, PerformanceMetrics } from '../types';
import { TrailRenderer } from './TrailRenderer';
import { MarkerAnimator } from './MarkerAnimator';
import { PerformanceMonitor } from './PerformanceMonitor';

/**
 * Main class for trail scrub animation as specified in RFC-0001
 * Manages Mapbox GL JS layers and coordinates with ScrollTrigger
 */
export class TrailScrubber {
  private map: mapboxgl.Map;
  private renderer: TrailRenderer;
  private markerAnimator: MarkerAnimator;
  private performanceMonitor: PerformanceMonitor;
  private config: TrailScrubConfig;
  private trailData: TrailData | null = null;
  private poiData: TrailPoint[] | null = null;
  private currentProgress: number = 0;
  private isReducedMotion: boolean = false;

  constructor(container: string | HTMLElement, config: TrailScrubConfig) {
    this.config = config;
    this.isReducedMotion = this.checkReducedMotion();
    
    // Initialize Mapbox map per RFC-0001 proposal
    this.map = new mapboxgl.Map({
      container: typeof container === 'string' ? container : container,
      style: config.mapStyle || 'mapbox://styles/mapbox/outdoors-v12',
      accessToken: config.mapboxToken,
      center: [-106.5, 37.8], // Default to Colorado area
      zoom: 10,
      preserveDrawingBuffer: true // Required for performance monitoring
    });

    // Initialize components
    this.renderer = new TrailRenderer(this.map, config);
    this.markerAnimator = new MarkerAnimator(this.map, config);
    this.performanceMonitor = new PerformanceMonitor();

    // Handle reduced motion fallback per AC6
    if (this.isReducedMotion && config.reducedMotionFallback !== false) {
      this.setupReducedMotionFallback();
    }

    this.setupMapEvents();
  }

  /**
   * Load trail data and initialize layers
   * Per spec: Input is FeatureCollection<LineString> with ordered coordinates
   */
  async loadTrailData(trailData: TrailData, poiData?: TrailPoint[]): Promise<void> {
    this.trailData = trailData;
    this.poiData = poiData || null;

    // Wait for map to load
    await new Promise<void>((resolve) => {
      if (this.map.loaded()) {
        resolve();
      } else {
        this.map.on('load', () => resolve());
      }
    });

    // Initialize trail layers
    await this.renderer.initializeTrailLayers(trailData);
    
    if (this.poiData && this.config.enableMarker) {
      await this.markerAnimator.initializeMarker(trailData);
    }

    // Fit map to trail bounds
    this.fitMapToTrail();
  }

  /**
   * Update trail reveal progress (0.0 to 1.0)
   * Called by ScrollTrigger onUpdate - throttled for performance per AC4
   */
  updateProgress(progress: number): void {
    console.log('TrailScrubber.updateProgress called:', { progress, timestamp: Date.now() });
    
    // Throttle updates to maintain 55+ fps per AC4
    if (!this.performanceMonitor.shouldUpdate()) {
      console.log('Update throttled by performance monitor');
      return;
    }

    this.currentProgress = Math.max(0, Math.min(1, progress));
    console.log('Current progress updated to:', this.currentProgress);
    
    // Update trail reveal
    this.renderer.updateTrailReveal(this.currentProgress);
    
    // Update marker position if enabled
    if (this.config.enableMarker && this.poiData) {
      this.markerAnimator.updateMarkerPosition(this.currentProgress);
    }

    // Record performance metrics
    this.performanceMonitor.recordFrame();
  }

  /**
   * Get current performance metrics for monitoring
   */
  getPerformanceMetrics(): PerformanceMetrics {
    return this.performanceMonitor.getMetrics();
  }

  /**
   * Clean up resources
   */
  destroy(): void {
    this.renderer.destroy();
    this.markerAnimator.destroy();
    this.map.remove();
  }

  /**
   * Check if user prefers reduced motion per AC6
   */
  private checkReducedMotion(): boolean {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /**
   * Setup reduced motion fallback - show full trail immediately per AC6
   */
  private setupReducedMotionFallback(): void {
    // Override progress updates to always show 100%
    const originalUpdateProgress = this.updateProgress.bind(this);
    this.updateProgress = (_progress: number) => {
      originalUpdateProgress(1.0); // Always show full trail
    };
  }

  /**
   * Setup map event handlers
   */
  private setupMapEvents(): void {
    this.map.on('error', (e) => {
      console.error('Mapbox error:', e);
    });
  }

  /**
   * Fit map view to trail bounds
   */
  private fitMapToTrail(): void {
    if (!this.trailData) return;

    const coordinates = this.trailData.features[0]?.geometry.coordinates;
    if (!coordinates || coordinates.length === 0) return;

    const bounds = new mapboxgl.LngLatBounds();
    coordinates.forEach(coord => {
      bounds.extend(coord as [number, number]);
    });

    this.map.fitBounds(bounds, {
      padding: 50,
      duration: 0 // No animation for reduced motion users
    });
  }

  /**
   * Get current scroll progress
   */
  getCurrentProgress(): number {
    return this.currentProgress;
  }

  /**
   * Check if reduced motion is enabled
   */
  isReducedMotionEnabled(): boolean {
    return this.isReducedMotion;
  }
}
