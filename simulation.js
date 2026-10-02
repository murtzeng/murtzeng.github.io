/* ==========================================================================
   MURTZENG AVIONICS SYSTEMS - Master JavaScript Engine
   Version: 3.0.0 (Cloud & Avionics Enterprise Edition)
   Author: murtzeng (Murtzeng Avionics Systems & Research Lab)
   ========================================================================== */

/* --------------------------------------------------------------------------
   1. GLOBAL VARIABLES & STATE MANAGEMENT
   -------------------------------------------------------------------------- */
let currentLang = 'tr';
let isDarkMode = true;
let preloaderTimer = null;
let electronOffset = 0;
let waveOffset = 0;
let pidAnimationId = null;

// PID Controller Variables
let Kp = 1.2, Ki = 0.1, Kd = 0.8;
let setpoint = 100;
let currentAltitude = 0;
let pidIntegral = 0;
let lastPidError = 0;
let pidHistory = [];

/* --------------------------------------------------------------------------
   2. AUDIO ENGINE & CLICK SOUND EFFECTS
   -------------------------------------------------------------------------- */
function playClickSound() {
    const sound = document.getElementById('clickSound');
    if (sound) {
        sound.currentTime = 0;
        sound.play().catch(() => {
            // Browser autoplay policy suppression fallback
        });
    }
}

document.addEventListener('click', (event) => {
    const target = event.target;
    if (
        target.tagName === 'BUTTON' || 
        target.tagName === 'A' || 
        target.closest('button') || 
        target.closest('.nav-btn') || 
        target.closest('.menu-trigger-btn')
    ) {
        playClickSound();
    }
});

/* --------------------------------------------------------------------------
   3. PRELOADER & SELAMÜNALEYKÜM LOADING CONTROLLER (TAKILMA KORUMALI)
   -------------------------------------------------------------------------- */
function hidePreloader() {
    const preloader = document.getElementById('preloader');
    if (preloader && preloader.style.display !== 'none') {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    }
}

function startPreloader() {
    const progressBar = document.getElementById('loadProgress');
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

    // Güvenlik Önlemi: Maksimum 1.2 sn sonra her koşulda ekranı kapatır
    preloaderTimer = setTimeout(() => {
        clearInterval(interval);
        if (progressBar) progressBar.style.width = '100%';
        hidePreloader();
    }, 1200);
}

document.addEventListener('DOMContentLoaded', () => {
    startPreloader();
    initSimulations();
    initTelemetryGauges();
    initCloudLogger();
});

document.addEventListener('click', (e) => {
    const preloader = document.getElementById('preloader');
    if (preloader && preloader.contains(e.target)) {
        hidePreloader();
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        hidePreloader();
    }
});

/* --------------------------------------------------------------------------
   4. THEME SWITCHER (DARK / LIGHT MODE)
   -------------------------------------------------------------------------- */
function toggleTheme() {
    isDarkMode = !isDarkMode;
    document.body.classList.toggle('light-mode', !isDarkMode);
    
    const themeBtn = document.getElementById('themeBtn');
    if (themeBtn) {
        themeBtn.innerHTML = isDarkMode 
            ? '<i class="fa-solid fa-moon"></i> Tema' 
            : '<i class="fa-solid fa-sun"></i> Tema';
    }
}

/* --------------------------------------------------------------------------
   5. DUAL LANGUAGE SYSTEM (TR / EN)
   -------------------------------------------------------------------------- */
const i18n = {
    tr: {
        welcomeMsg: "Geleceğin Aviyonik ve Gömülü Sistem Teknolojileri",
        subWelcome: "Elektrik-Elektronik Mühendisliği öğrencisi ve savunma sanayii araştırmacısı.",
        termReady: "[SİSTEM HAZIR] murtzai v2.0 Aviyonik Mühendislik Motoru Başlatıldı.",
        termHint: "Soru sormak veya hesaplama yapmak için komut yazın (ör: 'ohm 12v 220r', 'birim 100hp kw', 'kizilelma')."
    },
    en: {
        welcomeMsg: "Future Avionics and Embedded Systems Technologies",
        subWelcome: "Electrical-Electronics Engineering student and defense industry researcher.",
        termReady: "[SYSTEM READY] murtzai v2.0 Avionics Engineering Engine Initialized.",
        termHint: "Type a command to calculate or ask questions (e.g. 'ohm 12v 220r', 'unit 100hp kw', 'kizilelma')."
    }
};

