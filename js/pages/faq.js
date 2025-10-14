// FAQ Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializeFAQ();
});

// Global variables
let faqItems = [];
let filteredItems = [];
let currentCategory = 'all';
let searchTerm = '';

// Initialize FAQ page
function initializeFAQ() {
    loadFAQData();
    setupEventListeners();
}

// Load FAQ data
function loadFAQData() {
    // In a real application, this would come from an API or JSON file
    faqItems = generateFAQData();
    filteredItems = [...faqItems];
    
    renderFAQ();
    setupCategoryButtons();
}

// Generate FAQ data
function generateFAQData() {
    return [
        {
            id: 1,
            question: "What types of air conditioning systems do you offer?",
            answer: "We offer three main types of air conditioning systems: Split AC units for residential and commercial spaces, Window AC units for compact installations, and Cassette AC systems for commercial establishments. Each type comes in various capacities and features to suit different needs.",
            category: "products",
            tags: ["products", "types", "systems"]
        },
        {
            id: 2,
            question: "How long does the installation process take?",
            answer: "The installation time varies depending on the type of AC system and the complexity of the installation. Typically, split AC installations take 2-4 hours, window AC units take 1-2 hours, and cassette AC systems may take 4-8 hours for commercial setups. Our team will provide a precise timeline during the initial assessment.",
            category: "installation",
            tags: ["installation", "time", "process"]
        },
        {
            id: 3,
            question: "Do you provide maintenance services?",
            answer: "Yes, we offer comprehensive maintenance services including regular cleaning, filter replacement, performance checks, and system optimization. We provide both one-time maintenance and annual maintenance contracts to ensure your AC system operates at peak efficiency throughout the year.",
            category: "maintenance",
            tags: ["maintenance", "services", "cleaning"]
        },
        {
            id: 4,
            question: "What is your warranty policy?",
            answer: "We offer a standard 1-year warranty on labor and installation. The manufacturer's warranty on AC units varies by model but typically ranges from 2-5 years on compressors and 1-2 years on parts. Extended warranty options are available for purchase. All warranty details are provided in writing at the time of purchase.",
            category: "warranty",
            tags: ["warranty", "policy", "coverage"]
        },
        {
            id: 5,
            question: "How energy efficient are your AC systems?",
            answer: "Our AC systems are designed with energy efficiency in mind. Most of our models have high Energy Efficiency Ratios (EER) and Seasonal Energy Efficiency Ratios (SEER). We offer inverter technology models that can save up to 30-40% on energy consumption compared to conventional AC systems. The exact efficiency ratings vary by model and capacity.",
            category: "technical",
            tags: ["energy", "efficiency", "technical"]
        },
        {
            id: 6,
            question: "Can I install an AC system myself?",
            answer: "While some window AC units can be installed by homeowners, we strongly recommend professional installation for all AC systems. Proper installation requires technical expertise, specialized tools, and knowledge of electrical systems and refrigeration. DIY installation may void warranties and can lead to safety hazards or system malfunctions.",
            category: "installation",
            tags: ["diy", "installation", "safety"]
        },
        {
            id: 7,
            question: "How often should I service my AC system?",
            answer: "We recommend servicing your AC system at least once a year, preferably before the start of the cooling season. For systems in heavy use or in dusty environments, bi-annual servicing may be beneficial. Regular maintenance includes cleaning filters, checking refrigerant levels, and ensuring all components are functioning properly.",
            category: "maintenance",
            tags: ["servicing", "frequency", "maintenance"]
        },
        {
            id: 8,
            question: "What is the lifespan of your AC systems?",
            answer: "With proper maintenance, our AC systems typically last 10-15 years. Split AC systems generally have a longer lifespan compared to window units. Regular maintenance, proper usage, and timely repairs can significantly extend the life of your AC system. Cassette AC systems in commercial settings may require more frequent maintenance but can also last 10+ years.",
            category: "products",
            tags: ["lifespan", "durability", "products"]
        },
        {
            id: 9,
            question: "Do you offer emergency repair services?",
            answer: "Yes, we provide 24/7 emergency repair services for critical AC failures, especially during extreme weather conditions. Our emergency service team is available to address urgent issues that affect your comfort and safety. Emergency service charges may apply outside of normal business hours.",
            category: "technical",
            tags: ["emergency", "repair", "services"]
        },
        {
            id: 10,
            question: "How do I choose the right AC capacity for my space?",
            answer: "The right AC capacity depends on several factors including room size, insulation, number of windows, ceiling height, and heat-generating appliances. As a general guideline, 1 ton of cooling capacity covers approximately 100-150 square feet. Our experts can perform a detailed load calculation to recommend the perfect capacity for your specific needs.",
            category: "products",
            tags: ["capacity", "sizing", "selection"]
        }
    ];
}

