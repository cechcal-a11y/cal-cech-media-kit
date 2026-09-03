(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // The browser's own scroll-to-#fragment-on-load is unreliable on this page
  // (it was landing short or not moving at all), so land on the target
  // section ourselves, instantly, before switching in smooth scrolling for
  // subsequent same-page nav clicks.
  if (location.hash) {
    var initialTarget = document.querySelector(location.hash);
    if (initialTarget) {
      initialTarget.scrollIntoView({ behavior: 'auto', block: 'start' });
    }
  }
  if (!reduceMotion) {
    document.documentElement.classList.add('smooth-scroll');
  }

  // Header hamburger — opens a full-screen menu (the same 5 section links as
  // the hero's own pill nav, reachable from anywhere on the page, plus a
  // dedicated Contact Me CTA) since the hero's pill menu scrolls out of reach
  // once you leave the hero.
  var menuToggle = document.getElementById('menuToggle');
  var menuClose = document.getElementById('menuClose');
  var siteMenu = document.getElementById('siteMenu');
  if (menuToggle && siteMenu) {
    function closeMenu() {
      siteMenu.classList.remove('is-open');
      siteMenu.setAttribute('aria-hidden', 'true');
      menuToggle.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('menu-open');
    }
    function openMenu() {
      siteMenu.classList.add('is-open');
      siteMenu.setAttribute('aria-hidden', 'false');
      menuToggle.classList.add('is-open');
      menuToggle.setAttribute('aria-expanded', 'true');
      document.body.classList.add('menu-open');
    }
    menuToggle.addEventListener('click', function () {
      if (siteMenu.classList.contains('is-open')) {
        closeMenu();
      } else {
        openMenu();
      }
    });
    if (menuClose) menuClose.addEventListener('click', closeMenu);
    siteMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') closeMenu();
    });
  }

  // Footer copyright year — was hardcoded, so it silently goes stale every January.
  var footerYear = document.getElementById('footerYear');
  if (footerYear) footerYear.textContent = String(new Date().getFullYear());

  var header = document.querySelector('.site-header');
  function onScroll() {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  function setFinalCounts() {
    document.querySelectorAll('[data-count]').forEach(function (el) {
      el.textContent = finalValue(el);
    });
  }

  if (reduceMotion) {
    document.querySelectorAll('.reveal').forEach(function (el) {
      el.classList.add('is-visible');
    });
    setFinalCounts();
    return;
  }

  var revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  document.querySelectorAll('.reveal').forEach(function (el) {
    revealObserver.observe(el);
  });

  // Jumping straight to a section (nav-pill click, "next" arrow, or a direct
  // #hash link/reload) can outrun the scroll-triggered IntersectionObserver
  // above, leaving that section's .reveal content stuck at opacity:0 since it
  // never naturally crossed the visibility threshold. Force-reveal a section's
  // content the moment we navigate to it, independent of scroll timing.
  function revealNow(hash) {
    var target = document.querySelector(hash);
    if (!target) return;
    revealObserver.unobserve(target);
    target.classList.add('is-visible');
    target.querySelectorAll('.reveal').forEach(function (el) {
      revealObserver.unobserve(el);
      el.classList.add('is-visible');
    });
  }

  // Chrome silently drops the browser's native fragment-scroll once
  // scroll-behavior: smooth is already active on <html> (the same Chrome quirk
  // worked around for initial page load above) — so a nav-pill click after
  // load updates the URL hash but never actually scrolls. Do the scroll
  // ourselves instead of relying on default anchor navigation.
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (event) {
      var hash = link.getAttribute('href');
      var target = document.querySelector(hash);
      if (!target) return;
      event.preventDefault();
      revealNow(hash);
      history.pushState(null, '', hash);
      target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    });
  });

  if (location.hash) {
    revealNow(location.hash);
  }

  function finalValue(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var suffix = el.getAttribute('data-suffix') || '';
    var decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
    return target.toFixed(decimals) + suffix;
  }

  function animateCount(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var suffix = el.getAttribute('data-suffix') || '';
    var decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
    var duration = 1200;
    var start = null;

    function step(timestamp) {
      // Browsers pause requestAnimationFrame in a backgrounded tab. Without this
      // bail-out, a visitor who scrolls the stats into view and then switches tabs
      // comes back to numbers frozen partway through the count — "$16K+" where
      // "$100K+" belongs, on the most important figures on the page, with nothing
      // to restart them. Snap to the real value instead.
      if (document.hidden) {
        el.textContent = finalValue(el);
        return;
      }
      if (!start) start = timestamp;
      var progress = Math.min((timestamp - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = target * eased;
      el.textContent = current.toFixed(decimals) + suffix;
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = finalValue(el);
      }
    }
    requestAnimationFrame(step);
  }

  // Belt and braces for the case above: if the tab is hidden at any point, settle
  // every counter that has already started on its true value.
  document.addEventListener('visibilitychange', function () {
    if (!document.hidden) return;
    document.querySelectorAll('[data-count]').forEach(function (el) {
      if (el.textContent.trim() !== '0' + (el.getAttribute('data-suffix') || '')) {
        el.textContent = finalValue(el);
      }
    });
  });

  // "Email Me" is a mailto: link — on a device with no default mail client
  // configured, clicking it just does nothing visible, which reads as broken.
  // Copy the address to the clipboard too, so the click always leaves the
  // visitor with a working fallback and a visible confirmation either way.
  // Uses the legacy execCommand copy (a hidden textarea + select + copy),
  // not navigator.clipboard.writeText — that async API can trigger a
  // browser permission prompt on some setups, which is worse than doing
  // nothing; execCommand is synchronous and prompt-free on a real click.
  var emailLink = document.querySelector('a[href^="mailto:"]');
  var emailToast, emailToastTimeout;
  function showEmailToast(email) {
    if (!emailToast) {
      emailToast = document.createElement('div');
      emailToast.className = 'email-toast';
      emailToast.setAttribute('role', 'status');
      document.body.appendChild(emailToast);
    }
    emailToast.textContent = 'Copied ' + email + ' to clipboard';
    emailToast.classList.add('is-visible');
    clearTimeout(emailToastTimeout);
    emailToastTimeout = setTimeout(function () {
      emailToast.classList.remove('is-visible');
    }, 2600);
  }
  if (emailLink) {
    emailLink.addEventListener('click', function () {
      var email = emailLink.getAttribute('href').replace('mailto:', '').split('?')[0];
      var scratch = document.createElement('textarea');
      scratch.value = email;
      scratch.setAttribute('readonly', '');
      scratch.style.position = 'fixed';
      scratch.style.top = '-1000px';
      document.body.appendChild(scratch);
      scratch.select();
      scratch.setSelectionRange(0, email.length);
      try {
        if (document.execCommand('copy')) showEmailToast(email);
      } catch (e) {}
      document.body.removeChild(scratch);
    });
  }

  var statsSection = document.querySelector('#stats');
  if (statsSection) {
    var countObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          countObserver.unobserve(entry.target);
          entry.target.querySelectorAll('[data-count]').forEach(animateCount);
        });
      },
      { threshold: 0.3 }
    );
    countObserver.observe(statsSection);
  }
})();
