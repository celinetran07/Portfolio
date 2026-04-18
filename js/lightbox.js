/* ============================================================
   CELINE TRAN — PORTFOLIO 2026
   lightbox.js — Reusable lightbox for creative project pages

   Usage:
     initLightbox(['path/to/img1.jpg', 'path/to/img2.jpg', ...]);

   Expects in HTML:
     <div class="lightbox" id="lightbox">
       <div class="lightbox-inner">
         <button class="lb-btn" id="lb-prev">←</button>
         <div class="lb-img-wrap">
           <button class="lb-close" id="lb-close">×</button>
           <img id="lb-img" src="" alt="">
           <div class="lb-counter" id="lb-counter"></div>
         </div>
         <button class="lb-btn" id="lb-next">→</button>
       </div>
     </div>

   Thumbnails need: class="cp-thumb" and data-index="N"
   ============================================================ */

function initLightbox(images) {
  const lightbox = document.getElementById("lightbox");
  const lbImg = document.getElementById("lb-img");
  const lbCounter = document.getElementById("lb-counter");
  const lbClose = document.getElementById("lb-close");
  const lbPrev = document.getElementById("lb-prev");
  const lbNext = document.getElementById("lb-next");

  if (!lightbox || !lbImg) return;

  let current = 0;

  function open(i) {
    current = i;
    lbImg.src = images[current];
    lbCounter.textContent = current + 1 + " / " + images.length;
    lightbox.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function close() {
    lightbox.classList.remove("open");
    document.body.style.overflow = "";
  }

  function prev() {
    current = (current - 1 + images.length) % images.length;
    lbImg.src = images[current];
    lbCounter.textContent = current + 1 + " / " + images.length;
  }

  function next() {
    current = (current + 1) % images.length;
    lbImg.src = images[current];
    lbCounter.textContent = current + 1 + " / " + images.length;
  }

  document.querySelectorAll(".cp-thumb").forEach((thumb) => {
    thumb.addEventListener("click", () => open(+thumb.dataset.index));
  });

  if (lbClose) lbClose.addEventListener("click", close);
  if (lbPrev) lbPrev.addEventListener("click", prev);
  if (lbNext) lbNext.addEventListener("click", next);

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) close();
  });

  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("open")) return;
    if (e.key === "ArrowLeft") prev();
    if (e.key === "ArrowRight") next();
    if (e.key === "Escape") close();
  });
}
