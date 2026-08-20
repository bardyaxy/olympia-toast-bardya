document.addEventListener('DOMContentLoaded', () => {
  const menuButton = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');
  const introVideo = document.getElementById('intro-video');
  const videoPoster = document.getElementById('video-poster');
  const mobileCta = document.getElementById('mobile-cta-bar');
  const hero = document.getElementById('top');
  const finalCta = document.getElementById('cta');
  const footer = document.querySelector('.site-footer');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function closeMenu() {
    if (!menuButton || !mobileMenu) return;
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open navigation menu');
    mobileMenu.hidden = true;
    document.body.classList.remove('menu-open');
  }

  if (menuButton && mobileMenu) {
    menuButton.addEventListener('click', () => {
      const willOpen = menuButton.getAttribute('aria-expanded') !== 'true';
      menuButton.setAttribute('aria-expanded', String(willOpen));
      menuButton.setAttribute('aria-label', willOpen ? 'Close navigation menu' : 'Open navigation menu');
      mobileMenu.hidden = !willOpen;
      document.body.classList.toggle('menu-open', willOpen);
    });

    mobileMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeMenu);
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 820) closeMenu();
    });
  }

  if (videoPoster && introVideo) {
    videoPoster.addEventListener('click', async () => {
      videoPoster.classList.add('is-hidden');
      try {
        await introVideo.play();
      } catch (_error) {
        introVideo.controls = true;
      }
    });

    introVideo.addEventListener('ended', () => {
      videoPoster.classList.remove('is-hidden');
    });
  }

  document.querySelectorAll('[data-chili-trigger]').forEach((button) => {
    button.addEventListener('click', (event) => {
      const chiliReady = window.ChiliPiper && typeof window.ChiliPiper.submit === 'function';
      const targetUrl = button.getAttribute('href');

      if (typeof window.gtag === 'function') {
        window.gtag('event', button.id ? `${button.id}_click` : 'cta_click');
      }

      if (!chiliReady) return;

      event.preventDefault();
      button.classList.add('cta-loading');

      let fallbackTimer;
      const finish = () => button.classList.remove('cta-loading');

      try {
        fallbackTimer = window.setTimeout(() => {
          finish();
          if (targetUrl) window.location.href = targetUrl;
        }, 900);

        const result = window.ChiliPiper.submit('toast', 'me', { skipLandingPage: true });
        if (result && typeof result.then === 'function') {
          result
            .then(() => {
              window.clearTimeout(fallbackTimer);
              finish();
            })
            .catch(() => {
              window.clearTimeout(fallbackTimer);
              finish();
              if (targetUrl) window.location.href = targetUrl;
            });
        }
      } catch (_error) {
        window.clearTimeout(fallbackTimer);
        finish();
        if (targetUrl) window.location.href = targetUrl;
      }
    });
  });

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (event) => {
      const targetId = anchor.getAttribute('href');
      if (!targetId || targetId === '#') return;
      const target = document.querySelector(targetId);
      if (!target) return;

      event.preventDefault();
      closeMenu();
      target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
    });
  });

  const currentYear = document.getElementById('currentYear');
  if (currentYear) currentYear.textContent = String(new Date().getFullYear());

  const revealElements = document.querySelectorAll('.reveal:not(.is-visible)');
  if (reducedMotion || !('IntersectionObserver' in window)) {
    revealElements.forEach((element) => element.classList.add('is-visible'));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.14, rootMargin: '0px 0px -40px' },
    );
    revealElements.forEach((element) => revealObserver.observe(element));
  }

  const navLinks = document.querySelectorAll('a[data-section]');
  const navSections = [...navLinks]
    .map((link) => document.getElementById(link.getAttribute('data-section')))
    .filter(Boolean);

  if ('IntersectionObserver' in window && navSections.length) {
    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          navLinks.forEach((link) => {
            link.classList.toggle('active-nav', link.getAttribute('data-section') === entry.target.id);
          });
        });
      },
      { rootMargin: '-35% 0px -55% 0px' },
    );
    navSections.forEach((section) => navObserver.observe(section));
  }

  if (mobileCta && hero && finalCta && footer) {
    mobileCta.hidden = false;
    let heroVisible = true;
    let finalCtaVisible = false;
    let footerVisible = false;

    const updateMobileCta = () => {
      const shouldShow = window.innerWidth <= 620 && !heroVisible && !finalCtaVisible && !footerVisible;
      mobileCta.classList.toggle('is-visible', shouldShow);
      mobileCta.setAttribute('aria-hidden', String(!shouldShow));
    };

    const stickyObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target === hero) heroVisible = entry.isIntersecting;
          if (entry.target === finalCta) finalCtaVisible = entry.isIntersecting;
          if (entry.target === footer) footerVisible = entry.isIntersecting;
        });
        updateMobileCta();
      },
      { threshold: 0.06 },
    );

    stickyObserver.observe(hero);
    stickyObserver.observe(finalCta);
    stickyObserver.observe(footer);
    window.addEventListener('resize', updateMobileCta, { passive: true });
    updateMobileCta();
  }
});
