(function attachThemeSelector(){
  try{
    const select = document.getElementById('theme-select');
    if(!select) return;
    const apply = (mode)=>{
      localStorage.setItem('gradient-theme-mode', mode);
      if(mode==='system'){
        localStorage.removeItem('gradient-theme');
        const systemDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.setAttribute('data-theme', systemDark ? 'dark' : 'light');
        document.body.classList.toggle('dark-mode', systemDark);
      } else {
        localStorage.setItem('gradient-theme', mode);
        document.documentElement.setAttribute('data-theme', mode);
        document.body.classList.toggle('dark-mode', mode==='dark');
      }
    };
    // Initialize selector from storage
    const savedMode = localStorage.getItem('gradient-theme-mode') || 'system';
    select.value = savedMode;
    // Ensure theme reflects current selection immediately on load
    apply(savedMode);
    // Listen to changes
    select.addEventListener('change', (e)=> apply(e.target.value));
    // Follow system when in system mode
    if(window.matchMedia){
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      mq.addEventListener('change', (e)=>{
        if((localStorage.getItem('gradient-theme-mode')||'system')==='system'){
          apply('system');
        }
      });
    }
  }catch(err){ console.warn('Theme selector attach error', err); }
})();
