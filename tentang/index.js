// DATA UNTUK GALLERY & TESTIMONI
const galleryData = [
    "https://drive.google.com/thumbnail?id=1BOXstI2sH5Gr3Y1V5854JCbP_618sLda&sz=w1000",
    "https://drive.google.com/thumbnail?id=1ANEk9O2T6e6VkB_Lj2AiB9ZLUl0uUiPP&sz=w1000",
    "https://drive.google.com/thumbnail?id=15QGGsKLFKfUz8F6pKq2ENcRHiZwbX6Aw&sz=w1000",
    "https://drive.google.com/thumbnail?id=1x1yOxNrPzWHvs4f4BKQ42hBGiw0hVtCl&sz=w1000"
];

const testiData = [
    { name: "Robert Kurniawan", text: "Tiket busnya murah dan gampang banget pesennya. Admin Mahika responsif!", img: "https://i.pravatar.cc/100?u=1" },
    { name: "Linda Wijaya", text: "Baru pertama kali nyoba travel lewat Mahika, dapet armada yang sangat nyaman.", img: "https://i.pravatar.cc/100?u=2" },
    { name: "Fahri Alamsyah", text: "Pesan tiket pesawat mendadak buat bisnis, dapet harga paling jujur di sini.", img: "https://i.pravatar.cc/100?u=3" }
];

let gIdx = 0;
let tIdx = 0;

// FUNGSI UTAMA PROFILE
function updateProfileItems() {
    const galBox = document.getElementById('gallery-fade');
    const tesBox = document.getElementById('testi-content');

    // Suntik Gambar Gallery
    if (galBox) {
        galBox.innerHTML = `<img src="${galleryData[gIdx]}" class="fade-anim" style="width:100%;height:100%;object-fit:cover;">`;
        gIdx = (gIdx + 1) % galleryData.length;
    }

    // Suntik Testimoni
    if (tesBox) {
        const t = testiData[tIdx];
        tesBox.innerHTML = `
            <div style="text-align:center;width:100%;animation: fadeIn 0.8s;">
                <img src="${t.img}" style="width:50px;border-radius:50%;border:2px solid #FFC107;margin-bottom:8px;">
                <h4 style="color:#003B73;font-size:0.85rem;margin-bottom:3px;">${t.name}</h4>
                <div style="color:#FFC107;font-size:0.6rem;margin-bottom:8px;">★★★★★</div>
                <p style="font-size:0.75rem;color:#555;font-style:italic;line-height:1.4;">"${t.text}"</p>
            </div>
        `;
        tIdx = (tIdx + 1) % testiData.length;
    }
}

// INISIALISASI FIREBASE (Try Catch agar tidak error)
try {
    const firebaseConfig = {
        apiKey: "AIzaSyBZNupFpsHWibTfthCtiGc8mzB2q0QaOqY",
        authDomain: "mahikabiz.firebaseapp.com",
        databaseURL: "https://mahikabiz-default-rtdb.asia-southeast1.firebasedatabase.app",
        projectId: "mahikabiz",
        storageBucket: "mahikabiz.firebasestorage.app",
        messagingSenderId: "795712739200",
        appId: "1:795712739200:web:5cb7b9627ffccb14f29365"
    };
    if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
} catch (err) { console.log("Firebase not loaded yet"); }

// JALANKAN SAAT START
document.addEventListener('DOMContentLoaded', () => {
    updateProfileItems();
    setInterval(updateProfileItems, 5000);
});
