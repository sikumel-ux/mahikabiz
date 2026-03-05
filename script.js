// Gantilah API_URL dengan URL Deployment Google Apps Script kamu
const API_URL = "https://script.google.com/macros/s/AKfycbx9JsUb0saYvFnH8vpCn2JZu_AzdrXXXmQIcGfMW0dsTvPndFQC_CtKyLhMx_6Kjd_IEg/exec";

let db = { jadwal: [], profil: [] };

// Ambil Data dari Google Sheets
async function fetchData() {
    try {
        const response = await fetch(API_URL);
        db = await response.json();
        renderJadwal(db.jadwal);
    } catch (err) {
        document.getElementById('bus-grid').innerHTML = "<p style='grid-column:1/-1; text-align:center;'>Gagal memuat data. Periksa API Key.</p>";
    }
}

// Tampilkan List Jadwal
function renderJadwal(data) {
    const grid = document.getElementById('bus-grid');
    if (data.length === 0) {
        grid.innerHTML = "<p style='grid-column:1/-1; text-align:center;'>Jadwal tidak ditemukan.</p>";
        return;
    }
    grid.innerHTML = data.map(bus => `
        <div class="product-card">
            <span class="po-name">${bus["Nama PO"]}</span>
            <h4 class="dest-name">${bus.Tujuan}</h4>
            <div class="time-tag"><i class="far fa-clock"></i> ${bus.Jam}</div>
            <span class="price-tag">Rp ${bus.Harga}</span>
            <button class="buy-btn" onclick="showProfile('${bus["Nama PO"]}')">Profil PO</button>
        </div>
    `).join('');
}

// Pencarian Realtime
document.getElementById('search-input').addEventListener('input', (e) => {
    const s = e.target.value.toLowerCase();
    const filtered = db.jadwal.filter(b => 
        b.Tujuan.toLowerCase().includes(s) || 
        b["Nama PO"].toLowerCase().includes(s)
    );
    renderJadwal(filtered);
});

// Modal Profil
function showProfile(namaPO) {
    const po = db.profil.find(p => p["Nama PO"] === namaPO);
    const content = document.getElementById('profile-detail');
    if (!po) return;

    content.innerHTML = `
        <img src="${po.Foto}" style="width:100%; border-radius:18px; margin-bottom:15px; aspect-ratio:16/9; object-fit:cover;">
        <h2 style="color:var(--p-dark); margin-bottom:10px;">${po["Nama PO"]}</h2>
        <p style="font-size:0.9rem; color:var(--muted); margin-bottom:15px;">${po.Deskripsi}</p>
        <div style="background:var(--bg); padding:15px; border-radius:12px; font-size:0.85rem;">
            <strong>Fasilitas:</strong><br>${po.Fasilitas}
        </div>
        <a href="https://wa.me/6281234567890?text=Halo, saya ingin pesan tiket ${po["Nama PO"]}" 
           style="display:block; text-align:center; background:var(--accent); color:#000; text-decoration:none; padding:15px; border-radius:15px; margin-top:20px; font-weight:700;">
           Pesan Tiket Sekarang
        </a>
    `;
    document.getElementById('modal-profile').style.display = 'flex';
}

function closeModal() {
    document.getElementById('modal-profile').style.display = 'none';
}

// Theme Toggle
document.getElementById('theme-toggle').addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const icon = document.querySelector('#theme-toggle i');
    icon.className = document.body.classList.contains('dark-mode') ? 'fas fa-sun' : 'fas fa-moon';
});

// Jalankan Load Data
fetchData();
