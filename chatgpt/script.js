const video = document.getElementById("mainVideo");

// Change Video Smoothly
function changeVideo(src, element) {

  // Remove active class
  document.querySelectorAll(".thumb").forEach(t => {
    t.classList.remove("active");
  });

  // Add active to clicked
  element.classList.add("active");

  // Fade effect
  video.style.opacity = 0;

  setTimeout(() => {
    video.src = src;
    video.play();
    video.style.opacity = 1;
  }, 300);
}

// Background Music
const music = document.getElementById("bgMusic");
let isPlaying = false;

function toggleMusic() {
  if (!isPlaying) {
    music.play();
    isPlaying = true;
  } else {
    music.pause();
    isPlaying = false;
  }
}