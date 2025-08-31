import mapboxgl from 'mapbox-gl';
import { TrailData, TrailScrubConfig } from '../types';
// @ts-ignore - Turf.js types issue
import along from '@turf/along';
// @ts-ignore - Turf.js types issue
import length from '@turf/length';

/**
 * Handles marker animation along the trail using Turf.js
 * Per AC3: Marker moves along line using turf.along with ±5m accuracy
 */
export class MarkerAnimator {
  private map: mapboxgl.Map;
  private config: TrailScrubConfig;
  private marker: mapboxgl.Marker | null = null;
  private trailLength: number = 0;
  private trailData: TrailData | null = null;
  private isInitialized: boolean = false;

  constructor(map: mapboxgl.Map, config: TrailScrubConfig) {
    this.map = map;
    this.config = config;
  }

  /**
   * Initialize marker for trail animation
   */
  async initializeMarker(trailData: TrailData): Promise<void> {
    this.trailData = trailData;
    
    // Calculate trail length using Turf.js
    this.trailLength = length(trailData, { units: 'meters' });

    // Create marker element
    const markerElement = document.createElement('div');
    markerElement.className = 'trail-marker';
    markerElement.style.cssText = `
      width: ${this.config.markerSize || 12}px;
      height: ${this.config.markerSize || 12}px;
      background-color: ${this.config.markerColor || '#ff6b35'};
      border: 2px solid white;
      border-radius: 50%;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      cursor: pointer;
    `;

    // Add ARIA label for accessibility
    markerElement.setAttribute('aria-label', 'Trail progress marker');
    markerElement.setAttribute('role', 'img');

    // Create Mapbox marker
    this.marker = new mapboxgl.Marker({
      element: markerElement,
      anchor: 'center'
    });

    // Position marker at start of trail
    if (trailData.features && trailData.features.length > 0) {
      const startCoord = trailData.features[0].geometry.coordinates[0];
      this.marker.setLngLat(startCoord).addTo(this.map);
      this.isInitialized = true;
    }
  }

  /**
   * Update marker position based on scroll progress
   * Per AC3: Uses turf.along for accurate positioning
   */
  updateMarkerPosition(progress: number): void {
    if (!this.marker || !this.trailData || !this.isInitialized) return;

    try {
      // Calculate distance along trail
      const distance = this.trailLength * progress;
      
      // Extract the LineString feature from the FeatureCollection
      // along() expects a LineString feature, not a FeatureCollection
      const lineStringFeature = this.trailData.features[0];
      if (!lineStringFeature || lineStringFeature.geometry.type !== 'LineString') {
        console.warn('No valid LineString feature found in trail data');
        return;
      }
      
      // Use Turf.js along() to get precise position
      // Per AC3: ±5m accuracy requirement
      const point = along(lineStringFeature, distance, { units: 'meters' });
      
      if (point && point.geometry && point.geometry.coordinates && point.geometry.coordinates.length >= 2) {
        const [lng, lat] = point.geometry.coordinates;
        this.marker.setLngLat([lng, lat]);
      }
    } catch (error) {
      console.warn('Error updating marker position:', error);
    }
  }

  /**
   * Get current marker position
   */
  getMarkerPosition(): [number, number] | null {
    if (!this.marker) return null;
    const lngLat = this.marker.getLngLat();
    return [lngLat.lng, lngLat.lat];
  }

  /**
   * Show/hide marker
   */
  setMarkerVisible(visible: boolean): void {
    if (this.marker) {
      if (visible) {
        this.marker.addTo(this.map);
      } else {
        this.marker.remove();
      }
    }
  }

  /**
   * Clean up resources
   */
  destroy(): void {
    if (this.marker) {
      this.marker.remove();
      this.marker = null;
    }
  }

  /**
   * Get trail length in meters
   */
  getTrailLength(): number {
    return this.trailLength;
  }
}
