// ==========================================
// CONFIGURASI & API (Pake URL yang Berhasil)
// ==========================================
const GAS_URL = "https://script.google.com/macros/s/AKfycbwT41qhmkb4qp8IyAYElixThUr7DVoloElrfXMNXzfb0L2GYRQ21QWLEDvbgjbmH2z6bw/exec";
const firebaseConfig = {
    apiKey: "AIzaSyBZNupFpsHWibTfthCtiGc8mzB2q0QaOqY",
    authDomain: "mahikabiz.firebaseapp.com",
    databaseURL: "https://mahikabiz-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "mahikabiz",
    storageBucket: "mahikabiz.firebasestorage.app",
    messagingSenderId: "795712739200",
    appId: "1:795712739200:web:5cb7b9627ffccb14f29365"
};

// Inisialisasi Firebase
if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// ==========================================
// CORE SYSTEM: TAB SWITCHER
// ==========================================
function switchTab(tab, el) {
    document.querySelectorAll('.tab-content').forEach(content => content.classList.add('hidden'));
    document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));

    const targetSection = document.getElementById(`content-${tab}`);
    if (targetSection) targetSection.classList.remove('hidden');
    el.classList.add('active');

    const titles = {
        'jadwal': 'Dashboard Jadwal',
        'news': 'Dashboard News',
        'promo': 'Dashboard Promo',
        'partner': 'Dashboard Partner'
    };
    document.getElementById('tab-title').innerText = titles[tab] || 'Dashboard Admin';
}

// ==========================================
// HELPER: CONVERT & UPLOAD (Logic Berhasil)
// ==========================================
const toBase64 = file => new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
});

async function uploadImage(fileInput) {
    const file = fileInput.files[0];
    if (!file) return null;

    const loader = document.getElementById('loader');
    if(loader) loader.style.display = 'flex';

    try {
        const base64 = await toBase64(file);
        const response = await fetch(GAS_URL, {
            method: "POST",
            body: JSON.stringify({
                fileData: base64,       // SESUAIKAN DENGAN GAS
                fileName: file.name,    // SESUAIKAN DENGAN GAS
                mimeType: file.type     // SESUAIKAN DENGAN GAS
            })
        });
        return await response.text(); // Mengambil link foto dari GAS
    } catch (e) {
        console.error("Upload Gagal:", e);
        return null;
    } finally {
        if(loader) loader.style.display = 'none';
    }
}

// ==========================================
// CRUD OPERATIONS (SAVE DATA)
// ==========================================
async function handleSimpan(type) {
    try {
        if (type === 'jadwal') {
            const photoUrl = await uploadImage(document.getElementById('fileBus'));
            if(!photoUrl) return alert("Upload foto gagal, bro!");

            await db.ref('jadwal').push({
                tujuan: document.getElementById('j-tujuan').value,
                namaPO: document.getElementById('j-po').value,
                jam: document.getElementById('j-jam').value,
                harga: document.getElementById('j-harga').value,
                foto: photoUrl
            });
            alert("Jadwal Berhasil Disimpan!");

        } else if (type === 'news') {
            const photoUrl = await uploadImage(document.getElementById('fileNews'));
            if(!photoUrl) return alert("Upload foto gagal, bro!");

            await db.ref('news').push({
                judul: document.getElementById('n-judul').value,
                isi: document.getElementById('n-isi').value,
                foto: photoUrl,
                tanggal: new Date().toLocaleDateString('id-ID')
            });
            alert("Berita Berhasil Publish!");

        } else if (type === 'promo') {
            const photoUrl = await uploadImage(document.getElementById('filePromo'));
            if(!photoUrl) return alert("Upload foto gagal, bro!");

            const slot = document.getElementById('p-slot').value;
            await db.ref('promo/' + slot).set({
                judul: document.getElementById('p-judul').value,
                desk: document.getElementById('p-desk').value,
                foto: photoUrl
            });
            alert(`Promo Slot ${slot} Berhasil di-Update!`);
        }
        
        location.reload(); // Refresh biar data terbaru muncul
    } catch (e) {
        alert("Waduh, Error: " + e.message);
    }
}

// ==========================================
// REALTIME DATA LISTENER
// ==========================================
function initLoad() {
    // Load Jadwal
    db.ref('jadwal').on('value', s => {
        const d = s.val();
        const container = document.getElementById('list-jadwal');
        if(!container) return;
        container.innerHTML = d ? Object.keys(d).map(id => `
            <div class="data-item">
                <span><b>${d[id].namaPO}</b> - ${d[id].tujuan}</span>
                <button onclick="hapusData('jadwal/${id}')"><i class="fas fa-trash"></i></button>
            </div>`).join('') : "<p class='muted'>Belum ada jadwal.</p>";
    });

    // Load News
    db.ref('news').on('value', s => {
        const d = s.val();
        const container = document.getElementById('list-news');
        if(!container) return;
        container.innerHTML = d ? Object.keys(d).map(id => `
            <div class="data-item">
                <span>${d[id].judul}</span>
                <button onclick="hapusData('news/${id}')"><i class="fas fa-trash"></i></button>
            </div>`).join('') : "<p class='muted'>Belum ada berita.</p>";
    });
}

function hapusData(path) {
    if(confirm("Hapus data ini selamanya?")) {
        db.ref(path).remove();
    }
}

document.addEventListener('DOMContentLoaded', initLoad);
