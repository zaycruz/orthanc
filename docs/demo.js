(function () {
  // Tabbed terminal recordings. One player at a time: switching a tab
  // disposes the old player and loads the new recording.
  var tabs = [].slice.call(document.querySelectorAll('.demo-tabs [role="tab"]'));
  var el = document.getElementById('demo-player');
  if (!tabs.length || !el || !window.AsciinemaPlayer) return;
  var title = document.getElementById('demo-title');
  var caption = document.getElementById('demo-caption');
  var suffix = ' Real commands and output, recorded live against a Foundry sandbox with Orthanc 0.3.0; everything created is deleted afterwards.';
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
    load(tab, play);
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
