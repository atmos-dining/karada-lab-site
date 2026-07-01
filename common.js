/* ===== SCROLL ===== */
window.addEventListener('scroll', () => {
  const pageTop = document.getElementById('page-top');
  if (pageTop) pageTop.classList.toggle('visible', window.scrollY > 400);

  const topbar = document.getElementById('fixed-topbar');
  if (topbar) topbar.classList.toggle('scrolled', window.scrollY > 60);
});

/* ===== DRAWER MENU ===== */
const hamburger = document.getElementById('hamburger');
const drawer = document.getElementById('sp-menu');
const overlay = document.getElementById('drawer-overlay');

function openMenu() {
  if (drawer) { drawer.classList.add('open'); drawer.setAttribute('aria-hidden', 'false'); }
  if (hamburger) { hamburger.classList.add('open'); hamburger.setAttribute('aria-expanded', 'true'); }
  if (overlay) overlay.classList.add('visible');
  document.body.style.overflow = 'hidden';
  const fixedBtn = document.querySelector('.sp-reserve-fixed');
  if (fixedBtn) fixedBtn.style.display = 'none';
}

function closeMenu() {
  if (drawer) { drawer.classList.remove('open'); drawer.setAttribute('aria-hidden', 'true'); }
  if (hamburger) { hamburger.classList.remove('open'); hamburger.setAttribute('aria-expanded', 'false'); }
  if (overlay) overlay.classList.remove('visible');
  document.body.style.overflow = '';
  const fixedBtn = document.querySelector('.sp-reserve-fixed');
  if (fixedBtn) fixedBtn.style.display = '';
}

if (hamburger) hamburger.addEventListener('click', () => {
  drawer && drawer.classList.contains('open') ? closeMenu() : openMenu();
});

if (overlay) overlay.addEventListener('click', closeMenu);

document.querySelectorAll('.drawer-link').forEach(link => {
  link.addEventListener('click', closeMenu);
});

/* ===== PAGE TOP ===== */
const pageTopBtn = document.getElementById('page-top');
if (pageTopBtn) {
  pageTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ===== SCROLL REVEAL ===== */
function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

/* ===== BLOG PREVIEW (トップページ用) ===== */
function loadBlogPreview() {
  const list = document.getElementById('blog-list');
  if (!list) return;

  fetch('blog/posts.json')
    .then(r => r.json())
    .then(data => {
      const posts = (data.posts || []).slice(0, 3);
      if (posts.length === 0) {
        list.innerHTML = '<div style="grid-column:1/-1;text-align:center;color:var(--text-light);padding:40px;">まだ記事がありません</div>';
        return;
      }
      list.innerHTML = posts.map(p => {
        const imgSrc = p.image || '';
        const imgEl = imgSrc
          ? `<img src="${imgSrc}" alt="${esc(p.title)}" class="blog-card-img" style="aspect-ratio:16/10;object-fit:cover;">`
          : `<div class="blog-card-img">📝</div>`;
        return `
          <a href="blog/posts/post.html?slug=${esc(p.slug)}" class="blog-card">
            ${imgEl}
            <div class="blog-card-body">
              <div class="blog-card-date">${esc(p.date || '')}</div>
              <div class="blog-card-title">${esc(p.title)}</div>
              <div class="blog-card-excerpt">${esc(p.excerpt || '')}</div>
            </div>
          </a>`;
      }).join('');
    })
    .catch(() => {
      list.innerHTML = '<div style="grid-column:1/-1;text-align:center;color:var(--text-light);padding:40px;">ブログ記事を準備中です</div>';
    });
}

function esc(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

/* ===== GA4 TRACKING ===== */
function initGA4Tracking() {
  document.addEventListener('click', function(e) {
    if (typeof gtag !== 'function') return;
    const a = e.target.closest('a');
    if (!a) return;
    const href = a.getAttribute('href') || '';

    if (href.startsWith('tel:')) {
      gtag('event', 'phone_click', {
        event_category: 'contact',
        event_label: href.replace('tel:', ''),
        page_location: location.href
      });
    }

    if (href.includes('hotpepper')) {
      gtag('event', 'reservation_click', {
        event_category: 'conversion',
        event_label: a.textContent.trim().slice(0, 50),
        page_location: location.href
      });
    }
  });
}

/* ===== HERO SLIDESHOW ===== */
function initHeroSlideshow() {
  const slides = document.querySelectorAll('.hero-slide');
  if (slides.length < 2) return;
  let current = 0;
  setInterval(() => {
    slides[current].classList.remove('active');
    current = (current + 1) % slides.length;
    slides[current].classList.add('active');
  }, 4000);
}

/* ===== INIT ===== */
document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  loadBlogPreview();
  initGA4Tracking();
  initHeroSlideshow();
});
