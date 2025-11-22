// Back-to-top button, mobile nav toggle, and social handlers
(function () {
	'use strict';

	// Back to top button
	const backToTopBtn = document.getElementById('backToTopBtn');
	function checkScroll() {
		if (!backToTopBtn) return;
		if (window.scrollY > 240) {
			backToTopBtn.style.opacity = '1';
			backToTopBtn.style.transform = 'translateY(0)';
			backToTopBtn.style.pointerEvents = 'auto';
		} else {
			backToTopBtn.style.opacity = '0';
			backToTopBtn.style.transform = 'translateY(8px)';
			backToTopBtn.style.pointerEvents = 'none';
		}
	}

	if (backToTopBtn) {
		// initial state
		backToTopBtn.style.transition = 'opacity .25s ease, transform .25s ease';
		backToTopBtn.style.opacity = '0';
		backToTopBtn.style.transform = 'translateY(8px)';
		backToTopBtn.style.pointerEvents = 'none';

		backToTopBtn.addEventListener('click', function () {
			window.scrollTo({ top: 0, behavior: 'smooth' });
		});

		window.addEventListener('scroll', checkScroll, { passive: true });
		// run once on load
		checkScroll();
	}

	// Mobile nav toggle (inject button if missing)
	const nav = document.querySelector('.navbar');
	const navMenu = document.querySelector('.nav-menu');

	function createMobileToggle() {
		if (!nav || !navMenu) return null;
		let existing = document.getElementById('mobileToggle');
		if (existing) return existing;

		const btn = document.createElement('button');
		btn.id = 'mobileToggle';
		btn.type = 'button';
		btn.setAttribute('aria-expanded', 'false');
		btn.setAttribute('aria-label', 'Toggle navigation');
		btn.innerHTML = '&#9776;'; // hamburger
		btn.style.fontSize = '20px';
		btn.style.background = 'transparent';
		btn.style.border = 'none';
		btn.style.cursor = 'pointer';
		btn.style.color = 'var(--purple, #5b2e8a)';

		// insert before sign-up button if present
		const signUp = nav.querySelector('.sign-up-btn');
		nav.insertBefore(btn, signUp || nav.firstChild);
		return btn;
	}

	function toggleNavDisplay(expand) {
		if (!navMenu) return;
		const isExpanded = typeof expand === 'boolean' ? expand : navMenu.style.display === 'none' || getComputedStyle(navMenu).display === 'none';
		if (isExpanded) {
			navMenu.style.display = 'flex';
			navMenu.style.flexDirection = 'column';
			navMenu.style.gap = '12px';
		} else {
			navMenu.style.display = 'none';
		}
	}

	const mobileToggle = createMobileToggle();
	if (mobileToggle) {
		// set initial display based on viewport
		if (window.innerWidth <= 700) {
			navMenu.style.display = 'none';
		} else {
			navMenu.style.display = '';
		}

		mobileToggle.addEventListener('click', function () {
			const expanded = mobileToggle.getAttribute('aria-expanded') === 'true';
			mobileToggle.setAttribute('aria-expanded', String(!expanded));
			// toggle
			toggleNavDisplay(!expanded);
		});

		// Reset nav display on resize
		window.addEventListener('resize', function () {
			if (window.innerWidth > 700) {
				navMenu.style.display = '';
				mobileToggle.setAttribute('aria-expanded', 'false');
			} else {
				navMenu.style.display = 'none';
			}
		});
	}

	// Social click handler referenced by inline onclick attributes
	window.socialClick = function (platform) {
		const map = {
			Facebook: 'https://www.facebook.com',
			Instagram: 'https://www.instagram.com',
			X: 'https://twitter.com'
		};
		const url = map[platform] || '#';
		// open in new tab
		if (url === '#') {
			console.log('Social click:', platform);
		} else {
			window.open(url, '_blank', 'noopener');
		}
	};

	// Smooth scroll for anchor links within page
	document.addEventListener('click', function (e) {
		const target = e.target.closest('a[href^="#"]');
		if (!target) return;
		const href = target.getAttribute('href');
		if (href === '#' || href === '#!') return;
		const el = document.querySelector(href);
		if (el) {
			e.preventDefault();
			el.scrollIntoView({ behavior: 'smooth', block: 'start' });
		}
	});

})();

