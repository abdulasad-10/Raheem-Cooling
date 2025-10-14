// Products Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializeProductsPage();
});

// Global variables
let allProducts = [];
let filteredProducts = [];
let currentFilters = {
    types: [],
    brands: [],
    tonnage: [],
    colors: [],
    coverageArea: [],
    priceRange: { min: 0, max: 100000 }
};
let currentSort = 'featured';
let currentPage = 1;
const productsPerPage = 10;
let totalPages = 1;

// Initialize products page
function initializeProductsPage() {
    loadProductsData();
    setupEventListeners();
    setupMobileFilters();
}

// Load products and filters data
function loadProductsData() {
    Promise.all([
        fetch('data/products.json').then(r => r.json()),
        fetch('data/filters.json').then(r => r.json())
    ]).then(([products, filters]) => {
        allProducts = products;
        filteredProducts = [...products];
        
        renderFilters(filters);
        renderProducts();
        updateResultsCount();
        updateFilterCount();
    }).catch(error => {
        console.error('Error loading data:', error);
        showErrorState();
    });
}

// Render filter options
function renderFilters(filters) {
    renderFilterGroup('typeFilters', 'types', 'AC Type', filters.types);
    renderFilterGroup('brandFilters', 'brands', 'Brand', filters.brands);
    renderFilterGroup('tonnageFilters', 'tonnage', 'Tonnage', filters.tonnage);
    renderFilterGroup('colorFilters', 'colors', 'Color', filters.colors);
    renderFilterGroup('coverageFilters', 'coverageArea', 'Coverage Area', filters.coverageArea);
    renderPriceFilter(filters.priceRanges);
}

// Render individual filter group
function renderFilterGroup(containerId, filterKey, label, options) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = options.map(option => `
        <div class="filter-option">
            <input type="checkbox" id="${filterKey}-${option.replace(/\s+/g, '-').toLowerCase()}" 
                   value="${option}" data-filter="${filterKey}">
            <label for="${filterKey}-${option.replace(/\s+/g, '-').toLowerCase()}">
                ${getBrandIcon(option)} ${option}
                <span class="filter-count" id="count-${filterKey}-${option.replace(/\s+/g, '-').toLowerCase()}"></span>
            </label>
        </div>
    `).join('');

    // Add event listeners to new checkboxes
    container.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', handleFilterChange);
    });
}

// Get brand icons
function getBrandIcon(brandName) {
    const brandIcons = {
        'Rheem': '🏭',
        'Daikin': '❄️',
        'LG': '🔴',
        'Carrier': '🌬️',
        'Samsung': '🔵',
        'Voltas': '⚡',
        'Blue Star': '🔷',
        'Mitsubishi': '♦️',
        'Hitachi': '🔴',
        'Haier': '🏢',
        'Asad': '⭐'
    };
    return brandIcons[brandName] || '🏷️';
}

// Render price filter
function renderPriceFilter(priceRanges) {
    const container = document.getElementById('priceFilters');
    if (!container) return;

    container.innerHTML = `
        <div class="price-range">
            <div class="price-inputs">
                <div class="price-input">
                    <label for="minPrice">Min:</label>
                    <input type="number" id="minPrice" placeholder="0" min="0" max="100000">
                </div>
                <div class="price-input">
                    <label for="maxPrice">Max:</label>
                    <input type="number" id="maxPrice" placeholder="100000" min="0" max="100000">
                </div>
            </div>
            <div class="price-slider">
                <div class="progress" id="priceProgress"></div>
                <input type="range" class="range-input" id="priceMin" min="0" max="100000" value="0">
                <input type="range" class="range-input" id="priceMax" min="0" max="100000" value="100000">
            </div>
        </div>
    `;

    setupPriceRangeSlider();
}

