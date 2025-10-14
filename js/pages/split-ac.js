// Split AC Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializeSplitACPage();
});

// Global variables for split AC page
let allProducts = [];
let filteredProducts = [];
let currentFilters = {
    brands: [],
    tonnage: [],
    colors: [],
   coverageArea: [],
    priceRange: { min: 0, max: 100000 }
};

// ADD PAGINATION VARIABLES HERE
let currentPage = 1;
const productsPerPage = 10;
let totalPages = 1;
   

function initializeSplitACPage() {
    loadSplitACProducts();
    setupEventListeners();
    setupMobileFilters();
}

function loadSplitACProducts() {
    fetch('data/products.json')
        .then(response => response.json())
        .then(products => {
            // Filter only split AC products
            allProducts = products.filter(product => product.type === 'split');
            filteredProducts = [...allProducts];
            
            renderProducts();
            updateResultsCount();
            setupFilterOptions();
        })
        .catch(error => {
            console.error('Error loading split AC products:', error);
            showErrorState();
        });
}

function setupFilterOptions() {
    // Get unique values for filters from split AC products only
    const brands = [...new Set(allProducts.map(p => p.brand))];
    const tonnage = [...new Set(allProducts.map(p => p.tonnage))];
    const colors = [...new Set(allProducts.map(p => p.color))];
    const coverageArea = [...new Set(allProducts.map(p => p.coverageArea))];

    setupCheckboxFilter('brandFilters', 'brands', brands);
    setupCheckboxFilter('tonnageFilters', 'tonnage', tonnage);
    setupCheckboxFilter('colorFilters', 'colors', colors);
    setupCheckboxFilter('coverageFilters', 'coverageArea', coverageArea);
    setupPriceFilter();
}

function setupCheckboxFilter(containerId, filterKey, options) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = options.map(option => `
        <div class="filter-option">
            <input type="checkbox" id="${filterKey}-${option.replace(/\s+/g, '-').toLowerCase()}" 
                   value="${option}" data-filter="${filterKey}">
            <label for="${filterKey}-${option.replace(/\s+/g, '-').toLowerCase()}">
                ${option}
            </label>
        </div>
    `).join('');

    container.querySelectorAll('input').forEach(checkbox => {
        checkbox.addEventListener('change', handleFilterChange);
    });
}

function setupPriceFilter() {
    const container = document.getElementById('priceFilters');
    if (!container) return;

    // Get min and max prices from split AC products
    const prices = allProducts.map(p => p.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    container.innerHTML = `
        <div class="price-range">
            <div class="price-inputs">
                <div class="price-input">
                    <label for="minPrice">Min:</label>
                    <input type="number" id="minPrice" placeholder="${minPrice}" min="0" max="${maxPrice}">
                </div>
                <div class="price-input">
                    <label for="maxPrice">Max:</label>
                    <input type="number" id="maxPrice" placeholder="${maxPrice}" min="0" max="${maxPrice}">
                </div>
            </div>
            <div class="price-slider">
                <div class="progress" id="priceProgress"></div>
                <input type="range" class="range-input" id="priceMin" min="0" max="${maxPrice}" value="${minPrice}">
                <input type="range" class="range-input" id="priceMax" min="0" max="${maxPrice}" value="${maxPrice}">
            </div>
        </div>
    `;

    setupPriceRangeSlider(minPrice, maxPrice);
}

function setupPriceRangeSlider(minPrice, maxPrice) {
    const priceMin = document.getElementById('priceMin');
    const priceMax = document.getElementById('priceMax');
    const minPriceInput = document.getElementById('minPrice');
    const maxPriceInput = document.getElementById('maxPrice');
    const progress = document.getElementById('priceProgress');

    function updatePriceRange() {
        const minVal = parseInt(priceMin.value);
        const maxVal = parseInt(priceMax.value);
        
        // Update progress bar
        progress.style.left = (minVal / maxPrice) * 100 + '%';
        progress.style.right = 100 - (maxVal / maxPrice) * 100 + '%';
        
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
        const value = Math.min(parseInt(this.value) || minPrice, parseInt(priceMax.value) - 1);
        priceMin.value = value;
        updatePriceRange();
    });

    maxPriceInput.addEventListener('change', function() {
        const value = Math.max(parseInt(this.value) || maxPrice, parseInt(priceMin.value) + 1);
        priceMax.value = value;
        updatePriceRange();
    });

    // Initialize
    updatePriceRange();
}

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

