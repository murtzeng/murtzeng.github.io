/* ==========================================================================
   MURTZENG AVIONICS SYSTEMS - Advanced Circuit & PID Simulation Engine
   ========================================================================== */

// --------------------------------------------------------------------------
// 1. OHM KANUNU VE CANLI ELEKTRON AKIŞI SİMÜLASYONU (V = I * R)
// --------------------------------------------------------------------------
const simCanvas = document.getElementById('simCanvas');
const simCtx = simCanvas ? simCanvas.getContext('2d') : null;
let electronParticleOffset = 0;

function runSimulation() {
    const voltsInput = document.getElementById('volts');
    const ohmsInput = document.getElementById('ohms');

    if (!voltsInput || !ohmsInput) return;

    const volts = parseFloat(voltsInput.value);
    const ohms = parseFloat(ohmsInput.value);

    const vLabel = document.getElementById('vLabel');
    const rLabel = document.getElementById('rLabel');
    const currentVal = document.getElementById('currentVal');

    if (vLabel) vLabel.innerText = `${volts}V`;
    if (rLabel) rLabel.innerText = `${ohms}Ω`;

    // Ohm Kanunu: I = V / R (Amper)
    const current = (volts / ohms).toFixed(3);
    if (currentVal) currentVal.innerText = `${current} A`;

    drawOhmCircuit(volts, ohms, current);
}

function drawOhmCircuit(v, r, current) {
    if (!simCtx || !simCanvas) return;

    simCtx.clearRect(0, 0, simCanvas.width, simCanvas.height);

    // Devre Kabloları (Neon Turkuaz Hat)
    simCtx.strokeStyle = '#00f3ff';
    simCtx.lineWidth = 4;
    simCtx.shadowBlur = 10;
    simCtx.shadowColor = '#00f3ff';

    simCtx.beginPath();
    simCtx.strokeRect(60, 30, 380, 140);
    simCtx.shadowBlur = 0;

    // Güç Kaynağı / Pil (Turuncu Kutu)
    simCtx.fillStyle = '#031d38';
    simCtx.fillRect(40, 75, 40, 50);
    simCtx.strokeStyle = '#ff6600';
    simCtx.lineWidth = 2;
    simCtx.strokeRect(40, 75, 40, 50);

    simCtx.fillStyle = '#ff6600';
    simCtx.font = 'bold 12px Consolas, monospace';
    simCtx.fillText(`${v}V DC`, 42, 105);

    // Direnç (Resistor - Yeşil Kutu)
    simCtx.fillStyle = '#031d38';
    simCtx.fillRect(220, 20, 60, 20);
    simCtx.strokeStyle = '#00ff66';
    simCtx.strokeRect(220, 20, 60, 20);

    simCtx.fillStyle = '#00ff66';
    simCtx.fillText(`${r}Ω`, 235, 35);

    // Akan Akım Parçacıkları (Elektronlar)
    const speed = parseFloat(current) * 15;
    electronParticleOffset = (electronParticleOffset + speed) % 380;

    simCtx.fillStyle = '#00ff66';
    simCtx.shadowBlur = 8;
    simCtx.shadowColor = '#00ff66';

    // Üst Kablo Üzerinde Akış
    let x1 = 60 + electronParticleOffset;
    simCtx.beginPath();
    simCtx.arc(x1, 30, 5, 0, Math.PI * 2);
    simCtx.fill();

    // Alt Kablo Üzerinde Akış (Ters Yön)
    let x2 = 440 - electronParticleOffset;
    simCtx.beginPath();
    simCtx.arc(x2, 170, 5, 0, Math.PI * 2);
    simCtx.fill();

    simCtx.shadowBlur = 0;
}

// --------------------------------------------------------------------------
// 2. REAL-TIME OSİLOSKOP VE SİNYAL JENERATÖRÜ (AC/DC)
// --------------------------------------------------------------------------
const scopeCanvas = document.getElementById('scopeCanvas');
const scopeCtx = scopeCanvas ? scopeCanvas.getContext('2d') : null;
let waveOffset = 0;

function updateSignal() {
    const freqInput = document.getElementById('freq');
    const ampInput = document.getElementById('amp');

    if (!freqInput || !ampInput) return;

    const freq = parseFloat(freqInput.value);
    const amp = parseFloat(ampInput.value);

    const freqVal = document.getElementById('freqVal');
    const ampVal = document.getElementById('ampVal');
    const vRms = document.getElementById('vRms');
    const periodVal = document.getElementById('periodVal');

    if (freqVal) freqVal.innerText = `${freq} Hz`;
    if (ampVal) ampVal.innerText = `${amp} V`;

    if (vRms) vRms.innerText = `${(amp / Math.SQRT2).toFixed(2)} V`;
    if (periodVal) periodVal.innerText = `${(1000 / freq).toFixed(1)} ms`;
}

