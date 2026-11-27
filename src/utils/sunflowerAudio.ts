import { MusicTrack, SUNFLOWER_CONTENT } from '../config/sunflowerContent';

export type AmbienceLayer = 'none' | 'breeze' | 'rain' | 'dusk' | 'sunrise';

class SunflowerAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private ambienceGain: GainNode | null = null;
  private melodyTimer: number | null = null;
  private padOscillators: OscillatorNode[] = [];
  private ambienceSource: AudioBufferSourceNode | null = null;

  private isPlaying = false;
  private isMuted = false;
  private volume = 0.55;
  private softDucked = false;
  private currentTrack: MusicTrack = SUNFLOWER_CONTENT.musicTracks[0];
  private currentAmbience: AmbienceLayer = 'none';
  private sunlightMode: 'Moonlight' | 'Golden Hour' | 'Sunrise' = 'Golden Hour';
  private stepIndex = 0;

  private ensureContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return null;

    if (!this.ctx) {
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.musicGain = this.ctx.createGain();
      this.ambienceGain = this.ctx.createGain();

      this.musicGain.connect(this.masterGain);
      this.ambienceGain.connect(this.masterGain);
      this.masterGain.connect(this.ctx.destination);
      this.applyGainLevels();
    }

    if (this.ctx.state === 'suspended') {
      void this.ctx.resume().catch(() => {});
    }

    return this.ctx;
  }

  private applyGainLevels(): void {
    if (!this.ctx || !this.masterGain || !this.musicGain || !this.ambienceGain) return;
    const now = this.ctx.currentTime;
    const targetMaster = this.isMuted ? 0 : this.volume * (this.softDucked ? 0.38 : 1);
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.setTargetAtTime(targetMaster, now, 0.25);
    this.musicGain.gain.setTargetAtTime(0.6, now, 0.2);
    this.ambienceGain.gain.setTargetAtTime(0.22, now, 0.2);
  }

  public setMuted(muted: boolean): void {
    this.isMuted = muted;
    this.applyGainLevels();
  }

  public setVolume(vol: number): void {
    this.volume = Math.max(0, Math.min(1, vol));
    this.applyGainLevels();
  }

  public setSoftDuck(soft: boolean): void {
    this.softDucked = soft;
    this.applyGainLevels();
  }

  public setSunlightTone(mode: 'Moonlight' | 'Golden Hour' | 'Sunrise'): void {
    this.sunlightMode = mode;
  }

  public playTrack(track: MusicTrack): void {
    this.currentTrack = track;
    this.stepIndex = 0;
    this.stopMusicNodes();

    const ctx = this.ensureContext();
    if (!ctx || !this.musicGain) return;

    this.isPlaying = true;
    this.startPad(ctx, track);

    const intervalMs = Math.round((60 / track.tempoBpm) * 1000);
    this.triggerMelodyNote(ctx, track);
    this.melodyTimer = window.setInterval(() => {
      if (!this.isPlaying || !this.ctx) return;
      this.triggerMelodyNote(this.ctx, this.currentTrack);
    }, intervalMs);
  }

  public pause(): void {
    this.isPlaying = false;
    this.stopMusicNodes();
  }

  public resume(): void {
    if (!this.isPlaying) {
      this.playTrack(this.currentTrack);
    }
  }

  public setAmbience(layer: AmbienceLayer): void {
    this.currentAmbience = layer;
    this.stopAmbience();
    if (layer === 'none') return;

    const ctx = this.ensureContext();
    if (!ctx || !this.ambienceGain) return;

    const bufferSize = ctx.sampleRate * 3;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    // Pink-ish soft noise tailored per nature ambience
    let b0 = 0;
    let b1 = 0;
    let b2 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.997 * b0 + white * 0.029;
      b1 = 0.985 * b1 + white * 0.032;
      b2 = 0.95 * b2 + white * 0.048;
      data[i] = (b0 + b1 + b2) * (layer === 'rain' ? 0.16 : layer === 'sunrise' ? 0.075 : 0.09);
    }

    const src = ctx.createBufferSource();
    src.buffer = buffer;
    src.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = layer === 'rain' ? 'bandpass' : 'lowpass';
    filter.frequency.value =
      layer === 'rain'
        ? 1100
        : layer === 'dusk'
          ? 380
          : layer === 'sunrise'
            ? 920
            : 620;
    filter.Q.value = layer === 'rain' ? 0.7 : 0.4;

    src.connect(filter);
    filter.connect(this.ambienceGain);
    src.start();
    this.ambienceSource = src;
  }

  public playSfx(kind: 'petal' | 'water' | 'sun' | 'bloom' | 'letter' | 'sparkle'): void {
    if (this.isMuted) return;
    const ctx = this.ensureContext();
    if (!ctx || !this.masterGain) return;

    const now = ctx.currentTime;
    const freqs =
      kind === 'bloom'
        ? [523.25, 659.25, 783.99, 1046.5]
        : kind === 'sparkle'
          ? [783.99, 987.77, 1174.66]
          : kind === 'water'
            ? [440, 587.33]
            : kind === 'sun'
              ? [523.25, 659.25]
              : kind === 'letter'
                ? [392, 493.88]
                : [659.25, 880];

    freqs.forEach((f, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = kind === 'water' ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(f, now + idx * 0.06);

      gain.gain.setValueAtTime(0.0001, now + idx * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.08, now + idx * 0.06 + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.06 + 0.55);

      osc.connect(gain);
      gain.connect(this.masterGain!);
      osc.start(now + idx * 0.06);
      osc.stop(now + idx * 0.06 + 0.6);
    });
  }

  private startPad(ctx: AudioContext, track: MusicTrack): void {
    if (!this.musicGain) return;
    const now = ctx.currentTime;
    track.padChord.forEach((freq) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = track.timbre === 'dream-pad' ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq * 0.5, now);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.028, now + 1.4);

      osc.connect(gain);
      gain.connect(this.musicGain!);
      osc.start(now);
      this.padOscillators.push(osc);
    });
  }

  private triggerMelodyNote(ctx: AudioContext, track: MusicTrack): void {
    if (!this.musicGain) return;
    const now = ctx.currentTime;
    const freq = track.notes[this.stepIndex % track.notes.length];
    this.stepIndex += 1;

    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc.type =
      track.timbre === 'music-box'
        ? 'sine'
        : track.timbre === 'acoustic-harp'
          ? 'triangle'
          : 'sine';
    osc.frequency.setValueAtTime(freq, now);

    const baseCutoff = track.timbre === 'rain-piano' ? 1200 : 2200;
    const sunlightMultiplier =
      this.sunlightMode === 'Moonlight' ? 0.58 : this.sunlightMode === 'Sunrise' ? 1.32 : 1;
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(baseCutoff * sunlightMultiplier, now);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.09, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.35);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.musicGain);

    osc.start(now);
    osc.stop(now + 1.4);
  }

  private stopMusicNodes(): void {
    if (this.melodyTimer !== null) {
      window.clearInterval(this.melodyTimer);
      this.melodyTimer = null;
    }
    this.padOscillators.forEach((osc) => {
      try {
        osc.stop();
        osc.disconnect();
      } catch {
        // Ignore stopped oscillator
      }
    });
    this.padOscillators = [];
  }

  private stopAmbience(): void {
    if (this.ambienceSource) {
      try {
        this.ambienceSource.stop();
        this.ambienceSource.disconnect();
      } catch {
        // Ignore
      }
      this.ambienceSource = null;
    }
  }

  public getState() {
    return {
      isPlaying: this.isPlaying,
      isMuted: this.isMuted,
      volume: this.volume,
      currentTrack: this.currentTrack,
      currentAmbience: this.currentAmbience,
    };
  }
}

export const sunflowerAudio = new SunflowerAudioEngine();
