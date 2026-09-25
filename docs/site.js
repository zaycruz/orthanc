(function () {
  // Tabs for the installer.
  // The demo tabs have their own script (demo.js).
  var tabs = document.querySelectorAll('.tabs:not(.demo-tabs) [role="tab"]');
  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      tabs.forEach(function (t) {
        var selected = t === tab;
        t.setAttribute('aria-selected', String(selected));
        var panel = document.getElementById(t.getAttribute('aria-controls'));
        if (panel) panel.hidden = !selected;
      });
    });
  });

  // "See it in …" links open that workflow's demo tab (handled by demo.js).
  document.querySelectorAll('[data-show-demo]').forEach(function (link) {
    link.addEventListener('click', function () {
      var tab = document.getElementById('demo-tab-' + link.getAttribute('data-show-demo'));
      if (tab) tab.click();
    });
  });

  // Copy buttons. Each sits beside the <pre> it copies.
  document.querySelectorAll('[data-copy]').forEach(function (button) {
    button.addEventListener('click', function () {
      var text = button.parentElement.querySelector('code').textContent;
      navigator.clipboard.writeText(text).then(function () {
        button.textContent = 'Copied';
        button.classList.add('done');
        setTimeout(function () {
          button.textContent = 'Copy';
          button.classList.remove('done');
        }, 1600);
      });
    });
  });

  // Live Orthanc version. The static text is the fallback if the API is
  // unreachable or rate-limited, so failures are silent.
  var fmt = function (iso) {
    return new Date(iso).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
  };
  var api = 'https://api.github.com/repos/zaycruz/orthanc/releases/';
  fetch(api + 'latest').then(function (r) { return r.ok ? r.json() : null; }).then(function (rel) {
    if (!rel || !rel.tag_name) return;
    document.querySelectorAll('[data-stable-version]').forEach(function (el) { el.textContent = rel.tag_name; });
  }).catch(function () {});
  var nightly = document.getElementById('nightly-date');
  if (nightly) {
    fetch(api + 'tags/nightly').then(function (r) { return r.ok ? r.json() : null; }).then(function (rel) {
      if (!rel) return;
      // The nightly release is reused and its assets are replaced, so the
      // newest asset upload is the build date, not the release's publish date.
      var built = (rel.assets || []).reduce(function (latest, asset) {
        return asset.updated_at && asset.updated_at > latest ? asset.updated_at : latest;
      }, rel.published_at || '');
      if (built) nightly.textContent = 'built ' + fmt(built);
    }).catch(function () {});
  }
})();
