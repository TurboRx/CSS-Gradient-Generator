/**
 * Toast Notification System for CSS Gradient Generator
 * Provides user feedback for various actions
 */

class ToastManager {
    constructor() {
        this.container = document.getElementById('toast-container');
        this.toasts = new Map();
        this.toastId = 0;
        
        // Create container if it doesn't exist
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.id = 'toast-container';
            this.container.setAttribute('aria-live', 'polite');
            this.container.setAttribute('aria-atomic', 'true');
            document.body.appendChild(this.container);
        }
        
        this.initializeStyles();
    }
    
    initializeStyles() {
        // Add toast styles if not already present
        if (!document.getElementById('toast-styles')) {
            const style = document.createElement('style');
            style.id = 'toast-styles';
            style.textContent = `
                #toast-container {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    z-index: 10000;
                    pointer-events: none;
                    max-width: 400px;
                }
                
                .toast {
                    background: var(--bg-secondary, #ffffff);
                    border: 1px solid var(--border-color, #e0e0e0);
                    border-radius: 8px;
                    padding: 12px 16px;
                    margin-bottom: 12px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                    pointer-events: auto;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    min-width: 300px;
                    max-width: 400px;
                    opacity: 0;
                    transform: translateX(100%);
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    position: relative;
                    overflow: hidden;
                }
                
                .toast.show {
                    opacity: 1;
                    transform: translateX(0);
                }
                
                .toast.hide {
                    opacity: 0;
                    transform: translateX(100%);
                }
                
                .toast-icon {
                    flex-shrink: 0;
                    width: 20px;
                    height: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                .toast-content {
                    flex: 1;
                    min-width: 0;
                }
                
                .toast-title {
                    font-weight: 600;
                    font-size: 14px;
                    margin: 0;
                    line-height: 1.4;
                    color: var(--text-primary, #333333);
                }
                
                .toast-message {
                    font-size: 13px;
                    margin: 2px 0 0 0;
                    line-height: 1.4;
                    color: var(--text-secondary, #666666);
                }
                
                .toast-close {
                    background: none;
                    border: none;
                    padding: 4px;
                    cursor: pointer;
                    color: var(--text-secondary, #666666);
                    opacity: 0.7;
                    transition: opacity 0.2s;
                    border-radius: 4px;
                    flex-shrink: 0;
                }
                
                .toast-close:hover {
                    opacity: 1;
                    background-color: var(--bg-hover, rgba(0, 0, 0, 0.05));
                }
                
                .toast-progress {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    height: 2px;
                    background-color: var(--accent-color, #007acc);
                    transition: width linear;
                }
                
                /* Toast type styles */
                .toast.success {
                    border-left: 4px solid #22c55e;
                }
                
                .toast.success .toast-icon {
                    color: #22c55e;
                }
                
                .toast.error {
                    border-left: 4px solid #ef4444;
                }
                
                .toast.error .toast-icon {
                    color: #ef4444;
                }
                
                .toast.warning {
                    border-left: 4px solid #f59e0b;
                }
                
                .toast.warning .toast-icon {
                    color: #f59e0b;
                }
                
                .toast.info {
                    border-left: 4px solid #3b82f6;
                }
                
                .toast.info .toast-icon {
                    color: #3b82f6;
                }
                
                /* Dark theme support */
                [data-theme="dark"] .toast {
                    background: var(--bg-secondary-dark, #2d2d2d);
                    border-color: var(--border-color-dark, #404040);
                    color: var(--text-primary-dark, #ffffff);
                }
                
                [data-theme="dark"] .toast-title {
                    color: var(--text-primary-dark, #ffffff);
                }
                
                [data-theme="dark"] .toast-message {
                    color: var(--text-secondary-dark, #cccccc);
                }
                
                [data-theme="dark"] .toast-close {
                    color: var(--text-secondary-dark, #cccccc);
                }
                
                [data-theme="dark"] .toast-close:hover {
                    background-color: var(--bg-hover-dark, rgba(255, 255, 255, 0.1));
                }
                
                /* Mobile responsive - FIX FOR TOP SPACING ISSUE */
                @media (max-width: 768px) {
                    #toast-container {
                        position: fixed;
                        top: 10px;
                        left: 10px;
                        right: 10px;
                        max-width: none;
                        width: calc(100% - 20px);
                        z-index: 10000;
                    }
                    
                    .toast {
                        min-width: auto;
                        max-width: none;
                        width: 100%;
                        margin-bottom: 8px;
                        transform: translateY(-100%);
                    }
                    
                    .toast.show {
                        transform: translateY(0);
                    }
                    
                    .toast.hide {
                        transform: translateY(-100%);
                    }
                }
                
                /* Extra small screens */
                @media (max-width: 480px) {
                    #toast-container {
                        top: 8px;
                        left: 8px;
                        right: 8px;
                        width: calc(100% - 16px);
                    }
                    
                    .toast {
                        padding: 10px 12px;
                        font-size: 13px;
                    }
                    
                    .toast-title {
                        font-size: 13px;
                    }
                    
                    .toast-message {
                        font-size: 12px;
                    }
                }
                
                /* Reduced motion support */
                @media (prefers-reduced-motion: reduce) {
                    .toast {
                        transition: opacity 0.2s;
                    }
                    
                    .toast-progress {
                        transition: none;
                    }
                }
                
                /* Ensure toasts don't interfere with page layout */
                #toast-container:empty {
                    display: none;
                }
                
                /* Safe area support for mobile devices with notches */
                @supports (padding: max(0px)) {
                    @media (max-width: 768px) {
                        #toast-container {
                            top: max(10px, env(safe-area-inset-top));
                            left: max(10px, env(safe-area-inset-left));
                            right: max(10px, env(safe-area-inset-right));
                        }
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    show(options = {}) {
        const {
            title = '',
            message = '',
            type = 'info', // success, error, warning, info
            duration = 4000,
            persistent = false,
            action = null
        } = options;
        
        const id = ++this.toastId;
        const toast = this.createToastElement(id, title, message, type, persistent, action);
        
        this.container.appendChild(toast);
        
        // Trigger show animation
        requestAnimationFrame(() => {
            toast.classList.add('show');
        });
        
        // Auto dismiss if not persistent
        let dismissTimer = null;
        if (!persistent && duration > 0) {
            // Add progress bar
            const progressBar = toast.querySelector('.toast-progress');
            if (progressBar) {
                progressBar.style.width = '100%';
                progressBar.style.transitionDuration = duration + 'ms';
                
                requestAnimationFrame(() => {
                    progressBar.style.width = '0%';
                });
            }
            
            dismissTimer = setTimeout(() => {
                this.dismiss(id);
            }, duration);
        }
        
        // Store toast reference
        this.toasts.set(id, {
            element: toast,
            timer: dismissTimer
        });
        
        return id;
    }
    
    createToastElement(id, title, message, type, persistent, action) {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.setAttribute('role', type === 'error' ? 'alert' : 'status');
        toast.setAttribute('data-toast-id', id);
        
        // Icon based on type
        const icons = {
            success: '✓',
            error: '✕',
            warning: '⚠',
            info: 'ℹ'
        };
        
        toast.innerHTML = `
            <div class="toast-icon" aria-hidden="true">${icons[type] || icons.info}</div>
            <div class="toast-content">
                ${title ? `<div class="toast-title">${this.escapeHtml(title)}</div>` : ''}
                ${message ? `<div class="toast-message">${this.escapeHtml(message)}</div>` : ''}
            </div>
            ${!persistent ? '<button class="toast-close" aria-label="Close notification">×</button>' : ''}
            ${!persistent ? '<div class="toast-progress"></div>' : ''}
        `;
        
        // Add close functionality
        const closeBtn = toast.querySelector('.toast-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.dismiss(id);
            });
        }
        
        // Add action if provided
        if (action && typeof action.callback === 'function') {
            toast.style.cursor = 'pointer';
            toast.addEventListener('click', (e) => {
                if (!e.target.classList.contains('toast-close')) {
                    action.callback();
                    if (action.dismissOnClick !== false) {
                        this.dismiss(id);
                    }
                }
            });
        }
        
        return toast;
    }
    
    dismiss(id) {
        const toast = this.toasts.get(id);
        if (!toast) return;
        
        // Clear timer
        if (toast.timer) {
            clearTimeout(toast.timer);
        }
        
        // Animate out
        toast.element.classList.add('hide');
        toast.element.classList.remove('show');
        
        // Remove from DOM after animation
        setTimeout(() => {
            if (toast.element.parentNode) {
                toast.element.parentNode.removeChild(toast.element);
            }
            this.toasts.delete(id);
        }, 300);
    }
    
    dismissAll() {
        this.toasts.forEach((toast, id) => {
            this.dismiss(id);
        });
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    // Convenience methods
    success(title, message, options = {}) {
        return this.show({ ...options, title, message, type: 'success' });
    }
    
    error(title, message, options = {}) {
        return this.show({ ...options, title, message, type: 'error' });
    }
    
    warning(title, message, options = {}) {
        return this.show({ ...options, title, message, type: 'warning' });
    }
    
    info(title, message, options = {}) {
        return this.show({ ...options, title, message, type: 'info' });
    }
}

// Create global toast manager instance
window.toast = new ToastManager();

// Enhanced toast functions for gradient generator specific actions
window.gradientToasts = {
    // Copy functionality
    copied: (format = 'CSS') => {
        toast.success('Copied!', `${format} code copied to clipboard`);
    },
    
    copyError: () => {
        toast.error('Copy Failed', 'Unable to copy to clipboard');
    },
    
    // Download functionality
    downloaded: (filename) => {
        toast.success('Downloaded!', `File saved as ${filename}`);
    },
    
    downloadError: () => {
        toast.error('Download Failed', 'Unable to download file');
    },
    
    // Share functionality
    shared: () => {
        toast.success('Shared!', 'Gradient link copied to clipboard');
    },
    
    shareError: () => {
        toast.error('Share Failed', 'Unable to create share link');
    },
    
    // Reset functionality
    reset: () => {
        toast.info('Reset', 'Gradient reset to default');
    },
    
    // Undo/Redo functionality
    undoApplied: () => {
        toast.info('Undo', 'Last action undone');
    },
    
    redoApplied: () => {
        toast.info('Redo', 'Action restored');
    },
    
    undoLimit: () => {
        toast.warning('Undo Limit', 'No more actions to undo');
    },
    
    redoLimit: () => {
        toast.warning('Redo Limit', 'No more actions to redo');
    },
    
    // Preset selections
    presetApplied: (presetName, category) => {
        toast.success('Preset Applied', `${presetName} from ${category} collection`);
    },
    
    // Error messages
    invalidInput: (field) => {
        toast.error('Invalid Input', `Please check the ${field} value`);
    },
    
    generalError: (message) => {
        toast.error('Error', message);
    },
    
    // Validation errors
    colorStopError: () => {
        toast.error('Color Stop Error', 'Invalid color stop configuration');
    },
    
    gradientError: () => {
        toast.error('Gradient Error', 'Unable to generate gradient');
    },
    
    // File operations
    fileError: (operation) => {
        toast.error('File Error', `Failed to ${operation} file`);
    },
    
    // Browser compatibility warnings
    compatibilityWarning: (feature) => {
        toast.warning('Compatibility', `${feature} may not be supported in all browsers`);
    },
    
    // Welcome message (shown once)
    welcome: () => {
        const hasSeenWelcome = localStorage.getItem('gradient-generator-welcome');
        if (!hasSeenWelcome) {
            toast.info('Welcome!', 'Create beautiful CSS gradients with live preview', {
                duration: 6000,
                action: {
                    callback: () => {
                        localStorage.setItem('gradient-generator-welcome', 'true');
                    },
                    dismissOnClick: true
                }
            });
            localStorage.setItem('gradient-generator-welcome', 'true');
        }
    }
};

// Auto-initialize welcome message when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        // Small delay to let the page settle
        setTimeout(() => {
            gradientToasts.welcome();
        }, 1000);
    });
} else {
    // Document is already loaded
    setTimeout(() => {
        gradientToasts.welcome();
    }, 1000);
}