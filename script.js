const firebaseConfig = {
    apiKey: "AIzaSyBZNupFpsHWibTfthCtiGc8mzB2q0QaOqY",
    authDomain: "mahikabiz.firebaseapp.com",
    databaseURL: "https://mahikabiz-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "mahikabiz",
    storageBucket: "mahikabiz.firebasestorage.app",
    messagingSenderId: "795712739200",
    appId: "1:795712739200:web:5cb7b9627ffccb14f29365"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();
let localJadwal = [];

function initApp() {
    // 1. Ambil Promo
    database.ref('promo').on('value', (s) => {
        const data = s.val() ? Object.values(s.val()) : [];
        renderPromo(data);
    });

    // 2. Ambil Jadwal
    database.ref('jadwal').on('value', (s) => {
        localJadwal = s.val() ? Object.values(s.val()) : [];
        renderJadwal(localJadwal);
    });

    // 3. Ambil News
    database.ref('news').on('value', (s) => {
        const data = s.val() ? Object.values(s.val()) : [];
        renderNews(data.reverse()); // News terbaru di atas
    });
}

function renderPromo(data) {
    const el = document.getElementById('promo-list');
    if (el) el.innerHTML = data.map(p => `
        <div class="promo-card" style="background-image: url('${p.foto}')">
            <h4>${p.judul}</h4>
            <p>${p.desk || ''}</p>
        </div>
    `).join('');
}

function renderJadwal(data) {
    const el = document.getElementById('bus-list');
    if (el) el.innerHTML = data.map(b => `
        <div class="bus-card">
            <img src="${b.foto}" onerror="this.src='https://via.placeholder.com/150'">
            <div class="bus-card-body">
                <h4>${b.tujuan}</h4>
                <p>${b.namaPO}</p>
                <div class="bus-price">Rp ${Number(b.harga).toLocaleString('id-ID')}</div>
            </div>
        </div>
    `).join('');
}

function renderNews(data) {
    const el = document.getElementById('news-list');
    if (el) el.innerHTML = data.map(n => `
        <div class="news-item">
            <img src="${n.foto}" class="news-img" onerror="this.src='https://via.placeholder.com/100'">
            <div class="news-info">
                <h4>${n.judul}</h4>
                <p>${n.isi.substring(0, 80)}...</p>
                <small style="color:#999;">${n.tanggal}</small>
            </div>
        </div>
    `).join('');
}

// Fitur Search
const searchInput = document.getElementById('search-input');
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const key = e.target.value.toLowerCase();
        const filtered = localJadwal.filter(b => 
            b.tujuan.toLowerCase().includes(key) || 
            b.namaPO.toLowerCase().includes(key)
        );
        renderJadwal(filtered);
    });
}

document.addEventListener('DOMContentLoaded', initApp);
