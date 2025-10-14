// Gallery Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializeGallery();
});

// Global variables
let galleryItems = [];
let filteredItems = [];
let currentFilter = 'all';
let currentPage = 1;
const itemsPerPage = 9;
let currentLightboxIndex = 0;

// Initialize gallery
function initializeGallery() {
    loadGalleryData();
    setupEventListeners();
}

// Load gallery data
function loadGalleryData() {
    // In a real application, this would come from an API or JSON file
    // For now, we'll use mock data
    galleryItems = generateMockGalleryData();
    filteredItems = [...galleryItems];
    
    renderGallery();
    setupFilterButtons();
}

// Generate mock gallery data
function generateMockGalleryData() {
    return [
        {
            id: 1,
            image: 'assets/images/gallery/img1.jpg',
            title: 'Modern Split AC Installation',
            description: 'Premium split AC installation in a contemporary living room with smart temperature control.',
            type: 'split',
            location: 'Residential',
            tags: ['split', 'residential', 'modern']
        },
        {
            id: 2,
            image: 'assets/images/gallery/img11.jpg',
            title: 'Office window AC System',
            description: 'Commercial window AC installation in a corporate office space with centralized control.',
            type: 'window',
            location: 'Commercial',
            tags: ['window', 'commercial', 'office']
        },
        {
            id: 3,
            image: 'assets/images/gallery/img.jpg',
            title: 'Compact Split AC Unit',
            description: 'Energy-efficient Split AC installation in a bedroom with quiet operation.',
            type: 'split',
            location: 'Residential',
            tags: ['split', 'residential', 'bedroom']
        },
        {
            id: 4,
            image: 'assets/images/gallery/img15.jpg',
            title: 'Bank Cassette AC Setup',
            description: 'cassette AC system installation for large living area with zoned cooling.',
            type: 'cassette',
            location: 'commercial',
            tags: ['cassete', 'commercial', 'large-space']
        },
        {
            id: 5,
            image: 'assets/images/gallery/img2.jpg',
            title: 'Gaming Cooling Solution',
            description: 'Gaming AC installation in a fine with discreet placement.',
            type: 'split',
            location: 'Commercial',
            tags: ['split', 'commercial', 'restaurant']
        },
        {
            id: 6,
            image: 'assets/images/gallery/img3.jpg',
            title: 'Study Room Split AC',
            description: 'Compact split AC unit perfect for study rooms and home offices.',
            type: 'split',
            location: 'Residential',
            tags: ['split', 'residential', 'study']
        },
        {
            id: 7,
            image: 'assets/images/gallery/img4.jpg',
            title: 'Luxury Villa AC System',
            description: 'Complete split AC system installation in a luxury villa with smart home integration.',
            type: 'split',
            location: 'Residential',
            tags: ['split', 'residential', 'luxury']
        },
        {
            id: 8,
            image: 'assets/images/gallery/img12.jpg',
            title: 'Black Window AC Setup',
            description: 'Window AC system installation for large living area with zoned cooling.',
            type: 'window',
            location: 'Residential',
            tags: ['window', 'residential', 'large-space']
        },
        {
            id: 9,
            image: 'assets/images/gallery/img5.jpg',
            title: 'Apartment Split AC',
            description: 'Space-saving split AC installation in a compact apartment setting.',
            type: 'split',
            location: 'Residential',
            tags: ['split', 'residential', 'apartment']
        },
        {
            id: 10,
            image: 'assets/images/gallery/img16.jpg',
            title: 'Apartment cassette AC',
            description: 'Space-saving cassette AC installation in a compact apartment setting.',
            type: 'cassette',
            location: 'commercial',
            tags: ['cassette', 'commercial', 'apartment']
        },
        {
            id: 11,
            image: 'assets/images/gallery/img6.jpg',
            title: 'Neo-Apartment Split AC',
            description: 'For Luxury split AC installation in a compact apartment setting.',
            type: 'split',
            location: 'Residential',
            tags: ['split', 'residential', 'apartment']
        },
        {
            id: 12,
            image: 'assets/images/gallery/img17.jpg',
            title: 'Black Cassette AC',
            description: 'Space-saving cassette AC installation in a compact apartment setting.',
            type: 'cassette',
            location: 'commercial',
            tags: ['cassette', 'commercial', 'apartment']
        },
        {
            id: 13,
            image: 'assets/images/gallery/img7.jpg',
            title: 'Premium Black Split AC',
            description: 'Pure Black split AC installation in a compact apartment setting.',
            type: 'split',
            location: 'Residential',
            tags: ['split', 'residential', 'apartment']
        },
        {
            id: 14,
            image: 'assets/images/gallery/img19.jpg',
            title: 'For Commercial window AC',
            description: 'Space-saving window AC installation in a compact apartment setting.',
            type: 'window',
            location: 'commercial',
            tags: ['window', 'commercial', 'Hotel']
        },
        {
            id: 15,
            image: 'assets/images/gallery/img8.jpg',
            title: 'For Comercial Split AC',
            description: 'For Commercial split AC installation in a compact apartment setting.',
            type: 'split',
            location: 'commercial',
            tags: ['split', 'commercial', 'apartment']
        },
        {
            id: 16,
            image: 'assets/images/gallery/img18.jpg',
            title: 'Brown cassette AC',
            description: 'Space-saving cassette AC installation in a compact apartment setting.',
            type: 'cassette',
            location: 'commercial',
            tags: ['cassette', 'commercial', 'apartment']
        }
        ,
        {
            id: 17,
            image: 'assets/images/gallery/img9.jpg',
            title: 'For Common use Split AC',
            description: 'For Common Purpuses Split Ac.',
            type: 'split',
            location: 'Residential',
            tags: ['split', 'residential', 'apartment']
        },
        {
            id: 18,
            image: 'assets/images/gallery/img10.jpg',
            title: 'Light Weight Split AC',
            description: 'Space-saving split AC installation in a compact apartment setting.',
            type: 'split',
            location: 'Residential',
            tags: ['split', 'residential', 'apartment']
        }
    ];
}

