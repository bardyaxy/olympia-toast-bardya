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
  const CAROUSEL_INTERVAL_TIME = 6300; // ms (10% faster)
  const SWIPE_THRESHOLD = 50; // px
  const SCROLL_THRESHOLD_STICKY_CTA = 100; // px
  const SCROLL_THRESHOLD_BACK_TO_TOP = 300; // px

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
    document.getElementById('resourcesContactBtn'),
    document.getElementById('stickyBookCallBtn'),
  ].filter(Boolean);
  const heroProfitCheckBtn = document.getElementById('heroProfitCheckBtn');
  const walkThroughBtnEl = document.getElementById('walkThroughBtn');
  const resourcesContactBtn = document.getElementById('resourcesContactBtn');
  const closeSchedulePopupBtn = document.getElementById('closeSchedulePopupBtn');
  const chiliPiperCalendarElement = document.getElementById('chiliPiperCalendarElement');

  // Page Navigation Elements
  const mainPage1 = document.getElementById('page1');
  const mainPage2 = document.getElementById('page2');
  const mainPage3 = document.getElementById('page3');
  const mainPage4 = document.getElementById('page4');
  const backToHomeBtn = document.getElementById('backToHomeBtn');
  const resourcesBackBtn = document.getElementById('resourcesBackBtn');
  const aboutMeBackBtn = document.getElementById('aboutMeBackBtn');
  const navLinks = document.querySelectorAll('.nav-link');
  const pageSections = document.querySelectorAll('.page-section');

  // Mobile Navigation Elements
  const mobileNavMenu = document.getElementById('mobileNavMenu');
  const menuToggleBtn = document.getElementById('menuToggleBtn');

  // Animation & Sticky Elements
  const elementsToAnimate = document.querySelectorAll('.feature-item, .glass-card, .cta-solid-bg, .local-proof, .video-section, .urgency-bar');
  const animatedSectionContainers = document.querySelectorAll('.animated-section');
  const stickyCtaBar = document.getElementById('stickyCta');
  const backToTopBtn = document.getElementById('backToTopBtn');
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
  let lastFocusedElementBeforePopup;
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

  function toggleBackgroundElementsAriaHidden(isHidden) {
    const elementsToToggle = [
      mainPage1,
      mainPage2,
      mainPage3,
      mainPage4,
      siteHeader,
      siteFooter,
      stickyCtaBar
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

    lastFocusedElementBeforePopup = triggeredByElement || document.activeElement;

    if (chiliPiperCalendarElement) {
      chiliPiperCalendarElement.innerHTML = '';
      const iframe = document.createElement('iframe');
      iframe.setAttribute('src', CHILIPIPER_LINK);
      iframe.setAttribute('title', 'Book a meeting with Bardya Banihashemi');
      chiliPiperCalendarElement.appendChild(iframe);
    }

    schedulePopupOverlay.classList.add('active');
    toggleBackgroundElementsAriaHidden(true);

    if (closeSchedulePopupBtn) {
      closeSchedulePopupBtn.focus();
    }
  }

  function closeSchedulePopup() {
    if (!schedulePopupOverlay) return;

    schedulePopupOverlay.classList.remove('active');
    if (chiliPiperCalendarElement) {
      chiliPiperCalendarElement.innerHTML = '<p style="color: #777; padding: 20px; text-align:center;">Scheduler closed.</p>';
    }
    toggleBackgroundElementsAriaHidden(false);

    if (lastFocusedElementBeforePopup && typeof lastFocusedElementBeforePopup.focus === 'function') {
      lastFocusedElementBeforePopup.focus();
    }
  }

  openPopupButtons.forEach(button => {
    button.addEventListener('click', (event) => {
      event.preventDefault();
      openSchedulePopup(button);
    });
  });

  if (closeSchedulePopupBtn) {
    closeSchedulePopupBtn.addEventListener('click', closeSchedulePopup);
  }

  if (schedulePopupOverlay) {
    schedulePopupOverlay.addEventListener('click', (event) => {
      if (event.target === schedulePopupOverlay) {
        closeSchedulePopup();
      }
    });

    schedulePopupOverlay.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        closeSchedulePopup();
      }
      if (event.key === 'Tab' && schedulePopupOverlay.classList.contains('active')) {
        const focusableElements = Array.from(
          schedulePopupOverlay.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"]), iframe'
          )
        ).filter(el => el.offsetParent !== null);

        if (!focusableElements.length) return;

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
  }

  /**
   * ==========================================================================
   * Animations on Scroll (Intersection Observer)
   * ==========================================================================
   */
  function initializeScrollAnimations() {
    elementsToAnimate.forEach(el => {
      if (!el.closest('.animated-section')) {
        el.classList.add('init-hidden');
      }
    });
    animatedSectionContainers.forEach(container => {
      container.classList.add('init-hidden');
    });

    if ('IntersectionObserver' in window) {
      const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
      };

      const animationObserver = new IntersectionObserver((entries, observerInstance) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            if (entry.target.classList.contains('animated-section')) {
              entry.target.querySelectorAll('.init-hidden').forEach(childEl => childEl.classList.add('is-visible'));
            }
            observerInstance.unobserve(entry.target);
          }
        });
      }, observerOptions);

      document.querySelectorAll('.init-hidden').forEach(section => animationObserver.observe(section));
    } else {
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
      const shouldBeVisible = window.scrollY > SCROLL_THRESHOLD_STICKY_CTA;
      stickyCtaBar.classList.toggle('visible', shouldBeVisible);
    }
  }
  window.addEventListener('scroll', checkStickyCtaVisibility);
  checkStickyCtaVisibility();

  /**
   * ==========================================================================
   * Back to Top Button Visibility
   * ==========================================================================
   */
  function checkBackToTopVisibility() {
    if (backToTopBtn) {
      const shouldBeVisible = window.scrollY > SCROLL_THRESHOLD_BACK_TO_TOP;
      backToTopBtn.classList.toggle('visible', shouldBeVisible);
    }
  }
  window.addEventListener('scroll', checkBackToTopVisibility);
  checkBackToTopVisibility();

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

    document.querySelectorAll('.main-nav .nav-link, .mobile-nav-menu .nav-link').forEach(nav => {
      nav.classList.toggle('active-nav', nav.getAttribute('href') === `#${targetId}`);
    });

    if (mobileNavMenu && mobileNavMenu.classList.contains('active') && menuToggleBtn) {
      mobileNavMenu.classList.remove('active');
      menuToggleBtn.setAttribute('aria-expanded', 'false');
      const icon = menuToggleBtn.querySelector('i');
      if (icon) {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
      }
    }

    const targetPageMainContent = document.getElementById(`${targetId}-main-content`) || document.getElementById(targetId);
    if (targetPageMainContent) {
      if (!targetPageMainContent.hasAttribute('tabindex')) {
        targetPageMainContent.setAttribute('tabindex', '-1');
      }
      targetPageMainContent.focus({ preventScroll: true });
    }
    window.scrollTo(0, 0);
  }

  navLinks.forEach(link => {
    link.addEventListener("click", event => {
      const href = link.getAttribute("href");
      if (href && href.startsWith("#")) {
        event.preventDefault();
        const targetId = href.substring(1);
        if (targetId) setActivePage(targetId);
      }
    });
  });

  if (backToHomeBtn) {
    backToHomeBtn.addEventListener('click', event => {
      event.preventDefault();
      setActivePage('page1');
    });
  }

  if (resourcesBackBtn) {
    resourcesBackBtn.addEventListener('click', event => {
      event.preventDefault();
      setActivePage('page1');
    });
  }

  if (aboutMeBackBtn) {
    aboutMeBackBtn.addEventListener('click', event => {
      event.preventDefault();
      setActivePage('page1');
    });
  }

  if (pageSections.length > 0 && document.getElementById('page1')) {
    setActivePage('page1');
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
    currentCarouselItem = index;
  }

  function cycleCarousel(manualInteraction = false, direction = 'next') {
    if (!carouselItems.length) return;

    let newIndex = direction === 'next'
      ? (currentCarouselItem + 1) % carouselItems.length
      : (currentCarouselItem - 1 + carouselItems.length) % carouselItems.length;

    showCarouselItem(newIndex);

    if (manualInteraction && carouselInterval) {
      clearInterval(carouselInterval);
      carouselInterval = setInterval(() => cycleCarousel(false), CAROUSEL_INTERVAL_TIME);
    }
  }

  function createCarouselDots() {
    if (!dotsContainer || !carouselItems.length) return;
    dotsContainer.innerHTML = '';

    carouselItems.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.classList.add('carousel-dot');
      dot.setAttribute('type', 'button');
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-selected', 'false');
      dot.setAttribute('aria-controls', `carousel-item-${index + 1}`);
      dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
      dot.addEventListener('click', () => {
        showCarouselItem(index);
        if (carouselInterval) clearInterval(carouselInterval);
        carouselInterval = setInterval(() => cycleCarousel(false), CAROUSEL_INTERVAL_TIME);
      });
      dotsContainer.appendChild(dot);
    });
  }

  function initializeCarousel() {
    if (!carousel || !carouselItems.length) return;

    carousel.setAttribute('role', 'tablist');
    carousel.setAttribute('aria-label', 'Testimonials');
    carouselItems.forEach((item, index) => {
      item.setAttribute('role', 'tabpanel');
      item.setAttribute('id', `carousel-item-${index + 1}`);
      item.setAttribute('aria-roledescription', 'slide');
      item.setAttribute('aria-label', `${index + 1} of ${carouselItems.length}`);
    });

    createCarouselDots();
    showCarouselItem(currentCarouselItem);
    if (carouselItems.length > 1) {
      carouselInterval = setInterval(() => cycleCarousel(false), CAROUSEL_INTERVAL_TIME);
    }

    carousel.addEventListener('touchstart', e => {
      if (carouselItems.length <= 1) return;
      touchStartX = e.changedTouches[0].screenX;
      isCarouselDragging = true;
      if (carouselInterval) clearInterval(carouselInterval);
    }, { passive: true });

    carousel.addEventListener('touchend', e => {
      if (carouselItems.length <= 1 || !isCarouselDragging) return;
      touchEndX = e.changedTouches[0].screenX;
      const deltaX = touchEndX - touchStartX;

      if (Math.abs(deltaX) > SWIPE_THRESHOLD) {
        if (deltaX < 0) {
          cycleCarousel(true, 'next');
        } else {
          cycleCarousel(true, 'prev');
        }
      }
      isCarouselDragging = false;
      if (carouselItems.length > 1) {
        carouselInterval = setInterval(() => cycleCarousel(false), CAROUSEL_INTERVAL_TIME);
      }
    });

    if (prevArrow && nextArrow && carouselItems.length > 1) {
      prevArrow.addEventListener('click', () => cycleCarousel(true, 'prev'));
      nextArrow.addEventListener('click', () => cycleCarousel(true, 'next'));
    } else if (prevArrow && nextArrow) {
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

  const promoTextEl = document.getElementById('promoText');
  if (promoTextEl) {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const now = new Date();
    const monthName = monthNames[now.getMonth()];
    promoTextEl.textContent = `${monthName} Promotion: Olympia restaurants receive complimentary menu optimization consultations this month.`;
  }

  // analytics tracking for CTA clicks
  if (heroProfitCheckBtn) {
    heroProfitCheckBtn.addEventListener('click', () => {
      if (typeof gtag === 'function') {
        gtag('event', 'hero_cta_click');
      }
    });
  }

  if (walkThroughBtnEl) {
    walkThroughBtnEl.addEventListener('click', () => {
      if (typeof gtag === 'function') {
        gtag('event', 'walkthrough_cta_click');
      }
    });
  }

  if (resourcesContactBtn) {
    resourcesContactBtn.addEventListener('click', () => {
      if (typeof gtag === 'function') {
        gtag('event', 'resources_contact_click');
      }
    });
  }

  initializeScrollAnimations();

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

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