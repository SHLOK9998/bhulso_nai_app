const timers = [];
function clearScheduled() {
  timers.forEach((t) => clearTimeout(t));
  timers.length = 0;
}
async function ensurePermission() {
  if (typeof Notification === "undefined") return "denied";
  if (Notification.permission === "default") {
    return await Notification.requestPermission();
  }
  return Notification.permission;
}
function playChime() {
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const notes = [523.25, 659.25, 783.99, 1046.5];
    const start = ctx.currentTime;
    notes.forEach((freq, i) => {
      const t0 = start + i * 0.45;
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "sine";
      o.frequency.value = freq;
      g.gain.setValueAtTime(1e-4, t0);
      g.gain.exponentialRampToValueAtTime(0.18, t0 + 0.04);
      g.gain.exponentialRampToValueAtTime(1e-4, t0 + 1.4);
      o.connect(g).connect(ctx.destination);
      o.start(t0);
      o.stop(t0 + 1.45);
    });
    const tail = ctx.createOscillator();
    const tg = ctx.createGain();
    tail.type = "sine";
    tail.frequency.value = 523.25;
    tg.gain.setValueAtTime(1e-4, start + 1.9);
    tg.gain.exponentialRampToValueAtTime(0.12, start + 2);
    tg.gain.exponentialRampToValueAtTime(1e-4, start + 3.4);
    tail.connect(tg).connect(ctx.destination);
    tail.start(start + 1.9);
    tail.stop(start + 3.5);
    setTimeout(() => ctx.close().catch(() => {
    }), 4e3);
  } catch {
  }
}
function loadPrefs() {
  try {
    return { sound: true, leadMinutes: 0, ...JSON.parse(localStorage.getItem("notif-prefs") ?? "{}") };
  } catch {
    return { sound: true, leadMinutes: 0 };
  }
}
function scheduleAll(items) {
  clearScheduled();
  if (typeof Notification === "undefined" || Notification.permission !== "granted") return;
  if (localStorage.getItem("alarms-enabled") === "false") return;
  const prefs = loadPrefs();
  const now = /* @__PURE__ */ new Date();
  items.forEach((it) => {
    const [h, m] = it.time.split(":").map(Number);
    if (Number.isNaN(h) || Number.isNaN(m)) return;
    const target = /* @__PURE__ */ new Date();
    target.setHours(h, m, 0, 0);
    const delay = target.getTime() - now.getTime() - prefs.leadMinutes * 60 * 1e3;
    if (delay <= 0 || delay > 24 * 60 * 60 * 1e3) return;
    const id = window.setTimeout(() => {
      try {
        const n = new Notification("HealthMate AI", {
          body: `Time to take ${it.name} (${it.time})`,
          icon: "/favicon.ico",
          tag: `med-${it.id}-${it.time}`,
          requireInteraction: true
        });
        if (prefs.sound) playChime();
        n.onclick = () => {
          window.focus();
          n.close();
        };
      } catch {
      }
    }, delay);
    timers.push(id);
  });
}
export {
  clearScheduled as c,
  ensurePermission as e,
  playChime as p,
  scheduleAll as s
};
