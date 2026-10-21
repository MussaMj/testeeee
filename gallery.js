/* ═══════════════════════════════════════════════════════
   MAINEE — GALLERY JAVASCRIPT
   Parallax · Scroll Animations · Lightbox · Cursor
   ════════════════════════════════════════════════════ */

'use strict';

/* ─── Paintings Data ─── */
const paintings = [
  { file: 'pinturas/IMG_1212.jpg', num: '01', title: 'Composição I',    tech: 'Óleo sobre tela' },
  { file: 'pinturas/IMG_1213.jpg', num: '02', title: 'Estudo em Vermelho', tech: 'Acrílico' },
  { file: 'pinturas/IMG_1214.jpg', num: '03', title: 'Horizonte',       tech: 'Técnica mista' },
  { file: 'pinturas/IMG_1215.jpg', num: '04', title: 'Forma & Vazio',   tech: 'Óleo' },
  { file: 'pinturas/IMG_1216.jpg', num: '05', title: 'Fragmentos',      tech: 'Acrílico' },
  { file: 'pinturas/IMG_1217.jpg', num: '06', title: 'Introspecção',    tech: 'Óleo sobre tela' },
  { file: 'pinturas/IMG_1218.jpg', num: '07', title: 'Memória Viva',    tech: 'Técnica mista' },
  { file: 'pinturas/IMG_1219.jpg', num: '08', title: 'Pulso',           tech: 'Acrílico' },
  { file: 'pinturas/IMG_1220.jpg', num: '09', title: 'Vastidão',        tech: 'Óleo' },
  { file: 'pinturas/IMG_1221.jpg', num: '10', title: 'Luminar',         tech: 'Óleo sobre tela' },
  { file: 'pinturas/IMG_1222.jpg', num: '11', title: 'Contorno',        tech: 'Acrílico' },
  { file: 'pinturas/IMG_1223.jpg', num: '12', title: 'Ressonância',     tech: 'Técnica mista' },
  { file: 'pinturas/IMG_1224.jpg', num: '13', title: 'Éter',            tech: 'Óleo' },
  { file: 'pinturas/IMG_1225.jpg', num: '14', title: 'Deriva',          tech: 'Acrílico' },
  { file: 'pinturas/IMG_1226.jpg', num: '15', title: 'Serenidade',      tech: 'Óleo sobre tela' },
  { file: 'pinturas/IMG_1211.jpg', num: '16', title: 'Origem',          tech: 'Técnica mista' },
];

/* ─── Utility: RAF-throttled scroll handler ─── */
let rafPending = false;
function onScrollRaf(fn) {
  window.addEventListener('scroll', () => {
    if (!rafPending) {
      rafPending = true;
      requestAnimationFrame(() => { fn(); rafPending = false; });
    }
  }, { passive: true });
}

/* ─── Loader & Intro ─── */
window.addEventListener('DOMContentLoaded', () => {
  const loader = document.getElementById('loader');

  // Wait for hero image + a slight delay for drama
  const heroImg = document.getElementById('heroImg');
  let heroLoaded = heroImg.complete;

  function revealSite() {
    loader.classList.add('hidden');
    document.body.classList.add('ready');
    initParallax();
    initScrollReveal();
    initImmersion();
    initGallery();
    initLightbox();
    initCursor();
    initNav();
  }

  if (heroLoaded) {
    setTimeout(revealSite, 800);
  } else {
    heroImg.addEventListener('load', () => setTimeout(revealSite, 600));
    heroImg.addEventListener('error', () => setTimeout(revealSite, 600));
    // Fallback in case image takes too long
    setTimeout(revealSite, 3000);
  }
});

/* ═══════════════════════════════════════════════════════
   1. PARALLAX 2.5D
   ════════════════════════════════════════════════════ */
function initParallax() {
  const heroBg      = document.getElementById('heroBg');
  const heroContent = document.getElementById('heroContent');
  const heroImg     = document.getElementById('heroImg');

  onScrollRaf(() => {
    const scrollY = window.scrollY;
    const vH = window.innerHeight;
    if (scrollY > vH * 1.2) return; // stop computing past hero

    // Background moves slower → depth illusion
    const bgOffset      = scrollY * 0.35;
    const contentOffset = scrollY * 0.55;
    const imgScale      = 1 + scrollY * 0.0003;
    const opacity       = Math.max(0, 1 - scrollY / (vH * 0.7));

    heroBg.style.transform      = `translateY(${bgOffset}px)`;
    heroImg.style.transform     = `scale(${imgScale})`;
    heroContent.style.transform = `translateY(${contentOffset}px)`;
    heroContent.style.opacity   = opacity;
  });

  // Mouse-based tilt parallax on hero
  document.getElementById('hero').addEventListener('mousemove', (e) => {
    const { innerWidth: w, innerHeight: h } = window;
    const x = (e.clientX / w - 0.5) * 2; // -1 to 1
    const y = (e.clientY / h - 0.5) * 2;
    heroBg.style.transform = `translate(${x * -18}px, ${y * -12}px)`;
    heroContent.style.transform = `translate(${x * 8}px, ${y * 5}px)`;
  }, { passive: true });
}

/* ═══════════════════════════════════════════════════════
   2. INTERSECTION OBSERVER — SCROLL REVEAL
   ════════════════════════════════════════════════════ */
function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  document.querySelectorAll('[data-scroll-reveal], .bento-item').forEach(el => {
    observer.observe(el);
  });
}

/* ═══════════════════════════════════════════════════════
   3. IMMERSION SCROLLYTELLING
   ════════════════════════════════════════════════════ */
