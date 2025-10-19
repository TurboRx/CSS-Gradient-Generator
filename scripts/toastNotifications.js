/**
 * Toast Notification System for CSS Gradient Generator
 * Provides user feedback for key actions only
 */

class ToastManager {
    constructor() {
        this.container = document.getElementById('toast-container');
        this.toasts = new Map();
        this.toastId = 0;
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
        if (document.getElementById('toast-styles')) return;
        const style = document.createElement('style');
        style.id = 'toast-styles';
        style.textContent = `
            #toast-container{position:fixed;top:16px;right:16px;z-index:10000;pointer-events:none;max-width:400px}
            .toast{background:var(--bg-secondary,#fff);border:1px solid var(--border-color,#e0e0e0);border-radius:8px;padding:12px 16px;margin-bottom:12px;box-shadow:0 4px 12px rgba(0,0,0,.15);pointer-events:auto;display:flex;align-items:center;gap:12px;min-width:280px;max-width:400px;opacity:0;transform:translateX(100%);transition:all .3s cubic-bezier(.4,0,.2,1);position:relative;overflow:hidden}
            .toast.show{opacity:1;transform:translateX(0)}
            .toast.hide{opacity:0;transform:translateX(100%)}
            .toast-icon{flex-shrink:0;width:20px;height:20px;display:flex;align-items:center;justify-content:center}
            .toast-content{flex:1;min-width:0}
            .toast-title{font-weight:600;font-size:14px;margin:0;line-height:1.4;color:var(--text-primary,#333)}
            .toast-message{font-size:13px;margin:2px 0 0 0;line-height:1.4;color:var(--text-secondary,#666)}
            .toast-close{background:none;border:none;padding:4px;cursor:pointer;color:var(--text-secondary,#666);opacity:.7;transition:opacity .2s;border-radius:4px;flex-shrink:0}
            .toast-close:hover{opacity:1;background-color:var(--bg-hover,rgba(0,0,0,.05))}
            .toast-progress{position:absolute;bottom:0;left:0;height:2px;background-color:var(--accent-color,#007acc);transition:width linear}
            .toast.success{border-left:4px solid #22c55e}.toast.success .toast-icon{color:#22c55e}
            .toast.error{border-left:4px solid #ef4444}.toast.error .toast-icon{color:#ef4444}
            .toast.warning{border-left:4px solid #f59e0b}.toast.warning .toast-icon{color:#f59e0b}
            .toast.info{border-left:4px solid #3b82f6}.toast.info .toast-icon{color:#3b82f6}
            [data-theme="dark"] .toast{background:var(--bg-secondary-dark,#2d2d2d);border-color:var(--border-color-dark,#404040);color:var(--text-primary-dark,#fff)}
            [data-theme="dark"] .toast-title{color:var(--text-primary-dark,#fff)}
            [data-theme="dark"] .toast-message{color:var(--text-secondary-dark,#ccc)}
            [data-theme="dark"] .toast-close{color:var(--text-secondary-dark,#ccc)}
            [data-theme="dark"] .toast-close:hover{background-color:var(--bg-hover-dark,rgba(255,255,255,.1))}
            @media (max-width:768px){#toast-container{top:10px;right:10px;left:10px;max-width:none}.toast{min-width:auto;max-width:none;margin-bottom:8px}}
            @media (prefers-reduced-motion:reduce){.toast{transition:opacity .2s}.toast-progress{transition:none}}
        `;
        document.head.appendChild(style);
    }

    show({title='',message='',type='info',duration=2500,persistent=false,action=null}={}){
        const id=++this.toastId;
        const toast=this.createToastElement(id,title,message,type,persistent,action);
        this.container.appendChild(toast);
        requestAnimationFrame(()=>toast.classList.add('show'));
        let dismissTimer=null;
        if(!persistent&&duration>0){
            const progressBar=toast.querySelector('.toast-progress');
            if(progressBar){progressBar.style.width='100%';progressBar.style.transitionDuration=duration+'ms';requestAnimationFrame(()=>{progressBar.style.width='0%'})}
            dismissTimer=setTimeout(()=>this.dismiss(id),duration);
        }
        this.toasts.set(id,{element:toast,timer:dismissTimer});
        return id;
    }

