// Konfigurasi Firebase lo bro
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

let semuaJadwal = []; // Simpan data di sini biar gak bolak-balik narik Firebase

// 1. Ambil Data Pertama Kali
function loadData() {
    db.ref('jadwal').on('value', snapshot => {
        const data = snapshot.val();
        semuaJadwal = []; // Reset penampung
        
        if (data) {
            Object.keys(data).forEach(id => {
                semuaJadwal.push(data[id]);
            });
            renderTable(semuaJadwal); // Tampilkan semua dulu
        } else {
            document.getElementById('tableBody').innerHTML = '<tr><td colspan="3" class="no-data">Belum ada jadwal tersedia.</td></tr>';
        }
    });
}

// 2. Fungsi Filter (Misahin Jambi dkk)
function filterJadwal() {
    const keyword = document.getElementById('searchInput').value.toLowerCase().trim();
    
    // Filter array berdasarkan rute (tujuan)
    const hasilFilter = semuaJadwal.filter(item => {
        return item.tujuan.toLowerCase().includes(keyword);
    });

    renderTable(hasilFilter);
}

// 3. Render ke Tabel HTML
function renderTable(list) {
    const tbody = document.getElementById('tableBody');
    
    if (list.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3" class="no-data">Rute tidak ditemukan.</td></tr>';
        return;
    }

    tbody.innerHTML = list.map(item => `
        <tr>
            <td><b>${item.tujuan}</b></td>
            <td>${item.namaPO}</td>
            <td><i class="far fa-clock"></i> ${item.jam}</td>
        </tr>
    `).join('');
}

// Jalankan saat halaman dibuka
document.addEventListener('DOMContentLoaded', loadData);
