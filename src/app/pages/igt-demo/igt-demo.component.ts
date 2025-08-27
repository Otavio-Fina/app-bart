import { NgClass, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-igt-demo',
  standalone: true,
  imports: [RouterLink, NgIf, NgClass],
  templateUrl: './igt-demo.component.html',
})
export class IgtDemoComponent implements OnInit {
  // Dados do teste
  saldoTotal: number = 0;
  tentativas: number = 0;
  
  // Estado do teste
  ultimaEscolha: string = '';
  ganho: number = 0;
  taxa: number = 0;
  mostrandoResultado: boolean = false;
  
  // Arrays de resultados para cada deck (cópia dos originais)
  private constanteResultadosA = [{ganho: 100, taxa: 1250}, {ganho: 100, taxa: 0}, {ganho: 100, taxa: 0}, {ganho: 100, taxa: 0}, {ganho: 100, taxa: 0}, {ganho: 100, taxa: 0}, {ganho: 100, taxa: 0}, {ganho: 100, taxa: 0}, {ganho: 100, taxa: 0}, {ganho: 100, taxa: 0}];
  private constanteResultadosB = [{ganho: 100, taxa: 1250}, {ganho: 100, taxa: 1250}, {ganho: 100, taxa: 0}, {ganho: 100, taxa: 0}, {ganho: 100, taxa: 0}, {ganho: 100, taxa: 0}, {ganho: 100, taxa: 0}, {ganho: 100, taxa: 0}, {ganho: 100, taxa: 0}, {ganho: 100, taxa: 0}];
  private constanteResultadosC = [{ganho: 50, taxa: 250}, {ganho: 50, taxa: 0}, {ganho: 50, taxa: 0}, {ganho: 50, taxa: 0}, {ganho: 50, taxa: 0}, {ganho: 50, taxa: 0}, {ganho: 50, taxa: 0}, {ganho: 50, taxa: 0}, {ganho: 50, taxa: 0}, {ganho: 50, taxa: 0}];
  private constanteResultadosD = [{ganho: 50, taxa: 250}, {ganho: 50, taxa: 250}, {ganho: 50, taxa: 0}, {ganho: 50, taxa: 0}, {ganho: 50, taxa: 0}, {ganho: 50, taxa: 0}, {ganho: 50, taxa: 0}, {ganho: 50, taxa: 0}, {ganho: 50, taxa: 0}, {ganho: 50, taxa: 0}];

  private resultadosA = [...this.constanteResultadosA];
  private resultadosB = [...this.constanteResultadosB];
  private resultadosC = [...this.constanteResultadosC];
  private resultadosD = [...this.constanteResultadosD];
  
  constructor() {}
  
  ngOnInit(): void {
    // Limpar variáveis locais do componente
    this.ultimaEscolha = '';
    this.saldoTotal = 0;
    this.tentativas = 0;
    this.ganho = 0;
    this.taxa = 0;
    this.mostrandoResultado = false;
    
    // Recarregar arrays de resultados
    this.recarregarArrayResultados();
  }
  
  // Função para escolher um deck
  escolherDeck(deck: string) {
    // Registrar escolha
    const resultado = this.simularResultado(deck);
    
    // Atualizar dados locais para exibição
    this.ultimaEscolha = deck;
    this.ganho = resultado.ganho;
    this.taxa = resultado.taxa;
    this.mostrandoResultado = true;
    
    // Atualizar saldo e tentativas
    this.saldoTotal += resultado.ganho - resultado.taxa;
    this.tentativas++;
  }
  
  // Função para simular resultado usando arrays específicos de cada deck
  private simularResultado(deck: string): { ganho: number; taxa: number } {
    let arrayResultados: {ganho: number, taxa: number}[] = [];
    
    // Selecionar o array correto baseado no deck
    switch (deck) {
      case 'A':
        arrayResultados = this.resultadosA;
        break;
      case 'B':
        arrayResultados = this.resultadosB;
        break;
      case 'C':
        arrayResultados = this.resultadosC;
        break;
      case 'D':
        arrayResultados = this.resultadosD;
        break;
      default:
        return { ganho: 0, taxa: 0 };
    }
    
    // Escolher um item aleatório do array
    const indiceAleatorio = Math.floor(Math.random() * arrayResultados.length);
    const resultado = arrayResultados[indiceAleatorio];
    
    // Remover o item selecionado do array
    arrayResultados.splice(indiceAleatorio, 1);

    // Se o array estiver vazio, recarregar com os valores constantes
    if (arrayResultados.length === 0) {
      this.recarregarArrayResultados();
      arrayResultados = this.obterArrayResultados(deck);
    }
    
    return resultado;
  }
  
  // Método para recarregar arrays de resultados quando ficam vazios
  private recarregarArrayResultados(): void {
    this.resultadosA = [...this.constanteResultadosA];
    this.resultadosB = [...this.constanteResultadosB];
    this.resultadosC = [...this.constanteResultadosC];
    this.resultadosD = [...this.constanteResultadosD];
  }
  
  // Método auxiliar para obter o array correto de resultados
  private obterArrayResultados(deck: string): {ganho: number, taxa: number}[] {
    switch (deck) {
      case 'A': return this.resultadosA;
      case 'B': return this.resultadosB;
      case 'C': return this.resultadosC;
      case 'D': return this.resultadosD;
      default: return [];
    }
  }
  

}
