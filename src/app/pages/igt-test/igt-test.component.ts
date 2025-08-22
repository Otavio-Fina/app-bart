import { NgClass, NgIf } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IgtService, Tentativa } from '../../services/igt.service';

@Component({
  selector: 'app-igt-test',
  standalone: true,
  imports: [RouterLink, NgIf, NgClass],
  templateUrl: './igt-test.component.html',
})
export class IgtTestComponent implements OnInit {
  // Dados do teste
  saldoTotal: number = 0;
  tentativas: number = 0;
  maxTentativas: number = 100;
  
  // Estado do teste
  ultimaEscolha: string = '';
  ganho: number = 0;
  taxa: number = 0;
  mostrandoResultado: boolean = false;
  
  constructor(private igtService: IgtService) {}
  
  ngOnInit(): void {
    // Limpar dados da tentativa anterior
    this.igtService.resetarTeste();
    
    // Limpar variáveis locais do componente
    this.ultimaEscolha = '';
    this.saldoTotal = 0;
    this.tentativas = 0;
    this.ganho = 0;
    this.taxa = 0;
    this.mostrandoResultado = false;
    
    // Inicializar com dados da service
    this.atualizarDados();
    
    // Iniciar cronômetro para primeira escolha
    this.igtService.iniciarCronometro();
  }
  
  // Função para escolher um deck
  escolherDeck(deck: string) {
    if (!this.igtService.temTentativasDisponiveis()) return;
    
    // Registrar escolha na service
    const tentativa = this.igtService.escolherDeck(deck);
    
    // Atualizar dados locais para exibição
    this.ultimaEscolha = tentativa.deck;
    this.ganho = tentativa.ganho;
    this.taxa = tentativa.taxa;
    this.mostrandoResultado = true;
    
    // Atualizar dados gerais
    this.atualizarDados();
    
    // Iniciar cronômetro para próxima escolha
    this.igtService.iniciarCronometro();
  }
  
  // Atualizar dados locais com informações da service
  private atualizarDados(): void {
    this.saldoTotal = this.igtService.obterSaldoTotal();
    this.tentativas = this.igtService.obterNumeroTentativas();
  }
  
} 