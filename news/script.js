async function getNewsDetail() {
    console.log("Memulai load berita..."); // Cek di console
    const params = new URLSearchParams(window.location.search);
    const newsId = params.get('id');

    if (!newsId) {
        console.error("ID Berita tidak ditemukan di URL!");
        window.location.href = "../index.html";
        return;
    }

    try {
        // Ambil data dari path news/ID_BERITA
        const snapshot = await db.ref('news/' + newsId).once('value');
        const n = snapshot.val();

        if (n) {
            console.log("Data Berhasil Diambil:", n.judul);
            document.title = n.judul + " - Mahika News";
            renderNews(n);
        } else {
            console.warn("Data kosong di Firebase untuk ID:", newsId);
            document.getElementById('news-content').innerHTML = `
                <div style="text-align:center; padding:50px;">
                    <i class="fas fa-exclamation-triangle" style="font-size:3rem; color:#ccc;"></i>
                    <h2 style="margin-top:15px; color:#333;">Berita tidak ditemukan!</h2>
                    <p style="color:#999;">Pastikan link yang lo klik bener, bro.</p>
                </div>`;
        }
    } catch (e) {
        console.error("Firebase Error:", e);
        document.getElementById('news-content').innerHTML = "<h2>Error Koneksi Database!</h2>";
    }
}

function renderNews(n) {
    const container = document.getElementById('news-content');
    // Hilangkan loading state dulu
    container.innerHTML = ""; 
    
    container.innerHTML = `
        <header class="news-header">
            <h1>${n.judul}</h1>
            <span class="news-meta"><i class="far fa-calendar"></i> ${n.tanggal || 'Baru Saja'}</span>
        </header>
        <img src="${n.foto || 'https://via.placeholder.com/400x200?text=No+Image'}" class="featured-image">
        <div class="news-body">
            ${n.isi}
        </div>
        <hr style="margin: 40px 0; border: 0; border-top: 1px solid #eee;">
        <p style="text-align:center; color:#999; font-size:0.8rem;">&copy; 2026 MAHIKA Trans Official</p>
    `;
}
