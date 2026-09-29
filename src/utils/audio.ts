// Web Audio API lightweight sound synthesizer
let audioCtx: AudioContext | null = null;
let continuousOsc: OscillatorNode | null = null;
let continuousGain: GainNode | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playSuccessChime() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(523.25, now); // C5
  osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.08); // E5
  osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.16); // G5

  gain.gain.setValueAtTime(0.15, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.45);
}

export function playErrorChime() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'triangle';
  osc.frequency.setValueAtTime(220, now); // A3
  osc.frequency.linearRampToValueAtTime(174.61, now + 0.2); // F3

  gain.gain.setValueAtTime(0.15, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.38);
}

export function startWaveTone(frequency: number, amplitude: number) {
  const ctx = getAudioContext();
  if (!ctx) return;

  // Scale frequency into audible range (e.g. base 110Hz to 880Hz)
  const audibleFreq = Math.max(120, Math.min(880, 110 + frequency * 150));
  const normalizedGain = Math.max(0.02, Math.min(0.2, (amplitude / 3) * 0.18));

  if (!continuousOsc) {
    continuousOsc = ctx.createOscillator();
    continuousGain = ctx.createGain();

    continuousOsc.type = 'sine';
    continuousOsc.frequency.setValueAtTime(audibleFreq, ctx.currentTime);
    continuousGain.gain.setValueAtTime(normalizedGain, ctx.currentTime);

    continuousOsc.connect(continuousGain);
    continuousGain.connect(ctx.destination);
    continuousOsc.start();
  } else if (continuousGain) {
    continuousOsc.frequency.setTargetAtTime(audibleFreq, ctx.currentTime, 0.05);
    continuousGain.gain.setTargetAtTime(normalizedGain, ctx.currentTime, 0.05);
  }
}

export function stopWaveTone() {
  if (continuousOsc) {
    try {
      continuousOsc.stop();
      continuousOsc.disconnect();
    } catch {
      // already stopped
    }
    continuousOsc = null;
    continuousGain = null;
  }
}
