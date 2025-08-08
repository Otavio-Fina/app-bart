import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BartService } from '../../services/bart.service';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-demo',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './demo.component.html',
  styleUrl: './demo.component.css',
})
export class DemoComponent {
  constructor(public bart: BartService, private router: Router) {
    // Reset game state when entering demo
    this.bart.restart();
  }

  private checkGameEnd() {
    if (this.bart.balloon().index >= this.bart.totalBalloons()) {
      // Don't save score for demo
      this.router.navigateByUrl('/demo-results');
    }
  }

  inflate() {
    this.bart.inflate();
    this.checkGameEnd();
  }

  collect() {
    this.bart.collect();
    this.checkGameEnd();
  }

  showResults() {
    this.router.navigateByUrl('/demo-results');
  }
} 