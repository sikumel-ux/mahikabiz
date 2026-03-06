// CONFIGURATION
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

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// TAB NAVIGATION SYSTEM
function switchTab(tabId, el) {
    document.querySelectorAll('.tab-content').forEach(content => content.classList.add('hidden'));
    document.getElementById('content-' + tabId).classList.remove('hidden');
    
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    el.classList.add('active');
    
    document.getElementById('tab-title').innerText = "Dashboard " + tabId;
}

// UPLOAD & SAVE LOGIC
const toBase64 = file => new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
});

async function handleSimpan(type) {
    let fileInp = document.getElementById(type === 'jadwal' ? 'fileBus' : (type === 'news' ? 'fileNews' : 'filePromo'));
    if (!fileInp.files[0]) return alert("Pilih foto dulu, Boss!");

    const loader = document.getElementById('loader');
    loader.style.display = 'flex';

    try {
        // 1. Upload to GDrive via GAS
        const base64 = await toBase64(fileInp.files[0]);
        const response = await fetch(GAS_URL, {
            method: "POST",
            body: JSON.stringify({
                fileData: base64,
                fileName: fileInp.files[0].name,
                mimeType: fileInp.files[0].type
            })
        });
        const photoUrl = await response.text();

        // 2. Save to Firebase
        if (type === 'jadwal') {
            await db.ref('jadwal').push({
                tujuan: document.getElementById('tujuan').value,
                namaPO: document.getElementById('po').value,
                jam: document.getElementById('jam').value,
                harga: document.getElementById('harga').value,
                foto: photoUrl
            });
        } else if (type === 'news') {
            await db.ref('news').push({
                judul: document.getElementById('judul').value,
                isi: document.getElementById('isi').value,
                foto: photoUrl,
                tanggal: new Date().toLocaleDateString('id-ID')
            });
        } else if (type === 'promo') {
            const slot = document.getElementById('slotPromo').value;
            await db.ref('promo/' + slot).set({
                judul: document.getElementById('pjudul').value,
                desk: document.getElementById('pdesk').value,
                foto: photoUrl
            });
        }

        alert("Data Berhasil Masuk!");
        location.reload();
    } catch (e) {
        alert("Waduh, Gagal: " + e.message);
    } finally {
        loader.style.display = 'none';
    }
}

// REALTIME LISTENER FOR DATA TABLES
function listenData() {
    db.ref('jadwal').on('value', s => {
        let html = '';
        s.forEach(child => {
            html += `<div class="data-row"><span>${child.val().tujuan}</span><button class="btn-delete" onclick="hapus('jadwal','${child.key}')"><i class="fas fa-trash"></i></button></div>`;
        });
        document.getElementById('list-jadwal').innerHTML = html;
    });

    db.ref('news').on('value', s => {
        let html = '';
        s.forEach(child => {
            html += `<div class="data-row"><span>${child.val().judul}</span><button class="btn-delete" onclick="hapus('news','${child.key}')"><i class="fas fa-trash"></i></button></div>`;
        });
        document.getElementById('list-news').innerHTML = html;
    });

    db.ref('promo').on('value', s => {
        let html = '';
        s.forEach(child => {
            html += `<div class="data-row"><span>${child.key.toUpperCase()} - ${child.val().judul}</span><button class="btn-delete" onclick="hapus('promo','${child.key}')"><i class="fas fa-trash"></i></button></div>`;
        });
        document.getElementById('list-promo').innerHTML = html;
    });
}

function hapus(path, id) {
    if (confirm("Hapus data ini selamanya?")) {
        db.ref(path).child(id).remove();
    }
}

document.addEventListener('DOMContentLoaded', listenData);
