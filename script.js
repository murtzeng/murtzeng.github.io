// ==========================================
// 1. DİNAMİK YAZI EFEKTİ (TYPEWRITER)
// ==========================================
const words = ["Geleceğin Aviyonik ve Gömülü Sistem Teknolojileri", "Milli Teknoloji Hamlesi İle Göklere", "murtzeng | Aero-Electronics Portal"];
let i = 0;
let timer;

function typingEffect() {
    let word = words[i].split("");
    var loopTyping = function() {
        if (word.length > 0) {
            document.getElementById('typewriter-title').innerHTML += word.shift();
        } else {
            setTimeout(deletingEffect, 2000);
            return;
        }
        timer = setTimeout(loopTyping, 70);
    };
    loopTyping();
}

function deletingEffect() {
    let word = words[i].split("");
    var loopDeleting = function() {
        if (word.length > 0) {
            word.pop();
            document.getElementById('typewriter-title').innerHTML = word.join("");
        } else {
            i = (i + 1) % words.length;
            setTimeout(typingEffect, 500);
            return;
        }
        timer = setTimeout(loopDeleting, 40);
    };
    loopDeleting();
}

// ==========================================
// 2. CANLI TRT HABER / SAVUNMA AKIŞI
// ==========================================
async function fetchDefenseNews() {
    const newsGrid = document.querySelector('.news-grid');
    if (!newsGrid) return;

    try {
        const rssUrl = 'https://www.trthaber.com/sondakika.rss';
        const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;

        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.status === 'ok' && data.items.length > 0) {
            newsGrid.innerHTML = ''; 
            
            data.items.slice(0, 3).forEach(item => {
                const cleanDesc = item.description.replace(/<[^>]*>?/gm, '').substring(0, 100) + '...';
                
                const card = document.createElement('article');
                card.className = 'news-card';
                card.innerHTML = `
                    <div class="news-badge">TRT Haber</div>
                    <h3><a href="${item.link}" target="_blank" style="color:inherit; text-decoration:none;">${item.title}</a></h3>
                    <p>${cleanDesc}</p>
                    <a href="${item.link}" target="_blank" class="news-link" style="font-size: 0.85rem; color: var(--cyan-accent); margin-top: 10px; display: inline-block;">Habere Git &rarr;</a>
                `;
                newsGrid.appendChild(card);
            });
        } else {
            newsGrid.innerHTML = `<article class="news-card"><h3>Haberler Yüklenemedi</h3><p>Şu an anlık akış alınamıyor.</p></article>`;
        }
    } catch (error) {
        console.error("Haber çekme hatası:", error);
        newsGrid.innerHTML = `<article class="news-card"><h3>Bağlantı Hatası</h3><p>Canlı akış sunucusuna ulaşılamadı.</p></article>`;
    }
}

