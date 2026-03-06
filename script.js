// Link API Deployment Apps Script Terbaru
const API_URL = "https://script.google.com/macros/s/AKfycbwXFK-T4SaQK12gyx0WkaOgfLIxSqjaPYQC3Pz2F78A3DkUEwZ_Oh816FDF1_p__jISww/exec";

// Database Local untuk Search
let db = {
    jadwal: [],
    news: [],
    promo: []
};

// --- FUNGSI UTAMA LOAD DATA ---
async function loadData() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        
        db = data; // Simpan ke local db

        renderPromo(data.promo);
        renderJadwal(data.jadwal);
        renderNews(data.news);
        
    } catch (error) {
        console.error("Gagal Memuat Data MAHIKA:", error);
    }
}

// --- RENDER PROMO SLIDER ---
function renderPromo(data) {
    const container = document.getElementById('promo-list');
    if (!container) return;
    
    container.innerHTML = data.map(p => `
        <div class="promo-card" style="background-image: url('${p.Foto || 'https://via.placeholder.com/300x150'}')">
            <h4>${p.Judul}</h4>
            <p>${p.Deskripsi || ''}</p>
        </div>
    `).join('');
}

// --- RENDER JADWAL BUS (3 KOLOM) ---
function renderJadwal(data) {
    const container = document.getElementById('bus-list');
    if (!container) return;

    if (data.length === 0) {
        container.innerHTML = `<p style="grid-column: span 3; font-size: 0.8rem; text-align: center; color: #888;">Rute tidak ditemukan...</p>`;
        return;
    }

    container.innerHTML = data.map(b => `
        <div class="bus-card">
            <img src="${b.Foto || 'https://via.placeholder.com/150'}" alt="${b.Tujuan}">
            <div class="bus-card-body">
                <h4>${b.Tujuan}</h4>
                <p>${b["Nama PO"]}</p>
                <div class="bus-price">Rp ${Number(b.Harga).toLocaleString('id-ID')}</div>
            </div>
        </div>
    `).join('');
}

// --- RENDER NEWS ---
function renderNews(data) {
    const container = document.getElementById('news-list');
    if (!container) return;

    container.innerHTML = data.map(n => `
        <div class="news-item">
            <img src="${n.Foto || 'https://via.placeholder.com/100'}" class="news-img">
            <div class="news-info">
                <h4>${n.Judul}</h4>
                <p>${n.Isi ? n.Isi.substring(0, 85) : ''}...</p>
            </div>
        </div>
    `).join('');
}

// --- LOGIKA SEARCH ---
const searchInput = document.getElementById('search-input');
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const keyword = e.target.value.toLowerCase();
        
        // Filter rute berdasarkan tujuan atau nama PO
        const filteredJadwal = db.jadwal.filter(item => 
            item.Tujuan.toLowerCase().includes(keyword) || 
            item["Nama PO"].toLowerCase().includes(keyword)
        );
        
        renderJadwal(filteredJadwal);
    });
}

// Jalankan Load Data saat halaman siap
document.addEventListener('DOMContentLoaded', loadData);
