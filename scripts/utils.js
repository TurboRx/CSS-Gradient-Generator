/**
 * Utility functions for the CSS Gradient Generator
 * @version 2.0.3 - Hardened clipboard, validation, URL
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
    return /^#[0-9A-Fa-f]{6}$/.test(color);
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
        try {
          params[k] = decodeURIComponent(v);
        } catch {
          params[k] = v;
        }
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

  static showToast(message, type = 'info', duration = 3000) {
    const container = document.getElementById('toast-container');
    if (!container) return null;
    const div = document.createElement('div');
    div.className = `toast ${type}`;
    div.setAttribute('role', 'alert');
    const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
    div.innerHTML = `
      <div class="toast-icon">${icons[type] || icons.info}</div>
      <div class="toast-content"><div class="toast-message">${this.sanitizeHtml(message)}</div></div>
      <button class="toast-close" aria-label="Close">&times;</button>
    `;
    const close = () => {
      div.style.animation = 'slideOutRight 0.25s ease';
      setTimeout(() => div.remove(), 240);
    };
    div.querySelector('.toast-close')?.addEventListener('click', close);
    container.appendChild(div);
    if (duration > 0) setTimeout(close, duration);
    return div;
  }

  static sanitizeHtml(str) {
    if (typeof str !== 'string') return '';
    const temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
  }

  // (Other methods as before...)
}

window.Utils = Utils;
if (typeof module !== 'undefined' && module.exports) module.exports = Utils;
