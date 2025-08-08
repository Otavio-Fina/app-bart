import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BartService } from '../../services/bart.service';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-test',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './test.component.html',
  styleUrl: './test.component.css',
})
export class TestComponent {
  constructor(public bart: BartService, private router: Router) {
    // Reset game state when entering official test
    this.bart.restart();
  }
  lastPump = false

  private checkGameEnd() {
    if (this.bart.balloon().index  >= this.bart.totalBalloons() || this.lastPump) {
      console.log('game ended');
      localStorage.setItem('bart_last_score', String(this.bart.totalPoints()));
      this.router.navigateByUrl('/results');
    }
    if (this.bart.balloon().index === this.bart.totalBalloons() - 1) {
      this.lastPump = true;
    }
  }

  inflate() {
    this.bart.inflate();
  }

  collect() {
    this.bart.collect();
    this.checkGameEnd();
  }
}