// Setup price range slider functionality
function setupPriceRangeSlider() {
    const priceMin = document.getElementById('priceMin');
    const priceMax = document.getElementById('priceMax');
    const minPriceInput = document.getElementById('minPrice');
    const maxPriceInput = document.getElementById('maxPrice');
    const progress = document.getElementById('priceProgress');

    function updatePriceRange() {
        const minVal = parseInt(priceMin.value);
        const maxVal = parseInt(priceMax.value);
        
        // Update progress bar
        progress.style.left = (minVal / 100000) * 100 + '%';
        progress.style.right = 100 - (maxVal / 100000) * 100 + '%';
        
        // Update input fields
        minPriceInput.value = minVal;
        maxPriceInput.value = maxVal;
        
        // Update filters
        currentFilters.priceRange = { min: minVal, max: maxVal };
        applyFilters();
    }

    // Event listeners for range inputs
    priceMin.addEventListener('input', updatePriceRange);
    priceMax.addEventListener('input', updatePriceRange);

    // Event listeners for number inputs
    minPriceInput.addEventListener('change', function() {
        const value = Math.min(parseInt(this.value), parseInt(priceMax.value) - 1);
        priceMin.value = value;
        updatePriceRange();
    });

    maxPriceInput.addEventListener('change', function() {
        const value = Math.max(parseInt(this.value), parseInt(priceMin.value) + 1);
        priceMax.value = value;
        updatePriceRange();
    });

    // Initialize
    updatePriceRange();
}

// Handle filter changes
function handleFilterChange(e) {
    const filterType = e.target.dataset.filter;
    const value = e.target.value;
    const isChecked = e.target.checked;

    if (isChecked) {
        if (!currentFilters[filterType].includes(value)) {
            currentFilters[filterType].push(value);
        }
    } else {
        currentFilters[filterType] = currentFilters[filterType].filter(item => item !== value);
    }

    applyFilters();
}

// Apply all filters
function applyFilters() {
    filteredProducts = allProducts.filter(product => {
        // Type filter
        if (currentFilters.types.length > 0 && !currentFilters.types.includes(product.type)) {
            return false;
        }

        // Brand filter
        if (currentFilters.brands.length > 0 && !currentFilters.brands.includes(product.brand)) {
            return false;
        }

        // Tonnage filter
        if (currentFilters.tonnage.length > 0 && !currentFilters.tonnage.includes(product.tonnage)) {
            return false;
        }

        // Color filter
        if (currentFilters.colors.length > 0 && !currentFilters.colors.includes(product.color)) {
            return false;
        }

        // Coverage area filter
        if (currentFilters.coverageArea.length > 0 && !currentFilters.coverageArea.includes(product.coverageArea)) {
            return false;
        }

        // Price range filter
        if (product.price < currentFilters.priceRange.min || product.price > currentFilters.priceRange.max) {
            return false;
        }

        return true;
    });

    // Reset to first page when filters change
    currentPage = 1;
    
    sortProducts();
    renderProducts();
    updateResultsCount();
    updateFilterCount();
    updateMobileFilterButton();
}

// Sort products based on current sort option
function sortProducts() {
    switch (currentSort) {
        case 'name-asc':
            filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'name-desc':
            filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
            break;
        case 'price-asc':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'rating-desc':
            filteredProducts.sort((a, b) => b.rating - a.rating);
            break;
        default: // featured (original order)
            filteredProducts.sort((a, b) => a.id - b.id);
    }
}

// Render products grid with pagination
function renderProducts() {
    const grid = document.getElementById('productsGrid');
    const loadingState = document.getElementById('loadingState');
    const noResults = document.getElementById('noResults');
    const paginationContainer = document.getElementById('paginationContainer');

    if (!grid) return;

    // Calculate pagination
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const productsToShow = filteredProducts.slice(startIndex, endIndex);
    totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    // Show/hide states
    if (filteredProducts.length === 0) {
        grid.style.display = 'none';
        if (loadingState) loadingState.style.display = 'none';
        if (noResults) noResults.style.display = 'block';
        if (paginationContainer) paginationContainer.style.display = 'none';
        return;
    }

    grid.style.display = 'grid';
    if (loadingState) loadingState.style.display = 'none';
    if (noResults) noResults.style.display = 'none';
    if (paginationContainer) paginationContainer.style.display = 'flex';

    // Render only products for current page
    grid.innerHTML = productsToShow.map(product => `
        <div class="product-card" data-product-id="${product.id}">
            ${product.brand === 'Rheem' ? '<div class="brand-badge">🏭 Rheem</div>' : ''}
            ${product.brand === 'Daikin' ? '<div class="brand-badge">❄️ Daikin</div>' : ''}
            ${product.brand === 'LG' ? '<div class="brand-badge">🔴 LG</div>' : ''}
            ${product.brand === 'Samsung' ? '<div class="brand-badge">🔵 Samsung</div>' : ''}
            ${product.brand === 'Haier' ? '<div class="brand-badge">❄️ Haier</div>' : ''}
            <div class="product-badge">${product.type.toUpperCase()}</div>
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
            </div>
            <div class="product-info">
                <div class="product-category">${product.brand} • ${product.type}</div>
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
                        <span class="rating-value">${getDisplayRating(product.id, product.rating)}/5</span>
                    </div>
                </div>
                
                <button class="view-details" onclick="openProductModal(${product.id})">
                    View Details
                </button>
            </div>
        </div>
    `).join('');

    // Update pagination
    updatePagination();
}

