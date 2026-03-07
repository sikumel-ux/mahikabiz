// ==========================================
// 1. KONFIGURASI FIREBASE
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

// Inisialisasi Firebase
if (!firebase.apps.length) { 
    firebase.initializeApp(firebaseConfig); 
}
const db = firebase.database();

// ==========================================
// 2. DATA DUMMY (TESTIMONI & GALLERY)
// ==========================================
const testimoniData = [
    { name: "Robert Kurniawan", text: "Tiket busnya murah dan gampang banget pesennya. Admin Mahika responsif!", img: "https://i.pravatar.cc/100?u=a" },
    { name: "Linda Wijaya", text: "Baru pertama kali nyoba travel lewat Mahika, dapet armada yang sangat nyaman dan on time.", img: "https://i.pravatar.cc/100?u=b" },
    { name: "Fahri Alamsyah", text: "Pesan tiket pesawat mendadak buat bisnis, dapet harga paling jujur di sini.", img: "https://i.pravatar.cc/100?u=c" }
];

const galleryData = [
    "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=600",
    "https://images.unsplash.com/photo-1590674899484-d5640e854abe?q=80&w=600",
    "https://images.unsplash.com/photo-1568228551139-4447781b8f06?q=80&w=600",
    "https://images.unsplash.com/photo-1436491865332-7a61a109c053?q=80&w=600"
];

let testiIndex = 0;
let galleryIndex = 0;

// ==========================================
// 3. FUNGSI LOAD DATA DARI FIREBASE
// ==========================================
function loadFirebaseData() {
    // A. LOAD PROMO (Jika ada elemennya)
    const promoList = document.getElementById('promo-list');
    if (promoList) {
        db.ref('promo').on('value', snap => {
            const data = snap.val();
            if (data) {
                promoList.innerHTML = Object.values(data).map(p => `
                    <div class="promo-card" style="background-image: url('${p.foto}')">
                        <div class="promo-content">
                            <h4>${p.judul || ''}</h4>
                            <p>${p.desk || ''}</p> 
                        </div>
                    </div>
                `).join('');
            }
        });
    }

    // B. LOAD JADWAL (SPLIT KOMA, SHUFFLE, LIMIT 4)
    const busList = document.getElementById('bus-list');
    if (busList) {
        db.ref('jadwal').on('value', snap => {
            const data = snap.val();
            if (data) {
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

                // Shuffle (Acak Rute)
                allRoutes.sort(() => Math.random() - 0.5);

                // Tampilkan hanya 4
                busList.innerHTML = allRoutes.slice(0, 4).map(b => `
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
    }

    // C. LOAD NEWS (Halaman Utama)
    const newsList = document.getElementById('news-list');
    if (newsList) {
        db.ref('news').on('value', snap => {
            const data = snap.val();
            if (data) {
                const keys = Object.keys(data).reverse();
                newsList.innerHTML = keys.slice(0, 3).map(id => `
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
    }

    // D. LOAD MARQUEE PARTNERS
    const marqueePo = document.getElementById('marquee-po');
    if (marqueePo) {
        db.ref('partners').on('value', snap => {
            const data = snap.val();
            if (data) {
                let list = Object.values(data).map(p => p.nama);
                const displayList = [...list, ...list]; // Loop effect
                marqueePo.innerHTML = displayList.map(nama => `
                    <div class="po-card-mini"><span>${nama.toUpperCase()}</span></div>
                `).join('');
            }
        });
    }
}

// ==========================================
// 4. LOGIKA SLIDER (TESTIMONI & GALLERY)
// ==========================================
function updateTestiAndGallery() {
    const testiContent = document.getElementById('testi-content');
    const galleryFade = document.getElementById('gallery-fade');

    // Update Testimoni
    if (testiContent) {
        testiContent.classList.remove('fade-anim');
        void testiContent.offsetWidth; // Trigger Reflow untuk reset animasi
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

    // Update Gallery
    if (galleryFade) {
        galleryFade.innerHTML = `<img src="${galleryData[galleryIndex]}" alt="Gallery" class="fade-anim">`;
        galleryIndex = (galleryIndex + 1) % galleryData.length;
    }
}

// ==========================================
// 5. EVENT LISTENERS & INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // Jalankan Load Firebase
    loadFirebaseData();

    // Jalankan Slider (Setiap 5 detik)
    updateTestiAndGallery();
    setInterval(updateTestiAndGallery, 5000);

    // Handler Pencarian
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
                                
