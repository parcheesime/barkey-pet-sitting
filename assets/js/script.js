const navToggle = document.querySelector('.nav-toggle');
const siteNav = document.querySelector('.site-nav');
const navLinks = document.querySelectorAll('.site-nav a');

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

const year = document.querySelector('#year');

if (year) {
  year.textContent = new Date().getFullYear();
}
