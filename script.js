/**
 * KONFIGURASI UTAMA
 * Ganti URL di bawah dengan URL Web App dari Google Apps Script Anda
 */
const API_URL = "https://script.google.com/macros/s/AKfycbxb86eZnUZvSYWRkX2uSxohRzien9x1zHyu1XZGkKCV8tekejSG8DygZTdI3bEkDThF0Q/exec";

// Variabel penampung data global
let db = { jadwal: [], news: [], profil: [] };

/**
 * 1. INISIALISASI SAAT HALAMAN DIMUAT
 */
document.addEventListener('DOMContentLoaded', () => {
    updateHeader();
    fetchWeather();
    loadData();
    setInterval(updateHeader, 1000); // Update jam setiap detik
});

/**
 * 2. FUNGSI UPDATE HEADER (JAM & TANGGAL)
 */
function updateHeader() {
    const now = new Date();
    const optionsDate = { day: 'numeric', month: 'short' };
    
    const dateEl = document.getElementById('header-date');
    const timeEl = document.getElementById('header-time');
    
    if (dateEl) dateEl.innerText = now.toLocaleDateString('id-ID', optionsDate);
    if (timeEl) timeEl.innerText = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
}

/**
 * 3. FUNGSI AMBIL DATA CUACA (API EKSTERNAL)
 */
async function fetchWeather() {
    try {
        const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=-6.20&longitude=106.84&current_weather=true`);
        const data = await res.json();
        const temp = Math.round(data.current_weather.temperature);
        const weatherEl = document.getElementById('header-weather');
        if (weatherEl) weatherEl.innerHTML = `<i class="fas fa-sun"></i> ${temp}°C`;
    } catch (e) {
        console.warn("Weather API Offline");
    }
}

/**
 * 4. FUNGSI AMBIL DATA DARI GOOGLE SHEETS
 */
async function loadData() {
    const grid = document.getElementById('bus-grid');
    const newsContainer = document.getElementById('news-list');

    try {
        const res = await fetch(API_URL);
        db = await res.json();
        console.log("Database Loaded:", db);

        // Render semua komponen
        renderJadwal(db.jadwal);
        renderNews(db.news);
        updateTicker(db.jadwal);
    } catch (e) {
        console.error("Gagal memuat data:", e);
        if (grid) grid.innerHTML = `<p style="grid-column:1/-1; text-align:center; padding:20px;">Koneksi terputus. Coba refresh kembali.</p>`;
    }
}

/**
 * 5. FUNGSI RENDER JADWAL BUS (GRID 3 KOLOM)
 */
function renderJadwal(data) {
    const grid = document.getElementById('bus-grid');
    if (!grid) return;

    if (!data || data.length === 0) {
        grid.innerHTML = `<p style="grid-column:1/-1; text-align:center; padding:40px; color:#718096;">Jadwal tidak ditemukan.</p>`;
        return;
    }

    grid.innerHTML = data.map(bus => {
        // Bersihkan format Jam (Menangani format ISO dari Google Sheets)
        let jamTampil = bus["Jam"];
        if (jamTampil && jamTampil.toString().includes("T")) {
            jamTampil = jamTampil.split("T")[1].substring(0, 5);
        }

        const hargaFormatted = Number(bus["Harga"]).toLocaleString('id-ID');
        const fotoBus = bus["Foto"] || 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=200';

        return `
            <div class="bus-card">
                <img src="${fotoBus}" alt="${bus["Nama PO"]}" class="card-img" onerror="this.src='https://via.placeholder.com/200x100?text=Bus+Mahika'">
                <div class="card-body" style="padding: 8px 10px 12px 10px;">
                    <h4 style="font-size: 0.75rem; color: #003B73; margin-bottom: 2px;">${bus["Tujuan"]}</h4>
                    <span class="info" style="font-size: 0.65rem; color: #4A5568; display: block; line-height: 1.2; margin-bottom: 5px;">
                        <strong style="color: #2D3748;">${bus["Nama PO"]}</strong><br>
                        <i class="far fa-clock"></i> ${jamTampil || '--:--'}
                    </span>
                    <span class="price" style="color: #E53E3E; font-weight: 800; font-size: 0.75rem; display: block; margin-bottom: 8px;">Rp ${hargaFormatted}</span>
                    <button class="btn-book" onclick="showProfile('${bus["Nama PO"]}')" 
                        style="width: 100%; background: #003B73; color: white; border: none; padding: 6px; border-radius: 8px; font-size: 0.65rem; font-weight: 700; cursor: pointer;">
                        PESAN
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

/**
 * 6. FUNGSI RENDER MAHIKA NEWS
 */
function renderNews(newsData) {
    const newsContainer = document.getElementById('news-list');
    if (!newsContainer || !newsData) return;

    newsContainer.innerHTML = newsData.map(item => `
        <div class="news-item">
            <img src="${item.Foto || 'https://via.placeholder.com/100?text=News'}" class="news-img">
            <div class="news-info">
                <h4>${item.Judul}</h4>
                <p>${item.Isi.substring(0, 80)}...</p>
                <small style="font-size: 0.6rem; color: #A0AEC0;">
                    <i class="far fa-calendar-alt"></i> ${new Date(item.Tanggal).toLocaleDateString('id-ID')}
                </small>
            </div>
        </div>
    `).join('');
}

/**
 * 7. LOGIKA PENCARIAN (SEARCH)
 */
const searchInput = document.getElementById('search-input');
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const val = e.target.value.toLowerCase().trim();
        const homeView = document.getElementById('home-view');
        const sectionTitle = document.getElementById('section-title');

        if (val.length > 0) {
            if (homeView) homeView.style.display = "none";
            if (sectionTitle) sectionTitle.innerText = "Hasil Pencarian";

            const filteredBus = db.jadwal.filter(b => 
                (b["Tujuan"] || "").toLowerCase().includes(val) || 
                (b["Nama PO"] || "").toLowerCase().includes(val)
            );
            renderJadwal(filteredBus);
        } else {
            if (homeView) homeView.style.display = "block";
            if (sectionTitle) sectionTitle.innerText = "Rute Populer";
            renderJadwal(db.jadwal);
        }
    });
}

