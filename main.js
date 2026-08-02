/* ============================================================
   MAIN.JS — C Lohith Kumar Portfolio
   Particles | Cursor | Typed | Scroll Animations | Form
   ============================================================ */

'use strict';

/* ===== UTILITY ===== */
const $ = (sel, scope = document) => scope.querySelector(sel);
const $$ = (sel, scope = document) => [...scope.querySelectorAll(sel)];
const clamp = (v, min, max) => Math.min(Math.max(v, min), max);
const lerp = (a, b, t) => a + (b - a) * t;

/* ===== INIT ON DOM READY ===== */
document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initCursor();
  initNavbar();
  initTyped();
  initScrollReveal();
  initSkillBars();
  initCounters();
  initContactForm();
  initActiveNavLink();
  initSmoothScroll();
});

/* ===================================================================
   PARTICLES
=================================================================== */
function initParticles() {
  const canvas = $('#particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let w, h, particles = [], animId;
  const PARTICLE_COUNT = 70;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * w;
      this.y = Math.random() * h;
      this.size = Math.random() * 2 + 0.5;
      this.alpha = Math.random() * 0.5 + 0.1;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.color = Math.random() > 0.5
        ? `rgba(74, 158, 255, ${this.alpha})`
        : `rgba(0, 212, 255, ${this.alpha})`;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > w || this.y < 0 || this.y > h) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
  }

  function createParticles() {
    particles = Array.from({ length: PARTICLE_COUNT }, () => new Particle());
  }

  function drawConnections() {
    const maxDist = 140;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) {
          const alpha = (1 - dist / maxDist) * 0.15;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(74, 158, 255, ${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, w, h);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    animId = requestAnimationFrame(animate);
  }

  resize();
  createParticles();
  animate();
  window.addEventListener('resize', () => { resize(); createParticles(); });
}

/* ===================================================================
   CUSTOM CURSOR
=================================================================== */
function initCursor() {
  const dot = $('#cursor-dot');
  const ring = $('#cursor-ring');
  if (!dot || !ring) return;

  let mx = 0, my = 0, rx = 0, ry = 0, raf;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top = my + 'px';
  });

  function followCursor() {
    rx = lerp(rx, mx, 0.12);
    ry = lerp(ry, my, 0.12);
    ring.style.left = rx + 'px';
    ring.style.top = ry + 'px';
    raf = requestAnimationFrame(followCursor);
  }
  followCursor();

  const hoverEls = $$('a, button, .tech-pill, .skill-category, .project-card, .stat-card, input, textarea');
  hoverEls.forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hovered'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hovered'));
  });
}

/* ===================================================================
   NAVBAR
=================================================================== */
function initNavbar() {
  const navbar = $('#navbar');
  const hamburger = $('#hamburger');
  const navLinks = $('#nav-links');
  let lastScroll = 0;

  function handleScroll() {
    const sy = window.scrollY;
    navbar.classList.toggle('scrolled', sy > 30);
    navbar.classList.toggle('hidden', sy > lastScroll + 5 && sy > 200);
    if (sy <= lastScroll || sy < 200) navbar.classList.remove('hidden');
    lastScroll = sy;
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks?.classList.toggle('open');
    document.body.classList.toggle('menu-open');
  });

  // Close menu on link click
  $$('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger?.classList.remove('open');
      navLinks?.classList.remove('open');
      document.body.classList.remove('menu-open');
    });
  });
}

/* ===================================================================
   TYPED TEXT EFFECT
=================================================================== */
function initTyped() {
  const el = $('#typed-text');
  if (!el) return;

  const phrases = [
    'scalable web apps.',
    'reliable REST APIs.',
    'AI-powered platforms.',
    'full-stack solutions.',
    'impactful software.',
    'clean, fast UIs.',
  ];

  let phraseIdx = 0, charIdx = 0, deleting = false;

  function tick() {
    const phrase = phrases[phraseIdx];
    if (deleting) {
      el.textContent = phrase.slice(0, --charIdx);
      if (charIdx === 0) {
        deleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        setTimeout(tick, 400);
        return;
      }
      setTimeout(tick, 50);
    } else {
      el.textContent = phrase.slice(0, ++charIdx);
      if (charIdx === phrase.length) {
        deleting = true;
        setTimeout(tick, 2000);
        return;
      }
      setTimeout(tick, 70);
    }
  }

  setTimeout(tick, 1800);
}

/* ===================================================================
   SCROLL REVEAL
=================================================================== */
function initScrollReveal() {
  const targets = $$('.reveal-up, .reveal-left, .reveal-right');
  if (!targets.length) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
  );

  targets.forEach(el => observer.observe(el));
}

