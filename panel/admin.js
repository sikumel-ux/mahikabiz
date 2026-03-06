// ==========================================
// CONFIGURASI & API
// ==========================================
const firebaseConfig = {
    apiKey: "AIzaSyBZNupFpsHWibTfthCtiGc8mzB2q0QaOqY",
    authDomain: "mahikabiz.firebaseapp.com",
    databaseURL: "https://mahikabiz-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "mahikabiz",
    storageBucket: "mahikabiz.firebasestorage.app",
    messagingSenderId: "795712739200",
    appId: "1:795712739200:web:5cb7b9627ffccb14f29365"
};

// URL API Google Apps Script Milikmu
const GDriveAPI = "https://script.google.com/macros/s/AKfycbx9JsUb0saYvFnH8vpCn2JZu_AzdrXXXmQIcGfMW0dsTvPndFQC_CtKyLhMx_6Kjd_IEg/exec";

// Inisialisasi Firebase
if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// ==========================================
// CORE SYSTEM: TAB SWITCHER
// ==========================================
function switchTab(tab, el) {
    // Sembunyikan semua section
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.add('hidden');
    });
    
    // Hapus status active dari semua nav-item
    document.querySelectorAll('.nav-item').forEach(nav => {
        nav.classList.remove('active');
    });

    // Tampilkan section yang dipilih
    const targetSection = document.getElementById(`content-${tab}`);
    if (targetSection) {
        targetSection.classList.remove('hidden');
    }

    // Aktifkan nav-item yang diklik
    el.classList.add('active');

    // Update Judul Header
    const titles = {
        'jadwal': 'Dashboard Jadwal',
        'news': 'Dashboard News',
        'promo': 'Dashboard Promo',
        'partner': 'Dashboard Partner'
    };
    document.getElementById('tab-title').innerText = titles[tab] || 'Dashboard Admin';
}

// ==========================================
// HELPER: GDRIVE UPLOAD
// ==========================================
async function uploadToGDrive(fileInput) {
    const file = fileInput.files[0];
    if (!file) return null; // Jika tidak ada file, return null

    // Tampilkan Loader
    document.getElementById('loader').classList.remove('hidden');

    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = async () => {
            const base64 = reader.result.split(',')[1];
            try {
                const response = await fetch(GDriveAPI, {
                    method: 'POST',
                    body: JSON.stringify({
                        file: base64,
                        type: file.type,
                        name: file.name
                    })
                });
                const res = await response.json();
                document.getElementById('loader').classList.add('hidden');
                
                if (res.url) {
                    resolve(res.url);
                } else {
                    alert("Gagal mendapatkan URL dari GDrive!");
                    resolve(null);
                }
            } catch (err) {
                document.getElementById('loader').classList.add('hidden');
                alert("Koneksi ke API GDrive Gagal!");
                reject(err);
            }
        };
    });
}

// ==========================================
// CRUD OPERATIONS (SAVE DATA)
// ==========================================
async function handleSimpan(type) {
    if (type === 'jadwal') {
        const imgUrl = await uploadToGDrive(document.getElementById('fileBus'));
        const data = {
            tujuan: document.getElementById('j-tujuan').value,
            namaPO: document.getElementById('j-po').value,
            jam: document.getElementById('j-jam').value,
            harga: document.getElementById('j-harga').value,
            foto: imgUrl || "" // Tetap simpan meski kosong jika tidak upload
        };
        db.ref('jadwal').push(data).then(() => {
            alert("Jadwal Berhasil Disimpan!");
            resetInputs(['j-tujuan', 'j-po', 'j-jam', 'j-harga', 'fileBus']);
        });

    } else if (type === 'news') {
        const imgUrl = await uploadToGDrive(document.getElementById('fileNews'));
        const data = {
            judul: document.getElementById('n-judul').value,
            isi: document.getElementById('n-isi').value,
            foto: imgUrl || "",
            tgl: new Date().toLocaleDateString('id-ID')
        };
        db.ref('news').push(data).then(() => {
            alert("Berita Berhasil Publish!");
            resetInputs(['n-judul', 'n-isi', 'fileNews']);
        });

    } else if (type === 'promo') {
        const imgUrl = await uploadToGDrive(document.getElementById('filePromo'));
        const slot = document.getElementById('p-slot').value;
        const data = {
            judul: document.getElementById('p-judul').value,
            desk: document.getElementById('p-desk').value,
            foto: imgUrl || ""
        };
        db.ref('promo/' + slot).set(data).then(() => {
            alert(`Promo Slot ${slot} Berhasil Diupdate!`);
            resetInputs(['p-judul', 'p-desk', 'filePromo']);
        });

    } else if (type === 'partner') {
        const namaInput = document.getElementById('ptr-nama');
        const nama = namaInput.value.trim().toUpperCase();
        if(!nama) return alert("Isi nama PO-nya, bro!");
        
        db.ref('partners').push({ nama: nama }).then(() => {
            namaInput.value = '';
            alert("Partner Berhasil Ditambah ke Marquee!");
        });
    }
}

// ==========================================
// REALTIME DATA LISTENER (READ & DELETE)
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

    // Load Partner
    db.ref('partners').on('value', s => {
        const d = s.val();
        const container = document.getElementById('list-partner');
        if(!container) return;
        container.innerHTML = d ? Object.keys(d).map(id => `
            <div class="data-item">
                <span><b>${d[id].nama}</b></span>
                <button onclick="hapusData('partners/${id}')"><i class="fas fa-trash"></i></button>
            </div>`).join('') : "<p class='muted'>Belum ada partner marquee.</p>";
    });
}

// Helper Delete
function hapusData(path) {
    if(confirm("Yakin mau hapus data ini?")) {
        db.ref(path).remove();
    }
}

// Helper Reset Form
function resetInputs(ids) {
    ids.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });
}

// Jalankan Load saat siap
document.addEventListener('DOMContentLoaded', initLoad);
            
