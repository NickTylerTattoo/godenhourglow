/* ═══════════════════════════════════════════════════════════
   GOLDEN HOUR GLOW — interactions
   ═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var STILL = location.search.indexOf('still') !== -1;
  if (STILL) document.documentElement.classList.add('still');

  /* ───── Hero video: always autoplay the looping clip for every visitor.
     (?still swaps it for a static poster only so screenshot tooling can capture
     an idle page — real visitors never use that flag.) ───── */
  var heroVideo = document.querySelector('.phone__video');
  if (heroVideo) {
    if (STILL) {
      var poster = heroVideo.getAttribute('poster');
      var img = document.createElement('img');
      img.src = poster;
      img.className = heroVideo.className;
      img.setAttribute('alt', heroVideo.getAttribute('aria-label') || '');
      heroVideo.parentNode.replaceChild(img, heroVideo);
    } else {
      heroVideo.muted = true;          // required for muted autoplay
      heroVideo.loop = true;
      var tryPlay = function () {
        var p = heroVideo.play();
        if (p && p.catch) p.catch(function () {});
      };
      tryPlay();
      heroVideo.addEventListener('canplay', tryPlay, { once: true });
      // Fallback: if autoplay is blocked, start on the first user interaction
      document.addEventListener('touchstart', tryPlay, { once: true, passive: true });
      document.addEventListener('click', tryPlay, { once: true });
    }
  }

  /* ───── Footer year ───── */
  var yr = document.getElementById('year');
  if (yr) yr.textContent = new Date().getFullYear();

  /* ───── Preloader ───── */
  var preloader = document.getElementById('preloader');
  var fill = document.getElementById('preloader-fill');
  var num = document.getElementById('preloader-num');

  function finishLoad() {
    if (preloader) preloader.classList.add('done');
    document.body.style.overflow = '';
  }

  if (STILL) {
    finishLoad();
  } else {
    document.body.style.overflow = 'hidden';
    var pct = 0;
    var tick = setInterval(function () {
      pct += Math.random() * 16 + 6;
      if (pct >= 100) { pct = 100; clearInterval(tick); setTimeout(finishLoad, 380); }
      if (fill) fill.style.width = pct + '%';
      if (num) num.textContent = ('0' + Math.floor(pct)).slice(-2);
    }, 130);
    // safety: never trap the user
    setTimeout(finishLoad, 4200);
  }

  /* ───── Nav scroll state + progress bar ───── */
  var nav = document.getElementById('nav');
  var progress = document.getElementById('scroll-progress');
  function onScroll() {
    var y = window.pageYOffset || document.documentElement.scrollTop;
    if (nav) nav.classList.toggle('scrolled', y > 40);
    if (progress) {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ───── Mobile menu ───── */
  var burger = document.getElementById('hamburger');
  var menu = document.getElementById('mobile-menu');
  function setMenu(open) {
    if (!burger || !menu) return;
    burger.classList.toggle('open', open);
    menu.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    menu.setAttribute('aria-hidden', open ? 'false' : 'true');
    document.body.style.overflow = open ? 'hidden' : '';
  }
  if (burger) burger.addEventListener('click', function () { setMenu(!menu.classList.contains('open')); });
  if (menu) {
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { setMenu(false); });
    });
  }

  /* ───── Scroll reveal ───── */
  var reveals = document.querySelectorAll('.reveal');
  if (STILL || !('IntersectionObserver' in window)) {
    reveals.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  }

  /* ───── Interactive tap-to-reveal bomb ───── */
  var stage = document.getElementById('demoStage');
  var bomb = document.getElementById('demoBomb');
  var prize = document.getElementById('demoPrize');
  var again = document.getElementById('demoAgain');
  var nameEl = prize ? prize.querySelector('.demo__name') : null;
  var valueEl = prize ? prize.querySelector('.demo__value') : null;

  var TREASURES = [
    { name: 'Rose-Gold Solitaire', value: '$180' },
    { name: 'Sunset Halo Ring', value: '$240' },
    { name: 'Pavé Tennis Bracelet', value: '$320' },
    { name: 'Amber Drop Necklace', value: '$150' },
    { name: 'Starlight Stud Earrings', value: '$95' },
    { name: 'Golden Hour "Fire" Ring', value: '$1,500' }
  ];
  var pick = 0;

  function spawnBubbles() {
    if (!bomb || STILL) return;
    for (var i = 0; i < 14; i++) {
      (function (i) {
        var b = document.createElement('span');
        b.className = 'bubble';
        var off = (Math.random() * 80 - 40);
        b.style.setProperty('--bx', 'calc(-50% + ' + off + 'px)');
        b.style.left = (50 + (Math.random() * 30 - 15)) + '%';
        b.style.width = b.style.height = (8 + Math.random() * 12) + 'px';
        b.style.animationDelay = (i * 40) + 'ms';
        bomb.appendChild(b);
        setTimeout(function () { b.remove(); }, 1200 + i * 40);
      })(i);
    }
  }

  function reveal() {
    if (!stage || !prize) return;
    var t = TREASURES[pick % TREASURES.length];
    pick++;
    if (nameEl) nameEl.innerHTML = 'You revealed the <b>' + t.name + '</b>';
    if (valueEl) valueEl.innerHTML = 'Appraised value · <b>' + t.value + '</b>';
    stage.classList.add('fizz');
    spawnBubbles();
    setTimeout(function () {
      prize.classList.add('show');
      prize.setAttribute('aria-hidden', 'false');
      stage.classList.remove('fizz');
    }, STILL ? 0 : 780);
  }

  function reset() {
    if (!prize) return;
    prize.classList.remove('show');
    prize.setAttribute('aria-hidden', 'true');
  }

  if (bomb) bomb.addEventListener('click', reveal);
  if (again) again.addEventListener('click', function (e) {
    e.stopPropagation();
    reset();
    setTimeout(reveal, 260);
  });
})();