function applyFilters() {
    filteredProducts = allProducts.filter(product => {
        if (currentFilters.brands.length > 0 && !currentFilters.brands.includes(product.brand)) return false;
        if (currentFilters.tonnage.length > 0 && !currentFilters.tonnage.includes(product.tonnage)) return false;
        if (currentFilters.colors.length > 0 && !currentFilters.colors.includes(product.color)) return false;
        if (currentFilters.coverageArea.length > 0 && !currentFilters.coverageArea.includes(product.coverageArea)) return false;
        if (product.price < currentFilters.priceRange.min || product.price > currentFilters.priceRange.max) return false;
        
        return true;
    });

    // Apply sorting
    sortProducts();
    renderProducts();
    updateResultsCount();
    updateFilterCount();
}

function sortProducts() {
    const sortSelect = document.getElementById('sortSelect');
    const sortValue = sortSelect ? sortSelect.value : 'featured';

    switch (sortValue) {
        case 'price-asc':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'rating-desc':
            filteredProducts.sort((a, b) => b.rating - a.rating);
            break;
        case 'name-asc':
            filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
        default:
            // Featured - keep original order
            break;
    }
}

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
            <div class="product-badge">SPLIT AC</div>
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

function updateResultsCount() {
    const countElement = document.getElementById('resultsCount');
    if (countElement) {
        countElement.textContent = `${filteredProducts.length} split AC product${filteredProducts.length !== 1 ? 's' : ''} found`;
    }
}

function updateFilterCount() {
    const badge = document.getElementById('activeFilterCount');
    if (badge) {
        let count = 0;
        Object.values(currentFilters).forEach(filter => {
            if (Array.isArray(filter)) {
                count += filter.length;
            } else if (filter.min > 0 || filter.max < 100000) {
                count += 1;
            }
        });
        badge.textContent = count;
        badge.style.display = count > 0 ? 'inline-block' : 'none';
    }
}

// Mobile filters functionality (same as products.js)
function setupMobileFilters() {
    createFiltersOverlay();
    setupFilterToggle();
}

function createFiltersOverlay() {
    if (!document.getElementById('filtersOverlay')) {
        const overlay = document.createElement('div');
        overlay.className = 'filters-overlay';
        overlay.id = 'filtersOverlay';
        document.body.appendChild(overlay);
    }
}

function setupFilterToggle() {
    const toggleBtn = document.querySelector('.filters-toggle-btn');
    const filtersSidebar = document.getElementById('filtersSidebar');
    const closeBtn = document.getElementById('closeFilters');
    const applyBtn = document.getElementById('applyFilters');
    const overlay = document.getElementById('filtersOverlay');

    if (toggleBtn) {
        toggleBtn.addEventListener('click', openFilters);
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', closeFilters);
    }

    if (applyBtn) {
        applyBtn.addEventListener('click', closeFilters);
    }

    if (overlay) {
        overlay.addEventListener('click', closeFilters);
    }

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closeFilters();
    });
}

