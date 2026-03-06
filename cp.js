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

// --- JADWAL ---
function saveJadwal() {
    const data = {
        namaPO: document.getElementById('j-po').value,
        tujuan: document.getElementById('j-tujuan').value,
        jam: document.getElementById('j-jam').value,
        harga: document.getElementById('j-harga').value,
        foto: document.getElementById('j-foto').value
    };
    db.ref('jadwal').push(data).then(() => { alert("Jadwal Ditambah!"); location.reload(); });
}

function loadJadwal() {
    db.ref('jadwal').on('value', s => {
        const d = s.val();
        const el = document.getElementById('jadwal-list');
        el.innerHTML = d ? Object.keys(d).map(id => `
            <tr>
                <td><b>${d[id].namaPO}</b><br><small>${d[id].tujuan}</small></td>
                <td>${d[id].jam}</td>
                <td>Rp ${Number(d[id].harga).toLocaleString()}</td>
                <td><button class="btn-del" onclick="del('jadwal/${id}')"><i class="fas fa-trash"></i></button></td>
            </tr>
        `).join('') : "";
    });
}

// --- PARTNER ---
function addPartner() {
    const nama = document.getElementById('p-nama').value.toUpperCase();
    if(nama) db.ref('partners').push({ nama }).then(() => document.getElementById('p-nama').value = '');
}

function loadPartners() {
    db.ref('partners').on('value', s => {
        const d = s.val();
        const el = document.getElementById('partner-list-admin');
        el.innerHTML = d ? Object.keys(d).map(id => `
            <div class="list-item" style="background:#fff; padding:15px; margin-bottom:10px; border-radius:12px; display:flex; justify-content:space-between; box-shadow:0 2px 5px rgba(0,0,0,0.05);">
                <b>${d[id].nama}</b>
                <button class="btn-del" onclick="del('partners/${id}')"><i class="fas fa-trash"></i></button>
            </div>
        `).join('') : "";
    });
}

// --- NEWS ---
function saveNews() {
    const data = {
        judul: document.getElementById('n-judul').value,
        foto: document.getElementById('n-foto').value,
        isi: document.getElementById('n-isi').value,
        tanggal: new Date().toLocaleDateString('id-ID')
    };
    db.ref('news').push(data).then(() => alert("News Published!"));
}

// --- PROMO ---
function savePromo() {
    const foto = document.getElementById('promo-foto').value;
    if(foto) db.ref('promo').push({ foto }).then(() => alert("Promo Saved!"));
}

function loadPromo() {
    db.ref('promo').on('value', s => {
        const d = s.val();
        const el = document.getElementById('promo-list-admin');
        el.innerHTML = d ? Object.keys(d).map(id => `
            <div style="position:relative;">
                <img src="${d[id].foto}" style="width:100%; border-radius:15px;">
                <button onclick="del('promo/${id}')" style="position:absolute; top:10px; right:10px; background:white; color:red; border-radius:50%; width:30px; height:30px; border:none; cursor:pointer;"><i class="fas fa-trash"></i></button>
            </div>
        `).join('') : "";
    });
}

// HELPER
function del(path) { if(confirm("Hapus data?")) db.ref(path).remove(); }

document.addEventListener('DOMContentLoaded', () => {
    loadJadwal();
    loadPartners();
    loadPromo();
});
                                              
