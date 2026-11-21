let context = null;
let enabled = true;

function audioContext() {
  if (!enabled) return null;
  if (context === null) {
    const AudioContext = window.AudioContext ?? window.webkitAudioContext;
    if (!AudioContext) return null;
    context = new AudioContext();
  }
  if (context.state === 'suspended') context.resume();
  return context;
}

function tone(frequency, at, duration, gain, type = 'sine') {
  const ctx = audioContext();
  if (!ctx) return;
  const oscillator = ctx.createOscillator();
  const volume = ctx.createGain();
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, at);
  volume.gain.setValueAtTime(0.0001, at);
  volume.gain.exponentialRampToValueAtTime(gain, at + 0.012);
  volume.gain.exponentialRampToValueAtTime(0.0001, at + duration);
  oscillator.connect(volume).connect(ctx.destination);
  oscillator.start(at);
  oscillator.stop(at + duration + 0.02);
}

export function setSound(next) {
  enabled = Boolean(next);
  return enabled;
}

export function soundEnabled() {
  return enabled;
}

export function playFound(streak) {
  const ctx = audioContext();
  if (!ctx) return;
  const root = 392 + Math.min(streak, 4) * 28;
  tone(root, ctx.currentTime, 0.16, 0.055, 'triangle');
  tone(root * 1.5, ctx.currentTime + 0.075, 0.22, 0.04, 'sine');
}

export function playMiss() {
  const ctx = audioContext();
  if (!ctx) return;
  tone(118, ctx.currentTime, 0.13, 0.038, 'sawtooth');
  tone(94, ctx.currentTime + 0.06, 0.15, 0.025, 'square');
}

export function playHint() {
  const ctx = audioContext();
  if (!ctx) return;
  tone(523.25, ctx.currentTime, 0.18, 0.035, 'sine');
  tone(659.25, ctx.currentTime + 0.11, 0.24, 0.03, 'sine');
}

export function playComplete() {
  const ctx = audioContext();
  if (!ctx) return;
  [261.63, 329.63, 392, 523.25].forEach((frequency, index) => {
    tone(frequency, ctx.currentTime + index * 0.105, 0.42, 0.048, index < 3 ? 'triangle' : 'sine');
  });
}
