/* ==========================================================================
   MURTZENG AVIONICS - Dual Google Forms Live Data Fetcher Engine
   Author: Murtaza Can Bilgin
   ========================================================================== */

// 1. LİNK: Projeler ve Gönderiler için CSV Linki
const POSTS_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQvmjfxgBFbh5aqJdACDmb52I07UcOzLX8ArqdigfrYRtlpFXNWtWXYy4lityCwjOQ0hKI0CHffxpgO/pub?output=csv";

// 2. LİNK: Akademik Ders Notları için CSV Linki
const NOTES_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRbhOhO9PO9KgBxBEqhzQqyksFfdu8-grLSfgAZoxiUxDDZIKjawBI19hjqib2-70eD-04Axow1vRki/pub?output=csv";

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
    fetchPostsData();
    fetchNotesData();
});

// CSV Formatını Parçalama Algoritması
function parseCSV(text) {
    const lines = text.split('\n').filter(line => line.trim() !== '');
    return lines.slice(1).map(line => {
        const values = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
        return values.map(val => val.replace(/^"|"$/g, '').trim());
    });
}

// 1. Projeler / Gönderiler Verisini Çekme
function fetchPostsData() {
    fetch(POSTS_CSV_URL)
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
            
            // Son eklenen gönderi en üstte görünsün diye ters döngü
            rows.reverse().forEach((row, index) => {
                const date = row[0] ? row[0].split(' ')[0] : "Yeni";
                const title = row[1] || "Başlıksız Gönderi";
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
            console.error("Gönderiler çekilemedi:", err);
            renderFallbackPosts();
        });
}

// 2. Akademik Ders Notları Verisini Çekme
function fetchNotesData() {
    fetch(NOTES_CSV_URL)
        .then(response => response.text())
        .then(csvText => {
            const rows = parseCSV(csvText);
            const notesContainer = document.getElementById('dynamicNotesList');
            if (!notesContainer) return;

            if (rows.length === 0) {
                notesContainer.innerHTML = '<li style="color: var(--text-gray); font-size: 0.82rem; padding: 5px;">Henüz ders notu eklenmedi.</li>';
                return;
            }

            notesContainer.innerHTML = '';

            rows.reverse().forEach(row => {
                const courseName = row[1] || "Ders Notu";
                const fileUrl = row[2] || "#";

                const li = document.createElement('li');
                li.innerHTML = `
                    <a href="${fileUrl}" target="_blank">
                        <i class="fa-solid fa-file-pdf"></i> ${courseName}
                    </a>
                `;
                notesContainer.appendChild(li);
            });
        })
        .catch(err => {
            console.error("Ders notları çekilemedi:", err);
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
    if (statusText) statusText.innerText = '"Google Form üzerinden ilk gönderini bekliyor."';
}
