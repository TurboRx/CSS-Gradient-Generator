/**
 * Gradient Presets Library
 * Collection of popular and beautiful gradient presets
 * @author TurboRx
 * @version 2.0.0
 */

'use strict';

/**
 * Gradient presets organized by category
 */
const GradientPresets = {
  // Popular gradients from UI libraries and design systems
  popular: [
    {
      name: 'Ocean Blue',
      type: 'linear-gradient',
      angle: 135,
      colors: [{ color: '#667eea', position: 0 }, { color: '#764ba2', position: 100 }]
    },
    {
      name: 'Sunset',
      type: 'linear-gradient',
      angle: 90,
      colors: [{ color: '#ff9a9e', position: 0 }, { color: '#fecfef', position: 50 }, { color: '#fecfef', position: 100 }]
    },
    {
      name: 'Purple Bliss',
      type: 'linear-gradient',
      angle: 45,
      colors: [{ color: '#360033', position: 0 }, { color: '#0b8793', position: 100 }]
    },
    {
      name: 'Fire',
      type: 'linear-gradient',
      angle: 180,
      colors: [{ color: '#ff416c', position: 0 }, { color: '#ff4b2b', position: 100 }]
    },
    {
      name: 'Aurora',
      type: 'linear-gradient',
      angle: 225,
      colors: [{ color: '#00c6ff', position: 0 }, { color: '#0072ff', position: 100 }]
    },
    {
      name: 'Emerald',
      type: 'linear-gradient',
      angle: 315,
      colors: [{ color: '#56ab2f', position: 0 }, { color: '#a8e6cf', position: 100 }]
    }
  ],

  // Nature-inspired gradients
  nature: [
    {
      name: 'Forest',
      type: 'linear-gradient',
      angle: 180,
      colors: [{ color: '#134e5e', position: 0 }, { color: '#71b280', position: 100 }]
    },
    {
      name: 'Mountain',
      type: 'linear-gradient',
      angle: 0,
      colors: [{ color: '#8360c3', position: 0 }, { color: '#2ebf91', position: 100 }]
    },
    {
      name: 'Desert',
      type: 'linear-gradient',
      angle: 45,
      colors: [{ color: '#f4d03f', position: 0 }, { color: '#f39c12', position: 100 }]
    },
    {
      name: 'Ocean Deep',
      type: 'linear-gradient',
      angle: 270,
      colors: [{ color: '#2980b9', position: 0 }, { color: '#6dd5fa', position: 50 }, { color: '#ffffff', position: 100 }]
    }
  ],

  // Modern UI gradients
  modern: [
    {
      name: 'Instagram',
      type: 'linear-gradient',
      angle: 45,
      colors: [{ color: '#833ab4', position: 0 }, { color: '#fd1d1d', position: 50 }, { color: '#fcb045', position: 100 }]
    },
    {
      name: 'Spotify',
      type: 'linear-gradient',
      angle: 135,
      colors: [{ color: '#1ed760', position: 0 }, { color: '#191414', position: 100 }]
    },
    {
      name: 'Netflix',
      type: 'linear-gradient',
      angle: 90,
      colors: [{ color: '#8b0000', position: 0 }, { color: '#000000', position: 100 }]
    },
    {
      name: 'Discord',
      type: 'linear-gradient',
      angle: 180,
      colors: [{ color: '#7289da', position: 0 }, { color: '#424549', position: 100 }]
    }
  ],

  // Pastel gradients
  pastel: [
    {
      name: 'Cotton Candy',
      type: 'linear-gradient',
      angle: 135,
      colors: [{ color: '#ffecd2', position: 0 }, { color: '#fcb69f', position: 100 }]
    },
    {
      name: 'Lavender',
      type: 'linear-gradient',
      angle: 225,
      colors: [{ color: '#e8cbc0', position: 0 }, { color: '#636fa4', position: 100 }]
    },
    {
      name: 'Mint',
      type: 'linear-gradient',
      angle: 45,
      colors: [{ color: '#c1dfc4', position: 0 }, { color: '#deecdd', position: 100 }]
    },
    {
      name: 'Peach',
      type: 'linear-gradient',
      angle: 315,
      colors: [{ color: '#ffeaa7', position: 0 }, { color: '#fab1a0', position: 100 }]
    }
  ],

  // Dark mode gradients
  dark: [
    {
      name: 'Dark Steel',
      type: 'linear-gradient',
      angle: 180,
      colors: [{ color: '#2c3e50', position: 0 }, { color: '#000000', position: 100 }]
    },
    {
      name: 'Purple Dark',
      type: 'linear-gradient',
      angle: 135,
      colors: [{ color: '#2d1b69', position: 0 }, { color: '#11998e', position: 100 }]
    },
    {
      name: 'Carbon',
      type: 'linear-gradient',
      angle: 45,
      colors: [{ color: '#434343', position: 0 }, { color: '#000000', position: 100 }]
    },
    {
      name: 'Deep Purple',
      type: 'linear-gradient',
      angle: 270,
      colors: [{ color: '#1a1a2e', position: 0 }, { color: '#16213e', position: 50 }, { color: '#0f3460', position: 100 }]
    }
  ],

  // Radial gradients
  radial: [
    {
      name: 'Radial Burst',
      type: 'radial-gradient',
      shape: 'circle',
      size: 'farthest-corner',
      position: 'center',
      colors: [{ color: '#ff0080', position: 0 }, { color: '#ff8c00', position: 50 }, { color: '#40e0d0', position: 100 }]
    },
    {
      name: 'Spotlight',
      type: 'radial-gradient',
      shape: 'ellipse',
      size: 'closest-side',
      position: 'center',
      colors: [{ color: '#ffffff', position: 0 }, { color: '#000000', position: 100 }]
    },
    {
      name: 'Glow',
      type: 'radial-gradient',
      shape: 'circle',
      size: 'cover',
      position: 'center',
      colors: [{ color: '#ffd700', position: 0 }, { color: '#ff6347', position: 50 }, { color: '#8b008b', position: 100 }]
    }
  ],

  // Conic gradients
  conic: [
    {
      name: 'Rainbow Wheel',
      type: 'conic-gradient',
      angle: 0,
      position: 'center',
      colors: [
        { color: '#ff0000', position: 0 },
        { color: '#ff8000', position: 15 },
        { color: '#ffff00', position: 30 },
        { color: '#80ff00', position: 45 },
        { color: '#00ff00', position: 60 },
        { color: '#00ff80', position: 75 },
        { color: '#00ffff', position: 90 },
        { color: '#0080ff', position: 105 },
        { color: '#0000ff', position: 120 },
        { color: '#8000ff', position: 135 },
        { color: '#ff00ff', position: 150 },
        { color: '#ff0080', position: 165 },
        { color: '#ff0000', position: 180 }
      ]
    },
    {
      name: 'Pie Chart',
      type: 'conic-gradient',
      angle: 0,
      position: 'center',
      colors: [
        { color: '#ff6b6b', position: 0 },
        { color: '#4ecdc4', position: 25 },
        { color: '#45b7d1', position: 50 },
        { color: '#96ceb4', position: 75 },
        { color: '#feca57', position: 100 }
      ]
    },
    {
      name: 'Sunrise Conic',
      type: 'conic-gradient',
      angle: 90,
      position: 'center',
      colors: [
        { color: '#ff9a9e', position: 0 },
        { color: '#fecfef', position: 25 },
        { color: '#fecfef', position: 50 },
        { color: '#ff9a9e', position: 75 },
        { color: '#ff9a9e', position: 100 }
      ]
    }
  ]
};

