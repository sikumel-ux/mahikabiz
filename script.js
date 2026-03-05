const API_URL = "https://script.google.com/macros/s/AKfycbzG_wasu9w6MSGUEJqQd4xFWdLgsaRpPlJ3IiZN99M016HzjhtBKbVYoq-r-yICvDPk8w/exec";

let db = { jadwal: [], profil: [] };

// 1. Clock & Date Realtime
function updateClock() {
    const now = new Date();
    const options = { weekday: 'long', day: 'numeric', month: 'long' };
    document.getElementById('header-date').innerText = now.toLocaleDateString('id-ID', options);
    document.getElementById('header-time').innerText = now.toLocaleTimeString('id-ID', { hour12: false });
}

// 2. Weather Info (Jakarta Area)
async function fetchWeather() {
    try {
        const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=-6.2088&longitude=106.8456&current_weather=true`);
        const data = await res.json();
        document.getElementById('header-weather').innerHTML = `<i class="fas fa-cloud-sun"></i> ${Math.round(data.current_weather.temperature)}°C`;
    } catch (e) { console.log("Weather offline"); }
}

// 3. Fetch Data from Sheet
async function fetchData() {
    try {
        const response = await fetch(API_URL);
        db = await response.json();
        console.log("Data Mahika Loaded");
    } catch (err) { console.error("Database error"); }
}

// 4. Render Logic (Search to Show)
function render(data, isSearching) {
    const grid = document.getElementById('bus-grid');
    const welcome = document.getElementById('welcome-msg');

    if (!isSearching || data.length === 0) {
        grid.innerHTML = "";
        welcome.style.display = "block";
        if(isSearching && data.length === 0) {
            welcome.innerHTML = `<i class="fas fa-search-minus" style="font-size:3rem; opacity:0.1;"></i><h2>Tidak Ditemukan</h2><p>Maaf, jadwal rute tersebut belum tersedia.</p>`;
        } else {
            welcome.innerHTML = `<div class="welcome-icon"><i class="fas fa-bus-alt"></i></div><h2>Cari Jadwal Bus</h2><p>Masukkan kota tujuan untuk melihat jadwal keberangkatan bus terbaru.</p>`;
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

// 5. Search Interaction
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

// 6. Modal Profile Detail
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
        <a href="https://wa.me/6281234567890?text=Halo, saya ingin pesan tiket ${po["Nama PO"]} tujuan ${document.getElementById('search-input').value}" 
           style="display:block; text-align:center; background:var(--p-dark); color:white; text-decoration:none; padding:15px; border-radius:16px; margin-top:20px; font-weight:700;">
           Pesan Tiket via WA
        </a>
    `;
    document.getElementById('modal-profile').style.display = 'flex';
}

function closeModal() { document.getElementById('modal-profile').style.display = 'none'; }

// 7. Initialization
setInterval(updateClock, 1000);
updateClock();
fetchWeather();
fetchData();

// Theme Toggle Logic
document.getElementById('theme-toggle').addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    document.querySelector('#theme-toggle i').className = document.body.classList.contains('dark-mode') ? 'fas fa-sun' : 'fas fa-moon';
});
    
