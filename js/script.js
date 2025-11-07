/**
 * TS-Biro Knjigovodstveni Servis - Glavna JavaScript datoteka
 *
 * Ova datoteka sadrži sve funkcionalnosti za web stranicu TS-Biro knjigovodstvenog servisa:
 *
 * 1. Mobilni meni - Upravlja prikazom navigacijskog izbornika na mobilnim uređajima
 * 2. Kontakt forme - Upravlja slanjem i validacijom kontakt formi
 * 3. FAQ sekcija - Upravlja prikazom i skrivanjem odgovora na česta pitanja
 * 4. Testimonial karusel - Prikazuje klijentske iskaze u rotirajućem karuselu
 * 5. Back to top dugme - Omogućava brzi povratak na vrh stranice
 * 6. Cookie suglasnost - Upravlja prihvaćanjem kolačića
 * 7. Obavijesti - Prikazuje korisničke obavijesti
 * 8. Validacija formi - Poboljšana validacija unosnih polja
 * 9. SEO optimizacija - Strukturirani podaci i meta tagovi za bolju pretraživost
 * 10. Lazy loading - Učitanje slika po potrebi za bolje performanse
 * 11. Glatko skrolanje - Glatko pomicanje do anchor linkova
 * 12. Navigacija tipkovnicom - Pristupačnost za korisnike tipkovnice
 * 13. Service Worker registracija - PWA funkcionalnosti
 */

