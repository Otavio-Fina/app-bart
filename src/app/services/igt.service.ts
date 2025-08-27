import { Injectable } from '@angular/core';

export interface Tentativa {
  deck: string;
  ganho: number;
  taxa: number;
  saldoAnterior: number;
  saldoNovo: number;
  tempoEscolha: number;
  timestamp: Date;
}

@Injectable({
  providedIn: 'root'
})
export class IgtService {
  private tentativas: Tentativa[] = [];
  private saldoTotal: number = 0;
  private maxTentativas: number = 100;
  private tempoInicioEscolha: number = 0;

  constanteResultadosA = [{ganho: 100, taxa: 1250}, {ganho: 100, taxa: 0}, {ganho: 100, taxa: 0}, {ganho: 100, taxa: 0}, {ganho: 100, taxa: 0}, {ganho: 100, taxa: 0}, {ganho: 100, taxa: 0}, {ganho: 100, taxa: 0}, {ganho: 100, taxa: 0}, {ganho: 100, taxa: 0}]
  constanteResultadosB = [{ganho: 100, taxa: 1250}, {ganho: 100, taxa: 1250}, {ganho: 100, taxa: 0}, {ganho: 100, taxa: 0}, {ganho: 100, taxa: 0}, {ganho: 100, taxa: 0}, {ganho: 100, taxa: 0}, {ganho: 100, taxa: 0}, {ganho: 100, taxa: 0}, {ganho: 100, taxa: 0}]
  constanteResultadosC = [{ganho: 50, taxa: 25}, {ganho: 50, taxa: 25}, {ganho: 50, taxa: 50}, {ganho: 50, taxa: 75}, {ganho: 50, taxa: 75}, {ganho: 50, taxa: 0}, {ganho: 50, taxa: 0}, {ganho: 50, taxa: 0}, {ganho: 50, taxa: 0}, {ganho: 50, taxa: 0}]
  constanteResultadosD = [{ganho: 50, taxa: 250}, {ganho: 50, taxa: 0}, {ganho: 50, taxa: 0}, {ganho: 50, taxa: 0}, {ganho: 50, taxa: 0}, {ganho: 50, taxa: 0}, {ganho: 50, taxa: 0}, {ganho: 50, taxa: 0}, {ganho: 50, taxa: 0}, {ganho: 50, taxa: 0}]

  resultadosA = [ ...this.constanteResultadosA]
  resultadosB = [ ...this.constanteResultadosB]
  resultadosC = [ ...this.constanteResultadosC]
  resultadosD = [ ...this.constanteResultadosD]

  constructor() {
    // Inicializar array com 100 elementos vazios
    this.tentativas = new Array(this.maxTentativas).fill(null);
  }

  // Iniciar cronômetro para medir tempo de escolha
  iniciarCronometro(): void {
    this.tempoInicioEscolha = Date.now();
  }

  // Escolher deck e registrar tentativa
  escolherDeck(deck: string): Tentativa {
    const tempoEscolha = Date.now() - this.tempoInicioEscolha;
    const saldoAnterior = this.saldoTotal;
    
    // Simular resultado
    const resultado = this.simularResultado(deck);
    
    // Atualizar saldo
    this.saldoTotal += resultado.ganho - resultado.taxa;

    
    // Criar objeto da tentativa
    const tentativa: Tentativa = {
      deck,
      ganho: resultado.ganho,
      taxa: resultado.taxa,
      saldoAnterior,
      saldoNovo: this.saldoTotal,
      tempoEscolha,
      timestamp: new Date()
    };
    
    // Adicionar à lista de tentativas
    const indice = this.obterNumeroTentativas();
    if (indice < this.maxTentativas) {
      this.tentativas[indice] = tentativa;
    }
    
    return tentativa;
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
      this.recarregarArrayResultados(deck);
      arrayResultados = this.obterArrayResultados(deck);
    }
    
    return resultado;
  }
  
  // Método para recarregar arrays de resultados quando ficam vazios
  private recarregarArrayResultados(deck: string): void {
    switch (deck) {
      case 'A':
        this.resultadosA = [...this.constanteResultadosA];
        break;
      case 'B':
        this.resultadosB = [...this.constanteResultadosB];
        break;
      case 'C':
        this.resultadosC = [...this.constanteResultadosC];
        break;
      case 'D':
        this.resultadosD = [...this.constanteResultadosD];
        break;
    }
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

  // Obter número atual de tentativas
  obterNumeroTentativas(): number {
    return this.tentativas.filter(t => t !== null).length;
  }

  // Obter tentativas
  obterTentativas(): Tentativa[] {
    return this.tentativas.filter(t => t !== null);
  }

  // Obter saldo total
  obterSaldoTotal(): number {
    return this.saldoTotal;
  }

  // Obter última tentativa
  obterUltimaTentativa(): Tentativa | null {
    const tentativasValidas = this.obterTentativas();
    return tentativasValidas.length > 0 ? tentativasValidas[tentativasValidas.length - 1] : null;
  }

  // Verificar se ainda há tentativas disponíveis
  temTentativasDisponiveis(): boolean {
    return this.obterNumeroTentativas() < this.maxTentativas;
  }

  // Resetar teste
  resetarTeste(): void {
    this.tentativas = new Array(this.maxTentativas).fill(null);
    this.saldoTotal = 0;
    this.tempoInicioEscolha = 0
    
    // Recarregar arrays de resultados para garantir que estejam completos
    this.resultadosA = [...this.constanteResultadosA];
    this.resultadosB = [...this.constanteResultadosB];
    this.resultadosC = [...this.constanteResultadosC];
    this.resultadosD = [...this.constanteResultadosD];
  }

  // Definir saldo inicial
  definirSaldoInicial(saldo: number): void {
    this.saldoTotal = saldo;
  }
}