// Update pagination
function updatePagination() {
    const paginationInfo = document.getElementById('paginationInfo');
    const paginationPages = document.getElementById('paginationPages');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    if (!paginationInfo || !paginationPages) return;

    // Update pagination info
    const startIndex = (currentPage - 1) * productsPerPage + 1;
    const endIndex = Math.min(currentPage * productsPerPage, filteredProducts.length);
    paginationInfo.textContent = `Showing ${startIndex}-${endIndex} of ${filteredProducts.length} products`;

    // Update buttons
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;

    // Generate page numbers
    let pagesHTML = '';
    
    // Always show first page
    pagesHTML += `<div class="pagination-page ${currentPage === 1 ? 'active' : ''}" data-page="1">1</div>`;
    
    // Show ellipsis if needed
    if (currentPage > 3) {
        pagesHTML += `<div class="pagination-page ellipsis">...</div>`;
    }
    
    // Show pages around current page
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        if (i !== 1 && i !== totalPages) {
            pagesHTML += `<div class="pagination-page ${currentPage === i ? 'active' : ''}" data-page="${i}">${i}</div>`;
        }
    }
    
    // Show ellipsis if needed
    if (currentPage < totalPages - 2) {
        pagesHTML += `<div class="pagination-page ellipsis">...</div>`;
    }
    
    // Always show last page if there is more than one page
    if (totalPages > 1) {
        pagesHTML += `<div class="pagination-page ${currentPage === totalPages ? 'active' : ''}" data-page="${totalPages}">${totalPages}</div>`;
    }
    
    paginationPages.innerHTML = pagesHTML;

    // Add event listeners to page numbers
    paginationPages.querySelectorAll('.pagination-page:not(.ellipsis)').forEach(page => {
        page.addEventListener('click', () => {
            currentPage = parseInt(page.dataset.page);
            renderProducts();
            scrollToProducts();
        });
    });
}

// Scroll to products function
function scrollToProducts() {
    const productsSection = document.querySelector('.products-section');
    if (productsSection) {
        productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Update results count
function updateResultsCount() {
    const countElement = document.getElementById('resultsCount');
    if (countElement) {
        countElement.textContent = `${filteredProducts.length} product${filteredProducts.length !== 1 ? 's' : ''} found`;
    }
}

// Update filter count display
function updateFilterCount() {
    const activeFilterCount = document.getElementById('activeFilterCount');
    let count = 0;

    // Count active filters
    Object.keys(currentFilters).forEach(key => {
        if (Array.isArray(currentFilters[key])) {
            count += currentFilters[key].length;
        } else if (key === 'priceRange' && 
                  (currentFilters[key].min > 0 || currentFilters[key].max < 100000)) {
            count += 1;
        }
    });

    if (activeFilterCount) {
        activeFilterCount.textContent = count;
        // Show/hide based on count
        if (count > 0) {
            activeFilterCount.style.display = 'inline-block';
        } else {
            activeFilterCount.style.display = 'none';
        }
    }
}

// Update mobile filter button
function updateMobileFilterButton() {
    const filterBadge = document.querySelector('.filter-badge');
    if (filterBadge) {
        let count = 0;
        Object.keys(currentFilters).forEach(key => {
            if (Array.isArray(currentFilters[key])) {
                count += currentFilters[key].length;
            }
        });
        filterBadge.textContent = count;
    }
}

// ==================== MOBILE FILTERS CODE ====================

// Setup mobile filters functionality
function setupMobileFilters() {
    createFiltersOverlay();
    setupMobileFilterToggle();
    setupMobileFilterClose();
    
    // Apply filters button for mobile
    const applyFiltersBtn = document.getElementById('applyFilters');
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', function() {
            applyFilters();
            closeMobileFilters();
        });
    }
}

// Create filters overlay
function createFiltersOverlay() {
    if (!document.getElementById('filtersOverlay')) {
        const overlay = document.createElement('div');
        overlay.className = 'filters-overlay';
        overlay.id = 'filtersOverlay';
        document.body.appendChild(overlay);
    }
}

