// DİNAMİK YIL OTOMASYONU
document.addEventListener("DOMContentLoaded", () => {
    const yearSpan = document.getElementById("year");
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // GÜNÜN ÂYETİ VE HADÎSİ VERİ TABANI
    const verses = [
        {
            arabic: "وَقُل رَّبِّ زِدْنِي عِلْمًا",
            meal: "De ki: 'Rabbim, benim ilmimi artır.'",
            source: "Tâ-Hâ Sûresi, 114. Âyet"
        },
        {
            arabic: "إِنَّ مَعَ الْعُسْرِ يُسْرًا",
            meal: "Şüphesiz her güçlükle birlikte bir kolaylık vardır.",
            source: "İnşirâh Sûresi, 6. Âyet"
        },
        {
            arabic: "وَأَن لَّيْسَ لِلإِنسَانِ إِلاَّ مَا سَعَى",
            meal: "İnsan için ancak çalıştığının karşılığı vardır.",
            source: "Necm Sûresi, 39. Âyet"
        }
    ];

    const hadiths = [
        {
            text: "İki nimet vardır ki insanların çoğu onların kıymetini bilmekte aldanmıştır: Sağlık ve boş vakit.",
            source: "Buhârî, Rikâk 1"
        },
        {
            text: "Faydasız ilimden Allah'a sığınırım.",
            source: "Müslim, Zikir 73"
        },
        {
            text: "İnsanların en hayırlısı, insanlara faydalı olanıdır.",
            source: "Taberânî, el-Mu'cemü'l-Evsat"
        }
    ];

    // Günün İndeksini Hesaplama (Her gün otomatik değişir)
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
    
    const currentVerse = verses[dayOfYear % verses.length];
    const currentHadith = hadiths[dayOfYear % hadiths.length];

    // Ekrana Yazdırma
    document.getElementById("verse-text").textContent = currentVerse.arabic;
    document.getElementById("verse-translation").textContent = `"${currentVerse.meal}"`;
    document.getElementById("verse-source").textContent = currentVerse.source;

    document.getElementById("hadith-text").textContent = `"${currentHadith.text}"`;
    document.getElementById("hadith-source").textContent = currentHadith.source;
});

// CANLI TERMINAL KOMUT SİSTEMİ
const terminalInput = document.getElementById("terminal-input");
const terminalBody = document.getElementById("terminal-body");

if (terminalInput) {
    terminalInput.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
            const command = this.value.trim().toLowerCase();
            this.value = "";

            // Kullanıcı Komutunu Ekrana Yazma
            const userLine = document.createElement("p");
            userLine.innerHTML = `<span class="prompt">murtzeng></span> ${command}`;
            terminalBody.insertBefore(userLine, terminalInput.parentElement);

            // Yanıt Oluşturma
            let responseText = "";

            switch (command) {
                case "help":
                    responseText = "Kullanılabilir komutlar: <br> - <b>about</b>: Hakkımda kısa bilgi<br> - <b>skills</b>: Yetkinlikler<br> - <b>clear</b>: Terminali temizle";
                    break;
                case "about":
                    responseText = "Gaziantep Üni. Elektrik-Elektronik Mühendisliği öğrencisi. Aviyonik ve gömülü sistemler araştırmacısı.";
                    break;
                case "skills":
                    responseText = "C++, Python, STM32, Arduino, Altium Designer, HTML/CSS/JS, Git/GitHub";
                    break;
                case "clear":
                    const lines = terminalBody.querySelectorAll("p");
                    lines.forEach(line => line.remove());
                    return;
                default:
                    responseText = `Komut bulunamadı: '${command}'. Komut listesi için 'help' yazınız.`;
            }

            const responseLine = document.createElement("p");
            responseLine.className = "system-msg";
            responseLine.innerHTML = `[SYS-RESP]: ${responseText}`;
            terminalBody.insertBefore(responseLine, terminalInput.parentElement);

            // Otomatik Aşağı Kaydırma
            terminalBody.scrollTop = terminalBody.scrollHeight;
        }
    });
}
