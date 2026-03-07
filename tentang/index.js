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

if (!firebase.apps.length) { firebase.initializeApp(firebaseConfig); }
const db = firebase.database();

// ==========================================
// 2. DATA GALLERY (LINK GOOGLE DRIVE LO)
// ==========================================
// Gue udah konversi ke Direct Link supaya fotonya nongol
const galleryData = [
    "https://lh3.googleusercontent.com/u/0/d/1BOXstI2sH5Gr3Y1V5854JCbP_618sLda",
    "https://lh3.googleusercontent.com/u/0/d/1ANEk9O2T6e6VkB_Lj2AiB9ZLUl0uUiPP",
    "https://lh3.googleusercontent.com/u/0/d/15QGGsKLFKfUz8F6pKq2ENcRHiZwbX6Aw",
    "https://lh3.googleusercontent.com/u/0/d/1x1yOxNrPzWHvs4f4BKQ42hBGiw0hVtCl"
];

// ==========================================
// 3. DATA TESTIMONI
// ==========================================
const testimoniData = [
    { name: "Robert Kurniawan", text: "Tiket busnya murah dan gampang banget pesennya. Admin Mahika responsif!", img: "https://i.pravatar.cc/100?u=a" },
    { name: "Linda Wijaya", text: "Baru pertama kali nyoba travel lewat Mahika, dapet armada yang sangat nyaman dan on time.", img: "https://i.pravatar.cc/100?u=b" },
    { name: "Fahri Alamsyah", text: "Pesan tiket pesawat mendadak buat bisnis, dapet harga paling jujur di sini.", img: "https://i.pravatar.cc/100?u=c" }
];

let testiIndex = 0;
let galleryIndex = 0;

// ==========================================
// 4. FUNGSI LOAD DATA DARI FIREBASE
// ==========================================
function loadFirebaseData() {
    // Load Promo (Jika ada elemennya)
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

    // Load Jadwal (Split & Limit 4)
    const busList = document.getElementById('bus-list');
    if (busList) {
        db.ref('jadwal').on('value', snap => {
            const data = snap.val();
            if (data) {
                const rawList = Object.values(data);
                let allRoutes = [];
                rawList.forEach(item => {
                    const ruteArray = item.tujuan ? item.tujuan.split(',') : [];
                    ruteArray.forEach(kota => {
                        if (kota.trim()) {
                            allRoutes.push({
                                tujuan: kota.trim().toUpperCase(),
                                namaPO: item.namaPO,
                                jam: item.jam,
                                harga: item.harga,
                                foto: item.foto || 'https://via.placeholder.com/300'
                            });
                        }
                    });
                });
                allRoutes.sort(() => Math.random() - 0.5);
                busList.innerHTML = allRoutes.slice(0, 4).map(b => `
                    <div class="bus-card">
                        <img src="${b.foto}">
                        <div class="bus-card-body">
                            <h4>${b.tujuan}</h4>
                            <div class="bus-meta">${b.namaPO}</div>
                            <div class="bus-price">Rp ${Number(b.harga).toLocaleString('id-ID')}</div>
                            <a href="https://wa.me/6285156677461?text=Booking rute ${b.tujuan}" class="btn-wa">BOOKING</a>
                        </div>
                    </div>
                `).join('');
            }
        });
    }
}

// ==========================================
// 5. ANIMASI AUTO SLIDE (PROFILE)
// ==========================================
function updateAutoContent() {
    const testiContent = document.getElementById('testi-content');
    const galleryFade = document.getElementById('gallery-fade');

    // Update Testimoni
    if (testiContent) {
        testiContent.classList.remove('fade-anim');
        void testiContent.offsetWidth; // Reset animasi
        testiContent.classList.add('fade-anim');

        const t = testimoniData[testiIndex];
        testiContent.innerHTML = `
            <div class="testi-item">
                <div class="testi-user">
                    <img src="${t.img}">
                    <div class="testi-name">${t.name}<div class="testi-stars"><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i></div></div>
                </div>
                <p class="testi-text">"${t.text}"</p>
            </div>
        `;
        testiIndex = (testiIndex + 1) % testimoniData.length;
    }

    // Update Gallery
    if (galleryFade) {
        galleryFade.innerHTML = `<img src="${galleryData[galleryIndex]}" class="fade-anim">`;
        galleryIndex = (galleryIndex + 1) % galleryData.length;
    }
}

// ==========================================
// 6. INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    loadFirebaseData();
    updateAutoContent();
    setInterval(updateAutoContent, 5000); // Ganti tiap 5 detik

    // Search Box Handler
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && e.target.value.trim()) {
                window.location.href = `jadwal.html?q=${encodeURIComponent(e.target.value.trim())}`;
            }
        });
    }
});
        
