const API_URL = "https://script.google.com/macros/s/AKfycbxb86eZnUZvSYWRkX2uSxohRzien9x1zHyu1XZGkKCV8tekejSG8DygZTdI3bEkDThF0Q/exec";
let db = { jadwal: [], news: [], promo: [] };

document.addEventListener('DOMContentLoaded', () => {
    setInterval(updateClock, 1000);
    loadData();
});

function updateClock() {
    const now = new Date();
    document.getElementById('header-date').innerText = now.toLocaleDateString('id-ID', {day:'numeric', month:'short'});
    document.getElementById('header-time').innerText = now.toLocaleTimeString('id-ID', {hour:'2-digit', minute:'2-digit'});
}

async function loadData() {
    try {
        const res = await fetch(API_URL);
        db = await res.json();
        renderPromo(db.promo);
        renderJadwal(db.jadwal);
        renderNews(db.news);
        renderPartnerCards(db.jadwal);
    } catch (e) { console.error("Load Error:", e); }
}

function renderPromo(data) {
    const container = document.getElementById('promo-container');
    container.innerHTML = data.map(item => `
        <div class="promo-card" style="background-image: linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.8)), url('${item.Foto}');" onclick="bukaBerita('${item.Judul}')">
            <h4>${item.Judul}</h4>
            <p>${item.Deskripsi || 'Klik untuk informasi selengkapnya mengenai promo spesial Mahika Trans.'}</p>
        </div>
    `).join('');
}

function renderJadwal(data) {
    const grid = document.getElementById('bus-grid');
    grid.innerHTML = data.map(bus => `
        <div class="bus-card">
            <img src="${bus.Foto || 'https://via.placeholder.com/200'}" class="card-img">
            <div style="padding: 8px;">
                <h4 style="font-size:0.7rem;">${bus.Tujuan}</h4>
                <p style="font-size:0.6rem; color:#666;">${bus["Nama PO"]}</p>
                <p style="font-size:0.7rem; font-weight:800; color:#E53E3E; margin-top:3px;">Rp ${Number(bus.Harga).toLocaleString('id-ID')}</p>
            </div>
        </div>
    `).join('');
}

function renderNews(data) {
    const list = document.getElementById('news-list');
    list.innerHTML = data.map(n => `
        <div class="news-item" onclick="showNewsDetail('${n.rowIdx}')">
            <img src="${n.Foto}" class="news-img">
            <div class="news-info">
                <h4>${n.Judul}</h4>
                <p>${n.Isi.substring(0, 75)}...</p>
            </div>
        </div>
    `).join('');
}

function renderPartnerCards(jadwal) {
    const ticker = document.getElementById('ticker-content');
    const pos = [...new Set(jadwal.map(b => b["Nama PO"]))];
    // Double data for seamless infinite scroll
    const displayPos = [...pos, ...pos]; 
    ticker.innerHTML = displayPos.map(name => `
        <div class="po-badge">
            <i class="fas fa-bus"></i>
            <span>${name.toUpperCase()}</span>
        </div>
    `).join('');
}

function showNewsDetail(idx) {
    const item = db.news.find(n => n.rowIdx == idx);
    const body = document.getElementById('news-detail-body');
    body.innerHTML = `
        <img src="${item.Foto}" style="width:100%; border-radius:15px; margin-bottom:15px;">
        <h3 style="color:#003B73; margin-bottom:10px;">${item.Judul}</h3>
        <p>${item.Isi}</p>
    `;
    document.getElementById('modal-news').style.display = 'flex';
}

function bukaBerita(judul) {
    const b = db.news.find(n => n.Judul === judul);
    if(b) showNewsDetail(b.rowIdx);
}

function closeNews() { document.getElementById('modal-news').style.display = 'none'; }
