        document.getElementById('currentYear').textContent = new Date().getFullYear();

        const schedulePopupOverlay = document.getElementById('schedule-call-popup');
        const openPopupButtons = [
            document.getElementById('heroProfitCheckBtn'),   
            document.getElementById('walkThroughBtn'),      
            document.getElementById('aboutPageContactBtn'),  
            document.getElementById('stickyBookCallBtn'), 
        ];
        
        const closeSchedulePopupBtn = document.getElementById('closeSchedulePopupBtn');
        const chiliPiperCalendarElement = document.getElementById('chiliPiperCalendarElement');
        const chiliPiperLink = "https://toast.chilipiper.com/personal/bardya-banihashemi"; 
        const mainPage1 = document.getElementById('page1');
        const mainPage2 = document.getElementById('page2');
        const backToHomeBtn = document.getElementById('backToHomeBtn');


        function openSchedulePopup(contextSourceElementId) {
            if (chiliPiperCalendarElement) {
                chiliPiperCalendarElement.innerHTML = ''; 
                const iframe = document.createElement('iframe');
                iframe.setAttribute('src', chiliPiperLink);
                iframe.setAttribute('title', 'Book a meeting with Bardya Banihashemi'); 
                chiliPiperCalendarElement.appendChild(iframe);
            }
            
            schedulePopupOverlay.classList.add('active');
            if(mainPage1) mainPage1.setAttribute('aria-hidden', 'true');
            if(mainPage2) mainPage2.setAttribute('aria-hidden', 'true');
            if(document.querySelector('.site-header')) document.querySelector('.site-header').setAttribute('aria-hidden', 'true');
            if(document.querySelector('.site-footer')) document.querySelector('.site-footer').setAttribute('aria-hidden', 'true');
            if(document.getElementById('stickyCta')) document.getElementById('stickyCta').setAttribute('aria-hidden', 'true');


            if(closeSchedulePopupBtn) closeSchedulePopupBtn.focus();
        }

        function closeSchedulePopup() {
            schedulePopupOverlay.classList.remove('active');
            if (chiliPiperCalendarElement) {
                chiliPiperCalendarElement.innerHTML = '<p style="color: #777; padding: 20px; text-align:center;">Loading Scheduler...</p>'; 
            }
            if(mainPage1) mainPage1.removeAttribute('aria-hidden');
            if(mainPage2) mainPage2.removeAttribute('aria-hidden');
            if(document.querySelector('.site-header')) document.querySelector('.site-header').removeAttribute('aria-hidden');
            if(document.querySelector('.site-footer')) document.querySelector('.site-footer').removeAttribute('aria-hidden');
            if(document.getElementById('stickyCta')) document.getElementById('stickyCta').removeAttribute('aria-hidden');
        }

        openPopupButtons.forEach(button => {
            if (button) {
                button.addEventListener('click', (event) => {
                    event.preventDefault(); 
                    openSchedulePopup(button.id);
                });
            }
        });
        
        if(closeSchedulePopupBtn) closeSchedulePopupBtn.addEventListener('click', closeSchedulePopup);

        schedulePopupOverlay.addEventListener('click', function(event) {
            if (event.target === schedulePopupOverlay) {
                closeSchedulePopup();
            }
        });

        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape' && schedulePopupOverlay.classList.contains('active')) {
                closeSchedulePopup();
            }
            if (event.key === 'Tab' && schedulePopupOverlay.classList.contains('active')) {
                const focusableElements = schedulePopupOverlay.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"]), iframe');
                const firstFocusable = focusableElements[0];
                const lastFocusable = focusableElements[focusableElements.length - 1];
                if (event.shiftKey) { 
                    if (document.activeElement === firstFocusable) {
                        lastFocusable.focus();
                        event.preventDefault();
                    }
                } else { 
                    if (document.activeElement === lastFocusable) {
                        firstFocusable.focus();
                        event.preventDefault();
                    }
                }
            }
        });

        document.querySelectorAll('.feature-item, .glass-card, .cta-solid-bg, .local-proof, .video-section, .urgency-bar').forEach(el => {
            if (!el.closest('.animated-section')) {
                 el.classList.add('init-hidden');
            } else if (el.classList.contains('animated-section')) { 
                 el.classList.add('init-hidden');
            }
        });
        
        const observerOptions = { root: null, rootMargin: '0px', threshold: 0.1 };
        const observer = new IntersectionObserver((entries, obs) => { 
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible'); 
                    if (entry.target.classList.contains('animated-section')) {
                        const childAnimatedElements = entry.target.querySelectorAll('.init-hidden:not(.is-visible)'); 
                        childAnimatedElements.forEach(el => el.classList.add('is-visible'));
                    }
                    obs.unobserve(entry.target); 
                }
            });
        }, observerOptions);
        document.querySelectorAll('.animated-section, .init-hidden').forEach(section => observer.observe(section));
        
        const stickyCtaBar = document.getElementById('stickyCta');
        const firstContentSection = document.querySelector('#page1 > main > section:first-of-type'); 
        
        function checkStickyVisibility() {
            if (stickyCtaBar && firstContentSection) {
                stickyCtaBar.classList.toggle('visible', window.scrollY > 100);
            } else if (stickyCtaBar) {
                 stickyCtaBar.classList.toggle('visible', window.scrollY > 150);
            }
        }
        window.addEventListener('scroll', checkStickyVisibility);
        checkStickyVisibility(); 
        
        const navLinks = document.querySelectorAll('.nav-link');
        const pageSections = document.querySelectorAll('.page-section');
        const mobileNavMenu = document.getElementById('mobileNavMenu'); 
        const menuToggleBtn = document.getElementById('menuToggleBtn'); 

        function setActivePage(targetId) {
            pageSections.forEach(section => section.classList.toggle('active', section.id === targetId));
            
            document.querySelectorAll('.main-nav .nav-link').forEach(nav => {
                nav.classList.toggle('active-nav', nav.getAttribute('href') === `#${targetId}`);
            });

            if (mobileNavMenu && mobileNavMenu.classList.contains('active')) {
                mobileNavMenu.classList.remove('active');
                menuToggleBtn.setAttribute('aria-expanded', 'false');
                menuToggleBtn.querySelector('i').classList.remove('fa-times');
                menuToggleBtn.querySelector('i').classList.add('fa-bars');
            }

            const targetPageMainContent = document.getElementById(targetId + '-main-content');
            if (targetPageMainContent) {
                targetPageMainContent.focus({ preventScroll: true }); 
            }
            window.scrollTo(0,0); 
        }


        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                setActivePage(targetId);
            });
        });

        if (backToHomeBtn) {
            backToHomeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                setActivePage('page1');
            });
        }


        if(pageSections.length > 0 && document.getElementById('page1')) document.getElementById('page1').classList.add('active');

        if (menuToggleBtn && mobileNavMenu) {
            menuToggleBtn.addEventListener('click', () => {
                const isExpanded = mobileNavMenu.classList.toggle('active');
                menuToggleBtn.setAttribute('aria-expanded', isExpanded);
                const icon = menuToggleBtn.querySelector('i');
                if (isExpanded) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-times'); 
                } else {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars'); 
                }
            });
        }

        const carousel = document.querySelector('.testimonial-carousel-container');
        const carouselItems = document.querySelectorAll('.testimonial-carousel-item');
        const dotsContainer = document.querySelector('.testimonial-carousel-dots');
        let currentCarouselItem = 0;
        const carouselIntervalTime = 7000; 
        let carouselInterval;
        let touchStartX = 0; let touchEndX = 0; let isDragging = false; 
        const swipeThreshold = 50; 

        function updateDots(activeIndex) {
            if (!dotsContainer) return;
            dotsContainer.querySelectorAll('.carousel-dot').forEach((dot, index) => dot.classList.toggle('active', index === activeIndex));
        }
        
        function showCarouselItem(index) { 
            if (!carouselItems.length || !carouselItems[index] || !carousel) return; 
            carousel.style.transform = `translateX(-${index * 100}%)`;
            carouselItems.forEach((item, i) => item.classList.toggle('active-slide', i === index));
            updateDots(index);
        }

        function cycleCarousel(manual = false, direction = 'next') {
            if (!carouselItems.length) return;
            if (direction === 'next') currentCarouselItem = (currentCarouselItem + 1) % carouselItems.length;
            else currentCarouselItem = (currentCarouselItem - 1 + carouselItems.length) % carouselItems.length;
            showCarouselItem(currentCarouselItem);
            if (manual && carouselInterval) {
                clearInterval(carouselInterval);
                carouselInterval = setInterval(() => cycleCarousel(false), carouselIntervalTime);
            }
        }

        function createDots() {
            if (!dotsContainer || !carouselItems.length) return;
            dotsContainer.innerHTML = ''; 
            carouselItems.forEach((_, index) => {
                const dot = document.createElement('span');
                dot.classList.add('carousel-dot');
                dot.setAttribute('role', 'button');
                dot.setAttribute('tabindex', '0');
                dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
                dot.addEventListener('click', () => {
                    currentCarouselItem = index;
                    showCarouselItem(currentCarouselItem);
                    if (carouselInterval) clearInterval(carouselInterval); 
                    carouselInterval = setInterval(() => cycleCarousel(false), carouselIntervalTime); 
                });
                dot.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        currentCarouselItem = index;
                        showCarouselItem(currentCarouselItem);
                        if (carouselInterval) clearInterval(carouselInterval); 
                        carouselInterval = setInterval(() => cycleCarousel(false), carouselIntervalTime);
                    }
                });
                dotsContainer.appendChild(dot);
            });
        }
        
        if (carousel) { 
            carousel.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX; isDragging = true; 
                if (carouselInterval) clearInterval(carouselInterval); 
            }, {passive: true});
            carousel.addEventListener('touchend', (e) => {
                if (!isDragging) return; 
                touchEndX = e.changedTouches[0].screenX;
                if (touchStartX - touchEndX > swipeThreshold) cycleCarousel(true, 'next');
                else if (touchEndX - touchStartX > swipeThreshold) cycleCarousel(true, 'prev');
                isDragging = false; 
                if (carouselItems.length > 0) carouselInterval = setInterval(() => cycleCarousel(false), carouselIntervalTime);
            });
        }

        if (carouselItems.length > 0) {
            createDots();
            showCarouselItem(currentCarouselItem); 
            carouselInterval = setInterval(() => cycleCarousel(false), carouselIntervalTime); 
        }

        const prevArrow = document.querySelector('.carousel-arrow.prev');
        const nextArrow = document.querySelector('.carousel-arrow.next');

        if (prevArrow && nextArrow && carouselItems.length > 0) {
            prevArrow.addEventListener('click', () => cycleCarousel(true, 'prev'));
            nextArrow.addEventListener('click', () => cycleCarousel(true, 'next'));
        }
