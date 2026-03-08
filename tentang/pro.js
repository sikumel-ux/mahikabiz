// INISIALISASI SWIPER CENTER MODE
document.addEventListener('DOMContentLoaded', function () {
    const swiper = new Swiper(".mySwiper", {
        effect: "coverflow",
        grabCursor: true,
        centeredSlides: true,
        slidesPerView: "auto",
        loop: true,
        coverflowEffect: {
            rotate: 0,
            stretch: 0,
            depth: 100,
            modifier: 2.5,
            slideShadows: false,
        },
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
        },
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
        },
    });

    // TESTIMONI AUTO SLIDE (LOGIKA LAMA)
    const testiData = [
        { name: "Robert Kurniawan", text: "Tiket busnya murah dan gampang banget pesennya.", img: "https://i.pravatar.cc/100?u=1" },
        { name: "Linda Wijaya", text: "Armada travelnya sangat nyaman dan on time.", img: "https://i.pravatar.cc/100?u=2" },
        { name: "Fahri Alamsyah", text: "Pesan tiket pesawat di sini dapet harga terbaik.", img: "https://i.pravatar.cc/100?u=3" }
    ];

    let tIdx = 0;
    function updateTesti() {
        const tesBox = document.getElementById('testi-content');
        if (tesBox) {
            const t = testiData[tIdx];
            tesBox.innerHTML = `
                <div style="text-align:center; animation: fadeIn 0.8s;">
                    <img src="${t.img}" style="width:50px; border-radius:50%; border:2px solid #FFC107; margin-bottom:8px;">
                    <h4 style="color:#003B73; font-size:0.85rem;">${t.name}</h4>
                    <p style="font-size:0.75rem; color:#666; font-style:italic;">"${t.text}"</p>
                </div>
            `;
            tIdx = (tIdx + 1) % testiData.length;
        }
    }
    updateTesti();
    setInterval(updateTesti, 5000);
});
