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
            container.innerHTML = `<p style="text-align:center; padding:50px;">Jadwal kosong.</p>`;
            return;
        }

        const results = Object.values(data).filter(item => {
            const tujuan = (item.tujuan || "").toLowerCase().trim();
            const po = (item.namaPO || "").toLowerCase().trim();
            return tujuan.includes(query) || po.includes(query);
        });

        renderResults(results, query);
    } catch (e) {
        document.getElementById('results-list').innerHTML = `<p>Error koneksi.</p>`;
    }
}

function renderResults(list, q) {
    const container = document.getElementById('results-list');
    if (list.length === 0) {
        container.innerHTML = `<div class="no-result"><p>Rute "${q}" tidak ada.</p></div>`;
        return;
    }

    container.innerHTML = list.map(b => {
        const cleanPO = b.namaPO.trim();
        const formattedPrice = Number(b.harga).toLocaleString('id-ID'); // Fix Harga dari DB
        const waLink = `https://wa.me/6285156677461?text=Halo Mahika Trans, saya mau pesan tiket ${cleanPO} rute ${b.tujuan} jam ${b.jam}`;
        
        return `
        <div class="ticket-card">
            <div class="ticket-main-area">
                <img src="${b.foto}" class="ticket-img">
                <div class="ticket-details">
                    <div class="ticket-top">
                        <span class="po-title">${cleanPO}</span>
                        <span class="jam-badge">${b.jam}</span>
                    </div>
                    <div class="ticket-mid">
                        <h3>${b.tujuan}</h3>
                        <span class="price-val">Rp ${formattedPrice}</span>
                    </div>
                </div>
            </div>
            <div class="ticket-action">
                <a href="${waLink}" target="_blank" class="btn-wa">PESAN VIA WHATSAPP</a>
            </div>
        </div>`;
    }).join('');
}

document.addEventListener('DOMContentLoaded', performSearch);
