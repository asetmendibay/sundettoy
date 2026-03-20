const eventDate = new Date("2026-04-26T18:00:00");
const countdownIds = ["days", "hours", "minutes", "seconds"];

function updateCountdown() {
  const now = new Date();
  const diff = eventDate.getTime() - now.getTime();

  if (diff <= 0) {
    countdownIds.forEach((id) => {
      const node = document.getElementById(id);
      if (node) node.textContent = "0";
    });
    return;
  }

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const values = { days, hours, minutes, seconds };
  countdownIds.forEach((id) => {
    const node = document.getElementById(id);
    if (node) node.textContent = String(values[id]);
  });
}

const countdownTimer = setInterval(() => {
  const now = new Date();
  if (eventDate.getTime() - now.getTime() <= 0) {
    clearInterval(countdownTimer);
  }
  updateCountdown();
}, 1000);
updateCountdown();

const musicButton = document.getElementById("musicToggle");
const bgMusic = document.getElementById("bgMusic");
let hasMusicStarted = false;

if (musicButton && bgMusic) {
  musicButton.addEventListener("click", async () => {
    if (bgMusic.paused) {
      if (!hasMusicStarted) {
        bgMusic.currentTime = 71;
        hasMusicStarted = true;
      }
      try {
        await bgMusic.play();
        musicButton.classList.add("is-playing");
        musicButton.setAttribute("aria-pressed", "true");
      } catch (error) {
        console.error("Музыка ойнатылмады:", error);
      }
      return;
    }

    bgMusic.pause();
    musicButton.classList.remove("is-playing");
    musicButton.setAttribute("aria-pressed", "false");
  });

  bgMusic.addEventListener("pause", () => {
    musicButton.classList.remove("is-playing");
    musicButton.setAttribute("aria-pressed", "false");
  });

  bgMusic.addEventListener("play", () => {
    musicButton.classList.add("is-playing");
    musicButton.setAttribute("aria-pressed", "true");
  });
}

const calendarButton = document.getElementById("addToCalendar");

if (calendarButton) {
  calendarButton.addEventListener("click", () => {
    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "BEGIN:VEVENT",
      "SUMMARY:Сүндет той — Нұрислам және Дінмұхамед",
      "DTSTART:20260426T180000",
      "DTEND:20260426T230000",
      "LOCATION:Qobyz Ballroom, Тараз",
      "DESCRIPTION:Сүндет той мерекесіне шақырамыз!",
      "END:VEVENT",
      "END:VCALENDAR"
    ].join("\r\n");

    const blob = new Blob([icsContent], {
      type: "text/calendar;charset=utf-8"
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "sundettoy.ics";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  });
}

const revealNodes = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.15 }
  );

  revealNodes.forEach((node) => observer.observe(node));
} else {
  revealNodes.forEach((node) => node.classList.add("visible"));
}
