// ==========================================
// CONFIGURASI FIREBASE
// ==========================================
const firebaseConfig = {
    apiKey: "AIzaSyBZNupFpsHWibTfthCtiGc8mzB2q0QaOqY",
    authDomain: "mahikabiz.firebaseapp.com",
    databaseURL: "https://mahikabiz-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "mahikabiz",
    storageBucket: "mahikabiz.firebasestorage.app",
    messagingSenderId: "795712739200",
    appId: "1:795712739200:web:5cb7b9627ffccb14f29365"
};

if (!firebase.apps.length) { firebase.initializeApp(firebaseConfig); }
const db = firebase.database();

// ==========================================
// DATA TESTIMONI & GALLERY (STATIS)
// ==========================================
const testimoniData = [
    { name: "Andi Saputra", text: "Pelayanan sangat memuaskan, bus bersih dan driver ramah banget!", img: "https://i.pravatar.cc/100?u=1" },
    { name: "Siska Amelia", text: "Pesan tiket di Mahika anti ribet. Langsung dapet kursi paling depan!", img: "https://i.pravatar.cc/100?u=2" },
    { name: "Budi Santoso", text: "Harga paling jujur dan jadwalnya on-time terus. Rekomended!", img: "https://i.pravatar.cc/100?u=3" }
];

const galleryData = [
    "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=600",
    "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?q=80&w=600",
    "https://images.unsplash.com/photo-1590674899484-d5640e854abe?q=80&w=600"
];

let testiIndex = 0;
let galleryIndex = 0;

// ==========================================
// FUNGSI UTAMA
// ==========================================
function init() {
    // 1. LOAD PROMO
    db.ref('promo').on('value', snap => {
        const data = snap.val();
        const container = document.getElementById('promo-list');
        if (data && container) {
            container.innerHTML = Object.values(data).map(p => `
                <div class="promo-card" style="background-image: url('${p.foto}')">
                    <div class="promo-content">
                        <h4>${p.judul || ''}</h4>
                        <p>${p.desk || ''}</p> 
                    </div>
                </div>
            `).join('');
        }
    });

    // 2. LOAD JADWAL (SPLIT, SHUFFLE, LIMIT 4)
    db.ref('jadwal').on('value', snap => {
        const data = snap.val();
        const container = document.getElementById('bus-list');
        if (data && container) {
            const rawList = Object.values(data);
            let allRoutes = [];

            rawList.forEach(item => {
                const fotoValid = item.foto || 'https://via.placeholder.com/300x180?text=MAHIKA';
                const ruteArray = item.tujuan ? item.tujuan.split(',') : [];
                
                ruteArray.forEach(kota => {
                    const namaKota = kota.trim().toUpperCase();
                    if (namaKota !== "") {
                        allRoutes.push({
                            tujuan: namaKota,
                            namaPO: item.namaPO,
                            jam: item.jam,
                            harga: item.harga,
                            foto: fotoValid
                        });
                    }
                });
            });

            // Shuffle (Acak)
            for (let i = allRoutes.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [allRoutes[i], allRoutes[j]] = [allRoutes[j], allRoutes[i]];
            }

            // Render Limit 4
            container.innerHTML = allRoutes.slice(0, 4).map(b => `
                <div class="bus-card">
                    <img src="${b.foto}" alt="${b.tujuan}" loading="lazy">
                    <div class="bus-card-body">
                        <div>
                            <h4>${b.tujuan}</h4>
                            <div class="bus-meta">${b.namaPO} | ${b.jam || 'TIAP HARI'}</div>
                        </div>
                        <div class="bus-price">Rp ${Number(b.harga).toLocaleString('id-ID')}</div>
                        <a href="https://wa.me/6285156677461?text=Halo Mahika, mau pesan tiket ${b.namaPO} rute ${b.tujuan}" class="btn-wa">BOOKING</a>
                    </div>
                </div>
            `).join('');
        }
    });

    // 3. LOAD NEWS
    db.ref('news').on('value', snap => {
        const data = snap.val();
        const container = document.getElementById('news-list');
        if (data && container) {
            const keys = Object.keys(data).reverse();
            container.innerHTML = keys.slice(0, 3).map(id => `
                <div class="news-item" onclick="window.location.href='news/?id=${id}'">
                    <img src="${data[id].foto || 'https://via.placeholder.com/100'}" class="news-img">
                    <div class="news-info">
                        <h4>${data[id].judul}</h4>
                        <p>${data[id].isi.substring(0, 60)}...</p>
                    </div>
                </div>
            `).join('');
        }
    });

    // 4. LOAD MARQUEE PARTNERS
    db.ref('partners').on('value', snap => {
        const data = snap.val();
        const container = document.getElementById('marquee-po');
        if (data && container) {
            let list = Object.values(data).map(p => p.nama);
            const displayList = [...list, ...list]; // Duplikasi untuk efek loop
            container.innerHTML = displayList.map(nama => `
                <div class="po-card-mini"><span>${nama.toUpperCase()}</span></div>
            `).join('');
        }
    });

    // Mulai Slider Testimoni & Gallery
    updateTestiAndGallery();
    setInterval(updateTestiAndGallery, 5000);
}

// ==========================================
// ANIMASI TESTIMONI & GALLERY
// ==========================================
function updateTestiAndGallery() {
    const testiContent = document.getElementById('testi-content');
    const galleryFade = document.getElementById('gallery-fade');

    if (testiContent) {
        // Reset animasi (remove and re-add class)
        testiContent.classList.remove('fade-anim');
        void testiContent.offsetWidth; // Trigger reflow
        testiContent.classList.add('fade-anim');

        const t = testimoniData[testiIndex];
        testiContent.innerHTML = `
            <div class="testi-item">
                <div class="testi-user">
                    <img src="${t.img}" alt="User">
                    <div class="testi-name">
                        ${t.name}
                        <div class="testi-stars">
                            <i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i>
                        </div>
                    </div>
                </div>
                <p class="testi-text">"${t.text}"</p>
            </div>
        `;
        testiIndex = (testiIndex + 1) % testimoniData.length;
    }

    if (galleryFade) {
        galleryFade.innerHTML = `<img src="${galleryData[galleryIndex]}" alt="Gallery" class="fade-anim">`;
        galleryIndex = (galleryIndex + 1) % galleryData.length;
    }
}

// ==========================================
// SEARCH HANDLER
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    init();
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const q = e.target.value.trim();
                if (q) window.location.href = `jadwal.html?q=${encodeURIComponent(q)}`;
            }
        });
    }
});