function initImmersion() {
  const steps       = document.querySelectorAll('.immersion-step');
  const bgImg       = document.getElementById('immersionBgImg');
  const stickyEl    = document.querySelector('.immersion-sticky');

  if (!steps.length) return;

  // Switch background image at step 2
  const stepImages = [
    'pinturas/IMG_1219.jpg',
    'pinturas/IMG_1221.jpg',
    'pinturas/IMG_1218.jpg',
    'pinturas/IMG_1212.jpg',
  ];

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        const idx = parseInt(entry.target.dataset.step, 10);
        // Crossfade background image
        if (stepImages[idx]) {
          bgImg.style.opacity = '0';
          bgImg.style.transition = 'opacity 0.7s ease';
          setTimeout(() => {
            bgImg.src = stepImages[idx];
            bgImg.style.opacity = '1';
          }, 350);
        }
      } else {
        entry.target.classList.remove('active');
      }
    });
  }, { threshold: 0.5 });

  steps.forEach(step => observer.observe(step));

  // Subtle parallax on sticky bg
  onScrollRaf(() => {
    const rect   = stickyEl.getBoundingClientRect();
    const center = rect.top + rect.height / 2;
    const vh     = window.innerHeight;
    const ratio  = ((vh / 2 - center) / vh) * 0.1;
    bgImg.style.transform = `scale(1.08) translateY(${ratio * 100}px)`;
  });
}

/* ═══════════════════════════════════════════════════════
   4. GALLERY — BENTO INTERACTIONS
   ════════════════════════════════════════════════════ */
function initGallery() {
  // Items are revealed by IntersectionObserver in initScrollReveal
  // Add click-to-lightbox
  const items = document.querySelectorAll('.bento-item');
  items.forEach((item, idx) => {
    item.addEventListener('click', () => openLightbox(idx));
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
    item.setAttribute('aria-label', `Ver obra ${paintings[idx].num}: ${paintings[idx].title}`);
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(idx); }
    });
  });
}

/* ═══════════════════════════════════════════════════════
   5. LIGHTBOX
   ════════════════════════════════════════════════════ */
let currentLbIndex = 0;

function initLightbox() {
  const lb       = document.getElementById('lightbox');
  const closeBtn = document.getElementById('lbClose');
  const backdrop = document.getElementById('lbBackdrop');
  const prevBtn  = document.getElementById('lbPrev');
  const nextBtn  = document.getElementById('lbNext');

  closeBtn.addEventListener('click', closeLightbox);
  backdrop.addEventListener('click', closeLightbox);
  prevBtn.addEventListener('click', () => navigateLb(-1));
  nextBtn.addEventListener('click', () => navigateLb(1));

  document.addEventListener('keydown', (e) => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape')      closeLightbox();
    if (e.key === 'ArrowLeft')   navigateLb(-1);
    if (e.key === 'ArrowRight')  navigateLb(1);
  });

  // Touch swipe support
  let touchStartX = 0;
  lb.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', (e) => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) navigateLb(diff > 0 ? 1 : -1);
  }, { passive: true });
}

function openLightbox(index) {
  currentLbIndex = index;
  const lb = document.getElementById('lightbox');
  setLbContent(index);
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
  document.getElementById('lbClose').focus();
}

function closeLightbox() {
  const lb = document.getElementById('lightbox');
  lb.classList.remove('open');
  document.body.style.overflow = '';
  // Reset img for next open
  setTimeout(() => {
    const img = document.getElementById('lbImg');
    img.style.opacity = '0';
    img.style.transform = 'scale(0.92)';
  }, 500);
}

function navigateLb(dir) {
  currentLbIndex = (currentLbIndex + dir + paintings.length) % paintings.length;
  const lb = document.getElementById('lightbox');

  // Quick fade transition
  const imgWrap = document.getElementById('lbImgWrap');
  imgWrap.style.opacity = '0';
  imgWrap.style.transform = `translateX(${dir * -40}px)`;
  imgWrap.style.transition = 'opacity 0.25s, transform 0.25s';

  setTimeout(() => {
    setLbContent(currentLbIndex);
    imgWrap.style.transition = '';
    imgWrap.style.opacity = '0';
    imgWrap.style.transform = `translateX(${dir * 40}px)`;
    // Force reflow
    imgWrap.offsetHeight;
    imgWrap.style.transition = 'opacity 0.35s, transform 0.35s';
    imgWrap.style.opacity = '1';
    imgWrap.style.transform = 'translateX(0)';
  }, 250);
}

function setLbContent(index) {
  const p     = paintings[index];
  const img   = document.getElementById('lbImg');
  const num   = document.getElementById('lbNum');
  const title = document.getElementById('lbTitle');
  const tech  = document.getElementById('lbTech');

  img.src = p.file;
  img.alt = `${p.title} — Mainee`;
  num.textContent   = p.num;
  title.textContent = p.title;
  tech.textContent  = p.tech;
}

/* ═══════════════════════════════════════════════════════
   6. CUSTOM CURSOR
   ════════════════════════════════════════════════════ */
function initCursor() {
  const cursor   = document.getElementById('cursor');
  const follower = document.getElementById('cursor-follower');

  if (!cursor || window.matchMedia('(pointer: coarse)').matches) return;

  let mouseX = 0, mouseY = 0;
  let follX  = 0, follY  = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
  }, { passive: true });

  // Smooth follower
  function animateFollower() {
    follX += (mouseX - follX) * 0.12;
    follY += (mouseY - follY) * 0.12;
    follower.style.left = follX + 'px';
    follower.style.top  = follY + 'px';
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  // Hover detection
  const hoverEls = document.querySelectorAll('a, button, .bento-item, [role="button"]');
  hoverEls.forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
}

/* ═══════════════════════════════════════════════════════
   7. NAV SCROLL STATE
   ════════════════════════════════════════════════════ */
function initNav() {
  const nav = document.getElementById('nav');
  onScrollRaf(() => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  });
}
