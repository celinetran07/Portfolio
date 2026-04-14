(function () {

  const CONFIG = {
  springStrength : 0.08,
  damping        : 0.75,
  mouseRadius    : 60,
  mouseForce     : 8,
  floatSpeed     : 0.0016,  // was 0.0008 — slightly faster drift
  floatAmount    : 18,      // was 8 — much more movement
  strokeColor    : 'rgba(131, 117, 255, 0.35)',
  fillColor      : 'rgba(131, 117, 255, 0.08)',
  strokeWidth    : 2,
};

  const canvas = document.getElementById('elastic-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  /* ── BUILD FLOWER POINTS ── */
  function buildFlower(cx, cy, r, petals, petalDepth, count) {
    const pts = [];
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
      const wave  = 1 + petalDepth * Math.sin(angle * petals);
      pts.push({
        rx: cx + Math.cos(angle) * r * wave,
        ry: cy + Math.sin(angle) * r * wave * 0.9,
        x: cx + Math.cos(angle) * r * wave,
        y: cy + Math.sin(angle) * r * wave * 0.9,
        vx: 0, vy: 0
      });
    }
    return pts;
  }

  /* ── TWO SHAPES ── */
  /* Each shape has: points, centre (cx,cy), radius, and face config */
  let shapes = [];
  let mouse  = { x: -9999, y: -9999 };
  let time   = 0;
  let W, H;

  function resize() {
    W = canvas.offsetWidth;
    H = canvas.offsetHeight;
    canvas.width  = W;
    canvas.height = H;

    shapes = [
      {
        /* Big flower — centre right, your main shape */
        cx: W * 0.70, cy: H * 0.50,
        r:  Math.min(W, H) * 0.30,
        petals: 5, petalDepth: 0.35,
        count: 64,
        points: [],
        face: 'happy',
        floatOffset: 0,
      },
      {
        /* Small flower — lower left, secondary shape */
        cx: W * 0.20, cy: H * 0.78,
        r:  Math.min(W, H) * 0.14,
        petals: 5, petalDepth: 0.35,
        count: 48,
        points: [],
        face: 'sleepy',
        floatOffset: 1.5, /* offset so they don't float in sync */
      },
    ];

    shapes.forEach(s => {
      s.points = buildFlower(s.cx, s.cy, s.r, s.petals, s.petalDepth, s.count);
    });
  }

  window.addEventListener('resize', resize);
  resize();

  /* ── MOUSE ── */
  window.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });
  document.addEventListener('mouseleave', () => { mouse.x = -9999; mouse.y = -9999; });

  /* ── SMOOTH CURVE ── */
  function drawCurve(pts) {
    if (pts.length < 3) return;
    ctx.beginPath();
    const last = pts[pts.length - 1];
    ctx.moveTo((last.x + pts[0].x) / 2, (last.y + pts[0].y) / 2);
    for (let i = 0; i < pts.length; i++) {
      const curr = pts[i];
      const next = pts[(i + 1) % pts.length];
      ctx.quadraticCurveTo(curr.x, curr.y, (curr.x + next.x) / 2, (curr.y + next.y) / 2);
    }
    ctx.closePath();
  }

  /* ── GET CURRENT CENTRE (average of all points) ── */
  function getCentre(pts) {
    let ax = 0, ay = 0;
    pts.forEach(p => { ax += p.x; ay += p.y; });
    return { x: ax / pts.length, y: ay / pts.length };
  }

  /* ── DRAW FACE ── */
