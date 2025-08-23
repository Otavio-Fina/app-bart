# 🚀 Início Rápido - Funcionalidade de Email

## ⚡ Configuração em 5 Minutos

### 1. Criar conta no EmailJS
- Acesse [emailjs.com](https://www.emailjs.com/)
- Faça signup gratuito
- Anote seu **User ID** (Public Key)

### 2. Configurar Serviço de Email
- Dashboard → Email Services → Add New Service
- Escolha Gmail/Outlook
- Anote o **Service ID**

### 3. Criar Template
- Dashboard → Email Templates → Create New Template
- Use o arquivo `email-template-example.html` como base
- Anote o **Template ID**

### 4. Atualizar Configuração
Edite `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  emailjs: {
    serviceId: 'SEU_SERVICE_ID_AQUI',
    templateId: 'SEU_TEMPLATE_ID_AQUI', 
    userId: 'SEU_USER_ID_AQUI'
  }
};
```

### 5. Ativar EmailJS
Descomente a linha em `src/main.ts`:

```typescript
emailjs.init(EMAILJS_CONFIG.USER_ID);
```

### 6. Testar
- `ng serve`
- Complete um teste IGT
- Envie resultados por email

## 🎯 Pronto! Funcionalidade ativa.

---

**📚 Documentação completa:** `EMAILJS_SETUP.md`
**📧 Template de email:** `email-template-example.html`
