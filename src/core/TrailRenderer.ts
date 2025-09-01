import mapboxgl from 'mapbox-gl';
import { TrailData, TrailScrubConfig } from '../types';

/**
 * Handles Mapbox line layers for trail reveal animation
 * Per RFC-0001: Two line layers - base (muted) and reveal (scrubbed)
 */
export class TrailRenderer {
  private map: mapboxgl.Map;
  private config: TrailScrubConfig;
  private baseLayerId: string = 'trail-base';
  private revealLayerId: string = 'trail-reveal';
  private sourceId: string = 'trail-source';
  private trailLength: number = 0;

  constructor(map: mapboxgl.Map, config: TrailScrubConfig) {
    this.map = map;
    this.config = config;
  }

  /**
   * Initialize trail layers with base and reveal
   * Uses coordinate indexing for trail reveal animation
   */
  async initializeTrailLayers(trailData: TrailData): Promise<void> {
    // Add trail source
    this.map.addSource(this.sourceId, {
      type: 'geojson',
      data: trailData
    });

    // Add base layer (muted, always visible)
    this.map.addLayer({
      id: this.baseLayerId,
      type: 'line',
      source: this.sourceId,
      paint: {
        'line-color': this.config.trailColor || '#666666',
        'line-width': (this.config.trailWidth || 3) * 0.6,
        'line-opacity': 0.4
      }
    });

    // Add reveal layer (animated, scrubbed)
    this.map.addLayer({
      id: this.revealLayerId,
      type: 'line',
      source: this.sourceId,
      paint: {
        'line-color': this.config.trailColor || '#ff6b35',
        'line-width': this.config.trailWidth || 3,
        'line-opacity': 1,
        'line-dasharray': [0, 1000] // Initially hidden
      }
    });

    // Calculate total trail length for progress calculations
    this.calculateTrailLength(trailData);
  }

  /**
   * Update trail reveal based on scroll progress
   * Per AC1-AC2: At progress=0.0, reveal=0%; at progress=1.0, reveal=100%
   */
  updateTrailReveal(progress: number): void {
    if (!this.map.getLayer(this.revealLayerId)) return;

    // Calculate trail reveal using line-dasharray
    // At progress 0: [0, 1000] (fully hidden)
    // At progress 1: [1000, 0] (fully visible)
    const totalLength = this.trailLength;
    const visibleLength = totalLength * progress;
    const hiddenLength = totalLength - visibleLength;
    
    // Update line-dasharray to control reveal
    this.map.setPaintProperty(this.revealLayerId, 'line-dasharray', [
      visibleLength,
      hiddenLength
    ]);
  }

  /**
   * Calculate total trail length for progress calculations
   */
  private calculateTrailLength(trailData: TrailData): void {
    if (!trailData.features || trailData.features.length === 0) {
      this.trailLength = 0;
      return;
    }

    const coordinates = trailData.features[0].geometry.coordinates;
    if (!coordinates || coordinates.length < 2) {
      this.trailLength = 0;
      return;
    }

    // Calculate approximate length in meters
    let totalLength = 0;
    for (let i = 1; i < coordinates.length; i++) {
      const prev = coordinates[i - 1];
      const curr = coordinates[i];
      
      // Haversine distance calculation
      const lat1 = prev[1] * Math.PI / 180;
      const lat2 = curr[1] * Math.PI / 180;
      const deltaLat = (curr[1] - prev[1]) * Math.PI / 180;
      const deltaLon = (curr[0] - prev[0]) * Math.PI / 180;
      
      const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
                Math.cos(lat1) * Math.cos(lat2) *
                Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      
      totalLength += 6371000 * c; // Earth radius in meters
    }

    this.trailLength = totalLength;
  }

  /**
   * Get current trail length
   */
  getTrailLength(): number {
    return this.trailLength;
  }



  /**
   * Clean up resources
   */
  destroy(): void {
    if (this.map.getLayer(this.revealLayerId)) {
      this.map.removeLayer(this.revealLayerId);
    }
    if (this.map.getLayer(this.baseLayerId)) {
      this.map.removeLayer(this.baseLayerId);
    }
    if (this.map.getSource(this.sourceId)) {
      this.map.removeSource(this.sourceId);
    }
  }

  /**
   * Update trail data source
   */
  updateTrailData(trailData: TrailData): void {
    const source = this.map.getSource(this.sourceId) as mapboxgl.GeoJSONSource;
    if (source) {
      source.setData(trailData);
      this.calculateTrailLength(trailData);
    }
  }
}
