export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export enum SoundType {
  BELL = 'BELL',
  WOODFISH = 'WOODFISH',
  BOWL = 'BOWL'
}

export interface PrayerState {
  incenseLit: boolean;
  candlesLit: boolean;
  meritCount: number;
  lastPrayer: string | null;
}

declare global {
  interface AIStudio {
    hasSelectedApiKey(): Promise<boolean>;
    openSelectKey(): Promise<void>;
  }

  interface Window {
    aistudio?: AIStudio;
  }
}