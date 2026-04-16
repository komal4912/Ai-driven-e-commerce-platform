const API_BASE_URL = 'http://localhost:5000/api';
let currentUserId = 1;
let allProducts = [];


const CATEGORY_ICONS = {
    'Electronics': 'fa-laptop-code',
    'Books': 'fa-book-open',
    'Clothing': 'fa-shirt',
    'Home': 'fa-house-chimney'
};


async function init() {
    console.log('Initializing AI Store...');
    setupEventListeners();
    await loadData();
}

async function loadData() {
    await fetchProducts();
    await fetchRecommendations();
}




function setupEventListeners() {
    const selector = document.getElementById('userSelector');
    selector.addEventListener('change', (e) => {
        currentUserId = parseInt(e.target.value);
        console.log(`Switched to user: ${currentUserId}`);
        fetchRecommendations();
    });
}


async function fetchProducts() {
    const grid = document.getElementById('allProductsGrid');
    try {
        const response = await fetch(`${API_BASE_URL}/Products`);
        if (!response.ok) throw new Error('API unreachable');

        allProducts = await response.json();
        renderProducts('allProductsGrid', allProducts);
    } catch (error) {
        console.warn('API Error, using fallback data:', error);

        allProducts = [
            { id: 1, name: 'Premium Laptop', category: { name: 'Electronics' }, price: 1299, rating: 4.8, imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop&q=60' },
            { id: 2, name: 'Smart Watch Pro', category: { name: 'Electronics' }, price: 299, rating: 4.5, imageUrl: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&auto=format&fit=crop&q=60' },
            { id: 3, name: 'Design Patterns', category: { name: 'Books' }, price: 45, rating: 4.9, imageUrl: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&auto=format&fit=crop&q=60' },
            { id: 4, name: 'Wireless Headphones', category: { name: 'Electronics' }, price: 199, rating: 4.7, imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=60' }
        ];
        renderProducts('allProductsGrid', allProducts);
    }
}


async function fetchRecommendations() {
    const grid = document.getElementById('recommendationsGrid');
    grid.innerHTML = '<div class="loader"><div class="spinner"></div></div>';

    try {
        const response = await fetch(`${API_BASE_URL}/Recommendations/${currentUserId}`);
        if (!response.ok) throw new Error('API unreachable');

        const recommendations = await response.json();
        renderProducts('recommendationsGrid', recommendations);
    } catch (error) {
        console.warn('API Error recommendations, using fallback logic:');

        const fallbackRecs = allProducts.slice(0, 3).reverse();
        renderProducts('recommendationsGrid', fallbackRecs);
    }
}


function renderProducts(gridId, products) {
    const grid = document.getElementById(gridId);
    grid.innerHTML = '';

    if (products.length === 0) {
        grid.innerHTML = '<p class="text-muted">No products found.</p>';
        return;
    }

    products.forEach(product => {
        const icon = CATEGORY_ICONS[product.category?.name] || 'fa-box';
        const imageHtml = product.imageUrl
            ? `<img src="${product.imageUrl}" alt="${product.name}" onerror="this.onerror=null; this.parentElement.innerHTML='<i class=\\'fas ${icon}\\'></i>';">`
            : `<i class="fas ${icon}"></i>`;

        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="product-image">
                ${imageHtml}
            </div>
            <div class="product-info">
                <span class="product-category">${product.category?.name || 'General'}</span>
                <h3>${product.name}</h3>
                <div class="product-meta">
                    <span class="price">$${product.price}</span>
                    <span class="rating">
                        <i class="fas fa-star"></i>
                        ${product.rating || '4.0'}
                    </span>
                </div>
                <button class="btn-view" onclick="trackInteraction(${product.id})">
                    View Details
                </button>
            </div>
        `;
        grid.appendChild(card);
    });
}

async function trackInteraction(productId) {
    try {
        await fetch(`${API_BASE_URL}/Products/track`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: currentUserId,
                productId: productId,
                actionType: 'Click'
            })
        });

        console.log(`Stored click for Product ${productId} by User ${currentUserId}`);

        fetchRecommendations();

    } catch (error) {
        console.error('Failed to track click:', error);
    }
}

init();
