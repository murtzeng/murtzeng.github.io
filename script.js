document.addEventListener("DOMContentLoaded", () => {
    // DAKTİLO (TYPEWRITER) BAŞLIK ANİMASYONU
    const titleText = "Geleceğin Aviyonik ve Gömülü Sistem Teknolojileri";
    const titleElement = document.getElementById("typewriter-title");

    if (titleElement) {
        let charIndex = 0;
        function typeWriter() {
            if (charIndex < titleText.length) {
                titleElement.textContent += titleText.charAt(charIndex);
                charIndex++;
                setTimeout(typeWriter, 50);
            }
        }
        typeWriter();
    }

    // DİNÂMİK YIL
    const yearSpan = document.getElementById("year");
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();

    // MOBİL MENÜ TOGGLE
    const menuBtn = document.getElementById("menu-btn");
    const navMenu = document.getElementById("nav-menu");
    if (menuBtn && navMenu) {
        menuBtn.addEventListener("click", (e) => { e.stopPropagation(); navMenu.classList.toggle("show"); });
        document.querySelectorAll(".nav-item").forEach(item => item.addEventListener("click", () => navMenu.classList.remove("show")));
    }

    // TEMA SEÇİCİ (LIGHT / DARK MOD)
    const themeBtn = document.getElementById("theme-toggle");
    if (themeBtn) {
        themeBtn.addEventListener("click", () => {
            document.body.classList.toggle("light-theme");
            const icon = themeBtn.querySelector("i");
            if (document.body.classList.contains("light-theme")) {
                icon.className = "fas fa-sun";
            } else {
                icon.className = "fas fa-moon";
            }
        });
    }

    // GÜNÜN ÂYETİ VE HADÎSİ OTOMASYONU
    const verses = [
        { arabic: "وَقُل رَّبِّ زِدْنِي عِلْمًا", meal: "De ki: 'Rabbim, benim ilmimi artır.'", source: "Tâ-Hâ Sûresi, 114. Âyet" },
        { arabic: "إِنَّ مَعَ الْعُسْرِ يُسْرًا", meal: "Şüphesiz her güçlükle birlikte bir kolaylık vardır.", source: "İnşirâh Sûresi, 6. Âyet" },
        { arabic: "وَأَن لَّيْسَ لِلإِنسَانِ إِلاَّ مَا سَعَى", meal: "İnsan için ancak çalıştığının karşılığı vardır.", source: "Necm Sûresi, 39. Âyet" }
    ];

    const hadiths = [
        { text: "İki nimet vardır ki insanların çoğu onların kıymetini bilmekte aldanmıştır: Sağlık ve boş vakit.", source: "Buhârî, Rikâk 1" },
        { text: "Faydasız ilimden Allah'a sığınırım.", source: "Müslim, Zikir 73" },
        { text: "İnsanların en hayırlısı, insanlara faydalı olanıdır.", source: "Taberânî, el-Mu'cemü'l-Evsat" }
    ];

    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
    
    const currentVerse = verses[dayOfYear % verses.length];
    const currentHadith = hadiths[dayOfYear % hadiths.length];

    if (document.getElementById("verse-text")) {
        document.getElementById("verse-text").textContent = currentVerse.arabic;
        document.getElementById("verse-translation").textContent = `"${currentVerse.meal}"`;
        document.getElementById("verse-source").textContent = currentVerse.source;
        document.getElementById("hadith-text").textContent = `"${currentHadith.text}"`;
        document.getElementById("hadith-source").textContent = currentHadith.source;
    }

    // KOMUT PALETİ (CTRL + K)
    const cmdBtn = document.getElementById("cmd-btn");
    const cmdModal = document.getElementById("cmd-modal");
    if (cmdBtn && cmdModal) {
        cmdBtn.addEventListener("click", () => cmdModal.classList.add("open"));
        document.addEventListener("keydown", (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === "k") {
                e.preventDefault();
                cmdModal.classList.toggle("open");
            }
            if (e.key === "Escape") cmdModal.classList.remove("open");
        });
        cmdModal.addEventListener("click", (e) => {
            if (e.target === cmdModal) cmdModal.classList.remove("open");
        });
    }

    // GEMINI AI SOHBET WIDGETI
    const aiToggleBtn = document.getElementById("ai-toggle-btn");
    const aiCloseBtn = document.getElementById("ai-close-btn");
    const aiWindow = document.getElementById("ai-window");
    const aiSendBtn = document.getElementById("ai-send-btn");
    const aiInput = document.getElementById("ai-input");
    const aiMessages = document.getElementById("ai-messages");

    if (aiToggleBtn && aiWindow) {
        aiToggleBtn.addEventListener("click", () => aiWindow.classList.toggle("open"));
        aiCloseBtn.addEventListener("click", () => aiWindow.classList.remove("open"));

        function handleAiMessage() {
            const query = aiInput.value.trim().toLowerCase();
            if (!query) return;

            const userMsg = document.createElement("div");
            userMsg.className = "ai-msg user";
            userMsg.textContent = aiInput.value;
            aiMessages.appendChild(userMsg);
            aiInput.value = "";

            setTimeout(() => {
                const botMsg = document.createElement("div");
                botMsg.className = "ai-msg bot";

                if (query.includes("kimdir") || query.includes("hakkında") || query.includes("okul")) {
                    botMsg.textContent = "murtzeng, Elektrik-Elektronik Mühendisliği öğrencisidir. Savunma sanayii, aviyonik ve gömülü sistemler alanlarında araştırmalar yapmaktadır.";
                } else if (query.includes("proje") || query.includes("iha") || query.includes("stm32")) {
                    botMsg.textContent = "murtzeng, C++ ile gömülü sistemler, STM32 mikrodenetleyicileri ve aviyonik telemetri sistemleri üzerine Ar-Ge odaklı çalışmaktadır.";
                } else if (query.includes("iletişim") || query.includes("mail") || query.includes("linkedin")) {
                    botMsg.textContent = "murtzeng ile LinkedIn profil adresi (www.linkedin.com/in/murtzeng) veya sitedeki iletişim formu üzerinden doğrudan bağlantı kurabilirsiniz.";
                } else {
                    botMsg.textContent = "murtzeng'in aviyonik hedefleri, C++ gömülü yazılımları veya akademik çalışmaları hakkında bana dilediğiniz gibi soru sorabilirsiniz!";
                }

                aiMessages.appendChild(botMsg);
                aiMessages.scrollTop = aiMessages.scrollHeight;
            }, 600);
        }

        aiSendBtn.addEventListener("click", handleAiMessage);
        aiInput.addEventListener("keydown", (e) => { if (e.key === "Enter") handleAiMessage(); });
    }

    // TELEMETRİ SİMÜLASYONU
    setInterval(() => {
        const alt = document.getElementById("alt-val");
        const spd = document.getElementById("spd-val");
        if (alt && spd) {
            alt.textContent = `${1440 + Math.floor(Math.random() * 20)} m`;
            spd.textContent = `${218 + Math.floor(Math.random() * 5)} km/h`;
        }
    }, 2000);

    // CANLI HABER AKIŞI
    fetchLiveDefenseNews();
});

