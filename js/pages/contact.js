// Contact Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializeContactPage();
});

// Initialize contact page
function initializeContactPage() {
    loadProductsDropdown();
    setupFormValidation();
    setupEventListeners();
}

// Load products into dropdown
function loadProductsDropdown() {
    fetch('data/products.json')
        .then(response => response.json())
        .then(products => {
            const productSelect = document.getElementById('product');
            if (productSelect) {
                // Add product options
                products.forEach(product => {
                    const option = document.createElement('option');
                    option.value = product.id;
                    option.textContent = product.name;
                    productSelect.appendChild(option);
                });
            }
        })
        .catch(error => {
            console.error('Error loading products:', error);
        });
}

// Setup form validation
function setupFormValidation() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    // Real-time validation
    setupRealTimeValidation();

    // Form submission
    form.addEventListener('submit', handleFormSubmission);
}

// Setup real-time validation
function setupRealTimeValidation() {
    const fields = [
        { id: 'name', validator: validateName },
        { id: 'email', validator: validateEmail },
        { id: 'phone', validator: validatePhone },
        { id: 'subject', validator: validateSubject },
        { id: 'message', validator: validateMessage }
    ];

    fields.forEach(field => {
        const element = document.getElementById(field.id);
        if (element) {
            element.addEventListener('blur', function() {
                field.validator(this);
            });

            element.addEventListener('input', function() {
                clearError(this);
            });
        }
    });
}

// Validation functions
function validateName(input) {
    const value = input.value.trim();
    const errorElement = document.getElementById('nameError');

    if (!value) {
        showError(input, errorElement, 'Name is required');
        return false;
    }

    if (value.length < 2) {
        showError(input, errorElement, 'Name must be at least 2 characters');
        return false;
    }

    if (!/^[a-zA-Z\s]+$/.test(value)) {
        showError(input, errorElement, 'Name can only contain letters and spaces');
        return false;
    }

    showSuccess(input, errorElement);
    return true;
}

function validateEmail(input) {
    const value = input.value.trim();
    const errorElement = document.getElementById('emailError');

    if (!value) {
        showError(input, errorElement, 'Email is required');
        return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
        showError(input, errorElement, 'Please enter a valid email address');
        return false;
    }

    showSuccess(input, errorElement);
    return true;
}

function validatePhone(input) {
    const value = input.value.trim();
    const errorElement = document.getElementById('phoneError');

    if (value && !/^[\+]?[1-9][\d]{0,15}$/.test(value.replace(/[\s\-\(\)]/g, ''))) {
        showError(input, errorElement, 'Please enter a valid phone number');
        return false;
    }

    showSuccess(input, errorElement);
    return true;
}

function validateSubject(input) {
    const value = input.value;
    const errorElement = document.getElementById('subjectError');

    if (!value) {
        showError(input, errorElement, 'Please select a subject');
        return false;
    }

    showSuccess(input, errorElement);
    return true;
}

function validateMessage(input) {
    const value = input.value.trim();
    const errorElement = document.getElementById('messageError');

    if (!value) {
        showError(input, errorElement, 'Message is required');
        return false;
    }

    if (value.length < 10) {
        showError(input, errorElement, 'Message must be at least 10 characters');
        return false;
    }

    if (value.length > 1000) {
        showError(input, errorElement, 'Message must be less than 1000 characters');
        return false;
    }

    showSuccess(input, errorElement);
    return true;
}

// Show error state
function showError(input, errorElement, message) {
    input.classList.add('error');
    input.classList.remove('success');
    errorElement.textContent = message;
}

// Show success state
function showSuccess(input, errorElement) {
    input.classList.remove('error');
    input.classList.add('success');
    errorElement.textContent = '';
}

// Clear error
function clearError(input) {
    input.classList.remove('error');
    const errorElement = document.getElementById(input.id + 'Error');
    if (errorElement) {
        errorElement.textContent = '';
    }
}

// Validate entire form
function validateForm() {
    const fields = [
        { id: 'name', validator: validateName },
        { id: 'email', validator: validateEmail },
        { id: 'subject', validator: validateSubject },
        { id: 'message', validator: validateMessage }
    ];

    let isValid = true;

    fields.forEach(field => {
        const input = document.getElementById(field.id);
        if (input && !field.validator(input)) {
            isValid = false;
        }
    });

    return isValid;
}

// Handle form submission
function handleFormSubmission(e) {
    e.preventDefault();

    if (!validateForm()) {
        showNotification('Please fix the errors before submitting', 'error');
        return;
    }

    // Show loading state
    const submitBtn = document.getElementById('submitBtn');
    const btnText = submitBtn.querySelector('.btn-text');
    const spinner = submitBtn.querySelector('.loading-spinner');

    btnText.textContent = 'Sending...';
    spinner.style.display = 'block';
    submitBtn.disabled = true;

    // Simulate API call
    setTimeout(() => {
        // In real implementation, you would send data to server here
        const formData = getFormData();
        
        // Save to localStorage for demo purposes
        saveFormData(formData);

        // Show success message
        showSuccessMessage();
        
        // Reset form
        resetForm();

        // Reset button
        btnText.textContent = 'Send Message';
        spinner.style.display = 'none';
        submitBtn.disabled = false;

    }, 2000);
}

// Get form data
function getFormData() {
    const form = document.getElementById('contactForm');
    const formData = new FormData(form);
    
    return {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        subject: formData.get('subject'),
        product: formData.get('product'),
        message: formData.get('message'),
        newsletter: formData.get('newsletter') === 'on',
        timestamp: new Date().toISOString()
    };
}

// Save form data (for demo purposes)
function saveFormData(formData) {
    let submissions = JSON.parse(localStorage.getItem('contactSubmissions')) || [];
    submissions.push(formData);
    localStorage.setItem('contactSubmissions', JSON.stringify(submissions));
}

// Show success message
function showSuccessMessage() {
    const form = document.getElementById('contactForm');
    
    // Create success message
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.innerHTML = `
        <h3>Thank You!</h3>
        <p>Your message has been sent successfully. We'll get back to you within 24 hours.</p>
    `;
    
    // Insert before form
    form.parentNode.insertBefore(successDiv, form);
    
    // Remove success message after 5 seconds
    setTimeout(() => {
        successDiv.remove();
    }, 5000);
}

// Reset form
function resetForm() {
    const form = document.getElementById('contactForm');
    form.reset();
    
    // Clear all validation states
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.classList.remove('error', 'success');
        const errorElement = document.getElementById(input.id + 'Error');
        if (errorElement) {
            errorElement.textContent = '';
        }
    });
}

// Setup event listeners
function setupEventListeners() {
    // Live chat button
    const liveChatBtn = document.getElementById('liveChatBtn');
    if (liveChatBtn) {
        liveChatBtn.addEventListener('click', function() {
            showNotification('Live chat feature coming soon!', 'info');
        });
    }

    // Enter key submission
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && e.target.type !== 'textarea') {
                e.preventDefault();
            }
        });
    }
}

// Open directions (placeholder)
function openDirections() {
    showNotification('Directions feature would open maps application', 'info');
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Style based on type
    const styles = {
        info: { background: 'var(--primary-color)', color: 'white' },
        error: { background: '#dc3545', color: 'white' },
        success: { background: '#28a745', color: 'white' }
    };
    
    Object.assign(notification.style, {
        position: 'fixed',
        top: '100px',
        right: '20px',
        padding: '15px 20px',
        borderRadius: '4px',
        zIndex: '1200',
        animation: 'slideIn 0.3s ease',
        ...styles[type]
    });

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

// Add CSS for notifications
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(notificationStyles);