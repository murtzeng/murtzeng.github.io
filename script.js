/* ==========================================================================
   MURTZENG AVIONICS SYSTEMS - Core Script Engine
   ========================================================================== */

// 1. PRELOADER & SELAMÜNALEYKÜM YÜKLEME KONTROLÜ
function hidePreloader() {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.style.opacity = '0';
        setTimeout(() => preloader.style.display = 'none', 500);
    }
}

window.addEventListener('load', () => {
    const progressBar = document.getElementById('progressBar');
    let width = 0;
    const interval = setInterval(() => {
        if (width >= 100) {
            clearInterval(interval);
            hidePreloader();
        } else {
            width += 15;
            if (progressBar) progressBar.style.width = width + '%';
        }
    }, 20);

    // Güvenlik zamanlayıcısı (Takılmayı önler)
    setTimeout(() => hidePreloader(), 1000);
});

// 2. TUŞ SESİ SES EFEKTİ (CLICK SOUNDS)
function playClickSound() {
    const sound = document.getElementById('clickSound');
    if (sound) {
        sound.currentTime = 0;
        sound.play().catch(() => {}); // Ses engellemesine takılmasın
    }
}

document.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON' || e.target.tagName === 'A' || e.target.closest('button')) {
        playClickSound();
    }
});

// 3. AYDINLIK / KARANLIK MOD GEÇİŞİ
function toggleTheme() {
    document.body.classList.toggle('light-mode');
    const icon = document.getElementById('themeIcon');
    if (document.body.classList.contains('light-mode')) {
        icon.className = 'fa-solid fa-sun';
    } else {
        icon.className = 'fa-solid fa-moon';
    }
}

// 4. SAĞ ÜST AÇILIR MENÜ (HAMBURGER MENU)
function toggleMenu() {
    const menu = document.getElementById('overlayMenu');
    if (menu) menu.classList.toggle('active');
}

// 5. RESİM BÜYÜTME (LIGHTBOX)
function openLightbox(src) {
    const lightbox = document.getElementById('lightbox');
    const img = document.getElementById('lightboxImg');
    if (lightbox && img) {
        img.src = src;
        lightbox.style.display = 'flex';
    }
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (lightbox) lightbox.style.display = 'none';
}

// 6. DEVRE SİMÜLASYONU (V = I * R)
function runSimulation() {
    const volts = parseFloat(document.getElementById('volts').value);
    const ohms = parseFloat(document.getElementById('ohms').value);

    document.getElementById('vLabel').innerText = `${volts}V`;
    document.getElementById('rLabel').innerText = `${ohms}Ω`;

    const current = (volts / ohms).toFixed(3);
    document.getElementById('currentVal').innerText = `${current} A`;

    drawSimulationCanvas(volts, current);
}

function drawSimulationCanvas(v, i) {
    const canvas = document.getElementById('simCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Devre Çerçevesi
    ctx.strokeStyle = '#00f3ff';
    ctx.lineWidth = 3;
    ctx.strokeRect(50, 30, 400, 140);

    // Pil
    ctx.fillStyle = '#ff6600';
    ctx.fillRect(35, 80, 30, 40);
    ctx.fillStyle = '#fff';
    ctx.font = '12px Arial';
    ctx.fillText(`${v}V`, 40, 105);

    // Akan Akım Parçacıkları Animasyonu
    ctx.fillStyle = '#00ff66';
    const offset = (Date.now() * (i * 5)) % 400;
    ctx.beginPath();
    ctx.arc(50 + offset, 30, 5, 0, Math.PI * 2);
    ctx.fill();
}

setInterval(() => {
    const volts = document.getElementById('volts');
    if (volts) runSimulation();
}, 50);

// 7. CAMBRIDGE / OXFORD MÜHENDİSLİK SÖZLÜĞÜ
const terms = [
    { name: "Aerodinamik", desc: "Havanın hareket halindeki cisimlerle olan etkileşimini inceleyen bilim dalı." },
    { name: "Telemetri", desc: "Verilerin kablosuz olarak uzaktaki sistemlere iletilmesi ve ölçülmesi." },
    { name: "Aviyonik", desc: "Hava ve uzay araçlarında kullanılan tüm elektronik sistemlerin genel adı." },
    { name: "PWM (Sinyal Genişlik Mod.)", desc: "Güç iletimini kontrol etmek amacıyla kullanılan dijital sinyal anahtarlama tekniği." },
    { name: "CAN-Bus", desc: "Araç içi elektronik kontrol ünitelerinin birbiriyle haberleşmesini sağlayan veri yolu." },
    { name: "IMU (Ataletsel Ölçüm Ünitesi)", desc: "İvmeölçer ve jiroskop kullanarak konum/açı hesaplayan sensör modülü." }
];

function renderDict(filter = '') {
    const grid = document.getElementById('dictGrid');
    if (!grid) return;
    grid.innerHTML = '';

    terms.filter(t => t.name.toLowerCase().includes(filter.toLowerCase())).forEach(t => {
        const div = document.createElement('div');
        div.className = 'dict-card';
        div.innerHTML = `<h4>${t.name}</h4><p>${t.desc}</p>`;
        grid.appendChild(div);
    });
}

function searchDict() {
    const val = document.getElementById('dictSearch').value;
    renderDict(val);
}

// 8. AI ASİSTAN (murtzai)
function toggleAI() {
    const box = document.getElementById('aiChatBox');
    if (box) box.style.display = (box.style.display === 'flex') ? 'none' : 'flex';
}

function handleAIPress(e) {
    if (e.key === 'Enter') sendAIMessage();
}

function sendAIMessage() {
    const input = document.getElementById('aiInput');
    const msg = input.value.trim();
    if (!msg) return;

    appendMsg(msg, 'user-msg');
    input.value = '';

    setTimeout(() => {
        let reply = "Selamünaleyküm gardaşım! Mühendislik soruların için buradayım.";
        const lower = msg.toLowerCase();
        if (lower.includes("selam")) reply = "Aleykümselam gardaşım! Hoş geldin.";
        else if (lower.includes("devre") || lower.includes("ohm")) reply = "Ohm Kanunu V = I * R formülü ile hesaplanır. Panelden test edebilirsin.";
        
        appendMsg(reply, 'ai-msg');
    }, 500);
}

function appendMsg(text, className) {
    const container = document.getElementById('aiMessages');
    if (!container) return;
    const div = document.createElement('div');
    div.className = `msg ${className}`;
    div.innerText = text;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
}

// Sayfa ilk yüklendiğinde çalışacaklar
document.addEventListener('DOMContentLoaded', () => {
    renderDict();
});
