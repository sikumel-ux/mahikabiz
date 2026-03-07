const firebaseConfig = {
    apiKey: "AIzaSyBZNupFpsHWibTfthCtiGc8mzB2q0QaOqY",
    authDomain: "mahikabiz.firebaseapp.com",
    databaseURL: "https://mahikabiz-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "mahikabiz",
    storageBucket: "mahikabiz.firebasestorage.app",
    messagingSenderId: "795712739200",
    appId: "1:795712739200:web:5cb7b9627ffccb14f29365"
};

if (!firebase.apps.length) { firebase.initializeApp(firebaseConfig); }
const db = firebase.database();

async function performSearch() {
    const params = new URLSearchParams(window.location.search);
    const query = params.get('q') ? params.get('q').toLowerCase().trim() : "";
    
    document.getElementById('display-query').innerText = query ? `RUTE: ${query.toUpperCase()}` : "SEMUA JADWAL";

    try {
        const snapshot = await db.ref('jadwal').once('value');
        const data = snapshot.val();
        const container = document.getElementById('results-list');
        
        if (!data) {
            container.innerHTML = "<p>Jadwal belum tersedia.</p>";
            return;
        }

        // Filter Data (Gunakan trim() untuk hapus spasi tak terlihat dari DB)
        const results = Object.values(data).filter(item => {
            const tujuan = (item.tujuan || "").toLowerCase().trim();
            const po = (item.namaPO || "").toLowerCase().trim();
            return tujuan.includes(query) || po.includes(query);
        });

        renderResults(results, query);
    } catch (error) {
        document.getElementById('results-list').innerHTML = `<p>Gagal load: ${error.message}</p>`;
    }
}

function renderResults(list, q) {
    const container = document.getElementById('results-list');
    if (list.length === 0) {
        container.innerHTML = `<div class="no-result"><p>Rute "${q}" tidak ketemu, bro.</p></div>`;
        return;
    }

    container.innerHTML = list.map(b => `
        <div class="ticket-card">
            <div class="ticket-top">
                <span class="po-title">${b.namaPO.trim()}</span>
                <span class="jam-badge">${b.jam}</span>
            </div>
            <div class="ticket-mid">
                <h3>${b.tujuan}</h3>
                <span class="price-val">Rp ${Number(b.harga).toLocaleString('id-ID')}</span>
            </div>
            <a href="https://wa.me/6285156677461?text=Halo Mahika, mau pesan tiket ${b.namaPO.trim()} rute ${b.tujuan}" class="btn-wa">PESAN SEKARANG</a>
        </div>
    `).join('');
}

document.addEventListener('DOMContentLoaded', performSearch);
