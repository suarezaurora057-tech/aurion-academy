import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AppSettingsService } from '../services/app-settings.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink, MatIconModule],
  template: `
    <footer class="bg-indigo-950 text-slate-300 py-32 relative overflow-hidden">
      <!-- Decoration -->
      <div class="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] -z-0"></div>
      
      <div class="section-container relative z-10">
        <div class="grid grid-cols-1 md:grid-cols-12 gap-16 mb-24">
          <div class="md:col-span-4">
            <a routerLink="/" class="flex items-center gap-3 mb-10 group">
              <div class="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-xl shadow-indigo-900 group-hover:rotate-12 transition-transform">
                <mat-icon>school</mat-icon>
              </div>
              <div class="flex flex-col">
                <span class="text-white font-extrabold text-2xl tracking-tighter leading-none uppercase">{{ settings.siteName() }}</span>
                <span class="text-indigo-400 text-xs font-bold tracking-[0.2em] uppercase opacity-70">Excelencia Técnica</span>
              </div>
            </a>
            <p class="text-slate-400 leading-relaxed mb-10 text-lg font-medium opacity-80">
              Transformando el futuro a través de la educación técnica de vanguardia. Únete a la nueva era del aprendizaje.
            </p>
            <div class="flex gap-4">
              @for (social of [
                { icon: 'facebook', link: '#' },
                { icon: 'alternate_email', link: '#' },
                { icon: 'public', link: '#' }
              ]; track social.icon) {
                <a [href]="social.link" class="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all group">
                  <mat-icon class="group-hover:scale-110 transition-transform">{{ social.icon }}</mat-icon>
                </a>
              }
            </div>
          </div>
          
          <div class="md:col-span-2">
            <h3 class="text-white font-extrabold mb-10 uppercase tracking-widest text-xs">Explorar</h3>
            <ul class="space-y-6">
              <li><a routerLink="/" class="text-sm font-bold hover:text-indigo-400 transition-colors uppercase tracking-wider">Inicio</a></li>
              <li><a routerLink="/courses" class="text-sm font-bold hover:text-indigo-400 transition-colors uppercase tracking-wider">Cursos</a></li>
              <li><a routerLink="/about" class="text-sm font-bold hover:text-indigo-400 transition-colors uppercase tracking-wider">Nosotros</a></li>
              <li><a routerLink="/contact" class="text-sm font-bold hover:text-indigo-400 transition-colors uppercase tracking-wider">Contacto</a></li>
            </ul>
          </div>

          <div class="md:col-span-3">
            <h3 class="text-white font-extrabold mb-10 uppercase tracking-widest text-xs">Soporte</h3>
            <ul class="space-y-6">
              <li><a routerLink="/help" class="text-sm font-bold hover:text-indigo-400 transition-colors uppercase tracking-wider">Centro de Ayuda</a></li>
              <li><a routerLink="/certifications" class="text-sm font-bold hover:text-indigo-400 transition-colors uppercase tracking-wider">Certificaciones</a></li>
              <li><a routerLink="/job-board" class="text-sm font-bold hover:text-indigo-400 transition-colors uppercase tracking-wider">Bolsa de Empleo</a></li>
            </ul>
          </div>

          <div class="md:col-span-3">
            <h3 class="text-white font-extrabold mb-10 uppercase tracking-widest text-xs">Contacto Directo</h3>
            <ul class="space-y-8 text-sm">
              <li class="flex items-start gap-4">
                <div class="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-indigo-400 shrink-0">
                   <mat-icon class="text-xl">place</mat-icon>
                </div>
                <span class="text-slate-400 font-medium leading-tight">{{ settings.contactAddress() }}</span>
              </li>
              <li class="flex items-center gap-4">
                <div class="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-indigo-400 shrink-0">
                   <mat-icon class="text-xl">phone_iphone</mat-icon>
                </div>
                <span class="text-slate-400 font-bold">{{ settings.contactPhone() }}</span>
              </li>
              <li class="flex items-center gap-4">
                <div class="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-indigo-400 shrink-0">
                   <mat-icon class="text-xl">mail</mat-icon>
                </div>
                <span class="text-slate-400 font-bold">{{ settings.contactEmail() }}</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div class="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <p class="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-500">
            &copy; {{ currentYear }} AURION ACADEMY. Todos los derechos reservados.
          </p>
          <div class="flex space-x-10 text-[10px] font-bold uppercase tracking-widest">
            <a routerLink="/terms" class="text-slate-600 hover:text-white transition-colors">Términos</a>
            <a routerLink="/privacy" class="text-slate-600 hover:text-white transition-colors">Privacidad</a>
            <a routerLink="/cookies" class="text-slate-600 hover:text-white transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  `
})
export class FooterComponent {
  settings = inject(AppSettingsService);
  currentYear = new Date().getFullYear();
}
