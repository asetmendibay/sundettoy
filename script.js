(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const revealElements = document.querySelectorAll('[data-reveal]');
  if (reduceMotion) {
    revealElements.forEach((element) => element.classList.add('in-view'));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.14,
        rootMargin: '0px 0px -8% 0px'
      }
    );

    revealElements.forEach((element) => revealObserver.observe(element));
  }

  const targetTime = new Date('2026-04-26T18:00:00+05:00').getTime();
  const dayEl = document.getElementById('days');
  const hourEl = document.getElementById('hours');
  const minuteEl = document.getElementById('minutes');
  const secondEl = document.getElementById('seconds');

  const pad = (value) => String(value).padStart(2, '0');

  const updateCountdown = () => {
    const now = Date.now();
    const diff = targetTime - now;

    if (diff <= 0) {
      dayEl.textContent = '00';
      hourEl.textContent = '00';
      minuteEl.textContent = '00';
      secondEl.textContent = '00';
      return;
    }

    const day = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hour = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minute = Math.floor((diff / (1000 * 60)) % 60);
    const second = Math.floor((diff / 1000) % 60);

    dayEl.textContent = pad(day);
    hourEl.textContent = pad(hour);
    minuteEl.textContent = pad(minute);
    secondEl.textContent = pad(second);
  };

  updateCountdown();
  window.setInterval(updateCountdown, 1000);

  const musicButton = document.getElementById('musicToggle');
  const music = document.getElementById('bgMusic');
  const startAtSeconds = 71;
  let startApplied = false;

  const syncMusicState = () => {
    const playing = !music.paused;
    musicButton.classList.toggle('playing', playing);
    musicButton.setAttribute('aria-pressed', String(playing));
  };

  const applyStartOffsetOnce = () => {
    if (startApplied) {
      return;
    }

    if (Number.isFinite(music.duration) && music.duration > startAtSeconds) {
      music.currentTime = startAtSeconds;
    } else {
      music.currentTime = 0;
    }

    startApplied = true;
  };

  musicButton.addEventListener('click', async () => {
    if (music.paused) {
      applyStartOffsetOnce();

      try {
        await music.play();
      } catch (_error) {
        return;
      }
    } else {
      music.pause();
    }

    syncMusicState();
  });

  music.addEventListener('play', syncMusicState);
  music.addEventListener('pause', syncMusicState);
  music.addEventListener('loadedmetadata', () => {
    if (!startApplied) {
      applyStartOffsetOnce();
    }
  });

  syncMusicState();
})();
