// Dummy Data Mahika Trans
const products = [
    { id: 1, name: "Toyota Avanza", price: "450.000", img: "https://images.unsplash.com/photo-1620853755255-b0f3404c0e2c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMTkyMXwwfDF8c2VhcmNofDN8fGF2YW56YXxlbnwwfHx8fDE2NzI5MjI3ODg&ixlib=rb-4.0.3&q=80&w=400" },
    { id: 2, name: "Toyota Innova Zenix", price: "750.000", img: "https://images.unsplash.com/photo-1669460594833-8b7c7b897850?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMTkyMXwwfDF8c2VhcmNofDJ8fGlubm92YSUyMHplbml4fGVufDB8fHx8MTY3MjkyMjg3Mw&ixlib=rb-4.0.3&q=80&w=400" },
    { id: 3, name: "Toyota Fortuner", price: "950.000", img: "https://images.unsplash.com/photo-1626084992923-d667c4e51270?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMTkyMXwwfDF8c2VhcmNofDF8fGZvcnR1bmVyfGVufDB8fHx8MTY3MjkyMjkxMw&ixlib=rb-4.0.3&q=80&w=400" },
    { id: 4, name: "Toyota Hiace", price: "1.300.000", img: "https://images.unsplash.com/photo-1663116997034-7833bd442ef5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMTkyMXwwfDF8c2VhcmNofDF8fGhpYWNlfGVufDB8fHx8MTY3MjkyMjk0Mg&ixlib=rb-4.0.3&q=80&w=400" },
];

const productGrid = document.getElementById('product-grid');
const searchInput = document.getElementById('search-input');
const themeToggle = document.getElementById('theme-toggle');

// 1. Render Catalog
function renderCatalog(items) {
    productGrid.innerHTML = items.map(p => `
        <div class="product-card">
            <img src="${p.img}" alt="${p.name}">
            <h4>${p.name}</h4>
            <div class="price">Rp ${p.price} <span>/hari</span></div>
            <button class="buy-btn">Pesan Sekarang</button>
        </div>
    `).join('');
}

// 2. Search Filter Realtime
searchInput.addEventListener('input', (e) => {
    const val = e.target.value.toLowerCase();
    const filtered = products.filter(p => p.name.toLowerCase().includes(val));
    renderCatalog(filtered);
});

// 3. Dark Mode Toggle
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    themeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    localStorage.setItem('mode', isDark ? 'dark' : 'light');
});

// 4. Load Mode Preference
if (localStorage.getItem('mode') === 'dark') {
    document.body.classList.add('dark-mode');
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
}

// Initial Render
renderCatalog(products);