// Setup mobile filter toggle button
function setupMobileFilterToggle() {
    const mobileFiltersToggle = document.getElementById('mobileFiltersToggle');
    const filtersToggle = document.querySelector('.filters-toggle-btn');
    const filtersSidebar = document.getElementById('filtersSidebar');
    const filtersOverlay = document.getElementById('filtersOverlay');

    // Use the mobile filters toggle container
    if (mobileFiltersToggle) {
        mobileFiltersToggle.addEventListener('click', function() {
            openMobileFilters();
        });
    }

    // Also use the filters toggle button if it exists
    if (filtersToggle) {
        filtersToggle.addEventListener('click', function() {
            openMobileFilters();
        });
    }

    // Also open filters when clicking on filter count on mobile
    const filterCount = document.querySelector('.filter-badge');
    if (filterCount) {
        filterCount.addEventListener('click', function(e) {
            e.stopPropagation();
            openMobileFilters();
        });
    }
}

// Setup mobile filter close functionality
function setupMobileFilterClose() {
    const closeFilters = document.getElementById('closeFilters');
    const filtersOverlay = document.getElementById('filtersOverlay');

    if (closeFilters) {
        closeFilters.addEventListener('click', closeMobileFilters);
    }

    if (filtersOverlay) {
        filtersOverlay.addEventListener('click', closeMobileFilters);
    }

    // Close with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeMobileFilters();
        }
    });
}

// Open mobile filters
function openMobileFilters() {
    const filtersSidebar = document.getElementById('filtersSidebar');
    const filtersOverlay = document.getElementById('filtersOverlay');

    if (filtersSidebar && filtersOverlay) {
        filtersSidebar.classList.add('active');
        filtersOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

// Close mobile filters
function closeMobileFilters() {
    const filtersSidebar = document.getElementById('filtersSidebar');
    const filtersOverlay = document.getElementById('filtersOverlay');

    if (filtersSidebar) {
        filtersSidebar.classList.remove('active');
    }
    if (filtersOverlay) {
        filtersOverlay.classList.remove('active');
    }
    document.body.style.overflow = 'auto';
}

// ==================== END MOBILE FILTERS CODE ====================

// Setup event listeners
function setupEventListeners() {
    // Sort select
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        sortSelect.addEventListener('change', function(e) {
            currentSort = e.target.value;
            applyFilters();
        });
    }

    // Clear filters
    const clearFilters = document.getElementById('clearFilters');
    if (clearFilters) {
        clearFilters.addEventListener('click', resetFilters);
    }

    // Reset filters (no results state)
    const resetFiltersBtn = document.getElementById('resetFilters');
    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', resetFilters);
    }

    // Modal close
    const modalClose = document.getElementById('modalClose');
    if (modalClose) {
        modalClose.addEventListener('click', function() {
            closeModal('productModal');
        });
    }

    // Pagination buttons
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                renderProducts();
                scrollToProducts();
            }
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (currentPage < totalPages) {
                currentPage++;
                renderProducts();
                scrollToProducts();
            }
        });
    }

    // Mobile filters apply button
    const applyFiltersBtn = document.getElementById('applyFilters');
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', function() {
            applyFilters();
            closeMobileFilters();
        });
    }
}

// Reset all filters
function resetFilters() {
    // Reset filter values
    currentFilters = {
        types: [],
        brands: [],
        tonnage: [],
        colors: [],
        coverageArea: [],
        priceRange: { min: 0, max: 100000 }
    };

    // Uncheck all checkboxes
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
    });

    // Reset price range
    const priceMin = document.getElementById('priceMin');
    const priceMax = document.getElementById('priceMax');
    const minPriceInput = document.getElementById('minPrice');
    const maxPriceInput = document.getElementById('maxPrice');
    
    if (priceMin && priceMax) {
        priceMin.value = 0;
        priceMax.value = 100000;
    }
    
    if (minPriceInput && maxPriceInput) {
        minPriceInput.value = '';
        maxPriceInput.value = '';
    }

    // Update price progress bar
    const progress = document.getElementById('priceProgress');
    if (progress) {
        progress.style.left = '0%';
        progress.style.right = '0%';
    }

    // Reset sort
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        sortSelect.value = 'featured';
    }
    currentSort = 'featured';

    // Reset to first page
    currentPage = 1;

    // Apply the reset
    filteredProducts = [...allProducts];
    sortProducts();
    renderProducts();
    updateResultsCount();
    updateFilterCount();
    updateMobileFilterButton();
    closeMobileFilters();
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

