const firebaseConfig = {
    apiKey: "AIzaSyBZNupFpsHWibTfthCtiGc8mzB2q0QaOqY",
    authDomain: "mahikabiz.firebaseapp.com",
    databaseURL: "https://mahikabiz-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "mahikabiz",
    storageBucket: "mahikabiz.firebasestorage.app",
    messagingSenderId: "795712739200",
    appId: "1:795712739200:web:5cb7b9627ffccb14f29365"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

function handleSearch(e) {
    if (e.key === 'Enter') {
        window.location.href = `search/?q=${encodeURIComponent(e.target.value)}`;
    }
}

function init() {
    db.ref('promo').on('value', s => {
        const d = s.val();
        if(d) document.getElementById('promo-list').innerHTML = Object.values(d).map(p => `<div class="promo-card" style="background-image:url('${p.foto}')"></div>`).join('');
    });

    db.ref('news').on('value', s => {
        const d = s.val();
        if(!d) return;
        const keys = Object.keys(d).reverse();
        document.getElementById('news-list').innerHTML = keys.map(id => `
            <div class="news-item" onclick="window.location.href='news/?id=${id}'">
                <img src="${d[id].foto}" class="news-img">
                <div class="news-info"><h4>${d[id].judul}</h4><p style="font-size:0.7rem">${d[id].isi.substring(0,50)}...</p></div>
            </div>`).join('');
    });

    db.ref('jadwal').on('value', s => {
        const d = s.val() ? Object.values(s.val()) : [];
        // Render Marquee PO Cards
        const pos = [...new Set(d.map(x => x.namaPO))];
        document.getElementById('marquee-po').innerHTML = [...pos, ...pos].map(p => `
            <div class="po-card-mini"><i class="fas fa-bus" style="color:#ddd;margin-bottom:5px;display:block"></i><span style="font-size:0.7rem;font-weight:800;color:#003B73">${p}</span></div>
        `).join('');

        // Render Rute
        document.getElementById('bus-list').innerHTML = d.map(b => `
            <div class="bus-card">
                <img src="${b.foto}">
                <div class="bus-card-body">
                    <h4 style="font-size:0.8rem">${b.tujuan}</h4>
                    <p style="font-size:0.6rem">${b.namaPO} | ${b.jam}</p>
                    <div class="bus-price">Rp ${Number(b.harga).toLocaleString()}</div>
                    <a href="https://wa.me/6285156677461?text=Halo Mahika, pesan tiket ${b.namaPO} rute ${b.tujuan}" class="btn-wa">BOOKING</a>
                </div>
            </div>`).join('');
    });
}
document.addEventListener('DOMContentLoaded', init);
