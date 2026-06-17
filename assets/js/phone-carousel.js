(function () {
  'use strict';

  var viewport = document.getElementById('phoneCarouselViewport');
  var track = document.getElementById('phoneCarouselTrack');
  var dotsWrap = document.getElementById('phoneCarouselDots');
  var carousel = document.getElementById('phoneCarousel');

  if (!viewport || !track || !dotsWrap) return;

  var slides = track.querySelectorAll('.phone-carousel-slide');
  var dots = dotsWrap.querySelectorAll('.carousel-dot');
  var currentIndex = 0;
  var autoplayTimer = null;
  var touchStartX = 0;
  var activatedSlides = {};

  function getSlideWidth() {
    var slide = slides[0];
    if (!slide) return viewport.clientWidth;
    var style = window.getComputedStyle(track);
    var gap = parseFloat(style.gap) || 0;
    return slide.offsetWidth + gap;
  }

  function scrollToIndex(index, smooth) {
    if (index < 0 || index >= slides.length) return;
    currentIndex = index;
    var left = slides[index].offsetLeft - (viewport.clientWidth - slides[index].offsetWidth) / 2;
    viewport.scrollTo({ left: left, behavior: smooth !== false ? 'smooth' : 'auto' });
    updateDots(index);
    activateSlideMockup(slides[index]);
  }

  function updateDots(index) {
    dots.forEach(function (dot, i) {
      var active = i === index;
      dot.classList.toggle('active', active);
      dot.setAttribute('aria-selected', active ? 'true' : 'false');
    });
  }

  function getNearestIndex() {
    var center = viewport.scrollLeft + viewport.clientWidth / 2;
    var nearest = 0;
    var minDist = Infinity;
    slides.forEach(function (slide, i) {
      var slideCenter = slide.offsetLeft + slide.offsetWidth / 2;
      var dist = Math.abs(center - slideCenter);
      if (dist < minDist) {
        minDist = dist;
        nearest = i;
      }
    });
    return nearest;
  }

  function animateEarnings(el) {
    var target = parseFloat(el.getAttribute('data-earnings') || '0');
    var valueEl = el.querySelector('.earnings-value');
    if (!valueEl || target <= 0 || el.dataset.animated === '1') return;
    el.dataset.animated = '1';
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

  function activateSlideMockup(slide) {
    if (!slide || activatedSlides[slide.dataset.slide]) return;
    activatedSlides[slide.dataset.slide] = true;

    slide.querySelectorAll('.product-row-animated').forEach(function (row) {
      row.classList.add('visible');
    });

    var orderCard = slide.querySelector('.rider-order-slide');
    if (orderCard) orderCard.classList.add('visible');

    var earnings = slide.querySelector('.earnings-pulse');
    if (earnings) animateEarnings(earnings);
  }

  function onScroll() {
    var idx = getNearestIndex();
    if (idx !== currentIndex) {
      currentIndex = idx;
      updateDots(idx);
      activateSlideMockup(slides[idx]);
    }
  }

  function startAutoplay() {
    stopAutoplay();
    if (window.innerWidth > 991 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    autoplayTimer = setInterval(function () {
      if (!carousel || !isInView()) return;
      var next = (currentIndex + 1) % slides.length;
      scrollToIndex(next, true);
    }, 4500);
  }

  function stopAutoplay() {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  }

  function isInView() {
    if (!carousel) return false;
    var rect = carousel.getBoundingClientRect();
    return rect.top < window.innerHeight && rect.bottom > 0;
  }

  dots.forEach(function (dot) {
    dot.addEventListener('click', function () {
      var idx = parseInt(dot.getAttribute('data-index'), 10);
      scrollToIndex(idx, true);
      stopAutoplay();
      startAutoplay();
    });
  });

  viewport.addEventListener('scroll', function () {
    window.requestAnimationFrame(onScroll);
  }, { passive: true });

  viewport.addEventListener('touchstart', function (e) {
    touchStartX = e.changedTouches[0].screenX;
    stopAutoplay();
  }, { passive: true });

  viewport.addEventListener('touchend', function (e) {
    var diff = touchStartX - e.changedTouches[0].screenX;
    if (Math.abs(diff) > 40) {
      var idx = diff > 0 ? Math.min(currentIndex + 1, slides.length - 1) : Math.max(currentIndex - 1, 0);
      scrollToIndex(idx, true);
    }
    startAutoplay();
  }, { passive: true });

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) stopAutoplay();
    else startAutoplay();
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth > 991) {
      stopAutoplay();
    } else {
      scrollToIndex(currentIndex, false);
      startAutoplay();
    }
  }, { passive: true });

  // Category chip rotation inside carousel customer slide
  var catContainer = track.querySelector('.carousel-cats');
  if (catContainer) {
    var chips = catContainer.querySelectorAll('span');
    if (chips.length > 1) {
      var catIdx = 0;
      setInterval(function () {
        if (!isInView() || currentIndex !== 1) return;
        chips.forEach(function (c) { c.classList.remove('cat-active'); });
        catIdx = (catIdx + 1) % chips.length;
        chips[catIdx].classList.add('cat-active');
      }, 2200);
    }
  }

  // Init first slide
  activateSlideMockup(slides[0]);
  scrollToIndex(0, false);
  startAutoplay();

  // Re-activate on i18n change (text only; mockups stay)
  window.addEventListener('km-lang-changed', function () {
    scrollToIndex(currentIndex, false);
  });
})();
