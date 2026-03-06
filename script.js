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
    // Ambil Jadwal Realtime
    database.ref('jadwal').on('value', (snapshot) => {
        const data = snapshot.val();
        localJadwal = data ? Object.values(data) : [];
        renderJadwal(localJadwal);
    });

    // Ambil News Realtime
    database.ref('news').on('value', (snapshot) => {
        const data = snapshot.val();
        const newsArray = data ? Object.values(data) : [];
        renderNews(newsArray);
    });
}

function renderJadwal(data) {
    const container = document.getElementById('bus-list');
    if (!container) return;
    container.innerHTML = data.map(b => `
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
    const container = document.getElementById('news-list');
    if (!container) return;
    container.innerHTML = data.reverse().map(n => `
        <div class="news-item">
            <img src="${n.foto}" class="news-img" onerror="this.src='https://via.placeholder.com/100'">
            <div class="news-info">
                <h4>${n.judul}</h4>
                <p>${n.isi.substring(0, 80)}...</p>
                <small style="color:#999; font-size:0.6rem;">${n.tanggal}</small>
            </div>
        </div>
    `).join('');
}

// Fitur Search Realtime
document.getElementById('search-input').addEventListener('input', (e) => {
    const key = e.target.value.toLowerCase();
    const filtered = localJadwal.filter(b => 
        b.tujuan.toLowerCase().includes(key) || 
        b.namaPO.toLowerCase().includes(key)
    );
    renderJadwal(filtered);
});

document.addEventListener('DOMContentLoaded', initApp);
