import { Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { TestComponent } from './pages/test/test.component';
import { ResultsComponent } from './pages/results/results.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { DemoComponent } from './pages/demo/demo.component';
import { DemoResultsComponent } from './pages/demo-results/demo-results.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'test', component: TestComponent },
  { path: 'results', component: ResultsComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'demo', component: DemoComponent },
  { path: 'demo-results', component: DemoResultsComponent },
  { path: '**', redirectTo: '' },
];
