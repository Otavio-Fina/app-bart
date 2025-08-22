import { Component, computed } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { IgtService, Tentativa } from '../../services/igt.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-igt-results',
  standalone: true,
  imports: [CommonModule, RouterLink, NgClass],
  templateUrl: './igt-results.component.html',
  styleUrl: './igt-results.component.css',
})
export class IgtResultsComponent {
  constructor(public igt: IgtService) {}

  // Computed statistics
  totalGanhos = computed(() => 
    this.igt.obterTentativas().reduce((sum, t) => sum + t.ganho, 0)
  );

  totalTaxas = computed(() => 
    this.igt.obterTentativas().reduce((sum, t) => sum + t.taxa, 0)
  );

  mediaTempoEscolha = computed(() => {
    const tentativas = this.igt.obterTentativas();
    if (tentativas.length === 0) return 0;
    const totalTempo = tentativas.reduce((sum, t) => sum + t.tempoEscolha, 0);
    return totalTempo / tentativas.length;
  });

  // Métodos para estatísticas
  getDeckCount(deck: string): number {
    return this.igt.obterTentativas().filter(t => t.deck === deck).length;
  }

  getDeckMaisEscolhido(): string {
    const tentativas = this.igt.obterTentativas();
    if (tentativas.length === 0) return 'N/A';

    const deckCounts = {
      'A': tentativas.filter(t => t.deck === 'A').length,
      'B': tentativas.filter(t => t.deck === 'B').length,
      'C': tentativas.filter(t => t.deck === 'C').length,
      'D': tentativas.filter(t => t.deck === 'D').length
    };

    const maxCount = Math.max(...Object.values(deckCounts));
    const decksMaisEscolhidos = Object.entries(deckCounts)
      .filter(([_, count]) => count === maxCount)
      .map(([deck, _]) => deck);

    if (decksMaisEscolhidos.length === 1) {
      return `Deck ${decksMaisEscolhidos[0]} (${maxCount}x)`;
    } else {
      return `Múltiplos (${maxCount}x cada)`;
    }
  }

  restart() {
    this.igt.resetarTeste();
  }
}