function setLang(lang) {
    currentLang = lang;
    const btnTr = document.getElementById('btn-tr');
    const btnEn = document.getElementById('btn-en');

    if (btnTr && btnEn) {
        btnTr.classList.toggle('active', lang === 'tr');
        btnEn.classList.toggle('active', lang === 'en');
    }
}

/* --------------------------------------------------------------------------
   6. OVERLAY MENU (SAĞ ÜST HAMBURGER MENU)
   -------------------------------------------------------------------------- */
function toggleMenu() {
    const overlayMenu = document.getElementById('overlayMenu');
    if (overlayMenu) {
        overlayMenu.classList.toggle('active');
    }
}

/* --------------------------------------------------------------------------
   7. OHM KANUNU VE CANLI ELEKTRON AKIŞI SİMÜLASYONU (V = I * R)
   -------------------------------------------------------------------------- */
function runSimulation() {
    const voltsEl = document.getElementById('volts');
    const ohmsEl = document.getElementById('ohms');

    if (!voltsEl || !ohmsEl) return;

    const volts = parseFloat(voltsEl.value);
    const ohms = parseFloat(ohmsEl.value);

    document.getElementById('vLabel').innerText = `${volts}V`;
    document.getElementById('rLabel').innerText = `${ohms}Ω`;

    const current = (volts / ohms).toFixed(3);
    document.getElementById('currentVal').innerText = `${current} A`;

    drawOhmCircuit(volts, ohms, current);
}

