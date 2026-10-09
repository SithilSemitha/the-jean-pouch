/**
 * Runs in <head>, before the page paints, so saved choices apply without a flash:
 *  - theme (light / dark; falls back to the device setting when nothing is saved)
 *  - language (sets <html lang> so the right fonts and spacing apply)
 *  - splash screen (plays once per browser tab session)
 */
(function () {
  "use strict";
  var root = document.documentElement;
  function read(store, key) { try { return store.getItem(key); } catch (e) { return null; } }

  var theme = read(localStorage, "tjp.theme");
  if (theme === "light" || theme === "dark") root.setAttribute("data-theme", theme);

  var lang = read(localStorage, "tjp.lang");
  if (lang === "en" || lang === "si" || lang === "ta") root.lang = lang;

  try {
    if (sessionStorage.getItem("tjp.splash.seen")) root.classList.add("no-splash");
    else sessionStorage.setItem("tjp.splash.seen", "1");
  } catch (e) { /* storage unavailable: splash simply plays each load */ }
})();
