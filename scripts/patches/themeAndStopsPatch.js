/**
 * Enhanced CSS Gradient Generator
 * Add color stop validation, SVG hardening, theme select
 */
'use strict';

(function patchGradientGenerator(){
  const protoReady = () => typeof window !== 'undefined' && window.GradientGenerator;
  const applyPatch = () => {
    const GG = window.GradientGenerator;
    if (!GG) return;
    const orig = GG.prototype;

    // Insert color stop validation utility
    orig.validateColorStops = function(stops) {
      if (!Array.isArray(stops)) return [];
      const adjusted = stops.map(s => ({
        color: (s && s.color) || '#000000',
        position: (s && typeof s.position === 'number') ? Utils.clamp(s.position, 0, 100) : null
      }));
      // Ensure strictly increasing positions when consecutive equal
      for (let i = 1; i < adjusted.length; i++) {
        if (adjusted[i].position !== null && adjusted[i-1].position !== null) {
          if (adjusted[i].position <= adjusted[i-1].position) {
            adjusted[i].position = Math.min(100, adjusted[i-1].position + 0.1);
          }
        }
      }
      return adjusted;
    };

    // Patch getColorStops to clamp/validate
    const _getColorStops = orig.getColorStops;
    orig.getColorStops = function() {
      const raw = _getColorStops.call(this);
      const filtered = raw.filter(s => Utils.isValidHex(s.color));
      const limited = filtered.slice(0, 10); // performance cap
      return this.validateColorStops(limited);
    };

    // Patch addColorStop to enforce max stops
    const _addColorStop = orig.addColorStop;
    orig.addColorStop = function() {
      const count = this.colorStops ? this.colorStops.querySelectorAll('.color-stop').length : 0;
      if (count >= 10) {
        this.showWarning('Maximum 10 color stops allowed for optimal performance');
        return;
      }
      _addColorStop.call(this);
    };

    // Patch removeColorStop to cleanup listeners
    const _removeColorStop = orig.removeColorStop;
    orig.removeColorStop = function(stopElement) {
      try {
        if (stopElement) {
          const inputs = stopElement.querySelectorAll('input');
          inputs.forEach(input => {
            input.replaceWith(input.cloneNode(true)); // cheap listener cleanup
          });
        }
      } catch {}
      _removeColorStop.call(this, stopElement);
    };

    // Harden SVG export
    const _generateSVG = orig.generateSVG;
    orig.generateSVG = function() {
      try {
        const svg = _generateSVG.call(this);
        // Basic sanity fallback already in original; keep behavior
        return svg;
      } catch (e) {
        return '<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#888" /></svg>';
      }
    };

    // Theme selector support
    const _initializeTheme = orig.initializeTheme;
    orig.initializeTheme = function() {
      _initializeTheme.call(this);
      const select = document.getElementById('theme-select');
      if (!select) return;
      const saved = localStorage.getItem('gradient-theme-mode') || 'system';
      select.value = saved;
      select.addEventListener('change', () => {
        const mode = select.value; // system | light | dark
        localStorage.setItem('gradient-theme-mode', mode);
        if (mode === 'system') {
          // clear explicit theme and re-apply system
          localStorage.removeItem('gradient-theme');
          const dark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
          this.setTheme(dark ? 'dark' : 'light');
        } else {
          this.setTheme(mode);
        }
        Utils.showToast(`Theme: ${mode}`, 'info', 1500);
      });
    };
  };

  if (protoReady()) applyPatch();
  else document.addEventListener('DOMContentLoaded', () => protoReady() && applyPatch());
})();
