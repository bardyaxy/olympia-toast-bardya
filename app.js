/**
 * @fileoverview Main JavaScript for website interactions, including popups,
 * animations, navigation, and carousel.
 * @version 1.1.0
 */

// Wait for the DOM to be fully loaded before executing scripts
document.addEventListener('DOMContentLoaded', () => {
  /**
   * ==========================================================================
   * Configuration & Constants
   * ==========================================================================
   */
  const CHILIPIPER_LINK = "https://toast.chilipiper.com/personal/bardya-banihashemi";
  const CAROUSEL_INTERVAL_TIME = 7000; // ms
  const SWIPE_THRESHOLD = 50; // px
  const SCROLL_THRESHOLD_STICKY_CTA = 100; // px

  /**
   * ==========================================================================
   * Element Selectors
   * ==========================================================================
   */

  // General Elements
  const currentYearElement = document.getElementById('currentYear');
  const siteHeader = document.querySelector('.site-header');
  const siteFooter = document.querySelector('.site-footer');

  // Popup Elements
  const schedulePopupOverlay = document.getElementById('schedule-call-popup');
  const openPopupButtons = [
    document.getElementById('heroProfitCheckBtn'),
    document.getElementById('walkThroughBtn'),
    document.getElementById('aboutPageContactBtn'),
    document.getElementById('stickyBookCallBtn'),
  ].filter(Boolean); // Filter out nulls if some buttons don't exist
  const closeSchedulePopupBtn = document.getElementById('closeSchedulePopupBtn');
  const chiliPiperCalendarElement = document.getElementById('chiliPiperCalendarElement');

  // Page Navigation Elements
  const mainPage1 = document.getElementById('page1');
  const mainPage2 = document.getElementById('page2');
  const backToHomeBtn = document.getElementById('backToHomeBtn');
  const navLinks = document.querySelectorAll('.nav-link');
  const pageSections = document.querySelectorAll('.page-section');

  // Mobile Navigation Elements
  const mobileNavMenu = document.getElementById('mobileNavMenu');
  const menuToggleBtn = document.getElementById('menuToggleBtn');

  // Animation & Sticky Elements
  const elementsToAnimate = document.querySelectorAll('.feature-item, .glass-card, .cta-solid-bg, .local-proof, .video-section, .urgency-bar');
  const animatedSectionContainers = document.querySelectorAll('.animated-section');
  const stickyCtaBar = document.getElementById('stickyCta');
  // Using a more robust selector for the first content section if page structure is consistent
  const firstContentSection = mainPage1 ? mainPage1.querySelector('main > section:first-of-type') : null;

  // Carousel Elements
  const carousel = document.querySelector('.testimonial-carousel-container');
  const carouselItems = document.querySelectorAll('.testimonial-carousel-item');
  const dotsContainer = document.querySelector('.testimonial-carousel-dots');
  const prevArrow = document.querySelector('.carousel-arrow.prev');
  const nextArrow = document.querySelector('.carousel-arrow.next');

  /**
   * ==========================================================================
   * State Variables
   * ==========================================================================
   */
  let lastFocusedElementBeforePopup; // For accessibility: restore focus after popup closes
  let currentCarouselItem = 0;
  let carouselInterval;
  let touchStartX = 0;
  let touchEndX = 0;
  let isCarouselDragging = false;

  /**
   * ==========================================================================
   * Utility Functions
   * ==========================================================================
   */

  /**
   * Sets or removes aria-hidden attributes on background elements when a modal is active.
   * @param {boolean} isHidden - True to hide background elements, false to show.
   */
  function toggleBackgroundElementsAriaHidden(isHidden) {
    const elementsToToggle = [
      mainPage1,
      mainPage2,
      siteHeader,
      siteFooter,
      stickyCtaBar // Assuming stickyCtaBar is the ID 'stickyCta'
    ];
    elementsToToggle.forEach(el => {
      if (el) {
        if (isHidden) {
          el.setAttribute('aria-hidden', 'true');
        } else {
          el.removeAttribute('aria-hidden');
        }
      }
    });
  }

  /**
   * ==========================================================================
   * Popup Functionality (Schedule Call)
   * ==========================================================================
   */
  function openSchedulePopup(triggeredByElement) {
    if (!schedulePopupOverlay) return;

    lastFocusedElementBeforePopup = triggeredByElement || document.activeElement; // Store the element that opened the popup

    if (chiliPiperCalendarElement) {
      chiliPiperCalendarElement.innerHTML = ''; // Clear previous content
      const iframe = document.createElement('iframe');
      iframe.setAttribute('src', CHILIPIPER_LINK);
      iframe.setAttribute('title', 'Book a meeting with Bardya Banihashemi');
      // Consider adding sandbox attributes for security if applicable
      // iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-forms');
      chiliPiperCalendarElement.appendChild(iframe);
    }

    schedulePopupOverlay.classList.add('active');
    toggleBackgroundElementsAriaHidden(true);

    // Focus the close button or the iframe for better accessibility
    if (closeSchedulePopupBtn) {
      closeSchedulePopupBtn.focus();
    } else if (chiliPiperCalendarElement && chiliPiperCalendarElement.querySelector('iframe')) {
      // Focusing an iframe directly can be tricky and browser-dependent.
      // Often, it's better to focus the first focusable element within the iframe's content,
      // but that requires cross-origin communication if the iframe content is from a different domain.
      // For now, focusing the close button is a reliable primary approach.
    }
  }

  function closeSchedulePopup() {
    if (!schedulePopupOverlay) return;

    schedulePopupOverlay.classList.remove('active');
    if (chiliPiperCalendarElement) {
      // Replace iframe with a placeholder to stop any loading/activity
      chiliPiperCalendarElement.innerHTML = '<p style="color: #777; padding: 20px; text-align:center;">Scheduler closed.</p>';
    }
    toggleBackgroundElementsAriaHidden(false);

    // Restore focus to the element that opened the popup
    if (lastFocusedElementBeforePopup && typeof lastFocusedElementBeforePopup.focus === 'function') {
      lastFocusedElementBeforePopup.focus();
    }
  }

  // Event Listeners for Popup
  openPopupButtons.forEach(button => {
    button.addEventListener('click', (event) => {
      event.preventDefault();
      openSchedulePopup(button); // Pass the button that triggered the open
    });
  });

  if (closeSchedulePopupBtn) {
    closeSchedulePopupBtn.addEventListener('click', closeSchedulePopup);
  }

  if (schedulePopupOverlay) {
    schedulePopupOverlay.addEventListener('click', (event) => {
      if (event.target === schedulePopupOverlay) { // Close only if overlay itself is clicked
        closeSchedulePopup();
      }
    });

    // Keyboard accessibility for popup (Escape key and Focus Trap)
    schedulePopupOverlay.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        closeSchedulePopup();
      }

      if (event.key === 'Tab' && schedulePopupOverlay.classList.contains('active')) {
        const focusableElements = Array.from(
          schedulePopupOverlay.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"]), iframe'
          )
        ).filter(el => el.offsetParent !== null); // Ensure elements are visible

        if (focusableElements.length === 0) return;

        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];

        if (event.shiftKey) { // Shift + Tab
          if (document.activeElement === firstFocusable) {
            lastFocusable.focus();
            event.preventDefault();
          }
        } else { // Tab
          if (document.activeElement === lastFocusable) {
            firstFocusable.focus();
            event.preventDefault();
          }
        }
      }
    });
  }


  /**
   * ==========================================================================
   * Animations on Scroll (Intersection Observer)
   * ==========================================================================
   */
  function initializeScrollAnimations() {
    // Add 'init-hidden' to elements that should be animated on scroll.
    // This simplifies the initial CSS state. CSS should define .init-hidden { opacity: 0; transform: translateY(20px); }
    // and .is-visible { opacity: 1; transform: translateY(0); transition: ...; }
    elementsToAnimate.forEach(el => {
      // Only add init-hidden if it's not part of an animated-section that handles its children
      if (!el.closest('.animated-section')) {
        el.classList.add('init-hidden');
      }
    });
    animatedSectionContainers.forEach(container => {
      container.classList.add('init-hidden'); // The container itself also animates in
      // Children within an animated-section might also need init-hidden if they have their own staggered animation
      // For simplicity, assuming .animated-section animates as a block, and its direct children
      // that are also in `elementsToAnimate` will be handled by the observer individually if they also have `init-hidden`.
    });


    if ('IntersectionObserver' in window) {
      const observerOptions = {
        root: null, // relative to document viewport
        rootMargin: '0px',
        threshold: 0.1 // 10% of item visible
      };

      const animationObserver = new IntersectionObserver((entries, observerInstance) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            // If an animated-section container becomes visible, make its direct animatable children visible too
            // This is useful if children shouldn't wait for their own intersection.
            if (entry.target.classList.contains('animated-section')) {
              const childAnimatedElements = entry.target.querySelectorAll('.init-hidden');
              childAnimatedElements.forEach(childEl => childEl.classList.add('is-visible'));
            }
            observerInstance.unobserve(entry.target); // Animate only once
          }
        });
      }, observerOptions);

      // Observe all elements marked for animation (individual items and section containers)
      document.querySelectorAll('.init-hidden').forEach(section => animationObserver.observe(section));
    } else {
      // Fallback for browsers that don't support IntersectionObserver: show all elements
      document.querySelectorAll('.init-hidden').forEach(el => el.classList.add('is-visible'));
    }
  }


  /**
   * ==========================================================================
   * Sticky CTA Bar Visibility
   * ==========================================================================
   */
  function checkStickyCtaVisibility() {
    if (stickyCtaBar) {
      // Simplified logic: show after a certain scroll depth.
      // The firstContentSection logic can be added back if a more complex condition is needed.
      const shouldBeVisible = window.scrollY > SCROLL_THRESHOLD_STICKY_CTA;
      stickyCtaBar.classList.toggle('visible', shouldBeVisible);
    }
  }
  // Add a throttle/debounce if scroll events become performance heavy
  window.addEventListener('scroll', checkStickyCtaVisibility);
  checkStickyCtaVisibility(); // Initial check on page load


  /**
   * ==========================================================================
   * Single Page Application (SPA)-like Navigation
   * ==========================================================================
   */
  function setActivePage(targetId) {
    if (!targetId) return;

    pageSections.forEach(section => {
      section.classList.toggle('active', section.id === targetId);
    });

    // Update nav link active states
    document.querySelectorAll('.main-nav .nav-link, .mobile-nav-menu .nav-link').forEach(nav => {
      nav.classList.toggle('active-nav', nav.getAttribute('href') === `#${targetId}`);
    });

    // Close mobile menu if open
    if (mobileNavMenu && mobileNavMenu.classList.contains('active') && menuToggleBtn) {
      mobileNavMenu.classList.remove('active');
      menuToggleBtn.setAttribute('aria-expanded', 'false');
      const icon = menuToggleBtn.querySelector('i');
      if (icon) {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
      }
    }

    // Focus on the main content of the new page for accessibility
    // Assumes each page section has a main landmark or a div with id like "page1-main-content"
    const targetPageMainContent = document.getElementById(`${targetId}-main-content`) || document.getElementById(targetId);
    if (targetPageMainContent) {
      // Setting tabindex -1 allows an element to be focused programmatically
      if (!targetPageMainContent.hasAttribute('tabindex')) {
        targetPageMainContent.setAttribute('tabindex', '-1');
      }
      targetPageMainContent.focus({ preventScroll: true });
    }
    window.scrollTo(0, 0); // Scroll to top of the page
  }

  navLinks.forEach(link => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const targetId = link.getAttribute('href')?.substring(1);
      if (targetId) {
        setActivePage(targetId);
        // Optionally, update URL hash: history.pushState(null, '', `#${targetId}`);
      }
    });
  });

  if (backToHomeBtn) {
    backToHomeBtn.addEventListener('click', (event) => {
      event.preventDefault();
      setActivePage('page1'); // Assuming 'page1' is the ID of the home page section
    });
  }

  // Activate the first page by default if it exists
  if (pageSections.length > 0 && document.getElementById('page1')) {
    setActivePage('page1'); // Set initial active page
  }


  /**
   * ==========================================================================
   * Mobile Menu Toggle
   * ==========================================================================
   */
  if (menuToggleBtn && mobileNavMenu) {
    menuToggleBtn.addEventListener('click', () => {
      const isExpanded = mobileNavMenu.classList.toggle('active');
      menuToggleBtn.setAttribute('aria-expanded', String(isExpanded));
      const icon = menuToggleBtn.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-bars', !isExpanded);
        icon.classList.toggle('fa-times', isExpanded);
      }
    });
  }


  /**
   * ==========================================================================
   * Testimonial Carousel
   * ==========================================================================
   */
  function updateCarouselDots(activeIndex) {
    if (!dotsContainer) return;
    dotsContainer.querySelectorAll('.carousel-dot').forEach((dot, index) => {
      dot.classList.toggle('active', index === activeIndex);
      dot.setAttribute('aria-selected', String(index === activeIndex));
    });
  }

  function showCarouselItem(index) {
    if (!carouselItems.length || !carouselItems[index] || !carousel) return;

    carousel.style.transform = `translateX(-${index * 100}%)`;
    carouselItems.forEach((item, i) => {
      item.classList.toggle('active-slide', i === index);
      item.setAttribute('aria-hidden', String(i !== index));
    });
    updateCarouselDots(index);
    currentCarouselItem = index; // Ensure currentCarouselItem is updated
  }

  function cycleCarousel(manualInteraction = false, direction = 'next') {
    if (!carouselItems.length) return;

    let newIndex;
    if (direction === 'next') {
      newIndex = (currentCarouselItem + 1) % carouselItems.length;
    } else {
      newIndex = (currentCarouselItem - 1 + carouselItems.length) % carouselItems.length;
    }
    showCarouselItem(newIndex);

    // If manually cycled, reset the autoplay timer
    if (manualInteraction && carouselInterval) {
      clearInterval(carouselInterval);
      carouselInterval = setInterval(() => cycleCarousel(false), CAROUSEL_INTERVAL_TIME);
    }
  }

  function createCarouselDots() {
    if (!dotsContainer || !carouselItems.length) return;
    dotsContainer.innerHTML = ''; // Clear existing dots

    carouselItems.forEach((_, index) => {
      const dot = document.createElement('button'); // Use button for better accessibility
      dot.classList.add('carousel-dot');
      dot.setAttribute('type', 'button');
      dot.setAttribute('role', 'tab'); // ARIA role for tablist pattern
      dot.setAttribute('aria-selected', 'false');
      dot.setAttribute('aria-controls', `carousel-item-${index + 1}`); // Link to item
      dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
      dot.addEventListener('click', () => {
        showCarouselItem(index);
        if (carouselInterval) clearInterval(carouselInterval);
        carouselInterval = setInterval(() => cycleCarousel(false), CAROUSEL_INTERVAL_TIME);
      });
      // Keyboard interaction for dots is inherent with <button>
      dotsContainer.appendChild(dot);
    });
  }

  function initializeCarousel() {
    if (!carousel || !carouselItems.length) return;

    // Set ARIA roles for carousel structure
    carousel.setAttribute('role', 'tablist');
    carousel.setAttribute('aria-label', 'Testimonials');
    carouselItems.forEach((item, index) => {
      item.setAttribute('role', 'tabpanel');
      item.setAttribute('id', `carousel-item-${index + 1}`);
      item.setAttribute('aria-roledescription', 'slide');
      item.setAttribute('aria-label', `${index + 1} of ${carouselItems.length}`);
    });

    createCarouselDots();
    showCarouselItem(currentCarouselItem); // Show initial item
    if (carouselItems.length > 1) { // Only start interval if there's more than one item
        carouselInterval = setInterval(() => cycleCarousel(false), CAROUSEL_INTERVAL_TIME);
    }


    // Touch swipe listeners
    carousel.addEventListener('touchstart', (e) => {
      if (carouselItems.length <= 1) return;
      touchStartX = e.changedTouches[0].screenX;
      isCarouselDragging = true;
      if (carouselInterval) clearInterval(carouselInterval); // Pause on touch
    }, { passive: true });

    carousel.addEventListener('touchend', (e) => {
      if (carouselItems.length <= 1 || !isCarouselDragging) return;
      touchEndX = e.changedTouches[0].screenX;
      const deltaX = touchEndX - touchStartX;

      if (Math.abs(deltaX) > SWIPE_THRESHOLD) { // Ensure significant swipe
        if (deltaX < 0) { // Swiped left (next)
          cycleCarousel(true, 'next');
        } else { // Swiped right (prev)
          cycleCarousel(true, 'prev');
        }
      }
      isCarouselDragging = false;
      // Restart interval only if not manually stopped by other means
      if (carouselItems.length > 1) {
         carouselInterval = setInterval(() => cycleCarousel(false), CAROUSEL_INTERVAL_TIME);
      }
    });

    // Arrow navigation
    if (prevArrow && nextArrow && carouselItems.length > 1) {
      prevArrow.addEventListener('click', () => cycleCarousel(true, 'prev'));
      nextArrow.addEventListener('click', () => cycleCarousel(true, 'next'));
    } else if (prevArrow && nextArrow) { // Hide arrows if only one item
        prevArrow.style.display = 'none';
        nextArrow.style.display = 'none';
    }
  }

  /**
   * ==========================================================================
   * Initializations
   * ==========================================================================
   */
  if (currentYearElement) {
    currentYearElement.textContent = new Date().getFullYear();
  }

  initializeScrollAnimations();
  const menuChecklistBtn = document.getElementById("menuChecklistBtn");
  if (menuChecklistBtn) {
    menuChecklistBtn.addEventListener("click", () => {
      if (typeof gtag === "function") {
        gtag("event", "sms_cta_click", { value: "menu_checklist" });
      }
    });
  }

  initializeCarousel();

}); // End DOMContentLoaded