function openFilters() {
    const filtersSidebar = document.getElementById('filtersSidebar');
    const overlay = document.getElementById('filtersOverlay');
    
    if (filtersSidebar) filtersSidebar.classList.add('active');
    if (overlay) overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeFilters() {
    const filtersSidebar = document.getElementById('filtersSidebar');
    const overlay = document.getElementById('filtersOverlay');
    
    if (filtersSidebar) filtersSidebar.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Product modal function
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
                    <div class="modal-product-type">SPLIT AC • ${product.brand}</div>
                    <h2>${product.name}</h2>
                    <div class="modal-product-price">Rs_${product.price.toLocaleString()}</div>
                                <!-- ADD THIS NEW SECTION -->
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
                            <span>Rating:</span>
                            <span>${product.rating}/5 ${getStarRating(product.rating)}</span>
                        </div>
                    </div>
                    
                    <div class="modal-product-description">
                        <p>${product.description || 'Premium split AC system with advanced features and energy-efficient operation.'}</p>
                    </div>
                    
                    <div class="modal-actions">
                        <button class="add-to-cart" onclick="addToCart(${product.id})">Add to Cart</button>
                        <a href="contact.html?product=${product.id}" class="contact-about">Contact About Product</a>
                    </div>
                </div>
            </div>
        `;
    }

    // Open modal (you need to implement this function)
    document.getElementById('productModal').style.display = 'flex';
    document.body.style.overflow = 'hidden';
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

// Star rating function
function getStarRating(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    
    return '★'.repeat(fullStars) + (halfStar ? '½' : '') + '☆'.repeat(emptyStars);
}

// Setup event listeners
function setupEventListeners() {
    // Sort functionality
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            applyFilters();
        });
    }

    // Clear filters
    const clearBtn = document.getElementById('clearFilters');
    const resetBtn = document.getElementById('resetFilters');
    
    if (clearBtn) {
        clearBtn.addEventListener('click', resetFilters);
    }
    if (resetBtn) {
        resetBtn.addEventListener('click', resetFilters);
    }

    // Modal close
    const modalClose = document.getElementById('modalClose');
    if (modalClose) {
        modalClose.addEventListener('click', function() {
            document.getElementById('productModal').style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }
}

function resetFilters() {
    currentFilters = {
        brands: [],
        tonnage: [],
        colors: [],
        coverageArea: [],
        priceRange: { min: 0, max: 100000 }
    };
    
    document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
    
    // Reset price range to actual product prices
    const prices = allProducts.map(p => p.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    
    // Reset sliders
    const priceMin = document.getElementById('priceMin');
    const priceMax = document.getElementById('priceMax');
    const minPriceInput = document.getElementById('minPrice');
    const maxPriceInput = document.getElementById('maxPrice');
    
    if (priceMin && priceMax && minPriceInput && maxPriceInput) {
        priceMin.value = minPrice;
        priceMax.value = maxPrice;
        minPriceInput.value = '';
        maxPriceInput.value = '';
        
        // Update progress bar
        const progress = document.getElementById('priceProgress');
        if (progress) {
            progress.style.left = (minPrice / maxPrice) * 100 + '%';
            progress.style.right = 100 - (maxPrice / maxPrice) * 100 + '%';
        }
    }
    
    // Reset to first page
    currentPage = 1;
    
    applyFilters();
    closeFilters();
}

function showErrorState() {
    const grid = document.getElementById('productsGrid');
    const loadingState = document.getElementById('loadingState');
    
    if (grid) grid.style.display = 'none';
    if (loadingState) loadingState.style.display = 'none';
    
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


// Extra

function setupFilterOptions() {
    fetch('data/filters.json')
        .then(response => response.json())
        .then(filters => {
            // Get brands that actually have products in this category
            const availableBrands = [...new Set(allProducts.map(p => p.brand))];
            const availableTonnage = [...new Set(allProducts.map(p => p.tonnage))];
            const availableColors = [...new Set(allProducts.map(p => p.color))];
            const availableCoverage = [...new Set(allProducts.map(p => p.coverageArea))];

            // Only show brands that have products in this category
            const filteredBrands = filters.brands.filter(brand => 
                availableBrands.includes(brand)
            );

            setupCheckboxFilter('brandFilters', 'brands', filteredBrands);
            setupCheckboxFilter('tonnageFilters', 'tonnage', availableTonnage);
            setupCheckboxFilter('colorFilters', 'colors', availableColors);
            setupCheckboxFilter('coverageFilters', 'coverageArea', availableCoverage);
            setupPriceFilter(); // This now uses the slider version
        })
        .catch(error => {
            console.error('Error loading filters:', error);
            // Fallback to available products data
            const availableBrands = [...new Set(allProducts.map(p => p.brand))];
            const availableTonnage = [...new Set(allProducts.map(p => p.tonnage))];
            const availableColors = [...new Set(allProducts.map(p => p.color))];
            const availableCoverage = [...new Set(allProducts.map(p => p.coverageArea))];

            setupCheckboxFilter('brandFilters', 'brands', availableBrands);
            setupCheckboxFilter('tonnageFilters', 'tonnage', availableTonnage);
            setupCheckboxFilter('colorFilters', 'colors', availableColors);
            setupCheckboxFilter('coverageFilters', 'coverageArea', availableCoverage);
            setupPriceFilter(); // This now uses the slider version
        });
}

// For Pagination
// Pagination functions
function updatePagination() {
    const paginationInfo = document.getElementById('paginationInfo');
    const paginationPages = document.getElementById('paginationPages');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    if (!paginationInfo || !paginationPages) return;

    // Update pagination info
    const startIndex = (currentPage - 1) * productsPerPage + 1;
    const endIndex = Math.min(currentPage * productsPerPage, filteredProducts.length);
    paginationInfo.textContent = `Showing ${startIndex}-${endIndex} of ${filteredProducts.length} split AC products`;

    // Update buttons
    if (prevBtn) prevBtn.disabled = currentPage === 1;
    if (nextBtn) nextBtn.disabled = currentPage === totalPages;

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

function scrollToProducts() {
    const productsSection = document.querySelector('.products-section');
    if (productsSection) {
        productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Update the applyFilters function to reset to page 1
function applyFilters() {
    filteredProducts = allProducts.filter(product => {
        if (currentFilters.brands.length > 0 && !currentFilters.brands.includes(product.brand)) return false;
        if (currentFilters.tonnage.length > 0 && !currentFilters.tonnage.includes(product.tonnage)) return false;
        if (currentFilters.colors.length > 0 && !currentFilters.colors.includes(product.color)) return false;
        if (currentFilters.coverageArea.length > 0 && !currentFilters.coverageArea.includes(product.coverageArea)) return false;
        if (product.price < currentFilters.priceRange.min || product.price > currentFilters.priceRange.max) return false;
        
        return true;
    });

    // Reset to first page when filters change
    currentPage = 1;

    // Apply sorting
    sortProducts();
    renderProducts();
    updateResultsCount();
    updateFilterCount();
}

// Update resetFilters to reset pagination
function resetFilters() {
    currentFilters = {
        brands: [],
        tonnage: [],
        colors: [],
        coverageArea: [],
        priceRange: { min: 0, max: 100000 }
    };
    
    document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
    
    const prices = allProducts.map(p => p.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    
    document.getElementById('minPrice').value = minPrice;
    document.getElementById('maxPrice').value = maxPrice;
    
    // Reset to first page
    currentPage = 1;
    
    applyFilters();
    closeFilters();
}

// Add pagination event listeners to setupEventListeners
function setupEventListeners() {
    // Sort functionality
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            applyFilters();
        });
    }

    // Clear filters
    const clearBtn = document.getElementById('clearFilters');
    const resetBtn = document.getElementById('resetFilters');
    
    if (clearBtn) {
        clearBtn.addEventListener('click', resetFilters);
    }
    if (resetBtn) {
        resetBtn.addEventListener('click', resetFilters);
    }

    // Modal close
    const modalClose = document.getElementById('modalClose');
    if (modalClose) {
        modalClose.addEventListener('click', function() {
            document.getElementById('productModal').style.display = 'none';
            document.body.style.overflow = 'auto';
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
}

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

// Show notification function for split-ac.js
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