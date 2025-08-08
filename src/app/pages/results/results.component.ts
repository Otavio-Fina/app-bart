import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BartService } from '../../services/bart.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './results.component.html',
  styleUrl: './results.component.css',
})
export class ResultsComponent {
  constructor(public bart: BartService) {}

  // Computed statistics
  totalBalloons = computed(() => this.bart.balloonResults().length);
  totalPumps = computed(() => this.bart.balloonResults().reduce((sum, b) => sum + b.pumps, 0));
  averagePumps = computed(() => this.totalBalloons() > 0 ? this.totalPumps() / this.totalBalloons() : 0);
  explodedBalloons = computed(() => this.bart.balloonResults().filter(b => b.exploded).length);
  collectedBalloons = computed(() => this.bart.balloonResults().filter(b => b.collected).length);
  totalEarnings = computed(() => this.bart.balloonResults().reduce((sum, b) => sum + b.points, 0));
  maxPumpsInBalloon = computed(() => Math.max(...this.bart.balloonResults().map(b => b.pumps), 0));
  minPumpsInBalloon = computed(() => Math.min(...this.bart.balloonResults().map(b => b.pumps), 0));

  restart() {
    this.bart.restart();
  }
}
