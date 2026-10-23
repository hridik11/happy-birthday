/* =====================================================================
   main.js — shared behaviour for every page.
   You normally do NOT need to edit this file (use config.js instead).
   ===================================================================== */
(function () {
  'use strict';

  var S = window.SITE || {};
  var PAGES = ['index.html', 'page2.html', 'page3.html', 'page4.html', 'page5.html',
               'memories.html', 'bear.html', 'gift.html', 'heart.html', 'letter.html'];
  var stage = parseInt(document.body.getAttribute('data-stage'), 10) || 1;

  /* 1. Fill text from config.js:  <span data-site="name"></span> */
  document.querySelectorAll('[data-site]').forEach(function (el) {
    var v = S[el.getAttribute('data-site')];
    if (typeof v === 'string' && v) el.textContent = v;
  });

  /* 2. "back" link */
  if (stage > 1) {
    var back = document.createElement('a');
    back.className = 'back';
    back.href = PAGES[stage - 2];
    back.setAttribute('data-go', '');
    back.textContent = '← back';
    document.body.appendChild(back);
  }

  /* 3. Progress dots */
  var dots = document.createElement('div');
  dots.className = 'dots';
  for (var i = 1; i <= PAGES.length; i++) {
    var d = document.createElement('i');
    if (i < stage) d.className = 'done';
    if (i === stage) d.className = 'on';
    dots.appendChild(d);
  }
  document.body.appendChild(dots);

  /* 4. Floating background emoji (more festive as the pages go on) */
  var sets = {
    1: ['✨', '⭐'], 2: ['✨', '⭐', '🌙'], 3: ['✨', '🌟', '💫'],
    4: ['🎈', '✨', '🌟'], 5: ['🎈', '🎉', '🎀', '✨'],
    6: ['💖', '✨', '🎈'], 7: ['🧸', '💖', '✨'],
    8: ['🎁', '🎉', '✨'], 9: ['💘', '💖', '✨'],
    10: ['💌', '✨', '⭐']
  };
  var set = sets[stage] || sets[1];
  var count = Math.min(8 + stage * 2, 24);
  for (var p = 0; p < count; p++) {
    var s = document.createElement('span');
    s.className = 'particle';
    s.textContent = set[Math.floor(Math.random() * set.length)];
    s.style.left = Math.random() * 100 + '%';
    s.style.setProperty('--s', (14 + Math.random() * 22) + 'px');
    s.style.setProperty('--t', (10 + Math.random() * 10) + 's');
    s.style.setProperty('--dl', (-Math.random() * 18) + 's');
    document.body.appendChild(s);
  }

  /* 5. Photos: tries .jpg .jpeg .png .webp automatically; shows a friendly box if missing */
  var EXTS = ['jpg', 'jpeg', 'png', 'webp', 'JPG', 'JPEG', 'PNG'];
  function loadPhoto(img) {
    var base = img.getAttribute('data-photo');
    var optional = img.hasAttribute('data-optional');
    var i = 0;
    img.onerror = next;
    function next() {
      if (i >= EXTS.length) {
        img.onerror = null;
        var holder = img.closest('.polaroid');
        if (optional) { if (holder) holder.style.display = 'none'; else img.style.display = 'none'; return; }
        var ph = document.createElement('div');
        ph.className = 'placeholder';
        ph.innerHTML = '<span style="font-size:2rem">📸</span><span>Add your photo here<br><b></b></span>';
        ph.querySelector('b').textContent = base + '.jpg';
        img.replaceWith(ph);
        return;
      }
      img.src = base + '.' + EXTS[i++];
    }
    next();
  }
  function loadPhotos(root) {
    (root || document).querySelectorAll('img[data-photo]:not([data-started])').forEach(function (img) {
      img.setAttribute('data-started', '1');
      loadPhoto(img);
    });
  }
  window.loadPhotos = loadPhotos;
  loadPhotos(document);

  /* 6. Letter-by-letter bounce:  <h1 data-wave>Happy Birthday</h1> */
  document.querySelectorAll('[data-wave]').forEach(function (el) {
    var n = 0, html = '';
    el.textContent.trim().split(/\s+/).forEach(function (w) {
      html += '<span class="word">';
      w.split('').forEach(function (ch) {
        html += '<span class="ltr" style="--d:' + (0.4 + n++ * 0.07).toFixed(2) + 's">' + ch + '</span>';
      });
      html += '</span> ';
    });
    el.innerHTML = html;
  });

  /* 7. Confetti + floating hearts (used by several pages) */
  window.burst = function (x, y, n) {
    var colors = ['#ff6b9a', '#ffd166', '#6ee7b7', '#7dd3fc', '#c4b5fd', '#ffffff'];
    n = n || 60;
    for (var i = 0; i < n; i++) {
      var c = document.createElement('i');
      c.className = 'confetti';
      c.style.left = x + 'px';
      c.style.top = y + 'px';
      c.style.width = (6 + Math.random() * 6) + 'px';
      c.style.height = (8 + Math.random() * 8) + 'px';
      c.style.background = colors[i % colors.length];
      document.body.appendChild(c);
      var a = Math.random() * Math.PI * 2, dist = 120 + Math.random() * 260;
      var dx = Math.cos(a) * dist, dy = Math.sin(a) * dist - 120;
      var anim = c.animate([
        { transform: 'translate(0,0) rotate(0deg)', opacity: 1 },
        { transform: 'translate(' + dx + 'px,' + (dy + 380) + 'px) rotate(' + (Math.random() * 900) + 'deg)', opacity: 0 }
      ], { duration: 1400 + Math.random() * 1200, easing: 'cubic-bezier(.2,.7,.4,1)' });
      anim.onfinish = c.remove.bind(c);
    }
  };

  window.floatHearts = function (x, y, n) {
    var em = ['💖', '💕', '💗', '💘', '❤️'];
    n = n || 6;
    for (var i = 0; i < n; i++) {
      var h = document.createElement('span');
      h.className = 'fheart';
      h.textContent = em[Math.floor(Math.random() * em.length)];
      h.style.left = (x - 10 + Math.random() * 20) + 'px';
      h.style.top = y + 'px';
      h.style.fontSize = (16 + Math.random() * 18) + 'px';
      document.body.appendChild(h);
      var dx = (Math.random() - 0.5) * 140;
      var anim = h.animate([
        { transform: 'translate(0,0) scale(.6)', opacity: 1 },
        { transform: 'translate(' + dx + 'px,-' + (120 + Math.random() * 120) + 'px) scale(1.2)', opacity: 0 }
      ], { duration: 1400 + Math.random() * 800, easing: 'ease-out' });
      anim.onfinish = h.remove.bind(h);
    }
  };

  /* 8. Popups: click the dark background (or press Esc) to close */
  document.querySelectorAll('.modal').forEach(function (m) {
    m.addEventListener('click', function (e) { if (e.target === m) m.classList.remove('show'); });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') document.querySelectorAll('.modal.show').forEach(function (m) { m.classList.remove('show'); });
  });

  /* 9. Smooth fade-out when moving to the next page */
  document.querySelectorAll('a[data-go]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      var url = a.href;
      document.body.classList.add('leaving');
      setTimeout(function () { window.location.href = url; }, 420);
    });
  });
  window.addEventListener('pageshow', function () { document.body.classList.remove('leaving'); });
})();