function drawFace(pts, type, r) {
    const c  = getCentre(pts);
    const s  = r * 0.55; /* was 0.38 — bigger scale = more spread */

    ctx.save();
    ctx.strokeStyle = 'rgba(131, 117, 255, 0.7)';
    ctx.fillStyle   = 'rgba(131, 117, 255, 0.7)';
    ctx.lineWidth   = Math.max(1.5, r * 0.025);
    ctx.lineCap     = 'round';

    if (type === 'happy') {
      const eyeW = s * 0.18;
      /* Left eye — further apart */
      ctx.beginPath();
      ctx.arc(c.x - s * 0.42, c.y - s * 0.18, eyeW, Math.PI, 0);
      ctx.stroke();
      /* Right eye */
      ctx.beginPath();
      ctx.arc(c.x + s * 0.42, c.y - s * 0.18, eyeW, Math.PI, 0);
      ctx.stroke();
      /* Smile — lower and wider */
      ctx.beginPath();
      ctx.arc(c.x, c.y + s * 0.18, s * 0.42, 0.2, Math.PI - 0.2);
      ctx.stroke();
    }

    if (type === 'sleepy') {
      const eyeW = s * 0.16;
      /* Left eye — flat line */
      ctx.beginPath();
      ctx.moveTo(c.x - s * 0.55, c.y - s * 0.1);
      ctx.lineTo(c.x - s * 0.25, c.y - s * 0.1);
      ctx.stroke();
      /* Left eye bottom arc */
      ctx.beginPath();
      ctx.arc(c.x - s * 0.40, c.y - s * 0.1, eyeW, 0, Math.PI);
      ctx.stroke();
      /* Right eye — flat line */
      ctx.beginPath();
      ctx.moveTo(c.x + s * 0.25, c.y - s * 0.1);
      ctx.lineTo(c.x + s * 0.55, c.y - s * 0.1);
      ctx.stroke();
      /* Right eye bottom arc */
      ctx.beginPath();
      ctx.arc(c.x + s * 0.40, c.y - s * 0.1, eyeW, 0, Math.PI);
      ctx.stroke();
      /* Small mouth */
      ctx.beginPath();
      ctx.arc(c.x, c.y + s * 0.28, s * 0.14, 0, Math.PI);
      ctx.stroke();
      /* Zzz */
      ctx.font = `${Math.max(10, r * 0.18)}px 'Bebas Neue', sans-serif`;
      ctx.fillStyle = 'rgba(131,117,255,0.45)';
    }

    ctx.restore();
  }

  /* ── PHYSICS ── */
 function updateShape(s) {
  const t = time + s.floatOffset;

  /* Scale body drift by the shape's radius so small shapes move less */
  const scale = s.r / (Math.min(W, H) * 0.30);
  const bodyX = Math.sin(t * 0.8) * 6 * scale;
  const bodyY = Math.sin(t * 1.1) * 10 * scale + Math.cos(t * 0.6) * 4 * scale;

  /* Also scale the per-point float by radius */
  const floatAmt = CONFIG.floatAmount * scale;

  s.points.forEach((p, i) => {
    const floatX = Math.cos(t + i * 0.4) * floatAmt + bodyX;
    const floatY = Math.sin(t + i * 0.3) * floatAmt + bodyY;
    const fx = (p.rx + floatX - p.x) * CONFIG.springStrength;
    const fy = (p.ry + floatY - p.y) * CONFIG.springStrength;
    const dx = p.x - mouse.x;
    const dy = p.y - mouse.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < CONFIG.mouseRadius && dist > 0) {
      const strength = (1 - dist / CONFIG.mouseRadius) * CONFIG.mouseForce;
      p.vx += (dx / dist) * strength;
      p.vy += (dy / dist) * strength;
    }
    p.vx = (p.vx + fx) * CONFIG.damping;
    p.vy = (p.vy + fy) * CONFIG.damping;
    p.x += p.vx;
    p.y += p.vy;
  });
}

  /* ── RENDER ── */
  function render() {
    ctx.clearRect(0, 0, W, H);
    shapes.forEach(s => {
      drawCurve(s.points);
      ctx.fillStyle   = CONFIG.fillColor;
      ctx.fill();
      ctx.strokeStyle = CONFIG.strokeColor;
      ctx.lineWidth   = CONFIG.strokeWidth;
      ctx.stroke();
      drawFace(s.points, s.face, s.r);
    });
  }

  /* ── LOOP ── */
  function loop() {
    time += CONFIG.floatSpeed;
    shapes.forEach(updateShape);
    render();
    requestAnimationFrame(loop);
  }
  loop();

})();