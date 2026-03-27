const navbar = document.querySelector('.navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.section');

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

const handleScroll = throttle(() => {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    updateActiveNavLinkOnScroll();
}, 16);

window.addEventListener('scroll', handleScroll);

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

function initMobileMenu() {
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            navMenu.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                closeMenu(navMenu);
            });
        });

        document.addEventListener('click', (e) => {
            if (!e.target.closest('.navbar')) {
                closeMenu(navMenu);
            }
        });
    }
}

function closeMenu(navMenu) {
    if (navMenu && navMenu.classList.contains('active')) {
        navMenu.classList.add('closing');

        setTimeout(() => {
            navMenu.classList.remove('active', 'closing');
            document.body.classList.remove('menu-open');
        }, 300)
    }
}

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


document.addEventListener('DOMContentLoaded', () => {
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

let lastTouchEnd = 0;
document.addEventListener('touchend', (e) => {
    const now = new Date().getTime();
    if (now - lastTouchEnd <= 300) {
        e.preventDefault();
    }
    lastTouchEnd = now;
}, false);

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
