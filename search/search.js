// Pastikan Config Firebase sama dengan yang di index.html
const firebaseConfig = {
    apiKey: "AIzaSyBZNupFpsHWibTfthCtiGc8mzB2q0QaOqY",
    authDomain: "mahikabiz.firebaseapp.com",
    databaseURL: "https://mahikabiz-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "mahikabiz",
    storageBucket: "mahikabiz.firebasestorage.app",
    messagingSenderId: "795712739200",
    appId: "1:795712739200:web:5cb7b9627ffccb14f29365"
};

// Initialize
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.database();

async function performSearch() {
    const params = new URLSearchParams(window.location.search);
    const query = params.get('q') ? params.get('q').toLowerCase().trim() : "";
    
    // Tampilkan apa yang dicari di header
    const displayElement = document.getElementById('display-query');
    if(displayElement) displayElement.innerText = query ? `Rute: ${query.toUpperCase()}` : "Semua Jadwal";

    try {
        // Ambil data dari path 'jadwal'
        const snapshot = await db.ref('jadwal').once('value');
        const data = snapshot.val();
        
        let results = [];
        
        if (data) {
            // Kita ubah object jadi array dan filter
            results = Object.values(data).filter(item => {
                const tujuan = item.tujuan ? item.tujuan.toLowerCase() : "";
                const po = item.namaPO ? item.namaPO.toLowerCase() : "";
                return tujuan.includes(query) || po.includes(query);
            });
        }

        renderResults(results);
    } catch (error) {
        console.error("Firebase Error:", error);
        document.getElementById('results-list').innerHTML = `<p style="text-align:center; padding:20px;">Gagal mengambil data. Cek koneksi, bro.</p>`;
    }
}

function renderResults(list) {
    const container = document.getElementById('results-list');
    
    if (list.length === 0) {
        container.innerHTML = `
        <div class="no-result">
            <i class="fas fa-search-minus fa-3x" style="color:#ccc; display:block; margin-bottom:15px;"></i>
            <p>Rute "${new URLSearchParams(window.location.search).get('q')}" tidak ditemukan.</p>
            <a href="../index.html" style="color:var(--p-dark); font-weight:bold; text-decoration:none; display:inline-block; margin-top:10px;">Cari rute lain?</a>
        </div>`;
        return;
    }

    container.innerHTML = list.map(b => {
        const waLink = `https://wa.me/6285156677461?text=Halo Mahika Trans, saya mau pesan tiket ${b.namaPO} rute ${b.tujuan} jam ${b.jam}`;
        return `
        <div class="ticket-card">
            <div class="ticket-top">
                <span class="po-title">${b.namaPO}</span>
                <span class="jam-badge"><i class="far fa-clock"></i> ${b.jam || '20:00'}</span>
            </div>
            <div class="ticket-mid">
                <div class="route-text">
                    <h3>${b.tujuan}</h3>
                    <p>Mahika Official Partner</p>
                </div>
                <div class="price-text">
                    <span class="price-val">Rp ${Number(b.harga).toLocaleString('id-ID')}</span>
                </div>
            </div>
            <a href="${waLink}" target="_blank" class="btn-wa" style="margin-top:15px; width:100%;">PESAN VIA WHATSAPP</a>
        </div>`;
    }).join('');
}

document.addEventListener('DOMContentLoaded', performSearch);
