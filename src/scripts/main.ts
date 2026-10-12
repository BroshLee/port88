import { SHIPS_WINTER } from '../data/design';

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ── Theme ─────────────────────────────────────────────────────────────── */
function initTheme() {
  const root = document.documentElement;
  const btn = document.querySelector<HTMLButtonElement>('[data-theme-toggle]');
  if (!btn) return;

  const sun = btn.querySelector<SVGElement>('[data-icon-sun]');
  const moon = btn.querySelector<SVGElement>('[data-icon-moon]');

  const sync = () => {
    const isDark = root.dataset.theme !== 'light';
    sun?.classList.toggle('hidden', !isDark);
    moon?.classList.toggle('hidden', isDark);
    btn.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
  };

  sync();
  btn.addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'light' ? 'dark' : 'light';
    try {
      localStorage.setItem('theme', root.dataset.theme);
    } catch {
      /* storage blocked — theme still applies for this session */
    }
    sync();
  });
}

/* ── Nav: scrolled state, progress bar, active link, mobile menu ───────── */
function initNav() {
  const header = document.querySelector<HTMLElement>('[data-nav]');
  const progress = document.querySelector<HTMLElement>('#scroll-progress');
  const menuBtn = document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
  const menu = document.querySelector<HTMLElement>('#mobile-menu');

  let navFrame = 0;

  const update = () => {
    navFrame = 0;
    const y = window.scrollY;
    if (header) {
      const scrolled = y > 12;
      header.classList.toggle('border-b', scrolled);
      header.classList.toggle('border-line', scrolled);
      header.classList.toggle('bg-bg/80', scrolled);
      header.classList.toggle('backdrop-blur-xl', scrolled);
    }
    if (progress) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.transform = `scaleX(${max > 0 ? Math.min(y / max, 1) : 0})`;
    }
  };

  update();
  // Once per frame: a fast fling fires scroll events faster than paints.
  window.addEventListener(
    'scroll',
    () => {
      if (!navFrame) navFrame = requestAnimationFrame(update);
    },
    { passive: true }
  );

  if (menuBtn && menu) {
    const close = () => {
      menu.hidden = true;
      menuBtn.setAttribute('aria-expanded', 'false');
    };
    menuBtn.addEventListener('click', () => {
      const open = menu.hidden;
      menu.hidden = !open;
      menuBtn.setAttribute('aria-expanded', String(open));
    });
    menu.querySelectorAll('[data-mobile-link]').forEach((l) => l.addEventListener('click', close));
    // Desktop breakpoint takes over the nav, so drop the mobile panel's state.
    window.matchMedia('(min-width: 768px)').addEventListener('change', (e) => e.matches && close());
  }

  // Highlight whichever section owns the most viewport space.
  const links = Array.from(document.querySelectorAll<HTMLAnchorElement>('[data-navlink]'));
  const sections = links
    .map((l) => document.getElementById(l.dataset.navlink!))
    .filter((s): s is HTMLElement => Boolean(s));

  if (!sections.length) return;

  const setActive = (id: string | null) => {
    links.forEach((l) => {
      const on = l.dataset.navlink === id;
      l.classList.toggle('text-text', on);
      l.classList.toggle('bg-surface', on);
      l.classList.toggle('text-muted', !on);
      if (on) l.setAttribute('aria-current', 'true');
      else l.removeAttribute('aria-current');
    });
  };

  const ratios = new Map<string, number>();
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => ratios.set(e.target.id, e.isIntersecting ? e.intersectionRatio : 0));
      let best: string | null = null;
      let top = 0;
      ratios.forEach((v, k) => {
        if (v > top) {
          top = v;
          best = k;
        }
      });
      setActive(best);
    },
    { threshold: [0, 0.15, 0.35, 0.6, 0.85], rootMargin: '-72px 0px -35% 0px' }
  );
  sections.forEach((s) => observer.observe(s));
}

