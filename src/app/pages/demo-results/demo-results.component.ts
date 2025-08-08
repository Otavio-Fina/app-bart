import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BartService } from '../../services/bart.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-demo-results',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './demo-results.component.html',
  styleUrl: './demo-results.component.css',
})
export class DemoResultsComponent {
  constructor(public bart: BartService) {}

  restart() {
    this.bart.restart();
  }
} 