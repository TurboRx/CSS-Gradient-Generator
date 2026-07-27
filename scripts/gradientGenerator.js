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
    this.initializeHamburgerMenu();
    
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
    this.reverseBtn = document.getElementById('reverseColors');
    this.resetBtn = document.getElementById('resetBtn');
    
    // Export controls
    this.exportFormat = document.getElementById('exportFormat');
    this.copyBtn = document.getElementById('copyCode');
    this.downloadBtn = document.getElementById('downloadCode');
    this.shareBtn = document.getElementById('shareGradient');
    
    // Theme controls
    this.themeSelect = document.getElementById('theme-select');
    
    // Presets container
    this.presetsContainer = document.getElementById('presetGradients');
    
    // Check for required elements
    if (!this.preview || !this.gradientType || !this.colorStops) {
      console.error('Required DOM elements not found');
      this.showError('Failed to initialize. Please refresh the page.');
    }
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
    this.initialized = false;
    
    // Default gradient state
    this.currentGradient = {
      type: 'linear-gradient',
      angle: 45,
      colors: [
        { color: '#ff0000', position: null },
        { color: '#0000ff', position: null }
      ]
    };
  }

  /**
   * Initialize all event listeners with error handling
   */
  initializeEventListeners() {
    try {
      // Create debounced generate function with Utils check
      this.debouncedGenerate = this.createDebouncedGenerate();
      
      // Gradient type change
      if (this.gradientType) {
        this.gradientType.addEventListener('change', () => {
          this.updateControls();
          this.saveToHistory();
        });
      }
      
      // Linear controls - NO TOASTS for routine control changes
      if (this.angle && this.angleSlider) {
        this.angle.addEventListener('input', (e) => {
          this.angleSlider.value = e.target.value;
          this.debouncedGenerate();
        });
        
        this.angleSlider.addEventListener('input', (e) => {
          this.angle.value = e.target.value;
          this.debouncedGenerate();
        });
        
        // Add change events for history
        this.angle.addEventListener('change', () => this.saveToHistory());
        this.angleSlider.addEventListener('change', () => this.saveToHistory());
      }
      
      // Radial controls - NO TOASTS for routine control changes
      if (this.radialShape) {
        this.radialShape.addEventListener('change', () => {
          this.debouncedGenerate();
          this.saveToHistory();
        });
      }
      if (this.radialSize) {
        this.radialSize.addEventListener('change', () => {
          this.debouncedGenerate();
          this.saveToHistory();
        });
      }
      if (this.radialPosition) {
        this.radialPosition.addEventListener('input', this.debouncedGenerate);
        this.radialPosition.addEventListener('change', () => this.saveToHistory());
      }
      
      // Conic controls - NO TOASTS for routine control changes
      if (this.conicAngle && this.conicAngleSlider) {
        this.conicAngle.addEventListener('input', (e) => {
          this.conicAngleSlider.value = e.target.value;
          this.debouncedGenerate();
        });
        
        this.conicAngleSlider.addEventListener('input', (e) => {
          this.conicAngle.value = e.target.value;
          this.debouncedGenerate();
        });
        
        this.conicAngle.addEventListener('change', () => this.saveToHistory());
        this.conicAngleSlider.addEventListener('change', () => this.saveToHistory());
      }
      
      if (this.conicPosition) {
        this.conicPosition.addEventListener('input', this.debouncedGenerate);
        this.conicPosition.addEventListener('change', () => this.saveToHistory());
      }
      
      // Action buttons
      if (this.addStopBtn) this.addStopBtn.addEventListener('click', () => this.addColorStop());
      // NO TOAST for Random Design as per requirements
      if (this.randomBtn) this.randomBtn.addEventListener('click', () => this.generateRandomGradient());
      if (this.undoBtn) this.undoBtn.addEventListener('click', () => this.undo());
      if (this.redoBtn) this.redoBtn.addEventListener('click', () => this.redo());
      if (this.reverseBtn) this.reverseBtn.addEventListener('click', () => this.reverseColors());
      if (this.resetBtn) this.resetBtn.addEventListener('click', () => this.resetGradient());
      
      // Export controls
      if (this.exportFormat) this.exportFormat.addEventListener('change', () => this.updateExportCode());
      if (this.copyBtn) this.copyBtn.addEventListener('click', () => this.copyCode());
      if (this.downloadBtn) this.downloadBtn.addEventListener('click', () => this.downloadCode());
      if (this.shareBtn) this.shareBtn.addEventListener('click', () => this.shareGradient());
      
      
      // Keyboard shortcuts
      document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));
      
      // URL state changes
      window.addEventListener('popstate', () => this.loadStateFromURL());
      
      // Initialize existing color stops
      this.initializeExistingColorStops();
      
      this.initialized = true;
    } catch (error) {
      console.error('Error initializing event listeners:', error);
      this.showError('Failed to initialize controls. Some features may not work.');
    }
  }
  
  /**
   * Create debounced generate function with fallback
   */
  createDebouncedGenerate() {
    if (typeof Utils !== 'undefined' && Utils.debounce) {
      return Utils.debounce(() => this.generateGradient(), 150);
    } else {
      // Fallback debounce implementation
      let timeout;
      return () => {
        clearTimeout(timeout);
        timeout = setTimeout(() => this.generateGradient(), 150);
      };
    }
  }

  /**
   * Initialize existing color stops with event listeners
   */
  initializeExistingColorStops() {
    if (!this.colorStops) return;
    
    const existingStops = this.colorStops.querySelectorAll('.color-stop');
    existingStops.forEach((stop, index) => {
      this.setupColorStopEvents(stop, index < 2); // First two stops can't be removed
    });
    
    // Update remove button states
    this.updateRemoveButtons();
  }

  /**
   * Initialize gradient presets with error handling
   */
  initializePresets() {
    try {
      if (this.presetsContainer && typeof GradientPresetsManager !== 'undefined') {
        this.presetsManager = new GradientPresetsManager();
        this.presetsManager.onPresetSelect = (preset) => this.applyPreset(preset);
        this.presetsManager.renderPresetsUI(this.presetsContainer.parentElement);
      }
    } catch (error) {
      console.error('Error initializing presets:', error);
      // Hide presets section if it fails
      if (this.presetsContainer && this.presetsContainer.parentElement) {
        this.presetsContainer.parentElement.style.display = 'none';
      }
    }
  }

  /**
   * Generate gradient and update preview with comprehensive error handling
   */
  generateGradient() {
    if (this.isGenerating || !this.initialized) return;
    
    this.isGenerating = true;
    
    try {
      const gradientCSS = this.buildGradientCSS();
      
      if (!gradientCSS) {
        throw new Error('Failed to build gradient CSS');
      }
      
      // Update preview
      if (this.preview) {
        this.preview.style.backgroundImage = gradientCSS;
        this.preview.setAttribute('aria-label', `Gradient preview: ${gradientCSS.substring(0, 100)}...`);
      }
      
      // Update code output
      this.updateExportCode();
      
      // Update URL state (only if not loading from URL)
      if (this.initialized) {
        this.updateURLState();
      }
      
    } catch (error) {
      console.error('Error generating gradient:', error);
      this.showError('Error generating gradient. Please check your color values and try again.');
    } finally {
      this.isGenerating = false;
    }
  }

  /**
   * Build CSS gradient string with better error handling
   * @returns {string} CSS gradient string
   */
  buildGradientCSS() {
    try {
      const type = this.gradientType ? this.gradientType.value : 'linear-gradient';
      let gradient = `${type}(`;
      
      // Add gradient-specific parameters
      if (type.includes('linear')) {
        const angle = this.angle ? parseFloat(this.angle.value) || 0 : 45;
        gradient += `${angle}deg, `;
      } else if (type.includes('radial')) {
        const shape = this.radialShape ? this.radialShape.value : 'circle';
        const size = this.radialSize ? this.radialSize.value : 'farthest-corner';
        const position = this.radialPosition ? this.radialPosition.value || 'center' : 'center';
        gradient += `${shape} ${size} at ${position}, `;
      } else if (type.includes('conic')) {
        const angle = this.conicAngle ? parseFloat(this.conicAngle.value) || 0 : 0;
        const position = this.conicPosition ? this.conicPosition.value || 'center' : 'center';
        gradient += `from ${angle}deg at ${position}, `;
      }
      
      // Add color stops
      const stops = this.getColorStops();
      if (stops.length === 0) {
        // Fallback colors if no stops found
        gradient += '#ff0000, #0000ff';
      } else {
        const colorStops = stops.map(stop => {
          if (stop.position !== null && stop.position !== '' && !isNaN(stop.position)) {
            return `${stop.color} ${Math.max(0, Math.min(100, stop.position))}%`;
          }
          return stop.color;
        });
        gradient += colorStops.join(', ');
      }
      
      gradient += ')';
      return gradient;
    } catch (error) {
      console.error('Error building gradient CSS:', error);
      return 'linear-gradient(45deg, #ff0000, #0000ff)'; // Safe fallback
    }
  }

  /**
   * Validate and normalize color stops
   * @param {Array} stops - Array of color stop objects
   * @returns {Array} Validated array of color stop objects
   */
  validateColorStops(stops) {
    if (!Array.isArray(stops)) return [];
    const adjusted = stops.map(s => ({
      color: (s && s.color) || '#000000',
      position: (s && typeof s.position === 'number') ? Math.max(0, Math.min(100, s.position)) : null
    }));
    for (let i = 1; i < adjusted.length; i++) {
      if (adjusted[i].position !== null && adjusted[i-1].position !== null) {
        if (adjusted[i].position < adjusted[i-1].position) {
          adjusted[i].position = Math.min(100, adjusted[i-1].position);
        }
      }
    }
    return adjusted;
  }

  /**
   * Get current color stops with validation
   * @returns {Array} Array of color stop objects
   */
  getColorStops() {
    const stops = [];
    if (!this.colorStops) return stops;
    
    const stopElements = this.colorStops.querySelectorAll('.color-stop');
    
    stopElements.forEach(stop => {
      const colorInput = stop.querySelector('input[type="color"]');
      const positionInput = stop.querySelector('.stop-position');
      
      if (colorInput) {
        const color = colorInput.value;
        const position = positionInput && positionInput.value !== '' ? parseFloat(positionInput.value) : null;
        stops.push({ color, position });
      }
    });

    const filtered = stops.filter(s => s.color && s.color.match(/^#([0-9A-Fa-f]{3,4}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/));
    const limited = filtered.slice(0, 10);
    const validated = this.validateColorStops(limited);

    if (validated.length < 2) {
      return this.validateColorStops([
        { color: '#ff0000', position: null },
        { color: '#0000ff', position: null }
      ]);
    }

    return validated;
  }

  /**
   * Update control visibility based on gradient type
   */
  updateControls() {
    if (!this.gradientType) return;
    
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
   * Add new color stop with better error handling
   * NO TOAST for Add Color Stop as per requirements
   */
  addColorStop() {
    try {
      if (!this.colorStops) return;

      const stopCount = this.colorStops.querySelectorAll('.color-stop').length;
      if (stopCount >= 10) {
        this.showWarning('Maximum 10 color stops allowed for performance.');
        return;
      }
      
      const stopElement = document.createElement('div');
      stopElement.className = 'color-stop';
      stopElement.setAttribute('data-stop-index', this.colorStopCounter);
      
      const randomColor = this.getRandomColor();
      
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
        setTimeout(() => {
          try {
            colorInput.focus();
          } catch (e) {
            // Ignore focus errors
          }
        }, 100);
      }
      
      // NO TOAST for add color stop
    } catch (error) {
      console.error('Error adding color stop:', error);
      if (typeof gradientToasts !== 'undefined') {
        gradientToasts.colorStopError();
      }
    }
  }

  /**
   * Get random color with fallback
   * @returns {string} Random hex color
   */
  getRandomColor() {
    if (typeof Utils !== 'undefined' && Utils.getRandomColor) {
      return Utils.getRandomColor();
    }
    // Fallback implementation
    return '#' + Math.floor(Math.random() * 0xFFFFFF).toString(16).padStart(6, '0');
  }

  /**
   * Setup event listeners for a color stop with error handling
   * @param {Element} stopElement - Color stop element
   * @param {boolean} isDefault - Whether this is a default stop that can't be removed
   */
  setupColorStopEvents(stopElement, isDefault = false) {
    try {
      const colorInput = stopElement.querySelector('input[type="color"]');
      const positionInput = stopElement.querySelector('.stop-position');
      const removeBtn = stopElement.querySelector('.remove-stop');
      
      // NO TOASTS for routine color/position changes
      if (colorInput) {
        colorInput.addEventListener('input', this.debouncedGenerate);
        colorInput.addEventListener('change', () => this.saveToHistory());
      }
      
      if (positionInput) {
        positionInput.addEventListener('input', this.debouncedGenerate);
        positionInput.addEventListener('change', () => this.saveToHistory());
        
        // Validate input
        positionInput.addEventListener('blur', (e) => {
          const value = parseFloat(e.target.value);
          if (!isNaN(value)) {
            e.target.value = Math.max(0, Math.min(100, value));
          }
        });
      }
      
      if (removeBtn) {
        if (!isDefault) {
          removeBtn.addEventListener('click', () => this.removeColorStop(stopElement));
        } else {
          removeBtn.disabled = true;
        }
      }
    } catch (error) {
      console.error('Error setting up color stop events:', error);
    }
  }

  /**
   * Remove color stop with validation
   * NO TOAST for Remove Color Stop as per requirements
   * @param {Element} stopElement - Color stop element to remove
   */
  removeColorStop(stopElement) {
    try {
      if (!this.colorStops || !stopElement) return;
      
      const stops = this.colorStops.querySelectorAll('.color-stop');
      if (stops.length <= 2) {
        if (typeof gradientToasts !== 'undefined') {
          gradientToasts.invalidInput('color stops');
        }
        return;
      }
      
      stopElement.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => {
        if (stopElement.parentNode) {
          stopElement.parentNode.removeChild(stopElement);
          this.updateRemoveButtons();
          this.debouncedGenerate();
          this.saveToHistory();
          // NO TOAST for remove color stop
        }
      }, 300);
    } catch (error) {
      console.error('Error removing color stop:', error);
      if (typeof gradientToasts !== 'undefined') {
        gradientToasts.colorStopError();
      }
    }
  }

  /**
   * Update remove button states
   */
  updateRemoveButtons() {
    if (!this.colorStops) return;
    
    const stops = this.colorStops.querySelectorAll('.color-stop');
    const removeButtons = this.colorStops.querySelectorAll('.remove-stop');
    
    removeButtons.forEach((btn, index) => {
      // First two stops cannot be removed
      btn.disabled = index < 2 || stops.length <= 2;
    });
  }

  /**
   * Generate random gradient with error handling
   * NO TOAST for Random Design as per requirements
   */
  generateRandomGradient() {
    try {
      const types = [
        'linear-gradient', 'radial-gradient', 'conic-gradient',
        'repeating-linear-gradient', 'repeating-radial-gradient', 'repeating-conic-gradient'
      ];
      
      // Random gradient type
      if (this.gradientType) {
        this.gradientType.value = types[Math.floor(Math.random() * types.length)];
      }
      
      // Clear existing color stops
      if (this.colorStops) {
        this.colorStops.innerHTML = '';
      }
      
      // Generate random number of color stops (2-6)
      const numStops = Math.floor(Math.random() * 5) + 2;
      
      for (let i = 0; i < numStops; i++) {
        const color = this.getRandomColor();
        let position = '';
        
        // Set positions for first and last stops
        if (i === 0) position = '0';
        else if (i === numStops - 1) position = '100';
        else if (Math.random() > 0.3) position = Math.floor(Math.random() * 101).toString();
        
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
        
        if (this.colorStops) {
          this.colorStops.appendChild(stopElement);
          this.setupColorStopEvents(stopElement, i < 2);
        }
      }
      
      // Random parameters
      if (this.angle) this.angle.value = Math.floor(Math.random() * 361);
      if (this.angleSlider) this.angleSlider.value = this.angle ? this.angle.value : 45;
      
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
      if (this.conicAngleSlider) this.conicAngleSlider.value = this.conicAngle ? this.conicAngle.value : 0;
      if (this.conicPosition) {
        this.conicPosition.value = `${Math.floor(Math.random() * 101)}% ${Math.floor(Math.random() * 101)}%`;
      }
      
      this.colorStopCounter = numStops;
      this.updateRemoveButtons();
      this.updateControls();
      this.saveToHistory();
      
      // NO TOAST for random gradient generation
    } catch (error) {
      console.error('Error generating random gradient:', error);
      if (typeof gradientToasts !== 'undefined') {
        gradientToasts.generalError('Failed to generate random gradient');
      }
    }
  }

  /**
   * Reverse color stops order
   */
  reverseColors() {
    try {
      const currentState = this.getCurrentState();
      if (!currentState.colors || currentState.colors.length < 2) return;
      
      const reversedColors = [...currentState.colors].reverse();
      this.restoreState({
        ...currentState,
        colors: reversedColors
      });
      
      this.debouncedGenerate();
      this.saveToHistory();
      
      if (typeof gradientToasts !== 'undefined' && gradientToasts.info) {
        gradientToasts.info('Reversed color stops');
      }
    } catch (error) {
      console.error('Error reversing color stops:', error);
    }
  }

  /**
   * Apply gradient preset with error handling
   * SHOW TOAST for preset selections as per requirements
   * @param {Object} preset - Preset configuration
   */
  applyPreset(preset) {
    try {
      if (!preset || !preset.colors) return;
      
      // Set gradient type
      if (this.gradientType) {
        this.gradientType.value = preset.type || 'linear-gradient';
      }
      
      // Set parameters based on type
      if (preset.type && preset.type.includes('linear') && preset.angle !== undefined) {
        if (this.angle) this.angle.value = preset.angle;
        if (this.angleSlider) this.angleSlider.value = preset.angle;
      } else if (preset.type && preset.type.includes('radial')) {
        if (this.radialShape && preset.shape) this.radialShape.value = preset.shape;
        if (this.radialSize && preset.size) this.radialSize.value = preset.size;
        if (this.radialPosition && preset.position) this.radialPosition.value = preset.position;
      } else if (preset.type && preset.type.includes('conic')) {
        if (this.conicAngle && preset.angle !== undefined) {
          this.conicAngle.value = preset.angle;
          if (this.conicAngleSlider) this.conicAngleSlider.value = preset.angle;
        }
        if (this.conicPosition && preset.position) this.conicPosition.value = preset.position;
      }
      
      // Clear existing stops
      if (this.colorStops) {
        this.colorStops.innerHTML = '';
      }
      
      // Add preset colors
      preset.colors.forEach((colorStop, index) => {
        if (!colorStop.color) return;
        
        const stopElement = document.createElement('div');
        stopElement.className = 'color-stop';
        stopElement.setAttribute('data-stop-index', index);
        
        const position = colorStop.position !== undefined && colorStop.position !== null ? colorStop.position : '';
        
        stopElement.innerHTML = `
          <label class="visually-hidden" for="color-${index}">Color ${index + 1}</label>
          <input type="color" id="color-${index}" value="${colorStop.color}" aria-label="Color ${index + 1}" />
          <label class="visually-hidden" for="position-${index}">Position ${index + 1}</label>
          <input type="number" id="position-${index}" class="stop-position" value="${position}" min="0" max="100" aria-label="Position ${index + 1} (percentage)" />
          <button class="remove-stop btn-icon" type="button" aria-label="Remove color stop ${index + 1}" ${index < 2 ? 'disabled' : ''}>
            <span aria-hidden="true">&times;</span>
          </button>
        `;
        
        if (this.colorStops) {
          this.colorStops.appendChild(stopElement);
          this.setupColorStopEvents(stopElement, index < 2);
        }
      });
      
      this.colorStopCounter = preset.colors.length;
      this.updateRemoveButtons();
      this.updateControls();
      this.saveToHistory();
      
      // SHOW TOAST for preset application
      if (typeof gradientToasts !== 'undefined') {
        const presetName = preset.name || 'Gradient';
        const category = preset.category || 'Custom';
        gradientToasts.presetApplied(presetName, category);
      }
    } catch (error) {
      console.error('Error applying preset:', error);
      if (typeof gradientToasts !== 'undefined') {
        gradientToasts.generalError('Failed to apply preset gradient');
      }
    }
  }

  /**
   * Update export code based on selected format
   */
  updateExportCode() {
    if (!this.cssCode || !this.exportFormat) return;
    
    try {
      const gradient = this.buildGradientCSS();
      const format = this.exportFormat.value;
      let code = '';
      
      switch (format) {
        case 'css':
          code = `background-image: ${gradient};`;
          break;
        case 'tailwind':
          code = `bg-[${gradient.replace(/\s*,\s*/g, ',').replace(/\s+/g, '_')}]`;
          break;
        case 'scss':
          code = `$gradient: ${gradient};\nbackground-image: $gradient;`;
          break;
        case 'json':
          const stops = this.getColorStops();
          const jsonData = {
            type: this.gradientType ? this.gradientType.value : 'linear-gradient',
            colors: stops,
            css: gradient
          };
          if (this.gradientType && this.gradientType.value.includes('linear')) {
            jsonData.angle = this.angle ? parseFloat(this.angle.value) || 0 : 0;
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
    } catch (error) {
      console.error('Error updating export code:', error);
      if (this.cssCode) {
        this.cssCode.value = 'Error generating code. Please try again.';
      }
      if (typeof gradientToasts !== 'undefined') {
        gradientToasts.generalError('Failed to update export code');
      }
    }
  }

  /**
   * Generate SVG representation of gradient
   * @returns {string} SVG code
   */
  generateSVG() {
    try {
      const stops = this.getColorStops();
      const type = this.gradientType ? this.gradientType.value : 'linear-gradient';
      
      let gradientElement = '';
      
      if (type.includes('linear')) {
        const angle = this.angle ? parseFloat(this.angle.value) || 0 : 0;
        const rad = (angle - 90) * Math.PI / 180;
        const x2 = 50 + 50 * Math.cos(rad);
        const y2 = 50 + 50 * Math.sin(rad);
        const x1 = 100 - x2;
        const y1 = 100 - y2;
        
        gradientElement = `
    <linearGradient id="grad" x1="${x1}%" y1="${y1}%" x2="${x2}%" y2="${y2}%">
${stops.map((stop, index) => {
  const offset = stop.position !== null && !isNaN(stop.position) ? stop.position : (index / Math.max(1, stops.length - 1)) * 100;
  return `      <stop offset="${Math.max(0, Math.min(100, offset))}%" style="stop-color:${stop.color}" />`;
}).join('\n')}
    </linearGradient>`;
      } else {
        gradientElement = `
    <radialGradient id="grad" cx="50%" cy="50%" r="50%">
${stops.map((stop, index) => {
  const offset = stop.position !== null && !isNaN(stop.position) ? stop.position : (index / Math.max(1, stops.length - 1)) * 100;
  return `      <stop offset="${Math.max(0, Math.min(100, offset))}%" style="stop-color:${stop.color}" />`;
}).join('\n')}
    </radialGradient>`;
      }
      
      return `<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
  <defs>${gradientElement}
  </defs>
  <rect width="100%" height="100%" fill="url(#grad)" />
</svg>`;
    } catch (error) {
      console.error('Error generating SVG:', error);
      return '<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#888" /></svg>';
    }
  }

  /**
   * Copy code to clipboard
   * SHOW TOAST for copy success/error as per requirements
   */
  async copyCode() {
    if (!this.cssCode) return;
    
    try {
      const success = await this.copyToClipboard(this.cssCode.value);
      if (success) {
        // SHOW TOAST for copy success
        if (typeof gradientToasts !== 'undefined') {
          const format = this.exportFormat ? this.exportFormat.value.toUpperCase() : 'CSS';
          gradientToasts.copied(format);
        }
        
        // Visual feedback
        if (this.copyBtn) {
          const originalText = this.copyBtn.textContent;
          this.copyBtn.textContent = 'Copied!';
          setTimeout(() => {
            if (this.copyBtn) this.copyBtn.textContent = originalText;
          }, 2000);
        }
      } else {
        // SHOW TOAST for copy error
        if (typeof gradientToasts !== 'undefined') {
          gradientToasts.copyError();
        }
      }
    } catch (error) {
      console.error('Error copying code:', error);
      if (typeof gradientToasts !== 'undefined') {
        gradientToasts.copyError();
      }
    }
  }

  /**
   * Copy text to clipboard with fallback
   * @param {string} text - Text to copy
   * @returns {Promise<boolean>} Success status
   */
  async copyToClipboard(text) {
    if (typeof Utils !== 'undefined' && Utils.copyToClipboard) {
      return await Utils.copyToClipboard(text);
    }
    
    // Fallback implementation
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      } else {
        // Legacy fallback
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'absolute';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.select();
        const result = document.execCommand('copy');
        document.body.removeChild(textArea);
        return result;
      }
    } catch (error) {
      console.error('Clipboard error:', error);
      return false;
    }
  }

  /**
   * Download code as file
   * SHOW TOAST for download success/error as per requirements
   */
  downloadCode() {
    if (!this.cssCode || !this.exportFormat) return;
    
    try {
      const format = this.exportFormat.value;
      const content = this.cssCode.value;
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
      
      const extensions = {
        css: 'css',
        tailwind: 'txt',
        scss: 'scss',
        json: 'json',
        svg: 'svg'
      };
      
      const mimeTypes = {
        css: 'text/css',
        tailwind: 'text/plain',
        scss: 'text/scss',
        json: 'application/json',
        svg: 'image/svg+xml'
      };
      
      const filename = `gradient-${timestamp}.${extensions[format] || 'css'}`;
      const mimeType = mimeTypes[format] || 'text/plain';
      
      this.downloadFile(content, filename, mimeType);
      
      // SHOW TOAST for download success
      if (typeof gradientToasts !== 'undefined') {
        gradientToasts.downloaded(filename);
      }
    } catch (error) {
      console.error('Error downloading file:', error);
      if (typeof gradientToasts !== 'undefined') {
        gradientToasts.downloadError();
      }
    }
  }

  /**
   * Download file with fallback
   * @param {string} content - File content
   * @param {string} filename - File name
   * @param {string} mimeType - MIME type
   */
  downloadFile(content, filename, mimeType = 'text/plain') {
    if (typeof Utils !== 'undefined' && Utils.downloadFile) {
      return Utils.downloadFile(content, filename, mimeType);
    }
    
    // Fallback implementation
    try {
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
      throw error;
    }
  }

  /**
   * Share gradient via URL
   * SHOW TOAST for share success/error as per requirements
   */
  shareGradient() {
    try {
      const url = window.location.href;
      
      if (navigator.share) {
        navigator.share({
          title: 'CSS Gradient Generator - Custom Gradient',
          text: 'Check out this awesome gradient I created!',
          url: url
        }).then(() => {
          // SHOW TOAST for share success
          if (typeof gradientToasts !== 'undefined') {
            gradientToasts.shared();
          }
        }).catch(() => {
          this.fallbackShare(url);
        });
      } else {
        this.fallbackShare(url);
      }
    } catch (error) {
      console.error('Error sharing:', error);
      if (typeof gradientToasts !== 'undefined') {
        gradientToasts.shareError();
      }
    }
  }

  /**
   * Fallback share method
   * @param {string} url - URL to share
   */
  async fallbackShare(url) {
    const success = await this.copyToClipboard(url);
    if (success) {
      // SHOW TOAST for share success (URL copied)
      if (typeof gradientToasts !== 'undefined') {
        gradientToasts.shared();
      }
    } else {
      // SHOW TOAST for share error
      if (typeof gradientToasts !== 'undefined') {
        gradientToasts.shareError();
      }
    }
  }

  /**
   * Save current state to history
   */
  saveToHistory() {
    try {
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
    } catch (error) {
      console.error('Error saving to history:', error);
    }
  }

  /**
   * Get current application state
   * @returns {Object} Current state object
   */
  getCurrentState() {
    try {
      return {
        type: this.gradientType ? this.gradientType.value : 'linear-gradient',
        angle: this.angle ? parseFloat(this.angle.value) || 0 : 0,
        radialShape: this.radialShape ? this.radialShape.value : 'circle',
        radialSize: this.radialSize ? this.radialSize.value : 'farthest-corner',
        radialPosition: this.radialPosition ? this.radialPosition.value || 'center' : 'center',
        conicAngle: this.conicAngle ? parseFloat(this.conicAngle.value) || 0 : 0,
        conicPosition: this.conicPosition ? this.conicPosition.value || 'center' : 'center',
        colors: this.getColorStops()
      };
    } catch (error) {
      console.error('Error getting current state:', error);
      return {
        type: 'linear-gradient',
        angle: 0,
        colors: [{ color: '#ff0000', position: null }, { color: '#0000ff', position: null }]
      };
    }
  }

  /**
   * Restore state from object
   * @param {Object} state - State object to restore
   */
  restoreState(state) {
    if (!state) return;
    
    try {
      // Set gradient type
      if (state.type && this.gradientType) {
        this.gradientType.value = state.type;
      }
      
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
      if (state.colors && Array.isArray(state.colors) && this.colorStops) {
        this.colorStops.innerHTML = '';
        state.colors.forEach((colorStop, index) => {
          if (!colorStop.color) return;
          
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
    } catch (error) {
      console.error('Error restoring state:', error);
    }
  }

  /**
   * Undo last action
   * SHOW TOAST for undo success/limit as per requirements
   */
  undo() {
    try {
      if (this.historyIndex > 0) {
        this.historyIndex--;
        const state = JSON.parse(this.history[this.historyIndex]);
        this.restoreState(state);
        this.updateHistoryButtons();
        
        // SHOW TOAST for undo success
        if (typeof gradientToasts !== 'undefined') {
          gradientToasts.undoApplied();
        }
      } else {
        // SHOW TOAST for undo limit
        if (typeof gradientToasts !== 'undefined') {
          gradientToasts.undoLimit();
        }
      }
    } catch (error) {
      console.error('Error during undo:', error);
      if (typeof gradientToasts !== 'undefined') {
        gradientToasts.generalError('Failed to undo action');
      }
    }
  }

  /**
   * Redo last undone action
   * SHOW TOAST for redo success/limit as per requirements
   */
  redo() {
    try {
      if (this.historyIndex < this.history.length - 1) {
        this.historyIndex++;
        const state = JSON.parse(this.history[this.historyIndex]);
        this.restoreState(state);
        this.updateHistoryButtons();
        
        // SHOW TOAST for redo success
        if (typeof gradientToasts !== 'undefined') {
          gradientToasts.redoApplied();
        }
      } else {
        // SHOW TOAST for redo limit
        if (typeof gradientToasts !== 'undefined') {
          gradientToasts.redoLimit();
        }
      }
    } catch (error) {
      console.error('Error during redo:', error);
      if (typeof gradientToasts !== 'undefined') {
        gradientToasts.generalError('Failed to redo action');
      }
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
   * SHOW TOAST for reset as per requirements
   */
  resetGradient() {
    try {
      // Reset to default values
      if (this.gradientType) this.gradientType.value = 'linear-gradient';
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
        if (this.colorStops) {
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
        }
        
        this.colorStopCounter = 2;
        this.initializeExistingColorStops();
        this.updateControls();
        this.saveToHistory();
    } catch (error) {
      console.error('Error resetting gradient:', error);
      if (typeof gradientToasts !== 'undefined') {
        gradientToasts.generalError('Failed to reset gradient');
      }
    }
  }

  /**
   * Handle keyboard shortcuts with error handling
   * @param {KeyboardEvent} e - Keyboard event
   */
  handleKeyboardShortcuts(e) {
    try {
      // Only handle shortcuts when not typing in inputs
      if (e.target.matches('input, textarea')) return;
      
      // Ctrl/Cmd + C: Copy code
      if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
        e.preventDefault();
        this.copyCode();
      }
      
      // Ctrl/Cmd + Z: Undo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        this.undo();
      }
      
      // Ctrl/Cmd + Shift + Z or Ctrl/Cmd + Y: Redo
      if (((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'Z') || ((e.ctrlKey || e.metaKey) && e.key === 'y')) {
        e.preventDefault();
        this.redo();
      }
      
      // Ctrl/Cmd + R: Random gradient
      if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
        e.preventDefault();
        this.generateRandomGradient();
      }
      
      // Escape: Reset focus
      if (e.key === 'Escape') {
        if (document.activeElement && document.activeElement.blur) {
          document.activeElement.blur();
        }
      }
    } catch (error) {
      console.error('Error handling keyboard shortcut:', error);
    }
  }

  /**
   * Update URL state for sharing and bookmarking
   */
  updateURLState() {
    try {
      if (typeof Utils !== 'undefined' && Utils.updateUrlParams) {
        const state = this.getCurrentState();
        const params = {
          type: state.type,
          colors: state.colors.map(c => `${c.color}${c.position !== null && !isNaN(c.position) ? `@${c.position}` : ''}`).join(','),
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
    } catch (error) {
      console.error('Error updating URL state:', error);
    }
  }

  /**
   * Load state from URL parameters
   */
  loadStateFromURL() {
    try {
      const params = this.parseUrlParams();
      
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
        try {
          const colorStrings = params.colors.split(',');
          state.colors = colorStrings.map(colorStr => {
            const [rawColor, position] = colorStr.split('@');
            const color = rawColor ? (rawColor.startsWith('#') ? rawColor : '#' + rawColor) : '#ff0000';
            return {
              color,
              position: position && !isNaN(parseFloat(position)) ? parseFloat(position) : null
            };
          }).filter(c => c.color && c.color.match(/^#([0-9A-Fa-f]{3,4}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/));
        } catch (e) {
          console.warn('Error parsing colors from URL:', e);
        }
      }
      
      // Ensure at least 2 colors
      if (state.colors.length < 2) {
        state.colors = [
          { color: '#ff0000', position: null },
          { color: '#0000ff', position: null }
        ];
      }
      
      this.restoreState(state);
      this.saveToHistory();
    } catch (error) {
      console.error('Error loading state from URL:', error);
    }
  }

  /**
   * Parse URL parameters with fallback
   * @param {string} url - URL to parse (optional)
   * @returns {Object} Parsed parameters
   */
  parseUrlParams(url = window.location.href) {
    if (typeof Utils !== 'undefined' && Utils.parseUrlParams) {
      return Utils.parseUrlParams(url);
    }
    
    // Fallback implementation
    const params = {};
    try {
      const urlObj = new URL(url);
      urlObj.searchParams.forEach((value, key) => {
        params[key] = value;
      });
    } catch (error) {
      console.warn('Error parsing URL params:', error);
    }
    return params;
  }

  /**
   * Initialize theme system
   */
  initializeTheme() {
    try {
      const savedThemeMode = localStorage.getItem('gradient-theme-mode') || 'system';
      if (this.themeSelect) {
        this.themeSelect.value = savedThemeMode;
        this.themeSelect.addEventListener('change', (e) => this.setTheme(e.target.value));
      }

      // Bind theme pill buttons
      const themePillBtns = document.querySelectorAll('.theme-pill-btn');
      themePillBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const mode = btn.getAttribute('data-theme-val');
          if (mode) this.setTheme(mode);
        });
      });

      this.applyTheme(savedThemeMode);

      if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
          if ((localStorage.getItem('gradient-theme-mode') || 'system') === 'system') {
            this.applyTheme('system');
          }
        });
      }
    } catch (error) {
      console.error('Error initializing theme:', error);
      this.applyTheme('light');
    }
  }

  /**
   * Initialize hamburger menu for mobile navigation
   */
  initializeHamburgerMenu() {
    try {
      const hamburgerBtn = document.getElementById('hamburger-menu');
      const mobileNav = document.getElementById('mobile-nav');
      if (!hamburgerBtn || !mobileNav) return;

      const toggleMenu = () => {
        const isOpen = hamburgerBtn.classList.toggle('active');
        mobileNav.classList.toggle('active');
        hamburgerBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        mobileNav.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
      };

      hamburgerBtn.addEventListener('click', toggleMenu);

      // Close mobile menu when clicking a link inside it
      const mobileLinks = mobileNav.querySelectorAll('.mobile-link');
      mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
          hamburgerBtn.classList.remove('active');
          mobileNav.classList.remove('active');
          hamburgerBtn.setAttribute('aria-expanded', 'false');
          mobileNav.setAttribute('aria-hidden', 'true');
        });
      });
    } catch (error) {
      console.error('Error initializing hamburger menu:', error);
    }
  }

  /**
   * Set and save application theme mode
   * @param {string} mode - Theme mode ('system', 'light', or 'dark')
   */
  setTheme(mode) {
    try {
      localStorage.setItem('gradient-theme-mode', mode);
      if (this.themeSelect) {
        this.themeSelect.value = mode;
      }
      this.applyTheme(mode);
      if (typeof Utils !== 'undefined' && Utils.showToast) {
        Utils.showToast(`Theme changed to ${mode}`, 'info', 1500);
      }
    } catch (error) {
      console.error('Error setting theme:', error);
    }
  }

  /**
   * Apply application theme
   * @param {string} mode - Theme mode ('system', 'light', or 'dark')
   */
  applyTheme(mode) {
    let theme;
    if (mode === 'system') {
      theme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } else {
      theme = mode;
    }
    document.documentElement.setAttribute('data-theme', theme);
    document.body.classList.toggle('dark-mode', theme === 'dark');

    // Update active pill UI buttons
    const activeMode = localStorage.getItem('gradient-theme-mode') || 'system';
    const themePillBtns = document.querySelectorAll('.theme-pill-btn');
    themePillBtns.forEach(btn => {
      const val = btn.getAttribute('data-theme-val');
      btn.setAttribute('data-active', val === activeMode ? 'true' : 'false');
    });
  }

  /**
   * Show error message with fallback
   * @param {string} message - Error message
   */
  showError(message) {
    if (typeof gradientToasts !== 'undefined') {
      gradientToasts.generalError(message);
    } else if (typeof Utils !== 'undefined' && Utils.showToast) {
      Utils.showToast(message, 'error', 4000);
    } else {
      console.error(message);
      alert('Error: ' + message);
    }
  }

  /**
   * Show success message with fallback
   * @param {string} message - Success message
   */
  showSuccess(message) {
    if (typeof gradientToasts !== 'undefined') {
      gradientToasts.success(message);
    } else if (typeof Utils !== 'undefined' && Utils.showToast) {
      Utils.showToast(message, 'success', 2000);
    } else {
      console.log(message);
    }
  }

  /**
   * Show warning message with fallback
   * @param {string} message - Warning message
   */
  showWarning(message) {
    if (typeof gradientToasts !== 'undefined') {
      gradientToasts.warning(message);
    } else if (typeof Utils !== 'undefined' && Utils.showToast) {
      Utils.showToast(message, 'warning', 3000);
    } else {
      console.warn(message);
      alert('Warning: ' + message);
    }
  }

  /**
   * Show info message with fallback
   * @param {string} message - Info message
   */
  showInfo(message) {
    if (typeof gradientToasts !== 'undefined') {
      gradientToasts.info(message);
    } else if (typeof Utils !== 'undefined' && Utils.showToast) {
      Utils.showToast(message, 'info', 2000);
    } else {
      console.log(message);
    }
  }
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