// Open product modal
function openProductModal(productId) {
    const product = allProducts.find(p => p.id === productId);
    if (!product) return;

    const modalBody = document.getElementById('modalBody');
    if (modalBody) {
        modalBody.innerHTML = `
            <div class="modal-product">
                <div class="modal-product-image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="modal-product-info">
                    <div class="modal-product-type">${product.type.toUpperCase()} AC • ${product.brand}</div>
                    <h2>${product.name}</h2>
                    <div class="modal-product-price">Rs_${product.price.toLocaleString()}</div>
                    
                     <!--<div class="modal-product-rating">
                         <span class="rating-stars">${getStarRating(product.rating)}</span>
                         <span class="rating-value">${product.rating}/5 Rating</span>
                     </div> -->
                    
                    <div class="rating-edit-section">
                           <label for="userRating">Your Rating:</label>
                      <select class="user-rating-select" id="userRating-${product.id}" onchange="updateUserRating(${product.id})">
        <option value="1" ${getUserRating(product.id) === 1 ? 'selected' : ''}>1 ★</option>
        <option value="2" ${getUserRating(product.id) === 2 ? 'selected' : ''}>2 ★★</option>
        <option value="3" ${getUserRating(product.id) === 3 ? 'selected' : ''}>3 ★★★</option>
        <option value="4" ${getUserRating(product.id) === 4 ? 'selected' : ''}>4 ★★★★</option>
        <option value="5" ${getUserRating(product.id) === 5 ? 'selected' : ''}>5 ★★★★★</option>
                     </select>
                   <span class="current-user-rating">${getUserRatingDisplay(product.id)}</span>
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
                        
                        <div class="modal-product-spec">
                            <span>Rating:</span>
                            <span>${getDisplayRating(product.id, product.rating)}/5 ${getStarRating(getDisplayRating(product.id, product.rating))}</span>
                        </div>
                    </div>
                    
                    <div class="modal-product-description">
                        <p>${product.description}</p>
                    </div>
                    
                    <div class="modal-actions">
                        <button class="add-to-cart" onclick="addToCart(${product.id})">Add to Cart</button>
                        <a href="contact.html" class="contact-about">Contact About Product</a>
                    </div>
                </div>
            </div>
        `;
    }

    openModal('productModal');
    closeMobileFilters();
}

// Modal functions
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Add to cart function - UPDATED
function addToCart(productId) {
    const product = allProducts.find(p => p.id === productId);
    if (!product) return;

    // Use the cart system if available
    if (typeof cartSystem !== 'undefined') {
        cartSystem.addItem(product);
    } else {
        // Fallback to localStorage
        let cart = JSON.parse(localStorage.getItem('raheemCoolingCart')) || [];
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
        
        localStorage.setItem('raheemCoolingCart', JSON.stringify(cart));
        showNotification('Product added to cart!');
        
        // Update cart count manually
        updateCartCountManual();
    }
}

// Manual cart count update (fallback)
function updateCartCountManual() {
    const cartCount = document.getElementById('cartCount');
    const cart = JSON.parse(localStorage.getItem('raheemCoolingCart')) || [];
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    
    if (cartCount) {
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

// Initialize manual cart count on load
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(updateCartCountManual, 1000);
});

