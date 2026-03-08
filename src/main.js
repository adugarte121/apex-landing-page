/* ═══════════════════════════════════════
   APEX — Main JS
   - Sticky nav
   - Scroll animations
   - Count-up counters
   - FAQ accordion
   - Mobile menu
═══════════════════════════════════════ */

import './style.css';

// ── STICKY NAV ────────────────────────────────
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// ── MOBILE MENU ───────────────────────────────
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const mobileLinks = document.querySelectorAll('.mobile-menu__link, .mobile-menu__cta');

hamburger.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

mobileLinks.forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// ── SCROLL FADE-UP ANIMATIONS ────────────────
const fadeEls = document.querySelectorAll('.fade-up');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

fadeEls.forEach(el => observer.observe(el));

// ── COUNT-UP ANIMATION ────────────────────────
function formatNumber(val, el) {
  if (el.classList.contains('metric__number--x')) {
    return (val / 10).toFixed(1) + '×';
  }
  if (el.classList.contains('metric__number--pct')) {
    return Math.floor(val) + '%';
  }
  if (val >= 1000) {
    return (val / 1000).toFixed(1).replace('.0', '') + 'K+';
  }
  return Math.floor(val).toString();
}

const counters = document.querySelectorAll('.metric__number[data-count]');

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = parseFloat(el.dataset.count);
    const duration = 2000;
    const start = performance.now();

    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const current = eased * target;
      el.textContent = formatNumber(current, el);
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
    counterObserver.unobserve(el);
  });
}, { threshold: 0.5 });

counters.forEach(el => counterObserver.observe(el));

// ── FAQ ACCORDION ─────────────────────────────
const faqItems = document.querySelectorAll('.faq__item');

faqItems.forEach(item => {
  const btn = item.querySelector('.faq__question');
  const answer = item.querySelector('.faq__answer');

  btn.addEventListener('click', () => {
    const isOpen = btn.getAttribute('aria-expanded') === 'true';

    // Close all
    faqItems.forEach(i => {
      i.querySelector('.faq__question').setAttribute('aria-expanded', 'false');
      i.querySelector('.faq__answer').classList.remove('open');
    });

    // Open clicked (if it was closed)
    if (!isOpen) {
      btn.setAttribute('aria-expanded', 'true');
      answer.classList.add('open');
    }
  });
});

// Open first FAQ by default
if (faqItems.length) {
  faqItems[0].querySelector('.faq__question').setAttribute('aria-expanded', 'true');
  faqItems[0].querySelector('.faq__answer').classList.add('open');
}

// ── SMOOTH ANCHOR SCROLL ──────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const targetId = anchor.getAttribute('href');
    if (targetId === '#') return;
    const target = document.querySelector(targetId);
    if (!target) return;
    e.preventDefault();
    const navHeight = nav.offsetHeight;
    const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});