(function () {
    'use strict';

    // Load non-critical CSS
    function loadNonCriticalCSS() {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'css/non-critical.css';
        link.media = 'all';
        document.head.appendChild(link);
        console.log('Non-critical CSS loaded');
    }

    // Load Font Awesome
    function loadFontAwesome() {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
        link.crossOrigin = 'anonymous';
        document.head.appendChild(link);
        console.log('Font Awesome loaded');
    }

    // Initialize all functionality
    function init() {
        console.log('DOM loaded, initializing all functionalities');

        // Load non-critical resources
        loadNonCriticalCSS();
        loadFontAwesome();

        // Initialize all components
        initializeMobileMenu();
        initializeFAQ();
        initializeTestimonialCarousel();
        initializeHeroSlider();
        initializeBackToTop();
        initializeCookieConsent();
        initializeContactForms();
        initializeSmoothScrolling();
        initializeServiceWorker();
        initializeBreadcrumbs();

        console.log('All functionalities successfully initialized');
    }

    // SERVICE WORKER REGISTRATION
    function initializeServiceWorker() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', function () {
                // Use correct path for your GitHub Pages structure
                navigator.serviceWorker.register('./js/service-worker.js')
                    .then(function (registration) {
                        console.log('ServiceWorker registration successful with scope: ', registration.scope);
                    })
                    .catch(function (error) {
                        console.log('ServiceWorker registration failed: ', error);
                        // Optional: Only show error in development
                        if (window.location.hostname === 'localhost') {
                            console.warn('Service Worker not available - this is normal for development');
                        }
                    });
            });
        }
    }

    // BREADCRUMBS INITIALIZATION - Update this function
    function initializeBreadcrumbs() {
        const breadcrumbContainer = document.querySelector('.breadcrumb ol');
        if (!breadcrumbContainer) return;

        const currentPage = document.title.replace('TS-Biro | ', '');
        const currentUrl = window.location.pathname;

        // Remove existing breadcrumbs except home
        const existingItems = breadcrumbContainer.querySelectorAll('li:not(:first-child)');
        existingItems.forEach(item => item.remove());

        // Define page mappings for breadcrumbs
        const pageMappings = {
            '/knjigovodstvo-racunovodstvo.html': 'Računovodstvo',
            '/place-kadrovska-evidencija.html': 'Plaće',
            '/financijsko-poslovno-savjetovanje.html': 'Savjetovanje',
            '/sudsko-vjestacenje.html': 'Vještačenje',
            '/index.html': 'Početna'
        };

        // Add current page to breadcrumbs if not home
        if (currentUrl !== '/' && currentUrl !== '/index.html' && pageMappings[currentUrl]) {
            const currentItem = document.createElement('li');
            currentItem.setAttribute('itemprop', 'itemListElement');
            currentItem.setAttribute('itemscope', '');
            currentItem.setAttribute('itemtype', 'https://schema.org/ListItem');

            currentItem.innerHTML = `
            <span itemprop="name">${pageMappings[currentUrl]}</span>
            <meta itemprop="position" content="2" />
        `;

            breadcrumbContainer.appendChild(currentItem);
        }

        // Update breadcrumb structured data
        updateBreadcrumbStructuredData(currentPage, currentUrl);
    }

    function updateBreadcrumbStructuredData(currentPage, currentUrl) {
        const pageMappings = {
            '/knjigovodstvo-racunovodstvo.html': 'Računovodstvo',
            '/place-kadrovska-evidencija.html': 'Plaće',
            '/financijsko-poslovno-savjetovanje.html': 'Savjetovanje',
            '/sudsko-vjestacenje.html': 'Vještačenje'
        };

        const breadcrumbData = {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
                {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Početna",
                    "item": "https://www.ts-biro.hr/"
                }
            ]
        };

        if (currentUrl !== '/' && currentUrl !== '/index.html' && pageMappings[currentUrl]) {
            breadcrumbData.itemListElement.push({
                "@type": "ListItem",
                "position": 2,
                "name": pageMappings[currentUrl],
                "item": `https://www.ts-biro.hr${currentUrl}`
            });
        }

        // Remove existing breadcrumb script
        const existingScript = document.querySelector('script[data-type="breadcrumb"]');
        if (existingScript) {
            existingScript.remove();
        }

        // Add new breadcrumb script
        const script = document.createElement('script');
        script.setAttribute('type', 'application/ld+json');
        script.setAttribute('data-type', 'breadcrumb');
        script.textContent = JSON.stringify(breadcrumbData);
        document.head.appendChild(script);
    }

    // 1. MOBILE MENU
    function initializeMobileMenu() {
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const navMenu = document.querySelector('.nav-menu');

        if (mobileMenuBtn && navMenu) {
            mobileMenuBtn.addEventListener('click', function () {
                const isExpanded = this.getAttribute('aria-expanded') === 'true';
                this.setAttribute('aria-expanded', !isExpanded);
                navMenu.classList.toggle('active');

                // Update hamburger icon
                const icon = this.querySelector('i');
                if (icon) {
                    icon.className = navMenu.classList.contains('active')
                        ? 'fa-solid fa-times'
                        : 'fa-solid fa-bars';
                }
            });

            // Close menu when clicking on links
            const navLinks = document.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    if (navMenu.classList.contains('active')) {
                        mobileMenuBtn.setAttribute('aria-expanded', 'false');
                        navMenu.classList.remove('active');
                        mobileMenuBtn.querySelector('i').className = 'fa-solid fa-bars';
                    }
                });
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!e.target.closest('.header-container') && navMenu.classList.contains('active')) {
                    mobileMenuBtn.setAttribute('aria-expanded', 'false');
                    navMenu.classList.remove('active');
                    mobileMenuBtn.querySelector('i').className = 'fa-solid fa-bars';
                }
            });
        }
    }

    // 2. FAQ
    function initializeFAQ() {
        const faqQuestions = document.querySelectorAll('.faq-question');

        faqQuestions.forEach(question => {
            question.addEventListener('click', function () {
                const isExpanded = this.getAttribute('aria-expanded') === 'true';
                const answer = this.nextElementSibling;
                const icon = this.querySelector('.faq-icon');

                this.setAttribute('aria-expanded', !isExpanded);
                answer.classList.toggle('active');

                if (icon) {
                    icon.textContent = isExpanded ? '+' : '−';
                }
            });
        });
    }

    // 3. TESTIMONIALS SLIDER
    function initializeTestimonialCarousel() {
        const testimonialsContainer = document.querySelector('.testimonials-container');
        if (!testimonialsContainer) {
            console.log('Testimonials container not found');
            return;
        }

        const testimonials = document.querySelectorAll('.testimonial');
        const prevBtn = document.querySelector('.testimonial-prev');
        const nextBtn = document.querySelector('.testimonial-next');
        const dots = document.querySelectorAll('.testimonial-dot');

        console.log('Found testimonials:', testimonials.length);
        console.log('Found prev button:', !!prevBtn);
        console.log('Found next button:', !!nextBtn);
        console.log('Found dots:', dots.length);

        if (testimonials.length === 0) {
            console.log('No testimonials found');
            return;
        }

        let currentIndex = 0;
        let autoPlayInterval;

        function showTestimonial(index) {
            console.log('Showing testimonial:', index);

            // Hide all testimonials
            testimonials.forEach(testimonial => {
                testimonial.classList.remove('active');
            });

            // Remove active class from all dots
            dots.forEach(dot => {
                dot.classList.remove('active');
            });

            // Show selected testimonial
            if (testimonials[index]) {
                testimonials[index].classList.add('active');
            }

            // Activate corresponding dot
            if (dots[index]) {
                dots[index].classList.add('active');
            }

            currentIndex = index;
            updateButtonStates();
        }

        function updateButtonStates() {
            if (prevBtn) {
                prevBtn.disabled = currentIndex === 0;
                prevBtn.style.opacity = currentIndex === 0 ? '0.5' : '1';
            }

            if (nextBtn) {
                nextBtn.disabled = currentIndex === testimonials.length - 1;
                nextBtn.style.opacity = currentIndex === testimonials.length - 1 ? '0.5' : '1';
            }
        }

        function nextTestimonial() {
            const nextIndex = currentIndex === testimonials.length - 1 ? 0 : currentIndex + 1;
            showTestimonial(nextIndex);
        }

        function prevTestimonial() {
            const prevIndex = currentIndex === 0 ? testimonials.length - 1 : currentIndex - 1;
            showTestimonial(prevIndex);
        }

        function startAutoPlay() {
            if (!autoPlayInterval) {
                autoPlayInterval = setInterval(nextTestimonial, 5000);
                console.log('Auto-play started');
            }
        }

        function stopAutoPlay() {
            if (autoPlayInterval) {
                clearInterval(autoPlayInterval);
                autoPlayInterval = null;
                console.log('Auto-play stopped');
            }
        }

        // Event listeners for navigation buttons
        if (prevBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Previous button clicked');
                stopAutoPlay();
                prevTestimonial();
                startAutoPlay();
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Next button clicked');
                stopAutoPlay();
                nextTestimonial();
                startAutoPlay();
            });
        }

        // Event listeners for dots
        dots.forEach((dot, index) => {
            dot.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Dot clicked:', index);
                stopAutoPlay();
                showTestimonial(index);
                startAutoPlay();
            });
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            const activeTestimonial = testimonialsContainer.querySelector('.testimonial.active');
            if (activeTestimonial && document.activeElement.closest('.testimonials-container')) {
                if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    stopAutoPlay();
                    prevTestimonial();
                    startAutoPlay();
                } else if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    stopAutoPlay();
                    nextTestimonial();
                    startAutoPlay();
                }
            }
        });

        // Pause auto-play on hover
        testimonialsContainer.addEventListener('mouseenter', stopAutoPlay);
        testimonialsContainer.addEventListener('mouseleave', startAutoPlay);

        // Touch swipe support for mobile - FIXED VERSION
        let touchStartX = 0;
        let touchEndX = 0;

        // Fix: Add passive: true to touchstart and touchmove
        testimonialsContainer.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        testimonialsContainer.addEventListener('touchmove', (e) => {
            // Optional: Add touchmove handling if needed
            e.preventDefault(); // Remove this if you want default scroll behavior
        }, { passive: false }); // Set to false if using preventDefault

        testimonialsContainer.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });

        function handleSwipe() {
            const swipeThreshold = 50;
            const swipeDistance = touchEndX - touchStartX;

            if (Math.abs(swipeDistance) > swipeThreshold) {
                if (swipeDistance > 0) {
                    // Swipe right - previous
                    stopAutoPlay();
                    prevTestimonial();
                    startAutoPlay();
                } else {
                    // Swipe left - next
                    stopAutoPlay();
                    nextTestimonial();
                    startAutoPlay();
                }
            }
        }

        // Initialize
        console.log('Initializing testimonials slider');
        showTestimonial(0);
        startAutoPlay();
    }

    // 4. HERO SLIDER
    function initializeHeroSlider() {
        const heroSlider = document.querySelector('.hero-slider');
        if (!heroSlider) return;

        const heroSlides = document.querySelectorAll('.hero-slide');
        const prevButton = document.querySelector('.slider-prev');
        const nextButton = document.querySelector('.slider-next');
        const dots = document.querySelectorAll('.slider-dot');

        if (heroSlides.length === 0) return;

        let currentSlide = 0;
        let heroAutoPlayInterval;

        function showSlide(index) {
            heroSlides.forEach(slide => slide.classList.remove('active'));
            dots.forEach(dot => dot.classList.remove('active'));

            if (heroSlides[index]) heroSlides[index].classList.add('active');
            if (dots[index]) dots[index].classList.add('active');

            currentSlide = index;
        }

        function nextSlide() {
            const nextIndex = currentSlide === heroSlides.length - 1 ? 0 : currentSlide + 1;
            showSlide(nextIndex);
        }

        function prevSlide() {
            const prevIndex = currentSlide === 0 ? heroSlides.length - 1 : currentSlide - 1;
            showSlide(prevIndex);
        }

        function startHeroAutoPlay() {
            if (!heroAutoPlayInterval) {
                heroAutoPlayInterval = setInterval(nextSlide, 6000);
            }
        }

        function stopHeroAutoPlay() {
            if (heroAutoPlayInterval) {
                clearInterval(heroAutoPlayInterval);
                heroAutoPlayInterval = null;
            }
        }

        // Event listeners
        if (prevButton) prevButton.addEventListener('click', () => { stopHeroAutoPlay(); prevSlide(); startHeroAutoPlay(); });
        if (nextButton) nextButton.addEventListener('click', () => { stopHeroAutoPlay(); nextSlide(); startHeroAutoPlay(); });

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => { stopHeroAutoPlay(); showSlide(index); startHeroAutoPlay(); });
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') { e.preventDefault(); stopHeroAutoPlay(); prevSlide(); startHeroAutoPlay(); }
            else if (e.key === 'ArrowRight') { e.preventDefault(); stopHeroAutoPlay(); nextSlide(); startHeroAutoPlay(); }
        });

        // Pause on hover
        heroSlider.addEventListener('mouseenter', stopHeroAutoPlay);
        heroSlider.addEventListener('mouseleave', startHeroAutoPlay);

        // Start auto-play
        startHeroAutoPlay();
    }

    // 5. CONTACT FORMS (INCLUDES VALIDATION)
    function initializeContactForms() {
        const contactForms = document.querySelectorAll('form');

        contactForms.forEach(form => {
            // Add real-time validation
            const inputs = form.querySelectorAll('input[required], textarea[required]');
            inputs.forEach(input => {
                input.addEventListener('blur', () => validateFormField(input));
                input.addEventListener('input', () => {
                    if (input.validity.valid) clearFieldError(input);
                });
            });

            // Form submission
            form.addEventListener('submit', function (e) {
                e.preventDefault();

                const formData = new FormData(this);
                const name = formData.get('name');
                const email = formData.get('email');
                const message = formData.get('message');

                // Validate all required fields
                let isValid = true;
                inputs.forEach(input => {
                    if (!validateFormField(input)) isValid = false;
                });

                if (!isValid) {
                    showNotification('Molimo ispunite sva obavezna polja ispravno.', 'error');
                    return;
                }

                // Email validation
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                    showNotification('Molimo unesite ispravnu email adresu.', 'error');
                    return;
                }

                // Success
                showNotification('Hvala vam na upitu! Kontaktirat ćemo vas u najkraćem mogućem roku.', 'success');
                this.reset();
            });
        });
    }

    // Form validation helper
    function validateFormField(field) {
        clearFieldError(field);

        if (!field.validity.valid) {
            showFieldError(field, getValidationMessage(field));
            return false;
        }

        // Additional email validation
        if (field.type === 'email' && field.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(field.value)) {
                showFieldError(field, 'Molimo unesite ispravnu email adresu.');
                return false;
            }
        }

        return true;
    }

    function showFieldError(field, message) {
        field.classList.add('error');
        let errorElement = field.parentNode.querySelector('.field-error');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'field-error';
            field.parentNode.appendChild(errorElement);
        }
        errorElement.textContent = message;
    }

    function clearFieldError(field) {
        field.classList.remove('error');
        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) errorElement.remove();
    }

    function getValidationMessage(field) {
        if (field.validity.valueMissing) return 'Ovo polje je obavezno.';
        if (field.validity.typeMismatch && field.type === 'email') return 'Molimo unesite ispravnu email adresu.';
        return 'Unos nije ispravan.';
    }

    // 6. SMOOTH SCROLLING
    function initializeSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;

                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    const headerHeight = document.querySelector('header').offsetHeight;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // 7. BACK TO TOP
    function initializeBackToTop() {
        const backToTopButton = document.querySelector('.back-to-top');
        if (!backToTopButton) return;

        window.addEventListener('scroll', () => {
            backToTopButton.classList.toggle('visible', window.pageYOffset > 300);
        });

        backToTopButton.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // 8. COOKIE CONSENT
    function initializeCookieConsent() {
        const cookieConsent = document.querySelector('.cookie-consent');
        const acceptCookies = document.querySelector('#acceptCookies');
        const rejectCookies = document.querySelector('#rejectCookies');

        if (!cookieConsent || localStorage.getItem('cookiesAccepted')) return;

        setTimeout(() => cookieConsent.style.display = 'block', 2000);

        if (acceptCookies) {
            acceptCookies.addEventListener('click', () => {
                localStorage.setItem('cookiesAccepted', 'true');
                cookieConsent.style.display = 'none';
                showNotification('Hvala vam! Kolačići su prihvaćeni.', 'success');
            });
        }

        if (rejectCookies) {
            rejectCookies.addEventListener('click', () => {
                localStorage.setItem('cookiesAccepted', 'false');
                cookieConsent.style.display = 'none';
                showNotification('Kolačići su odbijeni. Neke funkcionalnosti stranice možda neće raditi ispravno.', 'info');
            });
        }
    }

    // 9. NOTIFICATION SYSTEM
    function showNotification(message, type = 'info', duration = 5000) {
        // Remove existing notifications
        document.querySelectorAll('.notification').forEach(notification => notification.remove());

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.setAttribute('role', 'alert');
        notification.setAttribute('aria-live', 'polite');
        notification.innerHTML = `
        <span>${message}</span>
        <button class="notification-close" aria-label="Zatvori obavijest">×</button>
    `;

        document.body.appendChild(notification);

        // Close button
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        });

        // Auto-hide
        if (duration > 0) {
            setTimeout(() => {
                notification.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => notification.remove(), 300);
            }, duration);
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