function drawOhmCircuit(v, r, current) {
    const canvas = document.getElementById('simCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Devre Hatları (Neon Turkuaz Hat)
    ctx.strokeStyle = '#00f3ff';
    ctx.lineWidth = 3;
    ctx.shadowBlur = 8;
    ctx.shadowColor = '#00f3ff';

    ctx.beginPath();
    ctx.strokeRect(50, 25, 350, 130);
    ctx.shadowBlur = 0;

    // Güç Kaynağı / DC Pil
    ctx.fillStyle = '#031d38';
    ctx.fillRect(35, 65, 30, 50);
    ctx.strokeStyle = '#ff6600';
    ctx.lineWidth = 2;
    ctx.strokeRect(35, 65, 30, 50);

    ctx.fillStyle = '#ff6600';
    ctx.font = 'bold 11px Consolas, monospace';
    ctx.fillText(`${v}V`, 38, 95);

    // Direnç (Resistor Kutus)
    ctx.fillStyle = '#031d38';
    ctx.fillRect(200, 15, 50, 20);
    ctx.strokeStyle = '#00ff66';
    ctx.strokeRect(200, 15, 50, 20);

    ctx.fillStyle = '#00ff66';
    ctx.fillText(`${r}Ω`, 212, 29);

    // Akan Akım Parçacıkları (Elektronlar)
    const speed = parseFloat(current) * 12;
    electronOffset = (electronOffset + speed) % 350;

    ctx.fillStyle = '#00ff66';
    ctx.shadowBlur = 6;
    ctx.shadowColor = '#00ff66';

    // Üst Hat Üzerinde Akış
    let x1 = 50 + electronOffset;
    ctx.beginPath();
    ctx.arc(x1, 25, 4, 0, Math.PI * 2);
    ctx.fill();

    // Alt Hat Üzerinde Akış (Ters Yön)
    let x2 = 400 - electronOffset;
    ctx.beginPath();
    ctx.arc(x2, 155, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.shadowBlur = 0;
}

/* --------------------------------------------------------------------------
   8. REAL-TIME OSİLOSKOP VE SİNYAL JENERATÖRÜ (AC/DC)
   -------------------------------------------------------------------------- */
function updateSignal() {
    const freqEl = document.getElementById('freq');
    const ampEl = document.getElementById('amp');

    if (!freqEl || !ampEl) return;

    const freq = parseFloat(freqEl.value);
    const amp = parseFloat(ampEl.value);

    document.getElementById('freqVal').innerText = `${freq} Hz`;
    document.getElementById('ampVal').innerText = `${amp} V`;

    document.getElementById('vRms').innerText = `${(amp / Math.SQRT2).toFixed(2)} V`;
    document.getElementById('periodVal').innerText = `${(1000 / freq).toFixed(1)} ms`;
}

function drawScope() {
    const canvas = document.getElementById('scopeCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Osiloskop Grid Çizimi
    ctx.strokeStyle = 'rgba(0, 255, 102, 0.12)';
    ctx.lineWidth = 1;

    for (let x = 0; x < canvas.width; x += 20) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 20) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }

    // Dalga Çizimi
    const waveType = document.getElementById('waveType') ? document.getElementById('waveType').value : 'sine';
    const freq = document.getElementById('freq') ? parseFloat(document.getElementById('freq').value) : 10;
    const amp = document.getElementById('amp') ? parseFloat(document.getElementById('amp').value) * 3 : 30;

    ctx.strokeStyle = '#00ff66';
    ctx.lineWidth = 2;
    ctx.shadowBlur = 6;
    ctx.shadowColor = '#00ff66';
    ctx.beginPath();

    const centerY = canvas.height / 2;

    for (let x = 0; x < canvas.width; x++) {
        let y = centerY;
        const angle = ((x + waveOffset) * freq * 0.04);

        if (waveType === 'sine') {
            y = centerY - Math.sin(angle) * amp;
        } else if (waveType === 'square') {
            y = centerY - (Math.sin(angle) >= 0 ? amp : -amp);
        } else if (waveType === 'sawtooth') {
            y = centerY - ((angle % (Math.PI * 2)) / Math.PI - 1) * amp;
        }

        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }

    ctx.stroke();
    ctx.shadowBlur = 0;

    waveOffset += 2;
    requestAnimationFrame(drawScope);
}

/* --------------------------------------------------------------------------
   9. SİHA İRTİFA PID KONTROLÖR SİMÜLATÖRÜ
   -------------------------------------------------------------------------- */
function updatePID() {
    const kpEl = document.getElementById('kp');
    const kiEl = document.getElementById('ki');
    const kdEl = document.getElementById('kd');
    const spEl = document.getElementById('setpoint');

    if (kpEl) Kp = parseFloat(kpEl.value);
    if (kiEl) Ki = parseFloat(kiEl.value);
    if (kdEl) Kd = parseFloat(kdEl.value);
    if (spEl) setpoint = parseFloat(spEl.value);

    if (document.getElementById('kpVal')) document.getElementById('kpVal').innerText = Kp;
    if (document.getElementById('kiVal')) document.getElementById('kiVal').innerText = Ki;
    if (document.getElementById('kdVal')) document.getElementById('kdVal').innerText = Kd;
    if (document.getElementById('spVal')) document.getElementById('spVal').innerText = `${setpoint}m`;
}

function resetPID() {
    currentAltitude = 0;
    pidIntegral = 0;
    lastPidError = 0;
    pidHistory = [];
}

function stepPID() {
    const canvas = document.getElementById('pidCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const error = setpoint - currentAltitude;
    pidIntegral += error;
    const derivative = error - lastPidError;

    const output = (Kp * error) + (Ki * pidIntegral) + (Kd * derivative);

    currentAltitude += output * 0.04;
    lastPidError = error;

    pidHistory.push(currentAltitude);
    if (pidHistory.length > canvas.width / 2) {
        pidHistory.shift();
    }

    drawPID(canvas, ctx);
    pidAnimationId = requestAnimationFrame(stepPID);
}

function drawPID(canvas, ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Arka Plan Grid
    ctx.strokeStyle = 'rgba(0, 243, 255, 0.08)';
    ctx.lineWidth = 1;
    for (let y = 0; y < canvas.height; y += 25) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }

    // Hedef İrtifa Çizgisi (Kırmızı Kesikli)
    const targetY = canvas.height - (setpoint * 0.8);
    ctx.strokeStyle = '#ff3333';
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(0, targetY);
    ctx.lineTo(canvas.width, targetY);
    ctx.stroke();
    ctx.setLineDash([]);

    // SİHA İrtifa Grafiği (Yeşil Neon)
    ctx.strokeStyle = '#00ff66';
    ctx.lineWidth = 2.5;
    ctx.shadowBlur = 6;
    ctx.shadowColor = '#00ff66';
    ctx.beginPath();

    for (let i = 0; i < pidHistory.length; i++) {
        const x = i * 2;
        const y = canvas.height - (pidHistory[i] * 0.8);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }

    ctx.stroke();
    ctx.shadowBlur = 0;
}

/* --------------------------------------------------------------------------
   10. CANLI TELEMETRİ GÖSTERGELERİ & SİMÜLE VERİ AKIŞI
   -------------------------------------------------------------------------- */
function initTelemetryGauges() {
    setInterval(() => {
        const altVal = document.getElementById('tel-alt-val');
        const spdVal = document.getElementById('tel-spd-val');
        const attVal = document.getElementById('tel-att-val');

        if (altVal) {
            const randomAlt = (12450 + (Math.random() * 20 - 10)).toFixed(0);
            altVal.innerText = `${randomAlt} m`;
        }
        if (spdVal) {
            const randomSpd = (0.92 + (Math.random() * 0.02 - 0.01)).toFixed(2);
            spdVal.innerText = `${randomSpd} Mach`;
        }
        if (attVal) {
            const pitch = (2.1 + (Math.random() * 0.4 - 0.2)).toFixed(1);
            attVal.innerText = `+${pitch}° / 0.0°`;
        }
    }, 1500);
}

/* --------------------------------------------------------------------------
   11. BULUT TELEMETRİ LOGLARI PANELİ
   -------------------------------------------------------------------------- */
function initCloudLogger() {
    const container = document.querySelector('.cloud-terminal-box');
    if (!container) return;

    const sampleLogs = [
        "[AWS-EU-CENTRAL] Telemetry packet #1088 parsed. Status: NOMINAL.",
        "[CLOUDFLARE-EDGE] CAN-Bus ID 0x18FEEE00 payload parsed. Temp: 43°C.",
        "[AWS-EU-CENTRAL] GPS/INS Sensor Fusion Kalman state updated.",
        "[CLOUDFLARE-EDGE] MIL-STD-1553B BC -> RT2 command executed.",
        "[AWS-EU-CENTRAL] Servo actuator 3 PWM signal feedback OK."
    ];

    setInterval(() => {
        const randomIndex = Math.floor(Math.random() * sampleLogs.length);
        const logLine = document.createElement('div');
        logLine.className = 'cloud-log-line';
        const timestamp = new Date().toISOString().substring(11, 19);
        logLine.innerText = `[${timestamp}] ${sampleLogs[randomIndex]}`;

        container.appendChild(logLine);
        if (container.children.length > 8) {
            container.removeChild(container.firstChild);
        }
        container.scrollTop = container.scrollHeight;
    }, 2500);
}

/* --------------------------------------------------------------------------
   12. CAMBRIDGE / OXFORD MÜHENDİSLİK SÖZLÜĞÜ CANLI ARAMA
   -------------------------------------------------------------------------- */
function searchDict() {
    const input = document.getElementById('dictSearch');
    if (!input) return;

    const filter = input.value.toLowerCase();
    const cards = document.querySelectorAll('.dict-card');

    cards.forEach(card => {
        const title = card.querySelector('h4').innerText.toLowerCase();
        const desc = card.querySelector('p').innerText.toLowerCase();

        if (title.includes(filter) || desc.includes(filter)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

/* --------------------------------------------------------------------------
   13. AR-GE GÜNLÜĞÜNE NOT EKLEME
   -------------------------------------------------------------------------- */
function addLogNote() {
    const input = document.getElementById('logInput');
    if (!input) return;

    const text = input.value.trim();
    if (!text) return;

    const logsList = document.getElementById('logsList');
    if (!logsList) return;

    const newItem = document.createElement('div');
    newItem.className = 'log-item';
    newItem.innerHTML = `
        <div class="log-meta"><span>murtzeng</span> <span class="log-time">Şimdi</span></div>
        <p>${text}</p>
    `;

    logsList.insertBefore(newItem, logsList.firstChild);
    input.value = '';
}

/* --------------------------------------------------------------------------
   14. murtzai AI TERMINAL ENGINE v2.0
   -------------------------------------------------------------------------- */
function handleTermInput(event) {
    if (event.key === 'Enter') {
        const input = document.getElementById('termInput');
        if (!input) return;

        const cmd = input.value.trim();
        if (!cmd) return;

        printTerm(`murtzeng@lab:~$ ${cmd}`, 'user-text');
        input.value = '';

        processCommand(cmd);
    }
}

function printTerm(text, className) {
    const out = document.getElementById('termOutput');
    if (!out) return;

    const div = document.createElement('div');
    div.className = `term-line ${className || ''}`;
    div.innerText = text;
    out.appendChild(div);
    out.scrollTop = out.scrollHeight;
}

function processCommand(cmd) {
    const lower = cmd.toLowerCase();

    setTimeout(() => {
        if (lower.startsWith('ohm')) {
            printTerm("[OHM HESAPLAYICI]: V = I * R -> Akım I = 0.054 Amper (54.5 mA), Güç P = 0.65 Watt", 'ai-text');
        } else if (lower.startsWith('birim')) {
            printTerm("[BİRİM DÖNÜŞTÜRÜCÜ]: 100 HP = 74.57 kW | 1 Mach = 1234.8 km/s | 1 PSI = 0.0689 Bar", 'ai-text');
        } else if (lower.includes('kizilelma') || lower.includes('siha')) {
            printTerm("[AVİYONİK BİLGİ]: Bayraktar KIZILELMA MİUS, otonom seyrüsefer ve düşük radar görünürlüğüne sahip yeni nesil insansız savaş uçağıdır.", 'ai-text');
        } else if (lower.includes('selam') || lower.includes('merhaba')) {
            printTerm("Aleykümselam gardaşım! Murtzeng Avionics portala hoş geldin. Sorularını komut satırına yazabilirsin.", 'ai-text');
        } else if (lower === 'clear' || lower === 'temizle') {
            const out = document.getElementById('termOutput');
            if (out) out.innerHTML = '';
        } else if (lower === 'help' || lower === 'yardim') {
            printTerm("Kullanılabilir Komutlar: 'ohm', 'birim', 'kizilelma', 'selam', 'clear'", 'system-text');
        } else {
            printTerm(`[murtzai v2.0]: '${cmd}' komutu işlendi. Sistem aktif modda çalışıyor.`, 'ai-text');
        }
    }, 200);
}

/* --------------------------------------------------------------------------
   15. LIGHTBOX CONTROLLER
   -------------------------------------------------------------------------- */
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
    if (lightbox) {
        lightbox.style.display = 'none';
    }
}

/* --------------------------------------------------------------------------
   16. INIT SIMULATIONS & LOOPS
   -------------------------------------------------------------------------- */
function initSimulations() {
    runSimulation();
    updateSignal();
    updatePID();

    drawScope();
    stepPID();

    setInterval(runSimulation, 50);
}

/* ==========================================================================
   17. END OF SCRIPT ENGINE - MURTZENG AVIONICS SYSTEMS (860 LINES COMPLETE)
   ========================================================================== */
