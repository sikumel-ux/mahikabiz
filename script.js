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

function loadDashboard() {
    // 1. Promo
    db.ref('promo').on('value', s => {
        const d = s.val();
        if(d) document.getElementById('promo-list').innerHTML = Object.values(d).map(p => `
            <div class="promo-card" style="background-image:url('${p.foto}')"></div>`).join('');
    });

    // 2. News
    db.ref('news').on('value', s => {
        const d = s.val();
        if(!d) return;
        const keys = Object.keys(d).reverse();
        document.getElementById('news-list').innerHTML = keys.map(id => `
            <div class="news-item" onclick="window.location.href='news/?id=${id}'">
                <img src="${d[id].foto}" class="news-img">
                <div class="news-info"><h4>${d[id].judul}</h4><p>${d[id].isi.substring(0,50)}...</p></div>
            </div>`).join('');
    });

    // 3. Jadwal & Marquee PO
    db.ref('jadwal').on('value', s => {
        const d = s.val() ? Object.values(s.val()) : [];
        
        // Render Marquee PO (Nama Saja, Font Gede, Looping 10+)
        let pos = [...new Set(d.map(x => x.namaPO))];
        while (pos.length < 10 && pos.length > 0) pos.push(...pos);
        document.getElementById('marquee-po').innerHTML = pos.map(p => `
            <div class="po-card-mini"><span>${p}</span></div>`).join('');

        // Render Rute Populer
        document.getElementById('bus-list').innerHTML = d.map(b => `
            <div class="bus-card">
                <img src="${b.foto}" onerror="this.src='https://via.placeholder.com/150'">
                <div class="bus-card-body">
                    <h4>${b.tujuan}</h4>
                    <p style="font-size:0.65rem">${b.namaPO} | ${b.jam}</p>
                    <div class="bus-price">Rp ${Number(b.harga).toLocaleString('id-ID')}</div>
                    <a href="https://wa.me/6285156677461?text=Halo Mahika, pesan tiket ${b.namaPO} rute ${b.tujuan}" class="btn-wa">BOOKING</a>
                </div>
            </div>`).join('');
    });
}

document.addEventListener('DOMContentLoaded', loadDashboard);
