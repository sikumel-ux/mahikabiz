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

async function getNewsDetail() {
    // Ambil ID dari URL (?id=-NXxxxx)
    const params = new URLSearchParams(window.location.search);
    const newsId = params.get('id');

    if (!newsId) {
        window.location.href = "../index.html";
        return;
    }

    try {
        const snapshot = await db.ref('news/' + newsId).once('value');
        const n = snapshot.val();

        if (n) {
            document.title = n.judul + " - Mahika News";
            renderNews(n);
        } else {
            document.getElementById('news-content').innerHTML = "<h2>Berita tidak ditemukan!</h2>";
        }
    } catch (e) {
        console.error(e);
    }
}

function renderNews(n) {
    const container = document.getElementById('news-content');
    container.innerHTML = `
        <header class="news-header">
            <h1>${n.judul}</h1>
            <span class="news-meta"><i class="far fa-calendar"></i> Diposting pada: ${n.tanggal}</span>
        </header>
        <img src="${n.foto}" class="featured-image">
        <div class="news-body">
            ${n.isi}
        </div>
        <hr style="margin: 40px 0; border: 0; border-top: 1px solid #eee;">
        <p style="text-align:center; color:#999; font-size:0.8rem;">&copy; 2026 MAHIKA Trans Official</p>
    `;
}

document.addEventListener('DOMContentLoaded', getNewsDetail);
