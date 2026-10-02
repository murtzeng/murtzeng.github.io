// Preloader Progress Bar ve Ekran Kapatma Mantığı
window.addEventListener('load', () => {
    const progressBar = document.getElementById('progressBar');
    let width = 0;
    
    const interval = setInterval(() => {
        if (width >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                const preloader = document.getElementById('preloader');
                preloader.style.opacity = '0';
                setTimeout(() => preloader.style.display = 'none', 600);
            }, 300);
        } else {
            width += 5;
            progressBar.style.width = width + '%';
        }
    }, 20);
});
