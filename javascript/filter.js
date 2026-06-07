// l'etat actuel des filtres
let currentFilters = {
    category: 'all',
    search: ''
};

// Initialisation des pages de produits
function initProductsPage() {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;
    
    // 
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    
    if (categoryParam) {
        currentFilters.category = categoryParam;
        updateActiveFilterButton(categoryParam);
    }
    
    setupFilterListeners();

    renderProducts();
}

function updateActiveFilterButton(category) {
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        if (btn.dataset.category === category) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

function setupFilterListeners() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const category = btn.dataset.category;
            currentFilters.category = category;
            updateActiveFilterButton(category);
            renderProducts();
        });
    });
    
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', debounce((e) => {
            currentFilters.search = e.target.value;
            renderProducts();
        }, 300));
    }
}

function renderProducts() {
    const productsGrid = document.getElementById('productsGrid');
    
    if (!productsGrid) return;
    
    let filteredProducts = getProductsByCategory(currentFilters.category);
    
    if (currentFilters.search) {
        filteredProducts = searchProducts(filteredProducts, currentFilters.search);
    }
    
    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = `
            <div class="no-products">
                <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.3-4.3"></path>
                </svg>
                <h3>No products found</h3>
                <p>Try adjusting your filters or search query</p>
                <button class="btn btn-primary" onclick="resetFilters()">Reset Filters</button>
            </div>
        `;
    } else {
        productsGrid.innerHTML = filteredProducts.map(product => createProductCard(product, false)).join('');
    }
}

function resetFilters() {
    currentFilters = {
        category: 'all',
        search: ''
    };
    
    // Reset UI
    updateActiveFilterButton('all');
    const searchInput = document.getElementById('searchInput');
    if (searchInput) searchInput.value = '';
    
    renderProducts();
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Intialisation
document.addEventListener('DOMContentLoaded', () => {
    initProductsPage();
});

// rendre les fonctions accessibles globalement
window.resetFilters = resetFilters;
