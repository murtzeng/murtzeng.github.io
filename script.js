document.addEventListener("DOMContentLoaded", () => {
    // DAKTİLO BAŞLIK
    const titleText = "Geleceğin Aviyonik ve Gömülü Sistem Teknolojileri";
    const titleElement = document.getElementById("typewriter-title");
    if (titleElement) {
        let i = 0;
        function type() {
            if (i < titleText.length) {
                titleElement.textContent += titleText.charAt(i);
                i++;
                setTimeout(type, 40);
            }
        }
        type();
    }

    document.getElementById("year").textContent = new Date().getFullYear();

    // TEMA DEĞİŞTİRİCİ
    const themeBtn = document.getElementById("theme-toggle");
    if (themeBtn) {
        themeBtn.addEventListener("click", () => {
            document.body.classList.toggle("light-theme");
            const icon = themeBtn.querySelector("i");
            icon.className = document.body.classList.contains("light-theme") ? "fas fa-sun" : "fas fa-moon";
        });
    }

    // SAYAÇ ANİMASYONU
    const counters = document.querySelectorAll(".c-num");
    counters.forEach(counter => {
        const target = +counter.getAttribute("data-target");
        let count = 0;
        const inc = target / 30;
        const updateCount = () => {
            count += inc;
            if (count < target) {
                counter.textContent = Math.ceil(count);
                setTimeout(updateCount, 40);
            } else {
                counter.textContent = target;
            }
        };
        updateCount();
    });

    // AR-GE GÜNLÜĞÜ
    const postBtn = document.getElementById("post-btn");
    const postInput = document.getElementById("post-input");
    const postsFeed = document.getElementById("posts-feed");

    if (postBtn && postInput && postsFeed) {
        postBtn.addEventListener("click", () => {
            const text = postInput.value.trim();
            if (!text) return;

            const postItem = document.createElement("div");
            postItem.className = "post-item";
            postItem.innerHTML = `
                <div class="p-header"><strong>murtzeng</strong> <span class="p-time">Az önce</span></div>
                <p>${text}</p>
                <div class="p-actions"><button class="like-btn" onclick="this.querySelector('.like-count').textContent = parseInt(this.querySelector('.like-count').textContent)+1"><i class="far fa-heart"></i> <span class="like-count">1</span> Beğeni</button></div>
            `;
            postsFeed.prepend(postItem);
            postInput.value = "";
        });
    }

    // İNTERAKTİF RADAR
    const radarBox = document.getElementById("radar-interactive");
    const radarStatus = document.getElementById("radar-status");
    let radarModes = ["RADAR: AKTİF", "RADAR: TARAMA MODU", "RADAR: KİLİTLENDİ"];
    let modeIndex = 0;
    if (radarBox) {
        radarBox.addEventListener("click", () => {
            modeIndex = (modeIndex + 1) % radarModes.length;
            radarStatus.textContent = radarModes[modeIndex];
        });
    }

    // LİNUX TERMİNAL
    const termModal = document.getElementById("terminal-modal");
    const termToggle = document.getElementById("terminal-toggle-btn");
    const logoTrigger = document.getElementById("logo-trigger");
    const termClose = document.getElementById("terminal-close");
    const termInput = document.getElementById("terminal-input");
    const termOutput = document.getElementById("terminal-output");

    function openTerminal() { termModal.classList.add("open"); termInput.focus(); }
    if (termToggle) termToggle.addEventListener("click", openTerminal);
    if (logoTrigger) logoTrigger.addEventListener("click", openTerminal);
    if (termClose) termClose.addEventListener("click", () => termModal.classList.remove("open"));

    if (termInput) {
        termInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                const cmd = termInput.value.trim().toLowerCase();
                const p = document.createElement("p");
                p.innerHTML = `<span style="color:var(--cyan-accent);">$</span> ${termInput.value}`;
                termOutput.appendChild(p);

                const res = document.createElement("p");
                if (cmd === "help") {
                    res.innerHTML = "Komutlar: <br>- <b>about</b>: murtzeng kimdir?<br>- <b>skills</b>: Yetkinlikler<br>- <b>clear</b>: Temizle<br>- <b>exit</b>: Çıkış";
                } else if (cmd === "about") {
                    res.textContent = "murtzeng, Elektrik-Elektronik Mühendisliği öğrencisi ve aviyonik araştırmacısıdır.";
                } else if (cmd === "skills") {
                    res.textContent = "C++, STM32 Gömülü Sistemler, Aviyonik Telemetri, MATLAB.";
                } else if (cmd === "clear") {
                    termOutput.innerHTML = "";
                    termInput.value = "";
                    return;
                } else if (cmd === "exit") {
                    termModal.classList.remove("open");
                    termInput.value = "";
                    return;
                } else {
                    res.textContent = `Bilinmeyen komut: ${cmd}. 'help' yazabilirsin.`;
                    res.style.color = "#f87171";
                }
                termOutput.appendChild(res);
                termInput.value = "";
                termOutput.scrollTop = termOutput.scrollHeight;
            }
        });
    }

    // ÂYET VE HADİS
    const verses = [
        { arabic: "وَقُل رَّبِّ زِدْنِي عِلْمًا", meal: "De ki: 'Rabbim, benim ilmimi artır.'", source: "Tâ-Hâ Sûresi, 114. Âyet" },
        { arabic: "إِنَّ مَعَ الْعُسْرِ يُسْرًا", meal: "Şüphesiz her güçlükle birlikte bir kolaylık vardır.", source: "İnşirâh Sûresi, 6. Âyet" }
    ];
    const hadiths = [
        { text: "İki nimet vardır ki insanların çoğu onların kıymetini bilmekte aldanmıştır: Sağlık ve boş vakit.", source: "Buhârî, Rikâk 1" },
        { text: "İnsanların en hayırlısı, insanlara faydalı olanıdır.", source: "Taberânî" }
    ];
    const day = new Date().getDate();
    if (document.getElementById("verse-text")) {
        document.getElementById("verse-text").textContent = verses[day % verses.length].arabic;
        document.getElementById("verse-translation").textContent = `"${verses[day % verses.length].meal}"`;
        document.getElementById("verse-source").textContent = verses[day % verses.length].source;
        document.getElementById("hadith-text").textContent = `"${hadiths[day % hadiths.length].text}"`;
        document.getElementById("hadith-source").textContent = hadiths[day % hadiths.length].source;
    }

    // GEMİNİ WIDGET
    const aiToggle = document.getElementById("ai-toggle-btn");
    const aiWindow = document.getElementById("ai-window");
    const aiClose = document.getElementById("ai-close-btn");
    const aiSend = document.getElementById("ai-send-btn");
    const aiInput = document.getElementById("ai-input");
    const aiMsgBox = document.getElementById("ai-messages");

    if (aiToggle && aiWindow) {
        aiToggle.addEventListener("click", () => aiWindow.classList.toggle("open"));
        aiClose.addEventListener("click", () => aiWindow.classList.remove("open"));

        function sendAi() {
            const q = aiInput.value.trim().toLowerCase();
            if(!q) return;
            const u = document.createElement("div"); u.className = "ai-msg user"; u.textContent = aiInput.value;
            aiMsgBox.appendChild(u); aiInput.value = "";

            setTimeout(() => {
                const b = document.createElement("div"); b.className = "ai-msg bot";
                if(q.includes("kimdir")) b.textContent = "murtzeng, Elektrik-Elektronik Mühendisliği öğrencisidir.";
                else b.textContent = "murtzeng'in aviyonik ve gömülü sistem projelerini siteden inceleyebilirsin!";
                aiMsgBox.appendChild(b);
                aiMsgBox.scrollTop = aiMsgBox.scrollHeight;
            }, 500);
        }
        aiSend.addEventListener("click", send_ai = sendAi);
        aiInput.addEventListener("keydown", (e) => { if(e.key === "Enter") sendAi(); });
    }

    fetchNews();
    setInterval(() => {
        const alt = document.getElementById("alt-val");
        const spd = document.getElementById("spd-val");
        if (alt && spd) {
            alt.textContent = `${1440 + Math.floor(Math.random() * 20)} m`;
            spd.textContent = `${218 + Math.floor(Math.random() * 5)} km/h`;
        }
    }, 2000);
});

