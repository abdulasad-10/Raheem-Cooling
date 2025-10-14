// Login and Signup Page Functionality - FIXED VERSION
document.addEventListener('DOMContentLoaded', function() {
    console.log('Auth page loaded - initializing...');
    initializeAuthPage();
});

function initializeAuthPage() {
    console.log('Initializing auth page...');
    
    // Check if we're on login or signup page
    const isLoginPage = window.location.pathname.includes('login.html') || 
                       document.querySelector('title').textContent.includes('Login');
    const isSignupPage = window.location.pathname.includes('signup.html') || 
                        document.querySelector('title').textContent.includes('Sign Up');
    
    console.log('Login page:', isLoginPage, 'Signup page:', isSignupPage);
    
    // Initialize animations
    initAuthAnimations();
    
    // Initialize form functionality with delay to ensure DOM is ready
    setTimeout(() => {
        if (isLoginPage) {
            initLoginForm();
        } else if (isSignupPage) {
            initSignupForm();
        }
        
        // Initialize common functionality
        initCommonAuthFeatures();
    }, 100);
}

// Initialize GSAP animations
function initAuthAnimations() {
    // Animate auth card entrance
    const authCard = document.querySelector('.auth-card');
    if (authCard) {
        gsap.to(authCard, {
            duration: 1,
            y: 0,
            opacity: 1,
            ease: "power3.out",
            delay: 0.3
        });
    }

    // Animate floating shapes
    const floatingShapes = document.querySelectorAll('.floating-shape');
    if (floatingShapes.length > 0) {
        gsap.to(floatingShapes, {
            duration: 6,
            y: "+=30",
            rotation: 360,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            stagger: 2
        });
    }

    // Animate AC icon
    const floatingAC = document.querySelector('.floating-ac');
    if (floatingAC) {
        gsap.to(floatingAC, {
            duration: 8,
            rotation: 360,
            repeat: -1,
            ease: "none"
        });
    }

    // Add hover effects to form inputs
    const inputs = document.querySelectorAll('.input-with-icon input');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            gsap.to(this, { scale: 1.02, duration: 0.3 });
        });
        
        input.addEventListener('blur', function() {
            gsap.to(this, { scale: 1, duration: 0.3 });
        });
    });
}

// Login form functionality - FIXED
function initLoginForm() {
    console.log('Initializing login form...');
    
    const loginForm = document.getElementById('loginForm');
    const passwordToggle = document.getElementById('passwordToggle');

    if (loginForm) {
        console.log('Login form found, adding submit listener');
        loginForm.addEventListener('submit', handleLoginSubmit);
    } else {
        console.error('Login form not found!');
    }

    if (passwordToggle) {
        console.log('Password toggle found');
        passwordToggle.addEventListener('click', function() {
            togglePasswordVisibility('password');
        });
    }
}

// Signup form functionality - FIXED
function initSignupForm() {
    console.log('Initializing signup form...');
    
    const signupForm = document.getElementById('signupForm');
    const passwordToggle = document.getElementById('passwordToggle');
    const confirmPasswordToggle = document.getElementById('confirmPasswordToggle');
    const passwordInput = document.getElementById('password');

    if (signupForm) {
        console.log('Signup form found, adding submit listener');
        signupForm.addEventListener('submit', handleSignupSubmit);
    } else {
        console.error('Signup form not found!');
    }

    if (passwordToggle) {
        passwordToggle.addEventListener('click', function() {
            togglePasswordVisibility('password');
        });
    }

    if (confirmPasswordToggle) {
        confirmPasswordToggle.addEventListener('click', function() {
            togglePasswordVisibility('confirmPassword');
        });
    }

    if (passwordInput) {
        passwordInput.addEventListener('input', checkPasswordStrength);
    }
}

