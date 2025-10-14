// Home page specific functionality
document.addEventListener('DOMContentLoaded', function() {
    initCarousel();
    loadAllHomeSections();
    setupModalFunctionality();
});

// Hero Carousel
function initCarousel() {
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.dot');
    const prevButton = document.getElementById('carouselPrev');
    const nextButton = document.getElementById('carouselNext');
    
    let currentSlide = 0;
    let slideInterval;
    
    function showSlide(n) {
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        currentSlide = (n + slides.length) % slides.length;
        slides[currentSlide].classList.add('active');
        if (dots[currentSlide]) {
            dots[currentSlide].classList.add('active');
        }
    }
    
    function nextSlide() {
        showSlide(currentSlide + 1);
    }
    
    function prevSlide() {
        showSlide(currentSlide - 1);
    }
    
    function startAutoplay() {
        slideInterval = setInterval(nextSlide, 5000);
    }
    
    function stopAutoplay() {
        clearInterval(slideInterval);
    }
    
    if (prevButton) {
        prevButton.addEventListener('click', function() {
            stopAutoplay();
            prevSlide();
            startAutoplay();
        });
    }
    
    if (nextButton) {
        nextButton.addEventListener('click', function() {
            stopAutoplay();
            nextSlide();
            startAutoplay();
        });
    }
    
    dots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            stopAutoplay();
            showSlide(index);
            startAutoplay();
        });
    });
    
    const carousel = document.querySelector('.hero-carousel');
    if (carousel) {
        carousel.addEventListener('mouseenter', stopAutoplay);
        carousel.addEventListener('mouseleave', startAutoplay);
    }
    
    startAutoplay();
}

// Load all home page sections
function loadAllHomeSections() {
    fetch('data/products.json')
        .then(response => response.json())
        .then(products => {
            // Load featured products (6 random)
            loadFeaturedProducts(products);
            
            // Load top selling products (6 highest rated)
            loadTopSellingProducts(products);
            
            // Load split AC products (3 random split AC)
            loadSplitAcProducts(products);
            
            // Load window AC products (3 random window AC)
            loadWindowAcProducts(products);
            
            // Load cassette AC products (3 random cassette AC)
            loadCassetteAcProducts(products);
        })
        .catch(error => {
            console.error('Error loading products:', error);
            showErrorInAllSections();
        });
}

// Load featured products (6 random)
function loadFeaturedProducts(products) {
    const featuredProductsContainer = document.getElementById('featuredProducts');
    if (!featuredProductsContainer) return;

    const featuredProducts = getRandomProducts(products, 6);
    renderProductSection(featuredProducts, featuredProductsContainer);
}

// Load top selling products (6 highest rated)
function loadTopSellingProducts(products) {
    const topSellingContainer = document.getElementById('topSellingProducts');
    if (!topSellingContainer) return;

    // Sort by rating (highest first) and take top 6
    const topSellingProducts = [...products]
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 6);
    
    renderProductSection(topSellingProducts, topSellingContainer);
}

// Load split AC products (3 random split AC)
function loadSplitAcProducts(products) {
    const splitAcContainer = document.getElementById('splitAcProducts');
    if (!splitAcContainer) return;

    const splitProducts = products.filter(product => product.type === 'split');
    const randomSplitProducts = getRandomProducts(splitProducts, 3);
    renderProductSection(randomSplitProducts, splitAcContainer);
}

// Load window AC products (3 random window AC)
function loadWindowAcProducts(products) {
    const windowAcContainer = document.getElementById('windowAcProducts');
    if (!windowAcContainer) return;

    const windowProducts = products.filter(product => product.type === 'window');
    const randomWindowProducts = getRandomProducts(windowProducts, 3);
    renderProductSection(randomWindowProducts, windowAcContainer);
}

// Load cassette AC products (3 random cassette AC)
function loadCassetteAcProducts(products) {
    const cassetteAcContainer = document.getElementById('cassetteAcProducts');
    if (!cassetteAcContainer) return;

    const cassetteProducts = products.filter(product => product.type === 'cassette');
    const randomCassetteProducts = getRandomProducts(cassetteProducts, 3);
    renderProductSection(randomCassetteProducts, cassetteAcContainer);
}

