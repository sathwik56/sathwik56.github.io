/* ================================================================
   SATHWIK ACHARYA — Contact Page | contact.js
================================================================ */
'use strict';

const isTouch     = window.matchMedia('(hover:none),(pointer:coarse)').matches;
const prefReduced = window.matchMedia('(prefers-reduced-motion:reduce)').matches;

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

/* ── BACK TO TOP ── */
(function () {
  const btn = document.getElementById('btt');
  if (!btn) return;
  const update = () => {
    btn.classList.toggle('show', window.scrollY > 400);
    document.body.classList.toggle('show-mobile-rail', window.scrollY > 260);
  };
  update();
  window.addEventListener('scroll', update, { passive: true });
  btn.addEventListener('click', () =>
    window.scrollTo({ top: 0, behavior: 'smooth' })
  );
})();

/* ── SCROLL REVEAL ── */
(function () {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;
  if (prefReduced) { items.forEach(e => e.classList.add('visible')); return; }
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
    });
  }, { threshold: 0.1 });
  items.forEach(e => io.observe(e));
})();

/* ── CONTACT FORM — mailto fallback ── */
(function () {
  const form      = document.getElementById('contact-form');
  if (!form) return;

  const nameIn    = document.getElementById('cf-name');
  const emailIn   = document.getElementById('cf-email');
  const subjectIn = document.getElementById('cf-subject');
  const msgIn     = document.getElementById('cf-message');
  const submitBtn = document.getElementById('cf-submit');
  const btnText   = document.getElementById('cf-btn-text');
  const note      = document.getElementById('cf-note');

  function setNote(text, type) {
    if (!note) return;
    note.textContent = text;
    note.className   = 'ct-note' + (type ? ' ' + type : '');
  }
  function clearErr(f) {
    if (!f) return;
    f.classList.remove('error');
    f.removeAttribute('aria-invalid');
    f.removeAttribute('aria-describedby');
  }
  function markErr(f) {
    if (!f) return;
    f.classList.add('error');
    f.setAttribute('aria-invalid', 'true');
    f.setAttribute('aria-describedby', 'cf-note');
  }
  function validate() {
    let ok = true;
    [nameIn, emailIn, msgIn].forEach(clearErr);
    if (!nameIn?.value.trim()) { markErr(nameIn); ok = false; }
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailIn || !re.test(emailIn.value.trim())) { markErr(emailIn); ok = false; }
    if (!msgIn?.value.trim()) { markErr(msgIn); ok = false; }
    if (!ok) [nameIn, emailIn, msgIn].find(f => f?.classList.contains('error'))?.focus();
    return ok;
  }

  [nameIn, emailIn, msgIn].forEach(f => {
    f?.addEventListener('input', () => {
      clearErr(f);
      if (note?.classList.contains('error-note')) setNote('');
    });
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!validate()) { setNote('Please fill in all required fields.', 'error-note'); return; }

    const name    = nameIn.value.trim();
    const email   = emailIn.value.trim();
    const subject = subjectIn?.value.trim() || ('Portfolio Contact from ' + name);
    const body    = 'Name: ' + name + '\nEmail: ' + email + '\n\n' + msgIn.value.trim();
    const mailto  = 'mailto:sathwikacharya022@gmail.com'
      + '?subject=' + encodeURIComponent(subject)
      + '&body='    + encodeURIComponent(body);

    if (submitBtn) submitBtn.disabled = true;
    if (btnText)   btnText.textContent = 'Opening email…';
    window.location.href = mailto;

    setTimeout(() => {
      setNote('✓ Your email client should open with the message ready. Thank you!', 'success');
      form.reset();
      if (submitBtn) submitBtn.disabled = false;
      if (btnText)   btnText.textContent = 'Send Message';
    }, 1400);
  });
})();
