// ... Firebase Config ... (Gunakan config kamu)

function init() {
    // 1. Promo
    db.ref('promo').on('value', s => {
        const d = s.val();
        if (d) document.getElementById('promo-list').innerHTML = Object.values(d).map(p => `<div class="promo-card" style="background-image:url('${p.foto}')"></div>`).join('');
    });

    // 2. Marquee Partner (Membaca Path 'partners')
    db.ref('partners').on('value', s => {
        const d = s.val();
        const mq = document.getElementById('marquee-po');
        if (d && mq) {
            let pos = Object.values(d).map(x => x.nama);
            while (pos.length < 10) pos.push(...pos);
            mq.innerHTML = pos.map(p => `<div class="po-card-mini"><span>${p}</span></div>`).join('');
        }
    });

    // 3. News & Jadwal (Tetap seperti sebelumnya)
}
document.addEventListener('DOMContentLoaded', init);
