// Firebase Config tetep sama
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

// DATA DUMMY PROFILE
const testimoniData = [
    { name: "Robert Kurniawan", text: "Tiket busnya murah dan gampang banget pesennya. Admin Mahika responsif!", img: "https://i.pravatar.cc/100?u=a" },
    { name: "Linda Wijaya", text: "Baru pertama kali nyoba travel lewat Mahika, dapet armada yang sangat nyaman dan on time.", img: "https://i.pravatar.cc/100?u=b" },
    { name: "Fahri Alamsyah", text: "Pesan tiket pesawat mendadak buat bisnis, dapet harga paling jujur di sini.", img: "https://i.pravatar.cc/100?u=c" }
];

const galleryData = [
    "IMG_20260218_114027.jpg",
    "IMG_20260218_114002.jpg",
    "https://images.unsplash.com/photo-1590674899484-d5640e854abe?q=80&w=600",
    "https://images.unsplash.com/photo-1518005020251-58296d424930?q=80&w=600"
];

let testiIndex = 0;
let galleryIndex = 0;

function updateAutoContent() {
    const testiContent = document.getElementById('testi-content');
    const galleryFade = document.getElementById('gallery-fade');

    if (testiContent) {
        testiContent.classList.remove('fade-anim');
        void testiContent.offsetWidth; 
        testiContent.classList.add('fade-anim');

        const t = testimoniData[testiIndex];
        testiContent.innerHTML = `
            <div class="testi-item">
                <div class="testi-user">
                    <img src="${t.img}" alt="User">
                    <div class="testi-name">${t.name}<div class="testi-stars"><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i></div></div>
                </div>
                <p class="testi-text">"${t.text}"</p>
            </div>
        `;
        testiIndex = (testiIndex + 1) % testimoniData.length;
    }

    if (galleryFade) {
        galleryFade.innerHTML = `<img src="${galleryData[galleryIndex]}" alt="Bus" class="fade-anim">`;
        galleryIndex = (galleryIndex + 1) % galleryData.length;
    }
}

// Inisialisasi saat DOM siap
document.addEventListener('DOMContentLoaded', () => {
    updateAutoContent();
    setInterval(updateAutoContent, 5000);
    
    // Logic Firebase untuk halaman utama tetep jalan di sini (loadFirebaseData() dst...)
});
