// CONFIG FIREBASE (Gunakan Config Milikmu)
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

// --- 1. LOGIC PARTNER PO ---
function addPartner() {
    const nama = document.getElementById('p-nama').value.toUpperCase();
    if(!nama) return alert("Isi nama PO!");
    db.ref('partners').push({ nama: nama }).then(() => {
        document.getElementById('p-nama').value = '';
    });
}

function loadPartners() {
    db.ref('partners').on('value', s => {
        const d = s.val();
        const list = document.getElementById('partner-list');
        list.innerHTML = d ? Object.keys(d).map(id => `
            <div class="list-item">
                <span>${d[id].nama}</span>
                <button class="btn-delete" onclick="deleteItem('partners/${id}')">Hapus</button>
            </div>
        `).join('') : "Belum ada partner.";
    });
}

// --- 2. LOGIC JADWAL BUS ---
function saveJadwal() {
    const data = {
        namaPO: document.getElementById('j-po').value,
        tujuan: document.getElementById('j-tujuan').value,
        jam: document.getElementById('j-jam').value,
        harga: document.getElementById('j-harga').value,
        foto: document.getElementById('j-foto').value
    };
    if(!data.namaPO || !data.tujuan) return alert("Lengkapi data jadwal!");
    db.ref('jadwal').push(data).then(() => {
        alert("Jadwal Berhasil Disimpan!");
        clearJadwal();
    });
}

function loadJadwal() {
    db.ref('jadwal').on('value', s => {
        const d = s.val();
        const list = document.getElementById('jadwal-list');
        list.innerHTML = d ? Object.keys(d).map(id => `
            <div class="list-item">
                <span style="font-size:0.8rem">${d[id].namaPO} - ${d[id].tujuan}</span>
                <button class="btn-delete" onclick="deleteItem('jadwal/${id}')">Hapus</button>
            </div>
        `).join('') : "";
    });
}

// --- 3. LOGIC NEWS ---
function saveNews() {
    const data = {
        judul: document.getElementById('n-judul').value,
        foto: document.getElementById('n-foto').value,
        isi: document.getElementById('n-isi').value,
        tanggal: new Date().toLocaleDateString('id-ID')
    };
    if(!data.judul || !data.isi) return alert("Lengkapi berita!");
    db.ref('news').push(data).then(() => {
        alert("Berita Berhasil Publish!");
        clearNews();
    });
}

function loadNews() {
    db.ref('news').on('value', s => {
        const d = s.val();
        const list = document.getElementById('news-list');
        list.innerHTML = d ? Object.keys(d).map(id => `
            <div class="list-item">
                <span style="font-size:0.8rem">${d[id].judul}</span>
                <button class="btn-delete" onclick="deleteItem('news/${id}')">Hapus</button>
            </div>
        `).join('') : "";
    });
}

// --- HELPER FUNCTIONS ---
function deleteItem(path) {
    if(confirm("Yakin mau hapus data ini?")) db.ref(path).remove();
}

function clearJadwal() {
    document.getElementById('j-po').value = '';
    document.getElementById('j-tujuan').value = '';
    document.getElementById('j-harga').value = '';
    document.getElementById('j-foto').value = '';
}

function clearNews() {
    document.getElementById('n-judul').value = '';
    document.getElementById('n-foto').value = '';
    document.getElementById('n-isi').value = '';
}

// Jalankan semua load saat halaman dibuka
document.addEventListener('DOMContentLoaded', () => {
    loadPartners();
    loadJadwal();
    loadNews();
});
          
