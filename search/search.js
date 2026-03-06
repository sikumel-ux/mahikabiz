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
const db = firebase.database();

async function performSearch() {
    // 1. Ambil keyword dari URL (?q=keyword)
    const params = new URLSearchParams(window.location.search);
    const query = params.get('q') ? params.get('q').toLowerCase() : "";
    
    document.getElementById('display-query').innerText = query ? `Rute: ${query.toUpperCase()}` : "Semua Jadwal";

    try {
        const snapshot = await db.ref('jadwal').once('value');
        const data = snapshot.val();
        const results = [];

        for (let id in data) {
            const item = data[id];
            // Filter berdasarkan tujuan atau nama PO
            if (item.tujuan.toLowerCase().includes(query) || item.namaPO.toLowerCase().includes(query)) {
                results.push(item);
            }
        }

        renderResults(results);
    } catch (error) {
        console.error("Gagal ambil data:", error);
    } finally {
        document.getElementById('search-loader').style.display = 'none';
    }
}

function renderResults(list) {
    const container = document.getElementById('results-list');
    document.getElementById('result-count').innerText = `${list.length} Tiket ditemukan`;

    if (list.length === 0) {
        container.innerHTML = `
        <div class="no-data">
            <i class="fas fa-search-minus fa-4x"></i>
            <p style="margin-top:20px">Waduh, tiket belum tersedia, bro!</p>
        </div>`;
        return;
    }

    container.innerHTML = list.map(b => {
        const waLink = `https://wa.me/6285156677461?text=Halo Mahika Trans, saya mau cek tiket ${b.namaPO} rute ${b.tujuan} jam ${b.jam}`;
        return `
        <div class="ticket-card">
            <div class="ticket-row-1">
                <span class="po-name">${b.namaPO}</span>
                <span class="departure-time"><i class="far fa-clock"></i> ${b.jam || '--:--'}</span>
            </div>
            <div class="ticket-row-2">
                <div class="route-detail">
                    <h3>${b.tujuan}</h3>
                    <p><i class="fas fa-shield-alt"></i> Mahika Verified Partner</p>
                </div>
                <div class="price-box">
                    <div class="price-label">Harga mulai</div>
                    <div class="price-value">Rp ${Number(b.harga).toLocaleString('id-ID')}</div>
                </div>
            </div>
            <a href="${waLink}" target="_blank" class="btn-book">PESAN VIA WHATSAPP</a>
        </div>`;
    }).join('');
}

document.addEventListener('DOMContentLoaded', performSearch);
