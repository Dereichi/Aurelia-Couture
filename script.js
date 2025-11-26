/**
 * Aurelia Couture - Main Functionality
 * Structured for easy integration into larger codebases.
 */

const AureliaCouture = {
    settings: {
        scrollThreshold: 300, // Distance to scroll before showing BackToTop
        mobileBreakpoint: 768
    },

    init: function() {
        this.initMobileMenu();
        this.initBackToTop();
        this.initSmoothScroll();
        this.initSocialHandlers();
    },

    /**
     * Handles Mobile Navigation (Hamburger)
     * Toggles CSS classes instead of inline styles for better performance.
     */
    initMobileMenu: function() {
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('nav-menu');

        // Guard clause: Exit if elements don't exist on this page
        if (!hamburger || !navMenu) return;

        // Toggle Menu
        hamburger.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent document click from firing immediately
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking a link
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });

        // Reset menu state on window resize (prevents layout bugs)
        window.addEventListener('resize', () => {
            if (window.innerWidth > this.settings.mobileBreakpoint) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    },

    /**
     * Handles Back to Top Button
     * Uses CSS classes for visibility to ensure smooth transitions.
     */
    initBackToTop: function() {
        const btn = document.getElementById('backToTopBtn');
        if (!btn) return;

        // Scroll Logic
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY || document.documentElement.scrollTop;
            
            if (scrolled > this.settings.scrollThreshold) {
                // We use 'display: flex' in CSS via a class or inline
                // But matching your CSS request, we simply toggle display here
                btn.style.display = 'flex';
                // Small timeout to allow display to apply before opacity transition
                setTimeout(() => { btn.style.opacity = '1'; }, 10);
            } else {
                btn.style.opacity = '0';
                // Wait for transition to finish before hiding
                setTimeout(() => { 
                    if (scrolled <= this.settings.scrollThreshold) btn.style.display = 'none'; 
                }, 300);
            }
        }, { passive: true });

        // Click Logic
        btn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    },

    /**
     * Global Social Media Handler
     * Attached to window to support the existing HTML 'onclick' attributes.
     */
    initSocialHandlers: function() {
        window.socialClick = function(platform) {
            const urls = {
                'Facebook': 'https://www.facebook.com',
                'Instagram': 'https://www.instagram.com',
                'X': 'https://twitter.com',
                'LinkedIn': 'https://www.linkedin.com'
            };

            const url = urls[platform];
            
            if (url) {
                window.open(url, '_blank', 'noopener,noreferrer');
            } else {
                console.warn(`Aurelia Couture: No URL defined for ${platform}`);
            }
        };
    },

    /**
     * Smooth Scroll for Anchor Links
     * Modern approach for internal page links (e.g., #contact)
     */
    initSmoothScroll: function() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const targetId = this.getAttribute('href');
                
                if (targetId === '#' || targetId === '#!') return;

                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    AureliaCouture.init();
});