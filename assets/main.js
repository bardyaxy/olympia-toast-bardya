        document.addEventListener('DOMContentLoaded', () => {
            document.querySelectorAll('[data-chili-trigger]').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const chiliReady = window.ChiliPiper && typeof ChiliPiper.submit === 'function';
                    const targetUrl = btn.getAttribute('href');
                    if (chiliReady) {
                        e.preventDefault();
                    }
                    if (typeof gtag === 'function') {
                        const eventName = btn.id ? btn.id + '_click' : 'cta_click';
                        gtag('event', eventName);
                    }
                    if (chiliReady) {
                        let fallback;

                        const cleanup = () => btn.classList.remove('cta-loading');
                        btn.classList.add('cta-loading');
                        try {
                            fallback = setTimeout(() => {
                                cleanup();
                                if (targetUrl) window.location.href = targetUrl;
                            }, 500);
                            const result = ChiliPiper.submit('toast', 'me', { skipLandingPage: true });
                            if (result && typeof result.then === 'function') {
                                result.then(() => {
                                    clearTimeout(fallback);
                                    cleanup();
                                }).catch(() => {
                                    clearTimeout(fallback);
                                    cleanup();
        if (targetUrl) window.location.href = targetUrl;
                                });
                            }
                        } catch (err) {
                            if (fallback) clearTimeout(fallback);
                            cleanup();

                            if (targetUrl) window.location.href = targetUrl;
                        }
                    }
                });
            });
            // Mobile Menu Toggle
            const mobileMenuButton = document.getElementById('mobile-menu-button');
            const mobileMenu = document.getElementById('mobile-menu');
            if (mobileMenuButton && mobileMenu) {
                mobileMenuButton.addEventListener('click', () => {
                    const isExpanded = mobileMenu.classList.toggle('hidden');
                    mobileMenuButton.setAttribute('aria-expanded', String(!isExpanded));
                });
            }

            // Testimonial Slider
            const track = document.getElementById('testimonial-track');
            const slides = Array.from(track ? track.children : []);
            const nextButton = document.getElementById('next-testimonial');
            const prevButton = document.getElementById('prev-testimonial');
            let slideWidth = 0;
            let currentIndex = 0;

            function updateSlideWidthAndPosition() {
                if (slides.length > 0 && slides[0] && track) { 
                    slideWidth = slides[0].getBoundingClientRect().width;
                    track.style.transform = 'translateX(-' + slideWidth * currentIndex + 'px)';
                } else {
                    slideWidth = 0; 
                }
                if (prevButton) prevButton.disabled = currentIndex === 0;
                if (nextButton) nextButton.disabled = currentIndex >= slides.length - 1;
            }

            function moveToSlide(newIndex) {
                if (!track || (slideWidth === 0 && slides.length > 0)) { 
                     updateSlideWidthAndPosition(); 
                }
                if (slideWidth === 0 && slides.length > 0 && !track.offsetWidth) { // Check if track itself has width
                    // Fallback if track width isn't available (e.g., display: none initially)
                    // This might not be perfect but tries to avoid complete failure.
                    console.warn("Testimonial track width is not available, slider might not position correctly.");
                    return;
                }
                
                currentIndex = Math.max(0, Math.min(newIndex, slides.length - 1));
                if (track) { 
                    track.style.transform = 'translateX(-' + slideWidth * currentIndex + 'px)';
                }
                if (prevButton) prevButton.disabled = currentIndex === 0;
                if (nextButton) nextButton.disabled = currentIndex >= slides.length - 1;
            }
            
            if (track && slides.length > 0) {
                // Defer initial calculation slightly to ensure layout is complete
                setTimeout(() => {
                    updateSlideWidthAndPosition(); 
                    if(nextButton) nextButton.addEventListener('click', () => moveToSlide(currentIndex + 1));
                    if(prevButton) prevButton.addEventListener('click', () => moveToSlide(currentIndex - 1));
                }, 100);
                
                let resizeTimeout;
                window.addEventListener('resize', () => {
                    clearTimeout(resizeTimeout);
                    resizeTimeout = setTimeout(updateSlideWidthAndPosition, 150); 
                });

            } else if (slides.length <= 1) {
                if(prevButton) prevButton.style.display = 'none';
                if(nextButton) nextButton.style.display = 'none';
            }

            // Smooth Scrolling for Anchor Links
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function (e) {
                    const targetId = this.getAttribute('href');
                    if (!targetId || !targetId.startsWith('#') || targetId === '#') return; 
                    
                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                        e.preventDefault(); 
                        if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                            mobileMenu.classList.add('hidden');
                            if (mobileMenuButton) mobileMenuButton.setAttribute('aria-expanded', 'false');
                        }
                        
                        const header = document.getElementById('page-header');
                        const headerOffset = header ? header.offsetHeight : 0; 
                        const elementPosition = targetElement.getBoundingClientRect().top;
                        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                        
                        window.scrollTo({
                            top: offsetPosition,
                            behavior: 'smooth'
                        });
                    }
                });
            });

            // Set Current Year in Footer
            const currentYearElement = document.getElementById('currentYear');
            if (currentYearElement) {
                currentYearElement.textContent = new Date().getFullYear();
            }

            // Footer Sticky CTA Button Logic
            const footerCtaButton = document.getElementById('footer-sticky-cta');
            const scrollShowThreshold = 200; 
            let isStickyActive = false; 
            
            if (footerCtaButton) {
                const originalButtonText = "Discuss Your Growth";
                const stickyButtonText = '<svg class="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12.75 12.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM7.5 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM8.25 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM9.75 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM10.5 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM12.75 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM14.25 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM15 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM16.5 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM15 12.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM16.5 13.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"/><path fill-rule="evenodd" d="M6.75 2.25A.75.75 0 0 1 7.5 3v1.5h9V3A.75.75 0 0 1 18 3v1.5h.75a3 3 0 0 1 3 3v11.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V7.5a3 3 0 0 1 3-3H6V3a.75.75 0 0 1 .75-.75Zm13.5 9a1.5 1.5 0 0 0-1.5-1.5H5.25a1.5 1.5 0 0 0-1.5 1.5v7.5a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5v-7.5Z" clip-rule="evenodd"/></svg> Plan Growth';
                
                footerCtaButton.innerHTML = originalButtonText; 
                footerCtaButton.classList.remove('opacity-0', 'transform', 'translate-y-full');
                footerCtaButton.classList.add('hide-sticky');


                const checkSticky = () => {
                    const shouldBeSticky = window.scrollY > scrollShowThreshold;
                    if (shouldBeSticky && !isStickyActive) {
                        isStickyActive = true;
                        footerCtaButton.innerHTML = stickyButtonText;
                        footerCtaButton.classList.remove('hide-sticky');
                        footerCtaButton.classList.add('is-sticky');
                    } else if (!shouldBeSticky && isStickyActive) {
                        isStickyActive = false;
                        footerCtaButton.innerHTML = originalButtonText;
                        footerCtaButton.classList.remove('is-sticky');
                        footerCtaButton.classList.add('hide-sticky');
                    }
                };
                window.addEventListener('scroll', checkSticky, { passive: true }); 
                checkSticky(); // Initial check
            }

            // Intersection Observer for Scroll Animations
            const animatedElements = document.querySelectorAll('.animate-on-scroll');
            if ("IntersectionObserver" in window) {
                const observer = new IntersectionObserver((entries, obs) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('is-visible');
                            // obs.unobserve(entry.target); // Keep observing if you want animations to replay
                        } else {
                            // To make animations replay when scrolling back up (optional):
                            // entry.target.classList.remove('is-visible');
                        }
                    });
                }, {
                    threshold: 0.1, // 10% of element is visible
                });

                animatedElements.forEach(el => {
                    observer.observe(el);
                });
            } else {
                // Fallback for older browsers: just make them visible
                animatedElements.forEach(el => {
                    el.classList.add('is-visible');
                });
            }

            // Intersection Observer for Active Nav Links
            const navLinks = document.querySelectorAll('a[data-section]');
            const navSections = Array.from(navLinks)
                .map(link => document.getElementById(link.getAttribute('data-section')))
                .filter(Boolean);

            if (navSections.length && "IntersectionObserver" in window) {
                const navObserver = new IntersectionObserver(entries => {
                    entries.forEach(entry => {
                        navLinks.forEach(link => {
                            if (link.getAttribute('data-section') === entry.target.id) {
                                if (entry.isIntersecting) {
                                    link.classList.add('active-nav');
                                } else {
                                    link.classList.remove('active-nav');
                                }
                            }
                        });
                    });
                }, {
                    rootMargin: '-50% 0px -50% 0px'
                });

                navSections.forEach(section => navObserver.observe(section));
            }

        });
