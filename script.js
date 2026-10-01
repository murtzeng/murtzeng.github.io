document.addEventListener("DOMContentLoaded", () => {
    // Dinamik Yıl
    const yearSpan = document.getElementById("year");
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();

    // MOBİL MENÜ TOGGLE KESİN ÇÖZÜM
    const menuBtn = document.getElementById("menu-btn");
    const navMenu = document.getElementById("nav-menu");
    const navItems = document.querySelectorAll(".nav-item");

    if (menuBtn && navMenu) {
        menuBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            navMenu.classList.toggle("show");
        });

        // Menü dışına tıklayınca veya linke basınca kapansın
        navItems.forEach(item => {
            item.addEventListener("click", () => {
                navMenu.classList.remove("show");
            });
        });

        document.addEventListener("click", (e) => {
            if (!navMenu.contains(e.target) && !menuBtn.contains(e.target)) {
                navMenu.classList.remove("show");
            }
        });
    }

    // SSS Akordeon Mantığı
    const faqItems = document.querySelectorAll(".faq-item");
    faqItems.forEach(item => {
        const question = item.querySelector(".faq-question");
        question.addEventListener("click", () => {
            item.classList.toggle("active");
        });
    });

    // Günün Âyeti & Hadîsi
    const verses = [
        { arabic: "وَقُل رَّبِّ زِدْنِي عِلْمًا", meal: "De ki: 'Rabbim, benim ilmimi artır.'", source: "Tâ-Hâ Sûresi, 114. Âyet" },
        { arabic: "إِنَّ مَعَ الْعُسْرِ يُسْرًا", meal: "Şüphesiz her güçlükle birlikte bir kolaylık vardır.", source: "İnşirâh Sûresi, 6. Âyet" },
        { arabic: "وَأَن لَّيْسَ لِلإِنسَانِ إِلاَّ مَا سعى", meal: "İnsan için ancak çalıştığının karşılığı vardır.", source: "Necm Sûresi, 39. Âyet" }
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

    // Canlı Telemetri Değer Değişim Simülasyonu
    setInterval(() => {
        const alt = document.getElementById("alt-val");
        const spd = document.getElementById("spd-val");
        if (alt && spd) {
            const randomAlt = 1440 + Math.floor(Math.random() * 20);
            const randomSpd = 218 + Math.floor(Math.random() * 5);
            alt.textContent = `${randomAlt} m`;
            spd.textContent = `${randomSpd} km/h`;
        }
    }, 2000);
});

// Terminal Komutları
const terminalInput = document.getElementById("terminal-input");
const terminalBody = document.getElementById("terminal-body");

if (terminalInput) {
    terminalInput.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
            const command = this.value.trim().toLowerCase();
            this.value = "";

            const userLine = document.createElement("p");
            userLine.innerHTML = `<span class="prompt">murtzeng></span> ${command}`;
            terminalBody.insertBefore(userLine, terminalInput.parentElement);

            let responseText = "";

            switch (command) {
                case "help":
                    responseText = "Komutlar: <br>- <b>about</b>: Hakkımda<br>- <b>skills</b>: Yetkinlikler<br>- <b>status</b>: Sistem Durumu<br>- <b>clear</b>: Temizle";
                    break;
                case "about":
                    responseText = "Gaziantep Üni. Elektrik-Elektronik Mühendisliği öğrencisi. Aviyonik ve gömülü sistemler araştırmacısı.";
                    break;
                case "skills":
                    responseText = "C++, C, Python, STM32, MATLAB, Altium Designer, Linux/Ubuntu";
                    break;
                case "status":
                    responseText = "[TELEMETRİ]: İHA Veri Bağı Aktif | Sinyal: %98 | Sistem: STABİL";
                    break;
                case "clear":
                    const lines = terminalBody.querySelectorAll("p");
                    lines.forEach(line => line.remove());
                    return;
                default:
                    responseText = `Bilinmeyen komut: '${command}'. Komut listesi için 'help' yazınız.`;
            }

            const responseLine = document.createElement("p");
            responseLine.className = "system-msg";
            responseLine.innerHTML = `[SYS-RESP]: ${responseText}`;
            terminalBody.insertBefore(responseLine, terminalInput.parentElement);

            terminalBody.scrollTop = terminalBody.scrollHeight;
        }
    });
}
