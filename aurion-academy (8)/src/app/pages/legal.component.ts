import { Component } from '@angular/core';

@Component({
  selector: 'app-legal-layout',
  standalone: true,
  template: `
    <div class="min-h-screen bg-slate-50 pt-32 pb-20">
      <div class="section-container max-w-4xl">
        <div class="bg-white p-12 md:p-20 rounded-[4rem] shadow-xl shadow-slate-200/50 border border-slate-100">
          <ng-content></ng-content>
        </div>
      </div>
    </div>
  `
})
export class LegalLayoutComponent {}

@Component({
  selector: 'app-terms',
  standalone: true,
  imports: [LegalLayoutComponent],
  template: `
    <app-legal-layout>
      <h1 class="text-4xl md:text-5xl font-black text-slate-900 mb-10 tracking-tighter italic">Términos y <span class="text-indigo-600">Condiciones</span></h1>
      <div class="prose prose-slate max-w-none space-y-8 text-slate-600 font-medium italic">
        <p>Bienvenido a nuestra plataforma. Al acceder y utilizar este sitio web, usted acepta cumplir y estar sujeto a los siguientes términos y condiciones de uso.</p>
        
        <h3 class="text-xl font-black text-slate-900 uppercase tracking-tight">1. Uso del Servicio</h3>
        <p>Los servicios prestados a través de esta plataforma están destinados exclusivamente a fines educativos y de formación técnica profesional.</p>
        
        <h3 class="text-xl font-black text-slate-900 uppercase tracking-tight">2. Registro de Usuario</h3>
        <p>Para acceder a ciertos cursos, se requiere la creación de una cuenta. Usted es responsable de mantener la confidencialidad de su información de acceso.</p>
        
        <h3 class="text-xl font-black text-slate-900 uppercase tracking-tight">3. Propiedad Intelectual</h3>
        <p>Todo el contenido, incluyendo videos, textos y materiales gráficos, es propiedad intelectual de la academia y no puede ser distribuido sin autorización previa.</p>
      </div>
    </app-legal-layout>
  `
})
export class TermsComponent {}

@Component({
  selector: 'app-privacy',
  standalone: true,
  imports: [LegalLayoutComponent],
  template: `
    <app-legal-layout>
      <h1 class="text-4xl md:text-5xl font-black text-slate-900 mb-10 tracking-tighter italic">Política de <span class="text-indigo-600">Privacidad</span></h1>
      <div class="prose prose-slate max-w-none space-y-8 text-slate-600 font-medium italic">
        <p>Tu privacidad es fundamental para nosotros. Esta política explica cómo recopilamos, usamos y protegemos tu información personal.</p>
        
        <h3 class="text-xl font-black text-slate-900 uppercase tracking-tight">Recopilación de Datos</h3>
        <p>Recopilamos información necesaria para el registro acadámico, como nombre, correo electrónico y progreso en los cursos.</p>
        
        <h3 class="text-xl font-black text-slate-900 uppercase tracking-tight">Uso de la Información</h3>
        <p>Utilizamos tus datos para mejorar tu experiencia de aprendizaje, emitir certificados y comunicarte novedades relevantes sobre tu formación.</p>
        
        <h3 class="text-xl font-black text-slate-900 uppercase tracking-tight">Seguridad</h3>
        <p>Implementamos medidas de seguridad técnicas y organizativas para proteger tus datos contra accesos no autorizados.</p>
      </div>
    </app-legal-layout>
  `
})
export class PrivacyComponent {}

@Component({
  selector: 'app-cookies',
  standalone: true,
  imports: [LegalLayoutComponent],
  template: `
    <app-legal-layout>
      <h1 class="text-4xl md:text-5xl font-black text-slate-900 mb-10 tracking-tighter italic">Política de <span class="text-indigo-600">Cookies</span></h1>
      <div class="prose prose-slate max-w-none space-y-8 text-slate-600 font-medium italic">
        <p>Utilizamos cookies para asegurar que te brindamos la mejor experiencia en nuestro sitio web.</p>
        
        <h3 class="text-xl font-black text-slate-900 uppercase tracking-tight">¿Qué son las cookies?</h3>
        <p>Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo cuando visitas sitios web para recordar tus preferencias y login.</p>
        
        <h3 class="text-xl font-black text-slate-900 uppercase tracking-tight">Cookies que utilizamos</h3>
        <p>Usamos cookies técnicas operativas para el funcionamiento de la plataforma y cookies analíticas para entender cómo se utiliza el sitio.</p>
      </div>
    </app-legal-layout>
  `
})
export class CookiesComponent {}
