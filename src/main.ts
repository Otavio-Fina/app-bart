import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import emailjs from '@emailjs/browser';
import { EMAILJS_CONFIG } from './app/config/emailjs.config';

// Inicializar EmailJS (substitua os valores no environment.ts)
emailjs.init(EMAILJS_CONFIG.USER_ID);

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
