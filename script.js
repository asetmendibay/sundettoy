(() => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const revealNodes = document.querySelectorAll('.reveal');
  const heroEvents = document.querySelectorAll('.hero-event');

  if (!prefersReducedMotion) {
    revealNodes.forEach((node, index) => {
      const delay = Math.min(index * 80, 420);
      node.style.transitionDelay = `${delay}ms`;
    });

    heroEvents.forEach((eventNode, index) => {
      eventNode.style.animationDelay = `${index * 0.85}s`;
    });
  }

  if (prefersReducedMotion) {
    revealNodes.forEach((node) => node.classList.add('is-visible'));
  } else {
    const observer = new IntersectionObserver(
      (entries, instance) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add('is-visible');
          instance.unobserve(entry.target);
        });
      },
      {
        threshold: 0.2,
        rootMargin: '0px 0px -10% 0px'
      }
    );

    revealNodes.forEach((node) => observer.observe(node));
  }

  const targetTs = new Date('2026-04-24T18:00:00+05:00').getTime();
  const dayEl = document.getElementById('days');
  const hourEl = document.getElementById('hours');
  const minuteEl = document.getElementById('minutes');
  const secondEl = document.getElementById('seconds');

  const pad = (num) => String(num).padStart(2, '0');

  const setTimerValue = (element, nextValue) => {
    if (!element) {
      return;
    }

    if (element.textContent === nextValue) {
      return;
    }

    element.textContent = nextValue;

    if (prefersReducedMotion) {
      return;
    }

    element.classList.remove('tick');
    void element.offsetWidth;
    element.classList.add('tick');
  };

  const tick = () => {
    const diff = targetTs - Date.now();

    if (diff <= 0) {
      setTimerValue(dayEl, '00');
      setTimerValue(hourEl, '00');
      setTimerValue(minuteEl, '00');
      setTimerValue(secondEl, '00');
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    setTimerValue(dayEl, pad(days));
    setTimerValue(hourEl, pad(hours));
    setTimerValue(minuteEl, pad(minutes));
    setTimerValue(secondEl, pad(seconds));
  };

  tick();
  window.setInterval(tick, 1000);

  const musicBtn = document.getElementById('musicToggle');
  const music = document.getElementById('bgMusic');
  const START_SECOND = 71;
  let isOffsetApplied = false;

  const updateMusicUI = () => {
    const playing = !music.paused;
    musicBtn.classList.toggle('playing', playing);
    musicBtn.setAttribute('aria-pressed', String(playing));
  };

  const applyOffsetOnce = () => {
    if (isOffsetApplied) {
      return;
    }

    if (Number.isFinite(music.duration) && music.duration > START_SECOND) {
      music.currentTime = START_SECOND;
    } else {
      music.currentTime = 0;
    }

    isOffsetApplied = true;
  };

  musicBtn.addEventListener('click', async () => {
    if (music.paused) {
      applyOffsetOnce();

      try {
        await music.play();
      } catch (_error) {
        return;
      }
    } else {
      music.pause();
    }

    updateMusicUI();
  });

  music.addEventListener('loadedmetadata', applyOffsetOnce);
  music.addEventListener('play', updateMusicUI);
  music.addEventListener('pause', updateMusicUI);

  updateMusicUI();
})();
