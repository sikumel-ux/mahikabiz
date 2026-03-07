// ==========================================
// CONFIGURASI FIREBASE
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

// Inisialisasi
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.database();

// Variabel Penampung Data yang Sudah Di-split
let masterJadwalClean = [];

// ==========================================
// AMBIL DATA & LOGIKA PEMISAH (SPLIT)
// ==========================================
function fetchAllData() {
    db.ref('jadwal').on('value', snap => {
        const val = snap.val();
        const rawData = val ? Object.values(val) : [];
        
        masterJadwalClean = []; // Reset penampung setiap ada update data

        rawData.forEach(item => {
            // Cek apakah tujuan mengandung koma
            if (item.tujuan && item.tujuan.includes(',')) {
                // PECAH RUTE BERDASARKAN KOMA
                const rutePecah = item.tujuan.split(',');
                
                rutePecah.forEach(kota => {
                    const namaKota = kota.trim();
                    if (namaKota !== "") { // Pastikan bukan string kosong
                        masterJadwalClean.push({
                            tujuan: namaKota,
                            namaPO: item.namaPO,
                            jam: item.jam,
                            harga: item.harga
                        });
                    }
                });
            } else {
                // Jika tidak ada koma, masukkan langsung
                masterJadwalClean.push(item);
            }
        });
        
        console.log("Data Berhasil Di-split:", masterJadwalClean);
    });
}

// ==========================================
// LOGIKA PENCARIAN (REAL-TIME)
// ==========================================
function handleSearch() {
    const query = document.getElementById('searchInput').value.toLowerCase().trim();
    const resultSection = document.getElementById('result-section');
    const tbody = document.getElementById('tableBody');

    // Jika kolom search kosong, sembunyikan tabel (Sesuai Request)
    if (query === "") {
        resultSection.classList.add('hidden');
        return;
    }

    // Filter dari data yang sudah bersih (Clean Data)
    const filtered = masterJadwalClean.filter(item => 
        item.tujuan.toLowerCase().includes(query) || 
        item.namaPO.toLowerCase().includes(query)
    );

    // Tampilkan Section Tabel
    resultSection.classList.remove('hidden');

    // Render ke HTML
    if (filtered.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="3" style="text-align:center; padding:40px; color:#94a3b8;">
                    <i class="fas fa-search-minus" style="font-size:1.5rem; display:block; margin-bottom:10px;"></i>
                    Rute "${query.toUpperCase()}" tidak ditemukan.
                </td>
            </tr>`;
    } else {
        tbody.innerHTML = filtered.map(item => `
            <tr>
                <td><b>${item.tujuan.toUpperCase()}</b></td>
                <td>${item.namaPO}</td>
                <td style="font-weight:700; color:#e11d48; text-align:right;">${item.jam}</td>
            </tr>
        `).join('');
    }
}

// ==========================================
// JALANKAN SAAT HALAMAN DIBUKA
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    fetchAllData();
    
    // Opsional: Kasih fokus ke input search biar user langsung ngetik
    const searchInput = document.getElementById('searchInput');
    if(searchInput) searchInput.focus();
});
  