function drawScope() {
    if (!scopeCtx || !scopeCanvas) return;

    scopeCtx.clearRect(0, 0, scopeCanvas.width, scopeCanvas.height);

    // Izgara Çizimi (Grid)
    scopeCtx.strokeStyle = 'rgba(0, 255, 102, 0.12)';
    scopeCtx.lineWidth = 1;

    for (let x = 0; x < scopeCanvas.width; x += 20) {
        scopeCtx.beginPath();
        scopeCtx.moveTo(x, 0);
        scopeCtx.lineTo(x, scopeCanvas.height);
        scopeCtx.stroke();
    }
    for (let y = 0; y < scopeCanvas.height; y += 20) {
        scopeCtx.beginPath();
        scopeCtx.moveTo(0, y);
        scopeCtx.lineTo(scopeCanvas.width, y);
        scopeCtx.stroke();
    }

    // Dalga Formu Çizimi
    const waveTypeEl = document.getElementById('waveType');
    const freqEl = document.getElementById('freq');
    const ampEl = document.getElementById('amp');

    const type = waveTypeEl ? waveTypeEl.value : 'sine';
    const freq = freqEl ? parseFloat(freqEl.value) : 10;
    const amp = ampEl ? parseFloat(ampEl.value) * 3.5 : 30;

    scopeCtx.strokeStyle = '#00ff66';
    scopeCtx.lineWidth = 2.5;
    scopeCtx.shadowBlur = 8;
    scopeCtx.shadowColor = '#00ff66';
    scopeCtx.beginPath();

    const centerY = scopeCanvas.height / 2;

    for (let x = 0; x < scopeCanvas.width; x++) {
        let y = centerY;
        const angle = ((x + waveOffset) * freq * 0.04);

        if (type === 'sine') {
            y = centerY - Math.sin(angle) * amp;
        } else if (type === 'square') {
            y = centerY - (Math.sin(angle) >= 0 ? amp : -amp);
        } else if (type === 'sawtooth') {
            y = centerY - ((angle % (Math.PI * 2)) / Math.PI - 1) * amp;
        }

        if (x === 0) scopeCtx.moveTo(x, y);
        else scopeCtx.lineTo(x, y);
    }

    scopeCtx.stroke();
    scopeCtx.shadowBlur = 0;

    waveOffset += 2;
    requestAnimationFrame(drawScope);
}

// --------------------------------------------------------------------------
// 3. SİHA İRTİFA PID KONTROLÖR SİMÜLATÖRÜ
// --------------------------------------------------------------------------
const pidCanvas = document.getElementById('pidCanvas');
const pidCtx = pidCanvas ? pidCanvas.getContext('2d') : null;

let Kp = 1.2, Ki = 0.1, Kd = 0.8;
let pidSetpoint = 100;
let currentAlt = 0;
let pidIntegral = 0;
let lastError = 0;
let pidHistory = [];

function updatePID() {
    const kpEl = document.getElementById('kp');
    const kiEl = document.getElementById('ki');
    const kdEl = document.getElementById('kd');
    const spEl = document.getElementById('setpoint');

    if (kpEl) Kp = parseFloat(kpEl.value);
    if (kiEl) Ki = parseFloat(kiEl.value);
    if (kdEl) Kd = parseFloat(kdEl.value);
    if (spEl) pidSetpoint = parseFloat(spEl.value);

    if (document.getElementById('kpVal')) document.getElementById('kpVal').innerText = Kp;
    if (document.getElementById('kiVal')) document.getElementById('kiVal').innerText = Ki;
    if (document.getElementById('kdVal')) document.getElementById('kdVal').innerText = Kd;
    if (document.getElementById('spVal')) document.getElementById('spVal').innerText = `${pidSetpoint}m`;
}

function resetPID() {
    currentAlt = 0;
    pidIntegral = 0;
    lastError = 0;
    pidHistory = [];
}

function stepPID() {
    if (!pidCtx || !pidCanvas) return;

    const error = pidSetpoint - currentAlt;
    pidIntegral += error;
    const derivative = error - lastError;

    const output = (Kp * error) + (Ki * pidIntegral) + (Kd * derivative);

    currentAlt += output * 0.04;
    lastError = error;

    pidHistory.push(currentAlt);
    if (pidHistory.length > pidCanvas.width / 2) {
        pidHistory.shift();
    }

    drawPID();
    requestAnimationFrame(stepPID);
}

function drawPID() {
    pidCtx.clearRect(0, 0, pidCanvas.width, pidCanvas.height);

    // Arka Plan Izgarası
    pidCtx.strokeStyle = 'rgba(0, 243, 255, 0.08)';
    pidCtx.lineWidth = 1;
    for (let y = 0; y < pidCanvas.height; y += 25) {
        pidCtx.beginPath();
        pidCtx.moveTo(0, y);
        pidCtx.lineTo(pidCanvas.width, y);
        pidCtx.stroke();
    }

    // Hedef İrtifa Çizgisi (Kırmızı Kesikli Hat)
    const targetY = pidCanvas.height - (pidSetpoint * 0.8);
    pidCtx.strokeStyle = '#ff3333';
    pidCtx.setLineDash([5, 5]);
    pidCtx.beginPath();
    pidCtx.moveTo(0, targetY);
    pidCtx.lineTo(pidCanvas.width, targetY);
    pidCtx.stroke();
    pidCtx.setLineDash([]);

    // SİHA İrtifa Çizgisi (Yeşil Neon)
    pidCtx.strokeStyle = '#00ff66';
    pidCtx.lineWidth = 2.5;
    pidCtx.shadowBlur = 8;
    pidCtx.shadowColor = '#00ff66';
    pidCtx.beginPath();

    for (let i = 0; i < pidHistory.length; i++) {
        const x = i * 2;
        const y = pidCanvas.height - (pidHistory[i] * 0.8);
        if (i === 0) pidCtx.moveTo(x, y);
        else pidCtx.lineTo(x, y);
    }

    pidCtx.stroke();
    pidCtx.shadowBlur = 0;
}

// --------------------------------------------------------------------------
// DÖNGÜLERİ VE BAŞLANGIÇ AYARLARINI BAŞLAT
// --------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    runSimulation();
    updateSignal();
    updatePID();

    if (scopeCanvas) drawScope();
    if (pidCanvas) stepPID();

    // Devre simülasyonu sürekli güncel kalsın
    setInterval(runSimulation, 40);
});
