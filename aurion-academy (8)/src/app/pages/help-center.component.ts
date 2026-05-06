import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-help-center',
  standalone: true,
  imports: [MatIconModule, RouterLink],
  template: `
    <div class="min-h-screen bg-slate-50 pt-32 pb-20">
      <div class="section-container">
        <header class="text-center mb-20">
          <div class="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 rounded-full text-indigo-600 text-[10px] font-black uppercase tracking-widest mb-6 border border-indigo-100">
            <mat-icon class="scale-75">help_outline</mat-icon> Soporte Técnico
          </div>
          <h1 class="text-5xl md:text-7xl font-black text-slate-900 mb-8 tracking-tighter leading-none italic">Centro de <span class="bg-indigo-600 text-white px-6 inline-block -rotate-1 rounded-2xl">Ayuda</span></h1>
          <p class="text-xl text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed italic">
            ¿Tienes dudas sobre la plataforma? Aquí encontrarás respuestas a las preguntas más frecuentes de nuestra comunidad.
          </p>
        </header>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          @for (faq of faqs; track faq.q) {
            <div class="bg-white p-10 rounded-[3rem] shadow-xl shadow-slate-200/50 border border-slate-100 group hover:-translate-y-2 transition-all duration-500">
              <div class="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-inner group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <mat-icon>quiz</mat-icon>
              </div>
              <h3 class="text-xl font-black text-slate-900 mb-4 tracking-tight leading-snug">{{ faq.q }}</h3>
              <p class="text-slate-500 font-medium leading-relaxed italic">{{ faq.a }}</p>
            </div>
          }
        </div>

        <div class="mt-20 bg-indigo-950 rounded-[4rem] p-12 md:p-20 text-center relative overflow-hidden">
          <div class="absolute top-0 left-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-[100px]"></div>
          <h2 class="text-3xl md:text-5xl font-black text-white mb-8 tracking-tighter italic relative z-10">¿No encuentras lo que buscas?</h2>
          <p class="text-indigo-200 text-lg mb-12 max-w-xl mx-auto font-medium opacity-80 relative z-10">Nuestro equipo de soporte está disponible de Lunes a Viernes para ayudarte en cada paso.</p>
          <a routerLink="/contact" class="px-10 py-5 bg-white text-indigo-950 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-100 transition-all shadow-xl shadow-indigo-900/20 relative z-10 inline-block">Contactar Soporte</a>
        </div>
      </div>
    </div>
  `
})
export class HelpCenterComponent {
  faqs = [
    { q: '¿Cómo accedo a mis cursos?', a: 'Una vez iniciada sesión, podrás ver todos tus cursos en la sección "Mis Cursos" de tu perfil.' },
    { q: '¿Los certificados tienen costo?', a: 'No, todos los certificados de finalización están incluidos con la inscripción al curso.' },
    { q: '¿Tengo acceso de por vida?', a: 'Sí, una vez inscrito en un curso, el acceso al material es ilimitado y permanente.' },
    { q: '¿Puedo estudiar desde el móvil?', a: 'Nuestra plataforma es totalmente responsiva y puedes acceder desde cualquier dispositivo.' }
  ];
}
