(() => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const revealItems = document.querySelectorAll('.reveal');

  if (prefersReducedMotion) {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.16,
        rootMargin: '0px 0px -8% 0px'
      }
    );

    revealItems.forEach((item) => revealObserver.observe(item));
  }

  const targetDate = new Date('2026-04-26T18:00:00+05:00').getTime();
  const dayEl = document.getElementById('days');
  const hourEl = document.getElementById('hours');
  const minuteEl = document.getElementById('minutes');
  const secondEl = document.getElementById('seconds');

  const toPadded = (value) => String(value).padStart(2, '0');

  const renderCountdown = () => {
    const diff = targetDate - Date.now();

    if (diff <= 0) {
      dayEl.textContent = '00';
      hourEl.textContent = '00';
      minuteEl.textContent = '00';
      secondEl.textContent = '00';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    dayEl.textContent = toPadded(days);
    hourEl.textContent = toPadded(hours);
    minuteEl.textContent = toPadded(minutes);
    secondEl.textContent = toPadded(seconds);
  };

  renderCountdown();
  window.setInterval(renderCountdown, 1000);

  const musicButton = document.getElementById('musicToggle');
  const backgroundMusic = document.getElementById('bgMusic');
  const musicStartSecond = 71;
  let startOffsetApplied = false;

  const setButtonState = () => {
    const isPlaying = !backgroundMusic.paused;
    musicButton.classList.toggle('playing', isPlaying);
    musicButton.setAttribute('aria-pressed', String(isPlaying));
  };

  const setStartOffset = () => {
    if (startOffsetApplied) {
      return;
    }

    if (Number.isFinite(backgroundMusic.duration) && backgroundMusic.duration > musicStartSecond) {
      backgroundMusic.currentTime = musicStartSecond;
    } else {
      backgroundMusic.currentTime = 0;
    }

    startOffsetApplied = true;
  };

  musicButton.addEventListener('click', async () => {
    if (backgroundMusic.paused) {
      setStartOffset();

      try {
        await backgroundMusic.play();
      } catch (_error) {
        return;
      }
    } else {
      backgroundMusic.pause();
    }

    setButtonState();
  });

  backgroundMusic.addEventListener('loadedmetadata', setStartOffset);
  backgroundMusic.addEventListener('play', setButtonState);
  backgroundMusic.addEventListener('pause', setButtonState);

  setButtonState();
})();
