/* ==========================================================================
   murtzeng - Canvas Interactive Circuit Simulator
   Ohm's Law: I = V / R
   ========================================================================== */

const canvas = document.getElementById('circuitCanvas');
const ctx = canvas.getContext('2d');

let animationFrame;
let particleOffset = 0;

function updateCircuit() {
    const v = parseFloat(document.getElementById('voltage').value);
    const r = parseFloat(document.getElementById('resistance').value);

    document.getElementById('v-val').innerText = `${v}V`;
    document.getElementById('r-val').innerText = `${r}Ω`;

    // Ohm Kanunu: I = V / R (Amper)
    const current = (v / r).toFixed(3);
    document.getElementById('current-val').innerText = `${current} A`;

    drawCircuit(v, r, current);
}

function drawCircuit(v, r, current) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Devre Hatları (Kablolar)
    ctx.strokeStyle = '#00f3ff';
    ctx.lineWidth = 4;
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#00f3ff';

    ctx.beginPath();
    ctx.strokeRect(100, 50, 500, 200);

    // Güç Kaynağı (Pil)
    ctx.fillStyle = '#0a0a0c';
    ctx.fillRect(80, 120, 40, 60);
    ctx.strokeStyle = '#ff6600';
    ctx.strokeRect(80, 120, 40, 60);
    ctx.fillStyle = '#ff6600';
    ctx.font = '14px Arial';
    ctx.fillText(`${v}V DC`, 82, 155);

    // Direnç Sembolü (Resistor)
    ctx.fillStyle = '#0a0a0c';
    ctx.fillRect(320, 40, 60, 20);
    ctx.strokeStyle = '#00ff66';
    ctx.strokeRect(320, 40, 60, 20);
    ctx.fillStyle = '#00ff66';
    ctx.fillText(`${r}Ω`, 335, 55);

    // Akım Parçacıkları (Elektronlar) Animasyonu
    const speed = current * 20; // Akıma göre hız
    particleOffset = (particleOffset + speed) % 500;

    ctx.fillStyle = '#00ff66';
    ctx.shadowColor = '#00ff66';

    // Üst hat üzerinde akan elektronlar
    let x = (100 + particleOffset) % 500 + 100;
    ctx.beginPath();
    ctx.arc(x, 50, 5, 0, Math.PI * 2);
    ctx.fill();

    // Alt hat üzerinde akan elektronlar
    let x2 = 600 - ((particleOffset) % 500);
    ctx.beginPath();
    ctx.arc(x2, 250, 5, 0, Math.PI * 2);
    ctx.fill();

    requestAnimationFrame(() => drawCircuit(v, r, current));
}

// İlk çizim
updateCircuit();
