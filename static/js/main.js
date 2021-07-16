(function () {
  var THEME_CACHE_KEY = 'theme';
  var theme = 'light';
  var hasLocalStorage = typeof Storage !== undefined;
  var toggleBtn = document.getElementById('toggle-theme');

  function getSystemPreference() {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return false;
  }

  function getCachedPreference() {
    if (hasLocalStorage) {
      return window.localStorage.getItem(THEME_CACHE_KEY);
    }
    return false;
  }

  function setTheme() {
    document.documentElement.setAttribute('data-theme', theme);
    var title = 'Activate ' + (theme === 'light' ? 'dark' : 'light') + ' mode';
    toggleBtn.setAttribute('aria-label', title);
    toggleBtn.setAttribute('title', title);
    if (hasLocalStorage) {
      window.localStorage.setItem(THEME_CACHE_KEY, theme);
    }
  }

  function initTheme() {
    var systemPreference = getSystemPreference();
    var cachedPreference = getCachedPreference();

    if (cachedPreference) {
      theme = cachedPreference;
    } else if (systemPreference) {
      theme = systemPreference;
    }
    setTheme();
  }

  toggleBtn.addEventListener('click', function () {
    if (theme === 'light') {
      theme = 'dark';
      setTheme();
      return;
    }
    theme = 'light';
    setTheme();
  });

  initTheme();
})();