// Common auth features - FIXED VERSION
function initCommonAuthFeatures() {
    console.log('Initializing common auth features...');
    
    // Add social login event listeners with proper error handling
    const googleBtn = document.querySelector('.google-btn');
    const facebookBtn = document.querySelector('.facebook-btn');
    
    if (googleBtn) {
        console.log('Google button found, adding listener');
        googleBtn.addEventListener('click', handleGoogleLogin);
        // Test if button is clickable
        googleBtn.style.cursor = 'pointer';
        googleBtn.addEventListener('click', function(e) {
            console.log('Google button CLICKED!', e);
            e.preventDefault();
            handleGoogleLogin();
        });
    } else {
        console.log('Google button NOT found');
    }
    
    if (facebookBtn) {
        console.log('Facebook button found, adding listener');
        facebookBtn.addEventListener('click', handleFacebookLogin);
        // Test if button is clickable
        facebookBtn.style.cursor = 'pointer';
        facebookBtn.addEventListener('click', function(e) {
            console.log('Facebook button CLICKED!', e);
            e.preventDefault();
            handleFacebookLogin();
        });
    } else {
        console.log('Facebook button NOT found');
    }

    // Test: Add click to entire form
    const authCard = document.querySelector('.auth-card');
    if (authCard) {
        authCard.addEventListener('click', function(e) {
            console.log('Auth card clicked:', e.target);
        });
    }

    // Force buttons to be clickable
    const buttons = document.querySelectorAll('button');
    buttons.forEach(btn => {
        btn.style.pointerEvents = 'auto';
        btn.style.cursor = 'pointer';
        btn.addEventListener('click', function(e) {
            console.log('Button clicked:', this.textContent || this.innerHTML);
        });
    });

    console.log('Total buttons found:', buttons.length);
}

// Toggle password visibility - FIXED
function togglePasswordVisibility(inputId) {
    console.log('Toggling password visibility for:', inputId);
    
    const input = document.getElementById(inputId);
    if (!input) {
        console.error('Input not found:', inputId);
        return;
    }
    
    const type = input.getAttribute('type');
    const newType = type === 'password' ? 'text' : 'password';
    input.setAttribute('type', newType);
    
    // Update toggle button icon
    const toggle = input.closest('.input-with-icon').querySelector('.password-toggle');
    if (toggle) {
        toggle.textContent = newType === 'password' ? '👁️' : '🔒';
    }
}

// Password strength checker
function checkPasswordStrength() {
    const password = this.value;
    const strengthBar = document.querySelector('.strength-bar');
    const strengthText = document.querySelector('.strength-text');
    
    if (!strengthBar || !strengthText) return;
    
    let strength = 0;
    
    // Length check
    if (password.length >= 8) strength += 25;
    
    // Lowercase check
    if (/[a-z]/.test(password)) strength += 25;
    
    // Uppercase check
    if (/[A-Z]/.test(password)) strength += 25;
    
    // Number/Special char check
    if (/[0-9]/.test(password) || /[^A-Za-z0-9]/.test(password)) strength += 25;
    
    // Update UI
    const strengthBarInner = strengthBar.querySelector('::before') || strengthBar;
    strengthBarInner.style.width = strength + '%';
    
    // Remove all classes first
    strengthBar.parentElement.className = 'password-strength';
    
    // Add appropriate class
    if (strength <= 25) {
        strengthBar.parentElement.classList.add('weak');
        strengthText.textContent = 'Weak';
    } else if (strength <= 50) {
        strengthBar.parentElement.classList.add('medium');
        strengthText.textContent = 'Medium';
    } else if (strength <= 75) {
        strengthBar.parentElement.classList.add('strong');
        strengthText.textContent = 'Strong';
    } else {
        strengthBar.parentElement.classList.add('very-strong');
        strengthText.textContent = 'Very Strong';
    }
}