/* ===================================================================
   SKILL BARS
=================================================================== */
function initSkillBars() {
  const fills = $$('.skill-fill');
  if (!fills.length) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const fill = entry.target;
          const width = fill.dataset.width || '0';
          fill.style.width = width + '%';
          observer.unobserve(fill);
        }
      });
    },
    { threshold: 0.5 }
  );

  fills.forEach(fill => observer.observe(fill));
}

/* ===================================================================
   ANIMATED COUNTERS
=================================================================== */
function initCounters() {
  const counters = $$('.stat-num');
  if (!counters.length) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.8 }
  );

  counters.forEach(c => observer.observe(c));
}

function animateCounter(el) {
  const target = parseFloat(el.dataset.target);
  const decimals = parseInt(el.dataset.decimal || '0', 10);
  const isDecimal = decimals > 0;
  const duration = 1800;
  const start = performance.now();

  function update(ts) {
    const elapsed = ts - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = eased * target;
    el.textContent = isDecimal ? current.toFixed(decimals) : Math.round(current);
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = isDecimal ? target.toFixed(decimals) : target;
  }

  requestAnimationFrame(update);
}

/* ===================================================================
   ACTIVE NAV LINK ON SCROLL
=================================================================== */
function initActiveNavLink() {
  const sections = $$('section[id]');
  const links = $$('.nav-link');

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          links.forEach(l => l.classList.remove('active'));
          const active = links.find(l => l.getAttribute('href') === '#' + entry.target.id);
          active?.classList.add('active');
        }
      });
    },
    { threshold: 0.45 }
  );

  sections.forEach(s => observer.observe(s));
}

/* ===================================================================
   SMOOTH SCROLL
=================================================================== */
function initSmoothScroll() {
  $$('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

/* ===================================================================
   CONTACT FORM — FORMSPREE (real email delivery)
   Endpoint: https://formspree.io/f/mjgnqepr
=================================================================== */
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mjgnqepr';

function initContactForm() {
  const form = $('#contact-form');
  if (!form) return;

  const fields = {
    name:    { el: $('#form-name'),    err: $('#name-error'),    validate: v => v.trim().length >= 2                  ? '' : 'Please enter your full name.'          },
    email:   { el: $('#form-email'),   err: $('#email-error'),   validate: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : 'Please enter a valid email.'            },
    subject: { el: $('#form-subject'), err: $('#subject-error'), validate: v => v.trim().length >= 3                  ? '' : 'Subject must be at least 3 characters.' },
    message: { el: $('#form-message'), err: $('#message-error'), validate: v => v.trim().length >= 10                 ? '' : 'Message must be at least 10 characters.'},
  };

  // Live validation on blur & input
  Object.values(fields).forEach(({ el, err, validate }) => {
    el?.addEventListener('blur',  () => { if (err) err.textContent = validate(el.value); });
    el?.addEventListener('input', () => { if (err && err.textContent) err.textContent = validate(el.value); });
  });

  form.addEventListener('submit', async e => {
    e.preventDefault();

    // Validate all fields
    let valid = true;
    Object.values(fields).forEach(({ el, err, validate }) => {
      const msg = validate(el?.value || '');
      if (err) err.textContent = msg;
      if (msg) valid = false;
    });
    if (!valid) return;

    const btn        = $('#form-submit-btn');
    const btnText    = $('#btn-text');
    const btnIcon    = $('#btn-icon');
    const btnLoader  = $('#btn-loader');
    const successMsg = $('#form-success');
    const errorEl    = $('#message-error');

    // Loading state
    btn.disabled = true;
    if (btnText)   btnText.textContent     = 'Sending…';
    if (btnIcon)   btnIcon.style.display   = 'none';
    if (btnLoader) btnLoader.style.display = 'block';
    if (errorEl)   errorEl.textContent     = '';

    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          name:    fields.name.el.value.trim(),
          email:   fields.email.el.value.trim(),
          subject: fields.subject.el.value.trim(),
          message: fields.message.el.value.trim(),
        }),
      });

      if (res.ok) {
        // ✅ Success — email delivered to Gmail
        form.reset();
        if (successMsg) successMsg.classList.add('show');
        setTimeout(() => successMsg?.classList.remove('show'), 6000);
      } else {
        const data = await res.json();
        if (errorEl) errorEl.textContent = data?.errors?.[0]?.message || 'Something went wrong. Please try again.';
      }
    } catch (_) {
      if (errorEl) errorEl.textContent = 'Network error — please check your connection and try again.';
    } finally {
      btn.disabled = false;
      if (btnText)   btnText.textContent     = 'Send Message';
      if (btnIcon)   btnIcon.style.display   = '';
      if (btnLoader) btnLoader.style.display = 'none';
    }
  });
}
