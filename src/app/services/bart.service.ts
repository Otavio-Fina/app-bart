import { Injectable, signal, computed } from '@angular/core';

/* Google Analytics typings so TypeScript recognizes the global gtag function */
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}


interface Config {
  totalBalloons: number;
  maxPumpThreshold: number;
  centsPerPump: number;
}

interface BalloonState {
  index: number; // 0-based current balloon index
  pumpCount: number;
  explosionThreshold: number; // random threshold at which balloon pops
  pointsInBalloon: number; // current points accumulated for this balloon
  exploded: boolean;
  pumpTimestamps: number[]; // array of timestamps for each pump
  startTime: number; // timestamp when balloon attempt started
}

interface BalloonResult {
  balloonIndex: number;
  pumps: number;
  collected: boolean;
  points: number;
  exploded: boolean;
  timeMs: number; // time in milliseconds between last pump and decision
  totalTimeMs: number; // total time from attempt start to decision
}

@Injectable({ providedIn: 'root' })
export class BartService {
  // configuration signals (could be exposed to admin page)
  totalBalloons = signal<number>(27);
  maxPumpThreshold = signal<number>(128);

  private readonly STORAGE_KEY = 'bart_config';
  private popSound: HTMLAudioElement | null = null;
  private bankSound: HTMLAudioElement | null = null;

  // cents per pump
  centsPerPump = signal<number>(10);

  private totalPointsSig = signal<number>(0);
  totalPoints = computed(() => this.totalPointsSig());

  // Statistics tracking
  private balloonResultsSig = signal<BalloonResult[]>([]);
  balloonResults = computed(() => this.balloonResultsSig());

  userID = 'sessao_' + Date.now(); // Exemplo simples, use algo mais robusto se precisar.

  // current balloon state
  constructor() {
    // load persisted config
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) {
      try {
        const cfg: Partial<Config> = JSON.parse(saved);
        if (cfg.totalBalloons) this.totalBalloons.set(cfg.totalBalloons);
        if (cfg.maxPumpThreshold) this.maxPumpThreshold.set(cfg.maxPumpThreshold);
        if (cfg.centsPerPump) this.centsPerPump.set(cfg.centsPerPump);
      } catch {
        /* ignore */
      }

      
    }

    // Initialize pop sound
    this.popSound = new Audio('/pop.mp3');
    this.popSound.volume = 0.5;

    // Initialize bank sound
    this.bankSound = new Audio('/bank.mp3');
    this.bankSound.volume = 0.5;

    window.gtag('set', 'user_properties', {
      user_id: this.userID
  });
  }

  private balloonSig = signal<BalloonState>(this.createNewBalloon(0));
  balloon = computed(() => this.balloonSig());

  private createNewBalloon(index: number): BalloonState {
    const threshold = Math.floor(Math.random() * this.maxPumpThreshold()) + 1; // 1..max
    return {
      index,
      pumpCount: 0,
      explosionThreshold: threshold,
      pointsInBalloon: 0,
      exploded: false,
      pumpTimestamps: [],
      startTime: Date.now(), // Initialize startTime
    };
  }

  private shouldExplode(pumpCount: number): boolean {
    // Progressão: 1ª tentativa = 1/128, 2ª = 1/127, 3ª = 1/126, etc.
    const remainingThreshold = this.maxPumpThreshold() - pumpCount;
    if (remainingThreshold <= 0) return true; // Sempre explode se não há mais "espaço"
    
    const randomValue = Math.floor(Math.random() * remainingThreshold) + 1;
    return randomValue === 1; // Explode se o valor aleatório for 1
  }

  inflate(): void {
    const b = { ...this.balloonSig() };
    if (b.exploded) return;

    b.pumpCount += 1;
    b.pumpTimestamps.push(Date.now()); // Add timestamp for the current pump
    b.pointsInBalloon += this.centsPerPump();

    if (this.shouldExplode(b.pumpCount)) {
      // explode
      b.exploded = true;
      b.pointsInBalloon = 0;
      
      // Record balloon result
      const result: BalloonResult = {
        balloonIndex: b.index,
        pumps: b.pumpCount,
        collected: false,
        points: 0,
        exploded: true,
        timeMs: b.pumpCount > 0 ? Date.now() - b.pumpTimestamps[b.pumpTimestamps.length - 1] : Date.now() - b.startTime, // Time since last pump or start
        totalTimeMs: Date.now() - b.startTime, // Total time from attempt start
      };
      this.balloonResultsSig.set([...this.balloonResultsSig(), result]);
      
      // Play pop sound
      if (this.popSound) {
        this.popSound.currentTime = 0; // Reset to beginning
        this.popSound.play().catch(err => console.log('Audio play failed:', err));
      }
      
      // Disparar evento com informações de tempo
      this.dispararEventoBalaoEstourou('balloon_exploded', {
        balloonIndex: b.index,
        pumps: b.pumpCount,
        timeMs: result.timeMs,
        totalTimeMs: result.totalTimeMs
      });
    }
    this.balloonSig.set(b);
  }

  collect(): void {
    const b = this.balloonSig();
    if (b.exploded) {
      this.nextBalloon();
      return;
    }
    
    // Play bank sound when collecting points
    if (this.bankSound) {
      this.bankSound.currentTime = 0.5; // Reset to beginning
      this.bankSound.play().catch(err => console.log('Bank audio play failed:', err));
    }
    
    // Record balloon result
    const result: BalloonResult = {
      balloonIndex: b.index,
      pumps: b.pumpCount,
      collected: true,
      points: b.pointsInBalloon,
      exploded: false,
      timeMs: b.pumpCount > 0 ? Date.now() - b.pumpTimestamps[b.pumpTimestamps.length - 1] : Date.now() - b.startTime, // Time since last pump or start
      totalTimeMs: Date.now() - b.startTime, // Total time from attempt start
    };
    this.balloonResultsSig.set([...this.balloonResultsSig(), result]);
    
    // Disparar evento com informações de tempo
    this.dispararEventoPontosColetados('points_collected', {
      balloonIndex: b.index,
      pumps: b.pumpCount,
      points: b.pointsInBalloon,
      timeMs: result.timeMs,
      totalTimeMs: result.totalTimeMs
    });
    
    this.totalPointsSig.set(this.totalPointsSig() + b.pointsInBalloon);
    this.nextBalloon();
  }

  private nextBalloon(): void {
    const nextIndex = this.balloonSig().index + 1;
    if (nextIndex >= this.totalBalloons()) {
      // finished all balloons, navigation should handle redirection
      return;
    }
    this.balloonSig.set(this.createNewBalloon(nextIndex));
  }

  setConfig(cfg: Config) {
    this.totalBalloons.set(cfg.totalBalloons);
    this.maxPumpThreshold.set(cfg.maxPumpThreshold);
    this.centsPerPump.set(cfg.centsPerPump);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cfg));
  }

  restart(): void {
    this.totalPointsSig.set(0);
    this.balloonResultsSig.set([]);
    this.balloonSig.set(this.createNewBalloon(0));
  }

  /**
   * Dispara um evento personalizado do tipo "balão estourou".
   * O nome do evento e o payload são definidos pelo chamador.
   */
  dispararEventoBalaoEstourou(eventName: string, payload: Record<string, any> = {}): void {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', eventName, payload);
    }
  }

  /**
   * Dispara um evento personalizado do tipo "pontos coletados".
   * O nome do evento e o payload são definidos pelo chamador.
   */
  dispararEventoPontosColetados(eventName: string, payload: Record<string, any> = {}): void {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', eventName, payload);
    }
  }
}

