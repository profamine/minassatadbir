/* ═══════════════════════════════════════════════════════════
   منطق الموقع المشترك — السمة، الشريط، الحركات، المستكشف،
   لوحة الأوامر، ومشغّل الفيديو.
   ═══════════════════════════════════════════════════════════ */
(() => {
'use strict';

const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const el = (t, c, h) => { const n = document.createElement(t); if (c) n.className = c; if (h != null) n.innerHTML = h; return n; };
const LESS = matchMedia('(prefers-reduced-motion: reduce)').matches;
const PAGE = document.body.dataset.page || '';
document.documentElement.classList.add('js');

/* تطبيع البحث العربي: التشكيل، الهمزات، التاء المربوطة، الألف المقصورة */
const norm = s => String(s).replace(/[ً-ْٰـ]/g, '')
  .replace(/[أإآٱ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي')
  .replace(/ؤ/g, 'و').replace(/ئ/g, 'ي').toLowerCase().trim();

/* ─────────── التنبيهات ─────────── */
let toastEl, toastT;
function toast(msg) {
  if (!toastEl) { toastEl = el('div', 'toast'); document.body.appendChild(toastEl); }
  toastEl.textContent = msg;
  requestAnimationFrame(() => toastEl.classList.add('on'));
  clearTimeout(toastT);
  toastT = setTimeout(() => toastEl.classList.remove('on'), 2800);
}

/* ─────────── السمة ─────────── */
const THEME_KEY = 'mm_site_theme';
let switchT;
function applyTheme(t) {
  const root = document.documentElement;
  root.classList.add('theme-switch');
  clearTimeout(switchT);
  switchT = setTimeout(() => root.classList.remove('theme-switch'), 80);
  root.dataset.theme = t;
  localStorage.setItem(THEME_KEY, t);
  $$('.js-theme').forEach(b => {
    b.innerHTML = icon(t === 'dark' ? 'sun' : 'moon', 19);
    b.setAttribute('aria-label', t === 'dark' ? 'التبديل إلى السمة الفاتحة' : 'التبديل إلى السمة الداكنة');
  });
}
function initTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  applyTheme(saved || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
}

/* ─────────── الشريط العلوي والتذييل ─────────── */
const NAV = [
  { href: 'index.html',    t: 'الرئيسية',   k: 'home' },
  { href: 'apps.html',     t: 'التطبيقات',  k: 'apps' },
  { href: 'videos.html',   t: 'الفيديوهات', k: 'videos' },
  { href: 'guide.html',    t: 'دليل الاستعمال', k: 'guide' },
  { href: 'download.html', t: 'التحميل', k: 'download' }
];

function buildChrome() {
  document.body.prepend(el('div', 'progress', ''));
  document.body.prepend(Object.assign(el('a', 'skip', 'تخطّي إلى المحتوى'), { href: '#main' }));

  const nav = el('header', 'nav');
  nav.innerHTML = `<div class="wrap nav-in">
    <a class="brand" href="index.html">
      <span class="mark">${icon('layers', 21)}</span>
      <span>المنصّة الموحّدة<small>للتدبير المدرسي</small></span>
    </a>
    <nav class="nav-links" id="navLinks">
      ${NAV.map(n => `<a href="${n.href}" class="${n.k === PAGE ? 'on' : ''}">${n.t}</a>`).join('')}
      <a class="nav-cta" href="download.html">نزّل التطبيق</a>
    </nav>
    <div class="nav-tools">
      <button class="icon-btn js-cmdk" aria-label="بحث سريع (Ctrl+K)" title="بحث سريع — Ctrl + K">${icon('search', 19)}</button>
      <button class="icon-btn js-theme" aria-label="تبديل السمة"></button>
      <a class="nav-cta" href="download.html">نزّل التطبيق</a>
      <button class="icon-btn burger js-burger" aria-label="القائمة" aria-expanded="false">${icon('menu', 20)}</button>
    </div>
  </div>`;
  document.body.prepend(nav);

  const foot = el('footer');
  foot.innerHTML = `<div class="wrap">
    <div class="foot-in">
      <div>
        <a class="brand" href="index.html"><span class="mark">${icon('layers', 21)}</span>
          <span>المنصّة الموحّدة<small>للتدبير المدرسي</small></span></a>
        <p>تسعة عشر تطبيقًا لتدبير المؤسسة التعليمية، في تطبيق ويندوز واحد يعمل كاملًا بدون إنترنت، وتبقى معطياتك داخل حاسوبك.</p>
        <div class="author">
          <span class="av">أ‌أ</span>
          <span><b>أمين أمهان</b><small>متصرّف تربوي — مديرية الحوز</small>
          <small><a href="mailto:amahanamine0@gmail.com">amahanamine0@gmail.com</a></small></span>
        </div>
      </div>
      <div><h4>تصفَّح</h4>${NAV.map(n => `<a href="${n.href}">${n.t}</a>`).join('')}</div>
      <div><h4>المحاور</h4>${AXES.map(a => `<a href="apps.html#${a.id}">${a.n}</a>`).join('')}</div>
      <div><h4>أدلة سريعة</h4>
        ${LIBRARY.slice(0, 4).map(g => `<a href="${P.guide(g.f)}" download="${g.name}">${g.t}</a>`).join('')}
        <a href="videos.html">الفيديوهات التوضيحية</a>
      </div>
    </div>
    <div class="foot-bot">
      <span>© ${new Date().getFullYear()} المنصّة الموحّدة للتدبير المدرسي — إعداد أمين أمهان.</span>
      <span>صُمِّم للعمل محليًّا · بلا تتبُّع · بلا إعلانات</span>
    </div>
  </div>`;
  document.body.appendChild(foot);

  $('.js-burger').addEventListener('click', e => {
    const open = $('#navLinks').classList.toggle('open');
    e.currentTarget.setAttribute('aria-expanded', String(open));
    e.currentTarget.innerHTML = icon(open ? 'x' : 'menu', 20);
  });
  $$('.js-theme').forEach(b => b.addEventListener('click', () =>
    applyTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark')));
  applyTheme(document.documentElement.dataset.theme);

  const bar = $('.progress'), navEl = $('.nav');
  const onScroll = () => {
    const h = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${h > 0 ? scrollY / h : 0})`;
    navEl.classList.toggle('scrolled', scrollY > 12);
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ─────────── الكشف عند التمرير ─────────── */
function observeReveal(items) {
  if (LESS || !('IntersectionObserver' in window)) { items.forEach(i => i.classList.add('in')); return; }
  const io = new IntersectionObserver((es, o) => es.forEach(e => {
    if (!e.isIntersecting) return;
    const d = +(e.target.dataset.delay || 0);
    setTimeout(() => e.target.classList.add('in'), d);
    o.unobserve(e.target);
  }), { threshold: .12, rootMargin: '0px 0px -40px' });
  items.forEach(i => io.observe(i));
}

function initReveal() {
  observeReveal($$('.rv'));
  /* صمّام أمان: إن لم يعمل المراقب (لسان مخفي، متصفّح قديم) يُكشف
     كلّ ما هو داخل الشاشة بعد ثانيتين حتى لا يبقى المحتوى غير مرئي. */
  const rescue = () => $$('.rv:not(.in)').forEach(n => {
    if (n.getBoundingClientRect().top < innerHeight * 1.4) n.classList.add('in');
  });
  setTimeout(rescue, 2000);
  addEventListener('scroll', () => { clearTimeout(initReveal._t); initReveal._t = setTimeout(rescue, 900); }, { passive: true });
  document.addEventListener('visibilitychange', () => { if (!document.hidden) setTimeout(rescue, 400); });
}

/* ─────────── عدّاد الأرقام ─────────── */
function initCounters() {
  const sv = $('#statVideos');
  if (sv) sv.dataset.count = VIDEOS.length;   // العدّاد يتبع السجلّ
  const nums = $$('[data-count]');
  if (!nums.length) return;
  const run = n => {
    const target = +n.dataset.count, suf = n.dataset.suffix || '';
    if (LESS) { n.textContent = target + suf; return; }
    const t0 = performance.now(), dur = 1400;
    const tick = t => {
      const p = Math.min((t - t0) / dur, 1), e = 1 - Math.pow(1 - p, 3);
      n.textContent = Math.round(target * e) + suf;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  const io = new IntersectionObserver((es, o) => es.forEach(e => {
    if (e.isIntersecting) { run(e.target); o.unobserve(e.target); }
  }), { threshold: .5 });
  nums.forEach(n => io.observe(n));
  /* صمّام أمان: لو تعطّلت الحركة يظهر الرقم النهائي بدل صفر جامد */
  setTimeout(() => nums.forEach(n => {
    if (n.textContent.trim() === '0' && n.dataset.count !== '0')
      n.textContent = n.dataset.count + (n.dataset.suffix || '');
  }), 3500);
}

/* ─────────── كوكبة البطل ─────────── */
function initConstellation() {
  const cv = $('#constellation');
  if (!cv) return;
  const ctx = cv.getContext('2d');
  let W, H, dpr, nodes = [], raf = null;
  const pointer = { x: -9e9, y: -9e9 };

  const build = () => {
    dpr = Math.min(devicePixelRatio || 1, 2);
    W = cv.clientWidth; H = cv.clientHeight;
    cv.width = W * dpr; cv.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    nodes = APPS.map((a, i) => {
      const ax = AX(a.ax);
      const ang = (i / APPS.length) * Math.PI * 2;
      const rad = Math.min(W, H) * (0.20 + 0.16 * ((i % 3) / 2));
      return {
        x: W / 2 + Math.cos(ang) * rad * (W / Math.max(H, 1) > 1.5 ? 1.7 : 1.05),
        y: H / 2 + Math.sin(ang) * rad,
        vx: (Math.random() - .5) * .22, vy: (Math.random() - .5) * .22,
        r: 2 + Math.random() * 2.2, col: ax.hex, ph: Math.random() * 6.28
      };
    });
  };

  const draw = t => {
    ctx.clearRect(0, 0, W, H);
    // الروابط
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j];
        const dx = a.x - b.x, dy = a.y - b.y, d = Math.hypot(dx, dy);
        if (d > 190) continue;
        ctx.strokeStyle = `rgba(150,175,255,${(1 - d / 190) * .26})`;
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      }
    }
    // العُقد
    nodes.forEach(n => {
      if (!LESS) {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 10 || n.x > W - 10) n.vx *= -1;
        if (n.y < 10 || n.y > H - 10) n.vy *= -1;
        const dx = n.x - pointer.x, dy = n.y - pointer.y, d = Math.hypot(dx, dy);
        if (d < 130 && d > .1) { n.x += (dx / d) * (130 - d) * .035; n.y += (dy / d) * (130 - d) * .035; }
      }
      const pulse = 1 + Math.sin((t || 0) / 900 + n.ph) * .3;
      const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 7 * pulse);
      g.addColorStop(0, n.col); g.addColorStop(1, 'transparent');
      ctx.fillStyle = g; ctx.globalAlpha = .5;
      ctx.beginPath(); ctx.arc(n.x, n.y, n.r * 7 * pulse, 0, 6.29); ctx.fill();
      ctx.globalAlpha = 1; ctx.fillStyle = n.col;
      ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, 6.29); ctx.fill();
    });
    raf = requestAnimationFrame(draw);
  };

  build();
  addEventListener('resize', () => { build(); }, { passive: true });
  cv.parentElement.addEventListener('pointermove', e => {
    const r = cv.getBoundingClientRect();
    pointer.x = e.clientX - r.left; pointer.y = e.clientY - r.top;
  });
  cv.parentElement.addEventListener('pointerleave', () => { pointer.x = pointer.y = -9e9; });
  raf = requestAnimationFrame(draw);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { cancelAnimationFrame(raf); raf = null; }
    else if (!raf) raf = requestAnimationFrame(draw);
  });
}

/* ─────────── بطاقة تطبيق ─────────── */
function appCard(a, i) {
  const ax = AX(a.ax);
  const b = el('button', 'app-card rv');
  b.style.setProperty('--c', ax.c); b.style.setProperty('--c2', ax.c2);
  b.dataset.ax = a.ax; b.dataset.id = a.id;
  b.dataset.k = norm(a.t + ' ' + a.d + ' ' + ax.n);
  b.dataset.delay = String((i % 3) * 70);
  b.innerHTML = `
    <span class="app-shot"><span class="app-num">${i + 1}</span>
      <img src="${imgOf(a.img)}" alt="لقطة من تطبيق ${a.t}" loading="lazy" decoding="async"></span>
    <span class="app-body">
      <h3><span class="sq">${icon(a.ic, 15, 2)}</span>${a.t}</h3>
      <p>${a.d}</p>
      <span class="app-tags">
        <span class="pill c" style="--c:${ax.c}">${ax.n}</span>
        ${a.guide ? '<span class="pill pdf">دليل PDF</span>' : ''}
        ${a.video ? '<span class="pill vid">فيديو</span>' : ''}
      </span>
    </span>`;
  b.addEventListener('click', () => openDrawer(a.id));
  return b;
}

/* ─────────── دُرج التفاصيل ─────────── */
let drawer, drawerBg, lastFocus;
function ensureDrawer() {
  if (drawer) return;
  drawerBg = el('div', 'drawer-bg');
  drawer = el('aside', 'drawer');
  drawer.setAttribute('role', 'dialog');
  drawer.setAttribute('aria-modal', 'true');
  document.body.append(drawerBg, drawer);
  drawerBg.addEventListener('click', closeDrawer);
  addEventListener('keydown', e => { if (e.key === 'Escape' && drawer.classList.contains('on')) closeDrawer(); });
}
function openDrawer(id) {
  const a = APP(id); if (!a) return;
  ensureDrawer();
  const ax = AX(a.ax), idx = APPS.indexOf(a) + 1;
  const v = a.video ? VID(a.video) : null;
  drawer.style.setProperty('--c', ax.c); drawer.style.setProperty('--c2', ax.c2);
  drawer.innerHTML = `
    <div class="drawer-head">
      <button class="drawer-close" aria-label="إغلاق">${icon('x', 18)}</button>
      <span class="pill" style="background:rgba(255,255,255,.2);color:#fff">${icon(ax.ic, 14, 2)} ${ax.n}</span>
      <h2>${idx}. ${a.t}</h2>
      <p>${a.d}</p>
    </div>
    <div class="drawer-body">
      <img class="shot" src="${imgOf(a.img)}" alt="لقطة من تطبيق ${a.t}">
      <h4>ما الذي يمكنك فعله الآن؟</h4>
      <div class="d-actions">
        <a class="d-act" href="download.html">
          <span class="ic" style="background:linear-gradient(135deg,var(--a3),var(--a4))">${icon('dl', 19)}</span>
          <span><b>نزّل المنصّة</b><small>تطبيق ويندوز واحد يضمّ هذا التطبيق و18 غيره</small></span>
          <span class="arw">${icon('arrow', 18)}</span></a>
        ${a.guide ? `<a class="d-act" href="${P.guide(a.guide)}" download="دليل ${a.t}.pdf">
          <span class="ic" style="background:linear-gradient(135deg,#f87171,#dc2626)">${icon('pdf', 19)}</span>
          <span><b>دليل استعمال ${a.t}</b><small>ملف PDF — شرح مفصّل بالصور</small></span>
          <span class="arw">${icon('arrow', 18)}</span></a>` : ''}
        ${v ? `<a class="d-act" href="videos.html?v=${v.id}">
          <span class="ic" style="background:linear-gradient(135deg,var(--a2),var(--a2b))">${icon('play', 17)}</span>
          <span><b>شاهد الفيديو التوضيحي</b><small>${v.dur} دقيقة — ${v.d}</small></span>
          <span class="arw">${icon('arrow', 18)}</span></a>` : ''}
        <a class="d-act" href="guide.html">
          <span class="ic" style="background:linear-gradient(135deg,var(--a6),var(--a6b))">${icon('book', 19)}</span>
          <span><b>دليل الاستعمال العام</b><small>خطوات التشغيل، النسخ الاحتياطي والأسئلة الشائعة</small></span>
          <span class="arw">${icon('arrow', 18)}</span></a>
      </div>
      <h4>تطبيقات من المحور نفسه</h4>
      <div class="d-actions">
        ${APPS.filter(x => x.ax === a.ax && x.id !== a.id).map(x => `
          <button class="d-act js-goto" data-id="${x.id}">
            <span class="ic" style="background:linear-gradient(135deg,${ax.c},${ax.c2})">${icon(x.ic, 18)}</span>
            <span><b>${x.t}</b><small>${x.d.slice(0, 62)}…</small></span>
            <span class="arw">${icon('arrow', 18)}</span></button>`).join('')}
      </div>
    </div>`;
  $('.drawer-close', drawer).addEventListener('click', closeDrawer);
  $$('.js-goto', drawer).forEach(b => b.addEventListener('click', () => openDrawer(b.dataset.id)));
  lastFocus = document.activeElement;
  drawerBg.classList.add('on'); drawer.classList.add('on');
  document.body.style.overflow = 'hidden';
  drawer.scrollTop = 0;
  $('.drawer-close', drawer).focus();
  history.replaceState(null, '', '#' + a.id);
}
function closeDrawer() {
  if (!drawer) return;
  drawer.classList.remove('on'); drawerBg.classList.remove('on');
  document.body.style.overflow = '';
  history.replaceState(null, '', location.pathname + location.search);
  lastFocus?.focus?.();
}

/* ─────────── مستكشف التطبيقات ─────────── */
function initExplorer() {
  const grid = $('#appGrid'); if (!grid) return;
  APPS.forEach((a, i) => grid.appendChild(appCard(a, i)));
  grid.appendChild(el('p', 'empty', 'لا يوجد تطبيق مطابق لبحثك — جرّب كلمة أخرى.')).style.display = 'none';

  const chips = $$('.chip[data-ax]'), input = $('#appSearch'), empty = $('.empty', grid);
  let cur = 'all', first = true;   // في العرض الأوّل نترك الحركة للمراقب

  const apply = () => {
    const q = norm(input ? input.value : '');
    let shown = 0;
    $$('.app-card', grid).forEach(c => {
      const ok = (cur === 'all' || c.dataset.ax === cur) && (!q || c.dataset.k.includes(q));
      c.style.display = ok ? '' : 'none';
      if (ok) { shown++; if (!first) c.classList.add('in'); }
    });
    empty.style.display = shown ? 'none' : '';
    const cnt = $('#appCount'); if (cnt) cnt.textContent = shown;
    first = false;
  };

  chips.forEach(c => c.addEventListener('click', () => {
    chips.forEach(x => x.classList.remove('on'));
    c.classList.add('on'); cur = c.dataset.ax;
    if (cur !== 'all') history.replaceState(null, '', '#' + cur);
    apply();
  }));
  input?.addEventListener('input', apply);

  // فتح تطبيق أو محور مباشرةً من الرابط
  const h = location.hash.slice(1);
  if (h && APP(h)) setTimeout(() => openDrawer(h), 350);
  else if (h && AXES.some(a => a.id === h)) {
    const c = chips.find(x => x.dataset.ax === h);
    if (c) { c.click(); setTimeout(() => grid.scrollIntoView({ behavior: 'smooth', block: 'start' }), 200); }
  }
  apply();
}

/* ─────────── صفحة الفيديوهات ───────────
   يُشغَّل الفيديو من يوتيوب متى كان حقل yt مملوءًا في data.js،
   وإلا فمن مجلّد videos/ محليًّا. في الحالتين يُحفظ موضع التوقّف.
   إطار يوتيوب لا يُحمَّل إلا بعد نقر المستخدم على زرّ التشغيل
   (نمط الواجهة الوهمية): صفحة أسرع، وبلا تتبُّع قبل المشاهدة.  */
const RESUME_KEY = 'mm_video_pos';

/* واجهة يوتيوب البرمجية — تُحمَّل مرّة واحدة وعند الحاجة فقط */
let ytApiPromise = null;
function loadYTApi() {
  if (ytApiPromise) return ytApiPromise;
  ytApiPromise = new Promise((res, rej) => {
    if (window.YT && window.YT.Player) return res(window.YT);
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => { prev?.(); res(window.YT); };
    const sc = document.createElement('script');
    sc.src = 'https://www.youtube.com/iframe_api';
    sc.async = true;
    sc.onerror = rej;              // لو تعذّر التحميل يظلّ الفيديو يعمل بلا تتبّع الموضع
    document.head.appendChild(sc);
    setTimeout(rej, 8000);
  }).catch(() => null);
  return ytApiPromise;
}

function initVideos() {
  const stage = $('#vStage'); if (!stage) return;
  /* العدد مشتقّ من السجلّ لا مكتوب في HTML، فلا يتخلّف عند إضافة فيديو */
  const cnt = $('#vCount'); if (cnt) cnt.textContent = VIDEOS.length;
  const list = $('#vList'), embed = $('#vEmbed');
  const video = $('#vPlayer'), poster = $('#vPoster'), title = $('#vTitle'), desc = $('#vDesc');
  const resume = $('#vResume');
  let cur = null, ytPlayer = null, ytTimer = null;

  const positions = () => { try { return JSON.parse(localStorage.getItem(RESUME_KEY) || '{}'); } catch { return {}; } };
  const savePos  = (id, t) => { const p = positions(); p[id] = Math.round(t); localStorage.setItem(RESUME_KEY, JSON.stringify(p)); };
  const clearPos = id => { const p = positions(); delete p[id]; localStorage.setItem(RESUME_KEY, JSON.stringify(p)); };
  const fmt = s => `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, '0')}`;

  /* يوقف ما يشتغل حاليًّا وينظّف الإطار */
  const teardown = () => {
    clearInterval(ytTimer); ytTimer = null;
    try { ytPlayer?.destroy?.(); } catch (_) {}
    ytPlayer = null;
    embed.innerHTML = ''; embed.classList.remove('on');
    video.pause(); video.removeAttribute('src'); video.load();
    stage.classList.remove('err');
  };

  /* تركيب إطار يوتيوب: فيديو مفرد أو قائمة تشغيل كاملة.
     القائمة تُركَّب على المسار الخاصّ /embed/videoseries?list=… فتُشغَّل
     من أوّلها تباعًا، ولا معنى فيها للبدء من موضع توقّف. */
  const mountYT = (src, at) => {
    const params = new URLSearchParams({
      autoplay: '1', rel: '0', modestbranding: '1', playsinline: '1',
      hl: 'ar', cc_lang_pref: 'ar', enablejsapi: '1'
    });
    const isList = src.kind === 'playlist';
    if (isList) params.set('list', src.id);
    else {
      if (src.list) params.set('list', src.list);
      if (at > 0) params.set('start', String(at));
    }
    if (location.protocol.startsWith('http')) params.set('origin', location.origin);
    const path = isList ? 'videoseries' : src.id;
    embed.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${path}?${params}"
      title="${cur ? cur.t : 'فيديو توضيحي'}" allowfullscreen
      referrerpolicy="strict-origin-when-cross-origin"
      allow="accelerometer; autoplay; encrypted-media; picture-in-picture; fullscreen"></iframe>`;
    embed.classList.add('on');
    video.style.display = 'none';

    // تتبُّع الموضع تحسينٌ إضافي: لو لم تُحمَّل الواجهة يظلّ الفيديو يعمل
    const id = cur.id;
    loadYTApi().then(YT => {
      if (!YT || !embed.firstElementChild) return;
      ytPlayer = new YT.Player(embed.firstElementChild, {
        events: {
          onStateChange: e => { if (e.data === YT.PlayerState.ENDED) clearPos(id); }
        }
      });
      ytTimer = setInterval(() => {
        const t = ytPlayer?.getCurrentTime?.();
        if (t > 5) savePos(id, t);
      }, 5000);
    });
  };

  const play = () => {
    if (!cur) return;
    poster.classList.add('hide');
    resume.classList.remove('on');
    const src = ytSrc(cur), at = positions()[cur.id] || 0;
    if (src.kind) mountYT(src, at);
    else {
      video.style.display = '';
      if (at > 3 && at < (cur.len || 1e9) - 10) { try { video.currentTime = at; } catch (_) {} }
      video.play().catch(() => {});
    }
  };

  const load = (id, autoplay) => {
    const v = VID(id); if (!v) return;
    teardown();
    cur = v;
    const ax = AX(v.ax);
    stage.style.setProperty('--c', ax.c); stage.style.setProperty('--c2', ax.c2);
    if (!ytSrc(v).kind) { video.style.display = ''; video.src = P.video(v.id); video.load(); }
    poster.style.backgroundImage = `url("${imgOf(v.img)}")`;
    poster.classList.remove('hide');
    title.textContent = v.t;
    desc.textContent = v.d + ' · ' + v.dur + (ytSrc(v).kind === 'playlist' ? '' : ' دقيقة');
    $$('.vitem', list).forEach(b => b.classList.toggle('on', b.dataset.id === id));
    history.replaceState(null, '', '?v=' + id);

    const pos = positions()[id];
    resume.classList.toggle('on', !!(pos && pos > 20 && v.len && pos < v.len - 25));
    if (pos) $('#vResumeTime').textContent = fmt(pos);
    $('#vResumeGo').onclick = () => play();     // play يقرأ الموضع المحفوظ بنفسه
    if (autoplay) play();
  };

  poster.addEventListener('click', play);
  video.addEventListener('timeupdate', () => { if (cur && video.currentTime > 5) savePos(cur.id, video.currentTime); });
  video.addEventListener('ended', () => { if (cur) clearPos(cur.id); });
  video.addEventListener('error', () => {
    if (!cur || ytSrc(cur).kind || !video.getAttribute('src')) return;
    stage.classList.add('err');
    title.textContent = 'تعذّر تشغيل هذا الفيديو';
    desc.textContent = 'ملف الفيديو غير موجود ولم يُضَف رابط يوتيوب بعد — راجع الحقل yt في assets/js/data.js';
    poster.classList.remove('hide');
  });

  VIDEOS.forEach(v => {
    const ax = AX(v.ax);
    const b = el('button', 'vitem');
    b.dataset.id = v.id; b.style.setProperty('--c', ax.c);
    b.innerHTML = `<span class="thumb"><img src="${imgOf(v.img)}" alt="" loading="lazy"><span>${v.dur}</span></span>
      <span><b>${v.t}</b><small>${v.featured ? 'الجولة الكاملة' : ax.n}</small></span>`;
    b.addEventListener('click', () => { load(v.id, true); stage.scrollIntoView({ behavior: 'smooth', block: 'center' }); });
    list.appendChild(b);
  });

  const q = new URLSearchParams(location.search).get('v');
  load(q && VID(q) ? q : VIDEOS[0].id, false);

  // شبكة الفيديوهات القصيرة
  const grid = $('#vGrid');
  if (grid) VIDEOS.filter(v => !v.featured).forEach((v, i) => {
    const ax = AX(v.ax);
    const b = el('button', 'vgrid-card rv');
    b.style.setProperty('--c', ax.c); b.style.setProperty('--c2', ax.c2);
    b.dataset.delay = String((i % 3) * 70);
    b.innerHTML = `<span class="thumb"><img src="${imgOf(v.img)}" alt="" loading="lazy">
        <span class="pl">${icon('play', 16)}</span><span class="dur">${v.dur}</span></span>
      <span class="b"><h3>${v.t}</h3><p>${v.d}</p>
      <span class="app-tags"><span class="pill c" style="--c:${ax.c}">${ax.n}</span>
      ${v.app && APP(v.app)?.guide ? '<span class="pill pdf">دليل PDF</span>' : ''}</span></span>`;
    b.addEventListener('click', () => { load(v.id, true); stage.scrollIntoView({ behavior: 'smooth', block: 'center' }); });
    grid.appendChild(b);
  });

  // تذكير في وحدة التحكّم بالفيديوهات التي لم تُربط بيوتيوب بعد
  const pending = VIDEOS.filter(v => !ytSrc(v).kind).map(v => v.id);
  if (pending.length) console.info(
    `[المنصّة] ${pending.length} فيديو ما زال يُشغَّل محليًّا من مجلّد videos/: ${pending.join('، ')}` +
    `\nلنقلها إلى يوتيوب: املأ الحقل yt المقابل لكلٍّ منها في assets/js/data.js`);
}


/* ─────────── لوحة الأوامر (Ctrl + K) ─────────── */
function initCmdK() {
  const bg = el('div', 'cmdk-bg');
  bg.innerHTML = `<div class="cmdk" role="dialog" aria-modal="true" aria-label="بحث سريع">
    <input id="cmdkInput" type="search" placeholder="ابحث عن تطبيق، فيديو أو دليل…" autocomplete="off">
    <div class="cmdk-list" id="cmdkList"></div>
    <div class="cmdk-foot"><span><kbd>↑</kbd><kbd>↓</kbd> تنقّل</span><span><kbd>Enter</kbd> فتح</span>
      <span><kbd>Esc</kbd> إغلاق</span></div></div>`;
  document.body.appendChild(bg);
  const input = $('#cmdkInput', bg), list = $('#cmdkList', bg);
  let sel = 0, items = [];

  const pool = [
    ...NAV.map(n => ({ t: n.t, s: 'صفحة', href: n.href, ic: 'arrowl', c: 'var(--brand)', c2: 'var(--a4)' })),
    ...APPS.map(a => { const ax = AX(a.ax); return { t: a.t, s: ax.n, href: `apps.html#${a.id}`, ic: a.ic, c: ax.c, c2: ax.c2 }; }),
    ...VIDEOS.map(v => ({ t: 'فيديو: ' + v.t, s: v.dur + ' دقيقة', href: `videos.html?v=${v.id}`, ic: 'play', c: 'var(--a2)', c2: 'var(--a2b)' })),
    ...LIBRARY.map(g => ({ t: 'دليل: ' + g.t, s: 'PDF · ' + g.s, href: P.guide(g.f), dl: g.name, ic: 'pdf', c: 'var(--a5)', c2: 'var(--a5b)' })),
    { t: 'نزّل منصة التدبير المدرسي', s: 'تطبيق ويندوز', href: 'download.html', ic: 'dl', c: 'var(--a1)', c2: 'var(--a1b)' }
  ];
  pool.forEach(p => p.k = norm(p.t + ' ' + p.s));

  const render = () => {
    const q = norm(input.value);
    items = (q ? pool.filter(p => p.k.includes(q)) : pool).slice(0, 40);
    sel = 0;
    list.innerHTML = items.length
      ? items.map((p, i) => `<a class="cmdk-item ${i === 0 ? 'sel' : ''}" href="${p.href}" ${p.dl ? `download="${p.dl}"` : ''}>
          <span class="ic" style="--c:${p.c};--c2:${p.c2}">${icon(p.ic, 17)}</span>
          <span><b>${p.t}</b><small>${p.s}</small></span></a>`).join('')
      : '<p class="empty" style="padding:34px">لا نتائج — جرّب كلمة أخرى.</p>';
  };
  const move = d => {
    const nodes = $$('.cmdk-item', list); if (!nodes.length) return;
    nodes[sel]?.classList.remove('sel');
    sel = (sel + d + nodes.length) % nodes.length;
    nodes[sel].classList.add('sel');
    nodes[sel].scrollIntoView({ block: 'nearest' });
  };
  const open = () => { bg.classList.add('on'); input.value = ''; render(); setTimeout(() => input.focus(), 60); document.body.style.overflow = 'hidden'; };
  const close = () => { bg.classList.remove('on'); document.body.style.overflow = ''; };

  input.addEventListener('input', render);
  bg.addEventListener('click', e => { if (e.target === bg) close(); });
  $$('.js-cmdk').forEach(b => b.addEventListener('click', open));
  addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); bg.classList.contains('on') ? close() : open(); return; }
    if (!bg.classList.contains('on')) {
      if (e.key === '/' && !/input|textarea|select/i.test(document.activeElement.tagName)) { e.preventDefault(); open(); }
      return;
    }
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowDown') { e.preventDefault(); move(1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); move(-1); }
    else if (e.key === 'Enter') { e.preventDefault(); $$('.cmdk-item', list)[sel]?.click(); }
  });
}

