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
    // 1. PROMO LOADER
    db.ref('promo').on('value', snap => {
        const data = snap.val();
        const container = document.getElementById('promo-list');
        if (data && container) {
            container.innerHTML = Object.values(data).map(p => `
                <div class="promo-card" style="background-image: linear-gradient(to top, rgba(0,0,0,0.85), transparent), url('${p.foto}')">
                    <div class="promo-content">
                        <h4>${p.judul || ''}</h4>
                        <p>${p.desk || ''}</p> 
                    </div>
                </div>
            `).join('');
        }
    });

    // 2. JADWAL (SPLIT, SHUFFLE, LIMIT 4, PHOTO BIND)
    db.ref('jadwal').on('value', snap => {
        const data = snap.val();
        const container = document.getElementById('bus-list');
        if (data && container) {
            const rawList = Object.values(data);
            let allRoutes = [];

            rawList.forEach(item => {
                const fotoValid = item.foto || 'https://via.placeholder.com/300x180?text=MAHIKA+TRANS';
                const ruteArray = item.tujuan ? item.tujuan.split(',') : [];
                
                ruteArray.forEach(kota => {
                    const namaKota = kota.trim().toUpperCase();
                    if (namaKota !== "") {
                        allRoutes.push({
                            tujuan: namaKota,
                            namaPO: item.namaPO,
                            jam: item.jam,
                            harga: item.harga,
                            foto: fotoValid // Semua rute split pake foto yang sama
                        });
                    }
                });
            });

            // Fisher-Yates Shuffle (Acak Rute)
            for (let i = allRoutes.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [allRoutes[i], allRoutes[j]] = [allRoutes[j], allRoutes[i]];
            }

            // Batasi 4 rute saja
            const limited = allRoutes.slice(0, 4);

            container.innerHTML = limited.map(b => `
                <div class="bus-card">
                    <img src="${b.foto}" alt="${b.tujuan}" loading="lazy">
                    <div class="bus-card-body">
                        <div>
                            <h4>${b.tujuan}</h4>
                            <div class="bus-meta">${b.namaPO} | ${b.jam || 'TIAP HARI'}</div>
                        </div>
                      // <div class="bus-price">Rp ${Number(b.harga).toLocaleString('id-ID')}</div> 
                        <a href="https://wa.me/6285156677461?text=Halo Mahika, mau pesan tiket ${b.namaPO} rute ${b.tujuan}" class="btn-wa">BOOKING</a>
                    </div>
                </div>
            `).join('');
        }
    });

    // 3. NEWS LOADER
    db.ref('news').on('value', snap => {
        const data = snap.val();
        const container = document.getElementById('news-list');
        if (data && container) {
            const keys = Object.keys(data).reverse();
            container.innerHTML = keys.slice(0, 4).map(id => `
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

    // 4. PARTNERS MARQUEE
    db.ref('partners').on('value', snap => {
        const data = snap.val();
        const container = document.getElementById('marquee-po');
        if (data && container) {
            let list = Object.values(data).map(p => p.nama);
            const displayList = [...list, ...list, ...list];
            container.innerHTML = displayList.map(nama => `
                <div class="po-card-mini"><span>${nama.toUpperCase()}</span></div>
            `).join('');
        }
    });
}

// SEARCH HANDLER
document.getElementById('search-input')?.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        const query = e.target.value.toLowerCase().trim();
        if (query) window.location.href = `/jadwal?q=${encodeURIComponent(query)}`;
    }
});

document.addEventListener('DOMContentLoaded', init);
