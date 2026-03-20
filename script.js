const musicBtn = document.getElementById("musicBtn");
const audio = new Audio("assets/music.mp3");
let playing = false;
let startedFrom71 = false;

audio.preload = "metadata";

async function startMusicFromNeededTime() {
  if (!startedFrom71) {
    if (audio.readyState >= 1) {
      audio.currentTime = 71;
      startedFrom71 = true;
    } else {
      await new Promise((resolve) => {
        audio.addEventListener(
          "loadedmetadata",
          () => {
            audio.currentTime = 71;
            startedFrom71 = true;
            resolve();
          },
          { once: true }
        );
      });
    }
  }

  await audio.play();
}

if (musicBtn) {
  musicBtn.addEventListener("click", () => {
    if (!playing) {
      startMusicFromNeededTime()
        .then(() => {
          playing = true;
          musicBtn.classList.add("playing");
          musicBtn.setAttribute("aria-pressed", "true");
        })
        .catch((error) => {
          console.error("Музыка қосылмады:", error);
        });
    } else {
      audio.pause();
      playing = false;
      musicBtn.classList.remove("playing");
      musicBtn.setAttribute("aria-pressed", "false");
    }
  });

  audio.addEventListener("pause", () => {
    playing = false;
    musicBtn.classList.remove("playing");
    musicBtn.setAttribute("aria-pressed", "false");
  });

  audio.addEventListener("play", () => {
    playing = true;
    musicBtn.classList.add("playing");
    musicBtn.setAttribute("aria-pressed", "true");
  });
}

function getTimeLeft() {
  const now = new Date();
  const target = new Date("2026-04-26T18:00:00+05:00");
  const diff = Math.max(target - now, 0);

  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000)
  };
}

const countdownMap = {
  days: document.getElementById("days"),
  hours: document.getElementById("hours"),
  minutes: document.getElementById("minutes"),
  seconds: document.getElementById("seconds")
};

let prevSecond = null;

function updateCountdown() {
  const timeLeft = getTimeLeft();

  Object.entries(countdownMap).forEach(([key, node]) => {
    if (!node) return;
    node.textContent = String(timeLeft[key]);

    if (key === "seconds" && prevSecond !== timeLeft.seconds) {
      node.classList.remove("flip");
      void node.offsetWidth;
      node.classList.add("flip");
    }
  });

  prevSecond = timeLeft.seconds;
}

updateCountdown();
setInterval(updateCountdown, 1000);

const addToCalendarBtn = document.getElementById("addToCalendar");

if (addToCalendarBtn) {
  addToCalendarBtn.addEventListener("click", () => {
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

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
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

const revealItems = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target);
      });
    },
    {
      threshold: 0.16
    }
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}
