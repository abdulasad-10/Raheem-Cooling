// // Professional Animations - Safe & Non-Intrusive
// class SafeAnimations {
//     constructor() {
//         this.init();
//     }

//     init() {
//         // Register GSAP plugins
//         if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
//             gsap.registerPlugin(ScrollTrigger);
//             this.setupAnimations();
//         }
//     }

//     setupAnimations() {
//         // Page load animation
//         this.pageLoadAnimation();
        
//         // Scroll animations
//         this.scrollAnimations();
        
//         // Hover animations
//         this.hoverAnimations();
        
//         // Navbar animation
//         this.navbarAnimation();
//     }

//     // Page load fade in
//     pageLoadAnimation() {
//         gsap.from('body', {
//             opacity: 0,
//             duration: 0.8,
//             ease: "power2.out"
//         });
//     }

//     // Scroll-triggered animations
//     scrollAnimations() {
//         // Fade up animation for sections
//         gsap.utils.toArray('.fade-up').forEach(section => {
//             gsap.from(section, {
//                 y: 60,
//                 opacity: 0,
//                 duration: 1,
//                 ease: "power2.out",
//                 scrollTrigger: {
//                     trigger: section,
//                     start: "top 85%",
//                     end: "bottom 20%",
//                     toggleActions: "play none none none"
//                 }
//             });
//         });

//         // Stagger animation for cards
//         gsap.utils.toArray('.stagger-cards .product-card, .stagger-cards .feature-card').forEach(container => {
//             const cards = container.children;
//             gsap.from(cards, {
//                 y: 40,
//                 opacity: 0,
//                 duration: 0.8,
//                 stagger: 0.1,
//                 ease: "power2.out",
//                 scrollTrigger: {
//                     trigger: container,
//                     start: "top 80%",
//                     toggleActions: "play none none none"
//                 }
//             });
//         });

//         // Scale in for team members & features
//         gsap.utils.toArray('.scale-in').forEach(element => {
//             gsap.from(element, {
//                 scale: 0.8,
//                 opacity: 0,
//                 duration: 0.8,
//                 ease: "back.out(1.7)",
//                 scrollTrigger: {
//                     trigger: element,
//                     start: "top 85%",
//                     toggleActions: "play none none none"
//                 }
//             });
//         });
//     }

//     // Hover animations
//     hoverAnimations() {
//         // Card hover effects
//         gsap.utils.toArray('.hover-lift').forEach(card => {
//             card.addEventListener('mouseenter', () => {
//                 gsap.to(card, {
//                     y: -8,
//                     scale: 1.02,
//                     duration: 0.3,
//                     ease: "power2.out"
//                 });
//             });
            
//             card.addEventListener('mouseleave', () => {
//                 gsap.to(card, {
//                     y: 0,
//                     scale: 1,
//                     duration: 0.3,
//                     ease: "power2.out"
//                 });
//             });
//         });

//         // Button hover effects
//         gsap.utils.toArray('.btn-primary, .btn-secondary, .view-details').forEach(button => {
//             button.addEventListener('mouseenter', () => {
//                 gsap.to(button, {
//                     scale: 1.05,
//                     duration: 0.2,
//                     ease: "power2.out"
//                 });
//             });
            
//             button.addEventListener('mouseleave', () => {
//                 gsap.to(button, {
//                     scale: 1,
//                     duration: 0.2,
//                     ease: "power2.out"
//                 });
//             });
//         });

//         // Image zoom on hover
//         gsap.utils.toArray('.hover-zoom').forEach(container => {
//             const img = container.querySelector('img');
//             if (img) {
//                 container.addEventListener('mouseenter', () => {
//                     gsap.to(img, {
//                         scale: 1.1,
//                         duration: 0.5,
//                         ease: "power2.out"
//                     });
//                 });
                
//                 container.addEventListener('mouseleave', () => {
//                     gsap.to(img, {
//                         scale: 1,
//                         duration: 0.5,
//                         ease: "power2.out"
//                     });
//                 });
//             }
//         });
//     }

//     // Navbar scroll animation
//     navbarAnimation() {
//         const navbar = document.querySelector('.navbar');
//         if (!navbar) return;

//         ScrollTrigger.create({
//             start: 100,
//             onEnter: () => {
//                 gsap.to(navbar, {
//                     backgroundColor: "rgba(255, 255, 255, 0.95)",
//                     backdropFilter: "blur(10px)",
//                     duration: 0.3,
//                     ease: "power2.out"
//                 });
//             },
//             onLeaveBack: () => {
//                 gsap.to(navbar, {
//                     backgroundColor: "var(--white)",
//                     backdropFilter: "none",
//                     duration: 0.3,
//                     ease: "power2.out"
//                 });
//             }
//         });
//     }

//     // Smooth scroll to element
//     smoothScrollTo(target, duration = 1.2) {
//         gsap.to(window, {
//             duration: duration,
//             scrollTo: { y: target, offsetY: 80 },
//             ease: "power2.inOut"
//         });
//     }
// }

// // Initialize animations when DOM is loaded
// document.addEventListener('DOMContentLoaded', function() {
//     new SafeAnimations();
// });
// // Smooth page transitions
// function enhancePageTransitions() {
//     const links = document.querySelectorAll('a[href]:not([href^="#"]):not([target="_blank"])');
    
//     links.forEach(link => {
//         link.addEventListener('click', function(e) {
//             if (this.href && !this.href.includes('javascript:')) {
//                 e.preventDefault();
//                 const href = this.href;
                
//                 // Fade out animation
//                 gsap.to('body', {
//                     opacity: 0,
//                     duration: 0.3,
//                     ease: "power2.in",
//                     onComplete: () => {
//                         window.location.href = href;
//                     }
//                 });
//             }
//         });
//     });
// }

// // Call this in DOMContentLoaded
// document.addEventListener('DOMContentLoaded', enhancePageTransitions);