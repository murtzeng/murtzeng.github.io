/* ==========================================================================
   MURTZENG AVIONICS SYSTEMS - Master Script Engine
   ========================================================================== */

// 1. TUŞ SESİ EFEKTİ (CLICK SOUND)
function playClickSound() {
    const sound = document.getElementById('clickSound');
    if (sound) {
        sound.currentTime = 0;
        sound.play().catch(() => {});
    }
}

document.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON' || e.target.tagName === 'A' || e.target.closest('button')) {
        playClickSound();
    }
});

// 2. PRELOADER & YÜKLEME EKRANI KONTROLÜ
function hidePreloader() {
    const preloader = document.getElementById('preloader');
    if (preloader && preloader.style.display !== 'none') {
        preloader.style.opacity = '0';
        setTimeout(() => { preloader.style.display = 'none'; }, 500);
    }
}

function startPreloader() {
    const progressBar = document.getElementById('progressBar');
    let width = 0;

    const interval = setInterval(() => {
        if (width >= 100) {
            clearInterval(interval);
            hidePreloader();
        } else {
            width += 10;
            if (progressBar) progressBar.style.width = width + '%';
        }
    }, 30);

    // Güvenlik zamanlayıcısı (Maksimum 1.2 sn)
    setTimeout(() => {
        clearInterval(interval);
        if (progressBar) progressBar.style.width = '100%';
        hidePreloader();
    }, 1200);
}

document.addEventListener('DOMContentLoaded', startPreloader);

// 3. AYDINLIK / KARANLIK MOD (THEME TOGGLE)
function toggleTheme() {
    document.body.classList.toggle('light-mode');
    const icon = document.getElementById('themeIcon');
    if (document.body.classList.contains('light-mode')) {
        icon.className = 'fa-solid fa-sun';
    } else {
        icon.className = 'fa-solid fa-moon';
    }
}

// 4. SAĞ ÜST ÜÇ ÇİZGİ MENÜ
function toggleMenu() {
    const menu = document.getElementById('overlayMenu');
    menu.classList.toggle('active');
}

// 5. LIGHTBOX (RESİM BÜYÜTME)
function openLightbox(src) {
    const box = document.getElementById('lightbox');
    const img = document.getElementById('lightboxImg');
    img.src = src;
    box.style.display = 'flex';
}Gardaşım, hiç merak etme! Sitenin görsel tasarımlarını, dairesel logo animasyonunu, tuş seslerini, aydınlık/karanlık mod geçişini ve **murtzai** asistanını tam olarak çalıştıracak kalan iki ana dosyayı (**`style.css`** ve **`script.js`**) aşağıda eksiksiz şekilde veriyorum.

---

### 1. `style.css` (Tüm Renkler, Efektler, Amblem Animasyonu ve Stiller)

