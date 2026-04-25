/* =============================================
   MEMORY PAGE v3 — script.js
   Golden-Hour Cinematic · Gender-neutral
   ============================================= */

'use strict';

/* ══════════════════════
   FLOATING PARTICLES
══════════════════════ */
(function initParticles() {
  const canvas = document.getElementById('particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  // Colours matching the warm amber/gold palette
  const COLORS = [
    'rgba(200,132,60,0.38)',
    'rgba(232,176,106,0.3)',
    'rgba(200,168,75,0.32)',
    'rgba(228,204,128,0.28)',
    'rgba(156,136,102,0.22)',
  ];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  class Particle {
    constructor(fromBottom = false) {
      this.init(fromBottom);
    }
    init(fromBottom = true) {
      this.x      = Math.random() * W;
      this.y      = fromBottom ? H + 20 : Math.random() * H;
      this.radius = Math.random() * 3 + 1.5;
      this.speed  = Math.random() * 0.55 + 0.2;
      this.drift  = (Math.random() - 0.5) * 0.35;
      this.alpha  = Math.random() * 0.5 + 0.2;
      this.color  = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.flicker = Math.random() * Math.PI * 2;
      this.flickerSpeed = Math.random() * 0.03 + 0.01;
      // Randomly choose shape: circle or tiny diamond
      this.shape  = Math.random() > 0.72 ? 'diamond' : 'circle';
    }
    update() {
      this.y       -= this.speed;
      this.x       += this.drift;
      this.flicker += this.flickerSpeed;
      if (this.y < -20) this.init(true);
    }
    draw() {
      const a = this.alpha * (0.7 + 0.3 * Math.sin(this.flicker));
      ctx.save();
      ctx.globalAlpha = a;
      ctx.fillStyle = this.color;

      if (this.shape === 'diamond') {
        ctx.translate(this.x, this.y);
        ctx.rotate(Math.PI / 4);
        const s = this.radius * 1.2;
        ctx.fillRect(-s / 2, -s / 2, s, s);
      } else {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  const COUNT = 20;
  function spawnAll() {
    particles = [];
    for (let i = 0; i < COUNT; i++) {
      particles.push(new Particle(false));
    }
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  }

  resize();
  spawnAll();
  loop();
  window.addEventListener('resize', () => { resize(); spawnAll(); });
})();


/* ══════════════════════
   DYNAMIC PLAYER SIZING
   Reads actual video dimensions on every load
   and sets aspect-ratio on the frame so the
   container always matches the video perfectly.
══════════════════════ */
(function initDynamicPlayer() {
  const video = document.getElementById('mainVideo');
  const frame = video ? video.closest('.player-frame') : null;
  if (!video || !frame) return;

  const FALLBACK = '16 / 9';

  function applyAspectRatio() {
    const w = video.videoWidth;
    const h = video.videoHeight;
    frame.style.aspectRatio = (w && h) ? `${w} / ${h}` : FALLBACK;
    frame.classList.remove('loading');
  }

  function onNewVideo() {
    frame.classList.add('loading');
    frame.style.aspectRatio = FALLBACK; // prevent 0-height flash
  }

  video.addEventListener('loadedmetadata', applyAspectRatio);

  // Already cached (e.g. browser back-nav)
  if (video.readyState >= 1 && video.videoWidth) {
    applyAspectRatio();
  } else {
    onNewVideo();
  }

  // Expose so switcher can trigger loading state on src swap
  window._playerOnNewVideo = onNewVideo;
})();


/* ══════════════════════
   VIDEO SWITCHER
══════════════════════ */
(function initVideoSwitcher() {
  const video    = document.getElementById('mainVideo');
  const label    = document.getElementById('nowPlayingLabel');
  const thumbs   = document.querySelectorAll('.thumb');
  const nowRow   = document.getElementById('nowPlaying');

  if (!video) return;

  thumbs.forEach(thumb => {
    thumb.addEventListener('click', () => {
      if (thumb.classList.contains('active')) return;

      // Update active styles
      thumbs.forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');

      // Animate out
      video.classList.add('switching');

      // Brief pulse on now-playing
      nowRow && nowRow.classList.add('pulse');
      setTimeout(() => nowRow && nowRow.classList.remove('pulse'), 400);

      setTimeout(() => {
        // Tell the player it's getting a new video (triggers loading shimmer
        // and resets aspect-ratio; loadedmetadata will snap it to real size)
        if (typeof window._playerOnNewVideo === 'function') {
          window._playerOnNewVideo();
        }
        video.src = thumb.dataset.video;
        video.load();
        video.play().catch(() => {/* blocked = fine */});
        label.textContent = thumb.dataset.label;
        video.classList.remove('switching');
      }, 290);

      // Smooth scroll to player (mobile UX)
      const playerSection = document.querySelector('.player-section');
      if (playerSection) {
        const y = playerSection.getBoundingClientRect().top + window.scrollY - 20;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    });
  });
})();


/* ══════════════════════
   MUSIC TOGGLE
══════════════════════ */
(function initMusic() {
  const btn      = document.getElementById('musicBtn');
  const audio    = document.getElementById('bgMusic');
  const iconPlay = document.getElementById('musicIconPlay');
  const iconPause= document.getElementById('musicIconPause');

  if (!btn || !audio) return;

  let playing = false;

  btn.addEventListener('click', () => {
    if (playing) {
      // Fade out
      fadeTo(audio, 0, 600, () => { audio.pause(); audio.currentTime = 0; });
      iconPlay.classList.remove('hidden');
      iconPause.classList.add('hidden');
      btn.classList.remove('active');
      btn.setAttribute('aria-label', 'Play background music');
    } else {
      audio.volume = 0;
      audio.play().then(() => {
        fadeTo(audio, 0.32, 800);
        iconPlay.classList.add('hidden');
        iconPause.classList.remove('hidden');
        btn.classList.add('active');
        btn.setAttribute('aria-label', 'Pause background music');
      }).catch(() => {
        console.info('Background audio unavailable.');
      });
    }
    playing = !playing;
  });

  function fadeTo(el, target, duration, callback) {
    const start     = el.volume;
    const diff      = target - start;
    const startTime = performance.now();

    function tick(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      el.volume = Math.max(0, Math.min(1, start + diff * easeInOut(progress)));
      if (progress < 1) {
        requestAnimationFrame(tick);
      } else if (callback) {
        callback();
      }
    }
    requestAnimationFrame(tick);
  }

  function easeInOut(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }
})();


/* ══════════════════════
   TOUCH RIPPLE (mobile tap feedback on thumbnails)
══════════════════════ */
(function initRipple() {
  document.querySelectorAll('.thumb').forEach(thumb => {
    thumb.addEventListener('pointerdown', (e) => {
      const rect   = thumb.getBoundingClientRect();
      const ripple = document.createElement('span');
      const size   = Math.max(rect.width, rect.height) * 1.4;
      const x      = e.clientX - rect.left - size / 2;
      const y      = e.clientY - rect.top  - size / 2;

      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(200,132,60,0.18);
        border-radius: 50%;
        transform: scale(0);
        pointer-events: none;
        z-index: 10;
        animation: rippleAnim 0.55s ease forwards;
      `;

      // Inject keyframes once
      if (!document.getElementById('ripple-style')) {
        const s = document.createElement('style');
        s.id = 'ripple-style';
        s.textContent = `
          @keyframes rippleAnim {
            to { transform: scale(1); opacity: 0; }
          }
          .now-playing.pulse #nowPlayingLabel {
            animation: labelFlash 0.4s ease;
          }
          @keyframes labelFlash {
            0%, 100% { opacity: 1; }
            50%       { opacity: 0.4; }
          }
        `;
        document.head.appendChild(s);
      }

      const frame = thumb.querySelector('.thumb-frame');
      if (frame) {
        frame.style.position = 'relative';
        frame.style.overflow = 'hidden';
        frame.appendChild(ripple);
        ripple.addEventListener('animationend', () => ripple.remove());
      }
    });
  });
})();
