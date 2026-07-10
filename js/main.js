/**
 * 秋丽烟酒店 — 艺术典藏版交互脚本
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeaderScroll();
  initMobileMenu();
  initActiveNavLink();
  initBackToTop();
  initSmoothScroll();
  initScrollReveal();
  initCountUp();
  initParallaxParticles();
  initProductFilter();
  initFloatContact();
  initInquiryForm();
});

/* ---- 光标光晕 ---- */
function initCursorGlow() {
  const glow = document.getElementById('cursorGlow');
  if (!glow || window.innerWidth < 768) return;

  let mouseX = -500, mouseY = -500;
  let currentX = -500, currentY = -500;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    glow.style.opacity = '1';
  });

  document.addEventListener('mouseleave', () => {
    glow.style.opacity = '0';
  });

  function animate() {
    currentX += (mouseX - currentX) * 0.08;
    currentY += (mouseY - currentY) * 0.08;
    glow.style.left = currentX + 'px';
    glow.style.top = currentY + 'px';
    requestAnimationFrame(animate);
  }

  animate();
}

/* ---- 导航栏滚动 ---- */
function initHeaderScroll() {
  const header = document.getElementById('header');
  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 60);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ---- 移动端菜单 ---- */
function initMobileMenu() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('navMenu');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    nav.classList.toggle('active');
    document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
  });

  nav.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('active');
      nav.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
}

/* ---- 导航高亮 ---- */
function initActiveNavLink() {
  const sections = [];
  document.querySelectorAll('.nav-link').forEach(link => {
    const id = link.getAttribute('href');
    if (id && id.startsWith('#') && id.length > 1) {
      const el = document.querySelector(id);
      if (el) sections.push({ el, link });
    }
  });

  const onScroll = () => {
    let current = '';
    const sy = window.scrollY + 120;
    sections.forEach(({ el, link }) => {
      if (el.offsetTop <= sy) current = link.getAttribute('href');
    });
    document.querySelectorAll('.nav-link').forEach(l => {
      l.classList.toggle('active', l.getAttribute('href') === current);
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ---- 回到顶部 ---- */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 600);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ---- 平滑滚动 ---- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    });
  });
}

/* ---- 滚动渐显 ---- */
function initScrollReveal() {
  const targets = document.querySelectorAll(
    '.virtue-card, .product-card, .category-card, .contact-card'
  );

  targets.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -20px 0px' });

  targets.forEach(el => observer.observe(el));
}

/* ---- 数字滚增动画 ---- */
function initCountUp() {
  const statNums = document.querySelectorAll('.stat-num[data-count]');
  if (!statNums.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-count'), 10);
        const duration = 1800;
        const start = performance.now();

        function update(now) {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = Math.round(target * eased);

          if (target >= 1000) {
            el.textContent = current.toLocaleString();
          } else {
            el.textContent = current;
          }

          if (progress < 1) {
            requestAnimationFrame(update);
          } else {
            el.textContent = target >= 1000
              ? target.toLocaleString()
              : target;
          }
        }

        requestAnimationFrame(update);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  statNums.forEach(el => observer.observe(el));
}

/* ---- Hero 微粒视差 ---- */
function initParallaxParticles() {
  const particles = document.getElementById('heroParticles');
  if (!particles) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY < window.innerHeight) {
      particles.style.transform = `translateY(${window.scrollY * 0.15}px)`;
    }
  }, { passive: true });
}

/* ---- 产品卡片悬停倾斜 (桌面端) ---- */
(function initTilt() {
  if (window.innerWidth < 768) return;

  document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rotateX = ((y - cy) / cy) * -3;
      const rotateY = ((x - cx) / cx) * 3;
      card.style.transform =
        `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();

/* ---- 商品筛选与搜索 ---- */
function initProductFilter() {
  const tabs = document.querySelectorAll('#filterTabs .filter-tab');
  const searchInput = document.getElementById('productSearch');
  const cards = document.querySelectorAll('.product-card');
  if (!tabs.length || !cards.length) return;

  var currentFilter = 'all';

  function applyFilter() {
    var query = (searchInput && searchInput.value || '').trim().toLowerCase();
    cards.forEach(function(card) {
      var cat = card.getAttribute('data-category') || '';
      var text = card.textContent.toLowerCase();
      var matchCat = currentFilter === 'all' || cat === currentFilter;
      var matchSearch = !query || text.indexOf(query) !== -1;
      card.classList.toggle('hidden', !matchCat || !matchSearch);
    });
  }

  tabs.forEach(function(tab) {
    tab.addEventListener('click', function() {
      tabs.forEach(function(t) { t.classList.remove('active'); });
      tab.classList.add('active');
      currentFilter = tab.getAttribute('data-filter');
      applyFilter();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', applyFilter);
  }
}

/* ---- 悬浮联系按钮 ---- */
function initFloatContact() {
  var toggle = document.getElementById('floatToggle');
  var menu = document.getElementById('floatMenu');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', function(e) {
    e.stopPropagation();
    menu.classList.toggle('open');
  });

  document.addEventListener('click', function() {
    menu.classList.remove('open');
  });
}

/* ---- 留资表单 ---- */
function initInquiryForm() {
  var form = document.getElementById('inquiryForm');
  if (!form) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    var inputs = form.querySelectorAll('input, textarea');
    var values = [];
    inputs.forEach(function(el) { if (el.value.trim()) values.push(el.value.trim()); });
    if (values.length < 2) {
      alert('请至少填写姓名和手机号码');
      return;
    }
    alert('咨询已提交！我们将尽快通过电话或微信与您联系。\n\n您也可以直接拨打 13523469469 或添加微信。');
    form.reset();
  });
}
