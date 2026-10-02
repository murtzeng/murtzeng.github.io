/* ==========================================================================
   MURTZENG AVIONICS - Google Forms Live Data Fetcher Engine
   Author: Murtaza Can Bilgin
   ========================================================================== */

// GOOGLE E-TABLO CSV CANLI VERİ BAĞLANTIN
const GOOGLE_SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQvmjfxgBFbh5aqJdACDmb52I07UcOzLX8ArqdigfrYRtlpFXNWtWXYy4lityCwjOQ0hKI0CHffxpgO/pub?output=csv";

window.addEventListener('load', () => {
    // Preloader (Yükleme Ekranı) Kontrolü
    const loadFill = document.getElementById('loadFill');
    let width = 0;
    
    const interval = setInterval(() => {
        if (width >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                const preloader = document.getElementById('preloader');
                if (preloader) {
                    preloader.style.opacity = '0';
                    setTimeout(() => preloader.style.display = 'none', 400);
                }
            }, 150);
        } else {
            width += 15;
            if (loadFill) loadFill.style.width = width + '%';
        }
    }, 20);
    
    setTimeout(() => {
        const preloader = document.getElementById('preloader');
        if (preloader) preloader.style.display = 'none';
    }, 1000);

    // Google Form verilerini çek
    fetchGoogleFormPosts();
});

// CSV Formatını Parçalama Algoritması
function parseCSV(text) {
    const lines = text.split('\n').filter(line => line.trim() !== '');
    return lines.slice(1).map(line => {
        const values = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
        return values.map(val => val.replace(/^"|"$/g, '').trim());
    });
}

function fetchGoogleFormPosts() {
    fetch(GOOGLE_SHEET_CSV_URL)
        .then(response => response.text())
        .then(csvText => {
            const rows = parseCSV(csvText);
            const container = document.getElementById('dynamicPostsList');
            if (!container) return;

            if (rows.length === 0) {
                renderFallbackPosts();
                return;
            }

            container.innerHTML = '';
            
            // Son eklenen paylaşım en üstte görünsün diye ters döngü
            rows.reverse().forEach((row, index) => {
                const date = row[0] ? row[0].split(' ')[0] : "Yeni";
                const title = row[1] || "Başlıksız Paylaşım";
                const desc = row[2] || "Açıklama girilmedi.";
                const imgUrl = row[3] || "https://images.unsplash.com/photo-1518770660439-4636190af475";

                // En son gönderilen paylaşımı sağdaki Anlık Not kutusuna da bas
                if (index === 0) {
                    const statusText = document.getElementById('liveStatusText');
                    if (statusText) statusText.innerText = `"${desc}"`;
                }

                const article = document.createElement('article');
                article.className = 'post-card';
                article.innerHTML = `
                    <div class="post-img-frame">
                        <img src="${imgUrl}" alt="${title}" onerror="this.src='https://images.unsplash.com/photo-1518770660439-4636190af475'">
                    </div>
                    <div class="post-content">
                        <span class="post-date">${date}</span>
                        <h4>${title}</h4>
                        <p>${desc}</p>
                    </div>
                `;
                container.appendChild(article);
            });
        })
        .catch(err => {
            console.error("Form verisi çekilirken hata oluştu:", err);
            renderFallbackPosts();
        });
}

function renderFallbackPosts() {
    const container = document.getElementById('dynamicPostsList');
    if (!container) return;

    container.innerHTML = `
        <article class="post-card">
            <div class="post-img-frame">
                <img src="https://images.unsplash.com/photo-1518770660439-4636190af475" alt="STM32 Kartı">
            </div>
            <div class="post-content">
                <span class="post-date">02 EKİM 2026</span>
                <h4>STM32 ve CAN-Bus Aviyonik Haberleşme Kartı Tasarımı</h4>
                <p>Aviyonik sistemler için tasarladığım yedekli veri otobüsü test kartı laboratuvar ortamında başarıyla çalıştırıldı.</p>
            </div>
        </article>
    `;

    const statusText = document.getElementById('liveStatusText');
    if (statusText) statusText.innerText = '"Henüz yeni bir not girilmedi. Google Form üzerinden ilk paylaşımınızı yapabilirsiniz."';
}