function convertAlt(m) { document.getElementById("ft-result").textContent = m ? `${(m * 3.28084).toFixed(1)} ft` : '0 ft'; }
function convertSpeed(kt) { document.getElementById("kmh-result").textContent = kt ? `${(kt * 1.852).toFixed(1)} km/h` : '0 km/h'; }
function calcOhm() {
    const v = parseFloat(document.getElementById("ohm-v").value);
    const r = parseFloat(document.getElementById("ohm-r").value);
    const res = document.getElementById("ohm-result");
    if (v && r) res.textContent = `${(v / r).toFixed(2)} A`;
    else res.textContent = "Geçersiz değer";
}

async function fetchNews() {
    try {
        const res = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent("https://www.trthaber.com/teknoloji_articles.rss")}`);
        const data = await res.json();
        if (data.status === "ok" && data.items.length > 0) {
            const grid = document.querySelector(".news-grid");
            grid.innerHTML = "";
            data.items.slice(0, 2).forEach(item => {
                const card = document.createElement("article");
                card.className = "news-card";
                card.innerHTML = `
                    <div class="news-badge">Canlı Akış</div>
                    <h3><a href="${item.link}" target="_blank" style="color:inherit;text-decoration:none;">${item.title}</a></h3>
                    <p>${item.description.replace(/<[^>]*>?/gm, '').substring(0, 90)}...</p>
                `;
                grid.appendChild(card);
            });
        }
    } catch(e) {}
}
