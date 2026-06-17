(function () {
  'use strict';

  // i18n — apply saved language before paint where possible
  if (window.KM_I18N && window.KM_I18N.init) {
    window.KM_I18N.init();
  }

  // Year in footer
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Sticky header shadow
  var header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', function () {
      header.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });
  }

  // Scroll reveal
  var revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length && 'IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('visible'); });
  }

  // Close mobile nav on link click
  var navLinks = document.querySelectorAll('#mainNav .nav-link, #mainNav .btn, .mobile-sticky-btn');
  var navCollapse = document.getElementById('mainNav');
  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      if (navCollapse && navCollapse.classList.contains('show')) {
        var toggler = document.querySelector('.navbar-toggler');
        if (toggler) toggler.click();
      }
    });
  });

  // Coming soon modal for app store buttons
  var comingSoonModal = document.getElementById('comingSoonModal');
  var comingSoonText = document.getElementById('comingSoonText');
  var modalInstance = comingSoonModal ? new bootstrap.Modal(comingSoonModal) : null;

  var storeLabels = {
    customer: 'modal_cs_store_customer',
    rider: 'modal_cs_store_rider'
  };

  document.querySelectorAll('[data-store]').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      if (!modalInstance) return;
      var app = btn.getAttribute('data-app') || 'customer';
      var store = btn.getAttribute('data-store');
      var lang = window.KM_I18N ? window.KM_I18N.current || 'en' : 'en';
      var t = window.KM_I18N ? window.KM_I18N.t.bind(window.KM_I18N) : function (k) { return k; };
      var storeName = store === 'app-store' ? t('modal_app_store', lang) : t('modal_play_store', lang);
      var appKey = storeLabels[app] || storeLabels.customer;
      var suffix = t('modal_cs_store_suffix', lang).replace('{store}', storeName);
      comingSoonText.textContent = t(appKey, lang) + ' ' + suffix;
      modalInstance.show();
    });
  });

  // Legal modals — high-contrast content from i18n
  var legalModal = document.getElementById('legalModal');
  var legalTitle = document.getElementById('legalModalTitle');
  var legalBody = document.getElementById('legalModalBody');
  var legalInstance = legalModal ? new bootstrap.Modal(legalModal) : null;

  var legalKeys = {
    privacy: { title: 'legal_privacy_title', body: 'legal_privacy_body_html' },
    terms: { title: 'legal_terms_title', body: 'legal_terms_body_html' }
  };

  document.querySelectorAll('[data-modal]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      var key = link.getAttribute('data-modal');
      var content = legalKeys[key];
      if (!content || !legalInstance) return;
      var lang = window.KM_I18N ? window.KM_I18N.current || 'en' : 'en';
      var t = window.KM_I18N ? window.KM_I18N.t.bind(window.KM_I18N) : function (k) { return ''; };
      legalTitle.textContent = t(content.title, lang);
      legalBody.innerHTML = t(content.body, lang);
      legalInstance.show();
    });
  });

  // Contact form — open mailto with prefilled body
  var contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = document.getElementById('name').value.trim();
      var email = document.getElementById('email').value.trim();
      var subject = document.getElementById('subject').value;
      var message = document.getElementById('message').value.trim();
      var body = 'From: ' + name + ' (' + email + ')\n\n' + message;
      var mailto = 'mailto:support@kilatmart.com?subject=' +
        encodeURIComponent('[KilatMart] ' + subject) +
        '&body=' + encodeURIComponent(body);
      window.location.href = mailto;
    });
  }

  // Phone mockup animations (customer product rows + rider earnings)
  function animateEarnings(el) {
    var target = parseFloat(el.getAttribute('data-earnings') || '0');
    var valueEl = el.querySelector('.earnings-value');
    if (!valueEl || target <= 0) return;

    var duration = 1400;
    var start = performance.now();

    function tick(now) {
      var progress = Math.min((now - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      valueEl.textContent = (target * eased).toFixed(2);
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }

  function activateMockup(mockup) {
    if (!mockup || mockup.classList.contains('mockup-active')) return;
    mockup.classList.add('mockup-active');

    mockup.querySelectorAll('.product-row-animated').forEach(function (row) {
      row.classList.add('visible');
    });

    var orderCard = mockup.querySelector('.rider-order-slide');
    if (orderCard) orderCard.classList.add('visible');

    var earnings = mockup.querySelector('.earnings-pulse');
    if (earnings) animateEarnings(earnings);
  }

  var mockups = document.querySelectorAll('[data-mockup]');
  if (mockups.length && 'IntersectionObserver' in window) {
    var mockupObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          activateMockup(entry.target);
          mockupObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.35 });

    mockups.forEach(function (m) { mockupObserver.observe(m); });
  } else {
    mockups.forEach(activateMockup);
  }

  // Category chip highlight rotation (customer mockup)
  var catContainers = document.querySelectorAll('.screen-categories');
  catContainers.forEach(function (container) {
    var chips = container.querySelectorAll('span');
    if (chips.length < 2) return;
    var index = 0;
    setInterval(function () {
      chips.forEach(function (c) { c.classList.remove('cat-active'); });
      index = (index + 1) % chips.length;
      chips[index].classList.add('cat-active');
    }, 2200);
  });

  // Mobile sticky CTA — show after hero, hide near footer
  var stickyCta = document.getElementById('mobileStickyCta');
  var heroSection = document.getElementById('hero');
  var contactSection = document.getElementById('contact');

  function updateStickyCta() {
    if (!stickyCta || window.innerWidth > 991) {
      if (stickyCta) stickyCta.classList.remove('is-visible');
      return;
    }
    var scrollY = window.scrollY;
    var heroBottom = heroSection ? heroSection.offsetTop + heroSection.offsetHeight - 120 : 400;
    var contactTop = contactSection ? contactSection.offsetTop - window.innerHeight * 0.5 : Infinity;
    var show = scrollY > heroBottom && scrollY < contactTop;
    stickyCta.classList.toggle('is-visible', show);
    stickyCta.setAttribute('aria-hidden', show ? 'false' : 'true');
  }

  if (stickyCta) {
    window.addEventListener('scroll', updateStickyCta, { passive: true });
    window.addEventListener('resize', updateStickyCta, { passive: true });
    updateStickyCta();
  }
})();
