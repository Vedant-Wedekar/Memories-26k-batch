document.addEventListener('DOMContentLoaded', () => {
    const mainVideo = document.getElementById('main-video');
    const thumbnails = document.querySelectorAll('.thumbnail');

    thumbnails.forEach(thumb => {
        thumb.addEventListener('click', function() {
            // 1. Remove active class from all
            thumbnails.forEach(t => t.classList.remove('active'));
            
            // 2. Add active class to clicked
            this.classList.add('active');

            // 3. Smooth transition for video change
            mainVideo.style.opacity = '0';
            
            setTimeout(() => {
                const newSrc = this.getAttribute('data-video');
                mainVideo.src = newSrc;
                mainVideo.play();
                mainVideo.style.opacity = '1';
            }, 400); // Matches the CSS transition time
        });
    });
});