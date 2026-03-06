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

async function getNewsDetail() {
    const params = new URLSearchParams(window.location.search);
    const newsId = params.get('id');

    // Jika ID tidak ada di URL
    if (!newsId) {
        alert("ID Berita Hilang!");
        window.location.href = "../index.html";
        return;
    }

    const container = document.getElementById('news-content');

    try {
        // Ambil data dari Firebase
        const snapshot = await db.ref('news/' + newsId).once('value');
        const n = snapshot.val();

        if (n) {
            renderNews(n);
        } else {
            container.innerHTML = "<h2>Berita tidak ditemukan (ID salah)!</h2>";
        }
    } catch (e) {
        console.error(e);
        alert("Error: " + e.message); // Ini akan muncul di layar HP kalau error
        container.innerHTML = "<h2>Gagal memuat data. Periksa koneksi atau Firebase Rules!</h2>";
    }
}

function renderNews(n) {
    const container = document.getElementById('news-content');
    document.title = n.judul + " - Mahika News";
    
    container.innerHTML = `
        <header class="news-header" style="margin-bottom:20px;">
            <h1 style="font-size:1.6rem; color:#003B73;">${n.judul}</h1>
            <span style="font-size:0.8rem; color:#888;">
                <i class="far fa-calendar"></i> ${n.tanggal || 'Terbaru'}
            </span>
        </header>
        <img src="${n.foto}" style="width:100%; border-radius:15px; margin-bottom:20px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
        <div class="news-body" style="line-height:1.8; color:#444; font-size:1rem;">
            ${n.isi}
        </div>
        <hr style="margin: 40px 0; border: 0; border-top: 1px solid #eee;">
        <p style="text-align:center; color:#999; font-size:0.8rem;">&copy; 2026 MAHIKA Trans Official</p>
    `;
}

document.addEventListener('DOMContentLoaded', getNewsDetail);
