const API_URL = "https://script.google.com/macros/s/AKfycbx9JsUb0saYvFnH8vpCn2JZu_AzdrXXXmQIcGfMW0dsTvPndFQC_CtKyLhMx_6Kjd_IEg/exec";

let db = { jadwal: [], profil: [] };

// 1. Clock & Date
function updateClock() {
    const now = new Date();
    const options = { weekday: 'long', day: 'numeric', month: 'long' };
    document.getElementById('header-date').innerText = now.toLocaleDateString('id-ID', options);
    document.getElementById('header-time').innerText = now.toLocaleTimeString('id-ID', { hour12: false });
}

// 2. Weather (Free API)
async function fetchWeather() {
    try {
        const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=-6.2088&longitude=106.8456&current_weather=true`);
        const data = await res.json();
        document.getElementById('header-weather').innerHTML = `<i class="fas fa-cloud-sun"></i> ${Math.round(data.current_weather.temperature)}°C`;
    } catch (e) { document.getElementById('header-weather').style.display = 'none'; }
}

// 3. Fetch Data From Sheets
async function fetchData() {
    try {
        const response = await fetch(API_URL);
        db = await response.json();
        console.log("Data loaded");
    } catch (err) { console.error("API Error:", err); }
}

// 4. Render Engine
function render(data, isSearching) {
    const grid = document.getElementById('bus-grid');
    const welcome = document.getElementById('welcome-msg');

    if (!isSearching || data.length === 0) {
        grid.innerHTML = "";
        welcome.style.display = "block";
        if(isSearching && data.length === 0) {
            welcome.innerHTML = `<i class="fas fa-search-minus" style="font-size:3rem; opacity:0.2;"></i><h2>Tidak Ditemukan</h2><p>Jadwal untuk rute ini belum tersedia.</p>`;
        } else {
            welcome.innerHTML = `<div class="welcome-icon"><i class="fas fa-bus-alt"></i></div><h2>Cari Jadwal Bus</h2><p>Masukkan kota tujuan di atas untuk melihat jadwal keberangkatan.</p>`;
        }
        return;
    }

    welcome.style.display = "none";
    grid.innerHTML = data.map(bus => `
        <div class="product-card">
            <span class="po-name">${bus["Nama PO"]}</span>
            <h4 class="dest-name">${bus.Tujuan}</h4>
            <div class="time-tag"><i class="far fa-clock"></i> ${bus.Jam}</div>
            <span class="price-tag">Rp ${bus.Harga}</span>
            <button class="buy-btn" onclick="showProfile('${bus["Nama PO"]}')">Lihat Profil</button>
        </div>
    `).join('');
}

// 5. Search Trigger
document.getElementById('search-input').addEventListener('input', (e) => {
    const val = e.target.value.toLowerCase();
    if (val.length > 0) {
        const filtered = db.jadwal.filter(b => 
            b.Tujuan.toLowerCase().includes(val) || 
            b["Nama PO"].toLowerCase().includes(val)
        );
        render(filtered, true);
    } else {
        render([], false);
    }
});

// 6. Modal Profile
function showProfile(namaPO) {
    const po = db.profil.find(p => p["Nama PO"] === namaPO);
    const content = document.getElementById('profile-detail');
    if (!po) return;

    content.innerHTML = `
        <img src="${po.Foto}" style="width:100%; border-radius:20px; margin-bottom:15px; aspect-ratio:16/9; object-fit:cover;">
        <h2 style="color:var(--p-dark); font-weight:800;">${po["Nama PO"]}</h2>
        <p style="margin:10px 0; color:var(--muted); font-size:0.85rem; line-height:1.6;">${po.Deskripsi}</p>
        <div style="background:var(--bg); padding:15px; border-radius:15px; font-size:0.8rem;">
            <strong>Fasilitas:</strong><br>${po.Fasilitas}
        </div>
        <a href="https://wa.me/6281234567890?text=Halo, info tiket ${po["Nama PO"]} rute ${document.getElementById('search-input').value}" 
           style="display:block; text-align:center; background:var(--p-dark); color:white; text-decoration:none; padding:15px; border-radius:16px; margin-top:20px; font-weight:700;">
           Hubungi Agen
        </a>
    `;
    document.getElementById('modal-profile').style.display = 'flex';
}

function closeModal() { document.getElementById('modal-profile').style.display = 'none'; }

// 7. Initial Run
setInterval(updateClock, 1000);
updateClock();
fetchWeather();
fetchData();

// Theme Toggle
document.getElementById('theme-toggle').addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    document.querySelector('#theme-toggle i').className = document.body.classList.contains('dark-mode') ? 'fas fa-sun' : 'fas fa-moon';
});
        
