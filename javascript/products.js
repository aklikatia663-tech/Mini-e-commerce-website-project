

const products = [
    // Juices
    {
        id: 1,
        name: "Fresh Orange Juice",
        category: "juice",
        price: 350,
        description: "Freshly squeezed orange juice packed with vitamin C and natural sweetness.",
        image: "../images/orange-juice.png",
        badge: "Popular",
        featured: true
    },
    {
        id: 2,
        name: "Green Apple Juice",
        category: "juice",
        price: 320,
        description: "Crisp and refreshing green apple juice made from premium Algerian apples.",
        image: "../images/apple-juice.png",
        badge: null,
        featured: true
    },
    {
        id: 3,
        name: "Tropical Mango Juice",
        category: "juice",
        price: 400,
        description: "Sweet and exotic mango juice with a rich tropical flavor.",
        image: "../images/mango-juice.png",
        badge: "New",
        featured: true
    },
    
    // Smoothies
    {
        id: 4,
        name: "Strawberry Banana Smoothie",
        category: "smoothie",
        price: 450,
        description: "Creamy blend of fresh strawberries and ripe bananas with yogurt.",
        image: "../images/strawberry-smoothie.png",
        badge: "Best Seller",
        featured: true
    },
    {
        id: 5,
        name: "Green Detox Smoothie",
        category: "smoothie",
        price: 500,
        description: "Healthy mix of spinach, kale, avocado, and green apple for a nutritious boost.",
        image: "../images/green-smoothie.png",
        badge: "Healthy",
        featured: false
    },
    {
        id: 6,
        name: "Berry Mixed Smoothie",
        category: "smoothie",
        price: 480,
        description: "Delicious blend of blueberries, raspberries, and blackberries.",
        image: "../images/berry-smoothie.png",
        badge: null,
        featured: true
    },
    
    // Tea
    {
        id: 7,
        name: "Premium Green Tea",
        category: "tea",
        price: 280,
        description: "High-quality green tea leaves for a calming and antioxidant-rich experience.",
        image: "../images/green-tea.png",
        badge: null,
        featured: false
    },
    {
        id: 8,
        name: "Fresh Mint Tea",
        category: "tea",
        price: 250,
        description: "Traditional Algerian mint tea made with fresh mint leaves and natural herbs.",
        image: "../images/mint-tea.png",
        badge: "Traditional",
        featured: true
    },
    {
        id: 9,
        name: "Chamomile Tea",
        category: "tea",
        price: 300,
        description: "Soothing chamomile tea perfect for relaxation and better sleep.",
        image: "../images/chamomile-tea.png",
        badge: null,
        featured: false
    },
    
    // Coffee
    {
        id: 10,
        name: "Classic Espresso",
        category: "coffee",
        price: 200,
        description: "Strong and bold espresso shot made from premium roasted coffee beans.",
        image: "../images/espresso.png",
        badge: null,
        featured: false
    },
    {
        id: 11,
        name: "Creamy Cappuccino",
        category: "coffee",
        price: 350,
        description: "Perfect balance of espresso, steamed milk, and creamy foam.",
        image: "../images/cappuccino.png",
        badge: "Popular",
        featured: true
    },
    {
        id: 12,
        name: "Iced Coffee",
        category: "coffee",
        price: 380,
        description: "Refreshing cold coffee served over ice with a hint of cream.",
        image: "../images/iced-coffee.png",
        badge: "Summer Special",
        featured: false
    }
];


function getAllProducts() {
    return products;
}

function getFeaturedProducts() {
    return products.filter(product => product.featured);
}


function getProductById(id) {
    return products.find(product => product.id === id);
}


function getProductsByCategory(category) {
    if (category === 'all') return products;
    return products.filter(product => product.category === category);
}


function filterByPrice(productsList, priceRange) {
    if (priceRange === 'all') return productsList;
    
    const [min, max] = priceRange.split('-').map(Number);
    
    if (priceRange === '500+') {
        return productsList.filter(product => product.price >= 500);
    }
    
    return productsList.filter(product => product.price >= min && product.price <= max);
}

function searchProducts(productsList, query) {
    const lowerQuery = query.toLowerCase();
    return productsList.filter(product => 
        product.name.toLowerCase().includes(lowerQuery) ||
        product.description.toLowerCase().includes(lowerQuery) ||
        product.category.toLowerCase().includes(lowerQuery)
    );
}


function sortProducts(productsList, sortBy) {
    const sorted = [...productsList];
    
    switch (sortBy) {
        case 'price-low':
            return sorted.sort((a, b) => a.price - b.price);
        case 'price-high':
            return sorted.sort((a, b) => b.price - a.price);
        case 'name':
            return sorted.sort((a, b) => a.name.localeCompare(b.name));
        default:
            return sorted;
    }
}


function formatPrice(price) {
    return `${price.toLocaleString()} DZD`;
}

function createProductCard(product, isHomePage = false) {
    const imagePath = isHomePage ? product.image.replace('../', '') : product.image;
    
    return `
        <article class="product-card" data-id="${product.id}">
            <div class="product-image">
                <img src="${imagePath}" alt="${product.name}" loading="lazy">
                ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
            </div>
            <div class="product-info">
                <span class="product-category">${product.category}</span>
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <div class="product-footer">
                    <span class="product-price">${formatPrice(product.price)}</span>
                    <button class="add-to-cart" onclick="addToCart(${product.id})">Add to Cart</button>
                </div>
            </div>
        </article>
    `;
}

function renderFeaturedProducts() {
    const container = document.getElementById('featuredProducts');
    if (!container) return;
    
    const featured = getFeaturedProducts().slice(0, 4);
    container.innerHTML = featured.map(product => createProductCard(product, true)).join('');
}

// Initialisation des produits en vedette sur la page d’accueil
document.addEventListener('DOMContentLoaded', () => {
    renderFeaturedProducts();
});
