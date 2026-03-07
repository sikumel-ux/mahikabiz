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

let masterJadwal = [];

// Tarik data diam-diam di background
function fetchAllData() {
    db.ref('jadwal').on('value', snap => {
        const val = snap.val();
        masterJadwal = val ? Object.values(val) : [];
    });
}

function handleSearch() {
    const query = document.getElementById('searchInput').value.toLowerCase().trim();
    const resultSection = document.getElementById('result-section');
    const tbody = document.getElementById('tableBody');

    // Jika input kosong, sembunyikan tabel
    if (query === "") {
        resultSection.classList.add('hidden');
        return;
    }

    // Filter data
    const filtered = masterJadwal.filter(item => 
        item.tujuan.toLowerCase().includes(query) || 
        item.namaPO.toLowerCase().includes(query)
    );

    // Tampilkan Tabel
    resultSection.classList.remove('hidden');

    if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3" style="text-align:center; padding:30px; color:#94a3b8;">Rute tidak ditemukan.</td></tr>';
    } else {
        tbody.innerHTML = filtered.map(item => `
            <tr>
                <td><b>${item.tujuan}</b></td>
                <td>${item.namaPO}</td>
                <td style="font-weight:700; color:#e11d48;">${item.jam}</td>
            </tr>
        `).join('');
    }
}

document.addEventListener('DOMContentLoaded', fetchAllData);
