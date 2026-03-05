const cars = [
    { name: "Toyota Avanza", price: "450rb", img: "https://picsum.photos/300/200?random=1" },
    { name: "Innova Zenix", price: "800rb", img: "https://picsum.photos/300/200?random=2" },
    { name: "Toyota Hiace", price: "1.2jt", img: "https://picsum.photos/300/200?random=3" },
    { name: "Fortuner VRZ", price: "1.1jt", img: "https://picsum.photos/300/200?random=4" }
];

const grid = document.getElementById('product-grid');
const search = document.getElementById('search-input');
const toggle = document.getElementById('theme-toggle');

function render(data) {
    grid.innerHTML = data.map(c => `
        <div class="product-card">
            <img src="${c.img}" alt="${c.name}">
            <h4>${c.name}</h4>
            <span class="price">Rp ${c.price} <small>/hari</small></span>
            <button class="buy-btn">Pesan</button>
        </div>
    `).join('');
}

search.addEventListener('input', (e) => {
    const val = e.target.value.toLowerCase();
    render(cars.filter(c => c.name.toLowerCase().includes(val)));
});

toggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    toggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
});

// Nav Active State
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', function() {
        document.querySelector('.nav-item.active').classList.remove('active');
        this.classList.add('active');
    });
});

render(cars);
