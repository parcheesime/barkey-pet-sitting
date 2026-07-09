const navToggle = document.querySelector('.nav-toggle');
const siteNav = document.querySelector('.site-nav');
const navLinks = document.querySelectorAll('.site-nav a');
const analytics = window.BarkeyAnalytics;

navToggle?.addEventListener('click', () => {
  const isOpen = siteNav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    siteNav.classList.remove('open');
    navToggle?.setAttribute('aria-expanded', 'false');
  });
});

document.addEventListener('click', (event) => {
  if (!(event.target instanceof Element)) {
    return;
  }

  const navLink = event.target.closest('.site-nav a');

  if (navLink) {
    analytics?.trackEvent('nav_click', {
      nav_item: navLink.dataset.analyticsNavItem || navLink.textContent.trim() || navLink.getAttribute('aria-label'),
      nav_location: navLink.dataset.analyticsLocation || 'header',
      location: navLink.dataset.analyticsLocation || 'header',
    });
    return;
  }

  const analyticsTarget = event.target.closest('[data-analytics-event]');

  if (!analyticsTarget) {
    return;
  }

  const eventName = analyticsTarget.dataset.analyticsEvent;
  const location = analyticsTarget.dataset.analyticsLocation;
  const params = {};

  if (eventName === 'agreement_service_select') {
    return;
  }

  if (eventName === 'cta_click') {
    params.button_text = analyticsTarget.dataset.analyticsButtonText || analyticsTarget.textContent.trim() || analyticsTarget.getAttribute('aria-label');
    params.location = location;
  }

  if (eventName === 'meet_greet_click') {
    params.location = location;
  }

  if (eventName === 'calendar_booking_click') {
    params.booking_type = analyticsTarget.dataset.analyticsBookingType;
    params.location = location;
  }

  if (eventName === 'email_click' || eventName === 'phone_click') {
    params.location = location;
  }

  if (eventName === 'service_click') {
    params.service = analyticsTarget.dataset.analyticsService;
    params.location = location;
  }

  if (eventName === 'resource_download') {
    params.resource = analyticsTarget.dataset.analyticsResource;
    params.location = location;
  }

  Object.keys(params).forEach((key) => {
    if (!params[key]) {
      delete params[key];
    }
  });

  analytics?.trackEvent(eventName, params);
});

document.addEventListener('submit', (event) => {
  if (!(event.target instanceof Element)) {
    return;
  }

  const form = event.target.closest('[data-analytics-event="contact_form_submit"]');

  if (!form) {
    return;
  }

  analytics?.trackEvent('contact_form_submit', {
    location: form.dataset.analyticsLocation,
  });
}, true);

document.addEventListener('change', (event) => {
  if (!(event.target instanceof HTMLInputElement) || !event.target.checked) {
    return;
  }

  const analyticsTarget = event.target.closest('[data-analytics-event="agreement_service_select"]');

  if (!analyticsTarget) {
    return;
  }

  analytics?.trackEvent('agreement_service_select', {
    service: analyticsTarget.dataset.analyticsService,
    location: analyticsTarget.dataset.analyticsLocation,
  });
});

document.addEventListener('toggle', (event) => {
  const detail = event.target;

  if (!(detail instanceof HTMLDetailsElement) || !detail.open || detail.dataset.analyticsEvent !== 'faq_expand') {
    return;
  }

  analytics?.trackEvent('faq_expand', {
    question: detail.dataset.analyticsQuestion || detail.querySelector('summary')?.textContent.trim(),
  });
}, true);

if (document.body.dataset.analyticsPage === 'contact-success' && !window.__barkeyContactSuccessTracked) {
  window.__barkeyContactSuccessTracked = true;
  analytics?.trackEvent('contact_success', {
    location: 'contact_thank_you_page',
  });
}

const contactBadges = document.querySelectorAll('.contact-badge');

contactBadges.forEach((badge) => {
  const image = badge.querySelector('.contact-badge__image');
  const defaultSrc = image?.dataset.defaultSrc;
  const hoverSrc = image?.dataset.hoverSrc;

  if (!image || !defaultSrc || !hoverSrc) {
    return;
  }

  const hoverImage = new Image();
  hoverImage.src = hoverSrc;

  const updateImage = () => {
    const isActive = badge.matches(':hover') || document.activeElement === badge;
    image.src = isActive ? hoverSrc : defaultSrc;
  };

  badge.addEventListener('pointerenter', updateImage);
  badge.addEventListener('pointerleave', updateImage);
  badge.addEventListener('focus', updateImage);
  badge.addEventListener('blur', updateImage);
});

const revealItems = document.querySelectorAll('.reveal');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (revealItems.length && prefersReducedMotion) {
  revealItems.forEach((item) => item.classList.add('is-visible'));
} else if (revealItems.length && 'IntersectionObserver' in window) {
  document.documentElement.classList.add('reveal-enabled');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, {
    rootMargin: '0px 0px -10% 0px',
    threshold: 0.12,
  });

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}

const year = document.querySelector('#year');

if (year) {
  year.textContent = new Date().getFullYear();
}
