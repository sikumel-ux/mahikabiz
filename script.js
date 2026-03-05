// URL API dari Google Apps Script kamu
const API_URL = "https://script.google.com/macros/s/AKfycbxb86eZnUZvSYWRkX2uSxohRzien9x1zHyu1XZGkKCV8tekejSG8DygZTdI3bEkDThF0Q/exec";

// Database lokal untuk menyimpan data setelah fetch
let db = { jadwal: [], profil: [] };

/**
 * 1. FUNGSI JAM & CUACA (HEADER)
 */
function updateHeader() {
    const now = new Date();
    const options = { day: 'numeric', month: 'short' };
    document.getElementById('header-date').innerText = now.toLocaleDateString('id-ID', options);
    document.getElementById('header-time').innerText = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
}

async function fetchWeather() {
    try {
        // Mengambil data cuaca Jakarta (bisa disesuaikan koordinatnya)
        const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=-6.20&longitude=106.84&current_weather=true`);
        const data = await res.json();
        const temp = Math.round(data.current_weather.temperature);
        document.getElementById('header-weather').innerHTML = `<i class="fas fa-sun"></i> ${temp}°C`;
    } catch (e) {
        console.log("Weather error ignored");
    }
}

/**
 * 2. FUNGSI AMBIL DATA DARI GOOGLE SHEETS
 */
async function loadData() {
    try {
        const res = await fetch(API_URL);
        const result = await res.json();
        
        db = result;
        console.log("Data Loaded:", db);

        // Tampilkan semua rute saat pertama kali load
        render(db.jadwal);
    } catch (e) {
        console.error("Fetch Error:", e);
        const grid = document.getElementById('bus-grid');
        grid.innerHTML = `<p style="grid-column:1/-1; text-align:center; padding:20px;">Gagal terhubung ke server.</p>`;
    }
}

/**
 * 3. FUNGSI TAMPILKAN DATA KE GRID (3 KOLOM)
 */
function render(data) {
    const grid = document.getElementById('bus-grid');
    
    if (!data || data.length === 0) {
        grid.innerHTML = `<p style="grid-column:1/-1; text-align:center; padding:40px; color:#718096;">Rute tidak tersedia.</p>`;
        return;
    }

    grid.innerHTML = data.map(bus => {
        // Membersihkan format Jam jika dari Google Sheets terbaca sebagai ISO Date
        let jamTampil = bus["Jam"];
        if (jamTampil && jamTampil.toString().includes("T")) {
            jamTampil = jamTampil.split("T")[1].substring(0, 5);
        }

        // Memformat Harga ke Rupiah (Titik ribuan)
        const hargaFormatted = Number(bus["Harga"]).toLocaleString('id-ID');

        return `
            <div class="bus-card">
                <h4>${bus["Tujuan"]}</h4>
                <span class="info">
                    <strong>${bus["Nama PO"]}</strong><br>
                    <i class="far fa-clock"></i> ${jamTampil || '--:--'}
                </span>
                <span class="price">Rp ${hargaFormatted}</span>
                <button class="btn-book" onclick="showProfile('${bus["Nama PO"]}')">PESAN</button>
            </div>
        `;
    }).join('');
}

/**
 * 4. LOGIKA PENCARIAN
 */
document.getElementById('search-input').addEventListener('input', (e) => {
    const val = e.target.value.toLowerCase();
    const homeView = document.getElementById('home-view');
    const sectionTitle = document.getElementById('section-title');

    if (val.length > 0) {
        // Sembunyikan Slider & Menu saat mencari
        if(homeView) homeView.style.display = "none";
        sectionTitle.innerText = "Hasil Pencarian";

        const filtered = db.jadwal.filter(bus => 
            bus["Tujuan"].toLowerCase().includes(val) || 
            bus["Nama PO"].toLowerCase().includes(val)
        );
        render(filtered);
    } else {
        // Tampilkan kembali Slider & Menu jika search kosong
        if(homeView) homeView.style.display = "block";
        sectionTitle.innerText = "Rute Populer";
        render(db.jadwal);
    }
});

/**
 * 5. MODAL PROFIL PO
 */
function showProfile(namaPO) {
    const po = db.profil.find(p => p["Nama PO"] === namaPO);
    const content = document.getElementById('profile-detail');
    
    if (!po) {
        // Jika profil PO belum diisi di Sheet ProfilPO, arahkan langsung ke WA
        window.location.href = `https://wa.me/6281234567890?text=Halo Mahika, saya mau pesan tiket ${namaPO}`;
        return;
    }

    content.innerHTML = `
        <img src="${po["Foto"]}" style="width:100%; border-radius:15px; margin-bottom:15px; aspect-ratio:16/9; object-fit:cover;">
        <h3 style="color:#003B73; font-weight:800;">${po["Nama PO"]}</h3>
        <p style="font-size:0.85rem; color:#4A5568; line-height:1.6; margin:10px 0;">${po["Deskripsi"]}</p>
        <div style="background:#F7FAFC; padding:12px; border-radius:12px; font-size:0.8rem; border-left:4px solid #FFC107;">
            <strong>Fasilitas:</strong><br>${po["Fasilitas"]}
        </div>
        <a href="https://wa.me/6281234567890?text=Halo Mahika, saya mau pesan tiket ${po["Nama PO"]}" 
           style="display:block; text-align:center; background:#003B73; color:white; padding:15px; border-radius:15px; text-decoration:none; font-weight:700; margin-top:20px;">
           Pesan via WhatsApp
        </a>
    `;
    document.getElementById('modal-profile').style.display = 'flex';
}

function closeModal() {
    document.getElementById('modal-profile').style.display = 'none';
}

/**
 * 6. INISIALISASI
 */
setInterval(updateHeader, 1000);
updateHeader();
fetchWeather();
loadData();
        