/**
 * Gradient Presets Manager Class
 */
class GradientPresetsManager {
  constructor() {
    this.presets = GradientPresets;
    this.currentCategory = 'popular';
    this.onPresetSelect = null;
  }

  /**
   * Get all categories
   * @returns {Array} Array of category names
   */
  getCategories() {
    return Object.keys(this.presets);
  }

  /**
   * Get presets for a specific category
   * @param {string} category - Category name
   * @returns {Array} Array of presets
   */
  getPresetsForCategory(category) {
    return this.presets[category] || [];
  }

  /**
   * Get all presets
   * @returns {Array} Array of all presets
   */
  getAllPresets() {
    const allPresets = [];
    Object.values(this.presets).forEach(categoryPresets => {
      allPresets.push(...categoryPresets);
    });
    return allPresets;
  }

  /**
   * Search presets by name
   * @param {string} query - Search query
   * @returns {Array} Array of matching presets
   */
  searchPresets(query) {
    const allPresets = this.getAllPresets();
    return allPresets.filter(preset => 
      preset.name.toLowerCase().includes(query.toLowerCase())
    );
  }

  /**
   * Convert preset to CSS string
   * @param {Object} preset - Preset object
   * @returns {string} CSS gradient string
   */
  presetToCss(preset) {
    const { type, colors } = preset;
    let cssString = `${type}(`;

    if (type.includes('linear')) {
      cssString += `${preset.angle || 0}deg, `;
    } else if (type.includes('radial')) {
      const shape = preset.shape || 'circle';
      const size = preset.size || 'farthest-corner';
      const position = preset.position || 'center';
      cssString += `${shape} ${size} at ${position}, `;
    } else if (type.includes('conic')) {
      const angle = preset.angle || 0;
      const position = preset.position || 'center';
      cssString += `from ${angle}deg at ${position}, `;
    }

    const colorStops = colors.map(stop => {
      if (stop.position !== undefined) {
        return `${stop.color} ${stop.position}%`;
      }
      return stop.color;
    });

    cssString += colorStops.join(', ') + ')';
    return cssString;
  }

  /**
   * Generate CSS for preset preview
   * @param {Object} preset - Preset object
   * @returns {string} CSS background-image property
   */
  getPresetPreviewCSS(preset) {
    return `background-image: ${this.presetToCss(preset)};`;
  }