// Render gallery grid
function renderGallery() {
    const grid = document.getElementById('galleryGrid');
    const loadingState = document.getElementById('loadingState');
    
    if (!grid) return;

    // Hide loading state
    loadingState.style.display = 'none';

    // Calculate items to show
    const startIndex = 0;
    const endIndex = currentPage * itemsPerPage;
    const itemsToShow = filteredItems.slice(startIndex, endIndex);

    if (itemsToShow.length === 0) {
        grid.innerHTML = '<div class="no-items">No installations found matching your criteria.</div>';
        return;
    }

    // Render gallery items
    grid.innerHTML = itemsToShow.map(item => `
        <div class="gallery-item" data-item-id="${item.id}" data-filter="${item.tags.join(' ')}">
            <img src="${item.image}" alt="${item.title}" loading="lazy">
            <div class="gallery-item-overlay">
                <div class="gallery-item-info">
                    <span class="gallery-item-type">${item.type.toUpperCase()}</span>
                    <h3 class="gallery-item-title">${item.title}</h3>
                    <p class="gallery-item-location">${item.location}</p>
                </div>
            </div>
        </div>
    `).join('');

    // Add click event listeners to gallery items
    grid.querySelectorAll('.gallery-item').forEach((item, index) => {
        item.addEventListener('click', () => openLightbox(startIndex + index));
    });

    // Update load more button
    updateLoadMoreButton();
}

// Setup filter buttons
function setupFilterButtons() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active state
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Update current filter
            currentFilter = this.dataset.filter;
            currentPage = 1;
            
            // Apply filter
            applyFilter();
        });
    });
}

// Apply current filter
function applyFilter() {
    if (currentFilter === 'all') {
        filteredItems = [...galleryItems];
    } else {
        filteredItems = galleryItems.filter(item => 
            item.tags.includes(currentFilter) || 
            item.type === currentFilter || 
            item.location.toLowerCase() === currentFilter
        );
    }
    
    renderGallery();
}

// Update load more button
function updateLoadMoreButton() {
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (!loadMoreBtn) return;

    const totalItems = filteredItems.length;
    const displayedItems = Math.min(currentPage * itemsPerPage, totalItems);

    if (displayedItems >= totalItems) {
        loadMoreBtn.disabled = true;
        loadMoreBtn.textContent = 'All Installations Loaded';
    } else {
        loadMoreBtn.disabled = false;
        loadMoreBtn.textContent = `Load More (${displayedItems}/${totalItems})`;
    }
}

// Load more items
function loadMoreItems() {
    currentPage++;
    renderGallery();
}

// Open lightbox
function openLightbox(index) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxTitle = document.getElementById('lightboxTitle');
    const lightboxDescription = document.getElementById('lightboxDescription');
    const lightboxType = document.getElementById('lightboxType');
    const lightboxLocation = document.getElementById('lightboxLocation');

    if (index >= 0 && index < filteredItems.length) {
        const item = filteredItems[index];
        currentLightboxIndex = index;

        lightboxImage.src = item.image;
        lightboxImage.alt = item.title;
        lightboxTitle.textContent = item.title;
        lightboxDescription.textContent = item.description;
        lightboxType.textContent = item.type.toUpperCase();
        lightboxLocation.textContent = item.location;

        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

// Close lightbox
function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Navigate lightbox
function navigateLightbox(direction) {
    let newIndex = currentLightboxIndex + direction;
    
    if (newIndex < 0) {
        newIndex = filteredItems.length - 1;
    } else if (newIndex >= filteredItems.length) {
        newIndex = 0;
    }
    
    openLightbox(newIndex);
}

// Setup event listeners
function setupEventListeners() {
    // Load more button
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', loadMoreItems);
    }

    // Lightbox close
    const lightboxClose = document.getElementById('lightboxClose');
    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }

    // Lightbox navigation
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');
    
    if (lightboxPrev) {
        lightboxPrev.addEventListener('click', () => navigateLightbox(-1));
    }
    
    if (lightboxNext) {
        lightboxNext.addEventListener('click', () => navigateLightbox(1));
    }

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        const lightbox = document.getElementById('lightbox');
        if (!lightbox.classList.contains('active')) return;

        switch (e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowLeft':
                navigateLightbox(-1);
                break;
            case 'ArrowRight':
                navigateLightbox(1);
                break;
        }
    });

    // Close lightbox when clicking outside image
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }
}

// Initialize gallery when page loads
window.addEventListener('load', function() {
    // Simulate loading delay
    setTimeout(() => {
        const loadingState = document.getElementById('loadingState');
        if (loadingState) {
            loadingState.style.display = 'none';
        }
        renderGallery();
    }, 1000);
});