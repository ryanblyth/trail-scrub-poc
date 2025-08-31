// Data contract types as specified in feature spec
export interface TrailPoint {
  type: 'Feature';
  geometry: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
  properties: {
    km_from_start: number;
    [key: string]: any;
  };
}

export interface TrailLine {
  type: 'Feature';
  geometry: {
    type: 'LineString';
    coordinates: [number, number][]; // [longitude, latitude][]
  };
  properties: {
    [key: string]: any;
  };
}

export interface TrailData {
  type: 'FeatureCollection';
  features: TrailLine[];
}

export interface POIData {
  type: 'FeatureCollection';
  features: TrailPoint[];
}

// Animation configuration types
export interface TrailScrubConfig {
  mapboxToken: string;
  mapStyle?: string;
  trailColor?: string;
  trailWidth?: number;
  markerColor?: string;
  markerSize?: number;
  enableMarker?: boolean;
  reducedMotionFallback?: boolean;
}

// Performance monitoring types
export interface PerformanceMetrics {
  fps: number;
  frameTime: number;
  lastUpdate: number;
}

// Scroll state types
export interface ScrollState {
  progress: number; // 0.0 to 1.0
  isPinned: boolean;
  direction: 'up' | 'down' | 'none';
}