// AVİYONİK HESAPLAYICILAR
function convertAlt(m) {
    const res = document.getElementById("ft-result");
    if (res) res.textContent = m ? `${(m * 3.28084).toFixed(1)} ft` : '0 ft';
}
function convertSpeed(kt) {
    const res = document.getElementById("kmh-result");
    if (res) res.textContent = kt ? `${(kt * 1.852).toFixed(1)} km/h` : '0 km/h';
}
function calcOhm() {
    const v = parseFloat(document.getElementById("ohm-v").value);
    const r = parseFloat(document.getElementById("ohm-r").value);
    const res = document.getElementById("ohm-result");
    if (v && r && r !== 0) {
        res.textContent = `${(v / r).toFixed(2)} A`;
    } else {
        res.textContent = "Geçersiz değer";
    }
}

// CANLI TEKNOLOJİ & SAVUNMA HABERİ OTOMASYONU
async function fetchLiveDefenseNews() {
    const newsGrid = document.querySelector(".news-grid");
    if (!newsGrid) return;

    try {
        const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent("https://www.trthaber.com/teknoloji_articles.rss")}`);
        const data = await response.json();

        if (data.status === "ok" && data.items.length > 0) {
            newsGrid.innerHTML = "";
            data.items.slice(0, 3).forEach(item => {
                const card = document.createElement("article");
                card.className = "news-card";
                card.innerHTML = `
                    <div class="news-badge">Canlı Akış</div>
                    <h3><a href="${item.link}" target="_blank" style="color:inherit;text-decoration:none;">${item.title}</a></h3>
                    <p>${item.description.replace(/<[^>]*>?/gm, '').substring(0, 100)}...</p>
                    <span class="news-date"><i class="far fa-calendar-alt"></i> ${new Date(item.pubDate).toLocaleDateString("tr-TR")} | TRT Haber</span>
                `;
                newsGrid.appendChild(card);
            });
        }
    } catch (e) { console.log("Haber yükleme durumu:", e); }
}
