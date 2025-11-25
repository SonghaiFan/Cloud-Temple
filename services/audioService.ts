import { SoundType } from '../types';

// Simple synth to generate temple-like sounds without external mp3 dependencies
class AudioService {
  private ctx: AudioContext | null = null;

  private getContext(): AudioContext {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return this.ctx;
  }

  public play(type: SoundType) {
    try {
      const ctx = this.getContext();
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const t = ctx.currentTime;

      if (type === SoundType.WOODFISH) {
        // Wood block sound: short, dry, resonant
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.frequency.setValueAtTime(800, t);
        osc.frequency.exponentialRampToValueAtTime(400, t + 0.1);
        
        gain.gain.setValueAtTime(1, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.15);

        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start(t);
        osc.stop(t + 0.15);
      } 
      else if (type === SoundType.BELL) {
        // Large Bronze Bell: Deep, long sustain, rich harmonics
        this.createBellTone(ctx, 150, 4, 0.6); // Fundamental
        this.createBellTone(ctx, 150 * 1.5, 3, 0.3); // Fifth
        this.createBellTone(ctx, 150 * 3.2, 2, 0.1); // Overtone
      }
      else if (type === SoundType.BOWL) {
        // Singing Bowl: High pitch, very clean, long sustain
        this.createBellTone(ctx, 520, 6, 0.4);
        this.createBellTone(ctx, 524, 5, 0.2); // Beating frequency
      }

    } catch (e) {
      console.error("Audio playback failed", e);
    }
  }

  private createBellTone(ctx: AudioContext, freq: number, duration: number, volume: number) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.05); // Attack
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration); // Decay

    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  }
}

export const audioService = new AudioService();