// Show notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: var(--primary-color);
        color: white;
        padding: 15px 20px;
        border-radius: 4px;
        z-index: 1200;
        animation: slideIn 0.3s ease;
    `;

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

// Show error state
function showErrorState() {
    const grid = document.getElementById('productsGrid');
    const loadingState = document.getElementById('loadingState');
    
    if (grid) grid.style.display = 'none';
    if (loadingState) loadingState.style.display = 'none';
    
    // Show error message
    const noResults = document.getElementById('noResults');
    if (noResults) {
        noResults.innerHTML = `
            <h3>Unable to Load Products</h3>
            <p>Please check your connection and try again</p>
            <button class="btn-secondary" onclick="location.reload()">Retry</button>
        `;
        noResults.style.display = 'block';
    }
}

// Wait for products to be loaded (original function)
function waitForProducts() {
    return new Promise((resolve, reject) => {
        const maxWaitTime = 5000; // 5 seconds max
        const startTime = Date.now();
        
        function checkProducts() {
            const productCards = document.querySelectorAll('.product-card');
            
            // If we find product cards with actual content, resolve
            if (productCards.length > 0) {
                const firstCard = productCards[0];
                if (firstCard.querySelector('img') || firstCard.textContent.trim().length > 10) {
                    resolve();
                    return;
                }
            }
            
            // If timeout, reject
            if (Date.now() - startTime > maxWaitTime) {
                reject();
                return;
            }
            
            // Check again in 100ms
            setTimeout(checkProducts, 100);
        }
        
        checkProducts();
    });
}

// Hover effects (original function)
function initHoverEffects() {
    // Product cards hover - will work on dynamically loaded cards too
    document.addEventListener('mouseover', function(e) {
        const card = e.target.closest('.product-card');
        if (card) {
            gsap.to(card, { y: -5, duration: 0.3, ease: "power2.out" });
        }
    });
    
    document.addEventListener('mouseout', function(e) {
        const card = e.target.closest('.product-card');
        if (card) {
            gsap.to(card, { y: 0, duration: 0.3, ease: "power2.out" });
        }
    });

    // Buttons hover
    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            gsap.to(button, { scale: 1.05, duration: 0.2 });
        });
        button.addEventListener('mouseleave', () => {
            gsap.to(button, { scale: 1, duration: 0.2 });
        });
    });
}

// Navbar effect (original function)
function initNavbarEffect() {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                gsap.to(navbar, { 
                    backgroundColor: "rgba(255, 255, 255, 0.95)", 
                    duration: 0.3 
                });
            } else {
                gsap.to(navbar, { 
                    backgroundColor: "var(--white)", 
                    duration: 0.3 
                });
            }
        });
    }
}

// Add CSS for notifications and mobile filters
const additionalStyles = document.createElement('style');
additionalStyles.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    /* Mobile Filters Overlay */
    .filters-overlay {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        z-index: 1099;
    }
    
    .filters-overlay.active {
        display: block;
    }
    
    /* Mobile filter count */
    .filter-badge {
        background: var(--white);
        color: var(--primary-color);
        padding: 2px 8px;
        border-radius: 12px;
        font-size: 0.8rem;
        font-weight: 600;
    }
    
    /* Brand badges */
    .brand-badge {
        position: absolute;
        top: 12px;
        right: 12px;
        background: rgba(255, 255, 255, 0.95);
        color: var(--text-color);
        padding: 4px 8px;
        border-radius: 15px;
        font-size: 0.7rem;
        font-weight: 600;
        z-index: 2;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(0, 0, 0, 0.1);
    }
`;
document.head.appendChild(additionalStyles);

// Initialize hover effects after DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(initHoverEffects, 1000);
});

// For User Rating System

// ==================== USER RATING SYSTEM ====================

// Get user rating from localStorage
function getUserRating(productId) {
    const userRatings = JSON.parse(localStorage.getItem('userProductRatings') || '{}');
    return userRatings[`product-${productId}`];
}

// Get display rating (user rating if exists, otherwise original)
function getDisplayRating(productId, originalRating) {
    const userRating = getUserRating(productId);
    return userRating !== undefined ? userRating : originalRating;
}

// Get user rating display text
function getUserRatingDisplay(productId) {
    const userRating = getUserRating(productId);
    return userRating ? `(Your rating: ${userRating}/5)` : '(Rate this product)';
}

// Update user rating
function updateUserRating(productId) {
    const selectElement = document.getElementById(`userRating-${productId}`);
    const newRating = parseInt(selectElement.value);
    
    // Get existing user ratings
    const userRatings = JSON.parse(localStorage.getItem('userProductRatings') || '{}');
    
    // Update the rating
    userRatings[`product-${productId}`] = newRating;
    
    // Save back to localStorage
    localStorage.setItem('userProductRatings', JSON.stringify(userRatings));
    
    // Update display
    const displayElement = document.querySelector(`#userRating-${productId}`).closest('.rating-edit-section').querySelector('.current-user-rating');
    if (displayElement) {
        displayElement.textContent = getUserRatingDisplay(productId);
    }
    
    // Show confirmation
    showNotification(`Rating updated to ${newRating} stars!`);
}

// Clear all user ratings (optional utility function)
function clearAllUserRatings() {
    localStorage.removeItem('userProductRatings');
    showNotification('All your ratings have been cleared!');
    // Refresh current modal if open
    const modal = document.getElementById('productModal');
    if (modal.style.display === 'flex') {
        const productId = // you might need to track current product ID
        openProductModal(currentProductId); // you'll need to track this
    }
}