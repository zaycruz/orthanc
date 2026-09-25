(function () {
  // Tabbed terminal recordings, each beside a screen recording of the Foundry
  // window from the same run. Switching a tab disposes the old player and
  // loads the new recording and video.
  var tabs = [].slice.call(document.querySelectorAll('.demo-tabs [role="tab"]'));
  var el = document.getElementById('demo-player');
  if (!tabs.length || !el || !window.AsciinemaPlayer) return;
  var title = document.getElementById('demo-title');
  var caption = document.getElementById('demo-caption');
  var suffix = ' Real commands and output, recorded live against a Foundry sandbox with Orthanc 0.3.0. The Foundry window beside it was recorded during the same run, on the same clock; long waits play at 20× on both sides. Everything created is deleted afterwards.';
  var video = document.getElementById('demo-video');
  var player = null;
  var playing = false;
  var started = false;
  var autoAdvance = true;

  // Video time equals player time: each cast has no idle limit, and waits
  // were sped up by the same amount in the cast and the video.
  function syncVideo(t) {
    if (!video || isNaN(video.duration)) return;
    var target = Math.min(t || 0, video.duration - 0.05);
    var drift = target - video.currentTime;
    // Seek on jumps; close small gaps by nudging the rate, which doesn't stutter.
    if (Math.abs(drift) > 0.5) { video.currentTime = target; video.playbackRate = 1; }
    else video.playbackRate = Math.abs(drift) > 0.03 ? 1 + Math.max(-0.25, Math.min(0.25, drift * 1.5)) : 1;
    if (playing && video.paused && t < video.duration) video.play().catch(function () {});
    if (!playing && !video.paused) video.pause();
  }

  setInterval(function () {
    if (!player || !player.getCurrentTime) return;
    var t = player.getCurrentTime();
    if (t && typeof t.then === 'function') t.then(syncVideo); else syncVideo(t);
  }, 200);

  function options() {
    var narrow = window.innerWidth < 760;
    return {
      fit: narrow ? 'width' : false,
      terminalFontSize: '14px',
      terminalFontFamily: '"IBM Plex Mono", ui-monospace, Menlo, monospace',
      theme: 'orthanc',
      poster: 'npt:0:1'
    };
  }

  function load(tab, play) {
    if (player) player.dispose();
    el.innerHTML = '';
    playing = false;
    player = AsciinemaPlayer.create('/assets/demos/' + tab.dataset.demo + '.cast', el, options());
    player.addEventListener('play', function () { playing = true; });
    player.addEventListener('playing', function () { playing = true; });
    player.addEventListener('pause', function () { playing = false; });
    // Roll into the next workflow until the visitor picks a tab.
    player.addEventListener('ended', function () {
      playing = false;
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
    title.textContent = 'orthanc — ' + tab.dataset.demo;
    caption.textContent = tab.dataset.caption + suffix;
    document.querySelectorAll('[data-transcript]').forEach(function (block) {
      block.hidden = block.getAttribute('data-transcript') !== tab.dataset.demo;
    });
    if (video) {
      video.pause();
      video.src = '/assets/demos/' + tab.dataset.demo + '.mp4';
      video.currentTime = 0;
    }
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
