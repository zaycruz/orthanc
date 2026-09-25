(function () {
  // Tabbed terminal recordings. One player at a time: switching a tab
  // disposes the old player and loads the new recording.
  var tabs = [].slice.call(document.querySelectorAll('.demo-tabs [role="tab"]'));
  var el = document.getElementById('demo-player');
  if (!tabs.length || !el || !window.AsciinemaPlayer) return;
  var title = document.getElementById('demo-title');
  var caption = document.getElementById('demo-caption');
  var suffix = ' Real commands and output, recorded live against a Foundry sandbox with Orthanc 0.3.0. The Foundry window shows the same change in the web UI, captured during the run; everything created is deleted afterwards.';
  var shotImg = document.getElementById('demo-shot');
  var shotCaption = document.getElementById('demo-shot-caption');
  var shots = [];
  var shownShot = null;
  var syncTimer = null;

  // Show the last screenshot whose time is at or before the player time.
  // Times are in player time (idle gaps already capped at 2 s).
  function showShotAt(t) {
    var pick = null;
    shots.forEach(function (s) { if (s.t <= t + 0.05) pick = s; });
    if (!pick || pick === shownShot) return;
    shownShot = pick;
    shotImg.classList.add('fading');
    var next = new Image();
    next.onload = function () {
      shotImg.src = next.src;
      shotImg.alt = pick.caption;
      shotCaption.textContent = pick.caption;
      shotImg.classList.remove('fading');
    };
    next.src = '/assets/demos/shots/' + pick.img;
  }

  function startSync() {
    if (syncTimer) clearInterval(syncTimer);
    syncTimer = setInterval(function () {
      if (!player || !player.getCurrentTime) return;
      var t = player.getCurrentTime();
      if (t && typeof t.then === 'function') t.then(showShotAt); else showShotAt(t || 0);
    }, 250);
  }

  function loadShots(key) {
    shots = [];
    shownShot = null;
    fetch('/assets/demos/' + key + '.shots.json').then(function (r) { return r.ok ? r.json() : []; }).then(function (list) {
      shots = list || [];
      shots.forEach(function (s) { new Image().src = '/assets/demos/shots/' + s.img; });
      showShotAt(0);
    }).catch(function () {});
  }
  var player = null;
  var started = false;
  var autoAdvance = true;

  function options() {
    var narrow = window.innerWidth < 760;
    return {
      fit: narrow ? 'width' : false,
      terminalFontSize: '14px',
      terminalFontFamily: '"IBM Plex Mono", ui-monospace, Menlo, monospace',
      idleTimeLimit: 2,
      theme: 'orthanc',
      poster: 'npt:0:1'
    };
  }

  function load(tab, play) {
    if (player) player.dispose();
    el.innerHTML = '';
    player = AsciinemaPlayer.create('/assets/demos/' + tab.dataset.demo + '.cast', el, options());
    // Roll into the next workflow until the visitor picks a tab.
    player.addEventListener('ended', function () {
      if (!autoAdvance) return;
      var next = tabs[(tabs.indexOf(tab) + 1) % tabs.length];
      setTimeout(function () { if (autoAdvance) select(next, true); }, 1500);
    });
    if (play) player.play();
  }

  function select(tab, play) {
    tabs.forEach(function (t) {
      t.setAttribute('aria-selected', String(t === tab));
      t.tabIndex = t === tab ? 0 : -1;
    });
    title.textContent = 'orthanc \u2014 ' + tab.dataset.demo;
    caption.textContent = tab.dataset.caption + suffix;
    document.querySelectorAll('[data-transcript]').forEach(function (block) {
      block.hidden = block.getAttribute('data-transcript') !== tab.dataset.demo;
    });
    loadShots(tab.dataset.demo);
    load(tab, play);
    startSync();
  }

  tabs.forEach(function (tab, i) {
    tab.addEventListener('click', function () { autoAdvance = false; started = true; select(tab, true); });
    tab.addEventListener('keydown', function (event) {
      var step = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
      if (!step) return;
      event.preventDefault();
      var next = tabs[(i + step + tabs.length) % tabs.length];
      next.focus();
      autoAdvance = false;
      select(next, true);
    });
  });

  select(tabs[0], false);
  // Start the first recording when the demo scrolls into view, once.
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      if (!started && entries[0].isIntersecting) { started = true; player.play(); }
    }, { threshold: 0.35 }).observe(el);
  }
})();
