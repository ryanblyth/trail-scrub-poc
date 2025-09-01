import { PerformanceMetrics } from '../types';

/**
 * Performance monitoring for trail scrub animation
 * Per AC4: Performance ≥ 55 fps desktop, ≥ 30 fps mid-tier Android
 */
export class PerformanceMonitor {
  private frameCount: number = 0;
  private lastTime: number = performance.now();
  private fps: number = 60;
  private frameTime: number = 16.67; // Target 60fps
  private lastUpdate: number = 0;
  private isMobile: boolean = false;

  constructor() {
    this.detectDevice();
    this.startMonitoring();
  }

  /**
   * Detect if running on mobile device
   */
  private detectDevice(): void {
    this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  /**
   * Start performance monitoring
   */
  private startMonitoring(): void {
    // Monitor FPS every second
    setInterval(() => {
      this.calculateFPS();
    }, 1000);
  }

  /**
   * Calculate current FPS
   */
  private calculateFPS(): void {
    const currentTime = performance.now();
    const deltaTime = currentTime - this.lastTime;
    
    if (deltaTime > 0) {
      this.fps = Math.round((this.frameCount * 1000) / deltaTime);
      this.frameTime = deltaTime / this.frameCount;
    }
    
    this.frameCount = 0;
    this.lastTime = currentTime;
  }

  /**
   * Record a frame update
   */
  recordFrame(): void {
    this.frameCount++;
    this.lastUpdate = performance.now();
  }

  /**
   * Check if we should update based on performance budget
   * Per AC4: Throttle updates to maintain target FPS
   */
  shouldUpdate(): boolean {
    // Temporarily disable throttling for progress bar debugging
    return true;
    
    // Original throttling logic:
    // const currentTime = performance.now();
    // const timeSinceLastUpdate = currentTime - this.lastUpdate;
    // 
    // // Use different thresholds for mobile vs desktop
    // const targetInterval = this.isMobile ? 33 : 16; // 30fps mobile, 60fps desktop
    // 
    // return timeSinceLastUpdate >= targetInterval;
  }

  /**
   * Get current performance metrics
   */
  getMetrics(): PerformanceMetrics {
    return {
      fps: this.fps,
      frameTime: this.frameTime,
      lastUpdate: this.lastUpdate
    };
  }

  /**
   * Check if performance meets targets
   */
  isMeetingTargets(): boolean {
    if (this.isMobile) {
      return this.fps >= 30; // AC4: ≥ 30 fps mid-tier Android
    } else {
      return this.fps >= 55; // AC4: ≥ 55 fps desktop
    }
  }

  /**
   * Get performance status message
   */
  getStatusMessage(): string {
    const target = this.isMobile ? '30' : '55';
    const status = this.isMeetingTargets() ? '✅' : '⚠️';
    return `${status} ${this.fps} FPS (target: ${target}+)`;
  }

  /**
   * Reset performance counters
   */
  reset(): void {
    this.frameCount = 0;
    this.lastTime = performance.now();
    this.fps = 60;
    this.frameTime = 16.67;
    this.lastUpdate = 0;
  }
}
