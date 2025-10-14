// Sitemap Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializeSitemap();
});

// Initialize sitemap page
function initializeSitemap() {
    setupQuickNavigation();
    setupSearchFunctionality();
    setupSmoothScrolling();
    setupSectionHighlights();
}

// Setup quick navigation functionality
function setupQuickNavigation() {
    const quickLinks = document.querySelectorAll('.quick-link');
    
    quickLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Add highlight effect
                targetSection.classList.add('highlight');
                setTimeout(() => {
                    targetSection.classList.remove('highlight');
                }, 2000);
            }
        });
    });
}

// Setup search functionality
function setupSearchFunctionality() {
    const searchInput = document.getElementById('siteSearch');
    
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchSite();
            }
        });
    }
}

// Search site function
function searchSite() {
    const searchTerm = document.getElementById('siteSearch').value.trim();
    
    if (!searchTerm) {
        showSearchMessage('Please enter a search term', 'error');
        return;
    }
    
    // Simple search implementation
    const searchableContent = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, a, li');
    let foundResults = false;
    
    searchableContent.forEach(element => {
        const text = element.textContent.toLowerCase();
        if (text.includes(searchTerm.toLowerCase())) {
            foundResults = true;
            // Scroll to first result
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
            
            // Highlight the element
            const originalBg = element.style.backgroundColor;
            element.style.backgroundColor = 'yellow';
            setTimeout(() => {
                element.style.backgroundColor = originalBg;
            }, 3000);
            
            return;
        }
    });
    
    if (!foundResults) {
        showSearchMessage('No results found for "' + searchTerm + '"', 'info');
    } else {
        showSearchMessage('Found results for "' + searchTerm + '"', 'success');
    }
}

// Show search message
function showSearchMessage(message, type) {
    // Remove existing message
    const existingMessage = document.querySelector('.search-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create new message
    const messageDiv = document.createElement('div');
    messageDiv.className = `search-message ${type}`;
    messageDiv.textContent = message;
    messageDiv.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 4px;
        z-index: 1200;
        animation: slideIn 0.3s ease;
        color: white;
        font-weight: 600;
    `;
    
    // Style based on type
    const styles = {
        error: { background: '#dc3545' },
        success: { background: '#28a745' },
        info: { background: var(--primary-color) }
    };
    
    Object.assign(messageDiv.style, styles[type]);
    
    document.body.appendChild(messageDiv);
    
    // Remove after 3 seconds
    setTimeout(() => {
        messageDiv.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.parentNode.removeChild(messageDiv);
            }
        }, 300);
    }, 3000);
}

// Setup smooth scrolling for anchor links
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Setup section highlights when navigating
function setupSectionHighlights() {
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active-section');
                
                // Update URL hash without scrolling
                const id = entry.target.getAttribute('id');
                if (id) {
                    history.replaceState(null, null, '#' + id);
                }
            }
        });
    }, { threshold: 0.5 });
    
    // Observe all sections
    document.querySelectorAll('.sitemap-section').forEach(section => {
        observer.observe(section);
    });
}

// Add CSS for animations
const sitemapStyles = document.createElement('style');
sitemapStyles.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .highlight {
        animation: highlightPulse 2s ease;
    }
    
    @keyframes highlightPulse {
        0% { background-color: transparent; }
        50% { background-color: rgba(0, 102, 204, 0.2); }
        100% { background-color: transparent; }
    }
    
    .active-section {
        border-left: 4px solid var(--primary-color);
        padding-left: 10px;
        transition: all 0.3s ease;
    }
`;
document.head.appendChild(sitemapStyles);