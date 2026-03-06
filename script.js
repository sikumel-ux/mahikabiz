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
const database = firebase.database();
let localJadwal = [];

function initApp() {
    database.ref('promo').on('value', s => renderPromo(s.val() ? Object.values(s.val()) : []));
    database.ref('news').on('value', s => renderNews(s.val() ? Object.values(s.val()) : []));
    database.ref('jadwal').on('value', s => {
        localJadwal = s.val() ? Object.values(s.val()) : [];
        renderJadwal(localJadwal);
    });
}

function renderPromo(data) {
    const el = document.getElementById('promo-list');
    if (el) el.innerHTML = data.map(p => `
        <div class="promo-card" style="background-image: url('${p.foto}')">
            <h4>${p.judul}</h4>
            <p>${p.desk}</p>
        </div>`).join('');
}

function renderJadwal(data) {
    const el = document.getElementById('bus-list');
    const mq = document.getElementById('marquee-po');
    
    // Infinity Marquee Logic
    const pos = [...new Set(data.map(b => b.namaPO))];
    if (mq) mq.innerHTML = pos.map(p => `<span>${p}</span>`).join('').repeat(4);

    if (el) el.innerHTML = data.map(b => {
        const waMsg = encodeURIComponent(`Halo Mahika Trans, saya mau pesan tiket ${b.namaPO} tujuan ${b.tujuan} jam ${b.jam}`);
        return `
        <div class="bus-card">
            <img src="${b.foto}" onerror="this.src='https://via.placeholder.com/150'">
            <div class="bus-card-body">
                <h4>${b.tujuan}</h4>
                <p>${b.namaPO} | <i class="far fa-clock"></i> ${b.jam || '20:00'}</p>
                <div class="bus-price">Rp ${Number(b.harga).toLocaleString('id-ID')}</div>
                <a href="https://wa.me/6285156677461?text=${waMsg}" target="_blank" class="btn-wa">PESAN</a>
            </div>
        </div>`;
    }).join('');
}

function renderNews(data) {
    const el = document.getElementById('news-list');
    if (el) el.innerHTML = data.reverse().map(n => `
        <div class="news-item" onclick="openNews('${n.judul}', '${n.isi.replace(/'/g, "\\'")}', '${n.foto}')">
            <img src="${n.foto}" class="news-img">
            <div class="news-info">
                <h4>${n.judul}</h4>
                <p>${n.isi.substring(0, 80)}...</p>
                <small>${n.tanggal}</small>
            </div>
        </div>`).join('');
}

function openNews(j, i, f) {
    document.getElementById('modal-judul').innerText = j;
    document.getElementById('modal-desk').innerText = i;
    document.getElementById('modal-img').src = f;
    document.getElementById('news-modal').style.display = 'block';
}

function closeNews() { document.getElementById('news-modal').style.display = 'none'; }

document.getElementById('search-input')?.addEventListener('input', e => {
    const key = e.target.value.toLowerCase();
    renderJadwal(localJadwal.filter(b => b.tujuan.toLowerCase().includes(key) || b.namaPO.toLowerCase().includes(key)));
});

document.addEventListener('DOMContentLoaded', initApp);
    
