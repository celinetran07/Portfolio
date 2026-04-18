/* ── FLOATING PETALS IN HERO ── */
const hero = document.getElementById("contact-hero");
const PETALS = ["✿", "❀"];

function spawnPetal() {
  const p = document.createElement("span");
  p.className = "petal";
  p.textContent = PETALS[Math.floor(Math.random() * PETALS.length)];
  p.style.left = Math.random() * 100 + "%";
  p.style.color = "rgba(255, 255, 255, 0.5)";
  p.style.fontSize = 14 + Math.random() * 18 + "px";
  const dur = 7 + Math.random() * 8;
  p.style.animationDuration = dur + "s";
  p.style.animationDelay = Math.random() * 3 + "s";
  hero.appendChild(p);
  setTimeout(() => p.remove(), (dur + 3) * 1000);
}
for (let i = 0; i < 8; i++) setTimeout(spawnPetal, i * 400);
setInterval(spawnPetal, 1000);

/* ── STAGGERED LINK ENTRANCE ── */
const linkObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add("visible"), i * 100);
        linkObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 },
);
document
  .querySelectorAll(".contact-link-item")
  .forEach((l) => linkObserver.observe(l));

/* ── ELASTIC FLOWER WITH EXCITED FACE ── */
(function () {
  const canvas = document.getElementById("contact-flower-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  const CONFIG = {
    springStrength: 0.08,
    damping: 0.75,
    mouseRadius: 60,
    mouseForce: 8,
    floatSpeed: 0.0016, // was 0.0008 — slightly faster drift
    floatAmount: 15, // was 8 — much more movement
    strokeColor: "rgba(255, 255, 255, 0.75)",
    fillColor: "rgba(255, 255, 255, 0.08)",
    strokeWidth: 2,
  };

  function buildFlower(cx, cy, r, count) {
    return Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2;
      const wave =
        0.75 +
        0.25 * Math.cos(angle * 5); /* cos instead of sin + higher depth */
      return {
        rx: cx + Math.cos(angle) * r * wave,
        ry:
          cy +
          Math.sin(angle) * r * wave /* remove the * 0.9 to make it circular */,
        x: cx + Math.cos(angle) * r * wave,
        y: cy + Math.sin(angle) * r * wave,
        vx: 0,
        vy: 0,
      };
    });
  }

  let points = [],
    mouse = { x: -9999, y: -9999 },
    time = 0;
  let W, H, cx, cy, radius;

  function resize() {
    W = canvas.offsetWidth;
    H = canvas.offsetHeight;
    canvas.width = W;
    canvas.height = H;
    cx = W * 0.5;
    cy = H * 0.5;
    radius = Math.min(W, H) * 0.35;
    points = buildFlower(cx, cy, radius, 64);
  }

  window.addEventListener("resize", resize);
  resize();

  /* Track mouse globally so fast moves still register */
  window.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });
  document.addEventListener("mouseleave", () => {
    mouse.x = -9999;
    mouse.y = -9999;
  });

  function drawCurve(pts) {
    ctx.beginPath();
    const last = pts[pts.length - 1];
    ctx.moveTo((last.x + pts[0].x) / 2, (last.y + pts[0].y) / 2);
    for (let i = 0; i < pts.length; i++) {
      const c = pts[i],
        n = pts[(i + 1) % pts.length];
      ctx.quadraticCurveTo(c.x, c.y, (c.x + n.x) / 2, (c.y + n.y) / 2);
    }
    ctx.closePath();
  }

  function getCentre(pts) {
    let ax = 0,
      ay = 0;
    pts.forEach((p) => {
      ax += p.x;
      ay += p.y;
    });
    return { x: ax / pts.length, y: ay / pts.length };
  }

  /* ── EXCITED / STAR-STRUCK FACE ── */
  function drawFace(pts, r) {
    const c = getCentre(pts);
    const s = r * 0.55;

    ctx.save();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.75)";
    ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
    ctx.lineWidth = Math.max(1.5, r * 0.025);
    ctx.lineCap = "round";

    /* Star eyes — draw a small star shape for each eye */
    function drawStar(x, y, size) {
      ctx.save();
      ctx.translate(x, y);
      ctx.beginPath();
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2;
        const dist = i % 2 === 0 ? size : size * 0.45;
        if (i === 0) ctx.moveTo(Math.cos(a) * dist, Math.sin(a) * dist);
        else ctx.lineTo(Math.cos(a) * dist, Math.sin(a) * dist);
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    drawStar(c.x - s * 0.38, c.y - s * 0.18, s * 0.18);
    drawStar(c.x + s * 0.38, c.y - s * 0.18, s * 0.18);

    /* Big open excited smile */
    ctx.beginPath();
    ctx.arc(c.x, c.y + s * 0.18, s * 0.45, 0.15, Math.PI - 0.15);
    ctx.stroke();

    /* Rosy cheeks */
    ctx.fillStyle = "rgba(255, 150, 180, 0.35)";
    ctx.beginPath();
    ctx.ellipse(
      c.x - s * 0.55,
      c.y + s * 0.05,
      s * 0.18,
      s * 0.1,
      0,
      0,
      Math.PI * 2,
    );
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(
      c.x + s * 0.55,
      c.y + s * 0.05,
      s * 0.18,
      s * 0.1,
      0,
      0,
      Math.PI * 2,
    );
    ctx.fill();

    ctx.restore();
  }

  function update() {
    time += CONFIG.floatSpeed;
    const scale = 1.0;
    const bodyX = Math.sin(time * 0.8) * 6 * scale;
    const bodyY =
      Math.sin(time * 1.1) * 10 * scale + Math.cos(time * 0.6) * 4 * scale;
    const floatAmt = CONFIG.floatAmount * scale;

    points.forEach((p, i) => {
      const floatX = Math.cos(time + i * 0.4) * floatAmt + bodyX;
      const floatY = Math.sin(time + i * 0.3) * floatAmt + bodyY;
      const fx = (p.rx + floatX - p.x) * CONFIG.springStrength;
      const fy = (p.ry + floatY - p.y) * CONFIG.springStrength;
      const dx = p.x - mouse.x,
        dy = p.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < CONFIG.mouseRadius && dist > 0) {
        const str = (1 - dist / CONFIG.mouseRadius) * CONFIG.mouseForce;
        p.vx += (dx / dist) * str;
        p.vy += (dy / dist) * str;
      }
      p.vx = (p.vx + fx) * CONFIG.damping;
      p.vy = (p.vy + fy) * CONFIG.damping;
      p.x += p.vx;
      p.y += p.vy;
    });
  }

  function render() {
    ctx.clearRect(0, 0, W, H);
    drawCurve(points);
    ctx.fillStyle = CONFIG.fillColor;
    ctx.fill();
    ctx.strokeStyle = CONFIG.strokeColor;
    ctx.lineWidth = CONFIG.strokeWidth;
    ctx.stroke();
    drawFace(points, radius);
  }

  function loop() {
    update();
    render();
    requestAnimationFrame(loop);
  }
  loop();
})();