// Render FAQ items
function renderFAQ() {
    const accordion = document.getElementById('faqAccordion');
    if (!accordion) return;

    if (filteredItems.length === 0) {
        accordion.innerHTML = `
            <div class="no-results">
                <h3>No questions found</h3>
                <p>Try adjusting your search or filter criteria</p>
            </div>
        `;
        return;
    }

    accordion.innerHTML = filteredItems.map(item => `
        <div class="faq-item" data-category="${item.category}" data-id="${item.id}">
            <div class="faq-question">
                ${item.question}
            </div>
            <div class="faq-answer">
                <div class="faq-answer-content">
                    <p>${item.answer}</p>
                    <div class="faq-meta">
                        <span class="faq-category">${item.category.toUpperCase()}</span>
                        <span class="faq-id">Question #${item.id}</span>
                    </div>
                </div>
            </div>
        </div>
    `).join('');

    // Add click event listeners
    accordion.querySelectorAll('.faq-question').forEach(question => {
        question.addEventListener('click', toggleFAQ);
    });

    // Update search results
    updateSearchResults();
}

// Toggle FAQ item
function toggleFAQ(e) {
    const faqItem = e.target.closest('.faq-item');
    const isActive = faqItem.classList.contains('active');

    // Close all other items
    document.querySelectorAll('.faq-item.active').forEach(item => {
        if (item !== faqItem) {
            item.classList.remove('active');
        }
    });

    // Toggle current item
    faqItem.classList.toggle('active', !isActive);
}

// Setup category buttons
function setupCategoryButtons() {
    const categoryButtons = document.querySelectorAll('.category-btn');
    
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active state
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Update current category
            currentCategory = this.dataset.category;
            
            // Apply filters
            applyFilters();
        });
    });
}

// Apply filters based on category and search term
function applyFilters() {
    filteredItems = faqItems.filter(item => {
        // Category filter
        if (currentCategory !== 'all' && item.category !== currentCategory) {
            return false;
        }
        
        // Search term filter
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            const questionMatch = item.question.toLowerCase().includes(searchLower);
            const answerMatch = item.answer.toLowerCase().includes(searchLower);
            const tagsMatch = item.tags.some(tag => tag.toLowerCase().includes(searchLower));
            
            if (!questionMatch && !answerMatch && !tagsMatch) {
                return false;
            }
        }
        
        return true;
    });
    
    renderFAQ();
}

// Update search results text
function updateSearchResults() {
    const resultsElement = document.getElementById('searchResults');
    if (!resultsElement) return;

    if (searchTerm) {
        resultsElement.textContent = `Found ${filteredItems.length} question${filteredItems.length !== 1 ? 's' : ''} matching "${searchTerm}"`;
    } else {
        resultsElement.textContent = `${filteredItems.length} question${filteredItems.length !== 1 ? 's' : ''} available`;
    }
}

// Setup event listeners
function setupEventListeners() {
    // Search functionality
    const searchInput = document.getElementById('faqSearch');
    const searchBtn = document.getElementById('searchBtn');
    
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            searchTerm = e.target.value.trim();
            applyFilters();
        });
        
        // Enter key support
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                applyFilters();
            }
        });
    }
    
    if (searchBtn) {
        searchBtn.addEventListener('click', applyFilters);
    }
    
    // Keyboard navigation for FAQ items
    document.addEventListener('keydown', function(e) {
        const activeItem = document.querySelector('.faq-item.active');
        if (!activeItem) return;
        
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            const nextItem = activeItem.nextElementSibling;
            if (nextItem && nextItem.classList.contains('faq-item')) {
                activeItem.classList.remove('active');
                nextItem.classList.add('active');
                nextItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            const prevItem = activeItem.previousElementSibling;
            if (prevItem && prevItem.classList.contains('faq-item')) {
                activeItem.classList.remove('active');
                prevItem.classList.add('active');
                prevItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        } else if (e.key === 'Escape') {
            activeItem.classList.remove('active');
        }
    });
}

// Initialize FAQ when page loads
window.addEventListener('load', function() {
    // Open first FAQ item by default
    setTimeout(() => {
        const firstItem = document.querySelector('.faq-item');
        if (firstItem) {
            firstItem.classList.add('active');
        }
    }, 500);
});