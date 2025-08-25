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

  // Geração de CSV dos resultados do BART
  private gerarCSV(): string {
    const results = this.bart.balloonResults();

    // Cabeçalho
    let csv = 'Balao,Pumps,Coletado,Explodiu,Pontos (centavos),Pontos (USD)\n';

    // Linhas
    results.forEach((r) => {
      const usd = (r.points / 100).toFixed(2);
      csv += `${r.balloonIndex + 1},${r.pumps},${r.collected ? 'Sim' : 'Não'},${r.exploded ? 'Sim' : 'Não'},${r.points},$${usd}\n`;
    });


    return csv;
  }

  // Download direto do CSV
  baixarCSV(): void {
    try {
      const csvContent = this.gerarCSV();
      const csvBlob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const fileName = `resultados_bart_${new Date().toISOString().split('T')[0]}_${Date.now()}.csv`;

      const url = window.URL.createObjectURL(csvBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      console.log('CSV BART baixado com sucesso:', fileName);
    } catch (err) {
      console.error('Erro ao baixar CSV BART:', err);
    }
  }
}
