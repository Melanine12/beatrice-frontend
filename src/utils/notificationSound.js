/**
 * Bip court pour alerter d’une notification temps réel (Web Audio API).
 * Tolère le blocage autoplay navigateur (premier geste utilisateur).
 */

let audioCtx = null;
let unlocked = false;

function getCtx() {
  if (typeof window === 'undefined') return null;
  const Ctx = window.AudioContext || window.webkitAudioContext;
  if (!Ctx) return null;
  if (!audioCtx) audioCtx = new Ctx();
  return audioCtx;
}

/** À appeler sur un geste utilisateur (click) pour autoriser le son. */
export function unlockNotificationSound() {
  const ctx = getCtx();
  if (!ctx) return;
  if (ctx.state === 'suspended') {
    ctx.resume().catch(() => {});
  }
  unlocked = true;
}

/**
 * Joue un bip d’alerte (deux tons).
 * @param {'info'|'success'|'warning'|'error'|'urgent'} [type]
 */
export function playNotificationBeep(type = 'info') {
  const ctx = getCtx();
  if (!ctx) return;

  const run = () => {
    const now = ctx.currentTime;
    const freq1 = type === 'urgent' || type === 'error' ? 880 : type === 'warning' ? 660 : 740;
    const freq2 = type === 'urgent' || type === 'error' ? 1040 : 920;

    const beep = (freq, start, dur, gain = 0.08) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, start);
      g.gain.setValueAtTime(0.0001, start);
      g.gain.exponentialRampToValueAtTime(gain, start + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
      osc.connect(g);
      g.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + dur + 0.02);
    };

    beep(freq1, now, 0.14, 0.09);
    beep(freq2, now + 0.16, 0.16, 0.07);
  };

  if (ctx.state === 'suspended') {
    ctx
      .resume()
      .then(() => {
        unlocked = true;
        run();
      })
      .catch(() => {});
    return;
  }
  unlocked = true;
  run();
}

export function isNotificationSoundUnlocked() {
  return unlocked;
}
