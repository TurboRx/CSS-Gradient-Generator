/**
 * Utility functions for the CSS Gradient Generator
 * @version 2.1.0 - Toast rate limiter, hardened clipboard, validation, URL
 */

'use strict';

class Utils {
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

  static clamp(num, min, max) {
    return Math.max(min, Math.min(max, num));
  }

  static isValidHex(color) {
    return /^#([0-9A-Fa-f]{3,4}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/.test(color);
  }

  // Clipboard API: permission-aware with fallback
  static async copyToClipboard(text) {
    try {
      if (!window.isSecureContext || !navigator.clipboard)
        return this.fallbackCopyToClipboard(text);
      if (navigator.permissions && navigator.permissions.query) {
        try {
          const perm = await navigator.permissions.query({ name: 'clipboard-write' });
          if (perm.state === 'denied') return this.fallbackCopyToClipboard(text);
        } catch {}
      }
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      return this.fallbackCopyToClipboard(text);
    }
  }

  static fallbackCopyToClipboard(text) {
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.left = '-99999px';
      ta.setAttribute('readonly', '');
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      const ok = document.execCommand('copy');
      document.body.removeChild(ta);
      return ok;
    } catch (e) {
      return false;
    }
  }

  static parseUrlParams(url = window.location.href) {
    const params = {};
    try {
      const u = new URL(url);
      u.searchParams.forEach((v, k) => {
        try { params[k] = decodeURIComponent(v); } catch { params[k] = v; }
      });
    } catch {
      const q = url.split('?')[1] || '';
      q.split('&').forEach((p) => {
        const [k, v] = p.split('=');
        if (k) params[k] = v ? decodeURIComponent(v) : '';
      });
    }
    return params;
  }

  static updateUrlParams(params, replace = false) {
    try {
      const url = new URL(window.location);
      Object.entries(params).forEach(([k, v]) => {
        if (v === null || v === undefined || v === '') url.searchParams.delete(k);
        else url.searchParams.set(k, v);
      });
      history[replace ? 'replaceState' : 'pushState']({}, '', url);
    } catch {}
  }

  // Toast system with rate-limiting and deduplication
  static _toastState = { lastAt: 0, minGap: 900, queue: [], showing: 0, maxShowing: 2, dedupeTTL: 1500, recent: new Map() };

  static showToast(message, type = 'info', duration = 2000) {
    const container = document.getElementById('toast-container');
    if (!container || !message) return null;

    // Deduplicate same message within dedupeTTL
    const now = Date.now();
    const key = `${type}:${message}`;
    const last = this._toastState.recent.get(key) || 0;
    if (now - last < this._toastState.dedupeTTL) return null;
    this._toastState.recent.set(key, now);

    // Enforce minimum gap between creations
    const gap = now - this._toastState.lastAt;
    if (gap < this._toastState.minGap || this._toastState.showing >= this._toastState.maxShowing) {
      this._toastState.queue.push({ message, type, duration });
      if (!this._toastState._draining) this._drainToasts();
      return null;
    }

    this._toastState.lastAt = now;
    this._toastState.showing++;

    const div = document.createElement('div');
    div.className = `toast ${type}`;
    div.setAttribute('role', 'alert');

    const icons = { success: '✓', error: '⨯', warning: '!', info: 'i' };
    div.innerHTML = `
      <div class="toast-icon">${icons[type] || icons.info}</div>
      <div class="toast-content"><div class="toast-message">${this.sanitizeHtml(message)}</div></div>
      <button class="toast-close" aria-label="Close">×</button>
    `;

    const close = () => {
      div.style.animation = 'slideOutRight 0.2s ease';
      setTimeout(() => {
        div.remove();
        this._toastState.showing = Math.max(0, this._toastState.showing - 1);
        this._drainToasts();
      }, 180);
    };

    div.querySelector('.toast-close')?.addEventListener('click', close);
    container.appendChild(div);

    if (duration > 0) setTimeout(close, duration);
    return div;
  }

  static _drainToasts() {
    this._toastState._draining = true;
    const tick = () => {
      if (this._toastState.queue.length === 0) { this._toastState._draining = false; return; }
      const canCreate = (Date.now() - this._toastState.lastAt) >= this._toastState.minGap && this._toastState.showing < this._toastState.maxShowing;
      if (canCreate) {
        const next = this._toastState.queue.shift();
        this.showToast(next.message, next.type, next.duration);
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  static sanitizeHtml(str) {
    if (typeof str !== 'string') return '';
    const temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
  }
}

window.Utils = Utils;
if (typeof module !== 'undefined' && module.exports) module.exports = Utils;
