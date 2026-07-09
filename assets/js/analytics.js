(function () {
  // Add the direct GA4 gtag snippet with the site's measurement ID before this file.
  const browserWindow = typeof window === 'undefined' ? undefined : window;

  function trackEvent(eventName, params = {}) {
    if (!browserWindow) {
      return;
    }

    if (typeof browserWindow.gtag !== 'function') {
      return;
    }

    browserWindow.gtag('event', eventName, params);
  }

  if (browserWindow) {
    browserWindow.BarkeyAnalytics = {
      trackEvent,
    };
  }
}());
