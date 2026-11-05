// Light during the day, dark in the evening, unless the visitor picked one.
// Loaded in <head> before the stylesheet applies, so the page never flashes
// the wrong theme. Without JavaScript, the CSS falls back to the system setting.
(function () {
  var KEY = "claudster-theme";          // "light" | "dark"; absent means Auto
  var DAY_START = 7, DAY_END = 19;      // local hours: light from 7:00 to 18:59
  var COLORS = { light: "#efe4d8", dark: "#1d1714" };
  var root = document.documentElement;

  function saved() {
    try { var v = localStorage.getItem(KEY); return v === "light" || v === "dark" ? v : null; }
    catch (e) { return null; }
  }
  function byClock() {
    var h = new Date().getHours();
    return h >= DAY_START && h < DAY_END ? "light" : "dark";
  }
  function apply() {
    var choice = saved();
    var theme = choice || byClock();
    root.setAttribute("data-theme", theme);
    root.setAttribute("data-theme-choice", choice || "auto");
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", COLORS[theme]);
    var button = document.querySelector(".theme-toggle");
    if (button) {
      var label = choice === "light" ? "Light" : choice === "dark" ? "Dark"
        : "Auto: light by day, dark after 7 pm";
      button.setAttribute("aria-label", "Theme: " + label + ". Click to change.");
      button.title = "Theme: " + label;
    }
  }

  apply();
  // An open page follows the clock too.
  setInterval(function () { if (!saved()) apply(); }, 5 * 60 * 1000);

  document.addEventListener("DOMContentLoaded", function () {
    apply();
    var button = document.querySelector(".theme-toggle");
    if (!button) return;
    button.addEventListener("click", function () {
      // Auto -> Light -> Dark -> Auto
      var next = { auto: "light", light: "dark", dark: "auto" }[root.getAttribute("data-theme-choice") || "auto"];
      try {
        if (next === "auto") localStorage.removeItem(KEY); else localStorage.setItem(KEY, next);
      } catch (e) { /* storage blocked: the choice lasts this page view */
        root.setAttribute("data-theme", next === "auto" ? byClock() : next);
      }
      apply();
    });
  });
})();
