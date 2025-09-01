import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { TrailScrubber } from './TrailScrubber';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

/**
 * Scroll controller integrating GSAP ScrollTrigger with Lenis
 * Per ADR-0001: Use GSAP ScrollTrigger with Lenis integration
 */
export class ScrollController {
  private lenis!: Lenis;
  private trailScrubber: TrailScrubber;
  private scrollTrigger: ScrollTrigger | null = null;
  private isInitialized: boolean = false;

  constructor(trailScrubber: TrailScrubber) {
    this.trailScrubber = trailScrubber;
    this.initializeLenis();
  }

  /**
   * Initialize Lenis smooth scrolling
   */
  private initializeLenis(): void {
    this.lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
    });

    // Set up Lenis as ScrollTrigger proxy
    this.lenis.on('scroll', ScrollTrigger.update);

    // Start Lenis animation loop
    this.raf(0);
  }

  /**
   * Request animation frame loop for Lenis
   */
  private raf(time: number): void {
    this.lenis.raf(time);
    requestAnimationFrame(this.raf.bind(this));
  }

  /**
   * Initialize ScrollTrigger for trail animation
   * Per AC5: No content layout shift when pinning section
   */
  initializeScrollTrigger(pinElement: string | HTMLElement): void {
    if (this.isInitialized) return;

    const element = typeof pinElement === 'string' 
      ? document.querySelector(pinElement) 
      : pinElement;

    if (!element) {
      console.error('Pin element not found');
      return;
    }

    // Create ScrollTrigger for trail animation
    this.scrollTrigger = ScrollTrigger.create({
      trigger: element,
      start: 'top top',
      end: 'bottom top',
      pin: true, // AC5: Pin section to prevent layout shift
      pinSpacing: true,
      onUpdate: (self) => {
        // Per spec: No heavy work inside ScrollTrigger onUpdate
        // Throttle map updates in TrailScrubber.updateProgress()
        this.trailScrubber.updateProgress(self.progress);
      },
      onEnter: () => {
        // Optional: Add visual feedback when entering pinned section
        element.classList.add('trail-section-active');
      },
      onLeave: () => {
        // Optional: Remove visual feedback when leaving pinned section
        element.classList.remove('trail-section-active');
      },
      onEnterBack: () => {
        element.classList.add('trail-section-active');
      },
      onLeaveBack: () => {
        element.classList.remove('trail-section-active');
      }
    });

    this.isInitialized = true;
  }

  /**
   * Get current scroll progress
   */
  getProgress(): number {
    return this.scrollTrigger?.progress || 0;
  }

  /**
   * Check if ScrollTrigger is initialized
   */
  isReady(): boolean {
    return this.isInitialized;
  }

  /**
   * Refresh ScrollTrigger (useful for dynamic content)
   */
  refresh(): void {
    ScrollTrigger.refresh();
  }

  /**
   * Clean up resources
   */
  destroy(): void {
    if (this.scrollTrigger) {
      this.scrollTrigger.kill();
      this.scrollTrigger = null;
    }
    
    if (this.lenis) {
      this.lenis.destroy();
    }
    
    this.isInitialized = false;
  }

  /**
   * Get Lenis instance for external control
   */
  getLenis(): Lenis {
    return this.lenis;
  }

  /**
   * Scroll to specific progress (0.0 to 1.0)
   */
  scrollToProgress(progress: number): void {
    if (!this.scrollTrigger) return;
    
    const targetScroll = this.scrollTrigger.start + 
      (this.scrollTrigger.end - this.scrollTrigger.start) * progress;
    
    this.lenis.scrollTo(targetScroll, {
      duration: 1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
    });
  }
}
