/* ==========================================================================
   MURTZENG AVIONICS - Core Engine
   ========================================================================== */

window.addEventListener('load', () => {
    const loadFill = document.getElementById('loadFill');
    let width = 0;
    
    const interval = setInterval(() => {
        if (width >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                const preloader = document.getElementById('preloader');
                if (preloader) {
                    preloader.style.opacity = '0';
                    setTimeout(() => preloader.style.display = 'none', 500);
                }
            }, 200);
        } else {
            width += 10;
            if (loadFill) loadFill.style.width = width + '%';
        }
    }, 25);
    
    // Güvenlik Önlemi: Max 1.2 sn içinde açılır
    setTimeout(() => {
        const preloader = document.getElementById('preloader');
        if (preloader) preloader.style.display = 'none';
    }, 1200);
});
