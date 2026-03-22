
// DOM Elements
const navbar = document.querySelector('.navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.section');

// Utility: Throttle function for 60fps performance
function throttle(func, limit) {
    let inThrottle;
    return function () {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ============================================
// 1. SMOOTH SCROLLING & ACTIVE NAV
// ============================================
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);

        if (targetSection) {
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            updateActiveNavLink(link);
        }
    });
});

// ============================================
// 2. NAVBAR SCROLL EFFECTS (60fps throttled)
// ============================================
const handleScroll = throttle(() => {
    // Navbar shrink effect
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Active nav link on scroll
    updateActiveNavLinkOnScroll();
}, 16);

window.addEventListener('scroll', handleScroll);

// Update active nav functions
function updateActiveNavLink(activeLink) {
    navLinks.forEach(link => link.classList.remove('active'));
    activeLink.classList.add('active');
}

function updateActiveNavLinkOnScroll() {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (window.scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// ============================================
// 3. MOBILE MENU (HAMBURGER)
// ============================================
function initMobileMenu() {
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            navMenu.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });

        // Close menu when clicking link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.navbar')) {
                navMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });
    }
}

// ============================================
// 4. INTERSECTION OBSERVER ANIMATIONS
// ============================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// ============================================
// 5. SCROLL TO TOP BUTTON
// ============================================
function createScrollToTop() {
    const scrollBtn = document.querySelector('.scroll-to-top');

    const handleScrollToTop = throttle(() => {
        if (window.scrollY > 500) {
            scrollBtn.classList.add('show');
        } else {
            scrollBtn.classList.remove('show');
        }
    }, 16);

    window.addEventListener('scroll', handleScrollToTop);
    scrollBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ============================================
// 6. PARALLAX HERO EFFECT
// ============================================
const handleParallax = throttle(() => {
    const scrolled = window.scrollY;
    const parallaxSpeed = 0.5;
    const heroVisual = document.querySelector('.hero-visual');
    const floatingShapes = document.querySelector('.floating-shapes');

    if (heroVisual) {
        heroVisual.style.transform = `translateY(${scrolled * parallaxSpeed * 0.3}px)`;
    }

    if (floatingShapes) {
        floatingShapes.style.transform = `translateY(${scrolled * 0.1}px)`;
    }
}, 16);

window.addEventListener('scroll', handleParallax);

// ============================================
// 7. LOADING & PERFORMANCE
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize animations
    document.querySelectorAll('.feature-card, .impact-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        observer.observe(card);
    });

    // Init features
    initMobileMenu();
    createScrollToTop();

    // Page loaded
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
});

// ============================================
// 8. MOBILE OPTIMIZATIONS
// ============================================
// Prevent iOS zoom on double-tap
let lastTouchEnd = 0;
document.addEventListener('touchend', (e) => {
    const now = new Date().getTime();
    if (now - lastTouchEnd <= 300) {
        e.preventDefault();
    }
    lastTouchEnd = now;
}, false);

// ============================================
// 9. WINDOW RESIZE HANDLER
// ============================================
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        // Re-observe elements after resize
        observer.disconnect();
        document.querySelectorAll('.feature-card, .impact-card').forEach(card => {
            observer.observe(card);
        });
    }, 250);
});

// ============================================
// 10. PERFORMANCE MONITORING (DEV ONLY)
// ============================================
if ('performance' in window && location.hostname === 'localhost') {
    window.addEventListener('load', () => {
        const perfData = performance.getEntriesByType('navigation')[0];
        console.log('🚀 Performance Metrics:', {
            loadTime: `${Math.round(perfData.loadEventEnd - perfData.fetchStart)}ms`,
            domContentLoaded: `${Math.round(perfData.domContentLoadedEventEnd - perfData.fetchStart)}ms`,
            fps: '60fps (throttled)'
        });
    });
}