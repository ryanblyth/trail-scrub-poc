// Demo script for Trail Scrub Animation
// Per spec: Demonstrates all acceptance criteria and features

import { createTrailScrubberWithDefaults, loadSampleTrailData } from '../src/index.ts';

// Demo configuration
const DEMO_CONFIG = {
    mapboxToken: 'pk.eyJ1IjoiaW5kZWxpYmUiLCJhIjoiY2xvM2k1Z25jMGZmbjJsbW9iMGV0M293cyJ9.UPel041iNYR3w_gq01-X8g', // Replace with actual token
    enableMarker: true,
    reducedMotionFallback: true
};

// Demo state
let trailScrubber = null;
let scrollController = null;
let isInitialized = false;

// DOM elements
let progressFill = null;
let progressText = null;
let fpsDisplay = null;
let progressDisplay = null;
let markerToggle = null;
let reducedMotionToggle = null;
let resetButton = null;
let jumpToEndButton = null;

/**
 * Initialize the demo
 */
async function initDemo() {
    try {
        console.log('Starting demo initialization...');
        console.log('Mapbox token:', DEMO_CONFIG.mapboxToken ? 'Present' : 'Missing');
        console.log('DOM ready state:', document.readyState);
        console.log('Trail map element exists:', !!document.getElementById('trail-map'));
        console.log('Trail map element:', document.getElementById('trail-map'));
        
        // Check for Mapbox token
        if (!DEMO_CONFIG.mapboxToken || DEMO_CONFIG.mapboxToken.includes('example')) {
            showError('Please provide a valid Mapbox access token in demo.js');
            return;
        }

        // Load sample trail data
        const { trailData, poiData } = loadSampleTrailData();
        
        // Create trail scrubber instance
        const mapElement = document.getElementById('trail-map');
        console.log('Map element for TrailScrubber:', mapElement);
        console.log('Map element dimensions:', {
            offsetWidth: mapElement.offsetWidth,
            offsetHeight: mapElement.offsetHeight,
            clientWidth: mapElement.clientWidth,
            clientHeight: mapElement.clientHeight,
            getBoundingClientRect: mapElement.getBoundingClientRect()
        });
        
        const { trailScrubber: ts, scrollController: sc } = createTrailScrubberWithDefaults(
            mapElement,
            DEMO_CONFIG.mapboxToken
        );
        
        trailScrubber = ts;
        scrollController = sc;
        
        // Load trail data
        await trailScrubber.loadTrailData(trailData, poiData);
        
        // Initialize scroll trigger
        scrollController.initializeScrollTrigger('#trail-animation');
        
        // Setup UI updates
        setupUIUpdates();
        
        // Setup controls
        setupControls();
        
        isInitialized = true;
        
        console.log('Trail Scrub Animation Demo initialized successfully');
        
    } catch (error) {
        console.error('Failed to initialize demo:', error);
        showError('Failed to initialize demo. Check console for details.');
    }
}

/**
 * Setup UI updates for progress and performance metrics
 */
function setupUIUpdates() {
    // Get DOM elements
    progressFill = document.getElementById('progress-fill');
    progressText = document.getElementById('progress-text');
    fpsDisplay = document.getElementById('fps-display');
    progressDisplay = document.getElementById('progress-display');
    
    // Update UI every frame for smooth progress display
    function updateUI() {
        if (!trailScrubber || !isInitialized) return;
        
        // Update progress indicators
        const progress = trailScrubber.getCurrentProgress();
        const progressPercent = Math.round(progress * 100);
        
        if (progressFill) {
            progressFill.style.width = `${progressPercent}%`;
        }
        
        if (progressText) {
            progressText.textContent = `${progressPercent}%`;
        }
        
        if (progressDisplay) {
            progressDisplay.textContent = `${progressPercent}%`;
        }
        
        // Update performance metrics
        const metrics = trailScrubber.getPerformanceMetrics();
        if (fpsDisplay) {
            fpsDisplay.textContent = metrics.fps.toString();
            fpsDisplay.className = `metric-value ${metrics.fps >= 55 ? 'good' : 'warning'}`;
        }
        
        requestAnimationFrame(updateUI);
    }
    
    updateUI();
}

/**
 * Setup demo controls
 */
function setupControls() {
    // Get control elements
    markerToggle = document.getElementById('marker-toggle');
    reducedMotionToggle = document.getElementById('reduced-motion-toggle');
    resetButton = document.getElementById('reset-animation');
    jumpToEndButton = document.getElementById('jump-to-end');
    
    // Marker toggle
    if (markerToggle) {
        markerToggle.addEventListener('change', (e) => {
            if (trailScrubber) {
                // Note: This would require adding a method to show/hide marker
                // For now, we'll just log the action
                console.log('Marker visibility:', e.target.checked);
            }
        });
    }
    
    // Reduced motion toggle
    if (reducedMotionToggle) {
        reducedMotionToggle.addEventListener('change', (e) => {
            if (trailScrubber) {
                // Simulate reduced motion preference
                if (e.target.checked) {
                    trailScrubber.updateProgress(1.0); // Show full trail
                }
            }
        });
    }
    
    // Reset animation
    if (resetButton) {
        resetButton.addEventListener('click', () => {
            if (scrollController) {
                scrollController.scrollToProgress(0);
            }
        });
    }
    
    // Jump to end
    if (jumpToEndButton) {
        jumpToEndButton.addEventListener('click', () => {
            if (scrollController) {
                scrollController.scrollToProgress(1);
            }
        });
    }
}

/**
 * Show error message to user
 */
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #e74c3c;
        color: white;
        padding: 15px 20px;
        border-radius: 6px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 1000;
        font-weight: 500;
    `;
    errorDiv.textContent = message;
    
    document.body.appendChild(errorDiv);
    
    // Remove after 5 seconds
    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.parentNode.removeChild(errorDiv);
        }
    }, 5000);
}

/**
 * Handle window resize
 */
function handleResize() {
    if (trailScrubber && trailScrubber.map) {
        trailScrubber.map.resize();
    }
}

/**
 * Cleanup function
 */
function cleanup() {
    if (trailScrubber) {
        trailScrubber.destroy();
    }
    if (scrollController) {
        scrollController.destroy();
    }
}

// Event listeners
window.addEventListener('resize', handleResize);
window.addEventListener('beforeunload', cleanup);

// Initialize demo when DOM is ready
function waitForDOM() {
    console.log('DOM ready state:', document.readyState);
    console.log('Trail map element exists:', !!document.getElementById('trail-map'));
    
    // Always wait for window load to ensure everything is ready
    window.addEventListener('load', () => {
        console.log('Window load fired');
        console.log('Trail map element after load:', !!document.getElementById('trail-map'));
        initDemo();
    });
}

waitForDOM();

// Export for debugging
window.trailScrubDemo = {
    trailScrubber,
    scrollController,
    reset: () => {
        if (scrollController) {
            scrollController.scrollToProgress(0);
        }
    },
    jumpToEnd: () => {
        if (scrollController) {
            scrollController.scrollToProgress(1);
        }
    }
};
