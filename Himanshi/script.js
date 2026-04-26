'use strict';

/* ============================
   DEVICE CHECK (IMPORTANT)
============================ */
const isMobile = window.innerWidth < 768;

/* ============================
   PARTICLES (DISABLED ON MOBILE)
============================ */
(function initParticles() {
  if (isMobile) return; // 🔥 kill lag

  const canvas = document.getElementById('particles');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.size = Math.random() * 2 + 1;
      this.speed = Math.random() * 0.3 + 0.1;
    }

    update() {
      this.y -= this.speed;
      if (this.y < 0) this.y = H;
    }

    draw() {
      ctx.fillStyle = "rgba(200,132,60,0.3)";
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function init() {
    particles = [];
    for (let i = 0; i < 10; i++) { // 🔥 reduced count
      particles.push(new Particle());
    }
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animate);
  }

  resize();
  init();
  animate();

  window.addEventListener('resize', () => {
    resize();
    init();
  });
})();


/* ============================
   VIDEO PLAYER (OPTIMIZED)
============================ */
(function initVideo() {
  const video = document.getElementById('mainVideo');
  if (!video) return;

  // ❌ Remove autoplay for mobile
  if (isMobile) {
    video.removeAttribute('autoplay');
  }

  video.addEventListener('loadedmetadata', () => {
    const frame = video.closest('.player-frame');
    if (frame) {
      frame.style.aspectRatio = `${video.videoWidth} / ${video.videoHeight}`;
    }
  });
})();


/* ============================
   VIDEO SWITCHER (SMOOTH + LIGHT)
============================ */
(function initSwitcher() {
  const video = document.getElementById('mainVideo');
  const thumbs = document.querySelectorAll('.thumb');
  const label = document.getElementById('nowPlayingLabel');

  if (!video) return;

  thumbs.forEach(btn => {
    btn.addEventListener('click', () => {

      if (btn.classList.contains('active')) return;

      // Active state
      thumbs.forEach(t => t.classList.remove('active'));
      btn.classList.add('active');

      // Change video (no heavy animation)
      video.pause();
      video.src = btn.dataset.video;
      video.load();

      if (!isMobile) {
        video.play().catch(() => {});
      }

      // Update label
      if (label) {
        label.textContent = btn.dataset.label;
      }

      // Scroll smoothly (only mobile)
      if (isMobile) {
        window.scrollTo({
          top: video.offsetTop - 20,
          behavior: "smooth"
        });
      }
    });
  });
})();


/* ============================
   LIGHT RIPPLE (OPTIONAL)
============================ */
(function initRipple() {
  if (isMobile) return; // 🔥 remove lag

  document.querySelectorAll('.thumb').forEach(thumb => {
    thumb.addEventListener('click', () => {
      thumb.style.transform = "scale(0.97)";
      setTimeout(() => {
        thumb.style.transform = "scale(1)";
      }, 150);
    });
  });
})();