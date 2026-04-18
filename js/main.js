/* ============================================================
   CELINE TRAN — PORTFOLIO 2026
   main.js — Shared Interactions
   ============================================================ */

/* ── HOME GUARD ── */
if (document.getElementById("home-guard")) {
  const navType = performance.getEntriesByType("navigation")[0]?.type;
  if (
    navType === "navigate" &&
    sessionStorage.getItem("enteredFrom") !== "loader" &&
    !sessionStorage.getItem("visitedSite")
  ) {
    window.location.href = "index.html";
  }
  if (navType === "reload") {
    sessionStorage.removeItem("visitedSite");
    window.location.href = "index.html";
  }
  sessionStorage.removeItem("enteredFrom");
}

/* ── LOADER ── */
const loader = document.getElementById("loader");
if (loader) {
  const burstColors = [
    "#8375FF",
    "#E6F2A6",
    "#F1FF99",
    "#9B8BFF",
    "#7060EE",
    "#3B3B3B",
  ];
  let popped = 0;

  function spawnBurst(burstEl) {
    burstEl.innerHTML = "";
    for (let i = 0; i < 14; i++) {
      const p = document.createElement("div");
      p.className = "burst-particle";
      const angle = (i / 14) * 360;
      const dist = 40 + Math.random() * 60;
      p.style.setProperty(
        "--tx",
        Math.cos((angle * Math.PI) / 180) * dist + "px",
      );
      p.style.setProperty(
        "--ty",
        Math.sin((angle * Math.PI) / 180) * dist + "px",
      );
      p.style.background =
        burstColors[Math.floor(Math.random() * burstColors.length)];
      p.style.animationDelay = Math.random() * 0.1 + "s";
      burstEl.appendChild(p);
    }
  }

  document.querySelectorAll(".balloon").forEach((balloon, i) => {
    balloon.addEventListener("click", () => {
      if (balloon.classList.contains("popped")) return;
      balloon.classList.add("popped");
      spawnBurst(document.getElementById("burst" + i));
      popped++;
      if (popped === 3) {
        sessionStorage.setItem("enteredFrom", "loader");
        sessionStorage.setItem("visitedSite", "1");
        setTimeout(() => {
          window.location.href = "home.html";
        }, 600);
      }
    });
  });
}
/* ── CURSOR ── */
const cursor = document.getElementById("cursor");

document.addEventListener("mousemove", (e) => {
  cursor.style.left = e.clientX + "px";
  cursor.style.top = e.clientY + "px";
});
document.addEventListener("mousedown", () => cursor.classList.add("press"));
document.addEventListener("mouseup", () => cursor.classList.remove("press"));

document
  .querySelectorAll("a, button, .card, .creative-card, .skill-tag")
  .forEach((el) => {
    el.addEventListener("mouseenter", () => cursor.classList.add("hover"));
    el.addEventListener("mouseleave", () => cursor.classList.remove("hover"));
  });

/* ── HAMBURGER ── */
const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobile-menu");
const navbar = document.getElementById("navbar");

function updateMenuBackground() {
  if (navbar.classList.contains("scrolled")) {
    mobileMenu.style.background = "var(--brand3)";
  } else {
    mobileMenu.style.background = "var(--light4)";
  }
}

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("open");
  mobileMenu.classList.toggle("open");
  updateMenuBackground();
});

document.getElementById("mobile-close").addEventListener("click", () => {
  hamburger.classList.remove("open");
  mobileMenu.classList.remove("open");
});

window.addEventListener("scroll", () => {
  document
    .getElementById("navbar")
    .classList.toggle("scrolled", window.scrollY > 20);
  if (mobileMenu.classList.contains("open")) {
    updateMenuBackground();
  }
});

/* ── FADE UP ON SCROLL ── */
const fadeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      } else {
        entry.target.classList.remove('visible');
      }
    });
  },
  {
    threshold: 0.3,
    rootMargin: '0px 0px -100px 0px',
  },
);

document.querySelectorAll('.fade-up').forEach((el) => fadeObserver.observe(el));

/* ── TRIGGER FADE-UPS ALREADY IN VIEW ON LOAD ── */
document.querySelectorAll('.fade-up').forEach(el => {
  const rect = el.getBoundingClientRect();
  if (rect.top < window.innerHeight * 0.9) {
    el.classList.add('visible');
  }
});

document.querySelectorAll(".fade-up").forEach((el) => fadeObserver.observe(el));

/* ── CARD 3D TILT ── */
document.querySelectorAll(".card").forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    card.style.transform = `perspective(600px) rotateY(${x * 8}deg) rotateX(${-y * 5}deg) scale(1.03)`;
  });
  card.addEventListener("mouseleave", () => {
    card.style.transform = "";
  });
});


