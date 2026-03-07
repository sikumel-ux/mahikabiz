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
    
    const displayElement = document.getElementById('display-query');
    if(displayElement) displayElement.innerText = query ? `RUTE: ${query.toUpperCase()}` : "SEMUA JADWAL";

    try {
        const snapshot = await db.ref('jadwal').once('value');
        const data = snapshot.val();
        const container = document.getElementById('results-list');
        
        if (!data) {
            container.innerHTML = `<div class="no-result"><p>Data jadwal belum tersedia.</p></div>`;
            return;
        }

        // Filter: Tujuan atau Nama PO (Gunakan trim untuk keamanan data)
        const results = Object.values(data).filter(item => {
            const tujuan = (item.tujuan || "").toLowerCase().trim();
            const po = (item.namaPO || "").toLowerCase().trim();
            return tujuan.includes(query) || po.includes(query);
        });

        renderResults(results, query);
    } catch (error) {
        console.error(error);
        document.getElementById('results-list').innerHTML = `<p style="text-align:center;">Gagal memuat data.</p>`;
    }
}

function renderResults(list, q) {
    const container = document.getElementById('results-list');
    
    if (list.length === 0) {
        container.innerHTML = `
        <div class="no-result">
            <i class="fas fa-search-minus fa-3x" style="margin-bottom:15px; color:#ddd;"></i>
            <p>Rute "${q}" tidak ditemukan.</p>
            <a href="../index.html" style="color:var(--p-dark); font-weight:800; text-decoration:none; display:block; margin-top:10px;">Cari Rute Lain?</a>
        </div>`;
        return;
    }

    container.innerHTML = list.map(b => {
        // Membersihkan data dari spasi dan menyiapkan foto
        const cleanPO = b.namaPO ? b.namaPO.trim() : "MAHIKA PARTNER";
        const fotoBus = b.foto || 'https://via.placeholder.com/150?text=MAHIKA';
        const formattedPrice = Number(b.harga).toLocaleString('id-ID'); // Konversi String ke Rupiah
        
        const waLink = `https://wa.me/6285156677461?text=Halo Mahika Trans, saya mau pesan tiket ${cleanPO} rute ${b.tujuan} jam ${b.jam}`;
        
        return `
        <div class="ticket-card">
            <div class="ticket-main-area">
                <img src="${fotoBus}" class="ticket-img" alt="${cleanPO}">
                
                <div class="ticket-details">
                    <div class="ticket-top">
                        <span class="po-title">${cleanPO}</span>
                        <span class="jam-badge"><i class="far fa-clock"></i> ${b.jam}</span>
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
    
