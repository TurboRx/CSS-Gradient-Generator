/**
 * Enhanced CSS Gradient Generator
 * Professional gradient generator with modern features and accessibility
 * @author TurboRx
 * @version 2.1.1
 */

'use strict';

/**
 * Main Gradient Generator Class
 */
class GradientGenerator {
  constructor() {
    this.initializeElements();
    this.initializeState();
    this.initializeEventListeners();
    this.initializePresets();
    this.initializeTheme();
    
    // Load state and generate initial gradient
    this.loadStateFromURL();
    this.generateGradient();
    
    // Welcome toast is owned by toastNotifications.js only (avoid duplicates)
  }

  /**
   * Initialize DOM elements with null checks
   */
  initializeElements() {
    // Core elements
    this.preview = document.getElementById('gradient-preview');
    this.gradientType = document.getElementById('gradientType');
    this.cssCode = document.getElementById('css-code');
    
    // Control containers
    this.linearControls = document.getElementById('linearControls');
    this.radialControls = document.getElementById('radialControls');
    this.conicControls = document.getElementById('conicControls');
    
    // Linear controls
    this.angle = document.getElementById('angle');
    this.angleSlider = document.getElementById('angleSlider');
    
    // Radial controls
    this.radialShape = document.getElementById('radialShape');
    this.radialSize = document.getElementById('radialSize');
    this.radialPosition = document.getElementById('radialPosition');
    
    // Conic controls
    this.conicAngle = document.getElementById('conicAngle');
    this.conicAngleSlider = document.getElementById('conicAngleSlider');
    this.conicPosition = document.getElementById('conicPosition');
    
    // Color stops and actions
    this.colorStops = document.getElementById('colorStops');
    this.addStopBtn = document.getElementById('addStop');
    
    // Action buttons
    this.randomBtn = document.getElementById('randomDesign');
    this.undoBtn = document.getElementById('undoBtn');
    this.redoBtn = document.getElementById('redoBtn');
    this.resetBtn = document.getElementById('resetBtn');
    
    // Export controls
    this.exportFormat = document.getElementById('exportFormat');
    this.copyBtn = document.getElementById('copyCode');
    this.downloadBtn = document.getElementById('downloadCode');
    this.shareBtn = document.getElementById('shareGradient');
    
    // Theme controls
    this.lightModeBtn = document.getElementById('light-mode');
    this.darkModeBtn = document.getElementById('dark-mode');
    
    // Presets container
    this.presetsContainer = document.getElementById('presetGradients');
    
    // Check for required elements
    if (!this.preview || !this.gradientType || !this.colorStops) {
      console.error('Required DOM elements not found');
      this.showError('Failed to initialize. Please refresh the page.');
    }
  }

  // ... rest of file unchanged ...
}

// Initialize the application when DOM is loaded
function initializeGradientGenerator() {
  try {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        window.gradientGenerator = new GradientGenerator();
      });
    } else {
      window.gradientGenerator = new GradientGenerator();
    }
  } catch (error) {
    console.error('Failed to initialize gradient generator:', error);
    alert('Failed to initialize the application. Please refresh the page and try again.');
  }
}

// Initialize the app
initializeGradientGenerator();

// Add CSS animations for slide effects
if (!document.getElementById('gradient-animations')) {
  const style = document.createElement('style');
  style.id = 'gradient-animations';
  style.textContent = `
    @keyframes slideOut {
      from { opacity: 1; transform: translateX(0); }
      to { opacity: 0; transform: translateX(-100%); }
    }
  `;
  document.head.appendChild(style);
}
