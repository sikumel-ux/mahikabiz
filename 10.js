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
    // 1. PROMO (Load Judul & Deskripsi dari Firebase)
db.ref('promo').on('value', snapshot => {
    const data = snapshot.val();
    const container = document.getElementById('promo-list');
    if (data && container) {
        const list = Object.values(data);
        container.innerHTML = list.map(p => `
            <div class="promo-card" style="background-image: url('${p.foto}')">
                <div class="promo-content">
                    <h4>${p.judul || ''}</h4>
                    <p>${p.desk || ''}</p> 
                </div>
            </div>
        `).join('');
    }
});


    // 2. JADWAL
    db.ref('jadwal').on('value', snapshot => {
        const data = snapshot.val();
        const container = document.getElementById('bus-list');
        if (data && container) {
            const list = Object.values(data);
            container.innerHTML = list.map(b => `
                <div class="bus-card">
                    <img src="${b.foto || 'https://via.placeholder.com/150'}" alt="Bus">
                    <div class="bus-card-body">
                        <h4>${b.tujuan}</h4>
                        <p style="font-size:0.6rem; color:#666; margin-top:2px;">${b.namaPO} | ${b.jam || 'Tiap Hari'}</p>
                        <div class="bus-price">Rp ${Number(b.harga).toLocaleString('id-ID')}</div>
                        <a href="https://wa.me/6285156677461?text=Halo Mahika, mau pesan tiket ${b.namaPO} rute ${b.tujuan}" class="btn-wa">BOOKING</a>
                    </div>
                </div>
            `).join('');
        }
    });

    // 3. NEWS
    db.ref('news').on('value', snapshot => {
        const data = snapshot.val();
        const container = document.getElementById('news-list');
        if (data && container) {
            const keys = Object.keys(data).reverse();
            container.innerHTML = keys.map(id => `
                <div class="news-item" onclick="window.location.href='news/?id=${id}'">
                    <img src="${data[id].foto || 'https://via.placeholder.com/100'}" class="news-img">
                    <div class="news-info">
                        <h4>${data[id].judul}</h4>
                        <p>${data[id].isi}</p>
                    </div>
                </div>
            `).join('');
        }
    });

    // 4. MARQUEE (Duplikasi List biar 12 item keluar semua)
    db.ref('partners').on('value', snapshot => {
        const data = snapshot.val();
        const container = document.getElementById('marquee-po');
        if (data && container) {
            let list = Object.values(data).map(p => p.nama);
            if (list.length > 0) {
                // Duplikasi list agar animasi loop -50% tidak kepotong
                const displayList = [...list, ...list];
                container.innerHTML = displayList.map(nama => `
                    <div class="po-card-mini"><span>${nama}</span></div>
                `).join('');
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', init);

document.getElementById('search-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        const query = e.target.value.toLowerCase();
        if (query) window.location.href = `search/?q=${encodeURIComponent(query)}`;
    }
});
