// ==========================================
// CONFIGURASI FIREBASE
// ==========================================
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
                <div class="promo-card" style="background-image: linear-gradient(to top, rgba(0,0,0,0.8), transparent), url('${p.foto}')">
                    <div class="promo-content">
                        <h4>${p.judul || ''}</h4>
                        <p>${p.desk || ''}</p> 
                    </div>
                </div>
            `).join('');
        }
    });

    // 2. JADWAL / RUTE POPULER (Logic: Split Koma -> Shuffle -> Limit 6)
    db.ref('jadwal').on('value', snapshot => {
        const data = snapshot.val();
        const container = document.getElementById('bus-list');
        if (data && container) {
            const rawList = Object.values(data);
            let allRoutesClean = [];

            // Step A: Pecah rute berdasarkan koma (Split)
            rawList.forEach(item => {
                const ruteArray = item.tujuan ? item.tujuan.split(',') : [];
                ruteArray.forEach(kota => {
                    const namaKota = kota.trim().toUpperCase();
                    if (namaKota !== "") {
                        allRoutesClean.push({
                            tujuan: namaKota,
                            namaPO: item.namaPO,
                            jam: item.jam,
                            harga: item.harga,
                            foto: item.foto
                        });
                    }
                });
            });

            // Step B: Acak Urutan (Shuffle) agar rute yang muncul selalu segar
            for (let i = allRoutesClean.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [allRoutesClean[i], allRoutesClean[j]] = [allRoutesClean[j], allRoutesClean[i]];
            }

            // Step C: Batasi hanya 6 rute (Limit)
            const limitedRoutes = allRoutesClean.slice(0, 6);

            // Step D: Render ke HTML
            container.innerHTML = limitedRoutes.map(b => {
                const formattedPrice = Number(b.harga).toLocaleString('id-ID');
                const waLink = `https://wa.me/6285156677461?text=Halo Mahika, mau pesan tiket ${b.namaPO} rute ${b.tujuan}`;
                
                return `
                    <div class="bus-card">
                        <img src="${b.foto || 'https://via.placeholder.com/300'}" alt="${b.tujuan}">
                        <div class="bus-card-body">
                            <h4>${b.tujuan}</h4>
                            <p class="bus-meta">${b.namaPO} | ${b.jam || 'Tiap Hari'}</p>
                            <div class="bus-price">Rp ${formattedPrice}</div>
                            <a href="${waLink}" target="_blank" class="btn-wa">BOOKING</a>
                        </div>
                    </div>
                `;
            }).join('');
        }
    });

    // 3. NEWS (Terbaru Muncul di Atas)
    db.ref('news').on('value', snapshot => {
        const data = snapshot.val();
        const container = document.getElementById('news-list');
        if (data && container) {
            const keys = Object.keys(data).reverse(); // Balik urutan ID
            container.innerHTML = keys.slice(0, 5).map(id => `
                <div class="news-item" onclick="window.location.href='news/?id=${id}'">
                    <img src="${data[id].foto || 'https://via.placeholder.com/100'}" class="news-img">
                    <div class="news-info">
                        <h4>${data[id].judul}</h4>
                        <p>${data[id].isi.substring(0, 65)}...</p>
                    </div>
                </div>
            `).join('');
        }
    });

    // 4. MARQUEE PARTNERS (Auto-Loop Mulus)
    db.ref('partners').on('value', snapshot => {
        const data = snapshot.val();
        const container = document.getElementById('marquee-po');
        if (data && container) {
            let list = Object.values(data).map(p => p.nama);
            if (list.length > 0) {
                // Duplikasi list agar animasi loop tidak putus
                const displayList = [...list, ...list, ...list];
                container.innerHTML = displayList.map(nama => `
                    <div class="po-card-mini"><span>${nama.toUpperCase()}</span></div>
                `).join('');
            }
        }
    });
}

// ==========================================
// SEARCH HANDLER (Pindah ke Halaman Search)
// ==========================================
const searchInput = document.getElementById('search-input');
if (searchInput) {
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const query = e.target.value.toLowerCase().trim();
            if (query) {
                window.location.href = `search/?q=${encodeURIComponent(query)}`;
            }
        }
    });
}

// Jalankan saat DOM siap
document.addEventListener('DOMContentLoaded', init);
                             