// ==========================================
// 3. SAYFA YÜKLENİNCE ÇALIŞACAKLAR
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // Yazı efektini başlat
    typingEffect();

    // Canlı haberleri çek
    fetchDefenseNews();

    // Telif yılı otomatik güncelleme
    const yearSpan = document.getElementById('year');
    if(yearSpan) yearSpan.textContent = new Date().getFullYear();

    // Terminal Modalı Kontrolleri
    const terminalModal = document.getElementById('terminal-modal');
    const terminalToggleBtn = document.getElementById('terminal-toggle-btn');
    const terminalCloseBtn = document.getElementById('terminal-close');
    const logoTrigger = document.getElementById('logo-trigger');
    const terminalInput = document.getElementById('terminal-input');
    const terminalOutput = document.getElementById('terminal-output');

    function openTerminal() {
        if(terminalModal) {
            terminalModal.style.display = 'flex';
            if(terminalInput) terminalInput.focus();
        }
    }

    function closeTerminal() {
        if(terminalModal) terminalModal.style.display = 'none';
    }

    if(terminalToggleBtn) terminalToggleBtn.addEventListener('click', openTerminal);
    if(logoTrigger) logoTrigger.addEventListener('click', openTerminal);
    if(terminalCloseBtn) terminalCloseBtn.addEventListener('click', closeTerminal);

    // Terminal Komut İşleyicisi
    if(terminalInput) {
        terminalInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                const cmd = terminalInput.value.trim().toLowerCase();
                const p = document.createElement('p');
                p.innerHTML = `<span style="color:var(--cyan-accent);">$</span> ${terminalInput.value}`;
                terminalOutput.appendChild(p);

                const resP = document.createElement('p');
                if (cmd === 'help') {
                    resP.innerHTML = "Mevcut komutlar: <br>- <b>about</b>: Hakkımda<br>- <b>skills</b>: Yetkinlikler<br>- <b>clear</b>: Ekranı temizle<br>- <b>exit</b>: Terminali kapat";
                } else if (cmd === 'about') {
                    resP.innerHTML = "murtzeng: Elektrik-Elektronik Mühendisliği öğrencisi ve aviyonik sistemler araştırmacısı.";
                } else if (cmd === 'skills') {
                    resP.innerHTML = "C++, STM32, Gömülü Sistemler, İHA Aviyonik Tasarımı, PCB Tasarım.";
                } else if (cmd === 'clear') {
                    terminalOutput.innerHTML = '<p>Mühendislik Terminaline Hoş Geldiniz! Komut için <strong style="color:var(--cyan-accent);">help</strong> yazın.</p>';
                    terminalInput.value = '';
                    return;
                } else if (cmd === 'exit') {
                    closeTerminal();
                    terminalInput.value = '';
                    return;
                } else {
                    resP.innerHTML = `Komut bulunamadı: ${cmd}. 'help' yazarak komutları görebilirsin.`;
                }
                terminalOutput.appendChild(resP);
                terminalInput.value = '';
                terminalOutput.scrollTop = terminalOutput.scrollHeight;
            }
        });
    }

    // Gemini AI Chat Widget Kontrolleri
    const aiToggleBtn = document.getElementById('ai-toggle-btn');
    const aiWindow = document.getElementById('ai-window');
    const aiCloseBtn = document.getElementById('ai-close-btn');
    const aiSendBtn = document.getElementById('ai-send-btn');
    const aiInput = document.getElementById('ai-input');
    const aiMessages = document.getElementById('ai-messages');

    if(aiToggleBtn && aiWindow) {
        aiToggleBtn.addEventListener('click', () => {
            aiWindow.style.display = aiWindow.style.display === 'flex' ? 'none' : 'flex';
        });
    }
    if(aiCloseBtn && aiWindow) {
        aiCloseBtn.addEventListener('click', () => {
            aiWindow.style.display = 'none';
        });
    }

    if(aiSendBtn && aiInput && aiMessages) {
        aiSendBtn.addEventListener('click', () => {
            const text = aiInput.value.trim();
            if(!text) return;

            const userMsg = document.createElement('div');
            userMsg.className = 'ai-msg user';
            userMsg.textContent = text;
            aiMessages.appendChild(userMsg);
            aiInput.value = '';
            aiMessages.scrollTop = aiMessages.scrollHeight;

            setTimeout(() => {
                const botMsg = document.createElement('div');
                botMsg.className = 'ai-msg bot';
                botMsg.textContent = "Eyvallah gardaşım, aviyonik sistemler çalışıyor!";
                aiMessages.appendChild(botMsg);
                aiMessages.scrollTop = aiMessages.scrollHeight;
            }, 1000);
        });
    }

    // Ar-Ge Günlüğü Not Ekleme
    const postBtn = document.getElementById('post-btn');
    const postInput = document.getElementById('post-input');
    const postsFeed = document.getElementById('posts-feed');

    if(postBtn && postInput && postsFeed) {
        postBtn.addEventListener('click', () => {
            const val = postInput.value.trim();
            if(!val) return;

            const newItem = document.createElement('div');
            newItem.className = 'post-item';
            newItem.innerHTML = `
                <div class="p-header"><strong>murtzeng</strong> <span class="p-time">Şimdi</span></div>
                <p>${val}</p>
                <div class="p-actions"><button class="like-btn"><i class="far fa-heart"></i> <span class="like-count">0</span> Beğeni</button></div>
            `;
            postsFeed.prepend(newItem);
            postInput.value = '';
        });
    }
});

// ==========================================
// 4. MÜHENDİSLİK ARAÇLARI & DÖNÜŞTÜRÜCÜLER
// ==========================================
function convertAlt(val) {
    const ftRes = document.getElementById('ft-result');
    if(!ftRes) return;
    if(val === "") { ftRes.textContent = "0 ft"; return; }
    let meters = parseFloat(val);
    let feet = meters * 3.28084;
    ftRes.textContent = feet.toFixed(1) + " ft";
}

function convertSpeed(val) {
    const kmhRes = document.getElementById('kmh-result');
    if(!kmhRes) return;
    if(val === "") { kmhRes.textContent = "0 km/h"; return; }
    let knots = parseFloat(val);
    let kmh = knots * 1.852;
    kmhRes.textContent = kmh.toFixed(1) + " km/h";
}

function calcOhm() {
    const v = parseFloat(document.getElementById('ohm-v').value);
    const r = parseFloat(document.getElementById('ohm-r').value);
    const resElem = document.getElementById('ohm-result');
    if(!resElem) return;

    if(isNaN(v) || isNaN(r)) {
        resElem.textContent = "Hatalı Giriş!";
        return;
    }
    if(r === 0) {
        resElem.textContent = "Direnç 0 olamaz!";
        return;
    }
    let i = v / r;
    resElem.textContent = i.toFixed(2) + " A";
}
