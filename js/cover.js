(function () {
  var canvas = document.querySelector(".cover-canvas");
  if (!canvas) return;

  var ctx = canvas.getContext("2d");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var W = 0;
  var H = 0;
  var hover = false;
  var tx = 0;
  var ty = 0;
  var px = 0;
  var py = 0;
  var ready = false;
  var raf = 0;

  function rest() {
    tx = W * 0.28;
    ty = H * 0.72;
    if (!ready) {
      px = tx;
      py = ty;
      ready = true;
    }
  }

  function draw() {
    px += (tx - px) * 0.07;
    py += (ty - py) * 0.07;

    var base = ctx.createLinearGradient(W, 0, 0, H);
    base.addColorStop(0, "#c5d0dc");
    base.addColorStop(0.28, "#1FC8EC");
    base.addColorStop(0.58, "#01FF6B");
    base.addColorStop(1, "#1f4f92");
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, W, H);

    var reach = Math.max(W, H) * 0.85;
    var bloom = ctx.createRadialGradient(px, py, 0, px, py, reach);
    bloom.addColorStop(0, "rgba(1, 255, 107, 0.88)");
    bloom.addColorStop(0.34, "rgba(31, 200, 236, 0.62)");
    bloom.addColorStop(0.7, "rgba(31, 200, 236, 0.16)");
    bloom.addColorStop(1, "rgba(31, 200, 236, 0)");
    ctx.fillStyle = bloom;
    ctx.fillRect(0, 0, W, H);

    var haze = ctx.createRadialGradient(px + W * 0.18, py - H * 0.35, 0, px + W * 0.12, py - H * 0.2, reach * 0.72);
    haze.addColorStop(0, "rgba(214, 226, 236, 0.42)");
    haze.addColorStop(1, "rgba(214, 226, 236, 0)");
    ctx.fillStyle = haze;
    ctx.fillRect(0, 0, W, H);

    ctx.strokeStyle = "rgba(255,255,255,0.55)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    var x1 = Math.round(W * 0.28) + 0.5;
    var x2 = Math.round(W * 0.72) + 0.5;
    var y1 = Math.round(H * 0.34) + 0.5;
    var y2 = Math.round(H * 0.7) + 0.5;
    ctx.moveTo(x1, 0);
    ctx.lineTo(x1, H);
    ctx.moveTo(x2, 0);
    ctx.lineTo(x2, H);
    ctx.moveTo(0, y1);
    ctx.lineTo(W, y1);
    ctx.moveTo(0, y2);
    ctx.lineTo(W, y2);
    ctx.stroke();

    ctx.strokeStyle = "rgba(255,255,255,0.42)";
    ctx.beginPath();
    ctx.arc(W * 0.62, H * 0.08, Math.min(W, H) * 0.72, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(W * 0.42, H * 0.62, Math.min(W, H) * 0.78, 0, Math.PI * 2);
    ctx.stroke();

    var settled = Math.abs(tx - px) < 0.4 && Math.abs(ty - py) < 0.4;
    if (!reduce && (hover || !settled)) raf = requestAnimationFrame(draw);
    else raf = 0;
  }

  function poke() {
    if (reduce || raf) return;
    raf = requestAnimationFrame(draw);
  }

  function point(event) {
    var rect = canvas.getBoundingClientRect();
    tx = event.clientX - rect.left;
    ty = event.clientY - rect.top;
    hover = true;
    poke();
  }

  canvas.addEventListener("pointerenter", point);
  canvas.addEventListener("pointermove", point);
  canvas.addEventListener("pointerleave", function () {
    hover = false;
    rest();
    poke();
  });

  function layout() {
    var rect = canvas.getBoundingClientRect();
    var w = Math.max(1, Math.round(rect.width));
    var h = Math.max(1, Math.round(rect.height));
    if (w === W && h === H && ready) return;
    W = w;
    H = h;
    ready = false;
    var dpr = Math.min(1.5, window.devicePixelRatio || 1);
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    rest();
    draw();
  }

  if (window.ResizeObserver) new ResizeObserver(layout).observe(canvas.parentElement);
  else window.addEventListener("resize", layout);
  layout();
})();
