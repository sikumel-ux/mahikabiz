// CONFIG FIREBASE
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

// --- TAB SWITCHER ---
function switchTab(id, title, el) {
    document.querySelectorAll('.section-panel').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    el.classList.add('active');
    document.getElementById('current-tab-name').innerText = title;
}

// --- JADWAL ---
function saveJadwal() {
    const data = {
        namaPO: document.getElementById('j-po').value,
        tujuan: document.getElementById('j-tujuan').value,
        jam: document.getElementById('j-jam').value,
        harga: document.getElementById('j-harga').value,
        foto: document.getElementById('j-foto').value
    };
    if(data.namaPO) db.ref('jadwal').push(data).then(() => alert("Jadwal Tersimpan!"));
}

function loadJadwal() {
    db.ref('jadwal').on('value', s => {
        const d = s.val();
        const list = document.getElementById('list-jadwal');
        list.innerHTML = d ? Object.keys(d).map(id => `
            <div class="data-item">
                <div class="item-info"><b>${d[id].namaPO}</b><span>${d[id].tujuan}</span></div>
                <button class="btn-del" onclick="del('jadwal/${id}')"><i class="fas fa-trash"></i></button>
            </div>
        `).join('') : "";
    });
}

// --- PARTNER ---
function savePartner() {
    const nama = document.getElementById('p-nama').value.toUpperCase();
    if(nama) db.ref('partners').push({ nama }).then(() => {
        document.getElementById('p-nama').value = '';
        alert("Partner Ditambah!");
    });
}

function loadPartners() {
    db.ref('partners').on('value', s => {
        const d = s.val();
        const list = document.getElementById('list-partner');
        list.innerHTML = d ? Object.keys(d).map(id => `
            <div class="data-item">
                <div class="item-info"><b>${d[id].nama}</b></div>
                <button class="btn-del" onclick="del('partners/${id}')"><i class="fas fa-trash"></i></button>
            </div>
        `).join('') : "";
    });
}

// --- NEWS ---
function saveNews() {
    const data = {
        judul: document.getElementById('n-judul').value,
        isi: document.getElementById('n-isi').value,
        foto: document.getElementById('n-foto').value,
        tanggal: new Date().toLocaleDateString('id-ID')
    };
    if(data.judul) db.ref('news').push(data).then(() => alert("Berita Terbit!"));
}

function loadNews() {
    db.ref('news').on('value', s => {
        const d = s.val();
        const list = document.getElementById('list-news');
        list.innerHTML = d ? Object.keys(d).map(id => `
            <div class="data-item">
                <div class="item-info"><b>${d[id].judul}</b><span>${d[id].tanggal}</span></div>
                <button class="btn-del" onclick="del('news/${id}')"><i class="fas fa-trash"></i></button>
            </div>
        `).join('') : "";
    });
}

// --- GLOBAL DELETE ---
function del(path) { if(confirm("Hapus data ini?")) db.ref(path).remove(); }

document.addEventListener('DOMContentLoaded', () => {
    loadJadwal();
    loadPartners();
    loadNews();
});
                                            
