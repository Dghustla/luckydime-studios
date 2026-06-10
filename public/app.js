/* Lucky Dime Studios — interactions
   Tasteful motion only. Everything degrades cleanly and
   respects prefers-reduced-motion.                          */
(function () {
  "use strict";

  var reduceMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- Flip the lucky dime on click ---- */
  function wireCoin(coin) {
    if (!coin) return;
    function flip() { coin.classList.toggle("flip"); }
    coin.addEventListener("click", flip);
    coin.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); flip(); }
    });
  }
  wireCoin(document.getElementById("coin"));
  wireCoin(document.getElementById("coin2"));

  /* ---- Prep the rising chart so it can "draw" on reveal ---- */
  var chartLines = document.querySelectorAll(".chart .line");
  chartLines.forEach(function (path) {
    var len = path.getTotalLength();
    path.style.strokeDasharray = len;
    if (!reduceMotion) {
      path.style.strokeDashoffset = len;
    }
  });

  function drawChart() {
    chartLines.forEach(function (path, i) {
      path.style.transition =
        "stroke-dashoffset 1.5s cubic-bezier(.22,.61,.36,1) " + i * 0.45 + "s";
      path.style.strokeDashoffset = 0;
    });
  }

  /* ---- Scroll reveal + trigger chart + fill meters ---- */
  var revealEls = document.querySelectorAll(".reveal");

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("in"); });
    document.querySelectorAll(".meter > span").forEach(function (s) {
      s.style.width = s.getAttribute("data-fill") || "0";
    });
    return; // chart already shown (no dashoffset set)
  }

  var io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        el.classList.add("in");

        if (el.querySelector && el.querySelector(".chart")) drawChart();

        var meter = el.querySelector && el.querySelector(".meter > span");
        if (meter) {
          requestAnimationFrame(function () {
            meter.style.transition = "width 1.4s cubic-bezier(.22,.61,.36,1)";
            meter.style.width = meter.getAttribute("data-fill") || "0";
          });
        }
        io.unobserve(el);
      });
    },
    { threshold: 0.18, rootMargin: "0px 0px -8% 0px" }
  );

  revealEls.forEach(function (el) { io.observe(el); });
})();