/* ── Scroll reveals ────────────────────────────────────────────────────── */
function initReveals() {
  const pending = new Set(document.querySelectorAll<HTMLElement>('.reveal, .reveal-3d'));
  // Unarmed, the CSS leaves everything visible — the right outcome here too.
  if (!pending.size || reduceMotion) return;

  const root = document.documentElement;
  const settle: HTMLElement[] = [];
  let frame = 0;
  let lastY = window.scrollY;
  let lastT = performance.now();
  let fastUntil = 0;

  // Checked on scroll in a rAF rather than via IntersectionObserver: the
  // observer reports a frame late and never reports sections that were jumped
  // straight past, which is what left holes when scrolling back up.
  const sweep = (instant: boolean, reach: number) => {
    // Every rect is read before any class is written, so a sweep costs one layout.
    const due = Array.from(pending, (el) => [el, el.getBoundingClientRect().top] as const).filter(
      ([, top]) => top < reach
    );

    due.forEach(([el, top]) => {
      pending.delete(el);
      // Anything at or above the top edge is content the reader already passed.
      if (instant || top < 0) {
        el.classList.add('is-instant');
        settle.push(el);
      }
      el.classList.add('is-visible');
    });

    if (!pending.size) teardown();
    if (settle.length) {
      // Two frames so the visible state is committed before transitions return.
      requestAnimationFrame(() =>
        requestAnimationFrame(() => settle.splice(0).forEach((el) => el.classList.remove('is-instant')))
      );
    }
  };

  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(() => {
      frame = 0;
      const vh = window.innerHeight;
      // While flying through the page, reveal well ahead so nothing lands blank.
      if (performance.now() < fastUntil) sweep(true, vh * 2);
      else sweep(false, vh * 0.92);
    });
  };

  const onScroll = () => {
    const now = performance.now();
    const y = window.scrollY;
    const dy = Math.abs(y - lastY);
    const dt = now - lastT;
    // A jump of most of a screen (End key, scrollbar drag, anchor link) or a
    // flick past ~2.5px/ms means "take me there" — animating would show blanks.
    if (dy > window.innerHeight * 0.6 || (dt > 0 && dt < 100 && dy / dt > 2.5)) {
      fastUntil = now + 200;
    }
    lastY = y;
    lastT = now;
    schedule();
  };

  // Late font swaps and the contact form's success state move content without
  // any scroll, so a layout change has to trigger a check too.
  const resizeObserver = new ResizeObserver(schedule);

  function teardown() {
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', schedule);
    resizeObserver.disconnect();
  }

  // Content was already painted visible before this script arrived, so
  // whatever is on screen (or above it) stays put instead of re-animating.
  // Run synchronously before arming so no frame shows it hidden.
  sweep(true, window.innerHeight);
  root.classList.add('reveal-armed');
  if (!pending.size) return;

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', schedule, { passive: true });
  resizeObserver.observe(document.body);
}

/* ── Experience timeline rail ──────────────────────────────────────────── */
function initTimeline() {
  const wrap = document.querySelector<HTMLElement>('[data-timeline]');
  const fill = document.querySelector<HTMLElement>('[data-timeline-fill]');
  if (!wrap || !fill) return;

  if (reduceMotion) {
    fill.style.transform = 'scaleY(1)';
    return;
  }

  let ticking = false;

  // Maps scroll position across the section to the rail's fill, matching a
  // scrubbed timeline without pulling in an animation library.
  const update = () => {
    ticking = false;
    const r = wrap.getBoundingClientRect();
    const vh = window.innerHeight;
    const start = vh * 0.65;
    const end = vh * 0.75;
    const span = r.height - (start - end);
    if (span <= 0) return;
    const progress = Math.min(Math.max((start - r.top) / span, 0), 1);
    fill.style.transform = `scaleY(${progress})`;
  };

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  };

  update();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
}

/* ── 3D card tilt ──────────────────────────────────────────────────────── */
function initTilt() {
  // Touch devices have no hover state to drive this, and tilting on tap is noise.
  if (reduceMotion || !window.matchMedia('(hover: hover)').matches) return;

  document.querySelectorAll<HTMLElement>('[data-tilt]').forEach((el) => {
    const max = Number(el.dataset.tilt) || 7;
    let frame = 0;

    const move = (e: PointerEvent) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const r = el.getBoundingClientRect();
        // -0.5..0.5 from the card's centre, mapped to a rotation in degrees.
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        el.style.setProperty('--ry', `${px * max * 2}deg`);
        el.style.setProperty('--rx', `${-py * max * 2}deg`);
        // Same pointer position also drives the .spotlight glow.
        el.style.setProperty('--mx', `${(px + 0.5) * 100}%`);
        el.style.setProperty('--my', `${(py + 0.5) * 100}%`);
      });
    };

    const reset = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      el.classList.remove('is-tilting');
      el.style.setProperty('--rx', '0deg');
      el.style.setProperty('--ry', '0deg');
    };

    el.addEventListener('pointerenter', () => el.classList.add('is-tilting'));
    el.addEventListener('pointermove', move, { passive: true });
    el.addEventListener('pointerleave', reset);
  });
}

