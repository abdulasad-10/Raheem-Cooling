// Cart functionality
class CartSystem {
    constructor() {
        this.cart = this.loadCart();
        this.init();
    }

    init() {
        this.updateCartCount();
        this.setupEventListeners();
    }

    // Load cart from localStorage
    loadCart() {
        return JSON.parse(localStorage.getItem('raheemCoolingCart')) || [];
    }

    // Save cart to localStorage
    saveCart() {
        localStorage.setItem('raheemCoolingCart', JSON.stringify(this.cart));
    }

    // Add item to cart
    addItem(product) {
        const existingItem = this.cart.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 1
            });
        }
        
        this.saveCart();
        this.updateCartCount();
        this.showCartNotification(product.name);
    }

    // Remove item from cart
    removeItem(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartCount();
        this.refreshCartDisplay();
    }

    // Update quantity
    updateQuantity(productId, newQuantity) {
        if (newQuantity <= 0) {
            this.removeItem(productId);
            return;
        }

        const item = this.cart.find(item => item.id === productId);
        if (item) {
            item.quantity = newQuantity;
            this.saveCart();
            this.refreshCartDisplay();
        }
    }

    // Get cart items
    getCartItems() {
        return this.cart;
    }

    // Get total items count
    getTotalItems() {
        return this.cart.reduce((total, item) => total + item.quantity, 0);
    }

    // Get total price
    getTotalPrice() {
        return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    // Update cart count badge
    updateCartCount() {
        const cartCount = document.getElementById('cartCount');
        const totalItems = this.getTotalItems();
        
        if (cartCount) {
            cartCount.textContent = totalItems;
            cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
        }
    }

    // Show cart notification
    showCartNotification(productName) {
        // Create notification
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.innerHTML = `
            <span>✅ ${productName} added to cart!</span>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: var(--primary-color);
            color: white;
            padding: 12px 20px;
            border-radius: 6px;
            z-index: 1200;
            animation: slideInRight 0.3s ease;
            box-shadow: var(--shadow);
        `;

        document.body.appendChild(notification);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // Toggle cart sidebar
    toggleCartSidebar() {
        const cartSidebar = document.getElementById('cartSidebar');
        const cartOverlay = document.getElementById('cartOverlay');
        
        if (cartSidebar && cartOverlay) {
            const isActive = cartSidebar.classList.contains('active');
            
            if (!isActive) {
                this.refreshCartDisplay();
                cartSidebar.classList.add('active');
                cartOverlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            } else {
                this.closeCartSidebar();
            }
        }
    }

    // Close cart sidebar
    closeCartSidebar() {
        const cartSidebar = document.getElementById('cartSidebar');
        const cartOverlay = document.getElementById('cartOverlay');
        
        if (cartSidebar) cartSidebar.classList.remove('active');
        if (cartOverlay) cartOverlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    // Refresh cart display
    refreshCartDisplay() {
        const cartItemsContainer = document.getElementById('cartItems');
        const cartTotalElement = document.getElementById('cartTotal');
        const cartEmptyState = document.getElementById('cartEmptyState');
        const cartItemsState = document.getElementById('cartItemsState');
        
        if (!cartItemsContainer) return;

        const items = this.getCartItems();
        const total = this.getTotalPrice();

        // Show empty state or items
        if (items.length === 0) {
            if (cartEmptyState) cartEmptyState.style.display = 'block';
            if (cartItemsState) cartItemsState.style.display = 'none';
        } else {
            if (cartEmptyState) cartEmptyState.style.display = 'none';
            if (cartItemsState) cartItemsState.style.display = 'block';
            
            // Render cart items
            cartItemsContainer.innerHTML = items.map(item => `
                <div class="cart-item" data-product-id="${item.id}">
                    <div class="cart-item-image">
                        <img src="${item.image}" alt="${item.name}" loading="lazy">
                    </div>
                    <div class="cart-item-details">
                        <h4 class="cart-item-name">${item.name}</h4>
                        <div class="cart-item-price">Rs_${item.price.toLocaleString()}</div>
                        <div class="cart-item-quantity">
                            <button class="quantity-btn" onclick="cartSystem.updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                            <span class="quantity">${item.quantity}</span>
                            <button class="quantity-btn" onclick="cartSystem.updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                        </div>
                    </div>
                    <button class="cart-item-remove" onclick="cartSystem.removeItem(${item.id})">
                        🗑️
                    </button>
                </div>
            `).join('');
        }

        // Update total
        if (cartTotalElement) {
            cartTotalElement.textContent = `Rs_${total.toLocaleString()}`;
        }
    }

    // Clear cart
    clearCart() {
        this.cart = [];
        this.saveCart();
        this.updateCartCount();
        this.refreshCartDisplay();
    }

    // Setup event listeners
    setupEventListeners() {
        // Close cart with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeCartSidebar();
            }
        });

        // Close cart when clicking on overlay
        const cartOverlay = document.getElementById('cartOverlay');
        if (cartOverlay) {
            cartOverlay.addEventListener('click', () => {
                this.closeCartSidebar();
            });
        }
    }
}

// Initialize cart system
let cartSystem;

document.addEventListener('DOMContentLoaded', function() {
    cartSystem = new CartSystem();
    
    // Create cart sidebar and overlay if they don't exist
    if (!document.getElementById('cartSidebar')) {
        createCartSidebar();
    }
});

// Create cart sidebar HTML
function createCartSidebar() {
    const cartSidebar = document.createElement('div');
    cartSidebar.className = 'cart-sidebar';
    cartSidebar.id = 'cartSidebar';
    cartSidebar.innerHTML = `
        <div class="cart-header">
            <h3>Your Cart</h3>
            <button class="cart-close" id="closeCart">✕</button>
        </div>
        <div class="cart-content">
            <div class="cart-empty-state" id="cartEmptyState">
                <div class="empty-cart-icon">🛒</div>
                <p>Your cart is empty</p>
                <p>Add some products to get started!</p>
            </div>
            <div class="cart-items-state" id="cartItemsState">
                <div class="cart-items" id="cartItems">
                    <!-- Cart items loaded dynamically -->
                </div>
                <div class="cart-footer">
                    <div class="cart-total">
                        <strong>Total: </strong>
                        <span id="cartTotal">Rs_0</span>
                    </div>
                    <div class="cart-actions">
                        <button class="btn-secondary" onclick="cartSystem.clearCart()">Clear Cart</button>
                        <button class="btn-primary" onclick="proceedToCheckout()">Checkout</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    const cartOverlay = document.createElement('div');
    cartOverlay.className = 'cart-overlay';
    cartOverlay.id = 'cartOverlay';

    document.body.appendChild(cartSidebar);
    document.body.appendChild(cartOverlay);

    // Add event listener for close button
    const closeCartBtn = document.getElementById('closeCart');
    if (closeCartBtn) {
        closeCartBtn.addEventListener('click', () => {
            cartSystem.closeCartSidebar();
        });
    }
}

// Checkout function
function proceedToCheckout() {
    if (cartSystem.getTotalItems() === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    // Redirect to checkout page or show message
    alert('Proceeding to checkout! In a real implementation, this would redirect to a checkout page.');
    // window.location.href = 'checkout.html';
}

// Global function to add to cart (for use in product modals)
function addToCart(productId) {
    // This should be called from products.js
    // We'll integrate this in the products.js modification
}