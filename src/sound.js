let context;
let enabled = false;
let timer;
let step = 0;
// Original short pentatonic chiptune. No third-party audio assets.
const melody = [
  523.25, 0, 659.25, 783.99, 659.25, 0, 587.33, 0, 523.25, 587.33, 659.25, 0,
  440, 0, 392, 0, 523.25, 659.25, 783.99, 0, 880, 783.99, 659.25, 0, 587.33, 0,
  523.25, 0, 440, 392, 523.25, 0,
];
export function playNote(frequency, duration = 0.13, volume = 0.025) {
  if (!enabled || document.hidden) return;
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = "triangle";
  oscillator.frequency.value = frequency;
  gain.gain.setValueAtTime(0, context.currentTime);
  gain.gain.linearRampToValueAtTime(volume, context.currentTime + 0.012);
  gain.gain.exponentialRampToValueAtTime(
    0.0001,
    context.currentTime + duration,
  );
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start();
  oscillator.stop(context.currentTime + duration);
}
export async function toggleMusic() {
  if (!context) context = new AudioContext();
  await context.resume();
  enabled = !enabled;
  clearInterval(timer);
  if (enabled) {
    playNote(523.25);
    timer = setInterval(() => {
      const note = melody[step++ % melody.length];
      if (note) playNote(note, 0.29, 0.016);
    }, 340);
  }
  return enabled;
}