/* ── Architecture scene: pointer-steered rotation ──────────────────────── */
function initArchScene() {
  const scene = document.querySelector<HTMLElement>('[data-arch-scene]');
  const stage = document.querySelector<HTMLElement>('[data-arch-stage]');
  if (!scene || !stage) return;
  if (reduceMotion || !window.matchMedia('(hover: hover)').matches) return;

  const restX = 7;
  const restY = -11;
  let frame = 0;

  scene.addEventListener(
    'pointermove',
    (e) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const r = scene.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        stage.classList.add('is-tracking');
        stage.style.setProperty('--srx', `${restX - py * 16}deg`);
        stage.style.setProperty('--sry', `${restY + px * 22}deg`);
      });
    },
    { passive: true }
  );

  scene.addEventListener('pointerleave', () => {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    stage.classList.remove('is-tracking');
    stage.style.setProperty('--srx', `${restX}deg`);
    stage.style.setProperty('--sry', `${restY}deg`);
  });
}

/* ── Snowfall (winter design only) ─────────────────────────────────────── */
function initSnow() {
  // In random mode the canvas ships either way, so the resolved design decides.
  if (document.documentElement.dataset.design !== 'winter') return;

  const canvas = document.querySelector<HTMLCanvasElement>('[data-snow]');
  if (!canvas || reduceMotion) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  type Flake = { x: number; y: number; r: number; vy: number; drift: number; phase: number; alpha: number };

  let w = 0;
  let h = 0;
  let dpr = 1;
  let flakes: Flake[] = [];
  let raf = 0;
  let running = true;

  const build = () => {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Scale count to viewport area, capped so phones stay cheap.
    const count = Math.min(Math.round((w * h) / 14000), 130);
    flakes = Array.from({ length: count }, () => {
      // depth 0 = far (small, slow, faint), 1 = near.
      const depth = Math.random();
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        r: 0.7 + depth * 2.3,
        vy: 8 + depth * 26,
        drift: 6 + depth * 20,
        phase: Math.random() * Math.PI * 2,
        alpha: 0.18 + depth * 0.45,
      };
    });
  };

  const snowColor = () =>
    document.documentElement.dataset.theme === 'light' ? '130, 165, 200' : '235, 246, 255';

  let last = performance.now();

  const frame = (now: number) => {
    raf = requestAnimationFrame(frame);
    // Delta-time so speed is frame-rate independent; clamped over tab switches.
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;

    ctx.clearRect(0, 0, w, h);
    const rgb = snowColor();

    for (const f of flakes) {
      f.y += f.vy * dt;
      f.phase += dt * 0.9;
      f.x += Math.sin(f.phase) * f.drift * dt;

      if (f.y - f.r > h) {
        f.y = -f.r;
        f.x = Math.random() * w;
      }
      if (f.x < -10) f.x = w + 10;
      else if (f.x > w + 10) f.x = -10;

      ctx.beginPath();
      ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${rgb}, ${f.alpha})`;
      ctx.fill();
    }
  };

  build();
  raf = requestAnimationFrame(frame);

  let resizeTimer = 0;
  window.addEventListener('resize', () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(build, 180);
  });

  // Don't burn cycles animating a canvas nobody can see.
  document.addEventListener('visibilitychange', () => {
    const shouldRun = !document.hidden;
    if (shouldRun === running) return;
    running = shouldRun;
    if (running) {
      last = performance.now();
      raf = requestAnimationFrame(frame);
    } else {
      cancelAnimationFrame(raf);
    }
  });
}

/* ── Architecture diagram captions ─────────────────────────────────────── */
function initArchDiagram() {
  const fig = document.querySelector<HTMLElement>('[data-arch]');
  const note = fig?.querySelector<HTMLElement>('[data-arch-note]');
  if (!fig || !note) return;

  const fallback = note.textContent ?? '';
  const show = (text: string) => {
    note.textContent = text;
  };

  fig.querySelectorAll<SVGGElement>('[data-node]').forEach((node) => {
    const label = node.getAttribute('aria-label') ?? '';
    // aria-label is "Title: note" — the caption only wants the note half.
    const text = label.slice(label.indexOf(':') + 1).trim() || fallback;
    const enter = () => show(text);
    const leave = () => show(fallback);
    node.addEventListener('pointerenter', enter);
    node.addEventListener('pointerleave', leave);
    node.addEventListener('focus', enter);
    node.addEventListener('blur', leave);
  });
}

/* ── Contact form ──────────────────────────────────────────────────────── */
function initContactForm() {
  const form = document.querySelector<HTMLFormElement>('[data-contact-form]');
  if (!form) return;

  const fields = form.querySelector<HTMLElement>('[data-form-fields]');
  const success = form.querySelector<HTMLElement>('[data-form-success]');
  const status = form.querySelector<HTMLElement>('[data-form-status]');
  const button = form.querySelector<HTMLButtonElement>('[data-submit]');
  const label = form.querySelector<HTMLElement>('[data-submit-label]');
  const again = form.querySelector<HTMLButtonElement>('[data-send-another]');

  const say = (msg: string) => {
    if (!status) return;
    status.textContent = msg;
    status.classList.toggle('hidden', !msg);
  };

  // Per-field messages beat one generic line — the visitor sees what to fix.
  const firstProblem = (): { el: HTMLInputElement | HTMLTextAreaElement; msg: string } | null => {
    const get = <T extends HTMLElement>(n: string) =>
      form.querySelector<T>(`[name="${n}"]`) as T;
    const name = get<HTMLInputElement>('name');
    const email = get<HTMLInputElement>('email');
    const message = get<HTMLTextAreaElement>('message');

    if (!name.value.trim()) return { el: name, msg: 'Please enter your name.' };
    if (!email.value.trim()) return { el: email, msg: 'Please enter your email address.' };
    if (!email.checkValidity())
      return { el: email, msg: 'That email address doesn’t look right.' };
    if (message.value.trim().length < 10)
      return { el: message, msg: 'Please write a little more so I know what you need.' };
    return null;
  };

  const showSuccess = () => {
    fields?.classList.add('hidden');
    success?.classList.remove('hidden');
    say('');
    // Move focus so screen readers announce the result rather than nothing.
    success?.querySelector<HTMLElement>('[data-success-heading]')?.focus();
  };

  again?.addEventListener('click', () => {
    form.reset();
    success?.classList.add('hidden');
    fields?.classList.remove('hidden');
    form.querySelector<HTMLInputElement>('[name="name"]')?.focus();
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const problem = firstProblem();
    if (problem) {
      say(problem.msg);
      problem.el.focus();
      return;
    }

    say('');
    if (button) button.disabled = true;
    if (label) label.textContent = 'Sending…';

    // Without this, a stalled connection leaves the button disabled on
    // "Sending…" indefinitely with no way for the visitor to retry.
    const timeout = AbortSignal.timeout ? AbortSignal.timeout(15000) : undefined;

    const payload = new FormData(form);
    // So hitting Reply in Gmail goes to the visitor, not to Web3Forms.
    payload.set('replyto', String(payload.get('email') ?? ''));

    try {
      const res = await fetch(form.dataset.endpoint!, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: payload,
        signal: timeout,
      });

      // Web3Forms answers 200 with {success:false} for a bad or unverified key,
      // so the status code alone isn't enough to trust.
      const body = await res.json().catch(() => null);
      if (!res.ok || body?.success === false) {
        throw new Error(body?.message || `HTTP ${res.status}`);
      }

      showSuccess();
    } catch (err) {
      // Never hand off to a mail client — just say so and leave the text intact
      // so nothing the visitor typed is lost.
      say(
        `Sorry, the message couldn’t be sent just now. Please email me directly at ${form.dataset.email}.`
      );
      console.error('[contact]', err);
    } finally {
      if (button) button.disabled = false;
      if (label) label.textContent = 'Send message';
    }
  });
}

/* ── Boot ──────────────────────────────────────────────────────────────── */
function boot() {
  initTheme();
  initNav();
  initReveals();
  initTimeline();
  initTilt();
  initArchScene();
  initArchDiagram();
  // Literal const, so the bundler drops initSnow entirely on an ember-only build.
  if (SHIPS_WINTER) initSnow();
  initContactForm();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot, { once: true });
} else {
  boot();
}
