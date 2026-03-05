const API_URL = "https://script.google.com/macros/s/AKfycbx9JsUb0saYvFnH8vpCn2JZu_AzdrXXXmQIcGfMW0dsTvPndFQC_CtKyLhMx_6Kjd_IEg/exec";
let db = { jadwal: [] };

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
    const res = await fetch(API_URL);
    db = await res.json();
    render(db.jadwal); // Load awal tampilkan semua rute populer
}

function render(data) {
    const grid = document.getElementById('bus-grid');
    grid.innerHTML = data.slice(0, 6).map(bus => `
        <div class="bus-card">
            <img src="https://cdn-icons-png.flaticon.com/512/3448/3448339.png" alt="bus">
            <h4>${bus.Tujuan}</h4>
            <span class="meta">${bus["Nama PO"]} • ${bus.Jam}</span>
            <span class="price">Rp ${bus.Harga}</span>
            <button class="msg-btn" onclick="order('${bus["Nama PO"]}', '${bus.Tujuan}')">PESAN</button>
        </div>
    `).join('');
}

document.getElementById('search-input').addEventListener('input', (e) => {
    const val = e.target.value.toLowerCase();
    const filtered = db.jadwal.filter(b => b.Tujuan.toLowerCase().includes(val));
    render(filtered);
});

function order(po, tujuan) {
    window.location.href = `https://wa.me/6281234567890?text=Halo Mahika, pesan tiket ${po} ke ${tujuan}`;
}

setInterval(updateHeader, 1000);
updateHeader(); fetchWeather(); loadData();
