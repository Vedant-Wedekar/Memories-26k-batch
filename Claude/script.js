/* ============================================
   MEMORY PAGE — script.js
   ============================================ */

/* ---- Floating Petals ---- */
(function spawnPetals() {
  const container = document.getElementById('petals');
  const colors = ['#e8a0b4', '#c4a8e0', '#f5ede8', '#d4b0d8', '#f0c0cc'];
  const count = 22;

  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    el.className = 'petal';
    const size = Math.random() * 7 + 4;
    el.style.cssText = `
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      width: ${size}px;
      height: ${size}px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      animation-duration: ${Math.random() * 14 + 10}s;
      animation-delay: ${Math.random() * 12}s;
    `;
    container.appendChild(el);
  }
})();


/* ---- Video Switcher ---- */
const mainVideo   = document.getElementById('mainVideo');
const nowLabel    = document.getElementById('nowPlayingLabel');
const thumbs      = document.querySelectorAll('.thumb');

thumbs.forEach(thumb => {
  thumb.addEventListener('click', () => {
    const src   = thumb.dataset.video;
    const label = thumb.dataset.label;

    // Already playing this one?
    if (thumb.classList.contains('active')) return;

    // Update active state
    thumbs.forEach(t => t.classList.remove('active'));
    thumb.classList.add('active');

    // Animate out
    mainVideo.classList.add('switching');

    setTimeout(() => {
      // Swap source
      mainVideo.src = src;
      mainVideo.load();
      mainVideo.play().catch(() => {/* autoplay blocked is fine */});

      // Update label
      nowLabel.textContent = label;

      // Animate in
      mainVideo.classList.remove('switching');
    }, 260);
  });
});

// Restore fade-in when video can play
mainVideo.addEventListener('canplay', () => {
  mainVideo.style.opacity = '1';
});


/* ---- Background Music Toggle ---- */
const musicBtn  = document.getElementById('musicBtn');
const musicIcon = document.getElementById('musicIcon');
const bgMusic   = document.getElementById('bgMusic');

let musicPlaying = false;

musicBtn.addEventListener('click', () => {
  if (musicPlaying) {
    bgMusic.pause();
    musicIcon.textContent = '♪';
    musicBtn.classList.remove('active');
    musicBtn.title = 'Play background music';
  } else {
    bgMusic.volume = 0.35;
    bgMusic.play().then(() => {
      musicIcon.textContent = '♫';
      musicBtn.classList.add('active');
      musicBtn.title = 'Pause background music';
    }).catch(() => {
      // No audio file present — silently fail
      console.info('Background music file not found or autoplay blocked.');
    });
  }
  musicPlaying = !musicPlaying;
});


/* ---- Smooth scroll to player on thumb click (mobile) ---- */
thumbs.forEach(thumb => {
  thumb.addEventListener('click', () => {
    const playerWrap = document.querySelector('.player-wrap');
    if (playerWrap) {
      const offset = playerWrap.getBoundingClientRect().top + window.scrollY - 24;
      window.scrollTo({ top: offset, behavior: 'smooth' });
    }
  });
});