  /**
   * Render preset grid for a category
   * @param {string} category - Category name
   * @param {Element} container - Container element
   */
  renderPresetGrid(category, container) {
    const presets = this.getPresetsForCategory(category);
    container.innerHTML = '';

    presets.forEach((preset, index) => {
      const presetElement = document.createElement('button');
      presetElement.className = 'preset-item';
      presetElement.setAttribute('type', 'button');
      presetElement.setAttribute('aria-label', `Apply ${preset.name} gradient`);
      presetElement.setAttribute('data-preset-index', index);
      presetElement.setAttribute('data-category', category);
      presetElement.style.cssText = this.getPresetPreviewCSS(preset);
      presetElement.title = preset.name;

      // Add click handler
      presetElement.addEventListener('click', () => {
        if (this.onPresetSelect) {
          this.onPresetSelect(preset);
        }
        Utils.showToast(`Applied ${preset.name} gradient`, 'success');
      });

      // Add keyboard support
      presetElement.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          presetElement.click();
        }
      });

      container.appendChild(presetElement);
    });
  }

  /**
   * Render category tabs and preset grid
   * @param {Element} container - Main container element
   */
  renderPresetsUI(container) {
    const categories = this.getCategories();
    
    // Create tabs container
    const tabsContainer = document.createElement('div');
    tabsContainer.className = 'preset-tabs';
    tabsContainer.setAttribute('role', 'tablist');
    
    // Create grid container
    const gridContainer = document.createElement('div');
    gridContainer.className = 'preset-grid';
    gridContainer.setAttribute('role', 'tabpanel');
    
    // Create tabs
    categories.forEach((category, index) => {
      const tab = document.createElement('button');
      tab.className = 'preset-tab';
      tab.setAttribute('type', 'button');
      tab.setAttribute('role', 'tab');
      tab.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
      tab.setAttribute('data-category', category);
      tab.textContent = category.charAt(0).toUpperCase() + category.slice(1);
      
      if (index === 0) {
        tab.classList.add('active');
      }
      
      tab.addEventListener('click', () => {
        // Update active tab
        tabsContainer.querySelectorAll('.preset-tab').forEach(t => {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');
        
        // Update grid
        this.currentCategory = category;
        this.renderPresetGrid(category, gridContainer);
      });
      
      tabsContainer.appendChild(tab);
    });
    
    // Initial render
    this.renderPresetGrid(this.currentCategory, gridContainer);
    
    // Clear container and add new elements
    container.innerHTML = '';
    container.appendChild(tabsContainer);
    container.appendChild(gridContainer);
  }

  /**
   * Add custom preset
   * @param {string} category - Category name
   * @param {Object} preset - Preset object
   */
  addCustomPreset(category, preset) {
    if (!this.presets[category]) {
      this.presets[category] = [];
    }
    this.presets[category].push(preset);
  }

  /**
   * Save presets to localStorage
   */
  saveToStorage() {
    try {
      localStorage.setItem('gradient-presets', JSON.stringify(this.presets));
    } catch (error) {
      console.error('Failed to save presets to storage:', error);
    }
  }

  /**
   * Load presets from localStorage
   */
  loadFromStorage() {
    try {
      const saved = localStorage.getItem('gradient-presets');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Merge with default presets
        Object.keys(parsed).forEach(category => {
          if (this.presets[category]) {
            this.presets[category] = [...this.presets[category], ...parsed[category]];
          } else {
            this.presets[category] = parsed[category];
          }
        });
      }
    } catch (error) {
      console.error('Failed to load presets from storage:', error);
    }
  }
}

// Make GradientPresetsManager available globally
window.GradientPresetsManager = GradientPresetsManager;
window.GradientPresets = GradientPresets;

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { GradientPresetsManager, GradientPresets };
}

// Add CSS for preset tabs
if (!document.getElementById('preset-tabs-styles')) {
  const style = document.createElement('style');
  style.id = 'preset-tabs-styles';
  style.textContent = `
    .preset-tabs {
      display: flex;
      flex-wrap: wrap;
      gap: var(--spacing-xs, 0.25rem);
      margin-bottom: var(--spacing-md, 1rem);
      border-bottom: 2px solid var(--border-color, #dee2e6);
    }
    
    .preset-tab {
      padding: var(--spacing-sm, 0.5rem) var(--spacing-md, 1rem);
      border: none;
      background: transparent;
      color: var(--text-secondary, #6c757d);
      font-weight: 500;
      cursor: pointer;
      border-bottom: 2px solid transparent;
      transition: all var(--transition-fast, 0.15s ease);
      text-transform: capitalize;
    }
    
    .preset-tab:hover {
      color: var(--accent-primary, #007bff);
      background: var(--bg-tertiary, #f8f9fa);
    }
    
    .preset-tab.active {
      color: var(--accent-primary, #007bff);
      border-bottom-color: var(--accent-primary, #007bff);
    }
    
    .preset-tab:focus {
      outline: 2px solid var(--accent-primary, #007bff);
      outline-offset: 2px;
    }
  `;
  document.head.appendChild(style);
}