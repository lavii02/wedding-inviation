/* patch.js — fixes for Shubham & Anushriya wedding site */
(function () {
  'use strict';

  /* ── 1. Hide footwear viewport (images 404) ── */
  var style = document.createElement('style');
  style.textContent =
    '.wardrobe-footwear-vp { display: none !important; }' +
    '.events-subtitle { color: #F7E9C8 !important; opacity: 1 !important; }' +
    '.wardrobe-theme-label { display: flex; flex-direction: column; align-items: center; }' +
    '.wardrobe-theme-text { order: 1; }' +
    '.wardrobe-theme-desc { order: 2; }' +
    '.wardrobe-theme-color-img { display: none; width: min(55%, 180px); height: auto; margin: 0 auto; }' +
    '.wardrobe-theme-color-img.is-active { display: block; }' +
    '.wardrobe-theme-palette { order: 3; display: flex; justify-content: center; width: 100%; margin-top: -12px; }';
  document.head.appendChild(style);

  /* ── 2. Force-init events + wardrobe without waiting for intro tap ── */
  function forceInitSections () {
    var track = document.getElementById('events-track');
    var btns = document.getElementById('wardrobe-btns');
    var mainContent = document.getElementById('main-content');

    if (!mainContent || !mainContent.classList.contains('is-visible')) return;

    if (track && track.children.length === 0 && window.SITE && SITE.events && SITE.events.length) {
      buildEventCards(track);
    }

    if (btns && btns.children.length === 0 && window.SITE && SITE.wardrobe && SITE.wardrobe.items && SITE.wardrobe.items.length) {
      buildWardrobeRail(btns);
    }
  }

  if ('MutationObserver' in window) {
    var mo = new MutationObserver(function () { forceInitSections(); });
    var mc = document.getElementById('main-content');
    if (mc) mo.observe(mc, { attributes: true, attributeFilter: ['class'] });
  }

  setTimeout(forceInitSections, 500);
  setTimeout(forceInitSections, 2000);
  setTimeout(forceInitSections, 5000);

  /* ── 3. Build event cards (mirrors script.js logic) ── */
  var EVENT_THEMES = {
    'coastal-affair': { accent: '#CDAA66', clrTitle: '#2F5560', clrDateTime: '#5D554A', clrVenue: '#5F9691', clrQuote: '#35444A', clrQuoteFade: 'rgba(255,244,220,0.45)', bgImg: 'assets/Event/coastal-affair-bg.webp', coupleImg: 'assets/Event/coastal-affair-couple.webp', fallbackBg: 'linear-gradient(160deg,#1a3028 0%,#2c4a3e 100%)', moodClass: 'coastal-light-card' },
    'sangeet': { accent: '#D8A64F', clrTitle: '#FFF0D3', clrDateTime: '#FFF1C2', clrVenue: '#FFD580', clrQuote: '#FFF0D3', clrQuoteFade: 'rgba(20,22,20,0.38)', bgImg: 'assets/Event/sangeet-bg.webp', coupleImg: 'assets/Event/sangeet-couple.webp', fallbackBg: 'linear-gradient(160deg,#0e2c2c 0%,#1a4040 100%)', moodClass: 'dark-card celestial-night' },
    'baraat': { accent: '#C88A34', clrTitle: '#563922', clrDateTime: '#3F3328', clrVenue: '#B86D28', clrQuote: '#3F2A1B', clrQuoteFade: 'rgba(255,244,220,0.46)', bgImg: 'assets/Event/baraat-bg.webp', coupleImg: 'assets/Event/baraat-couple.webp', fallbackBg: 'linear-gradient(160deg,#2e1a08 0%,#4a2e10 100%)', moodClass: 'warm-light-card' },
    'phere': { accent: '#C08442', clrTitle: '#7B302D', clrDateTime: '#755441', clrVenue: '#A86638', clrQuote: '#FFF1D8', clrQuoteFade: 'rgba(60,28,22,0.42)', bgImg: 'assets/Event/phere-bg.webp', coupleImg: 'assets/Event/phere-couple.webp', fallbackBg: 'linear-gradient(160deg,#1e1008 0%,#321a0a 100%)', moodClass: 'floral-light-card forever-begins' },
    'varmala': { accent: '#D29A89', clrTitle: '#7C3A38', clrDateTime: '#54372F', clrVenue: '#B96A5F', clrQuote: '#FFF1D8', clrQuoteFade: 'rgba(75,35,30,0.34)', bgImg: 'assets/Event/varmala-bg.webp', coupleImg: 'assets/Event/varmala-couple.webp', fallbackBg: 'linear-gradient(160deg,#2e1010 0%,#4a2020 100%)', moodClass: 'floral-light-card moment-in-gold' },
    'welcome-lunch': { accent: '#C9A968', clrTitle: '#4B4134', clrDateTime: '#5C5348', clrVenue: '#5C9394', clrQuote: '#3F342A', clrQuoteFade: 'rgba(255,244,220,0.45)', bgImg: 'assets/Event/welcome-lunch-bg.webp', coupleImg: 'assets/Event/welcome-lunch-couple.webp', fallbackBg: 'linear-gradient(160deg,#1a3535 0%,#2c4e4e 100%)', moodClass: 'light-card' }
  };

  function buildEventCards (track) {
    window.__patchBuiltEvents = true;
    var dotsWrap = document.getElementById('events-dots');
    var prevBtn = document.getElementById('events-prev');
    var nextBtn = document.getElementById('events-next');
    var events = SITE.events;
    var cardsHTML = '';
    var dotsHTML = '';

    events.forEach(function (e, idx) {
      var t = EVENT_THEMES[e.theme] || EVENT_THEMES['coastal-affair'];
      var cssVars = '--evt-accent:' + t.accent + ';--evt-title:' + t.clrTitle + ';--evt-datetime:' + t.clrDateTime + ';--evt-venue:' + t.clrVenue + ';--evt-quote:' + t.clrQuote + ';--evt-quote-fade:' + t.clrQuoteFade + ';';
      cardsHTML +=
        '<article class="event-card ' + t.moodClass + '" data-event-id="' + e.theme + '" data-card-idx="' + idx + '" aria-label="' + e.name + '" style="' + cssVars + '">' +
          '<div class="event-card-bg"><img class="event-card-bg-img" src="' + t.bgImg + '" alt="" draggable="false" onerror="this.closest(\'.event-card\').dataset.fallback=\'true\'"/><div class="event-card-bg-fallback" style="background:' + t.fallbackBg + '"></div></div>' +
          '<div class="event-card-overlay"></div>' +
          '<div class="event-card-couple"><img class="event-card-couple-img" src="' + t.coupleImg + '" alt="' + e.name + '" draggable="false"/></div>' +
          '<div class="event-card-panel">' +
            '<p class="event-card-date">' + e.date + '</p>' +
            '<h3 class="event-card-name">' + e.name + '</h3>' +
            (e.sub ? '<p class="event-card-sub">' + e.sub + '</p>' : '') +
            '<p class="event-card-time">' + e.time + '</p>' +
            '<p class="event-card-venue"><a class="event-card-map" href="' + e.mapsHref + '" target="_blank" rel="noopener noreferrer">' + e.venue + '</a></p>' +
          '</div>' +
          '<p class="event-card-tag">' + e.tag + '</p>' +
          '<div class="event-card-glow" aria-hidden="true"></div>' +
        '</article>';
      dotsHTML += '<button class="events-dot" data-dot-idx="' + idx + '" role="tab" aria-label="Go to ' + e.name + '" aria-selected="false" type="button"></button>';
    });

    track.innerHTML = cardsHTML;
    if (dotsWrap) dotsWrap.innerHTML = dotsHTML;

    var cards = track.querySelectorAll('.event-card');
    var dots = dotsWrap ? dotsWrap.querySelectorAll('.events-dot') : [];
    var activeIdx = 0;

    function setActive (idx) {
      idx = Math.max(0, Math.min(idx, cards.length - 1));
      activeIdx = idx;
      cards.forEach(function (c, i) {
        c.classList.toggle('is-active', i === idx);
        c.classList.toggle('is-right', i > idx);
        c.setAttribute('aria-hidden', i === idx ? 'false' : 'true');
      });
      dots.forEach(function (d, i) {
        d.classList.toggle('is-active', i === idx);
        d.setAttribute('aria-selected', i === idx ? 'true' : 'false');
      });
      if (prevBtn) prevBtn.disabled = (idx === 0);
      if (nextBtn) nextBtn.disabled = (idx === cards.length - 1);
    }

    function scrollToCard (idx) {
      var card = cards[idx];
      if (!card) return;
      var tr = track.getBoundingClientRect();
      var cr = card.getBoundingClientRect();
      track.scrollBy({ left: cr.left - tr.left - (tr.width - cr.width) / 2, behavior: 'smooth' });
    }

    function goTo (idx) { setActive(idx); scrollToCard(idx); }

    if (prevBtn) prevBtn.addEventListener('click', function () { goTo(activeIdx - 1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { goTo(activeIdx + 1); });
    dots.forEach(function (d, i) { d.addEventListener('click', function () { goTo(i); }); });

    var snapTimer;
    track.addEventListener('scroll', function () {
      clearTimeout(snapTimer);
      snapTimer = setTimeout(function () {
        var cx = track.getBoundingClientRect().left + track.clientWidth / 2;
        var closest = 0, minD = Infinity;
        cards.forEach(function (c, i) {
          var d = Math.abs(c.getBoundingClientRect().left + c.offsetWidth / 2 - cx);
          if (d < minD) { minD = d; closest = i; }
        });
        if (closest !== activeIdx) setActive(closest);
      }, 80);
    }, { passive: true });

    setTimeout(function () {
      cards.forEach(function (c, i) {
        setTimeout(function () { c.removeAttribute('data-card-entering'); }, 120 + i * 80);
      });
    }, 100);

    var header = document.querySelector('[data-events-header]');
    if (header) header.classList.add('is-visible');

    setActive(0);
    requestAnimationFrame(function () { scrollToCard(0); });
  }

  /* ── 4. Build wardrobe rail (mirrors script.js logic) ── */
  var WARDROBE_THEMES = {
    'coastal-affair': { outfit: 'Coastal_affair_outfit.png', color: 'theme-color.png' },
    'sangeet': { outfit: 'Sangeet_outfit.webp' },
    'shaadi': { outfit: 'varmala_outfit.webp' },
    'welcome-lunch': { outfit: 'Lunch_outfit.webp' }
  };

  function buildWardrobeRail (btnsWrap) {
    window.__patchBuiltWardrobe = true;
    var BASE = 'assets/wardrobe/';
    var outfitVP = document.getElementById('wardrobe-outfit-vp');
    var scene = document.getElementById('wardrobe-scene');
    var header = document.querySelector('[data-wardrobe-header]');
    var items = SITE.wardrobe.items;
    if (!outfitVP) return;

    var themeLabel = document.createElement('div');
    themeLabel.className = 'wardrobe-theme-label is-visible';
    themeLabel.innerHTML = '<p class="wardrobe-theme-text">' + items[0].sub + '</p><p class="wardrobe-theme-desc">' + items[0].desc + '</p>';
    if (scene) scene.insertBefore(themeLabel, scene.firstChild);

    var rail = document.createElement('div');
    rail.className = 'wardrobe-rail';
    rail.setAttribute('aria-hidden', 'true');
    btnsWrap.appendChild(rail);

    var itemsRow = document.createElement('div');
    itemsRow.className = 'wardrobe-rail-items';
    btnsWrap.appendChild(itemsRow);

    var outfitImgs = [];
    var themeColorImgs = [];
    var currentIdx = 0;

    items.forEach(function (w, idx) {
      var btn = document.createElement('button');
      btn.className = 'wardrobe-btn' + (idx === 0 ? ' is-active' : '');
      btn.type = 'button';
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-selected', idx === 0 ? 'true' : 'false');
      btn.setAttribute('data-idx', String(idx));
      btn.setAttribute('data-event', w.theme);
      btn.setAttribute('aria-label', w.label + ' — ' + w.sub);
      btn.innerHTML = '<span class="wardrobe-btn-string" aria-hidden="true"></span><span class="wardrobe-btn-label">' + w.label + '</span>';
      btn.addEventListener('click', function () { switchOutfit(idx); });
      btn.addEventListener('touchstart', function (e) { e.preventDefault(); switchOutfit(idx); }, { passive: false });
      itemsRow.appendChild(btn);

      var t = WARDROBE_THEMES[w.theme] || WARDROBE_THEMES['coastal-affair'];

      var img = document.createElement('img');
      img.src = BASE + t.outfit;
      img.alt = '';
      img.className = 'wardrobe-outfit-img' + (idx === 0 ? ' is-active' : '');
      img.setAttribute('data-event', w.theme);
      img.draggable = false;
      outfitVP.appendChild(img);
      outfitImgs.push(img);

      if (w.theme === 'coastal-affair' && t.color) {
        var paletteWrap = document.createElement('div');
        paletteWrap.className = 'wardrobe-theme-palette' + (idx === 0 ? ' is-active' : '');

        var colorImg = document.createElement('img');
        colorImg.src = BASE + t.color;
        colorImg.alt = 'Coastal affair color palette';
        colorImg.className = 'wardrobe-theme-color-img' + (idx === 0 ? ' is-active' : '');
        colorImg.setAttribute('data-event', w.theme);
        colorImg.draggable = false;

        paletteWrap.appendChild(colorImg);
        themeLabel.appendChild(paletteWrap);
        themeColorImgs.push(paletteWrap);
      }
    });

    function switchOutfit (newIdx) {
      if (newIdx === currentIdx) return;
      var oldIdx = currentIdx;
      currentIdx = newIdx;
      var fwd = newIdx > oldIdx;

      btnsWrap.querySelectorAll('.wardrobe-btn').forEach(function (b, i) {
        b.classList.toggle('is-active', i === newIdx);
        b.setAttribute('aria-selected', i === newIdx ? 'true' : 'false');
      });

      var tl = themeLabel.querySelector('.wardrobe-theme-text');
      var dl = themeLabel.querySelector('.wardrobe-theme-desc');
      if (tl) { tl.style.opacity = '0'; setTimeout(function () { tl.textContent = items[newIdx].sub; tl.style.opacity = '1'; }, 400); }
      if (dl) { dl.style.opacity = '0'; setTimeout(function () { dl.textContent = items[newIdx].desc; dl.style.opacity = '1'; }, 400); }

      var outOld = outfitImgs[oldIdx];
      var outNew = outfitImgs[newIdx];

      outNew.classList.remove('is-active','is-exiting-fwd','is-exiting-bwd','is-entering-fwd','is-entering-bwd');
      outNew.classList.add(fwd ? 'is-entering-fwd' : 'is-entering-bwd');
      void outNew.offsetHeight;

      outOld.classList.remove('is-active');
      outOld.classList.add(fwd ? 'is-exiting-fwd' : 'is-exiting-bwd');

      themeColorImgs.forEach(function (paletteWrap) {
        var showPalette = items[newIdx].theme === 'coastal-affair';
        paletteWrap.classList.toggle('is-active', showPalette);
        var colorImg = paletteWrap.querySelector('.wardrobe-theme-color-img');
        if (colorImg) colorImg.classList.toggle('is-active', showPalette);
      });

      setTimeout(function () {
        outNew.classList.remove('is-entering-fwd','is-entering-bwd');
        outNew.classList.add('is-active');
      }, 900);
    }

    if (header) header.classList.add('is-visible');
    btnsWrap.classList.add('is-visible');
    themeLabel.classList.add('is-visible');
    if (scene) scene.classList.add('is-visible');
  }

})();
