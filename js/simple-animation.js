// SIMPLE ANIMATIONS - INSTANT LOADING (FIXED VERSION)
document.addEventListener('DOMContentLoaded', function() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.log('GSAP not loaded - animations disabled');
        return;
    }

    gsap.registerPlugin(ScrollTrigger);
    
    // 1. PAGE LOAD FADE IN (IMMEDIATE)
    gsap.from('body', { 
        opacity: 0, 
        duration: 0.8, 
        ease: "power2.out" 
    });

    // 2. ANIMATE SECTIONS (IMMEDIATE - NO WAITING)
    gsap.utils.toArray('section').forEach(section => {
        gsap.from(section, {
            y: 30,
            opacity: 0,
            duration: 0.6,
            ease: "power2.out",
            scrollTrigger: {
                trigger: section,
                start: "top 90%",
                toggleActions: "play none none none",
                once: true
            }
        });
    });

    // 3. ANIMATE PRODUCT CARDS IMMEDIATELY (NO WAITING)
    function animateProductCardsImmediately() {
        const productGrids = document.querySelectorAll('.products-grid');
        
        productGrids.forEach(grid => {
            gsap.from(grid.children, {
                y: 30,
                opacity: 0,
                duration: 0.6,
                stagger: 0.08,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: grid,
                    start: "top 85%",
                    toggleActions: "play none none none",
                    once: true
                }
            });
        });
    }

    // Call immediately - don't wait for products
    animateProductCardsImmediately();

    // 4. HOVER EFFECTS (IMMEDIATE)
    initHoverEffects();

    // 5. NAVBAR SCROLL EFFECT (IMMEDIATE)
    initNavbarEffect();

    console.log('Animations loaded instantly!');
});

// Hover effects (same as before)
function initHoverEffects() {
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

// Navbar effect (same as before)
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