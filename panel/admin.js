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

// URL API GOOGLE APPS SCRIPT
const GDriveAPI = "https://script.google.com/macros/s/AKfycbx9JsUb0saYvFnH8vpCn2JZu_AzdrXXXmQIcGfMW0dsTvPndFQC_CtKyLhMx_6Kjd_IEg/exec";

if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// --- TAB SYSTEM ---
function switchTab(tab, el) {
    document.querySelectorAll('.tab-content').forEach(c => c.classList.add('hidden'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.getElementById(`content-${tab}`).classList.remove('hidden');
    el.classList.add('active');
    document.getElementById('tab-title').innerText = "Dashboard " + tab.charAt(0).toUpperCase() + tab.slice(1);
}

// --- GDRIVE UPLOAD FUNCTION ---
async function uploadFile(fileInput) {
    const file = fileInput.files[0];
    if (!file) return null;

    document.getElementById('loader').classList.remove('hidden');
    
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = async () => {
            const base64 = reader.result.split(',')[1];
            try {
                const response = await fetch(GDriveAPI, {
                    method: 'POST',
                    body: JSON.stringify({ file: base64, type: file.type, name: file.name })
                });
                const res = await response.json();
                document.getElementById('loader').classList.add('hidden');
                resolve(res.url);
            } catch (err) {
                document.getElementById('loader').classList.add('hidden');
                alert("Gagal upload ke GDrive!");
                reject(err);
            }
        };
    });
}

// --- HANDLE SIMPAN ---
async function handleSimpan(type) {
    if (type === 'jadwal') {
        const imgUrl = await uploadFile(document.getElementById('fileBus'));
        const data = {
            tujuan: document.getElementById('j-tujuan').value,
            namaPO: document.getElementById('j-po').value,
            jam: document.getElementById('j-jam').value,
            harga: document.getElementById('j-harga').value,
            foto: imgUrl
        };
        db.ref('jadwal').push(data).then(() => alert("Jadwal Berhasil Disimpan!"));

    } else if (type === 'news') {
        const imgUrl = await uploadFile(document.getElementById('fileNews'));
        const data = {
            judul: document.getElementById('n-judul').value,
            isi: document.getElementById('n-isi').value,
            foto: imgUrl,
            tgl: new Date().toLocaleDateString()
        };
        db.ref('news').push(data).then(() => alert("Berita Terbit!"));

    } else if (type === 'promo') {
        const imgUrl = await uploadFile(document.getElementById('filePromo'));
        const slot = document.getElementById('p-slot').value;
        const data = {
            judul: document.getElementById('p-judul').value,
            desk: document.getElementById('p-desk').value,
            foto: imgUrl
        };
        db.ref('promo/' + slot).set(data).then(() => alert("Promo Updated!"));

    } else if (type === 'partner') {
        const nama = document.getElementById('ptr-nama').value.toUpperCase();
        if(nama) db.ref('partners').push({ nama }).then(() => {
            document.getElementById('ptr-nama').value = '';
            alert("Partner Ditambah!");
        });
    }
}

// --- LOAD DATA ---
function loadData() {
    // Load Jadwal
    db.ref('jadwal').on('value', s => {
        const d = s.val();
        document.getElementById('list-jadwal').innerHTML = d ? Object.keys(d).map(id => `
            <div class="data-item">
                <span><b>${d[id].namaPO}</b> - ${d[id].tujuan}</span>
                <button onclick="hapus('jadwal/${id}')"><i class="fas fa-trash"></i></button>
            </div>`).join('') : "";
    });

    // Load News
    db.ref('news').on('value', s => {
        const d = s.val();
        document.getElementById('list-news').innerHTML = d ? Object.keys(d).map(id => `
            <div class="data-item">
                <span>${d[id].judul}</span>
                <button onclick="hapus('news/${id}')"><i class="fas fa-trash"></i></button>
            </div>`).join('') : "";
    });

    // Load Partner
    db.ref('partners').on('value', s => {
        const d = s.val();
        document.getElementById('list-partner').innerHTML = d ? Object.keys(d).map(id => `
            <div class="data-item">
                <span><b>${d[id].nama}</b></span>
                <button onclick="hapus('partners/${id}')"><i class="fas fa-trash"></i></button>
            </div>`).join('') : "";
    });
}

function hapus(path) { if(confirm("Hapus data?")) db.ref(path).remove(); }

document.addEventListener('DOMContentLoaded', loadData);
  