/* ── PROJECT MODAL (work + home pages) ── */
const modal = document.getElementById("project-modal");
if (modal) {
  const modalClose = document.getElementById("modal-close");

  const projects = {
    1: {
      tag: "UX / UI Design — 2026",
      title: "Project Title One",
      thumb: "v1",
    },
    2: { tag: "Game Design — 2026", title: "Project Title Two", thumb: "v2" },
    3: {
      tag: "Web Development — 2025",
      title: "Project Title Three",
      thumb: "v3",
    },
    4: {
      tag: "Motion / Video — 2025",
      title: "Project Title Four",
      thumb: "v4",
    },
    5: {
      tag: "Graphic Design — 2025",
      title: "Project Title Five",
      thumb: "v1",
    },
    6: { tag: "Interactive — 2024", title: "Project Title Six", thumb: "v2" },
  };

  function openModal(id) {
    const p = projects[id];
    if (!p) return;
    document.getElementById("modal-tag").textContent = p.tag;
    document.getElementById("modal-title").textContent = p.title;
    document.getElementById("modal-thumb").className = "modal-thumb " + p.thumb;
    modal.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    modal.classList.remove("open");
    document.body.style.overflow = "";
  }

  document.querySelectorAll("[data-modal]").forEach((card) => {
    card.addEventListener("click", (e) => {
      e.preventDefault();
      openModal(card.dataset.modal);
    });
  });

  modalClose.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });
}

/* ── CONTACT FORM (contact page only) ── */
const contactForm = document.getElementById("contact-form");
if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const success = document.getElementById("form-success");
    success.style.display = "block";
    contactForm.reset();
    setTimeout(() => {
      success.style.display = "none";
    }, 5000);
  });
}

/* ── CLOSE MOBILE MENU ON ANCHOR CLICK ── */
document.querySelectorAll('.mobile-nav-link[href^="#"]').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
  });
});

/* ── TYPEWRITER (home page only) ── */
const twEl = document.getElementById("typewriter");
if (twEl) {
  const words = ["UI/UX", "games", "websites", "experiences", "3D worlds"];
  let wi = 0,
    ci = 0,
    deleting = false;

  function typeLoop() {
    const word = words[wi];
    if (!deleting) {
      twEl.textContent = word.slice(0, ci + 1);
      ci++;
      if (ci === word.length) {
        deleting = true;
        setTimeout(typeLoop, 1800);
        return;
      }
      setTimeout(typeLoop, 90);
    } else {
      twEl.textContent = word.slice(0, ci - 1);
      ci--;
      if (ci === 0) {
        deleting = false;
        wi = (wi + 1) % words.length;
        setTimeout(typeLoop, 300);
        return;
      }
      setTimeout(typeLoop, 50);
    }
  }
  typeLoop();
} /* ← typewriter closes here */

/* ── HOME CONTACT BACKGROUND TRANSITION ── */
const homeContact = document.getElementById("home-contact");
if (homeContact) {
  const bgObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        document.body.classList.toggle("contact-visible", entry.isIntersecting);
      });
    },
    { threshold: 0.15 },
  );
  bgObserver.observe(homeContact);

  /* staggered link entrance */
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
    .querySelectorAll("#home-contact .contact-link-item")
    .forEach((l) => linkObserver.observe(l));
}
/* ── FLOATING PETALS (any element with class .has-petals) ── */
const petalTargets = document.querySelectorAll(".has-petals");
const PETAL_CHARS = ["✿", "❀"];

petalTargets.forEach((target) => {
  const color = target.dataset.petalColor || "rgba(59, 59, 59, 0.5)";

  function spawnPetal() {
    const p = document.createElement("span");
    p.style.cssText = `
      position: absolute;
      pointer-events: none;
      opacity: 0;
      z-index: 3;
      left: ${Math.random() * 100}%;
      font-size: ${14 + Math.random() * 18}px;
      color: ${color};
      animation: petalFloat ${7 + Math.random() * 8}s linear infinite;
      animation-delay: ${Math.random() * 3}s;
    `;
    p.textContent = PETAL_CHARS[Math.floor(Math.random() * PETAL_CHARS.length)];
    target.appendChild(p);
    setTimeout(() => p.remove(), 14000);
  }

  for (let i = 0; i < 8; i++) setTimeout(spawnPetal, i * 400);
  setInterval(spawnPetal, 1000);
});


/* ── PROJECT NAVIGATION ── */
const projectOrder = [
  { title: 'Live Coding Performance', url: 'musical-performance.html' },
  { title: 'Split Decision',        url: 'split-decision.html' },
  { title: 'The Encrypted Forest',  url: 'encrypted-forest.html' },
  
];

const projectNav = document.getElementById('project-nav');
if (projectNav) {
  const current = projectNav.dataset.current;
  const index = projectOrder.findIndex(p => p.url === current);
  const prev = projectOrder[index - 1];
  const next = projectOrder[index + 1];

  if (prev) {
    projectNav.querySelector('.proj-prev').href = prev.url;
    projectNav.querySelector('.proj-prev-label').textContent = prev.title;
  } else {
    projectNav.querySelector('.proj-prev').style.visibility = 'hidden';
  }

  if (next) {
    projectNav.querySelector('.proj-next').href = next.url;
    projectNav.querySelector('.proj-next-label').textContent = next.title;
  } else {
    projectNav.querySelector('.proj-next').style.visibility = 'hidden';
  }
}