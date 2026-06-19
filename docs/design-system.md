# Starkey Pet Sitting Design System Notes

## Foundation

- Logo font: Poiret One
- Heading font: Josefin Sans
- Body font: Nunito
- Primary CTA class: `.cta-button`
- Text links use the sitewide underline, hover color, and `:focus-visible` outline defined in `assets/css/styles.css`.

## Breakpoints

CSS custom properties document the breakpoint names in `:root`, but media queries use literal values because custom properties do not work in `@media` conditions.

- Mobile: `max-width: 767px`
  - Single-column cards, downloads, values, and tighter header/hero spacing.
- Tablet: `max-width: 1023px`
  - Mobile navigation appears, two-column cards are allowed, and main two-column page layouts collapse.
- Desktop: `min-width: 1024px`
  - Full navigation, wider gutters, and current multi-column homepage layout.

These values come from the existing layout: the nav and hero grid need the tablet shift below 1024px, while service/download/value grids need the single-column mobile shift below 768px.
