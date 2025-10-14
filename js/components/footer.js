// Footer JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializeFooter();
});

function initializeFooter() {
    setupNewsletter();
    setupQuickActions();
    updateCurrentYear();
}

// Newsletter functionality
function setupNewsletter() {
    const newsletterForm = document.getElementById('newsletterForm');
    const newsletterMessage = document.getElementById('newsletterMessage');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const submitBtn = this.querySelector('button[type="submit"]');
            const btnText = submitBtn.querySelector('span:first-child');
            const spinner = submitBtn.querySelector('.loading-spinner');
            
            const email = emailInput.value.trim();
            
            if (!validateEmail(email)) {
                showNewsletterMessage('Please enter a valid email address', 'error');
                return;
            }
            
            // Show loading state
            btnText.style.display = 'none';
            spinner.style.display = 'inline-block';
            submitBtn.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                // Save to localStorage for demo
                saveNewsletterSubscription(email);
                
                // Show success message
                showNewsletterMessage('Thank you for subscribing to our newsletter!', 'success');
                
                // Reset form
                newsletterForm.reset();
                
                // Reset button
                btnText.style.display = 'inline-block';
                spinner.style.display = 'none';
                submitBtn.disabled = false;
                
                // Hide message after 5 seconds
                setTimeout(() => {
                    newsletterMessage.style.display = 'none';
                }, 5000);
                
            }, 1500);
        });
    }
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function saveNewsletterSubscription(email) {
    let subscribers = JSON.parse(localStorage.getItem('newsletterSubscribers')) || [];
    if (!subscribers.includes(email)) {
        subscribers.push(email);
        localStorage.setItem('newsletterSubscribers', JSON.stringify(subscribers));
    }
}

function showNewsletterMessage(message, type) {
    const newsletterMessage = document.getElementById('newsletterMessage');
    if (newsletterMessage) {
        newsletterMessage.textContent = message;
        newsletterMessage.className = `newsletter-message ${type}`;
        newsletterMessage.style.display = 'block';
    }
}

// Quick actions functionality
function setupQuickActions() {
    // These functions will be called when quick action buttons are clicked
    window.scrollToTop = function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };
    
    window.openChat = function() {
        // In a real implementation, this would open a chat widget
        alert('Live chat feature coming soon! Our support team is available 24/7.');
    };
    
    window.callNow = function() {
        window.open('tel:+15551234567', '_self');
    };
    
    window.openMaps = function() {
        // In a real implementation, this would open maps with business location
        const address = encodeURIComponent('123 Cooling Street, Climate City, CC 12345');
        window.open(`https://www.google.com/maps/search/?api=1&query=${address}`, '_blank');
    };
}

// Update copyright year
function updateCurrentYear() {
    const yearElements = document.querySelectorAll('.copyright p');
    const currentYear = new Date().getFullYear();
    
    yearElements.forEach(element => {
        element.innerHTML = element.innerHTML.replace('2024', currentYear);
    });
}

// Social media links (optional enhancement)
function setupSocialLinks() {
    const socialLinks = {
        'facebook': 'https://facebook.com/raheemcooling',
        'twitter': 'https://twitter.com/raheemcooling',
        'instagram': 'https://instagram.com/raheemcooling',
        'linkedin': 'https://linkedin.com/company/raheemcooling',
        'youtube': 'https://youtube.com/raheemcooling'
    };
    
    // You can update the social links with actual URLs
    document.querySelectorAll('.social-link').forEach((link, index) => {
        const platforms = Object.keys(socialLinks);
        if (platforms[index]) {
            link.href = socialLinks[platforms[index]];
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
        }
    });
}

// Add scroll effect for footer
function setupFooterScroll() {
    const footer = document.querySelector('.footer');
    const quickActions = document.querySelector('.quick-actions');
    
    if (footer && quickActions) {
        window.addEventListener('scroll', function() {
            const footerRect = footer.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            
            // Show/hide quick actions based on scroll position
            if (footerRect.top < windowHeight) {
                quickActions.style.opacity = '0.5';
            } else {
                quickActions.style.opacity = '1';
            }
        });
    }
}

// Initialize when page loads
window.addEventListener('load', function() {
    initializeFooter();
    setupSocialLinks();
    setupFooterScroll();
});