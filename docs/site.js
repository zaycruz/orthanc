(function () {
  // Tabs for the hero installer.
  var tabs = document.querySelectorAll('[role="tab"]');
  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      tabs.forEach(function (t) {
        var selected = t === tab;
        t.setAttribute('aria-selected', String(selected));
        document.getElementById(t.getAttribute('aria-controls')).hidden = !selected;
      });
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

  // Live version badge. The static text is the fallback if the API is
  // unreachable or rate-limited, so failures are silent.
  var fmt = function (iso) {
    return new Date(iso).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
  };
  var api = 'https://api.github.com/repos/zaycruz/orthanc/releases/';
  fetch(api + 'latest').then(function (r) { return r.ok ? r.json() : null; }).then(function (rel) {
    if (rel && rel.tag_name) document.getElementById('stable-version').textContent = rel.tag_name;
  }).catch(function () {});
  fetch(api + 'tags/nightly').then(function (r) { return r.ok ? r.json() : null; }).then(function (rel) {
    if (rel && rel.published_at) document.getElementById('nightly-date').textContent = 'built ' + fmt(rel.published_at);
  }).catch(function () {});
})();
