/**
 * Utility functions for the CSS Gradient Generator
 * @author TurboRx
 * @version 2.0.1
 */

'use strict';

/**
 * Utility class for common operations
 */
class Utils {
  /**
   * Debounce function to limit the rate of function execution
   * @param {Function} func - Function to debounce
   * @param {number} wait - Wait time in milliseconds
   * @param {boolean} immediate - Execute immediately on first call
   * @returns {Function} Debounced function
   */
  static debounce(func, wait, immediate = false) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        timeout = null;
        if (!immediate) func.apply(this, args);
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(this, args);
    };
  }

  /**
   * Throttle function to limit function execution rate
   * @param {Function} func - Function to throttle
   * @param {number} limit - Time limit in milliseconds
   * @returns {Function} Throttled function
   */
  static throttle(func, limit) {
    let inThrottle;
    return function executedFunction(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  /**
   * Generate a random hex color
   * @returns {string} Random hex color
   */
  static getRandomColor() {
    return '#' + Math.floor(Math.random() * 0xFFFFFF).toString(16).padStart(6, '0');
  }

  /**
   * Convert hex color to RGB
   * @param {string} hex - Hex color string
   * @returns {Object|null} RGB color object or null if invalid
   */
  static hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  /**
   * Convert RGB to hex color
   * @param {number} r - Red value (0-255)
   * @param {number} g - Green value (0-255)
   * @param {number} b - Blue value (0-255)
   * @returns {string} Hex color string
   */
  static rgbToHex(r, g, b) {
    return '#' + [r, g, b].map(x => {
      const hex = Math.max(0, Math.min(255, Math.floor(x))).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
  }

  /**
   * Calculate luminance of a color
   * @param {string} hex - Hex color string
   * @returns {number} Luminance value (0-1)
   */
  static getLuminance(hex) {
    const rgb = this.hexToRgb(hex);
    if (!rgb) return 0;
    
    const { r, g, b } = rgb;
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  }

  /**
   * Check if a color is light or dark
   * @param {string} hex - Hex color string
   * @returns {boolean} True if light, false if dark
   */
  static isLightColor(hex) {
    return this.getLuminance(hex) > 0.5;
  }

  /**
   * Sanitize HTML to prevent XSS
   * @param {string} str - String to sanitize
   * @returns {string} Sanitized string
   */
  static sanitizeHtml(str) {
    if (typeof str !== 'string') return '';
    const temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
  }

  /**
   * Copy text to clipboard with enhanced browser compatibility
   * @param {string} text - Text to copy
   * @returns {Promise<boolean>} Success status
   */
  static async copyToClipboard(text) {
    try {
      // Modern clipboard API (preferred)
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      } else {
        // Fallback for older browsers or non-secure contexts
        return this.fallbackCopyToClipboard(text);
      }
    } catch (error) {
      console.error('Failed to copy text:', error);
      // Try fallback method
      return this.fallbackCopyToClipboard(text);
    }
  }

  /**
   * Fallback copy method for older browsers
   * @param {string} text - Text to copy
   * @returns {boolean} Success status
   */
  static fallbackCopyToClipboard(text) {
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      
      // Avoid scrolling to bottom
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      textArea.style.opacity = '0';
      textArea.setAttribute('readonly', '');
      textArea.setAttribute('tabindex', '-1');
      
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      textArea.setSelectionRange(0, textArea.value.length);
      
      const result = document.execCommand('copy');
      document.body.removeChild(textArea);
      return result;
    } catch (error) {
      console.error('Fallback copy failed:', error);
      return false;
    }
  }

  /**
   * Download text as file
   * @param {string} content - File content
   * @param {string} filename - File name
   * @param {string} mimeType - MIME type
   */
  static downloadFile(content, filename, mimeType = 'text/plain') {
    try {
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.style.display = 'none';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the URL object
      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 100);
    } catch (error) {
      console.error('Download failed:', error);
      // Fallback: open in new window
      const dataUrl = 'data:' + mimeType + ';charset=utf-8,' + encodeURIComponent(content);
      window.open(dataUrl, '_blank');
    }
  }

  /**
   * Parse URL parameters with enhanced error handling
   * @param {string} url - URL to parse (optional, defaults to current URL)
   * @returns {Object} Parsed parameters
   */
  static parseUrlParams(url = window.location.href) {
    const params = {};
    try {
      const urlObj = new URL(url);
      urlObj.searchParams.forEach((value, key) => {
        // Decode URI components safely
        try {
          params[key] = decodeURIComponent(value);
        } catch (e) {
          params[key] = value; // Use raw value if decoding fails
        }
      });
    } catch (error) {
      console.error('Error parsing URL params:', error);
      // Fallback manual parsing
      try {
        const queryString = url.split('?')[1];
        if (queryString) {
          queryString.split('&').forEach(param => {
            const [key, value] = param.split('=');
            if (key) {
              params[key] = value ? decodeURIComponent(value) : '';
            }
          });
        }
      } catch (e) {
        console.error('Fallback URL parsing failed:', e);
      }
    }
    return params;
  }

  /**
   * Update URL parameters without page reload
   * @param {Object} params - Parameters to update
   * @param {boolean} replace - Replace history state instead of pushing new one
   */
  static updateUrlParams(params, replace = false) {
    try {
      const url = new URL(window.location);
      Object.entries(params).forEach(([key, value]) => {
        if (value === null || value === undefined || value === '') {
          url.searchParams.delete(key);
        } else {
          url.searchParams.set(key, value);
        }
      });
      
      const method = replace ? 'replaceState' : 'pushState';
      if (history && history[method]) {
        history[method]({}, '', url);
      }
    } catch (error) {
      console.error('Error updating URL params:', error);
    }
  }

  /**
   * Format number with proper units
   * @param {number} num - Number to format
   * @param {string} unit - Unit to append
   * @returns {string} Formatted number
   */
  static formatNumber(num, unit = '') {
    if (isNaN(num) || num === null || num === undefined) return '0' + unit;
    return parseFloat(num.toFixed(2)).toString() + unit;
  }

  /**
   * Validate CSS color value
   * @param {string} color - Color value to validate
   * @returns {boolean} True if valid
   */
  static isValidColor(color) {
    if (!color || typeof color !== 'string') return false;
    
    try {
      // Test with a temporary element
      const tempElement = document.createElement('div');
      tempElement.style.color = color;
      return tempElement.style.color !== '';
    } catch (error) {
      return false;
    }
  }

  /**
   * Generate unique ID
   * @param {string} prefix - Prefix for the ID
   * @returns {string} Unique ID
   */
  static generateId(prefix = 'id') {
    return prefix + '_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  /**
   * Check if device has touch support
   * @returns {boolean} True if touch is supported
   */
  static hasTouchSupport() {
    return ('ontouchstart' in window) || 
           (navigator.maxTouchPoints > 0) || 
           (navigator.msMaxTouchPoints > 0);
  }

  /**
   * Get device type based on screen size and touch support
   * @returns {string} Device type (mobile, tablet, desktop)
   */
  static getDeviceType() {
    const width = window.innerWidth || document.documentElement.clientWidth;
    const hasTouch = this.hasTouchSupport();
    
    if (width < 768) return 'mobile';
    if (width < 1024 && hasTouch) return 'tablet';
    return 'desktop';
  }

  /**
   * Animate element with CSS transitions
   * @param {Element} element - Element to animate
   * @param {Object} properties - CSS properties to animate
   * @param {number} duration - Animation duration in milliseconds
   * @returns {Promise} Promise that resolves when animation completes
   */
  static animate(element, properties, duration = 300) {
    return new Promise((resolve, reject) => {
      if (!element) {
        reject(new Error('Element not provided'));
        return;
      }
      
      try {
        const originalTransition = element.style.transition;
        element.style.transition = `all ${duration}ms ease`;
        
        Object.entries(properties).forEach(([prop, value]) => {
          element.style[prop] = value;
        });
        
        setTimeout(() => {
          element.style.transition = originalTransition;
          resolve();
        }, duration);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Wait for a specified amount of time
   * @param {number} ms - Milliseconds to wait
   * @returns {Promise} Promise that resolves after the specified time
   */
  static wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Check if an element is visible in the viewport
   * @param {Element} element - Element to check
   * @param {number} threshold - Visibility threshold (0-1)
   * @returns {boolean} True if element is visible
   */
  static isElementVisible(element, threshold = 0) {
    if (!element) return false;
    
    try {
      const rect = element.getBoundingClientRect();
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;
      const windowWidth = window.innerWidth || document.documentElement.clientWidth;
      
      const visibleHeight = Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
      const visibleWidth = Math.min(rect.right, windowWidth) - Math.max(rect.left, 0);
      const visibleArea = Math.max(0, visibleHeight) * Math.max(0, visibleWidth);
      const totalArea = rect.height * rect.width;
      
      return totalArea === 0 ? false : (visibleArea / totalArea) >= threshold;
    } catch (error) {
      console.error('Error checking element visibility:', error);
      return false;
    }
  }

  /**
   * Create and show a toast notification
   * @param {string} message - Message to show
   * @param {string} type - Toast type (success, error, warning, info)
   * @param {number} duration - Duration in milliseconds
   * @returns {Element|null} Toast element
   */
  static showToast(message, type = 'info', duration = 4000) {
    const container = document.getElementById('toast-container');
    if (!container) {
      console.warn('Toast container not found');
      return null;
    }

    try {
      const toast = document.createElement('div');
      toast.className = `toast ${type}`;
      toast.setAttribute('role', 'alert');
      toast.setAttribute('aria-live', 'assertive');
      
      const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
      };
      
      toast.innerHTML = `
        <div class="toast-icon">${icons[type] || icons.info}</div>
        <div class="toast-content">
          <div class="toast-message">${this.sanitizeHtml(message)}</div>
        </div>
        <button class="toast-close" aria-label="Close notification">&times;</button>
      `;
      
      const closeBtn = toast.querySelector('.toast-close');
      const closeToast = () => {
        try {
          toast.style.animation = 'slideOutRight 0.3s ease';
          setTimeout(() => {
            if (toast.parentNode) {
              toast.parentNode.removeChild(toast);
            }
          }, 300);
        } catch (error) {
          // Fallback: immediate removal
          if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
          }
        }
      };
      
      if (closeBtn) {
        closeBtn.addEventListener('click', closeToast);
      }
      
      container.appendChild(toast);
      
      if (duration > 0) {
        setTimeout(closeToast, duration);
      }
      
      return toast;
    } catch (error) {
      console.error('Error creating toast:', error);
      // Fallback to alert
      alert(type.toUpperCase() + ': ' + message);
      return null;
    }
  }

  /**
   * Show loading overlay
   * @param {string} message - Loading message
   */
  static showLoading(message = 'Processing...') {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
      try {
        const messageElement = overlay.querySelector('p');
        if (messageElement) messageElement.textContent = message;
        overlay.classList.add('active');
        overlay.setAttribute('aria-hidden', 'false');
      } catch (error) {
        console.error('Error showing loading overlay:', error);
      }
    }
  }

  /**
   * Hide loading overlay
   */
  static hideLoading() {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
      try {
        overlay.classList.remove('active');
        overlay.setAttribute('aria-hidden', 'true');
      } catch (error) {
        console.error('Error hiding loading overlay:', error);
      }
    }
  }

  /**
   * Set focus to an element with optional scroll behavior
   * @param {Element|string} element - Element or selector
   * @param {boolean} scroll - Whether to scroll to element
   */
  static setFocus(element, scroll = true) {
    try {
      const el = typeof element === 'string' ? document.querySelector(element) : element;
      if (el && el.focus) {
        if (scroll && el.scrollIntoView) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        el.focus();
      }
    } catch (error) {
      console.error('Error setting focus:', error);
    }
  }

  /**
   * Safely get computed style property
   * @param {Element} element - Element to get style from
   * @param {string} property - CSS property name
   * @returns {string} Property value or empty string
   */
  static getComputedStyle(element, property) {
    try {
      if (!element || !property) return '';
      const styles = window.getComputedStyle(element);
      return styles.getPropertyValue(property) || '';
    } catch (error) {
      console.error('Error getting computed style:', error);
      return '';
    }
  }

  /**
   * Safely add event listener with automatic cleanup
   * @param {Element} element - Element to add listener to
   * @param {string} event - Event name
   * @param {Function} handler - Event handler
   * @param {Object|boolean} options - Event listener options
   * @returns {Function|null} Cleanup function or null
   */
  static addEventListener(element, event, handler, options = false) {
    try {
      if (!element || !event || !handler) return null;
      
      element.addEventListener(event, handler, options);
      
      // Return cleanup function
      return () => {
        try {
          element.removeEventListener(event, handler, options);
        } catch (e) {
          console.error('Error removing event listener:', e);
        }
      };
    } catch (error) {
      console.error('Error adding event listener:', error);
      return null;
    }
  }

  /**
   * Safely parse JSON with error handling
   * @param {string} jsonString - JSON string to parse
   * @param {*} defaultValue - Default value if parsing fails
   * @returns {*} Parsed object or default value
   */
  static safeJsonParse(jsonString, defaultValue = null) {
    try {
      return JSON.parse(jsonString);
    } catch (error) {
      console.error('Error parsing JSON:', error);
      return defaultValue;
    }
  }

  /**
   * Safely stringify object to JSON
   * @param {*} obj - Object to stringify
   * @param {string} defaultValue - Default value if stringifying fails
   * @returns {string} JSON string or default value
   */
  static safeJsonStringify(obj, defaultValue = '{}') {
    try {
      return JSON.stringify(obj);
    } catch (error) {
      console.error('Error stringifying JSON:', error);
      return defaultValue;
    }
  }
}

// Make Utils available globally
window.Utils = Utils;

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Utils;
}

// Enhanced CSS animation keyframes for toast notifications
if (!document.getElementById('toast-animations')) {
  const style = document.createElement('style');
  style.id = 'toast-animations';
  style.textContent = `
    @keyframes slideOutRight {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(100%);
        opacity: 0;
      }
    }
    
    @keyframes slideInRight {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    
    .toast {
      animation: slideInRight 0.3s ease;
    }
  `;
  document.head.appendChild(style);
}