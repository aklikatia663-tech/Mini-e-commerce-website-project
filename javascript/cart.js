// État du panier
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Mettre à jour le compteur du panier
function updateCartCount() {
    const cartCountElements = document.querySelectorAll('.cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    cartCountElements.forEach(el => {
        el.textContent = totalItems;
    });
}

// Sauvegarder le panier
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

// Ajouter un produit au panier
function addToCart(productId) {
    const product = getProductById(productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    // Si le produit existe déjà, on augmente la quantité
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        // Sinon on l’ajoute au panier
        cart.push({
            id: product.id,
            name: product.name,
            category: product.category,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    saveCart();
    showToast(`${product.name} ajouté au panier !`, 'success');
}

// Supprimer un produit du panier
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    renderCartItems();
    showToast('Produit supprimé du panier', 'success');
}

// Modifier la quantité d’un produit
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;
    
    item.quantity += change;
    
    // Si la quantité est à 0 ou moins, on supprime l’article
    if (item.quantity <= 0) {
        removeFromCart(productId);
        return;
    }
    
    saveCart();
    renderCartItems();
}

// Calculer le total du panier
function calculateCartTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Afficher les articles du panier
function renderCartItems() {
    const cartItemsContainer = document.getElementById('cartItems');
    const emptyCart = document.getElementById('emptyCart');
    const cartSummary = document.getElementById('cartSummary');
    
    if (!cartItemsContainer) return;
    
    // Si le panier est vide
    if (cart.length === 0) {
        cartItemsContainer.style.display = 'none';
        if (emptyCart) emptyCart.style.display = 'block';
        if (cartSummary) cartSummary.style.display = 'none';
        return;
    }
    
    // Affichage du panier
    cartItemsContainer.style.display = 'flex';
    if (emptyCart) emptyCart.style.display = 'none';
    if (cartSummary) cartSummary.style.display = 'block';
    
    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item" data-id="${item.id}">
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="cart-item-details">
                <div>
                    <span class="cart-item-category">${item.category}</span>
                    <h3>${item.name}</h3>
                    <span class="cart-item-price">${formatPrice(item.price)}</span>
                </div>
                <div class="cart-item-actions">
                    <div class="quantity-controls">
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                        <span class="quantity-value">${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                    </div>
                    <button class="remove-item" onclick="removeFromCart(${item.id})">
                        Supprimer
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    
    updateCartSummary();
}

// Mettre à jour le résumé du panier
function updateCartSummary() {
    const subtotalEl = document.getElementById('subtotal');
    const totalEl = document.getElementById('total');
    const modalTotalEl = document.getElementById('modalTotal');
    const deliveryFee = 200;
    
    const subtotal = calculateCartTotal();
    const total = subtotal + deliveryFee;
    
    if (subtotalEl) subtotalEl.textContent = formatPrice(subtotal);
    if (totalEl) totalEl.textContent = formatPrice(total);
    if (modalTotalEl) modalTotalEl.textContent = formatPrice(total);
}

// Code promo
const applyPromoBtn = document.getElementById('applyPromo');
if (applyPromoBtn) {
    applyPromoBtn.addEventListener('click', () => {
        const promoInput = document.getElementById('promoInput');
        const promoCode = promoInput.value.trim().toUpperCase();
        
        const promoCodes = {
            'DRINKS10': 10,
            'WELCOME20': 20,
            'SUMMER15': 15
        };
        
        if (promoCodes[promoCode]) {
            const discount = promoCodes[promoCode];
            const subtotal = calculateCartTotal();
            const discountAmount = Math.round(subtotal * (discount / 100));
            
            const discountRow = document.getElementById('discountRow');
            const discountEl = document.getElementById('discount');
            
            if (discountRow) discountRow.style.display = 'flex';
            if (discountEl) discountEl.textContent = `-${formatPrice(discountAmount)}`;
            
            const deliveryFee = 200;
            const newTotal = subtotal - discountAmount + deliveryFee;
            
            const totalEl = document.getElementById('total');
            const modalTotalEl = document.getElementById('modalTotal');
            
            if (totalEl) totalEl.textContent = formatPrice(newTotal);
            if (modalTotalEl) modalTotalEl.textContent = formatPrice(newTotal);
            
            showToast(`Code promo appliqué ! -${discount}%`, 'success');
        } else {
            showToast('Code promo invalide', 'error');
        }
    });
}

// Bouton checkout
const checkoutBtn = document.getElementById('checkoutBtn');
const checkoutModal = document.getElementById('checkoutModal');
const closeModal = document.getElementById('closeModal');
const successModal = document.getElementById('successModal');

if (checkoutBtn && checkoutModal) {
    checkoutBtn.addEventListener('click', () => {

        const user = JSON.parse(localStorage.getItem('currentUser'));
        if (!user) {
            showToast('Veuillez vous connecter pour continuer', 'error');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1500);
            return;
        }
        
        const fullNameInput = document.getElementById('fullName');
        const phoneInput = document.getElementById('orderPhone');
        
        if (fullNameInput) fullNameInput.value = `${user.firstName} ${user.lastName}`;
        if (phoneInput) phoneInput.value = user.phone || '';
        
        checkoutModal.classList.add('active');
    });
}

// Fermer la modal
if (closeModal && checkoutModal) {
    closeModal.addEventListener('click', () => {
        checkoutModal.classList.remove('active');
    });
}

// Fermer en cliquant à l’extérieur
if (checkoutModal) {
    checkoutModal.addEventListener('click', (e) => {
        if (e.target === checkoutModal) {
            checkoutModal.classList.remove('active');
        }
    });
}

// Validation commande
const checkoutForm = document.getElementById('checkoutForm');
if (checkoutForm) {
    checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const orderNumber = 'DH' + Date.now().toString().slice(-8);
        
        if (checkoutModal) checkoutModal.classList.remove('active');
        
        if (successModal) {
            const orderNumberEl = document.getElementById('orderNumber');
            if (orderNumberEl) orderNumberEl.textContent = orderNumber;
            successModal.classList.add('active');
        }
        
        cart = [];
        saveCart();
        renderCartItems();
    });
}

// Fermer modal succès
if (successModal) {
    successModal.addEventListener('click', (e) => {
        if (e.target === successModal || e.target.closest('.btn')) {
            successModal.classList.remove('active');
        }
    });
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    
    if (document.getElementById('cartItems')) {
        renderCartItems();
    }
});

// Fonctions globales
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;