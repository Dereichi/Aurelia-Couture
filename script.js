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
        // Ensure cross-page helpers run first
        this.ensureBackToTopExists();
        this.ensureFlexibleNavSupport();

        this.initMobileMenu();
        this.initBackToTop();
        this.initSmoothScroll();
        this.initSocialHandlers();
        this.enhanceProductImages();
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
    },

    /**
     * Ensure BackToTop button exists on pages that don't include it
     */
    ensureBackToTopExists: function() {
        if (document.getElementById('backToTopBtn')) return;
        try {
            const btn = document.createElement('button');
            btn.id = 'backToTopBtn';
            btn.title = 'Go to top';
            btn.type = 'button';
            btn.textContent = '🡡';
            // Basic inline styles kept minimal; main styling lives in CSS
            btn.style.display = 'none';
            btn.style.opacity = '0';
            document.body.appendChild(btn);
        } catch (e) {
            // fail silently
            console.warn('AureliaCouture: could not create BackToTop button', e);
        }
    },

    /**
     * Make the mobile menu initialization work across pages that use
     * different nav structures by creating or mapping expected IDs.
     * This will avoid replacing your existing initMobileMenu implementation;
     * instead it ensures the expected `#hamburger` and `#nav-menu` exist.
     */
    ensureFlexibleNavSupport: function() {
        // find a nav element
        const nav = document.querySelector('nav') || document.querySelector('.navbar');
        if (!nav) return;

        // Try to find menu using common selectors
        const menuSelectors = ['.nav-menu', '.nav-links', 'ul.nav-menu', 'ul.nav-links', 'ul'];
        let menuEl = null;
        for (const sel of menuSelectors) {
            const m = nav.querySelector(sel);
            if (m) { menuEl = m; break; }
        }

        // If no explicit menu found, nothing to do
        if (!menuEl) return;

        // Ensure the menu has the id expected by initMobileMenu
        if (!menuEl.id) menuEl.id = 'nav-menu';
        // Ensure the menu also has the class expected by CSS
        if (!menuEl.classList.contains('nav-menu')) menuEl.classList.add('nav-menu');

        // Ensure a hamburger button exists with ID expected by initMobileMenu
        let hamburger = document.getElementById('hamburger');
        if (!hamburger) {
            hamburger = document.createElement('button');
            hamburger.id = 'hamburger';
            hamburger.type = 'button';
            hamburger.setAttribute('aria-label', 'Toggle navigation');
            hamburger.className = 'hamburger';
            // simple inner structure (three bars) - styling comes from CSS
            hamburger.innerHTML = '<span class="bar"></span><span class="bar"></span><span class="bar"></span>';
            // Insert hamburger before the menu
            nav.insertBefore(hamburger, menuEl);
        }
    },

    /**
     * Adds responsive helper classes to product images across product pages
     */
    enhanceProductImages: function() {
        try {
            const imgs = document.querySelectorAll('.product-images img, .main-image img, .product-details-section img');
            imgs.forEach(img => img.classList.add('responsive-img'));
        } catch (e) {
            // ignore if structure differs
        }
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    AureliaCouture.init();
});