// Get random products
function getRandomProducts(products, count) {
    if (products.length <= count) {
        return products;
    }
    
    const shuffled = [...products].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

// Render product section
function renderProductSection(products, container) {
    if (products.length === 0) {
        container.innerHTML = '<p class="no-products">No products available in this category.</p>';
        return;
    }

    container.innerHTML = products.map(product => `
        <div class="product-card" data-product-id="${product.id}">
            <div class="product-badge">${product.type.toUpperCase()}</div>
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
            </div>
            <div class="product-info">
                <div class="product-category">${product.brand}</div>
                <h3 class="product-name">${product.name}</h3>
                
                <div class="product-specs">
                    <div class="product-spec">
                        <span class="spec-icon">⚖️</span>
                        <span>${product.tonnage}</span>
                    </div>
                    <div class="product-spec">
                        <span class="spec-icon">📐</span>
                        <span>${product.coverageArea}</span>
                    </div>
                    <div class="product-spec">
                        <span class="spec-icon">🎨</span>
                        <span>${product.color}</span>
                    </div>
                </div>
                
                <div class="product-price-rating">
                    <div class="product-price">Rs_${product.price.toLocaleString()}</div>
                    <div class="product-rating">
                        <span class="rating-stars">${getStarRating(product.rating)}</span>
                        <span class="rating-value">${product.rating}/5</span>
                    </div>
                </div>
                
                <button class="view-details" onclick="openProductModal(${product.id})">
                    View Details
                </button>
            </div>
        </div>
    `).join('');
}

// Show error in all sections
function showErrorInAllSections() {
    const sections = [
        'featuredProducts',
        'topSellingProducts', 
        'splitAcProducts',
        'windowAcProducts',
        'cassetteAcProducts'
    ];
    
    sections.forEach(sectionId => {
        const container = document.getElementById(sectionId);
        if (container) {
            container.innerHTML = '<p class="error-message">Unable to load products. Please try again later.</p>';
        }
    });
}

// Generate star rating HTML
function getStarRating(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    
    let stars = '';
    
    // Full stars
    for (let i = 0; i < fullStars; i++) {
        stars += '★';
    }
    
    // Half star
    if (halfStar) {
        stars += '½';
    }
    
    // Empty stars
    for (let i = 0; i < emptyStars; i++) {
        stars += '☆';
    }
    
    return stars;
}

// Setup modal functionality
function setupModalFunctionality() {
    // Create modal element if it doesn't exist
    if (!document.getElementById('productModal')) {
        createModalElement();
    }
    
    // Add event listeners for modal
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            closeProductModal();
        }
    });
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeProductModal();
        }
    });
}

