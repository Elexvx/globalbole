/* Progressive enhancement only: every language link is a working native link. */
(function () {
  var languages = ['zh-CN', 'zh-TW', 'en', 'ru', 'fr'];
  var key = 'globalbole-locale';
  try {
    var saved = localStorage.getItem(key);
    if (location.pathname === '/' && languages.indexOf(saved) > 0) {
      location.replace('/' + saved + '/' + location.search + location.hash);
      return;
    }
  } catch (_) { /* Private browsing and disabled storage still keep every link usable. */ }
  document.addEventListener('click', function (event) {
    var link = event.target.closest && event.target.closest('a[data-language]');
    if (!link) return;
    var language = link.getAttribute('data-language');
    if (languages.indexOf(language) < 0) return;
    try { localStorage.setItem(key, language); } catch (_) {}
  });
})();
