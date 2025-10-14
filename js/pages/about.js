// About Us Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializeAboutPage();
});

// Initialize about page
function initializeAboutPage() {
    setupAnimations();
    setupTeamHoverEffects();
}

// Setup scroll animations
function setupAnimations() {
    // Create Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const elementsToAnimate = document.querySelectorAll(
        '.story-content, .mv-card, .feature-card, .team-member, .cert-card'
    );
    
    elementsToAnimate.forEach(element => {
        element.classList.add('fade-in');
        observer.observe(element);
    });
}

// Setup team member hover effects
function setupTeamHoverEffects() {
    const teamMembers = document.querySelectorAll('.team-member');
    
    teamMembers.forEach(member => {
        member.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        member.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Add CSS for animations
const animationStyles = document.createElement('style');
animationStyles.textContent = `
    .fade-in {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s ease;
    }
    
    .fade-in.animate-in {
        opacity: 1;
        transform: translateY(0);
    }
    
    .team-member {
        transition: all 0.3s ease;
    }
    
    /* Staggered animation delays */
    .mv-card:nth-child(1) { transition-delay: 0.1s; }
    .mv-card:nth-child(2) { transition-delay: 0.2s; }
    .mv-card:nth-child(3) { transition-delay: 0.3s; }
    
    .feature-card:nth-child(1) { transition-delay: 0.1s; }
    .feature-card:nth-child(2) { transition-delay: 0.2s; }
    .feature-card:nth-child(3) { transition-delay: 0.3s; }
    .feature-card:nth-child(4) { transition-delay: 0.4s; }
    .feature-card:nth-child(5) { transition-delay: 0.5s; }
    .feature-card:nth-child(6) { transition-delay: 0.6s; }
`;
document.head.appendChild(animationStyles);