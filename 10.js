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

function init() {
    // 1. PROMO (Slide Banner)
    db.ref('promo').on('value', snapshot => {
        const data = snapshot.val();
        const container = document.getElementById('promo-list');
        if (data && container) {
            const list = Object.values(data);
            container.innerHTML = list.map(p => `
                <div class="promo-card" style="background-image: linear-gradient(to top, rgba(0,0,0,0.7), transparent), url('${p.foto}')">
                    <div class="promo-content">
                        <h4>${p.judul || ''}</h4>
                        <p>${p.desk || ''}</p> 
                    </div>
                </div>
            `).join('');
        }
    });

    // 2. JADWAL / RUTE POPULER (Logic Split Aktif)
    db.ref('jadwal').on('value', snapshot => {
        const data = snapshot.val();
        const container = document.getElementById('bus-list');
        if (data && container) {
            const rawList = Object.values(data);
            let html = '';

            rawList.forEach(b => {
                // Ambil data rute dan pecah berdasarkan koma
                const ruteArray = b.tujuan ? b.tujuan.split(',') : [];
                
                ruteArray.forEach(kota => {
                    const namaKota = kota.trim().toUpperCase();
                    if (namaKota !== "") {
                        const formattedPrice = Number(b.harga).toLocaleString('id-ID');
                        const waLink = `https://wa.me/6285156677461?text=Halo Mahika, mau pesan tiket ${b.namaPO} rute ${namaKota}`;
                        
                        html += `
                            <div class="bus-card">
                                <img src="${b.foto || 'https://via.placeholder.com/300'}" alt="${namaKota}">
                                <div class="bus-card-body">
                                    <h4>${namaKota}</h4>
                                    <p class="bus-meta">${b.namaPO} | ${b.jam || 'Tiap Hari'}</p>
                                    <div class="bus-price">Rp ${formattedPrice}</div>
                                    <a href="${waLink}" target="_blank" class="btn-wa">BOOKING</a>
                                </div>
                            </div>
                        `;
                    }
                });
            });
            container.innerHTML = html;
        }
    });

    // 3. NEWS (Terbaru di Atas)
    db.ref('news').on('value', snapshot => {
        const data = snapshot.val();
        const container = document.getElementById('news-list');
        if (data && container) {
            // Ambil ID dan balik urutannya agar yang terbaru muncul pertama
            const keys = Object.keys(data).reverse();
            container.innerHTML = keys.map(id => `
                <div class="news-item" onclick="window.location.href='news/?id=${id}'">
                    <img src="${data[id].foto || 'https://via.placeholder.com/100'}" class="news-img">
                    <div class="news-info">
                        <h4>${data[id].judul}</h4>
                        <p>${data[id].isi.substring(0, 60)}...</p>
                    </div>
                </div>
            `).join('');
        }
    });

    // 4. MARQUEE PARTNERS (Auto-Loop)
    db.ref('partners').on('value', snapshot => {
        const data = snapshot.val();
        const container = document.getElementById('marquee-po');
        if (data && container) {
            let list = Object.values(data).map(p => p.nama);
            if (list.length > 0) {
                // Duplikasi 3x agar animasi berjalan mulus tanpa gap kosong
                const displayList = [...list, ...list, ...list];
                container.innerHTML = displayList.map(nama => `
                    <div class="po-card-mini"><span>${nama.toUpperCase()}</span></div>
                `).join('');
            }
        }
    });
}

// Handler Search Bar
const searchInp = document.getElementById('search-input');
if (searchInp) {
    searchInp.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const query = e.target.value.toLowerCase().trim();
            if (query) window.location.href = `search/?q=${encodeURIComponent(query)}`;
        }
    });
}

document.addEventListener('DOMContentLoaded', init);
