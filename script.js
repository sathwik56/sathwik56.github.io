/* ================================================================
   SATHWIK ACHARYA — Portfolio | script.js
  Sathwik Acharya portfolio interactions
================================================================ */
'use strict';

const isTouch      = window.matchMedia('(hover:none),(pointer:coarse)').matches;
const prefReduced  = window.matchMedia('(prefers-reduced-motion:reduce)').matches;

/* ── PAGE LOADER ── */
window.addEventListener('load', () => {
  const l = document.getElementById('loader');
  if (!l) return;
  setTimeout(() => {
    document.body.classList.add('intro-ready');
    l.classList.add('hidden');
    setTimeout(() => l.remove(), 600);
  }, prefReduced ? 0 : 800);
});

/* ── TIME-AWARE GREETING ── */
(function () {
  const el = document.getElementById('greeting');
  if (!el) return;
  const h = new Date().getHours();
  const g = h < 5 ? 'Hi, Night Owl'
    : h < 12 ? 'Hi, Good Morning'
    : h < 17 ? 'Hi, Good Afternoon'
    : h < 21 ? 'Hi, Good Evening'
    : 'Hi, Night Owl';
  el.textContent = g;
})();

/* ── ROLE WORD CYCLE ── */
(function () {
  const el = document.getElementById('role-word');
  if (!el || prefReduced) return;

  const roles = ['Web', 'Python', 'Flask', 'Full Stack'];
  let idx = 0;
  let charIndex = el.textContent.length;
  let deleting = true;

  function typeRole() {
    const role = roles[idx];
    if (deleting) {
      charIndex -= 1;
      el.textContent = role.slice(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        idx = (idx + 1) % roles.length;
      }
    } else {
      const nextRole = roles[idx];
      charIndex += 1;
      el.textContent = nextRole.slice(0, charIndex);
      if (charIndex === nextRole.length) {
        deleting = true;
        setTimeout(typeRole, 1700);
        return;
      }
    }
    setTimeout(typeRole, deleting ? 70 : 110);
  }

  setTimeout(typeRole, 1700);
})();

/* ── SCROLL REVEAL ── */
(function () {
  const els = document.querySelectorAll('.reveal, .hero-reveal');
  if (!els.length) return;

  if (prefReduced) {
    els.forEach(e => e.classList.add('visible'));
    return;
  }

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  els.forEach(e => io.observe(e));
})();

/* ── HERO SCROLL CUE ── */
(function () {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const update = () => document.body.classList.toggle('scrolled-past-hero', window.scrollY > hero.offsetHeight * .35);
  update();
  window.addEventListener('scroll', update, { passive: true });
})();

/* ── PROJECTS BACKGROUND HEADING ── */
(function () {
  const heading = document.querySelector('.projects-bg-heading');
  if (!heading || prefReduced) return;

  let lastY = window.scrollY;
  let shift = 0;
  let raf = 0;

  function update() {
    const currentY = window.scrollY;
    const delta = currentY - lastY;
    lastY = currentY;
    shift = Math.max(-1200, Math.min(1200, shift - delta * .55));
    heading.style.setProperty('--projects-shift', `${shift}px`);
    raf = 0;
  }

  window.addEventListener('scroll', () => {
    if (!raf) raf = requestAnimationFrame(update);
  }, { passive: true });
})();

/* ── BACK TO TOP ── */
(function () {
  const btn = document.getElementById('btt');
  if (!btn) return;
  const update = () => {
    btn.classList.toggle('show', window.scrollY > 500);
    document.body.classList.toggle('show-mobile-rail', window.scrollY > 260);
  };
  update();
  window.addEventListener('scroll', update, { passive: true });
  btn.addEventListener('click', () =>
    window.scrollTo({ top: 0, behavior: 'smooth' })
  );
})();

/* ── CUSTOM CURSOR — desktop only ── */
(function () {
  const cursor = document.getElementById('cursor');
  if (!cursor || isTouch || prefReduced) {
    cursor && cursor.remove();
    return;
  }

  let tx = 0, ty = 0, cx = 0, cy = 0, raf;
  const LERP = .16;

  function tick() {
    cx += (tx - cx) * LERP;
    cy += (ty - cy) * LERP;
    cursor.style.left = cx + 'px';
    cursor.style.top  = cy + 'px';
    raf = requestAnimationFrame(tick);
  }
  tick();

  document.addEventListener('pointermove', e => {
    tx = e.clientX; ty = e.clientY;
    cursor.classList.add('visible');
  }, { passive: true });

  document.addEventListener('pointerdown', () => cursor.classList.add('pressed'),  { passive: true });
  document.addEventListener('pointerup',   () => cursor.classList.remove('pressed'), { passive: true });
  document.documentElement.addEventListener('pointerleave', () =>
    cursor.classList.remove('visible', 'hovering', 'pressed')
  );

  const sel = 'a,button,[role="button"],input,textarea,select,[tabindex]';
  document.addEventListener('pointerover', e => {
    if (e.target.closest(sel)) cursor.classList.add('hovering');
  }, { passive: true });
  document.addEventListener('pointerout', e => {
    if (e.target.closest(sel)) cursor.classList.remove('hovering');
  }, { passive: true });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(raf); else tick();
  });
})();

/* ── SMOOTH ANCHOR SCROLL ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id  = a.getAttribute('href').slice(1);
    const tgt = document.getElementById(id);
    if (!tgt) return;
    e.preventDefault();
    tgt.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});