// Field validation
function validateField(field) {
    const errorElement = document.getElementById(field.id + 'Error');
    
    if (!errorElement) return;
    
    // Clear previous error
    errorElement.classList.remove('show');
    
    // Required field check
    if (!field.value.trim()) {
        showError(field, 'This field is required');
        return false;
    }
    
    // Email validation
    if (field.type === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(field.value)) {
            showError(field, 'Please enter a valid email address');
            return false;
        }
    }
    
    // Password validation for signup
    if (field.id === 'password' && field.value) {
        if (field.value.length < 8) {
            showError(field, 'Password must be at least 8 characters');
            return false;
        }
    }
    
    // Confirm password validation
    if (field.id === 'confirmPassword') {
        const password = document.getElementById('password');
        if (password && field.value !== password.value) {
            showError(field, 'Passwords do not match');
            return false;
        }
    }
    
    return true;
}

// Show error message
function showError(field, message) {
    const errorElement = document.getElementById(field.id + 'Error');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
        
        // Add shake animation to input
        gsap.to(field, {
            x: 10,
            duration: 0.1,
            repeat: 3,
            yoyo: true,
            ease: "power1.inOut"
        });
    }
}

// Clear all errors - UPDATED
function clearErrors() {
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(element => {
        element.classList.remove('show');
        element.textContent = '';
    });
    
    // Also clear the terms error if it exists
    const termsError = document.getElementById('termsError');
    if (termsError) {
        termsError.classList.remove('show');
        termsError.textContent = '';
    }
}

// Handle login submission
async function handleLoginSubmit(e) {
    e.preventDefault();
    console.log('Login form submitted!');
    
    const form = e.target;
    const submitBtn = form.querySelector('.auth-submit');
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    
    if (!email || !password) {
        console.error('Email or password fields not found!');
        return;
    }
    
    // Clear previous errors
    clearErrors();
    
    // Validate fields
    let isValid = true;
    const fields = form.querySelectorAll('input[required]');
    fields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    if (!isValid) {
        console.log('Form validation failed');
        return;
    }
    
    // Show loading state
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    
    try {
        console.log('Attempting login...');
        // Simulate API call
        await simulateLoginAPI(email.value, password.value);
        
        // Show success message
        showSuccessMessage();
        
        // Redirect after delay
        setTimeout(() => {
            window.location.href = 'index.html'; // Redirect to home page
        }, 2000);
        
    } catch (error) {
        console.error('Login failed:', error);
        // Handle login error
        showError(email, 'Invalid email or password');
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
    }
}

// Handle signup submission - FIXED VERSION
async function handleSignupSubmit(e) {
    e.preventDefault();
    console.log('Signup form submitted!');
    
    const form = e.target;
    const submitBtn = form.querySelector('.auth-submit');
    
    // Clear previous errors
    clearErrors();
    
    // Get all required fields
    const firstName = document.getElementById('firstName');
    const lastName = document.getElementById('lastName');
    const email = document.getElementById('email');
    const phone = document.getElementById('phone');
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');
    const agreeTerms = document.getElementById('agreeTerms');
    
    console.log('Form fields:', {
        firstName: firstName?.value,
        lastName: lastName?.value,
        email: email?.value,
        phone: phone?.value,
        password: password?.value,
        confirmPassword: confirmPassword?.value,
        agreeTerms: agreeTerms?.checked
    });
    
    // Validate all fields
    let isValid = true;
    
    // Check each field individually with better error messages
    if (!firstName || !firstName.value.trim()) {
        showError(firstName, 'First name is required');
        isValid = false;
    }
    
    if (!lastName || !lastName.value.trim()) {
        showError(lastName, 'Last name is required');
        isValid = false;
    }
    
    if (!email || !email.value.trim()) {
        showError(email, 'Email is required');
        isValid = false;
    } else if (!validateEmail(email.value)) {
        showError(email, 'Please enter a valid email address');
        isValid = false;
    }
    
    if (!phone || !phone.value.trim()) {
        showError(phone, 'Phone number is required');
        isValid = false;
    }
    
    if (!password || !password.value.trim()) {
        showError(password, 'Password is required');
        isValid = false;
    } else if (password.value.length < 8) {
        showError(password, 'Password must be at least 8 characters');
        isValid = false;
    }
    
    if (!confirmPassword || !confirmPassword.value.trim()) {
        showError(confirmPassword, 'Please confirm your password');
        isValid = false;
    } else if (password && confirmPassword.value !== password.value) {
        showError(confirmPassword, 'Passwords do not match');
        isValid = false;
    }
    
    // Check terms agreement
    if (!agreeTerms || !agreeTerms.checked) {
        // Create a fake element for terms error since it's not an input
        const termsError = document.getElementById('termsError') || createTermsErrorElement();
        termsError.textContent = 'You must agree to the terms and conditions';
        termsError.classList.add('show');
        isValid = false;
    }
    
    if (!isValid) {
        console.log('Form validation failed - check errors above');
        return;
    }
    
    console.log('Form validation passed! Proceeding with signup...');
    
    // Show loading state
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    
    try {
        console.log('Attempting signup...');
        // Simulate API call
        await simulateSignupAPI();
        
        // Show success message
        showSuccessMessage();
        
        // Redirect after delay
        setTimeout(() => {
            window.location.href = 'index.html'; // Redirect to home page
        }, 2000);
        
    } catch (error) {
        console.error('Signup failed:', error);
        // Handle signup error
        showError(email, 'This email is already registered');
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
    }
}

