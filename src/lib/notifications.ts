// Browser notification helper. Foreground page only — true background push
// would need a service worker + VAPID server.

export type ScheduleItem = { id: string; name: string; time: string };

const timers: number[] = [];

export function clearScheduled() {
  timers.forEach((t) => clearTimeout(t));
  timers.length = 0;
}

export async function ensurePermission(): Promise<NotificationPermission> {
  if (typeof Notification === "undefined") return "denied";
  if (Notification.permission === "default") {
    return await Notification.requestPermission();
  }
  return Notification.permission;
}

// A pleasant ~3.5s chime: ascending arpeggio with a soft tail.
export function playChime() {
  try {
    const Ctx = (window.AudioContext || (window as any).webkitAudioContext);
    if (!Ctx) return;
    const ctx = new Ctx();
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5 E5 G5 C6
    const start = ctx.currentTime;
    notes.forEach((freq, i) => {
      const t0 = start + i * 0.45;
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "sine";
      o.frequency.value = freq;
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(0.18, t0 + 0.04);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + 1.4);
      o.connect(g).connect(ctx.destination);
      o.start(t0); o.stop(t0 + 1.45);
    });
    // gentle outro tone
    const tail = ctx.createOscillator();
    const tg = ctx.createGain();
    tail.type = "sine"; tail.frequency.value = 523.25;
    tg.gain.setValueAtTime(0.0001, start + 1.9);
    tg.gain.exponentialRampToValueAtTime(0.12, start + 2.0);
    tg.gain.exponentialRampToValueAtTime(0.0001, start + 3.4);
    tail.connect(tg).connect(ctx.destination);
    tail.start(start + 1.9); tail.stop(start + 3.5);
    setTimeout(() => ctx.close().catch(() => {}), 4000);
  } catch {}
}

type Prefs = { sound: boolean; leadMinutes: number };

function loadPrefs(): Prefs {
  try { return { sound: true, leadMinutes: 0, ...JSON.parse(localStorage.getItem("notif-prefs") ?? "{}") }; }
  catch { return { sound: true, leadMinutes: 0 }; }
}

export function scheduleAll(items: ScheduleItem[]) {
  clearScheduled();
  if (typeof Notification === "undefined" || Notification.permission !== "granted") return;
  if (localStorage.getItem("alarms-enabled") === "false") return;
  const prefs = loadPrefs();
  const now = new Date();
  items.forEach((it) => {
    const [h, m] = it.time.split(":").map(Number);
    if (Number.isNaN(h) || Number.isNaN(m)) return;
    const target = new Date();
    target.setHours(h, m, 0, 0);
    const delay = target.getTime() - now.getTime() - prefs.leadMinutes * 60 * 1000;
    if (delay <= 0 || delay > 24 * 60 * 60 * 1000) return;
    const id = window.setTimeout(() => {
      try {
        const n = new Notification("HealthMate AI", {
          body: `Time to take ${it.name} (${it.time})`,
          icon: "/favicon.ico",
          tag: `med-${it.id}-${it.time}`,
          requireInteraction: true,
        });
        if (prefs.sound) playChime();
        n.onclick = () => { window.focus(); n.close(); };
      } catch {}
    }, delay);
    timers.push(id);
  });
}
