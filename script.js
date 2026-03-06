/* --- API CONFIG --- */
const API_URL = "https://script.google.com/macros/s/AKfycbxb86eZnUZvSYWRkX2uSxohRzien9x1zHyu1XZGkKCV8tekejSG8DygZTdI3bEkDThF0Q/exec";
let db = { jadwal: [], news: [], promo: [] };

document.addEventListener('DOMContentLoaded', () => {
    updateClock();
    setInterval(updateClock, 1000);
    loadData();

    // Fungsi Search Otomatis
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const val = e.target.value.toLowerCase();
            const filteredBus = db.jadwal.filter(b => 
                b.Tujuan.toLowerCase().includes(val) || 
                b["Nama PO"].toLowerCase().includes(val)
            );
            renderJadwal(filteredBus);
        });
    }
});

/* --- FUNGSI JAM & TANGGAL --- */
function updateClock() {
    const now = new Date();
    const dateEl = document.getElementById('header-date');
    const timeEl = document.getElementById('header-time');
    
    if (dateEl) dateEl.innerText = now.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
    if (timeEl) timeEl.innerText = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
}

/* --- AMBIL DATA DARI GOOGLE SHEETS --- */
async function loadData() {
    try {
        const response = await fetch(API_URL);
        db = await response.json();
        
        renderPromo(db.promo || []);
        renderJadwal(db.jadwal || []);
        renderNews(db.news || []);
        renderTicker(db.jadwal || []);
    } catch (err) {
        console.error("Gagal koneksi ke API:", err);
        const containers = ['promo-container', 'bus-grid', 'news-list'];
        containers.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.innerHTML = `<p style="padding:20px; font-size:0.8rem; color:red;">Gagal memuat data. Periksa koneksi atau API URL.</p>`;
        });
    }
}

/* --- RENDER PROMO CARD (TEXT JUSTIFY) --- */
function renderPromo(data) {
    const container = document.getElementById('promo-container');
    if (!container) return;
    
    if (data.length === 0) {
        container.innerHTML = `<p style="color:#888; font-size:0.8rem;">Belum ada promo aktif.</p>`;
        return;
    }

    container.innerHTML = data.map(p => `
        <div class="promo-card" style="background-image: linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.8)), url('${p.Foto}');" onclick="bukaBerita('${p.Judul}')">
            <h4>${p.Judul}</h4>
            <p>${p.Deskripsi || 'Klik untuk detail informasi.'}</p>
        </div>
    `).join('');
}

/* --- RENDER JADWAL BUS (3 KOLOM) --- */
function renderJadwal(data) {
    const grid = document.getElementById('bus-grid');
    if (!grid) return;

    grid.innerHTML = data.map(b => `
        <div class="bus-card">
            <img src="${b.Foto || 'https://via.placeholder.com/150'}" class="card-img" alt="${b["Nama PO"]}">
            <div style="padding:8px">
                <h4 style="font-size:0.75rem; margin-bottom:2px; color:#003B73;">${b.Tujuan}</h4>
                <p style="font-size:0.65rem; color:#777; font-weight:600;">${b["Nama PO"]}</p>
                <p style="font-size:0.75rem; font-weight:800; color:#E53E3E; margin-top:4px">Rp ${Number(b.Harga).toLocaleString('id-ID')}</p>
            </div>
        </div>
    `).join('');
}

/* --- RENDER MAHIKA NEWS (TEXT JUSTIFY) --- */
function renderNews(data) {
    const container = document.getElementById('news-list');
    if (!container) return;

    container.innerHTML = data.map(n => `
        <div class="news-item" onclick="bukaBerita('${n.Judul}')">
            <img src="${n.Foto}" class="news-img" alt="${n.Judul}">
            <div class="news-info">
                <h4>${n.Judul}</h4>
                <p>${n.Isi ? n.Isi.substring(0, 85) : ''}...</p>
            </div>
        </div>
    `).join('');
}

/* --- RENDER PARTNER TICKER (CARD SHADOW DARK) --- */
function renderTicker(jadwal) {
    const ticker = document.getElementById('ticker-content');
    if (!ticker) return;

    const pos = [...new Set(jadwal.map(b => b["Nama PO"]))];
    const doublePos = [...pos, ...pos]; // Duplikasi untuk infinite loop
    
    ticker.innerHTML = doublePos.map(name => `
        <div class="po-badge">
            <i class="fas fa-bus"></i> <span>${name.toUpperCase()}</span>
        </div>
    `).join('');
}

/* --- MODAL DETAIL BERITA --- */
function bukaBerita(judul) {
    const item = db.news.find(n => n.Judul === judul);
    if (!item) return;

    const detailBody = document.getElementById('news-detail-body');
    if (detailBody) {
        detailBody.innerHTML = `
            <img src="${item.Foto}" style="width:100%; border-radius:15px; margin-bottom:15px; box-shadow: 0 5px 15px rgba(0,0,0,0.1);">
            <h3 style="color:#003B73; margin-bottom:10px;">${item.Judul}</h3>
            <p style="text-align:justify; line-height:1.6; color:#444; font-size:0.9rem;">${item.Isi}</p>
        `;
        document.getElementById('modal-news').style.display = 'flex';
    }
}

function closeNews() {
    const modal = document.getElementById('modal-news');
    if (modal) modal.style.display = 'none';
}