/* ─────────── معطيات الإصدار في الصفحات ─────────── */
/* رقم الإصدار والحجم واسم الملف تُكتب من data.js لا في HTML،
   فتحديث إصدار جديد يمسّ ثابتًا واحدًا لا خمس صفحات. */
function initAppMeta() {
  const set = (sel, val) => $$(sel).forEach(n => { n.textContent = val; });
  set('#mVersion, .js-version', APP_VERSION);
  set('#mSize, #mSize2, .js-size', APP_SIZE);
  set('#mSetup, .js-setup', APP_SETUP);
  set('.js-datadir', APP_DATA_DIR);
  set('.js-sha', APP_SHA256);
  $$('#dlBtn, .js-dl').forEach(a => { a.href = APP_DOWNLOAD; });
  $$('.js-releases').forEach(a => { a.href = APP_RELEASES; });
}

/* ─────────── تضمين استمارة جوجل ─────────── */
/* المصادر تُحقن من جافاسكريبت لا في HTML: الإطار لا يُحمَّل إلا في صفحة
   الطلب، ورابط الاستمارة يبقى في data.js وحده لتغييره من مكان واحد. */
function initGForm() {
  const frame = $('#gformFrame');
  if (!frame) return;
  frame.src = GFORM_EMBED;
  const open = $('#gformOpen'), alt = $('#gformAlt');
  if (open) open.href = GFORM_OPEN;
  if (alt)  alt.href  = GFORM_OPEN;
}

/* ─────────── تعبئة الأيقونات المعلَّمة في HTML ─────────── */
function initIcons() {
  $$('[data-icon]').forEach(n => { n.innerHTML = icon(n.dataset.icon, +(n.dataset.size || 21)); });
}

/* ─────────── أزرار طلب نسخة ─────────── */


/* ─────────── تأكيد التحميل ─────────── */
function initDownloads() {
  document.addEventListener('click', e => {
    const a = e.target.closest('a[download]');
    if (a) toast('بدأ التحميل… تحقّق من مجلّد «التنزيلات».');
  });
}

/* ─────────── تشغيل ─────────── */
initTheme();
document.addEventListener('DOMContentLoaded', () => {
  buildChrome();
  initIcons();
  initConstellation();
  initExplorer();
  initVideos();
  initCmdK();
  initCounters();
  initAppMeta();
  initGForm();
  initDownloads();
  initReveal();
});

window.mm = { toast, openDrawer, observeReveal };
})();
