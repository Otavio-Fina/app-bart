# 📎 Configuração de Anexos CSV no EmailJS

## 🎯 Problema Resolvido

Este guia resolve o problema de anexos CSV não aparecendo nos emails enviados pelo EmailJS.

## 🔧 Soluções Implementadas

### 1. **Método de Envio Atualizado**
- ✅ Uso de `FileReader` com `readAsDataURL()`
- ✅ Conversão para base64 otimizada
- ✅ Tratamento de erros robusto
- ✅ Logs para debug

### 2. **Template de Email Otimizado**
- ✅ Suporte a anexos base64
- ✅ Botão de download direto
- ✅ Variáveis compatíveis com EmailJS

## 🚀 Configuração no EmailJS Dashboard

### **Passo 1: Atualizar Template**
1. Acesse [EmailJS Dashboard](https://dashboard.emailjs.com/)
2. Vá em **Email Templates**
3. Edite seu template existente ou crie um novo
4. Use o arquivo `email-template-with-attachment.html` como base

### **Passo 2: Configurar Variáveis do Template**
No seu template, certifique-se de usar estas variáveis:

```html
<!-- Variáveis principais -->
{{to_name}} - Nome do destinatário
{{message}} - Mensagem personalizada
{{filename}} - Nome do arquivo CSV

<!-- Variáveis de estatísticas -->
{{saldo_final}} - Saldo final do teste
{{total_tentativas}} - Total de tentativas
{{deck_mais_escolhido}} - Deck mais escolhido
{{media_tempo}} - Tempo médio de resposta
{{data_envio}} - Data de envio

<!-- Variável do anexo (IMPORTANTE) -->
{{attachment}} - Conteúdo base64 do CSV
```

### **Passo 3: Configurar Anexos**
No EmailJS, os anexos funcionam de duas formas:

#### **Opção A: Anexo Automático (Recomendada)**
- O EmailJS detecta automaticamente variáveis com nomes específicos
- Use `{{attachment}}` para o conteúdo base64
- Use `{{filename}}` para o nome do arquivo

#### **Opção B: Anexo Manual**
Se a opção A não funcionar, configure manualmente:
1. No template, adicione: `{{attachment}}`
2. No código, envie como: `attachment: base64Content`

## 🧪 Testando Anexos

### **1. Verificar Console do Navegador**
Ao enviar email, verifique o console para:
```
Enviando email com anexo: resultados_igt_2024-01-15_1705312345678.csv
Tamanho do anexo: 1234 caracteres
```

### **2. Verificar Email Recebido**
- ✅ Email deve conter o arquivo CSV anexado
- ✅ Nome do arquivo deve aparecer no template
- ✅ Botão de download deve funcionar

## 🔍 Solução de Problemas

### **Problema: CSV não aparece anexado**
**Solução:**
1. Verifique se `{{attachment}}` está no template
2. Confirme se o nome da variável é exato
3. Teste com template simples primeiro

### **Problema: Erro "attachment not found"**
**Solução:**
1. Verifique se o template está publicado
2. Confirme se as variáveis estão corretas
3. Teste o template no EmailJS

### **Problema: Arquivo corrompido**
**Solução:**
1. Verifique o encoding UTF-8
2. Confirme se o CSV está sendo gerado corretamente
3. Teste com arquivo pequeno primeiro

## 📱 Template Alternativo (Simples)

Se o template complexo não funcionar, use este básico:

```html
<h2>Resultados do Teste IGT</h2>
<p>Olá {{to_name}},</p>
<p>{{message}}</p>
<p>Anexo: {{filename}}</p>
<p>Conteúdo do CSV: {{attachment}}</p>
```

## 🎯 Variáveis Disponíveis no Código

O componente envia estas variáveis para o template:

```typescript
const templateParams = {
  to_email: this.emailDestino,
  to_name: 'Usuário',
  message: `Resultados do Teste IGT - Saldo Final: $${this.igt.obterSaldoTotal()}`,
  
  // Anexo CSV
  attachment: base64Content,        // Conteúdo base64
  filename: fileName,               // Nome do arquivo
  
  // Estatísticas
  saldo_final: `$${this.igt.obterSaldoTotal()}`,
  total_tentativas: this.igt.obterNumeroTentativas(),
  deck_mais_escolhido: this.getDeckMaisEscolhido(),
  media_tempo: Math.round(this.mediaTempoEscolha()),
  total_ganhos: `$${this.totalGanhos()}`,
  total_taxas: `$${this.totalTaxas()}`,
  data_envio: new Date().toLocaleDateString('pt-BR'),
  
  // Contadores por deck
  deck_a_count: this.getDeckCount('A'),
  deck_b_count: this.getDeckCount('B'),
  deck_c_count: this.getDeckCount('C'),
  deck_d_count: this.getDeckCount('D')
};
```

## ✅ Checklist de Verificação

- [ ] Template contém `{{attachment}}`
- [ ] Template contém `{{filename}}`
- [ ] Variáveis estão escritas exatamente como no código
- [ ] Template está publicado no EmailJS
- [ ] Console mostra logs de envio
- [ ] Email recebido contém anexo

## 🆘 Suporte Adicional

Se ainda não funcionar:
1. **EmailJS Support**: [support@emailjs.com](mailto:support@emailjs.com)
2. **Documentação**: [https://www.emailjs.com/docs/](https://www.emailjs.com/docs/)
3. **Verificar logs**: Console do navegador e EmailJS Dashboard

---

**🎯 Com essas configurações, o CSV deve aparecer anexado ao email!**
