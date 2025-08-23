import { Component, computed } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { IgtService, Tentativa } from '../../services/igt.service';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import emailjs from '@emailjs/browser';
import { EMAILJS_CONFIG } from '../../config/emailjs.config';

@Component({
  selector: 'app-igt-results',
  standalone: true,
  imports: [CommonModule, RouterLink, NgClass, FormsModule],
  templateUrl: './igt-results.component.html',
  styleUrl: './igt-results.component.css',
})
export class IgtResultsComponent {
  emailDestino: string = '';
  enviando: boolean = false;
  statusMensagem: string = '';
  statusSucesso: boolean = false;

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

  // Método para gerar CSV dos resultados
  private gerarCSV(): string {
    const tentativas = this.igt.obterTentativas();
    const saldoTotal = this.igt.obterSaldoTotal();
    const totalTentativas = this.igt.obterNumeroTentativas();
    
    // Cabeçalho do CSV
    let csv = 'Tentativa,Deck,Ganho,Taxa,Saldo Anterior,Saldo Novo,Tempo (ms),Timestamp\n';
    
    // Dados das tentativas
    tentativas.forEach((tentativa, index) => {
      const timestamp = tentativa.timestamp.toLocaleString('pt-BR');
      csv += `${index + 1},${tentativa.deck},${tentativa.ganho},${tentativa.taxa},${tentativa.saldoAnterior},${tentativa.saldoNovo},${tentativa.tempoEscolha},"${timestamp}"\n`;
    });
    
    // Adicionar estatísticas resumidas
    csv += '\nEstatísticas Resumidas\n';
    csv += `Saldo Final,${saldoTotal}\n`;
    csv += `Total de Tentativas,${totalTentativas}\n`;
    csv += `Total de Ganhos,${this.totalGanhos()}\n`;
    csv += `Total de Taxas,${this.totalTaxas()}\n`;
    csv += `Média de Tempo por Escolha,${this.mediaTempoEscolha()}ms\n`;
    csv += `Deck Mais Escolhido,${this.getDeckMaisEscolhido()}\n`;
    
    return csv;
  }

  // Método para enviar resultados por email
  async enviarResultadosPorEmail(): Promise<void> {
    if (!this.emailDestino) {
      this.mostrarStatus('Por favor, insira um email válido.', false);
      return;
    }

    this.enviando = true;
    this.limparStatus();

    try {
      // Gerar CSV
      const csvContent = this.gerarCSV();
      
      // Criar arquivo CSV com nome específico
      const csvBlob = new Blob([csvContent], { 
        type: 'text/csv;charset=utf-8;' 
      });
      
      // Nome do arquivo com timestamp
      const fileName = `resultados_igt_${new Date().toISOString().split('T')[0]}_${Date.now()}.csv`;
      
      // Converter para base64 para envio via EmailJS
      const reader = new FileReader();
      
      reader.onload = async () => {
        try {
          // Extrair apenas o conteúdo base64 (remover data:application/octet-stream;base64,)
          const base64Content = (reader.result as string).split(',')[1];
          
          // Configurar EmailJS com dados mais completos e anexo
          const templateParams = {
            to_email: this.emailDestino,
            to_name: 'Usuário',
            message: `Resultados do Teste IGT - Saldo Final: $${this.igt.obterSaldoTotal()}`,
            // Dados do anexo CSV - usando formato compatível com EmailJS
            attachment: base64Content,
            filename: fileName,
            // Dados adicionais para o template
            saldo_final: `$${this.igt.obterSaldoTotal()}`,
            total_tentativas: this.igt.obterNumeroTentativas(),
            deck_mais_escolhido: this.getDeckMaisEscolhido(),
            media_tempo: Math.round(this.mediaTempoEscolha()),
            total_ganhos: `$${this.totalGanhos()}`,
            total_taxas: `$${this.totalTaxas()}`,
            data_envio: new Date().toLocaleDateString('pt-BR'),
            // Estatísticas por deck
            deck_a_count: this.getDeckCount('A'),
            deck_b_count: this.getDeckCount('B'),
            deck_c_count: this.getDeckCount('C'),
            deck_d_count: this.getDeckCount('D')
          };

          console.log('Enviando email com anexo:', fileName);
          console.log('Tamanho do anexo:', base64Content.length, 'caracteres');

          // Enviar email usando as configurações centralizadas
          const response = await emailjs.send(
            EMAILJS_CONFIG.SERVICE_ID,
            EMAILJS_CONFIG.TEMPLATE_ID,
            templateParams,
            EMAILJS_CONFIG.USER_ID
          );

          if (response.status === 200) {
            this.mostrarStatus('Resultados enviados com sucesso! Verifique seu email.', true);
            this.emailDestino = '';
          } else {
            this.mostrarStatus('Erro ao enviar email. Tente novamente.', false);
          }
        } catch (error) {
          console.error('Erro ao processar anexo:', error);
          this.mostrarStatus('Erro ao processar anexo CSV. Tente novamente.', false);
        }
      };
      
      reader.onerror = () => {
        console.error('Erro ao ler arquivo CSV');
        this.mostrarStatus('Erro ao processar arquivo CSV. Tente novamente.', false);
        this.enviando = false;
      };
      
      // Ler o arquivo como data URL
      reader.readAsDataURL(csvBlob);
      
    } catch (error) {
      console.error('Erro ao enviar email:', error);
      this.mostrarStatus('Erro ao enviar email. Verifique sua conexão e tente novamente.', false);
      this.enviando = false;
    }
  }

  // Método para baixar CSV diretamente
  baixarCSV(): void {
    try {
      // Gerar CSV
      const csvContent = this.gerarCSV();
      
      // Criar arquivo CSV com nome específico
      const csvBlob = new Blob([csvContent], { 
        type: 'text/csv;charset=utf-8;' 
      });
      
      // Nome do arquivo com timestamp
      const fileName = `resultados_igt_${new Date().toISOString().split('T')[0]}_${Date.now()}.csv`;
      
      // Criar link de download
      const url = window.URL.createObjectURL(csvBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      
      // Adicionar link ao DOM, clicar e remover
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Limpar URL
      window.URL.revokeObjectURL(url);
      
      console.log('CSV baixado com sucesso:', fileName);
    } catch (error) {
      console.error('Erro ao baixar CSV:', error);
      this.mostrarStatus('Erro ao baixar CSV. Tente novamente.', false);
    }
  }

  // Métodos auxiliares para status
  private mostrarStatus(mensagem: string, sucesso: boolean): void {
    this.statusMensagem = mensagem;
    this.statusSucesso = sucesso;
    
    // Limpar status após 5 segundos
    setTimeout(() => {
      this.limparStatus();
    }, 5000);
  }

  private limparStatus(): void {
    this.statusMensagem = '';
    this.statusSucesso = false;
  }
}