```css
/* ==========================================================================
   MURTZENG AVIONICS SYSTEMS - Master Theme Style
   Colors: Lacivert (#031d38), Mavi (#0b4375), Kırmızı (#b31217), 
           Turkuaz (#00f3ff), Turuncu (#ff6600), Yeşil (#00ff66)
   ========================================================================== */

:root {
    --bg-dark: #030810;
    --card-dark: rgba(10, 20, 35, 0.85);
    --text-dark: #e0e8f0;
    --lacivert: #031d38;
    --mavi: #0b4375;
    --kirmizi: #b31217;
    --turquois: #00f3ff;
    --orange: #ff6600;
    --green: #00ff66;
}

body.light-mode {
    --bg-dark: #f0f4f8;
    --card-dark: #ffffff;
    --text-dark: #1a2530;
}

* { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Segoe UI', Arial, sans-serif; }

body {
    background-color: var(--bg-dark);
    color: var(--text-dark);
    min-width: 1200px; /* Bilgisayar formatı geniş ekran */
    transition: background 0.3s, color 0.3s;
    overflow-x: hidden;
}

/* --- PRELOADER (SELAMÜNALEYKÜM YÜKLEME EKRANI) --- */
#preloader {
    position: fixed;
    top: 0; left: 0; width: 100vw; height: 100vh;
    background: var(--lacivert);
    display: flex; justify-content: center; align-items: center;
    z-index: 99999; color: #fff; transition: opacity 0.5s ease;
}

.loader-content { text-align: center; }
.greeting-text { font-size: 2.5rem; font-weight: bold; color: var(--turquois); margin-bottom: 20px; text-shadow: 0 0 15px var(--turquois); }

.spinning-ring-logo {
    animation: rotateLogo 15s linear infinite;
}

.ring-text {
    font-size: 10px;
    font-weight: bold;
    fill: var(--turquois);
    letter-spacing: 2px;
}

@keyframes rotateLogo {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.progress-bar-container {
    width: 300px; height: 6px; background: rgba(255,255,255,0.1);
    border-radius: 3px; margin: 20px auto 10px; overflow: hidden;
}

.progress-bar {
    width: 0%; height: 100%; background: var(--orange);
    box-shadow: 0 0 10px var(--orange); transition: width 0.1s linear;
}

.loading-sub { font-size: 0.85rem; color: #a0aab5; }

/* --- ARKA PLAN VİDEOSU --- */
.bg-video-wrapper {
    position: fixed;
    top: 0; left: 0; width: 100vw; height: 100vh;
    z-index: -2; overflow: hidden;
}

#bgVideo {
    width: 100%; height: 100%; object-fit: cover;
}

.video-overlay {
    position: absolute;
    top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(3, 8, 16, 0.85);
}

/* --- NAVBAR & HEADER --- */
.top-nav {
    display: flex; justify-content: space-between; align-items: center;
    padding: 15px 40px; background: rgba(3, 29, 56, 0.9);
    border-bottom: 2px solid var(--turquois); backdrop-filter: blur(8px);
}

.nav-left { display: flex; align-items: center; gap: 20px; }
.welcome-text-box h2 { font-size: 1.4rem; color: #fff; letter-spacing: 1px; }
.welcome-msg { font-size: 0.85rem; color: var(--turquois); }

.nav-right { display: flex; align-items: center; gap: 15px; }
.icon-btn, .menu-btn {
    background: transparent; border: 1px solid var(--turquois); color: var(--turquois);
    padding: 8px 12px; border-radius: 6px; cursor: pointer; font-size: 1.1rem; transition: 0.3s;
}
.icon-btn:hover, .menu-btn:hover { background: var(--turquois); color: #000; }

.lang-switch button {
    background: transparent; border: 1px solid var(--orange); color: #fff;
    padding: 6px 12px; border-radius: 4px; cursor: pointer; font-weight: bold;
}
.lang-switch button.active { background: var(--orange); }

/* --- SAĞ ÜST AÇILIR MENÜ (OVERLAY) --- */
.overlay-menu {
    position: fixed; top: 0; right: -350px; width: 350px; height: 100vh;
    background: var(--lacivert); border-left: 2px solid var(--turquois);
    z-index: 10000; padding: 40px 25px; transition: right 0.4s ease;
}
.overlay-menu.active { right: 0; }
.close-menu-btn { position: absolute; top: 15px; right: 20px; font-size: 2rem; background: none; border: none; color: #fff; cursor: pointer; }

.search-box-menu { display: flex; align-items: center; background: rgba(255,255,255,0.1); padding: 8px 12px; border-radius: 4px; margin: 30px 0 20px; }
.search-box-menu input { background: transparent; border: none; color: #fff; outline: none; width: 100%; }

.menu-links { list-style: none; }
.menu-links li { margin-bottom: 18px; }
.menu-links a { color: #fff; text-decoration: none; font-size: 1.1rem; display: flex; align-items: center; gap: 12px; transition: 0.2s; }
.menu-links a:hover { color: var(--turquois); transform: translateX(5px); }

/* --- WIDGETS & PANEL BOXES --- */
.widget-section { display: flex; gap: 20px; padding: 25px 40px; }
.widget-card {
    flex: 1; background: var(--card-dark); border: 1px solid rgba(0, 243, 255, 0.2);
    padding: 15px 20px; border-radius: 8px; display: flex; align-items: center; gap: 15px;
}
.widget-icon { font-size: 2rem; }
.icon-turquois { color: var(--turquois); } .icon-orange { color: var(--orange); } .icon-green { color: var(--green); }

.slider-container { padding: 10px 40px 25px; }
.slider-container h3 { margin-bottom: 15px; font-size: 1.2rem; }
.image-carousel { display: flex; gap: 20px; overflow-x: auto; padding-bottom: 10px; }
.img-card {
    min-width: 320px; height: 180px; position: relative; border-radius: 8px;
    overflow: hidden; cursor: pointer; border: 1px solid var(--turquois); transition: 0.3s;
}
.img-card:hover { transform: scale(1.02); box-shadow: 0 0 15px var(--turquois); }
.img-card img { width: 100%; height: 100%; object-fit: cover; }
.img-caption {
    position: absolute; bottom: 0; left: 0; width: 100%; background: rgba(0,0,0,0.75);
    color: #fff; padding: 8px; font-size: 0.85rem; text-align: center;
}

/* --- LIGHTBOX (RESİM BÜYÜTME PENCERESİ) --- */
.lightbox {
    display: none; position: fixed; z-index: 999999; top: 0; left: 0;
    width: 100vw; height: 100vh; background: rgba(0,0,0,0.9);
    justify-content: center; align-items: center;
}
.lightbox-content { max-width: 80%; max-height: 80%; border: 2px solid var(--turquois); border-radius: 8px; }
.close-lightbox { position: absolute; top: 20px; right: 40px; color: #fff; font-size: 3rem; cursor: pointer; }

/* --- DEVRE & SÖZLÜK --- */
.main-workspace { padding: 10px 40px 30px; display: flex; flex-direction: column; gap: 25px; }
.panel-box { background: var(--card-dark); padding: 20px; border-radius: 8px; border: 1px solid rgba(0, 243, 255, 0.2); }
.panel-box h2 { font-size: 1.2rem; margin-bottom: 15px; }

.sim-grid { display: flex; gap: 30px; align-items: center; }
#simCanvas { background: #000; border: 1px solid var(--orange); border-radius: 6px; }
.sim-controls { flex: 1; display: flex; flex-direction: column; gap: 15px; }
.sim-controls label { display: flex; justify-content: space-between; font-weight: bold; }
.highlight-green { color: var(--green); font-size: 1.3rem; }

.search-input { width: 100%; padding: 10px; margin-bottom: 15px; background: rgba(0,0,0,0.5); border: 1px solid var(--turquois); color: #fff; border-radius: 4px; }
.dict-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; }
.dict-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,102,0,0.3); padding: 12px; border-radius: 6px; }
.dict-card h4 { color: var(--orange); margin-bottom: 5px; }

/* --- CANLI TEKNOLOJİ HABERLERİ BANTI --- */
.news-ticker-section {
    display: flex; background: var(--lacivert); border-top: 2px solid var(--kirmizi);
    border-bottom: 2px solid var(--kirmizi); padding: 10px 40px; overflow: hidden;
}
.ticker-title { background: var(--kirmizi); color: #fff; padding: 4px 12px; font-weight: bold; font-size: 0.85rem; white-space: nowrap; margin-right: 20px; }
.ticker-content { display: flex; gap: 40px; align-items: center; white-space: nowrap; animation: tickerAnim 20s linear infinite; font-size: 0.9rem; color: var(--green); }
@keyframes tickerAnim { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } }

/* --- AI ASİSTAN (murtzai) --- */
.ai-widget { position: fixed; bottom: 25px; right: 25px; z-index: 9999; }
.ai-trigger {
    background: var(--orange); color: #fff; border: none; padding: 12px 20px;
    border-radius: 25px; font-weight: bold; cursor: pointer; box-shadow: 0 0 15px var(--orange);
    display: flex; align-items: center; gap: 8px;
}
.ai-chat-box {
    display: none; position: absolute; bottom: 55px; right: 0; width: 340px; height: 420px;
    background: var(--lacivert); border: 2px solid var(--turquois); border-radius: 10px;
    flex-direction: column; overflow: hidden; box-shadow: 0 0 20px rgba(0,243,255,0.3);
}
.ai-header { background: var(--turquois); color: #000; padding: 10px; font-weight: bold; display: flex; justify-content: space-between; }
.ai-header button { background: none; border: none; font-size: 1.2rem; cursor: pointer; }
.ai-messages { flex: 1; padding: 12px; overflow-y: auto; display: flex; flex-direction: column; gap: 8px; }
.msg { padding: 8px 12px; border-radius: 6px; font-size: 0.85rem; max-width: 80%; }
.ai-msg { background: rgba(0, 243, 255, 0.15); border: 1px solid var(--turquois); align-self: flex-start; }
.user-msg { background: rgba(255, 102, 0, 0.2); border: 1px solid var(--orange); align-self: flex-end; }
.ai-input-area { display: flex; padding: 8px; background: #000; }
.ai-input-area input { flex: 1; background: transparent; border: none; color: #fff; outline: none; padding: 5px; }
.ai-input-area button { background: var(--turquois); border: none; padding: 6px 10px; cursor: pointer; border-radius: 4px; }

/* --- FOOTER --- */
.main-footer { background: var(--lacivert); padding: 25px; text-align: center; border-top: 2px solid var(--turquois); }
.footer-links { display: flex; justify-content: center; gap: 25px; margin-bottom: 12px; }
.social-link { color: #fff; text-decoration: none; font-weight: bold; transition: 0.3s; }
.social-link.linkedin:hover { color: #0077b5; }
.social-link.github:hover { color: var(--turquois); }
.social-link.mail:hover { color: var(--orange); }
.copyright { font-size: 0.8rem; color: #8090a0; }
