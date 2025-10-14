// Global variables
let visitorCount = 278;


// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all global functionality
    initNavbar();
    initVisitorCounter();
    initTicker();
    initBackToTop();
});
// Load animations utility
function loadAnimations() {
    const script = document.createElement('script');
    script.src = 'js/utils/animations.js';
    script.defer = true;
    document.head.appendChild(script);
}

// Call this in your DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    // ... your existing code ...
    loadAnimations();
});


// Navbar functionality
function initNavbar() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const dropdowns = document.querySelectorAll('.dropdown');

    // Hamburger menu toggle
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Close all dropdowns when menu opens/closes
            dropdowns.forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        });
    }

    // Dropdown functionality for both desktop and mobile
    dropdowns.forEach(dropdown => {
        const dropdownLink = dropdown.querySelector('.nav-link');
        const dropdownMenu = dropdown.querySelector('.dropdown-menu');
        // Add this inside initNavbar() function, after the existing dropdown code

// Account dropdown functionality
const accountDropdown = document.querySelector('.account-dropdown');
const accountBtn = document.getElementById('accountBtn');

if (accountBtn && accountDropdown) {
    // Mobile click functionality
    accountBtn.addEventListener('click', function(e) {
        if (window.innerWidth <= 992) {
            e.preventDefault();
            e.stopPropagation();
            accountDropdown.classList.toggle('active');
            
            // Close other dropdowns
            document.querySelectorAll('.dropdown').forEach(dropdown => {
                if (!dropdown.contains(accountDropdown)) {
                    dropdown.classList.remove('active');
                }
            });
        }
    });

    // Close account dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!accountDropdown.contains(e.target)) {
            accountDropdown.classList.remove('active');
        }
    });
}

// Cart button functionality
const cartBtn = document.getElementById('cartBtn');
if (cartBtn) {
    cartBtn.addEventListener('click', function() {
        if (typeof cartSystem !== 'undefined') {
            cartSystem.toggleCartSidebar();
        }
    });
}
        
        // Desktop: hover functionality
        dropdown.addEventListener('mouseenter', function() {
            if (window.innerWidth > 992) {
                this.classList.add('active');
            }
        });
        
        dropdown.addEventListener('mouseleave', function() {
            if (window.innerWidth > 992) {
                this.classList.remove('active');
            }
        });
        
        // Mobile: click functionality - FIXED
        dropdownLink.addEventListener('click', function(e) {
            if (window.innerWidth <= 992) {
                e.preventDefault();
                e.stopPropagation();
                
                // Toggle current dropdown
                dropdown.classList.toggle('active');
                
                // Close other dropdowns
                dropdowns.forEach(otherDropdown => {
                    if (otherDropdown !== dropdown) {
                        otherDropdown.classList.remove('active');
                    }
                });
            }
        });
    });

    // Close menu when clicking on a non-dropdown link
    const navLinks = document.querySelectorAll('.nav-link:not(.dropdown .nav-link)');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 992) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                
                // Close all dropdowns
                dropdowns.forEach(dropdown => {
                    dropdown.classList.remove('active');
                });
            }
        });
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 992) {
            const isClickInsideDropdown = e.target.closest('.dropdown');
            if (!isClickInsideDropdown) {
                dropdowns.forEach(dropdown => {
                    dropdown.classList.remove('active');
                });
            }
        }
    });

    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 992) {
            // Close mobile menu on resize to desktop
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            
            // Close all dropdowns
            dropdowns.forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        }
    });
}
//  Visitor Counter
function initVisitorCounter() {
    const visitorElement = document.getElementById('visitorCount');
    const mobileVisitorElement = document.querySelector('.mobile-visitor-count');
    
    // Load visitor count from localStorage and INCREASE it only on refresh
    const storedCount = localStorage.getItem('raheemCoolingVisitors');
    if (storedCount) {
        // Increase count ONLY when you refresh the page
        visitorCount = parseInt(storedCount) + 1;
    } else {
        // First time - set initial value
        visitorCount = 278;
    }
    
    // Always save the updated count
    localStorage.setItem('raheemCoolingVisitors', visitorCount.toString());
    
    // Update both visitor counters
    function updateVisitorDisplays() {
        if (visitorElement) {
            visitorElement.textContent = formatNumber(visitorCount);
        }
        if (mobileVisitorElement) {
            mobileVisitorElement.textContent = formatNumber(visitorCount);
        }
    }
    
    // Initial update
    updateVisitorDisplays();
    
    // Show/hide mobile visitor counter based on screen size
    function handleMobileVisitorDisplay() {
        const mobileCounter = document.querySelector('.mobile-visitor-counter');
        if (mobileCounter) {
            if (window.innerWidth <= 480) {
                mobileCounter.style.display = 'block';
            } else {
                mobileCounter.style.display = 'none';
            }
        }
    }
    
    // Initial check
    handleMobileVisitorDisplay();
    
    // Update on resize
    window.addEventListener('resize', handleMobileVisitorDisplay);
    
    // REMOVED AUTO-INCREMENT - No more setInterval
}










// Format number with commas
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Ticker functionality
function initTicker() {
    updateTicker();
    setInterval(updateTicker, 1000); // Update every second
}

function updateTicker() {
    const dateElement = document.getElementById('currentDate');
    const timeElement = document.getElementById('currentTime');
    const locationElement = document.getElementById('userLocation');
    
    // Update date and time
    const now = new Date();
    
    if (dateElement) {
        dateElement.textContent = now.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
    
    if (timeElement) {
        timeElement.textContent = now.toLocaleTimeString('en-US', {
            hour12: true,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    }
    
    // Update location (if not already set)
    if (locationElement && locationElement.textContent === 'Detecting location...') {
        getUserLocation();
    }
}

// Get user location
function getUserLocation() {
    const locationElement = document.getElementById('userLocation');
    
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function(position) {
                // In a real application, you would reverse geocode the coordinates
                // For this demo, we'll use a fallback to IP-based location
                getLocationFromIP();
            },
            function(error) {
                // If geolocation fails, use IP-based location
                getLocationFromIP();
            }
        );
    } else {
        // Geolocation not supported, use IP-based location
        getLocationFromIP();
    }
}

// Fallback to IP-based location
function getLocationFromIP() {
    const locationElement = document.getElementById('userLocation');
    
    // Remove the CORS API call and use a simple fallback
    if (locationElement) {
        // Use a simple fallback without API calls
        const cities = ['Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad'];
        const randomCity = cities[Math.floor(Math.random() * cities.length)];
        locationElement.textContent = `${randomCity}, Pakistan`;
    }
}

// Back to Top functionality
function initBackToTop() {
    const backToTopButton = document.getElementById('backToTop');
    
    if (backToTopButton) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopButton.classList.add('show');
            } else {
                backToTopButton.classList.remove('show');
            }
        });
        
        backToTopButton.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Modal functionality (global)
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Restore scrolling
    }
}

// Close modal when clicking outside
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
        e.target.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (modal.style.display === 'flex') {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }
});

// Product modal functionality
function openProductModal(productId) {
    // This would be implemented in products.js
    console.log('Opening product modal for ID:', productId);
}

// Clean up on page unload
window.addEventListener('beforeunload', function() {
    if (visitorInterval) {
        clearInterval(visitorInterval);
    }
});

// Import Footer JavaScript
function loadFooterScript() {
    const script = document.createElement('script');
    script.src = 'js/components/footer.js';
    script.defer = true;
    document.head.appendChild(script);
}

// Call this in your DOMContentLoaded event
document.addEventListener('DOMContentLoaded', function() {
    // ... your existing code ...
    loadFooterScript();
});