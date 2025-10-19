/**
 * Enhanced CSS Gradient Generator
 * Professional gradient generator with modern features and accessibility
 * @author TurboRx
 * @version 2.1.0
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
    
    // Show welcome message after a delay (only if toast system available)
    setTimeout(() => {
      if (typeof gradientToasts !== 'undefined') {
        gradientToasts.welcome();
      }
    }, 1000);
  }

  // ... keep existing implementation below ...
}

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

initializeGradientGenerator();

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
