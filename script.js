const API_URL = "https://script.google.com/macros/s/AKfycbxb86eZnUZvSYWRkX2uSxohRzien9x1zHyu1XZGkKCV8tekejSG8DygZTdI3bEkDThF0Q/exec";
";
let db = { jadwal: [], profil: [] };

function updateHeader() {
    const now = new Date();
    document.getElementById('header-date').innerText = now.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
    document.getElementById('header-time').innerText = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
}

async function fetchWeather() {
    try {
        const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=-6.20&longitude=106.84&current_weather=true`);
        const data = await res.json();
        document.getElementById('header-weather').innerHTML = `<i class="fas fa-sun"></i> ${Math.round(data.current_weather.temperature)}°C`;
    } catch (e) {}
}

async function loadData() {
    try {
        const res = await fetch(API_URL);
        db = await res.json();
        render(db.jadwal);
    } catch (e) { console.log("Gagal muat data"); }
}

function render(data) {
    const grid = document.getElementById('bus-grid');
    if(data.length === 0) {
        grid.innerHTML = `<p style="grid-column:1/-1; text-align:center; padding:20px;">Rute tidak ditemukan</p>`;
        return;
    }
    grid.innerHTML = data.map(bus => `
        <div class="bus-card">
            <h4>${bus.Tujuan}</h4>
            <span class="info">${bus["Nama PO"]}<br>${bus.Jam}</span>
            <span class="price">Rp ${bus.Harga}</span>
            <button class="btn-book" onclick="showProfile('${bus["Nama PO"]}')">PESAN</button>
        </div>
    `).join('');
}

document.getElementById('search-input').addEventListener('input', (e) => {
    const val = e.target.value.toLowerCase();
    const home = document.getElementById('home-view');
    const title = document.getElementById('section-title');
    
    if(val.length > 0) {
        home.style.display = "none";
        title.innerText = "Hasil Pencarian";
        const filtered = db.jadwal.filter(b => b.Tujuan.toLowerCase().includes(val) || b["Nama PO"].toLowerCase().includes(val));
        render(filtered);
    } else {
        home.style.display = "block";
        title.innerText = "Rute Populer";
        render(db.jadwal);
    }
});

function showProfile(namaPO) {
    const po = db.profil.find(p => p["Nama PO"] === namaPO);
    const content = document.getElementById('profile-detail');
    if (!po) return;
    content.innerHTML = `
        <img src="${po.Foto}" style="width:100%; border-radius:15px; margin-bottom:10px;">
        <h3 style="color:var(--p-dark)">${po["Nama PO"]}</h3>
        <p style="font-size:0.8rem; margin:10px 0;">${po.Deskripsi}</p>
        <a href="https://wa.me/6281234567890?text=Halo Mahika, saya mau tanya tiket ${po["Nama PO"]}" 
           style="display:block; text-align:center; background:var(--p-dark); color:white; padding:12px; border-radius:12px; text-decoration:none; font-weight:700;">
           Hubungi via WhatsApp
        </a>
    `;
    document.getElementById('modal-profile').style.display = 'flex';
}

function closeModal() { document.getElementById('modal-profile').style.display = 'none'; }

setInterval(updateHeader, 1000);
updateHeader(); fetchWeather(); loadData();
