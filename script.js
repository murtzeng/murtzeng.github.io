document.addEventListener("DOMContentLoaded", () => {
    // Dinamik Yıl
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

    // GEMINI AI SOHBET WIDGETI ("GEMINI'YE SOR")
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
                    botMsg.textContent = "murtzeng, Gaziantep Üniversitesi Elektrik-Elektronik Mühendisliği öğrencisidir. Savunma sanayii ve aviyonik alanlarında araştırmalar yapmaktadır.";
                } else if (query.includes("proje") || query.includes("iha") || query.includes("stm32")) {
                    botMsg.textContent = "murtzeng, STM32 tabanlı otonom İHA uçuş kontrolcüleri, yer istasyonu arayüzleri ve C++ gömülü yazılımları geliştirmektedir.";
                } else if (query.includes("iletişim") || query.includes("mail") || query.includes("linkedin")) {
                    botMsg.textContent = "murtzeng ile LinkedIn profil adresi (www.linkedin.com/in/murtzeng) veya sitedeki iletişim formu üzerinden bağlantı kurabilirsiniz.";
                } else {
                    botMsg.textContent = "murtzeng'in aviyonik sistemler, gömülü C++ yazılımları veya akademik çalışmaları hakkında bana soru sorabilirsiniz!";
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

// CANLI TEKNOLOJİ & SAVUNMA HABERİ OTOMASYONU (TRT & AA)
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
