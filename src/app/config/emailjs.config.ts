import { environment } from '../../environments/environment';

export const EMAILJS_CONFIG = {
  // Configurações do EmailJS
  // Você precisará substituir esses valores pelos seus próprios IDs
  
  // Service ID - ID do serviço de email (Gmail, Outlook, etc.)
  SERVICE_ID: environment.emailjs.serviceId,
  
  // Template ID - ID do template de email
  TEMPLATE_ID: environment.emailjs.templateId,
  
  // User ID - Seu User ID do EmailJS
  USER_ID: environment.emailjs.userId,
  
  // Configurações adicionais
  TEMPLATE_PARAMS: {
    // Parâmetros padrão do template
    from_name: 'Sistema IGT',
    subject: 'Resultados do Teste IGT'
  }
};

// Função para inicializar o EmailJS
export function initEmailJS(): void {
  // Esta função deve ser chamada no main.ts ou app.config.ts
  // emailjs.init(EMAILJS_CONFIG.USER_ID);
}
