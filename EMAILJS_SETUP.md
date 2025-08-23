# Configuração do EmailJS para Envio de Resultados

Este guia explica como configurar o EmailJS para enviar os resultados do teste IGT por email com anexos CSV.

## 📋 Pré-requisitos

1. Conta no [EmailJS](https://www.emailjs.com/) (gratuita para até 200 emails/mês)
2. Conta de email (Gmail, Outlook, etc.)

## 🚀 Passos para Configuração

### 1. Criar Conta no EmailJS

1. Acesse [https://www.emailjs.com/](https://www.emailjs.com/)
2. Clique em "Sign Up" e crie uma conta gratuita
3. Faça login na sua conta

### 2. Configurar Serviço de Email

1. No dashboard, clique em "Email Services"
2. Clique em "Add New Service"
3. Escolha seu provedor de email (Gmail, Outlook, etc.)
4. Siga as instruções de autenticação
5. Anote o **Service ID** gerado

### 3. Criar Template de Email

1. No dashboard, clique em "Email Templates"
2. Clique em "Create New Template"
3. **IMPORTANTE**: Para attachments funcionarem, use este template básico:

```html
<h2>📊 Resultados do Teste IGT</h2>
<p>Olá {{to_name}},</p>
<p>{{message}}</p>

<h3>📎 Anexo Incluído</h3>
<p><strong>Arquivo:</strong> {{filename}}</p>
<p>Este arquivo CSV contém os resultados detalhados do teste.</p>

<p>📧 Este email foi enviado automaticamente pelo Sistema IGT.</p>
```

4. **CRÍTICO**: No template, certifique-se de incluir as variáveis:
   - `{{to_name}}` - Nome do destinatário
   - `{{message}}` - Mensagem principal
   - `{{filename}}` - Nome do arquivo anexado
   - `{{attachment}}` - Conteúdo do anexo (base64)

5. Anote o **Template ID** gerado

### 4. Obter User ID

1. No dashboard, clique em "Account" → "API Keys"
2. Anote o **Public Key** (User ID)

### 5. Configurar o Código

1. Abra o arquivo `src/environments/environment.ts`
2. Substitua os valores pelos seus IDs:

```typescript
export const environment = {
  production: false,
  emailjs: {
    serviceId: 'seu_service_id_aqui',
    templateId: 'seu_template_id_aqui',
    userId: 'seu_user_id_aqui'
  }
};
```

### 6. Verificar Dependências

O projeto já está configurado com `@emailjs/browser` (versão mais recente e estável).

## 🔧 Configurações para Attachments

### Template Compatível com Attachments

Para que os anexos CSV funcionem corretamente, seu template deve:

1. **Incluir a variável `{{attachment}}`** - Esta é a mais importante
2. **Incluir a variável `{{filename}}`** - Para mostrar o nome do arquivo
3. **Ser simples** - Evite CSS complexo que pode interferir

### Exemplo de Template Funcional

```html
<h2>Resultados do Teste IGT</h2>
<p>Olá {{to_name}},</p>
<p>{{message}}</p>

<h3>Anexo CSV</h3>
<p>Arquivo: {{filename}}</p>
<p>Os resultados estão anexados em formato CSV.</p>

<p>Enviado em: {{data_envio}}</p>
```

## 🧪 Testando a Funcionalidade

1. Execute o projeto: `ng serve`
2. Complete um teste IGT
3. Na tela de resultados, insira um email válido
4. Clique em "Enviar Resultados"
5. Verifique se o email foi recebido com o anexo CSV

## ⚠️ Solução de Problemas Comuns

### Anexo não aparece no email

1. **Verifique o template**: Certifique-se de que `{{attachment}}` está incluído
2. **Tamanho do arquivo**: O CSV não deve exceder 10MB
3. **Formato do template**: Use HTML simples, evite CSS complexo

### Erro: "Service not found"
- Verifique se o Service ID está correto
- Confirme se o serviço de email está ativo

### Erro: "Template not found"
- Verifique se o Template ID está correto
- Confirme se o template está publicado

### Erro: "User not found"
- Verifique se o User ID está correto
- Confirme se a conta está ativa

### Email não chega
- Verifique a pasta de spam
- Confirme se o email de destino está correto
- Verifique os logs do console do navegador

## 📊 Estrutura do CSV Gerado

O sistema gera automaticamente um CSV com:

- **Cabeçalho**: Tentativa, Deck, Ganho, Taxa, Saldo Anterior, Saldo Novo, Tempo, Timestamp
- **Dados**: Cada tentativa individual
- **Estatísticas**: Resumo final com totais e médias

## 🆘 Suporte

- **EmailJS**: [support@emailjs.com](mailto:support@emailjs.com)
- **Documentação**: [https://www.emailjs.com/docs/](https://www.emailjs.com/docs/)
- **Comunidade**: [https://github.com/emailjs-com/emailjs-angular](https://github.com/emailjs-com/emailjs-angular)

## 🔄 Atualizações Recentes

- ✅ Migrado para `@emailjs/browser` (versão mais estável)
- ✅ Template simplificado para melhor compatibilidade
- ✅ Sistema de anexos otimizado
- ✅ Tratamento de erros melhorado
