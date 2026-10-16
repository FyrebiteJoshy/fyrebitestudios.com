// Fyrebite Studios — scroll reveals + ember particles
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Scroll reveal
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.card, .section-head, .feature, .quote, .member, .callout, .prose h2')
    .forEach(function (el) {
      el.classList.add('reveal');
      io.observe(el);
    });

  // Ember particles (homepage hero only)
  var canvas = document.getElementById('embers');
  if (!canvas || reduce) return;

  var ctx = canvas.getContext('2d');
  var W, H, parts = [];

  function size() {
    var r = canvas.parentElement.getBoundingClientRect();
    W = canvas.width = r.width;
    H = canvas.height = r.height;
  }
  size();
  window.addEventListener('resize', size);

  function spawn(init) {
    return {
      x: Math.random() * W,
      y: init ? Math.random() * H : H + 10,
      r: 1 + Math.random() * 2.4,
      vy: 0.25 + Math.random() * 0.7,
      vx: (Math.random() - 0.5) * 0.35,
      life: 0,
      max: 240 + Math.random() * 240,
      hue: 14 + Math.random() * 22
    };
  }
  for (var i = 0; i < 42; i++) parts.push(spawn(true));

  function tick() {
    ctx.clearRect(0, 0, W, H);
    parts.forEach(function (p, idx) {
      p.life++;
      p.y -= p.vy;
      p.x += p.vx + Math.sin((p.life + idx * 40) * 0.02) * 0.3;
      var fade = 1 - p.life / p.max;
      if (fade < 0) fade = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'hsla(' + p.hue + ', 88%, 55%, ' + (fade * 0.5).toFixed(3) + ')';
      ctx.fill();
      if (p.life > p.max || p.y < -12) parts[idx] = spawn(false);
    });
    requestAnimationFrame(tick);
  }
  tick();
})();
