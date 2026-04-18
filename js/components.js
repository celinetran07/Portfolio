/* ============================================================
   CELINE TRAN — PORTFOLIO 2026
   components.js — Shared HTML Components
   ============================================================ */

/* ── HELPERS ── */
function currentPage() {
  return window.location.pathname.split('/').pop() || 'index.html';
}

function isActive(page) {
  const cur = currentPage();
  if (page === 'work.html') {
    const workPages = ['work.html','musical-performance.html','split-decision.html','encrypted-forest.html'];
    return workPages.includes(cur) ? 'active' : '';
  }
  if (page === 'creative.html') {
    const creativePages = ['creative.html','nail-art.html','audio-project.html','video-project.html','woodwork.html'];
    return creativePages.includes(cur) ? 'active' : '';
  }
  if (page === 'about.html') return cur === 'about.html' ? 'active' : '';
  return '';
}

/* ── NAV ── */
function injectNav() {
  const el = document.getElementById('nav-placeholder');
  if (!el) return;
  el.outerHTML = `
    <nav id="navbar">
      <div class="nav-inner">
        <div class="nav-left">
          <a href="about.html" class="nav-link ${isActive('about.html')}">ABOUT</a>
          <a href="work.html"  class="nav-link ${isActive('work.html')}">WORK</a>
        </div>
        <a href="home.html" class="nav-logo">CT</a>
        <div class="nav-right">
          <a href="creative.html" class="nav-link ${isActive('creative.html')}">CREATIVE</a>
          <a href="#home-contact"  class="nav-link">CONTACT</a>
        </div>
        <button class="hamburger" id="hamburger" aria-label="Open menu">
          <span></span><span></span><span></span>
        </button>
      </div>
    </nav>
    <div class="mobile-menu" id="mobile-menu">
      <button class="close-btn" id="mobile-close">×</button>
      <a href="home.html"     class="mobile-nav-link">HOME</a>
      <a href="about.html"    class="mobile-nav-link ${isActive('about.html')}">ABOUT</a>
      <a href="work.html"     class="mobile-nav-link ${isActive('work.html')}">WORK</a>
      <a href="creative.html" class="mobile-nav-link ${isActive('creative.html')}">CREATIVE</a>
      <a href="#home-contact" class="mobile-nav-link">CONTACT</a>
    </div>`;
}

/* ── CONTACT DIVIDER ── */
function injectContactDivider() {
  const el = document.getElementById('contact-divider-placeholder');
  if (!el) return;
  const items = Array(16).fill(`
    <span class="contact-divider-item">Contact <span class="contact-divider-flower">✿</span></span>
  `).join('');
  el.outerHTML = `
    <div class="contact-divider">
      <div class="contact-divider-track">${items}</div>
    </div>`;
}

/* ── CONTACT SECTION ── */
function injectContact() {
  const el = document.getElementById('contact-placeholder');
  if (!el) return;
  el.outerHTML = `
    <section class="home-contact" id="home-contact">
      <h2 class="home-contact-tagline">Let's make something <span>Fun.</span></h2>
      <div class="contact-body-wrap">
        <div class="contact-links-col">
          <h2 class="contact-info-title">Connect with me</h2>

          <a href="https://mail.google.com/mail/?view=cm&to=celinetran707@gmail.com" class="contact-link-item" target="_blank" rel="noopener noreferrer">
            <div class="contact-link-icon">
              <svg viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            </div>
            <div class="contact-link-text">
              <p class="contact-link-label">Email</p>
              <p class="contact-link-value">celinetran707@gmail.com</p>
            </div>
            <span class="contact-link-arrow">→</span>
          </a>

          <a href="https://www.linkedin.com/in/c%C3%A9line-tran-9b5b03263/" class="contact-link-item" target="_blank" rel="noopener noreferrer">
            <div class="contact-link-icon">
              <svg viewBox="0 0 24 24"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
            </div>
            <div class="contact-link-text">
              <p class="contact-link-label">LinkedIn</p>
              <p class="contact-link-value">Céline Tran</p>
            </div>
            <span class="contact-link-arrow">→</span>
          </a>

          <a href="https://github.com/celinetran07" class="contact-link-item" target="_blank" rel="noopener noreferrer">
            <div class="contact-link-icon">
              <svg viewBox="0 0 24 24"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
            </div>
            <div class="contact-link-text">
              <p class="contact-link-label">GitHub</p>
              <p class="contact-link-value">github.com/celinetran07</p>
            </div>
            <span class="contact-link-arrow">→</span>
          </a>
        </div>
        <div class="contact-flower-col">
          <canvas id="contact-flower-canvas"></canvas>
        </div>
      </div>
      <p class="home-contact-copy">© 2026 Celine Tran. All rights reserved.</p>
    </section>`;
}

/* ── PAGE DECOS ── */
function injectPageDecos() {
  const el = document.getElementById('page-decos-placeholder');
  if (!el) return;
  el.outerHTML = `
    <div class="page-decos">
      <div class="deco deco-1"></div>
      <div class="deco deco-2"></div>
      <div class="deco deco-3"></div>
      <div class="deco deco-4"></div>
      <div class="deco deco-5"></div>
      <div class="deco deco-6"></div>
    </div>`;
}

/* ── INIT ── */
injectPageDecos();
injectNav();
injectContactDivider();
injectContact();
