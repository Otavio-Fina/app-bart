import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { BartService } from '../../services/bart.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './settings.component.html',
})
export class SettingsComponent {
  private fb = inject(FormBuilder);
  private bart = inject(BartService);

  saved = signal(false);

  form = this.fb.nonNullable.group({
    totalBalloons: [this.bart.totalBalloons(), [Validators.required, Validators.min(1)]],
    maxPumpThreshold: [this.bart.maxPumpThreshold(), [Validators.required, Validators.min(1)]],
    centsPerPump: [this.bart.centsPerPump() / 100, [Validators.required, Validators.min(0.01)]],
  });

  save() {
    if (this.form.invalid) return;
    const formValue = this.form.getRawValue();
    const cfg = {
      totalBalloons: formValue.totalBalloons,
      maxPumpThreshold: formValue.maxPumpThreshold,
      centsPerPump: Math.round(formValue.centsPerPump * 100)
    };
    this.bart.setConfig(cfg);
    this.saved.set(true);
    setTimeout(() => this.saved.set(false), 3000);
  }
}