/**
 * 8. MODAL PROFIL PO & WHATSAPP REDIRECT
 */
function showProfile(namaPO) {
    const po = db.profil.find(p => p["Nama PO"] === namaPO);
    const content = document.getElementById('profile-detail');
    const waNumber = "6281234567890"; // Ganti dengan nomor WA Admin Mahika
    
    if (!po) {
        // Jika data profil PO tidak ada di Sheet, langsung arahkan ke WA
        window.location.href = `https://wa.me/${waNumber}?text=Halo Mahika, saya mau pesan tiket bus ${namaPO}`;
        return;
    }

    content.innerHTML = `
        <img src="${po["Foto"]}" style="width:100%; border-radius:15px; margin-bottom:15px; aspect-ratio:16/9; object-fit:cover;">
        <h3 style="color:#003B73; font-weight:800;">${po["Nama PO"]}</h3>
        <p style="font-size:0.85rem; color:#4A5568; line-height:1.6; margin:10px 0;">${po["Deskripsi"]}</p>
        <div style="background:#F7FAFC; padding:12px; border-radius:12px; font-size:0.8rem; border-left:4px solid #FFC107; margin-bottom:15px;">
            <strong>Fasilitas:</strong><br>${po["Fasilitas"]}
        </div>
        <a href="https://wa.me/${waNumber}?text=Halo Mahika, saya mau pesan tiket bus ${po["Nama PO"]}" 
           style="display:block; text-align:center; background:#003B73; color:white; padding:15px; border-radius:15px; text-decoration:none; font-weight:700;">
           Hubungi Agen (WA)
        </a>
    `;
    document.getElementById('modal-profile').style.display = 'flex';
}

function closeModal() {
    document.getElementById('modal-profile').style.display = 'none';
}

/**
 * 9. UPDATE TICKER (RUNNING TEXT)
 */
function updateTicker(jadwal) {
    const tickerContent = document.getElementById('ticker-content');
    if (!tickerContent || !jadwal) return;

    const names = [...new Set(jadwal.map(item => item["Nama PO"]))]; // Ambil nama unik
    tickerContent.innerHTML = names.map(name => `<span>${name.toUpperCase()}</span>`).join('');
        }
                                                                                        
