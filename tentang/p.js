const galleryData = [
    "https://drive.google.com/thumbnail?id=1BOXstI2sH5Gr3Y1V5854JCbP_618sLda&sz=w1000",
    "https://drive.google.com/thumbnail?id=1ANEk9O2T6e6VkB_Lj2AiB9ZLUl0uUiPP&sz=w1000",
    "https://drive.google.com/thumbnail?id=15QGGsKLFKfUz8F6pKq2ENcRHiZwbX6Aw&sz=w1000",
    "https://drive.google.com/thumbnail?id=1x1yOxNrPzWHvs4f4BKQ42hBGiw0hVtCl&sz=w1000"
];

const testimoniData = [
    { name: "Robert Kurniawan", text: "Tiket busnya murah dan gampang banget pesennya. Admin Mahika responsif!", img: "https://i.pravatar.cc/100?u=a" },
    { name: "Linda Wijaya", text: "Baru pertama kali nyoba travel lewat Mahika, dapet armada yang sangat nyaman dan on time.", img: "https://i.pravatar.cc/100?u=b" },
    { name: "Fahri Alamsyah", text: "Pesan tiket pesawat mendadak buat bisnis, dapet harga paling jujur di sini.", img: "https://i.pravatar.cc/100?u=c" }
];

let galleryIndex = 0;
let testiIndex = 0;

function updateProfileContent() {
    const galleryFade = document.getElementById('gallery-fade');
    const testiContent = document.getElementById('testi-content');

    // GALLERY LOGIC (Directly Injecting Image)
    if (galleryFade) {
        galleryFade.innerHTML = `<img src="${galleryData[galleryIndex]}" class="fade-anim gallery-img-js">`;
        galleryIndex = (galleryIndex + 1) % galleryData.length;
    }

    // TESTIMONI LOGIC
    if (testiContent) {
        testiContent.classList.remove('fade-anim');
        void testiContent.offsetWidth; 
        testiContent.classList.add('fade-anim');

        const t = testimoniData[testiIndex];
        testiContent.innerHTML = `
            <div class="testi-item">
                <div class="testi-user">
                    <img src="${t.img}" style="width:40px;height:40px;border-radius:50%;margin-right:10px;border:2px solid #FFC107">
                    <div class="testi-name">${t.name} <div style="color:#FFC107;font-size:0.6rem">★★★★★</div></div>
                </div>
                <p style="font-size:0.7rem;font-style:italic;color:#555">"${t.text}"</p>
            </div>
        `;
        testiIndex = (testiIndex + 1) % testimoniData.length;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    updateProfileContent();
    setInterval(updateProfileContent, 5000);
});
