const firebaseConfig = {
    apiKey: "AIzaSyBZNupFpsHWibTfthCtiGc8mzB2q0QaOqY",
    authDomain: "mahikabiz.firebaseapp.com",
    databaseURL: "https://mahikabiz-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "mahikabiz",
    storageBucket: "mahikabiz.firebasestorage.app",
    messagingSenderId: "795712739200",
    appId: "1:795712739200:web:5cb7b9627ffccb14f29365"
};

if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
const db = firebase.database();

function handleSearch(e) {
    if (e.key === 'Enter') {
        const val = e.target.value.trim();
        if(val) window.location.href = `search/?q=${encodeURIComponent(val)}`;
    }
}

function init() {
    // 1. PROMO (FIXED LOGIC)
    db.ref('promo').on('value', s => {
        const d = s.val();
        const container = document.getElementById('promo-list');
        if (d && container) {
            const list = Object.values(d); // Ubah object ke array
            container.innerHTML = list.map(p => `
                <div class="promo-card" style="background-image: url('${p.foto}')"></div>
            `).join('');
        }
    });

    // 2. NEWS (THUMBNAIL)
    db.ref('news').on('value', s => {
        const d = s.val();
        const container = document.getElementById('news-list');
        if (d && container) {
            const keys = Object.keys(d).reverse();
            container.innerHTML = keys.map(id => `
                <div class="news-item" onclick="window.location.href='news/?id=${id}'">
                    <img src="${d[id].foto}" class="news-img" onerror="this.src='https://via.placeholder.com/100'">
                    <div class="news-info">
                        <h4>${d[id].judul}</h4>
                        <p>${d[id].isi}</p>
                    </div>
                </div>`).join('');
        }
    });

    // 3. JADWAL & MARQUEE
    db.ref('jadwal').on('value', s => {
        const data = s.val();
        const list = data ? Object.values(data) : [];
        
        // Render Marquee
        const mqContainer = document.getElementById('marquee-po');
        let pos = [...new Set(list.map(x => x.namaPO))];
        if(pos.length > 0 && mqContainer) {
            while (pos.length < 10) pos.push(...pos);
            mqContainer.innerHTML = pos.map(p => `
                <div class="po-card-mini"><span>${p}</span></div>`).join('');
        }

        // Render Rute
        const busContainer = document.getElementById('bus-list');
        if(busContainer) {
            busContainer.innerHTML = list.map(b => `
                <div class="bus-card">
                    <img src="${b.foto}" onerror="this.src='https://via.placeholder.com/150'">
                    <div class="bus-card-body">
                        <h4>${b.tujuan}</h4>
                        <p style="font-size:0.6rem">${b.namaPO} | ${b.jam || '20:00'}</p>
                        <div class="bus-price">Rp ${Number(b.harga).toLocaleString('id-ID')}</div>
                        <a href="https://wa.me/6285156677461?text=Halo Mahika, pesan tiket ${b.namaPO} rute ${b.tujuan}" class="btn-wa">BOOKING</a>
                    </div>
                </div>`).join('');
        }
    });
}

document.addEventListener('DOMContentLoaded', init);