    createToastElement(id,title,message,type,persistent,action){
        const toast=document.createElement('div');
        toast.className=`toast ${type}`;
        toast.setAttribute('role',type==='error'?'alert':'status');
        toast.setAttribute('data-toast-id',id);
        const icons={success:'✓',error:'✕',warning:'⚠',info:'ℹ'};
        toast.innerHTML=`
            <div class="toast-icon" aria-hidden="true">${icons[type]||icons.info}</div>
            <div class="toast-content">
                ${title?`<div class="toast-title">${this.escapeHtml(title)}</div>`:''}
                ${message?`<div class="toast-message">${this.escapeHtml(message)}</div>`:''}
            </div>
            ${!persistent?'<button class="toast-close" aria-label="Close notification">×</button>':''}
            ${!persistent?'<div class="toast-progress"></div>':''}
        `;
        const closeBtn=toast.querySelector('.toast-close');
        if(closeBtn){closeBtn.addEventListener('click',()=>this.dismiss(id))}
        if(action&&typeof action.callback==='function'){
            toast.style.cursor='pointer';
            toast.addEventListener('click',(e)=>{if(!e.target.classList.contains('toast-close')){action.callback();if(action.dismissOnClick!==false){this.dismiss(id)}}})
        }
        return toast;
    }

    dismiss(id){
        const toast=this.toasts.get(id);
        if(!toast) return;
        if(toast.timer) clearTimeout(toast.timer);
        toast.element.classList.add('hide');
        toast.element.classList.remove('show');
        setTimeout(()=>{toast.element.remove();this.toasts.delete(id)},300);
    }

    escapeHtml(text){const div=document.createElement('div');div.textContent=text;return div.innerHTML}

    // Convenience
    success(title,message,opts={}){return this.show({...opts,title,message,type:'success'})}
    error(title,message,opts={}){return this.show({...opts,title,message,type:'error',duration:4000})}
    warning(title,message,opts={}){return this.show({...opts,title,message,type:'warning',duration:3000})}
    info(title,message,opts={}){return this.show({...opts,title,message,type:'info',duration:2000})}
}

window.toast=new ToastManager();

window.gradientToasts={
    copied:(format='CSS')=>toast.success('Copied!',`${format} code copied to clipboard`),
    copyError:()=>toast.error('Copy Failed','Unable to copy to clipboard'),
    downloaded:(filename)=>toast.success('Downloaded!',`File saved as ${filename}`),
    downloadError:()=>toast.error('Download Failed','Unable to download file'),
    shared:()=>toast.success('Shared!','Gradient link copied to clipboard'),
    shareError:()=>toast.error('Share Failed','Unable to create share link'),
    reset:()=>toast.info('Reset','Gradient reset to default'),
    undoApplied:()=>toast.info('Undo','Last action undone'),
    redoApplied:()=>toast.info('Redo','Action restored'),
    undoLimit:()=>toast.warning('Undo Limit','No more actions to undo'),
    redoLimit:()=>toast.warning('Redo Limit','No more actions to redo'),
    presetApplied:(presetName,category)=>toast.success('Preset Applied',`${presetName} from ${category} collection`),
    invalidInput:(field)=>toast.error('Invalid Input',`Please check the ${field} value`),
    generalError:(message)=>toast.error('Error',message),
    colorStopError:()=>toast.error('Color Stop Error','Invalid color stop configuration'),
    gradientError:()=>toast.error('Gradient Error','Unable to generate gradient'),
    fileError:(operation)=>toast.error('File Error',`Failed to ${operation} file`),
    compatibilityWarning:(feature)=>toast.warning('Compatibility',`${feature} may not be supported in all browsers`),
    welcome:()=>{const seen=localStorage.getItem('gradient-generator-welcome');if(!seen){toast.info('Welcome!','Create beautiful CSS gradients with live preview',{duration:3000});localStorage.setItem('gradient-generator-welcome','true')}}
};

// Only toastNotifications triggers welcome; do not duplicate in generator
if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',()=>setTimeout(()=>gradientToasts.welcome(),1000));
}else{setTimeout(()=>gradientToasts.welcome(),1000)}
