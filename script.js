/* ============================================================
   Brake Painting interactions
   Vanilla JS: sticky header, mobile nav, scroll reveal,
   active-nav highlight, gallery lightbox, form validation
   ============================================================ */
(function () {
  'use strict';

  /* ---- current year ---- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---- sticky header shadow ---- */
  var header = document.getElementById('siteHeader');
  if (header) {
    var onScroll = function () {
      if (window.scrollY > 10) header.classList.add('scrolled');
      else header.classList.remove('scrolled');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---- mobile nav toggle ---- */
  var toggle = document.getElementById('navToggle');
  var mobileNav = document.getElementById('mobileNav');
  if (toggle && mobileNav) {
    var closeNav = function () {
      toggle.setAttribute('aria-expanded', 'false');
      mobileNav.hidden = true;
    };
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      mobileNav.hidden = open;
    });
    mobileNav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closeNav);
    });
  }

  /* ---- scroll reveal ---- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---- active nav highlight ---- */
  var navLinks = document.querySelectorAll('.primary-nav a');
  var sections = [];
  navLinks.forEach(function (l) {
    var id = l.getAttribute('href').slice(1);
    var sec = document.getElementById(id);
    if (sec) sections.push({ link: l, sec: sec });
  });
  if ('IntersectionObserver' in window && sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          navLinks.forEach(function (l) { l.classList.remove('active'); });
          var match = sections.find(function (s) { return s.sec === e.target; });
          if (match) match.link.classList.add('active');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { spy.observe(s.sec); });
  }

  /* ============================================================
     LIGHTBOX
     ============================================================ */
  var lb = document.getElementById('lightbox');
  if (lb) {
  var shots = Array.prototype.slice.call(document.querySelectorAll('.shot, .g-item'));
  var lbImg = document.getElementById('lbImg');
  var lbCap = document.getElementById('lbCap');
  var lbClose = document.getElementById('lbClose');
  var lbPrev = document.getElementById('lbPrev');
  var lbNext = document.getElementById('lbNext');
  var current = 0;
  var lastFocused = null;

  function showShot(i) {
    current = (i + shots.length) % shots.length;
    var fig = shots[current];
    var img = fig.querySelector('img');
    lbImg.src = fig.getAttribute('data-full') || img.src;
    lbImg.alt = img.alt;
    lbCap.textContent = fig.getAttribute('data-caption') || '';
  }
  function openLb(i) {
    lastFocused = document.activeElement;
    showShot(i);
    lb.hidden = false;
    lb.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    lbClose.focus();
  }
  function closeLb() {
    lb.hidden = true;
    lb.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastFocused) lastFocused.focus();
  }
  shots.forEach(function (fig, i) {
    fig.setAttribute('tabindex', '0');
    fig.setAttribute('role', 'button');
    fig.addEventListener('click', function () { openLb(i); });
    fig.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLb(i); }
    });
  });
  lbClose.addEventListener('click', closeLb);
  lbPrev.addEventListener('click', function () { showShot(current - 1); });
  lbNext.addEventListener('click', function () { showShot(current + 1); });
  lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
  document.addEventListener('keydown', function (e) {
    if (lb.hidden) return;
    if (e.key === 'Escape') closeLb();
    else if (e.key === 'ArrowLeft') showShot(current - 1);
    else if (e.key === 'ArrowRight') showShot(current + 1);
  });
  }

  /* ============================================================
     FORM VALIDATION
     ============================================================ */
  var form = document.getElementById('estimateForm');
  if (form) {
  var success = document.getElementById('formSuccess');
  var errorBox = document.getElementById('formError');

  var validators = {
    name: function (v) { return v.trim().length >= 2 || 'Please enter your name.'; },
    phone: function (v) {
      var digits = v.replace(/\D/g, '');
      return (digits.length >= 10 && digits.length <= 15) || 'Enter a valid phone number.';
    },
    email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) || 'Enter a valid email address.'; },
    project_type: function (v) { return v !== '' || 'Choose a project type.'; },
    address: function (v) { return v.trim().length >= 3 || 'Enter your address or ZIP.'; }
  };

  function validateField(field) {
    var fn = validators[field.name];
    if (!fn) return true;
    var res = fn(field.value);
    var wrap = field.closest('.field');
    var errEl = wrap.querySelector('.error');
    if (res === true) {
      wrap.classList.remove('invalid');
      if (errEl) errEl.textContent = '';
      return true;
    }
    wrap.classList.add('invalid');
    if (errEl) errEl.textContent = res;
    return false;
  }

  Object.keys(validators).forEach(function (name) {
    var field = form.elements[name];
    if (!field) return;
    field.addEventListener('blur', function () { validateField(field); });
    field.addEventListener('input', function () {
      if (field.closest('.field').classList.contains('invalid')) validateField(field);
    });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var ok = true;
    var firstBad = null;
    Object.keys(validators).forEach(function (name) {
      var field = form.elements[name];
      if (field && !validateField(field)) {
        ok = false;
        if (!firstBad) firstBad = field;
      }
    });
    if (!ok) { if (firstBad) firstBad.focus(); return; }

    /* Submit to Formspree via fetch so we can show an inline confirmation
       instead of redirecting to Formspree's own thank-you page. */
    var submitBtn = form.querySelector('button[type="submit"]');
    if (errorBox) errorBox.hidden = true;
    submitBtn.disabled = true;
    submitBtn.setAttribute('aria-busy', 'true');

    fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { 'Accept': 'application/json' }
    }).then(function (response) {
      if (response.ok) {
        form.hidden = true;
        success.hidden = false;
        success.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        return response.json().then(function () { throw new Error('submit_failed'); });
      }
    }).catch(function () {
      submitBtn.disabled = false;
      submitBtn.removeAttribute('aria-busy');
      if (errorBox) {
        errorBox.hidden = false;
        errorBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  });
  }

  /* ============================================================
     WHY BRAKE MOBILE CAROUSEL (homepage only)
     At <=640px, #why .why-grid becomes an auto-advancing sliding
     carousel (one card at a time, ~2.5s per card). At wider
     widths it is unwrapped back to the normal static grid, so
     desktop is never touched.
     ============================================================ */
  var whySection = document.getElementById('why');
  if (whySection) {
    var whyTrack = whySection.querySelector('.why-grid');
    if (whyTrack) {
      var whySlides = Array.prototype.slice.call(whyTrack.children);
      var whyCount = whySlides.length;
      var whyMq = window.matchMedia('(max-width: 640px)');
      var whyViewport = null;
      var whyTimer = null;
      var whyIndex = 0;

      var whyGoTo = function (i) {
        whyIndex = (i + whyCount) % whyCount;
        whyTrack.style.transform = 'translateX(-' + (whyIndex * (100 / whyCount)) + '%)';
      };
      var whyStart = function () {
        if (whyTimer || whyCount < 2) return;
        whyTimer = setInterval(function () { whyGoTo(whyIndex + 1); }, 2500);
      };
      var whyStop = function () {
        if (whyTimer) { clearInterval(whyTimer); whyTimer = null; }
      };
      var whyEnable = function () {
        if (whyViewport) { whyStart(); return; }
        whyViewport = document.createElement('div');
        whyViewport.className = 'why-carousel-viewport';
        whyViewport.setAttribute('role', 'region');
        whyViewport.setAttribute('aria-label', 'Why Brake highlights');
        whyTrack.parentNode.insertBefore(whyViewport, whyTrack);
        whyViewport.appendChild(whyTrack);
        whyTrack.classList.add('why-carousel-track');
        whyTrack.style.width = (whyCount * 100) + '%';
        whySlides.forEach(function (li) {
          li.style.flex = '0 0 ' + (100 / whyCount) + '%';
          li.classList.add('in');
        });
        whyIndex = 0;
        whyTrack.style.transform = 'translateX(0%)';
        whyStart();
      };
      var whyDisable = function () {
        whyStop();
        if (!whyViewport) return;
        whyTrack.classList.remove('why-carousel-track');
        whyTrack.style.width = '';
        whyTrack.style.transform = '';
        whySlides.forEach(function (li) { li.style.flex = ''; });
        whyViewport.parentNode.insertBefore(whyTrack, whyViewport);
        whyViewport.parentNode.removeChild(whyViewport);
        whyViewport = null;
      };
      var whySync = function (e) { if (e.matches) whyEnable(); else whyDisable(); };

      if (whyMq.addEventListener) whyMq.addEventListener('change', whySync);
      else if (whyMq.addListener) whyMq.addListener(whySync);

      if (whyMq.matches) whyEnable();

      document.addEventListener('visibilitychange', function () {
        if (document.hidden) whyStop(); else if (whyViewport) whyStart();
      });
    }
  }
})();
