/* ==========================================================================
   murtzeng - Main Script & Interactive Logic
   ========================================================================== */

// Dil Verileri (TR / EN)
const i18n = {
    tr: {
        verseTitle: "Günün Ayeti",
        verseContent: '"Şüphesiz biz her şeyi bir ölçüye göre yarattık." (Kamer, 49)',
        hadithTitle: "Günün Hadisi",
        hadithContent: '"İki nimet vardır ki insanların çoğu onların kıymetini bilmezler: Sağlık ve boş vakit." (Buhârî)',
        heroTitle: "MİLLİ TEKNOLOJİ & SAVUNMA SANAYİİ",
        heroDesc: "Kızılelma, SİHA ve İleri Mühendislik Çözümleri",
        simTitle: "İnteraktif Devre Simülatörü",
        simDesc: "Öğrenciler için gerçek zamanlı gerilim, direnç ve akım test alanı.",
        dictTitle: "Mühendislik Sözlüğü",
        aiWelcome: "Selam gardaşım! Ben murtzai. Mühendislik, projeler veya site hakkında ne sormak istersin?"
    },
    en: {
        verseTitle: "Verse of the Day",
        verseContent: '"Indeed, all things We created with predestination." (Al-Qamar, 49)',
        hadithTitle: "Hadith of the Day",
        hadithContent: '"There are two blessings which many people lose: Health and free time." (Bukhari)',
        heroTitle: "NATIONAL TECHNOLOGY & DEFENSE INDUSTRY",
        heroDesc: "Kizilelma, UCAVs and Advanced Engineering Solutions",
        simTitle: "Interactive Circuit Simulator",
        simDesc: "Real-time voltage, resistance, and current testing platform for students.",
        dictTitle: "Engineering Dictionary",
        aiWelcome: "Greetings! I am murtzai. What would you like to ask about engineering or this portal?"
    }
};

// Mühendislik Sözlüğü Verileri
const dictionaryTerms = [
    { tr: "Aerodinamik", en: "Aerodynamics", desc: "Havanın hareket halindeki cisimlerle etkileşimini inceleyen bilim dalı." },
    { tr: "Telemetri", en: "Telemetry", desc: "Sistem verilerinin uzaktan kablosuz olarak ölçülmesi ve iletilmesi." },
    { tr: "Aviyonik", en: "Avionics", desc: "Hava araçlarında kullanılan elektronik sistemlerin genel adı." },
    { tr: "PWM (Sinyal Genişlik Modülasyonu)", en: "PWM (Pulse Width Modulation)", desc: "Voltajı veya gücü kontrol etmek için kullanılan dijital sinyal tekniği." },
    { tr: "İtki (Thrust)", en: "Thrust", desc: "Bir roket veya jet motorunun ürettiği ileri doğruluktaki itme kuvveti." },
    { tr: "Gömülü Sistem", en: "Embedded System", desc: "Donanım ve yazılımın tek bir amaca hizmet etmek üzere birleştirildiği mikrodenetleyici yapısı." }
];

let currentLang = 'tr';

function setLanguage(lang) {
    currentLang = lang;
    document.getElementById('btn-tr').classList.toggle('active-lang', lang === 'tr');
    document.getElementById('btn-en').classList.toggle('active-lang', lang === 'en');

    document.getElementById('title-verse').innerText = i18n[lang].verseTitle;
    document.getElementById('content-verse').innerText = i18n[lang].verseContent;
    document.getElementById('title-hadith').innerText = i18n[lang].hadithTitle;
    document.getElementById('content-hadith').innerText = i18n[lang].hadithContent;
    document.getElementById('hero-title').innerText = i18n[lang].heroTitle;
    document.getElementById('hero-desc').innerText = i18n[lang].heroDesc;
    document.getElementById('sim-title').innerHTML = `<i class="fa-solid fa-bolt icon-green"></i> ${i18n[lang].simTitle}`;
    document.getElementById('sim-desc').innerText = i18n[lang].simDesc;
    document.getElementById('dict-title').innerHTML = `<i class="fa-solid fa-book-bookmark icon-turquois"></i> ${i18n[lang].dictTitle}`;

    renderDictionary();
}

function renderDictionary(filter = '') {
    const grid = document.getElementById('dictGrid');
    grid.innerHTML = '';

    dictionaryTerms.filter(item => 
        item.tr.toLowerCase().includes(filter.toLowerCase()) || 
        item.en.toLowerCase().includes(filter.toLowerCase())
    ).forEach(item => {
        const card = document.createElement('div');
        card.className = 'dict-card';
        card.innerHTML = `
            <h3>${currentLang === 'tr' ? item.tr : item.en}</h3>
            <p>${item.desc}</p>
        `;
        grid.appendChild(card);
    });
}

function searchDictionary() {
    const query = document.getElementById('dictSearch').value;
    renderDictionary(query);
}

// AI Asistan (murtzai) Mantığı
function toggleAI() {
    const box = document.getElementById('aiChatBox');
    box.style.display = (box.style.display === 'flex') ? 'none' : 'flex';
}

function handleAIPress(event) {
    if (event.key === 'Enter') sendAIMessage();
}

function sendAIMessage() {
    const input = document.getElementById('aiInput');
    const msg = input.value.trim();
    if (!msg) return;

    appendMessage(msg, 'user-msg');
    input.value = '';

    setTimeout(() => {
        let reply = "Mühendislik çalışmalarında başarılar gardaşım! Detaylı soruların için murtzeng portalı her zaman hizmetinde.";
        const lower = msg.toLowerCase();

        if (lower.includes("selam") || lower.includes("merhaba")) {
            reply = "Aleykümselam gardaşım! Hoş geldin, nasıl yardımcı olabilirim?";
        } else if (lower.includes("kızılelma") || lower.includes("siha")) {
            reply = "Kızılelma ve SİHA'larımız Türk milli savunma sanayimizin gururudur! OİS ve otonom yazılımlarla donatılmıştır.";
        } else if (lower.includes("devre") || lower.includes("ohm")) {
            reply = "Devre simülatöründe V = I * R (Ohm Kanunu) kullanılıyor. Gerilim ve direnci kaydırarak akımı test edebilirsin.";
        }

        appendMessage(reply, 'ai-msg');
    }, 600);
}

function appendMessage(text, className) {
    const container = document.getElementById('aiMessages');
    const div = document.createElement('div');
    div.className = `msg ${className}`;
    div.innerText = text;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
}

// Sayfa yüklendiğinde çalıştır
document.addEventListener('DOMContentLoaded', () => {
    renderDictionary();
});