// Create modal element
function createModalElement() {
    const modalHTML = `
        <div class="modal" id="productModal" style="display: none;">
            <div class="modal-content">
                <button class="modal-close" onclick="closeProductModal()">&times;</button>
                <div class="modal-body" id="modalBody">
                    <!-- Product details loaded dynamically -->
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

// Open product modal - This function should be globally available
window.openProductModal = function(productId) {
    fetch('data/products.json')
        .then(response => response.json())
        .then(products => {
            const product = products.find(p => p.id === productId);
            if (!product) {
                console.error('Product not found:', productId);
                return;
            }

            const modalBody = document.getElementById('modalBody');
            const modal = document.getElementById('productModal');
            
            if (modalBody && modal) {
                modalBody.innerHTML = `
                    <div class="modal-product">
                        <div class="modal-product-image">
                            <img src="${product.image}" alt="${product.name}">
                        </div>
                        <div class="modal-product-info">
                            <div class="modal-product-type">${product.type.toUpperCase()} AC • ${product.brand}</div>
                            <h2>${product.name}</h2>
                            <div class="modal-product-price">Rs_${product.price.toLocaleString()}</div>
                            
                            <div class="modal-product-rating">
                                <span class="rating-stars">${getStarRating(product.rating)}</span>
                                <span class="rating-value">${product.rating}/5 Rating</span>
                            </div>
                            
                            <div class="modal-product-specs">
                                <div class="modal-product-spec">
                                    <span>Tonnage:</span>
                                    <span>${product.tonnage}</span>
                                </div>
                                <div class="modal-product-spec">
                                    <span>Coverage Area:</span>
                                    <span>${product.coverageArea}</span>
                                </div>
                                <div class="modal-product-spec">
                                    <span>Color:</span>
                                    <span>${product.color}</span>
                                </div>
                                <div class="modal-product-spec">
                                    <span>Type:</span>
                                    <span>${product.type.charAt(0).toUpperCase() + product.type.slice(1)} AC</span>
                                </div>
                            </div>
                            
                            <div class="modal-product-description">
                                <p>${product.description || 'Premium AC system with advanced features and energy-efficient operation.'}</p>
                            </div>
                            
                            <div class="modal-actions">
                                <button class="add-to-cart" onclick="addToCart(${product.id})">Add to Cart</button>
                                <a href="contact.html?product=${product.id}" class="contact-about">Contact About Product</a>
                            </div>
                        </div>
                    </div>
                `;

                // Show modal
                modal.style.display = 'flex';
                document.body.style.overflow = 'hidden';
            }
        })
        .catch(error => {
            console.error('Error loading product details:', error);
            alert('Unable to load product details. Please try again.');
        });
};

// Close product modal - This function should be globally available
window.closeProductModal = function() {
    const modal = document.getElementById('productModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
};

// Add to cart function - This function should be globally available
window.addToCart = function(productId) {
    fetch('data/products.json')
        .then(response => response.json())
        .then(products => {
            const product = products.find(p => p.id === productId);
            if (!product) return;

            // Get existing cart or initialize empty array
            let cart = JSON.parse(localStorage.getItem('raheemCoolingCart')) || [];
            
            // Check if product already in cart
            const existingItem = cart.find(item => item.id === productId);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    quantity: 1
                });
            }
            
            // Save back to localStorage
            localStorage.setItem('raheemCoolingCart', JSON.stringify(cart));
            
            // Show confirmation
            showNotification('Product added to cart!');
            
            // Close modal after adding to cart
            closeProductModal();
        })
        .catch(error => {
            console.error('Error adding to cart:', error);
            showNotification('Error adding product to cart. Please try again.', 'error');
        });
};

// Show notification
function showNotification(message, type = 'success') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Style based on type
    const styles = {
        success: {
            background: 'var(--primary-color)',
            color: 'white'
        },
        error: {
            background: '#dc3545',
            color: 'white'
        }
    };
    
    Object.assign(notification.style, {
        position: 'fixed',
        top: '100px',
        right: '20px',
        padding: '15px 20px',
        borderRadius: '4px',
        zIndex: '1200',
        animation: 'slideIn 0.3s ease',
        fontWeight: '600',
        ...styles[type]
    });

    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Add CSS for animations and styles
const homeStyles = document.createElement('style');
homeStyles.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .no-products, .error-message {
        text-align: center;
        padding: 40px;
        color: var(--light-text);
        font-style: italic;
        grid-column: 1 / -1;
    }
    
    .error-message {
        color: #dc3545;
    }
    
    /* Modal styles */
    .modal {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.7);
        z-index: 1100;
        justify-content: center;
        align-items: center;
    }
    
    .modal-content {
        background-color: var(--white);
        border-radius: 8px;
        max-width: 800px;
        width: 90%;
        max-height: 90vh;
        overflow-y: auto;
        position: relative;
        animation: modalFadeIn 0.3s;
    }
    
    @keyframes modalFadeIn {
        from { opacity: 0; transform: scale(0.9); }
        to { opacity: 1; transform: scale(1); }
    }
    
    .modal-close {
        position: absolute;
        top: 15px;
        right: 15px;
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: var(--text-color);
        z-index: 1;
    }
    
    .modal-body {
        padding: 30px;
    }
    
    .modal-product {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 30px;
    }
    
    .modal-product-image {
        border-radius: 8px;
        overflow: hidden;
    }
    
    .modal-product-image img {
        width: 100%;
        height: auto;
        display: block;
    }
    
    .modal-product-info h2 {
        margin-top: 0;
        color: var(--secondary-color);
    }
    
    .modal-product-type {
        color: var(--primary-color);
        text-transform: uppercase;
        font-weight: 600;
        font-size: 0.9rem;
        margin-bottom: 10px;
    }
    
    .modal-product-price {
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--primary-color);
        margin: 15px 0;
    }
    
    .modal-product-specs {
        margin: 20px 0;
    }
    
    .modal-product-spec {
        display: flex;
        justify-content: space-between;
        padding: 8px 0;
        border-bottom: 1px solid var(--border-color);
    }
    
    .modal-product-spec:last-child {
        border-bottom: none;
    }
    
    .modal-product-spec span:first-child {
        font-weight: 600;
    }
    
    .modal-product-description {
        margin: 20px 0;
        line-height: 1.6;
    }
    
    .modal-actions {
        display: flex;
        gap: 15px;
        margin-top: 25px;
    }
    
    .add-to-cart {
        flex: 1;
        padding: 12px;
        background: var(--primary-color);
        color: var(--white);
        border: none;
        border-radius: 4px;
        font-weight: 600;
        cursor: pointer;
        transition: var(--transition);
    }
    
    .add-to-cart:hover {
        background: var(--secondary-color);
    }
    
    .contact-about {
        padding: 12px;
        background: transparent;
        color: var(--primary-color);
        border: 2px solid var(--primary-color);
        border-radius: 4px;
        font-weight: 600;
        cursor: pointer;
        transition: var(--transition);
        text-decoration: none;
        text-align: center;
    }
    
    .contact-about:hover {
        background: var(--primary-color);
        color: var(--white);
    }
    
    @media (max-width: 768px) {
        .modal-product {
            grid-template-columns: 1fr;
            gap: 20px;
        }
        
        .modal-actions {
            flex-direction: column;
        }
    }
`;
document.head.appendChild(homeStyles);