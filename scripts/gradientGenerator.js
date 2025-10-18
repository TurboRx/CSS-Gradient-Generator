/**
 * Enhanced CSS Gradient Generator
 * Professional gradient generator with modern features and accessibility
 * @author TurboRx
 * @version 2.0.0
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
    this.loadStateFromURL();
    this.generateGradient();
    
    // Initialize theme
    this.initializeTheme();
    
    // Show welcome message
    setTimeout(() => {
      Utils.showToast('Welcome to CSS Gradient Generator 2.0! 🎨', 'success', 3000);
    }, 500);
  }

  /**
   * Initialize DOM elements
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
  }

  /**
   * Initialize application state
   */
  initializeState() {
    this.history = [];
    this.historyIndex = -1;
    this.maxHistorySize = 50;
    this.colorStopCounter = 2;
    this.isGenerating = false;
    
    // Default gradient state
    this.currentGradient = {
      type: 'linear-gradient',
      angle: 45,
      colors: [
        { color: '#ff0000', position: 0 },
        { color: '#0000ff', position: 100 }
      ]
    };
  }

  /**
   * Initialize all event listeners
   */
  initializeEventListeners() {
    // Debounced gradient generation for performance
    this.debouncedGenerate = Utils.debounce(() => this.generateGradient(), 150);
    
    // Gradient type change
    this.gradientType.addEventListener('change', () => {
      this.updateControls();
      this.saveToHistory();
    });
    
    // Linear controls
    if (this.angle && this.angleSlider) {
      this.angle.addEventListener('input', this.debouncedGenerate);
      this.angleSlider.addEventListener('input', (e) => {
        this.angle.value = e.target.value;
        this.debouncedGenerate();
      });
      
      // Sync angle input and slider
      this.angle.addEventListener('input', (e) => {
        this.angleSlider.value = e.target.value;
      });
    }
    
    // Radial controls
    if (this.radialShape) this.radialShape.addEventListener('change', this.debouncedGenerate);
    if (this.radialSize) this.radialSize.addEventListener('change', this.debouncedGenerate);
    if (this.radialPosition) this.radialPosition.addEventListener('input', this.debouncedGenerate);
    
    // Conic controls
    if (this.conicAngle && this.conicAngleSlider) {
      this.conicAngle.addEventListener('input', this.debouncedGenerate);
      this.conicAngleSlider.addEventListener('input', (e) => {
        this.conicAngle.value = e.target.value;
        this.debouncedGenerate();
      });
      
      this.conicAngle.addEventListener('input', (e) => {
        this.conicAngleSlider.value = e.target.value;
      });
    }
    
    if (this.conicPosition) this.conicPosition.addEventListener('input', this.debouncedGenerate);
    
    // Action buttons
    if (this.addStopBtn) this.addStopBtn.addEventListener('click', () => this.addColorStop());
    if (this.randomBtn) this.randomBtn.addEventListener('click', () => this.generateRandomGradient());
    if (this.undoBtn) this.undoBtn.addEventListener('click', () => this.undo());
    if (this.redoBtn) this.redoBtn.addEventListener('click', () => this.redo());
    if (this.resetBtn) this.resetBtn.addEventListener('click', () => this.resetGradient());
    
    // Export controls
    if (this.exportFormat) this.exportFormat.addEventListener('change', () => this.updateExportCode());
    if (this.copyBtn) this.copyBtn.addEventListener('click', () => this.copyCode());
    if (this.downloadBtn) this.downloadBtn.addEventListener('click', () => this.downloadCode());
    if (this.shareBtn) this.shareBtn.addEventListener('click', () => this.shareGradient());
    
    // Theme controls
    if (this.lightModeBtn) this.lightModeBtn.addEventListener('click', () => this.setTheme('light'));
    if (this.darkModeBtn) this.darkModeBtn.addEventListener('click', () => this.setTheme('dark'));
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));
    
    // URL state changes
    window.addEventListener('popstate', () => this.loadStateFromURL());
    
    // Initialize existing color stops
    this.initializeExistingColorStops();
  }

  /**
   * Initialize existing color stops with event listeners
   */
  initializeExistingColorStops() {
    const existingStops = this.colorStops.querySelectorAll('.color-stop');
    existingStops.forEach((stop, index) => {
      this.setupColorStopEvents(stop, index < 2); // First two stops can't be removed
    });
    
    // Update remove button states
    this.updateRemoveButtons();
  }

  /**
   * Initialize gradient presets
   */
  initializePresets() {
    if (this.presetsContainer) {
      this.presetsManager = new GradientPresetsManager();
      this.presetsManager.onPresetSelect = (preset) => this.applyPreset(preset);
      this.presetsManager.renderPresetsUI(this.presetsContainer.parentElement);
    }
  }

  /**
   * Generate gradient and update preview
   */
  generateGradient() {
    if (this.isGenerating) return;
    
    this.isGenerating = true;
    
    try {
      const gradientCSS = this.buildGradientCSS();
      
      // Update preview
      if (this.preview) {
        this.preview.style.backgroundImage = gradientCSS;
        this.preview.setAttribute('aria-label', `Gradient preview: ${gradientCSS}`);
      }
      
      // Update code output
      this.updateExportCode();
      
      // Update URL state
      this.updateURLState();
      
    } catch (error) {
      console.error('Error generating gradient:', error);
      Utils.showToast('Error generating gradient. Please check your inputs.', 'error');
    } finally {
      this.isGenerating = false;
    }
  }

  /**
   * Build CSS gradient string
   * @returns {string} CSS gradient string
   */
  buildGradientCSS() {
    const type = this.gradientType.value;
    let gradient = `${type}(`;
    
    // Add gradient-specific parameters
    if (type.includes('linear')) {
      const angle = this.angle ? this.angle.value : 45;
      gradient += `${angle}deg, `;
    } else if (type.includes('radial')) {
      const shape = this.radialShape ? this.radialShape.value : 'circle';
      const size = this.radialSize ? this.radialSize.value : 'farthest-corner';
      const position = this.radialPosition ? this.radialPosition.value : 'center';
      gradient += `${shape} ${size} at ${position}, `;
    } else if (type.includes('conic')) {
      const angle = this.conicAngle ? this.conicAngle.value : 0;
      const position = this.conicPosition ? this.conicPosition.value : 'center';
      gradient += `from ${angle}deg at ${position}, `;
    }
    
    // Add color stops
    const stops = this.getColorStops();
    const colorStops = stops.map(stop => {
      if (stop.position !== null && stop.position !== '') {
        return `${stop.color} ${stop.position}%`;
      }
      return stop.color;
    });
    
    gradient += colorStops.join(', ') + ')';
    return gradient;
  }

  /**
   * Get current color stops
   * @returns {Array} Array of color stop objects
   */
  getColorStops() {
    const stops = [];
    const stopElements = this.colorStops.querySelectorAll('.color-stop');
    
    stopElements.forEach(stop => {
      const colorInput = stop.querySelector('input[type="color"]');
      const positionInput = stop.querySelector('.stop-position');
      
      if (colorInput) {
        stops.push({
          color: colorInput.value,
          position: positionInput && positionInput.value !== '' ? parseFloat(positionInput.value) : null
        });
      }
    });
    
    return stops;
  }

  /**
   * Update control visibility based on gradient type
   */
  updateControls() {
    const type = this.gradientType.value;
    
    // Hide all control groups first
    if (this.linearControls) this.linearControls.classList.remove('active');
    if (this.radialControls) this.radialControls.classList.remove('active');
    if (this.conicControls) this.conicControls.classList.remove('active');
    
    // Show relevant controls
    if (type.includes('linear') && this.linearControls) {
      this.linearControls.classList.add('active');
    } else if (type.includes('radial') && this.radialControls) {
      this.radialControls.classList.add('active');
    } else if (type.includes('conic') && this.conicControls) {
      this.conicControls.classList.add('active');
    }
    
    // Generate gradient after control update
    this.debouncedGenerate();
  }

  /**
   * Add new color stop
   */
  addColorStop() {
    const stopElement = document.createElement('div');
    stopElement.className = 'color-stop';
    stopElement.setAttribute('data-stop-index', this.colorStopCounter);
    
    const randomColor = Utils.getRandomColor();
    const stopId = Utils.generateId('color-stop');
    
    stopElement.innerHTML = `
      <label class="visually-hidden" for="color-${this.colorStopCounter}">Color ${this.colorStopCounter + 1}</label>
      <input type="color" id="color-${this.colorStopCounter}" value="${randomColor}" aria-label="Color ${this.colorStopCounter + 1}" />
      <label class="visually-hidden" for="position-${this.colorStopCounter}">Position ${this.colorStopCounter + 1}</label>
      <input type="number" id="position-${this.colorStopCounter}" class="stop-position" placeholder="%" min="0" max="100" aria-label="Position ${this.colorStopCounter + 1} (percentage)" />
      <button class="remove-stop btn-icon" type="button" aria-label="Remove color stop ${this.colorStopCounter + 1}">
        <span aria-hidden="true">&times;</span>
      </button>
    `;
    
    this.colorStops.appendChild(stopElement);
    this.setupColorStopEvents(stopElement, false);
    this.updateRemoveButtons();
    this.colorStopCounter++;
    
    // Generate gradient and save to history
    this.debouncedGenerate();
    this.saveToHistory();
    
    // Focus the new color input
    const colorInput = stopElement.querySelector('input[type="color"]');
    if (colorInput) {
      setTimeout(() => Utils.setFocus(colorInput, false), 100);
    }
    
    Utils.showToast('Color stop added', 'success', 2000);
  }

  /**
   * Setup event listeners for a color stop
   * @param {Element} stopElement - Color stop element
   * @param {boolean} isDefault - Whether this is a default stop that can't be removed
   */
  setupColorStopEvents(stopElement, isDefault = false) {
    const colorInput = stopElement.querySelector('input[type="color"]');
    const positionInput = stopElement.querySelector('.stop-position');
    const removeBtn = stopElement.querySelector('.remove-stop');
    
    if (colorInput) {
      colorInput.addEventListener('input', this.debouncedGenerate);
      colorInput.addEventListener('change', () => this.saveToHistory());
    }
    
    if (positionInput) {
      positionInput.addEventListener('input', this.debouncedGenerate);
      positionInput.addEventListener('change', () => this.saveToHistory());
    }
    
    if (removeBtn && !isDefault) {
      removeBtn.addEventListener('click', () => this.removeColorStop(stopElement));
    } else if (removeBtn) {
      removeBtn.disabled = true;
    }
  }

  /**
   * Remove color stop
   * @param {Element} stopElement - Color stop element to remove
   */
  removeColorStop(stopElement) {
    const stops = this.colorStops.querySelectorAll('.color-stop');
    if (stops.length <= 2) {
      Utils.showToast('At least 2 color stops are required', 'warning');
      return;
    }
    
    stopElement.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => {
      if (stopElement.parentNode) {
        stopElement.parentNode.removeChild(stopElement);
        this.updateRemoveButtons();
        this.debouncedGenerate();
        this.saveToHistory();
        Utils.showToast('Color stop removed', 'success', 2000);
      }
    }, 300);
  }

  /**
   * Update remove button states
   */
  updateRemoveButtons() {
    const stops = this.colorStops.querySelectorAll('.color-stop');
    const removeButtons = this.colorStops.querySelectorAll('.remove-stop');
    
    removeButtons.forEach((btn, index) => {
      // First two stops cannot be removed
      btn.disabled = index < 2 || stops.length <= 2;
    });
  }

  /**
   * Generate random gradient
   */
  generateRandomGradient() {
    const types = [
      'linear-gradient', 'radial-gradient', 'conic-gradient',
      'repeating-linear-gradient', 'repeating-radial-gradient', 'repeating-conic-gradient'
    ];
    
    // Random gradient type
    this.gradientType.value = types[Math.floor(Math.random() * types.length)];
    
    // Clear existing color stops
    this.colorStops.innerHTML = '';
    
    // Generate random number of color stops (2-6)
    const numStops = Math.floor(Math.random() * 5) + 2;
    
    for (let i = 0; i < numStops; i++) {
      const color = Utils.getRandomColor();
      const position = i === 0 ? 0 : i === numStops - 1 ? 100 : Math.floor(Math.random() * 101);
      
      const stopElement = document.createElement('div');
      stopElement.className = 'color-stop';
      stopElement.setAttribute('data-stop-index', i);
      
      stopElement.innerHTML = `
        <label class="visually-hidden" for="color-${i}">Color ${i + 1}</label>
        <input type="color" id="color-${i}" value="${color}" aria-label="Color ${i + 1}" />
        <label class="visually-hidden" for="position-${i}">Position ${i + 1}</label>
        <input type="number" id="position-${i}" class="stop-position" value="${position}" min="0" max="100" aria-label="Position ${i + 1} (percentage)" />
        <button class="remove-stop btn-icon" type="button" aria-label="Remove color stop ${i + 1}" ${i < 2 ? 'disabled' : ''}>
          <span aria-hidden="true">&times;</span>
        </button>
      `;
      
      this.colorStops.appendChild(stopElement);
      this.setupColorStopEvents(stopElement, i < 2);
    }
    
    // Random parameters
    if (this.angle) this.angle.value = Math.floor(Math.random() * 361);
    if (this.angleSlider) this.angleSlider.value = this.angle.value;
    
    if (this.radialShape) {
      this.radialShape.value = ['circle', 'ellipse'][Math.floor(Math.random() * 2)];
    }
    if (this.radialSize) {
      const sizes = ['farthest-corner', 'closest-side', 'closest-corner', 'farthest-side', 'contain', 'cover'];
      this.radialSize.value = sizes[Math.floor(Math.random() * sizes.length)];
    }
    if (this.radialPosition) {
      this.radialPosition.value = `${Math.floor(Math.random() * 101)}% ${Math.floor(Math.random() * 101)}%`;
    }
    
    if (this.conicAngle) this.conicAngle.value = Math.floor(Math.random() * 361);
    if (this.conicAngleSlider) this.conicAngleSlider.value = this.conicAngle.value;
    if (this.conicPosition) {
      this.conicPosition.value = `${Math.floor(Math.random() * 101)}% ${Math.floor(Math.random() * 101)}%`;
    }
    
    this.colorStopCounter = numStops;
    this.updateRemoveButtons();
    this.updateControls();
    this.saveToHistory();
    
    Utils.showToast('Random gradient generated! 🎲', 'success');
  }

  /**
   * Apply gradient preset
   * @param {Object} preset - Preset configuration
   */
  applyPreset(preset) {
    // Set gradient type
    this.gradientType.value = preset.type;
    
    // Set parameters based on type
    if (preset.type.includes('linear') && preset.angle !== undefined) {
      if (this.angle) this.angle.value = preset.angle;
      if (this.angleSlider) this.angleSlider.value = preset.angle;
    } else if (preset.type.includes('radial')) {
      if (this.radialShape && preset.shape) this.radialShape.value = preset.shape;
      if (this.radialSize && preset.size) this.radialSize.value = preset.size;
      if (this.radialPosition && preset.position) this.radialPosition.value = preset.position;
    } else if (preset.type.includes('conic')) {
      if (this.conicAngle && preset.angle !== undefined) {
        this.conicAngle.value = preset.angle;
        this.conicAngleSlider.value = preset.angle;
      }
      if (this.conicPosition && preset.position) this.conicPosition.value = preset.position;
    }
    
    // Clear existing stops
    this.colorStops.innerHTML = '';
    
    // Add preset colors
    preset.colors.forEach((colorStop, index) => {
      const stopElement = document.createElement('div');
      stopElement.className = 'color-stop';
      stopElement.setAttribute('data-stop-index', index);
      
      const position = colorStop.position !== undefined ? colorStop.position : '';
      
      stopElement.innerHTML = `
        <label class="visually-hidden" for="color-${index}">Color ${index + 1}</label>
        <input type="color" id="color-${index}" value="${colorStop.color}" aria-label="Color ${index + 1}" />
        <label class="visually-hidden" for="position-${index}">Position ${index + 1}</label>
        <input type="number" id="position-${index}" class="stop-position" value="${position}" min="0" max="100" aria-label="Position ${index + 1} (percentage)" />
        <button class="remove-stop btn-icon" type="button" aria-label="Remove color stop ${index + 1}" ${index < 2 ? 'disabled' : ''}>
          <span aria-hidden="true">&times;</span>
        </button>
      `;
      
      this.colorStops.appendChild(stopElement);
      this.setupColorStopEvents(stopElement, index < 2);
    });
    
    this.colorStopCounter = preset.colors.length;
    this.updateRemoveButtons();
    this.updateControls();
    this.saveToHistory();
  }

  /**
   * Update export code based on selected format
   */
  updateExportCode() {
    if (!this.cssCode || !this.exportFormat) return;
    
    const gradient = this.buildGradientCSS();
    const format = this.exportFormat.value;
    let code = '';
    
    switch (format) {
      case 'css':
        code = `background-image: ${gradient};`;
        break;
      case 'scss':
        code = `$gradient: ${gradient};\nbackground-image: $gradient;`;
        break;
      case 'json':
        const stops = this.getColorStops();
        const jsonData = {
          type: this.gradientType.value,
          colors: stops,
          css: gradient
        };
        if (this.gradientType.value.includes('linear')) {
          jsonData.angle = this.angle ? parseFloat(this.angle.value) : 0;
        }
        code = JSON.stringify(jsonData, null, 2);
        break;
      case 'svg':
        code = this.generateSVG();
        break;
      default:
        code = `background-image: ${gradient};`;
    }
    
    this.cssCode.value = code;
  }

  /**
   * Generate SVG representation of gradient
   * @returns {string} SVG code
   */
  generateSVG() {
    const stops = this.getColorStops();
    const type = this.gradientType.value;
    
    let gradientElement = '';
    
    if (type.includes('linear')) {
      const angle = this.angle ? parseFloat(this.angle.value) : 0;
      // Convert angle to SVG coordinates
      const rad = (angle - 90) * Math.PI / 180;
      const x2 = 50 + 50 * Math.cos(rad);
      const y2 = 50 + 50 * Math.sin(rad);
      const x1 = 100 - x2;
      const y1 = 100 - y2;
      
      gradientElement = `
    <linearGradient id="grad" x1="${x1}%" y1="${y1}%" x2="${x2}%" y2="${y2}%">
${stops.map((stop, index) => {
  const offset = stop.position !== null ? stop.position : (index / (stops.length - 1)) * 100;
  return `      <stop offset="${offset}%" style="stop-color:${stop.color}" />`;
}).join('\n')}
    </linearGradient>`;
    } else {
      // Radial gradient fallback
      gradientElement = `
    <radialGradient id="grad" cx="50%" cy="50%" r="50%">
${stops.map((stop, index) => {
  const offset = stop.position !== null ? stop.position : (index / (stops.length - 1)) * 100;
  return `      <stop offset="${offset}%" style="stop-color:${stop.color}" />`;
}).join('\n')}
    </radialGradient>`;
    }
    
    return `<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
  <defs>${gradientElement}
  </defs>
  <rect width="100%" height="100%" fill="url(#grad)" />
</svg>`;
  }

  /**
   * Copy code to clipboard
   */
  async copyCode() {
    if (!this.cssCode) return;
    
    const success = await Utils.copyToClipboard(this.cssCode.value);
    if (success) {
      Utils.showToast('Code copied to clipboard! 📋', 'success');
      
      // Visual feedback
      const originalText = this.copyBtn.textContent;
      this.copyBtn.textContent = 'Copied!';
      setTimeout(() => {
        this.copyBtn.textContent = originalText;
      }, 2000);
    } else {
      Utils.showToast('Failed to copy code. Please try again.', 'error');
    }
  }

  /**
   * Download code as file
   */
  downloadCode() {
    if (!this.cssCode || !this.exportFormat) return;
    
    const format = this.exportFormat.value;
    const content = this.cssCode.value;
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    
    const extensions = {
      css: 'css',
      scss: 'scss',
      json: 'json',
      svg: 'svg'
    };
    
    const mimeTypes = {
      css: 'text/css',
      scss: 'text/scss',
      json: 'application/json',
      svg: 'image/svg+xml'
    };
    
    const filename = `gradient-${timestamp}.${extensions[format] || 'css'}`;
    const mimeType = mimeTypes[format] || 'text/plain';
    
    Utils.downloadFile(content, filename, mimeType);
    Utils.showToast(`Downloaded as ${filename}`, 'success');
  }

  /**
   * Share gradient via URL
   */
  shareGradient() {
    const url = window.location.href;
    
    if (navigator.share) {
      navigator.share({
        title: 'CSS Gradient Generator - Custom Gradient',
        text: 'Check out this awesome gradient I created!',
        url: url
      }).then(() => {
        Utils.showToast('Gradient shared successfully! 🔗', 'success');
      }).catch(() => {
        this.fallbackShare(url);
      });
    } else {
      this.fallbackShare(url);
    }
  }

  /**
   * Fallback share method
   * @param {string} url - URL to share
   */
  async fallbackShare(url) {
    const success = await Utils.copyToClipboard(url);
    if (success) {
      Utils.showToast('Gradient URL copied to clipboard! Share it with others! 🔗', 'success');
    } else {
      Utils.showToast('Unable to share. Please copy the URL manually.', 'warning');
    }
  }

  /**
   * Save current state to history
   */
  saveToHistory() {
    const state = this.getCurrentState();
    
    // Remove any states after current index
    this.history = this.history.slice(0, this.historyIndex + 1);
    
    // Add new state
    this.history.push(JSON.stringify(state));
    
    // Limit history size
    if (this.history.length > this.maxHistorySize) {
      this.history.shift();
    } else {
      this.historyIndex++;
    }
    
    this.updateHistoryButtons();
  }

  /**
   * Get current application state
   * @returns {Object} Current state object
   */
  getCurrentState() {
    return {
      type: this.gradientType.value,
      angle: this.angle ? parseFloat(this.angle.value) : 0,
      radialShape: this.radialShape ? this.radialShape.value : 'circle',
      radialSize: this.radialSize ? this.radialSize.value : 'farthest-corner',
      radialPosition: this.radialPosition ? this.radialPosition.value : 'center',
      conicAngle: this.conicAngle ? parseFloat(this.conicAngle.value) : 0,
      conicPosition: this.conicPosition ? this.conicPosition.value : 'center',
      colors: this.getColorStops()
    };
  }

  /**
   * Restore state from object
   * @param {Object} state - State object to restore
   */
  restoreState(state) {
    if (!state) return;
    
    // Set gradient type
    if (state.type) this.gradientType.value = state.type;
    
    // Set parameters
    if (this.angle && state.angle !== undefined) {
      this.angle.value = state.angle;
      if (this.angleSlider) this.angleSlider.value = state.angle;
    }
    
    if (this.radialShape && state.radialShape) this.radialShape.value = state.radialShape;
    if (this.radialSize && state.radialSize) this.radialSize.value = state.radialSize;
    if (this.radialPosition && state.radialPosition) this.radialPosition.value = state.radialPosition;
    
    if (this.conicAngle && state.conicAngle !== undefined) {
      this.conicAngle.value = state.conicAngle;
      if (this.conicAngleSlider) this.conicAngleSlider.value = state.conicAngle;
    }
    if (this.conicPosition && state.conicPosition) this.conicPosition.value = state.conicPosition;
    
    // Restore color stops
    if (state.colors) {
      this.colorStops.innerHTML = '';
      state.colors.forEach((colorStop, index) => {
        const stopElement = document.createElement('div');
        stopElement.className = 'color-stop';
        stopElement.setAttribute('data-stop-index', index);
        
        const position = colorStop.position !== null && colorStop.position !== undefined ? colorStop.position : '';
        
        stopElement.innerHTML = `
          <label class="visually-hidden" for="color-${index}">Color ${index + 1}</label>
          <input type="color" id="color-${index}" value="${colorStop.color}" aria-label="Color ${index + 1}" />
          <label class="visually-hidden" for="position-${index}">Position ${index + 1}</label>
          <input type="number" id="position-${index}" class="stop-position" value="${position}" min="0" max="100" aria-label="Position ${index + 1} (percentage)" />
          <button class="remove-stop btn-icon" type="button" aria-label="Remove color stop ${index + 1}" ${index < 2 ? 'disabled' : ''}>
            <span aria-hidden="true">&times;</span>
          </button>
        `;
        
        this.colorStops.appendChild(stopElement);
        this.setupColorStopEvents(stopElement, index < 2);
      });
      
      this.colorStopCounter = state.colors.length;
      this.updateRemoveButtons();
    }
    
    this.updateControls();
  }

  /**
   * Undo last action
   */
  undo() {
    if (this.historyIndex > 0) {
      this.historyIndex--;
      const state = JSON.parse(this.history[this.historyIndex]);
      this.restoreState(state);
      this.updateHistoryButtons();
      Utils.showToast('Undid last action', 'info', 2000);
    }
  }

  /**
   * Redo last undone action
   */
  redo() {
    if (this.historyIndex < this.history.length - 1) {
      this.historyIndex++;
      const state = JSON.parse(this.history[this.historyIndex]);
      this.restoreState(state);
      this.updateHistoryButtons();
      Utils.showToast('Redid last action', 'info', 2000);
    }
  }

  /**
   * Update history button states
   */
  updateHistoryButtons() {
    if (this.undoBtn) {
      this.undoBtn.disabled = this.historyIndex <= 0;
    }
    if (this.redoBtn) {
      this.redoBtn.disabled = this.historyIndex >= this.history.length - 1;
    }
  }

  /**
   * Reset gradient to default state
   */
  resetGradient() {
    if (confirm('Are you sure you want to reset the gradient? This action cannot be undone.')) {
      // Reset to default values
      this.gradientType.value = 'linear-gradient';
      if (this.angle) {
        this.angle.value = 45;
        if (this.angleSlider) this.angleSlider.value = 45;
      }
      
      // Reset radial controls
      if (this.radialShape) this.radialShape.value = 'circle';
      if (this.radialSize) this.radialSize.value = 'farthest-corner';
      if (this.radialPosition) this.radialPosition.value = 'center';
      
      // Reset conic controls
      if (this.conicAngle) {
        this.conicAngle.value = 0;
        if (this.conicAngleSlider) this.conicAngleSlider.value = 0;
      }
      if (this.conicPosition) this.conicPosition.value = 'center';
      
      // Reset color stops
      this.colorStops.innerHTML = `
        <div class="color-stop" data-stop-index="0">
          <label class="visually-hidden" for="color-0">Color 1</label>
          <input type="color" id="color-0" value="#ff0000" aria-label="Color 1" />
          <label class="visually-hidden" for="position-0">Position 1</label>
          <input type="number" id="position-0" class="stop-position" placeholder="%" min="0" max="100" aria-label="Position 1 (percentage)" />
          <button class="remove-stop btn-icon" type="button" aria-label="Remove color stop 1" disabled>
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="color-stop" data-stop-index="1">
          <label class="visually-hidden" for="color-1">Color 2</label>
          <input type="color" id="color-1" value="#0000ff" aria-label="Color 2" />
          <label class="visually-hidden" for="position-1">Position 2</label>
          <input type="number" id="position-1" class="stop-position" placeholder="%" min="0" max="100" aria-label="Position 2 (percentage)" />
          <button class="remove-stop btn-icon" type="button" aria-label="Remove color stop 2" disabled>
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
      `;
      
      this.colorStopCounter = 2;
      this.initializeExistingColorStops();
      this.updateControls();
      this.saveToHistory();
      
      Utils.showToast('Gradient reset to default', 'info');
    }
  }

  /**
   * Handle keyboard shortcuts
   * @param {KeyboardEvent} e - Keyboard event
   */
  handleKeyboardShortcuts(e) {
    // Ctrl/Cmd + C: Copy code
    if ((e.ctrlKey || e.metaKey) && e.key === 'c' && !e.target.matches('input, textarea')) {
      e.preventDefault();
      this.copyCode();
    }
    
    // Ctrl/Cmd + Z: Undo
    if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey && !e.target.matches('input, textarea')) {
      e.preventDefault();
      this.undo();
    }
    
    // Ctrl/Cmd + Shift + Z or Ctrl/Cmd + Y: Redo
    if (((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'z') || ((e.ctrlKey || e.metaKey) && e.key === 'y')) {
      if (!e.target.matches('input, textarea')) {
        e.preventDefault();
        this.redo();
      }
    }
    
    // Ctrl/Cmd + R: Random gradient
    if ((e.ctrlKey || e.metaKey) && e.key === 'r' && !e.target.matches('input, textarea')) {
      e.preventDefault();
      this.generateRandomGradient();
    }
    
    // Escape: Reset focus
    if (e.key === 'Escape') {
      if (document.activeElement) {
        document.activeElement.blur();
      }
    }
  }

  /**
   * Update URL state for sharing and bookmarking
   */
  updateURLState() {
    const state = this.getCurrentState();
    const params = {
      type: state.type,
      colors: state.colors.map(c => `${c.color}${c.position !== null ? `@${c.position}` : ''}`).join(','),
    };
    
    if (state.type.includes('linear')) {
      params.angle = state.angle;
    } else if (state.type.includes('radial')) {
      params.shape = state.radialShape;
      params.size = state.radialSize;
      params.position = state.radialPosition;
    } else if (state.type.includes('conic')) {
      params.angle = state.conicAngle;
      params.position = state.conicPosition;
    }
    
    Utils.updateUrlParams(params, true);
  }

  /**
   * Load state from URL parameters
   */
  loadStateFromURL() {
    const params = Utils.parseUrlParams();
    
    if (Object.keys(params).length === 0) {
      this.saveToHistory(); // Save initial state
      return;
    }
    
    const state = {
      type: params.type || 'linear-gradient',
      angle: parseFloat(params.angle) || 0,
      radialShape: params.shape || 'circle',
      radialSize: params.size || 'farthest-corner',
      radialPosition: params.position || 'center',
      conicAngle: parseFloat(params.angle) || 0,
      conicPosition: params.position || 'center',
      colors: []
    };
    
    // Parse colors
    if (params.colors) {
      const colorStrings = params.colors.split(',');
      state.colors = colorStrings.map(colorStr => {
        const [color, position] = colorStr.split('@');
        return {
          color: color,
          position: position ? parseFloat(position) : null
        };
      });
    } else {
      // Default colors
      state.colors = [
        { color: '#ff0000', position: null },
        { color: '#0000ff', position: null }
      ];
    }
    
    this.restoreState(state);
    this.saveToHistory();
  }

  /**
   * Initialize theme system
   */
  initializeTheme() {
    // Load saved theme or detect system preference
    let savedTheme = localStorage.getItem('gradient-theme');
    
    if (!savedTheme) {
      savedTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    
    this.setTheme(savedTheme);
    
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('gradient-theme')) {
        this.setTheme(e.matches ? 'dark' : 'light');
      }
    });
  }

  /**
   * Set application theme
   * @param {string} theme - Theme name ('light' or 'dark')
   */
  setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    
    // Update button states
    if (this.lightModeBtn && this.darkModeBtn) {
      this.lightModeBtn.setAttribute('aria-pressed', theme === 'light' ? 'true' : 'false');
      this.darkModeBtn.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
    }
    
    // Save preference
    localStorage.setItem('gradient-theme', theme);
    
    // Update body class for backwards compatibility
    document.body.classList.toggle('dark-mode', theme === 'dark');
  }
}

// Initialize the application when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.gradientGenerator = new GradientGenerator();
  });
} else {
  window.gradientGenerator = new GradientGenerator();
}

// Add CSS animations for slide effects
if (!document.getElementById('gradient-animations')) {
  const style = document.createElement('style');
  style.id = 'gradient-animations';
  style.textContent = `
    @keyframes slideOut {
      from {
        opacity: 1;
        transform: translateX(0);
      }
      to {
        opacity: 0;
        transform: translateX(-100%);
      }
    }
  `;
  document.head.appendChild(style);
}