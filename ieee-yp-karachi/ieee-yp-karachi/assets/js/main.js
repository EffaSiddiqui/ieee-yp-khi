/* ============================================================
   IEEE YP Karachi — main.js
   ============================================================ */

const NAV = [
  { href: 'index.html',      label: 'Home' },
  { href: 'about.html',      label: 'About' },
  { href: 'committee.html',  label: 'Committee' },
  { href: 'events.html',     label: 'Events' },
  { href: 'membership.html', label: 'Join YP' },
  { href: 'resources.html',  label: 'Resources' },
];

const SOCIALS = {
  instagram: 'https://www.instagram.com/ieeeypkarachi/',
  facebook:  'https://www.facebook.com/IEEEYPKarachi',
  youtube:   'https://www.youtube.com/@IEEEYPKarachi',
  linkedin:  'https://www.linkedin.com/company/ieeeypkarachi/',
};

const SVG = {
  instagram: `<svg viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>`,
  facebook:  `<svg viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>`,
  youtube:   `<svg viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>`,
  linkedin:  `<svg viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>`,
  check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>`,
};

/* ── Inject Nav ─────────────────────────────────────────── */
function injectNav() {
  const header = document.getElementById('site-header');
  if (!header) return;
  const cur = location.pathname.split('/').pop() || 'index.html';
  const links = NAV.map(l =>
    `<a href="${l.href}" class="nav-link${cur === l.href ? ' active' : ''}">${l.label}</a>`
  ).join('');

  header.innerHTML = `
    <div class="ieee-top-bar">
      <div class="container">
        <div class="ieee-top-links">
          <a href="https://www.ieee.org" target="_blank" rel="noopener">IEEE.org</a>
          <a href="https://ieeexplore.ieee.org" target="_blank" rel="noopener">IEEE Xplore</a>
          <a href="https://standards.ieee.org" target="_blank" rel="noopener">IEEE Standards</a>
          <a href="https://spectrum.ieee.org" target="_blank" rel="noopener">IEEE Spectrum</a>
        </div>
        <div class="ieee-top-links">
          <a href="${SOCIALS.instagram}" target="_blank" rel="noopener">Instagram</a>
          <a href="${SOCIALS.facebook}" target="_blank" rel="noopener">Facebook</a>
          <a href="${SOCIALS.youtube}" target="_blank" rel="noopener">YouTube</a>
          <a href="${SOCIALS.linkedin}" target="_blank" rel="noopener">LinkedIn</a>
        </div>
      </div>
    </div>
    <div class="nav-main">
      <a href="index.html" class="nav-logo" aria-label="IEEE YP Karachi">
        <img src="assets/images/yp-logo-actual.png" alt="IEEE Young Professionals Karachi">
      </a>
      <nav class="nav-links" aria-label="Main">${links}</nav>
      <div class="nav-end">
        <a href="membership.html" class="btn btn-primary btn-sm" id="nav-join">Join YP</a>
        <button class="nav-toggle" id="nav-toggle" aria-label="Menu" aria-expanded="false">
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>
    <nav class="nav-mobile" id="nav-mobile">${links}
      <a href="membership.html" class="btn btn-primary">Join IEEE YP</a>
    </nav>
  `;

  // toggle
  const toggle = document.getElementById('nav-toggle');
  const mob    = document.getElementById('nav-mobile');
  toggle.addEventListener('click', () => {
    const open = mob.classList.toggle('open');
    toggle.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });
  document.addEventListener('click', e => {
    if (!header.contains(e.target)) {
      mob.classList.remove('open'); toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded','false'); document.body.style.overflow = '';
    }
  });
  mob.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    mob.classList.remove('open'); toggle.classList.remove('open');
    toggle.setAttribute('aria-expanded','false'); document.body.style.overflow = '';
  }));
}

/* ── Inject Footer ──────────────────────────────────────── */
function injectFooter() {
  const f = document.getElementById('site-footer');
  if (!f) return;
  f.innerHTML = `
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <img src="assets/images/yp-logo-actual.png" alt="IEEE YP Karachi">
          <p>We are an inspiring community of recent graduates, emerging leaders, and seasoned professionals united by a commitment to innovation, growth, and community impact in Karachi.</p>
          <div class="footer-social-row">
            <a href="${SOCIALS.instagram}" target="_blank" rel="noopener" class="footer-soc-icon footer-soc-instagram" aria-label="Instagram">${SVG.instagram}</a>
            <a href="${SOCIALS.facebook}"  target="_blank" rel="noopener" class="footer-soc-icon footer-soc-facebook"  aria-label="Facebook">${SVG.facebook}</a>
            <a href="${SOCIALS.youtube}"   target="_blank" rel="noopener" class="footer-soc-icon footer-soc-youtube"   aria-label="YouTube">${SVG.youtube}</a>
            <a href="${SOCIALS.linkedin}"  target="_blank" rel="noopener" class="footer-soc-icon footer-soc-linkedin"  aria-label="LinkedIn">${SVG.linkedin}</a>
          </div>
        </div>
        <div class="footer-col">
          <h4>Navigation</h4>
          <ul>
            <li><a href="index.html">Home</a></li>
            <li><a href="about.html">About Us</a></li>
            <li><a href="committee.html">Committee</a></li>
            <li><a href="events.html">Events</a></li>
            <li><a href="membership.html">Join YP</a></li>
            <li><a href="resources.html">Resources</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Useful Links</h4>
          <ul>
            <li><a href="https://r10.ieee.org/karachi-yp/" target="_blank" rel="noopener">IEEE YP Karachi</a></li>
            <li><a href="https://www.ieeer10.org" target="_blank" rel="noopener">IEEE Region 10</a></li>
            <li><a href="https://yp.ieeer10.org" target="_blank" rel="noopener">R10 Young Professionals</a></li>
            <li><a href="https://yp.ieee.org" target="_blank" rel="noopener">IEEE Young Professionals</a></li>
            <li><a href="https://www.ieee.org" target="_blank" rel="noopener">IEEE Global</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Connect</h4>
          <ul>
            <li><a href="${SOCIALS.instagram}" target="_blank" rel="noopener">Instagram</a></li>
            <li><a href="${SOCIALS.facebook}"  target="_blank" rel="noopener">Facebook</a></li>
            <li><a href="${SOCIALS.youtube}"   target="_blank" rel="noopener">YouTube</a></li>
            <li><a href="${SOCIALS.linkedin}"  target="_blank" rel="noopener">LinkedIn</a></li>
            <li><a href="membership.html">Join IEEE YP</a></li>
          </ul>
        </div>
      </div>
      <hr class="footer-divider">
      <div class="footer-bottom">
        <span>Copyright &copy; ${new Date().getFullYear()} IEEE Young Professionals Karachi Section &mdash; All rights reserved.</span>
        <span>Part of <a href="https://www.ieee.org" target="_blank" rel="noopener">IEEE</a> &amp; <a href="https://yp.ieee.org" target="_blank" rel="noopener">IEEE Young Professionals</a></span>
      </div>
    </div>
  `;
}

/* ── Counter animation ──────────────────────────────────── */
function initCounters() {
  const els = document.querySelectorAll('[data-count]');
  if (!els.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el  = e.target;
      const end = +el.dataset.count;
      const dur = 1600;
      const step = Math.ceil(end / (dur / 16));
      let cur = 0;
      const t = setInterval(() => {
        cur = Math.min(cur + step, end);
        el.textContent = cur.toLocaleString();
        if (cur >= end) clearInterval(t);
      }, 16);
      obs.unobserve(el);
    });
  }, { threshold: 0.4 });
  els.forEach(el => obs.observe(el));
}

/* ── FAQ accordion ──────────────────────────────────────── */
function initFaq() {
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });
}

/* ── Init ───────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  injectNav();
  injectFooter();
  initCounters();
  initFaq();
});
