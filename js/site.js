(function () {
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".nav");
  var progress = document.querySelector("[data-progress]");

  function onScroll() {
    if (!progress) return;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    var amount = max > 0 ? Math.min(1, window.scrollY / max) : 0;
    progress.style.transform = "scaleX(" + amount.toFixed(4) + ")";
  }

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.textContent = open ? "关闭" : "菜单";
    });
  }

  var themeButtons = document.querySelectorAll(".theme");

  function paintTheme() {
    var dark = document.documentElement.getAttribute("data-theme") === "dark";
    themeButtons.forEach(function (btn) {
      btn.setAttribute("aria-label", dark ? "切换浅色模式" : "切换深色模式");
    });
  }

  paintTheme();
  themeButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var dark = document.documentElement.getAttribute("data-theme") === "dark";
      if (dark) {
        document.documentElement.removeAttribute("data-theme");
        localStorage.removeItem("theme");
      } else {
        document.documentElement.setAttribute("data-theme", "dark");
        localStorage.setItem("theme", "dark");
      }
      paintTheme();
    });
  });

  var clock = document.getElementById("clock");
  function tick() {
    if (!clock) return;
    var now = new Date();
    var pad = function (n) { return String(n).padStart(2, "0"); };
    clock.textContent = pad(now.getHours()) + ":" + pad(now.getMinutes()) + ":" + pad(now.getSeconds());
  }
  tick();
  if (clock) setInterval(tick, 1000);

  var filters = document.querySelectorAll("[data-filter]");
  var rows = document.querySelectorAll(".note-row");
  var empty = document.querySelector(".empty-note");

  filters.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var key = btn.getAttribute("data-filter");
      filters.forEach(function (item) {
        item.classList.toggle("is-active", item === btn);
      });
      var shown = 0;
      rows.forEach(function (row) {
        var match = key === "all" || row.getAttribute("data-topic") === key;
        row.hidden = !match;
        if (match) shown += 1;
      });
      if (empty) empty.hidden = shown !== 0;
    });
  });

  var form = document.querySelector(".letter-form");
  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      var note = document.querySelector(".form-done");
      if (note) note.hidden = false;
      form.reset();
    });
  }
})();
