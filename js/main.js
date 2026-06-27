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
  initImageEditor();
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

/* ==============================================
   图片编辑器 —— 拖拽调整酒瓶图位置和大小
   ============================================== */

function initImageEditor() {
  const bottle = document.querySelector('.hero-bottles');
  const img = document.querySelector('.bottles-img');
  if (!bottle || !img) return;

  // 从 localStorage 读取已保存的位置
  const saved = JSON.parse(localStorage.getItem('hero-bottle-pos') || '{}');

  const STORAGE_KEY = 'hero-bottle-pos';

  // 默认样式（CSS 中定义的 flexbox 布局）
  const defaults = {
    left: 'auto', top: 'auto', right: 'auto', bottom: 'auto',
    width: '', scale: 1,
    position: 'relative'
  };

  let editMode = false;
  let dragging = false;
  let startX, startY, startLeft, startTop;
  let scale = saved.scale || 1;

  // 恢复保存的设置
  function applySaved() {
    if (saved.position === 'absolute') {
      bottle.style.position = 'absolute';
      bottle.style.flex = 'none';
      bottle.style.maxWidth = 'none';
      bottle.style.left = saved.left || 'auto';
      bottle.style.top = saved.top || 'auto';
      bottle.style.right = saved.right || 'auto';
      bottle.style.bottom = saved.bottom || 'auto';
      bottle.style.width = saved.width || '';
    }
    if (saved.scale) {
      scale = saved.scale;
      img.style.transform = `scale(${scale})`;
    }
  }

  applySaved();

  // 创建编辑按钮
  const editBtn = document.createElement('button');
  editBtn.className = 'edit-bottle-btn';
  editBtn.innerHTML = '&#9881;';
  editBtn.title = '点击进入编辑模式，可拖拽调整图片位置和大小';
  editBtn.setAttribute('aria-label', '编辑图片位置');
  bottle.appendChild(editBtn);

  // 创建提示标签
  const tooltip = document.createElement('div');
  tooltip.className = 'edit-tooltip';
  tooltip.textContent = '拖拽移动 | 滚轮缩放 | 双击重置 | Esc退出';
  tooltip.style.display = 'none';
  bottle.appendChild(tooltip);

  // 切换编辑模式
  function toggleEdit(e) {
    e.stopPropagation();
    editMode = !editMode;

    if (editMode) {
      // 进入编辑模式
      bottle.classList.add('editing');
      bottle.style.position = 'absolute';
      bottle.style.flex = 'none';
      bottle.style.maxWidth = 'none';
      bottle.style.cursor = 'grab';
      tooltip.style.display = 'block';
      editBtn.innerHTML = '&#10003;';
      editBtn.title = '编辑中 — 点击退出';

      // 确保有初始位置
      const rect = bottle.getBoundingClientRect();
      const heroRect = bottle.closest('.hero').getBoundingClientRect();

      if (saved.position === 'absolute' && saved.left) {
        // 已有保存位置
      } else {
        bottle.style.left = (rect.left - heroRect.left) + 'px';
        bottle.style.top = (rect.top - heroRect.top) + 'px';
        bottle.style.right = 'auto';
        bottle.style.bottom = 'auto';
        bottle.style.width = rect.width + 'px';
      }
    } else {
      // 退出编辑模式
      exitEdit();
    }
  }

  function exitEdit() {
    editMode = false;
    dragging = false;
    bottle.classList.remove('editing');
    bottle.style.cursor = '';
    tooltip.style.display = 'none';
    editBtn.innerHTML = '&#9881;';
    editBtn.title = '点击进入编辑模式';
  }

  editBtn.addEventListener('click', toggleEdit);

  // 拖拽
  bottle.addEventListener('mousedown', (e) => {
    if (!editMode || e.target === editBtn) return;
    e.preventDefault();
    dragging = true;
    bottle.style.cursor = 'grabbing';

    startX = e.clientX;
    startY = e.clientY;
    startLeft = parseInt(bottle.style.left) || 0;
    startTop = parseInt(bottle.style.top) || 0;
  });

  document.addEventListener('mousemove', (e) => {
    if (!dragging) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    bottle.style.left = (startLeft + dx) + 'px';
    bottle.style.top = (startTop + dy) + 'px';
    bottle.style.right = 'auto';
    bottle.style.bottom = 'auto';
  });

  document.addEventListener('mouseup', () => {
    if (dragging) {
      dragging = false;
      bottle.style.cursor = editMode ? 'grab' : '';
      savePosition();
    }
  });

  // 滚轮缩放
  bottle.addEventListener('wheel', (e) => {
    if (!editMode) return;
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.05 : 0.05;
    scale = Math.max(0.4, Math.min(3, scale + delta));
    img.style.transform = `scale(${scale})`;
    savePosition();
  }, { passive: false });

  // 双击重置
  bottle.addEventListener('dblclick', (e) => {
    if (!editMode) return;
    scale = 1;
    img.style.transform = 'scale(1)';
    bottle.style.left = 'auto';
    bottle.style.top = 'auto';
    bottle.style.right = 'auto';
    bottle.style.bottom = 'auto';
    bottle.style.width = '';
    bottle.style.position = 'relative';
    bottle.style.flex = '';
    bottle.style.maxWidth = '';
    localStorage.removeItem(STORAGE_KEY);
    exitEdit();
  });

  // Esc 退出
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && editMode) {
      savePosition();
      exitEdit();
    }
  });

  // 保存到 localStorage
  function savePosition() {
    const data = {
      position: bottle.style.position,
      left: bottle.style.left,
      top: bottle.style.top,
      right: bottle.style.right,
      bottom: bottle.style.bottom,
      width: bottle.style.width,
      scale: scale
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  // 点击 hero 空白区域退出编辑
  document.querySelector('.hero').addEventListener('click', (e) => {
    if (editMode && !bottle.contains(e.target)) {
      savePosition();
      exitEdit();
    }
  });
}