// Helper function to validate email
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Create terms error element if it doesn't exist
function createTermsErrorElement() {
    const errorElement = document.createElement('div');
    errorElement.id = 'termsError';
    errorElement.className = 'error-message';
    
    // Insert after the terms checkbox
    const termsContainer = document.querySelector('.checkbox-container');
    if (termsContainer) {
        termsContainer.parentNode.insertBefore(errorElement, termsContainer.nextSibling);
    }
    
    return errorElement;
}

// Simulate login API call
function simulateLoginAPI(email, password) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Simulate successful login for demo
            // In real app, this would be your actual API call
            if (email && password) {
                console.log('Login successful for:', email);
                // Save user session
                localStorage.setItem('userLoggedIn', 'true');
                localStorage.setItem('userEmail', email);
                resolve({ success: true });
            } else {
                reject(new Error('Login failed'));
            }
        }, 1500);
    });
}

// Simulate signup API call
function simulateSignupAPI() {
    return new Promise((resolve) => {
        setTimeout(() => {
            // Simulate successful signup for demo
            console.log('Signup successful');
            localStorage.setItem('userLoggedIn', 'true');
            resolve({ success: true });
        }, 1500);
    });
}

// Show success message
function showSuccessMessage() {
    const successMessage = document.getElementById('successMessage');
    const authCard = document.getElementById('authCard');
    
    if (successMessage && authCard) {
        console.log('Showing success message');
        // Animate success message
        gsap.to(authCard, {
            opacity: 0,
            scale: 0.9,
            duration: 0.5,
            onComplete: () => {
                authCard.style.display = 'none';
                successMessage.classList.add('active');
                
                // Animate success elements
                gsap.fromTo('.success-icon', 
                    { scale: 0, rotation: -180 },
                    { scale: 1, rotation: 0, duration: 0.8, ease: "back.out(1.7)" }
                );
                
                gsap.fromTo('.auth-success h2', 
                    { y: 30, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.6, delay: 0.3 }
                );
                
                gsap.fromTo('.auth-success p', 
                    { y: 30, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.6, delay: 0.5 }
                );
            }
        });
    }
}

// Social login handlers
function handleGoogleLogin() {
    console.log('Google login clicked');
    // Google OAuth implementation would go here
    // window.location.href = '/auth/google';
}

function handleFacebookLogin() {
    console.log('Facebook login clicked');
    // Facebook OAuth implementation would go here
    // window.location.href = '/auth/facebook';
}










