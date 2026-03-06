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
    // Promo
    db.ref('promo').on('value', s => {
        const d = s.val() ? Object.values(s.val()) : [];
        document.getElementById('promo-list').innerHTML = d.map(p => `<div class="promo-card" style="background-image:url('${p.foto}')"></div>`).join('');
    });

    // News (Thumbnail Style)
    db.ref('news').on('value', s => {
        const d = s.val();
        if(!d) return;
        const keys = Object.keys(d).reverse();
        document.getElementById('news-list').innerHTML = keys.map(id => `
            <div class="news-item" onclick="window.location.href='news/?id=${id}'">
                <img src="${d[id].foto}" class="news-img" onerror="this.src='https://via.placeholder.com/100'">
                <div class="news-info">
                    <h4>${d[id].judul}</h4>
                    <p>${d[id].isi}</p>
                </div>
            </div>`).join('');
    });

    // Jadwal & Marquee
    db.ref('jadwal').on('value', s => {
        const d = s.val() ? Object.values(s.val()) : [];
        
        // Marquee Bold
        let pos = [...new Set(d.map(x => x.namaPO))];
        if(pos.length > 0) {
            while (pos.length < 10) pos.push(...pos);
            document.getElementById('marquee-po').innerHTML = pos.map(p => `
                <div class="po-card-mini"><span>${p}</span></div>`).join('');
        }

        // Rute
        document.getElementById('bus-list').innerHTML = d.map(b => `
            <div class="bus-card">
                <img src="${b.foto}">
                <div class="bus-card-body">
                    <h4>${b.tujuan}</h4>
                    <p style="font-size:0.6rem">${b.namaPO} | ${b.jam}</p>
                    <div class="bus-price">Rp ${Number(b.harga).toLocaleString('id-ID')}</div>
                    <a href="https://wa.me/6285156677461?text=Halo Mahika, pesan tiket ${b.namaPO} rute ${b.tujuan}" class="btn-wa">BOOKING</a>
                </div>
            </div>`).join('');
    });
}
document.addEventListener('DOMContentLoaded', init);
                
