/* ============================================================
   CELINE TRAN — PORTFOLIO 2026
   video-carousel.js — Work Preview Carousel

   Usage: call initVideoCarousel() after DOM is ready,
   or place <script src="js/video-carousel.js"></script>
   before </body>. Works alongside existing main.js.
   ============================================================ */

function initVideoCarousel() {
  const stage   = document.querySelector('.vc-stage');
  if (!stage) return;

  const slides  = stage.querySelectorAll('.vc-slide');
  const dots    = stage.querySelectorAll('.vc-dot');
  const prevBtn = stage.querySelector('.vc-arrow-prev');
  const nextBtn = stage.querySelector('.vc-arrow-next');
  const screen  = stage.querySelector('.vc-screen');
  const caption = stage.querySelector('.vc-caption');
  const capTag  = stage.querySelector('.vc-caption-tag');
  const capTitle= stage.querySelector('.vc-caption-title');

  if (!slides.length) return;

  let current = 0;
  let hovered = false;

  /* ── helpers ── */
  function getVideo(slide) {
    return slide.querySelector('video');
  }

  function pauseAll() {
    slides.forEach(s => {
      const v = getVideo(s);
      if (v) { v.pause(); v.currentTime = 0; }
    });
  }

  function goTo(index) {
    const prev = current;
    current = (index + slides.length) % slides.length;
    if (prev === current) return;

    /* caption fade-out */
    if (caption) {
      caption.classList.add('switching');
      setTimeout(() => {
        updateCaption();
        caption.classList.remove('switching');
      }, 300);
    }

    /* slide crossfade */
    slides[prev].classList.remove('active');
    slides[current].classList.add('active');

    /* dots */
    dots.forEach((d, i) => d.classList.toggle('active', i === current));

    /* video: pause old, play new if hovered */
    pauseAll();
    if (hovered) {
      const v = getVideo(slides[current]);
      if (v) v.play();
    }
  }

  function updateCaption() {
    const active = slides[current];
    if (capTag)   capTag.textContent   = active.dataset.tag   || '';
    if (capTitle) capTitle.textContent = active.dataset.title || '';
  }

  /* ── hover: play / pause ── */
  if (screen) {
    screen.addEventListener('mouseenter', () => {
      hovered = true;
      const v = getVideo(slides[current]);
      if (v) v.play();
    });

    screen.addEventListener('mouseleave', () => {
      hovered = false;
      const v = getVideo(slides[current]);
      if (v) { v.pause(); v.currentTime = 0; }
    });
  }

  /* ── arrows ── */
  if (prevBtn) prevBtn.addEventListener('click', () => goTo(current - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => goTo(current + 1));

  /* ── dots ── */
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => goTo(i));
  });

  /* ── keyboard (when carousel is in view) ── */
  document.addEventListener('keydown', e => {
    if (!stage.closest(':hover') && document.activeElement !== stage) return;
    if (e.key === 'ArrowLeft')  goTo(current - 1);
    if (e.key === 'ArrowRight') goTo(current + 1);
  });

  /* ── loop: restart on ended ── */
  slides.forEach(slide => {
    const v = getVideo(slide);
    if (!v) return;
    v.loop = false; /* we control looping ourselves */
    v.muted = true;
    v.playsInline = true;
    v.addEventListener('ended', () => {
      if (hovered) {
        /* loop while still hovering */
        v.currentTime = 0;
        v.play();
      }
    });
  });

  /* ── cursor hover state integration with main.js ── */
  stage.querySelectorAll('.vc-arrow, .vc-dot').forEach(el => {
    el.addEventListener('mouseenter', () => {
      const cursor = document.getElementById('cursor');
      if (cursor) cursor.classList.add('hover');
    });
    el.addEventListener('mouseleave', () => {
      const cursor = document.getElementById('cursor');
      if (cursor) cursor.classList.remove('hover');
    });
  });

  /* ── init ── */
  slides[0].classList.add('active');
  if (dots[0]) dots[0].classList.add('active');
  updateCaption();
}

/* auto-init if not called manually */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initVideoCarousel);
} else {
  initVideoCarousel();
}
